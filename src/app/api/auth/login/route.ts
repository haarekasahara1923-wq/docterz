import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'docterz-secret-key-dev'

// Built-in demo/admin accounts that always work
const builtInUsers = [
    {
        id: 'user-1',
        email: 'doctor@clinic.com',
        passwordHash: '$2b$10$YvQJnXTlqCq5FVCEjX5j8OqhqiA3l0YqbxHvIJLG7X6fqMYJp2.Gy', // demo123
        name: 'Dr. Rajesh Sharma',
        role: 'CLINIC_ADMIN' as const,
        tenantId: 'tenant-1',
        clinicName: "Dr. Sharma's Clinic",
        plan: 'PRO',
        isActive: true,
    },
    {
        id: 'admin-1',
        email: 'admin@docterz.in',
        passwordHash: '$2b$10$YvQJnXTlqCq5FVCEjX5j8OqhqiA3l0YqbxHvIJLG7X6fqMYJp2.Gy',
        name: 'Super Admin',
        role: 'SUPER_ADMIN' as const,
        tenantId: null,
        clinicName: 'Docterz Admin',
        plan: 'ENTERPRISE',
        isActive: true,
    },
]

// Global in-memory fallback store (only used when DATABASE_URL is missing)
declare global {
    var registeredUsers: Array<{
        id: string
        email: string
        passwordHash: string
        name: string
        role: 'CLINIC_ADMIN' | 'SUPER_ADMIN' | 'STAFF'
        tenantId: string | null
        clinicName: string
        plan: string
        isActive: boolean
    }>
}

if (!global.registeredUsers) {
    global.registeredUsers = []
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, password } = body

        if (!email || !password) {
            return NextResponse.json(
                { message: 'Email and password are required' },
                { status: 400 }
            )
        }

        const emailLower = email.toLowerCase().trim()
        const isBuiltIn = builtInUsers.some(u => u.email === emailLower)

        // ─── 1. Check built-in demo users ────────────────────────────────────
        let user: any = builtInUsers.find(u => u.email === emailLower)

        // ─── 2. Try Prisma DB lookup ─────────────────────────────────────────
        if (!user && process.env.DATABASE_URL) {
            try {
                const { prisma } = await import('@/lib/prisma')

                const dbUser = await prisma.user.findUnique({
                    where: { email: emailLower },
                    include: {
                        tenant: {
                            include: {
                                subscriptions: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1,
                                },
                            },
                        },
                    },
                })

                if (dbUser) {
                    user = {
                        id: dbUser.id,
                        email: dbUser.email,
                        passwordHash: dbUser.passwordHash,
                        name: dbUser.name,
                        role: dbUser.role,
                        tenantId: dbUser.tenantId,
                        clinicName: dbUser.tenant?.clinicName || '',
                        plan: dbUser.tenant?.subscriptions?.[0]?.plan || 'BASIC',
                        isActive: dbUser.isActive,
                        _fromDb: true,
                        _subscription: dbUser.tenant?.subscriptions?.[0] || null,
                    }

                    // Update last login time
                    await prisma.user.update({
                        where: { id: dbUser.id },
                        data: { lastLoginAt: new Date() },
                    })
                }
            } catch (dbError) {
                console.error('❌ DB lookup error during login:', dbError)
                // Fall through to in-memory check
            }
        }

        // ─── 3. Fallback: in-memory store ─────────────────────────────────────
        if (!user) {
            user = global.registeredUsers.find(u => u.email === emailLower)
        }

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password. If you just registered, please try again.' },
                { status: 401 }
            )
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: 'This account has been deactivated. Please contact support.' },
                { status: 401 }
            )
        }

        // ─── Password verification ─────────────────────────────────────────────
        let isValid = false

        if (isBuiltIn) {
            // Demo users: accept any password >= 4 chars
            isValid = password.length >= 4
        } else {
            isValid = await bcrypt.compare(password, user.passwordHash)
        }

        if (!isValid) {
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // ─── Generate tokens ───────────────────────────────────────────────────
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        // ─── Build subscription info ───────────────────────────────────────────
        const sub = user._subscription
        let trialEndsAt: string
        let daysLeft: number
        let subStatus = 'TRIAL'
        let plan = user.plan || 'BASIC'

        if (sub) {
            trialEndsAt = sub.trialEndsAt?.toISOString() || sub.endDate?.toISOString() || ''
            subStatus = sub.status
            plan = sub.plan
            const end = sub.trialEndsAt ? new Date(sub.trialEndsAt) : new Date(sub.endDate)
            daysLeft = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
        } else {
            const fallback = new Date()
            fallback.setDate(fallback.getDate() + 7)
            trialEndsAt = fallback.toISOString()
            daysLeft = 7
        }

        const response = NextResponse.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
                clinicName: user.clinicName,
                plan,
                subscription: {
                    status: subStatus,
                    plan,
                    trialEndsAt,
                    daysLeft,
                },
            },
        })

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { message: 'An error occurred. Please try again.' },
            { status: 500 }
        )
    }
}
