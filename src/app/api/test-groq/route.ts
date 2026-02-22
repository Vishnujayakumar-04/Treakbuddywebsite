import { NextResponse } from 'next/server';
import { groqService } from '@/lib/groq';

export async function GET() {
    try {
        const key1 = process.env.NEXT_PUBLIC_GROQ_API_KEY;
        const key2 = process.env.GROQ_API_KEY;

        let maskedKey = 'NONE';
        const activeKey = key1 || key2 || '';
        if (activeKey) {
            maskedKey = `${activeKey.substring(0, 8)}...${activeKey.substring(activeKey.length - 4)} (Len: ${activeKey.length})`;
        }

        let groqConnected = false;
        let groqError = null;
        try {
            groqConnected = await groqService.checkConnection();
        } catch (e: any) {
            groqError = {
                message: e.message,
                name: e.name,
                status: e.status
            };
        }

        return NextResponse.json({
            status: 'success',
            hasKey: !!activeKey,
            maskedKey,
            envKeysFound: Object.keys(process.env).filter(k => k.includes('GROQ')),
            groqConnected,
            groqError
        });
    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
