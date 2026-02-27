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
            selectedPlan, // NEW: plan selected by user (BASIC, PRO, ENTERPRISE)
        } = body

        // Validation
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

        // Check if email already registered (in-memory store)
        const existingUser = global.registeredUsers?.find(u => u.email === emailLower)
        if (existingUser) {
            return NextResponse.json(
                { message: 'This email is already registered. Please login instead.' },
                { status: 409 }
            )
        }

        // Determine which plan was selected (default to BASIC if not passed)
        const plan = (selectedPlan && PLAN_FEATURES[selectedPlan.toUpperCase()])
            ? selectedPlan.toUpperCase()
            : 'BASIC'

        const planInfo = PLAN_FEATURES[plan]

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Generate IDs
        const tenantId = 'tenant-' + Date.now()
        const userId = 'user-' + Date.now()
        const slug = generateSlug(clinicName)

        // Save user to in-memory store
        // In production: save to Prisma/Neon DB
        if (!global.registeredUsers) {
            global.registeredUsers = []
        }

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

        console.log(`✅ New clinic registered: ${clinicName} | Email: ${emailLower} | Plan: ${plan}`)
        console.log(`📊 Total registered users: ${global.registeredUsers.length}`)

        // Generate JWT tokens
        const payload = {
            userId,
            email: emailLower,
            role: 'CLINIC_ADMIN',
            tenantId,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        // Trial end date = 7 days from now
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

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
                }
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
