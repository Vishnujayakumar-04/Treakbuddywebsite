import { NextRequest, NextResponse } from 'next/server';

/**
 * Edge Middleware — guards /admin/* routes before any page JavaScript runs.
 * 
 * Since we use client-side Firebase Auth (not server sessions/cookies), this
 * middleware does a lightweight guard: it checks for a custom session marker
 * cookie that we set on login. The full role-based check still runs client-side
 * via useAdminAuth (defence in depth).
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow the login page through unconditionally
    if (pathname.startsWith('/admin/login')) {
        return NextResponse.next();
    }

    // Allow API routes under /admin prefix (if any)
    if (pathname.startsWith('/api/admin')) {
        return NextResponse.next();
    }

    // Check for admin session marker cookie
    const adminSession = request.cookies.get('admin_session');

    if (!adminSession?.value) {
        // No session cookie — redirect to admin login
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
