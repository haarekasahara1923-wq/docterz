import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'docterz-secret-key-dev'

// Mock users for development - replace with Prisma in production
const mockUsers = [
    {
        id: 'user-1',
        email: 'doctor@clinic.com',
        passwordHash: '$2b$10$YvQJnXTlqCq5FVCEjX5j8OqhqiA3l0YqbxHvIJLG7X6fqMYJp2.Gy', // password: demo123
        name: 'Dr. Rajesh Sharma',
        role: 'CLINIC_ADMIN' as const,
        tenantId: 'tenant-1',
        isActive: true,
    },
    {
        id: 'admin-1',
        email: 'admin@docterz.in',
        passwordHash: '$2b$10$YvQJnXTlqCq5FVCEjX5j8OqhqiA3l0YqbxHvIJLG7X6fqMYJp2.Gy',
        name: 'Super Admin',
        role: 'SUPER_ADMIN' as const,
        tenantId: null,
        isActive: true,
    },
]

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

        // Find user
        let user = mockUsers.find(u => u.email === email)

        if (!user) {
            // For demo: create a temp user with any email
            return NextResponse.json(
                { message: 'Invalid email or password' },
                { status: 401 }
            )
        }

        // Verify password (for mock, accept any password with length >= 4)
        const isValid = password.length >= 4 // In production: await bcrypt.compare(password, user.passwordHash)

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

        // Set HTTP-only cookie for refresh token
        const response = NextResponse.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                tenantId: user.tenantId,
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
