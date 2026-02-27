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

// In-memory user store (persists during server session)
// In production: replace with Prisma database lookup
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

// Initialize global store if not exists
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

        // First check built-in users
        let user: any = builtInUsers.find(u => u.email === emailLower)

        // Then check dynamically registered users
        if (!user) {
            user = global.registeredUsers.find(u => u.email === emailLower)
        }

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid email or password. If you just registered, please note that you need to use the same email and password you signed up with.' },
                { status: 401 }
            )
        }

        if (!user.isActive) {
            return NextResponse.json(
                { message: 'This account has been deactivated. Please contact support.' },
                { status: 401 }
            )
        }

        // Verify password
        // For built-in demo users: accept any password >= 4 chars (for easy testing)
        // For registered users: validate against stored hash
        let isValid = false
        const isBuiltIn = builtInUsers.some(u => u.email === emailLower)

        if (isBuiltIn) {
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

        // Generate tokens
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        // Prepare trial info
        const trialEndDate = new Date()
        trialEndDate.setDate(trialEndDate.getDate() + 7)

        const response = NextResponse.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
                clinicName: user.clinicName,
                plan: user.plan || 'BASIC',
                subscription: {
                    status: 'TRIAL',
                    plan: user.plan || 'BASIC',
                    trialEndsAt: trialEndDate.toISOString(),
                    daysLeft: 7,
                }
            },
        })

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
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
