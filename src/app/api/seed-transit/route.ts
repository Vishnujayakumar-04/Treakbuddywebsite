import { NextResponse } from 'next/server';
import { seedTransitData } from '@/utils/seedTransitData';

export async function GET() {
    try {
        await seedTransitData();
        return NextResponse.json({ success: true, message: 'Transit data re-seeded successfully. Old rentals purged.' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
