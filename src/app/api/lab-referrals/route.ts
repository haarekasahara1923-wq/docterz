import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
    const tenantId = request.headers.get('x-tenant-id')
    const body = await request.json()

    const {
        patientId, laboratoryId, tests, notes,
        patientName, patientPhone,
    } = body

    if (!laboratoryId || !tests || tests.length === 0) {
        return NextResponse.json(
            { message: 'Laboratory and tests are required' },
            { status: 400 }
        )
    }

    // In production:
    // 1. Fetch lab details from DB
    // 2. Create referral record
    // 3. Send automatic email to lab
    // 4. Create commission record if lab has commission %
    // 5. Create audit log
    // 6. Send WhatsApp to patient (optional)

    // Mock referral
    const referralId = `REF-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`

    // Simulate email sending
    const emailPayload = {
        to: 'lab@example.com', // replace with actual lab email
        subject: `Lab Referral ${referralId} from Dr. Sharma Clinic`,
        body: `
      Dear Lab Team,
      
      We are referring a patient for the following tests:
      
      Patient: ${patientName}
      Phone: ${patientPhone}
      Referral ID: ${referralId}
      Tests Required: ${tests.join(', ')}
      
      Please register the patient and share results.
      
      Regards,
      Dr. Sharma Clinic
    `,
    }

    // In production: await sendEmail(emailPayload)
    console.log('Email would be sent:', emailPayload)

    return NextResponse.json({
        referralId,
        status: 'PENDING',
        emailSent: true,
        message: 'Referral created and email sent to laboratory',
        createdAt: new Date().toISOString(),
    }, { status: 201 })
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tenantId = request.headers.get('x-tenant-id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    return NextResponse.json({
        referrals: [],
        total: 0,
        page,
        limit,
    })
}
