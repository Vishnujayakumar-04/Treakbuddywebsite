import { NextRequest, NextResponse } from 'next/server';

/**
 * NOTE (SECURITY):
 * This file is NOT a production-grade security boundary.
 *
 * Admin authorization is enforced server-side inside `/api/admin/*` route handlers
 * by verifying the Firebase ID token and checking `users/{uid}.role` in Firestore.
 *
 * This cookie-based redirect is only a UX guard (and may not run unless wired as
 * Next.js middleware). Do not treat it as security.
 */
export function proxy(request: NextRequest) {
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
