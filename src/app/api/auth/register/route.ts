import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'docterz-secret-key-dev'

// Plan definitions with features
const PLAN_FEATURES: Record<string, {
    displayName: string
    price: string
    patients: string
    features: string[]
}> = {
    BASIC: {
        displayName: 'Basic',
        price: '₹999',
        patients: '100 patients/month',
        features: [
            'Up to 100 patients/month',
            'Appointment scheduling',
            'Basic prescriptions',
            'Payment tracking',
            'Email support',
        ],
    },
    PRO: {
        displayName: 'Pro',
        price: '₹2,499',
        patients: 'Unlimited patients',
        features: [
            'Unlimited patients',
            'AI VoiceRx',
            'Lab referral + commissions',
            'WhatsApp integration',
            'Revenue analytics',
            'Follow-up automation',
            'Priority support',
        ],
    },
    ENTERPRISE: {
        displayName: 'Enterprise',
        price: '₹5,999',
        patients: 'Unlimited patients',
        features: [
            'Everything in Pro',
            'Multi-doctor support',
            'Custom branding',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
        ],
    },
}

// Validate plan string for Prisma enum
function getValidPlan(plan: string): 'BASIC' | 'PRO' | 'ENTERPRISE' {
    const upper = (plan || '').toUpperCase()
    if (upper === 'PRO') return 'PRO'
    if (upper === 'ENTERPRISE') return 'ENTERPRISE'
    return 'BASIC'
}

// Generate slug from clinic name
function generateSlug(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50) + '-' + Date.now().toString(36)
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            clinicName, city, state, phone,
            doctorName, specialty, licenseNumber,
            email, password, confirmPassword,
            selectedPlan,
        } = body

        // Basic validation
        if (!clinicName || !phone || !doctorName || !email || !password) {
            return NextResponse.json(
                { message: 'Please fill all required fields' },
                { status: 400 }
            )
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: 'Passwords do not match' },
                { status: 400 }
            )
        }

        if (password.length < 8) {
            return NextResponse.json(
                { message: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        const emailLower = email.toLowerCase().trim()
        const plan = getValidPlan(selectedPlan)
        const planInfo = PLAN_FEATURES[plan]
        const slug = generateSlug(clinicName)
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // ─── Try to use Prisma (DATABASE_URL must be set) ─────────────────────
        if (process.env.DATABASE_URL) {
            try {
                const { prisma } = await import('@/lib/prisma')

                // Check if email already registered
                const existingUser = await prisma.user.findUnique({
                    where: { email: emailLower },
                })
                if (existingUser) {
                    return NextResponse.json(
                        { message: 'This email is already registered. Please login instead.' },
                        { status: 409 }
                    )
                }

                // Create tenant + user in a transaction
                const result = await prisma.$transaction(async (tx) => {
                    // Create the clinic tenant
                    const tenant = await tx.tenant.create({
                        data: {
                            clinicName,
                            slug,
                            doctorName,
                            city: city || null,
                            state: state || null,
                            phone: phone || null,
                            email: emailLower,
                            isActive: true,
                        },
                    })

                    // Create the doctor user
                    const user = await tx.user.create({
                        data: {
                            tenantId: tenant.id,
                            email: emailLower,
                            phone: phone || null,
                            passwordHash,
                            name: `Dr. ${doctorName}`,
                            role: 'CLINIC_ADMIN',
                            isActive: true,
                        },
                    })

                    // Create subscription (trial)
                    await tx.subscription.create({
                        data: {
                            tenantId: tenant.id,
                            plan: plan as any,
                            status: 'TRIAL',
                            startDate: new Date(),
                            endDate: trialEndDate,
                            trialEndsAt: trialEndDate,
                            amount: 0,
                        },
                    })

                    return { tenant, user }
                })

                console.log(`✅ [DB] New clinic registered: ${clinicName} | Email: ${emailLower} | Plan: ${plan}`)

                // Generate JWT tokens
                const payload = {
                    userId: result.user.id,
                    email: emailLower,
                    role: 'CLINIC_ADMIN',
                    tenantId: result.tenant.id,
                }
                const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
                const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

                const response = NextResponse.json({
                    accessToken,
                    user: {
                        id: result.user.id,
                        email: emailLower,
                        name: result.user.name,
                        role: 'CLINIC_ADMIN',
                        tenantId: result.tenant.id,
                        clinicName,
                        specialty,
                        city,
                        state,
                        isNewUser: true,
                        plan,
                        subscription: {
                            status: 'TRIAL',
                            plan,
                            planDisplayName: planInfo.displayName,
                            features: planInfo.features,
                            trialEndsAt: trialEndDate.toISOString(),
                            daysLeft: 7,
                            price: planInfo.price,
                        },
                    },
                }, { status: 201 })

                response.cookies.set('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60,
                })

                return response
            } catch (dbError: any) {
                console.error('❌ DB registration error:', dbError)
                // Fall through to in-memory fallback
            }
        }

        // ─── Fallback: in-memory store (dev only, no DATABASE_URL) ───────────
        console.warn('⚠️  DATABASE_URL not set — using in-memory store (users lost on restart!)')

        if (!global.registeredUsers) {
            global.registeredUsers = []
        }

        const existingUser = global.registeredUsers.find(u => u.email === emailLower)
        if (existingUser) {
            return NextResponse.json(
                { message: 'This email is already registered. Please login instead.' },
                { status: 409 }
            )
        }

        const tenantId = 'tenant-' + Date.now()
        const userId = 'user-' + Date.now()

        global.registeredUsers.push({
            id: userId,
            email: emailLower,
            passwordHash,
            name: `Dr. ${doctorName}`,
            role: 'CLINIC_ADMIN',
            tenantId,
            clinicName,
            plan,
            isActive: true,
        })

        console.log(`✅ [MEM] New clinic registered: ${clinicName} | Email: ${emailLower} | Plan: ${plan}`)

        const payload = {
            userId,
            email: emailLower,
            role: 'CLINIC_ADMIN' as const,
            tenantId,
        }
        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        const response = NextResponse.json({
            accessToken,
            user: {
                id: userId,
                email: emailLower,
                name: `Dr. ${doctorName}`,
                role: 'CLINIC_ADMIN',
                tenantId,
                clinicName,
                specialty,
                city,
                state,
                isNewUser: true,
                plan,
                subscription: {
                    status: 'TRIAL',
                    plan,
                    planDisplayName: planInfo.displayName,
                    features: planInfo.features,
                    trialEndsAt: trialEndDate.toISOString(),
                    daysLeft: 7,
                    price: planInfo.price,
                },
            },
        }, { status: 201 })

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        })

        return response
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { message: 'Registration failed. Please try again.' },
            { status: 500 }
        )
    }
}

// ─── TypeScript global declaration ─────────────────────────────────────────
declare global {
    var registeredUsers: Array<{
        id: string
        email: string
        passwordHash: string
        name: string
        role: 'CLINIC_ADMIN' | 'SUPER_ADMIN' | 'STAFF'
        tenantId: string
        clinicName: string
        plan: string
        isActive: boolean
    }>
}
