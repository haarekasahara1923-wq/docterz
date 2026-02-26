import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't need authentication
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/api/auth/login', '/api/auth/register', '/api/auth/send-otp', '/api/auth/verify-otp']

// Routes that need superadmin
const superAdminRoutes = ['/admin']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Allow public routes
    if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + '?'))) {
        return NextResponse.next()
    }

    // Allow static files and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.startsWith('/images') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // For API routes - check Authorization header
    if (pathname.startsWith('/api/')) {
        const authHeader = request.headers.get('authorization')

        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        // In production: verify JWT token
        // const token = authHeader.substring(7)
        // try {
        //   const payload = jwt.verify(token, process.env.JWT_SECRET!)
        //   // Add tenant context to headers for downstream use
        //   const requestHeaders = new Headers(request.headers)
        //   requestHeaders.set('x-tenant-id', payload.tenantId)
        //   requestHeaders.set('x-user-id', payload.userId)
        //   requestHeaders.set('x-user-role', payload.role)
        //   return NextResponse.next({ request: { headers: requestHeaders } })
        // } catch {
        //   return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
        // }

        return NextResponse.next()
    }

    // For dashboard routes - check if user has token in cookie or header
    // In production this would verify the JWT
    // For now, let client-side handle auth redirect
    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
