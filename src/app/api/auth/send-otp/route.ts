import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { phone } = body

        if (!phone || phone.length !== 10) {
            return NextResponse.json(
                { message: 'Valid 10-digit phone number required' },
                { status: 400 }
            )
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        // In production:
        // 1. Hash OTP and store in DB/Redis with 10min expiry
        // 2. Send via Fast2SMS/MSG91

        // const hashedOtp = await bcrypt.hash(otp, 10)
        // await redis.setex(`otp:${phone}`, 600, hashedOtp)

        // Send SMS (Fast2SMS example):
        // await fetch('https://www.fast2sms.com/dev/bulkV2', {
        //   method: 'POST',
        //   headers: { 'authorization': process.env.SMS_API_KEY! },
        //   body: JSON.stringify({
        //     route: 'otp',
        //     variables_values: otp,
        //     numbers: phone,
        //   })
        // })

        // For development: return OTP in response
        console.log(`OTP for ${phone}: ${otp}`)

        return NextResponse.json({
            message: 'OTP sent successfully',
            // Remove in production:
            devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
        })
    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to send OTP' },
            { status: 500 }
        )
    }
}
