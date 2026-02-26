import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'docterz-secret-key-dev'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { phone, otp } = body

        if (!phone || !otp) {
            return NextResponse.json({ message: 'Phone and OTP required' }, { status: 400 })
        }

        // In production: verify OTP from Redis/DB
        // const storedHash = await redis.get(`otp:${phone}`)
        // const isValid = await bcrypt.compare(otp, storedHash)
        // if (!isValid) return NextResponse.json({ message: 'Invalid or expired OTP' }, { status: 401 })
        // await redis.del(`otp:${phone}`)

        // For dev: accept any 6-digit OTP
        if (otp.length !== 6) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 401 })
        }

        // Find or create user by phone
        // In production: lookup user by phone number
        const userId = 'user-phone-' + phone
        const payload = {
            userId,
            phone,
            role: 'CLINIC_ADMIN',
            tenantId: 'tenant-' + phone,
        }

        const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(payload, JWT_SECRET + '-refresh', { expiresIn: '7d' })

        const response = NextResponse.json({
            accessToken,
            user: {
                id: userId,
                phone,
                name: 'Doctor',
                role: 'CLINIC_ADMIN',
                tenantId: 'tenant-' + phone,
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
        return NextResponse.json({ message: 'Verification failed' }, { status: 500 })
    }
}
