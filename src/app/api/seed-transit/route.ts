export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { seedTransitData } from '@/utils/seedTransitData';

/**
 * POST /api/seed-transit
 * Protected: requires a Bearer token that will be verified against Firebase Admin.
 * Only admin/superadmin users can trigger a re-seed.
 */
export async function POST(req: NextRequest) {
    try {
        // Lazy-import admin guard so build doesn't fail when Firebase Admin env vars are missing
        const { requireAdmin } = await import('@/lib/server/adminGuard');
        await requireAdmin(req);

        await seedTransitData();
        return NextResponse.json({ success: true, message: 'Transit data re-seeded successfully.' });
    } catch (error) {
        const message = (error as Error).message || 'Unknown error';
        const status = message.includes('Missing Authorization') || message.includes('Forbidden') ? 403 : 500;
        return NextResponse.json({ success: false, error: message }, { status });
    }
}
