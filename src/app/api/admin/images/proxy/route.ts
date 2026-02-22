import { NextRequest, NextResponse } from 'next/server';

/**
 * Image proxy to avoid CORS issues when fetching external images (Pexels, Google)
 * for upload to Firebase Storage.
 * Only accessible server-side — API keys and source URLs are not exposed.
 */
export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url');
    if (!url) return new NextResponse('Missing url param', { status: 400 });

    // Whitelist allowed domains
    const ALLOWED_ORIGINS = [
        'images.pexels.com',
        'places.googleapis.com',
        'maps.googleapis.com',
        'lh3.googleusercontent.com',
        'upload.wikimedia.org',
        'images.unsplash.com',
        'plus.unsplash.com',
        'firebasestorage.googleapis.com',
    ];

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    } catch {
        return new NextResponse('Invalid URL', { status: 400 });
    }

    const isAllowed = ALLOWED_ORIGINS.some(origin => parsedUrl.hostname.endsWith(origin));
    if (!isAllowed) {
        return new NextResponse('Domain not allowed', { status: 403 });
    }

    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'TrekBuddy-Admin/1.0' },
        });
        if (!res.ok) return new NextResponse('Upstream error', { status: res.status });

        const blob = await res.blob();
        const contentType = res.headers.get('content-type') || 'image/jpeg';

        return new NextResponse(blob, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch {
        return new NextResponse('Fetch failed', { status: 502 });
    }
}
