import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const tenantId = request.headers.get('x-tenant-id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || ''

    // In production: fetch from Prisma with tenant isolation
    // const patients = await prisma.patient.findMany({
    //   where: {
    //     tenantId,
    //     ...(search ? {
    //       OR: [
    //         { fullName: { contains: search, mode: 'insensitive' } },
    //         { phone: { contains: search } },
    //         { patientCode: { contains: search, mode: 'insensitive' } },
    //       ]
    //     } : {}),
    //     ...(filter === 'chronic' ? { chronicDiseases: { isEmpty: false } } : {}),
    //   },
    //   include: { _count: { select: { appointments: true } } },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit,
    // })

    // Mock data for development
    return NextResponse.json({
        patients: [],
        total: 0,
        page,
        limit,
    })
}

export async function POST(request: NextRequest) {
    const tenantId = request.headers.get('x-tenant-id')
    const body = await request.json()

    const { fullName, phone, email, age, gender, bloodGroup, address, allergies, chronicDiseases, emergencyContact, notes } = body

    if (!fullName || !phone) {
        return NextResponse.json({ message: 'Name and phone are required' }, { status: 400 })
    }

    // In production:
    // 1. Check for duplicate phone in tenant
    // 2. Generate patient code (P-001, P-002...)
    // 3. Create patient in DB
    // 4. Create audit log
    // const patient = await prisma.patient.create({
    //   data: {
    //     tenantId, fullName, phone, email, age, gender, bloodGroup,
    //     address, allergies, chronicDiseases,
    //     emergencyContact: emergencyContact || undefined,
    //     notes,
    //     patientCode: await generatePatientCode(tenantId),
    //   }
    // })

    const mockPatient = {
        id: 'p-' + Date.now(),
        patientCode: 'P-' + Math.floor(Math.random() * 9000 + 1000),
        fullName, phone, email, age, gender, bloodGroup, address,
        allergies: allergies || [],
        chronicDiseases: chronicDiseases || [],
        emergencyContact, notes,
        tenantId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockPatient, { status: 201 })
}
