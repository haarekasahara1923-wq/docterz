import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'docterz-secret-key-dev'

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

        // In production: Check if email already exists in DB
        // const existing = await prisma.user.findUnique({ where: { email } })
        // if (existing) { return error }

        // In production: Create tenant + user in DB
        // const tenant = await prisma.tenant.create({...})
        // const user = await prisma.user.create({...})
        // Create trial subscription
        // await prisma.subscription.create({...})

        // Mock response for development
        const tenantId = 'tenant-' + Date.now()
        const userId = 'user-' + Date.now()

        const payload = {
            userId,
            email,
            role: 'CLINIC_ADMIN',
            tenantId,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        const response = NextResponse.json({
            accessToken,
            user: {
                id: userId,
                email,
                name: `Dr. ${doctorName}`,
                role: 'CLINIC_ADMIN',
                tenantId,
                clinicName,
                isNewUser: true,
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
