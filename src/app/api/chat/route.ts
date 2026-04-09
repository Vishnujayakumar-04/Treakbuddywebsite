export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { PLACES_DATA } from '@/services/data/places';
import { MASTER_SYSTEM_PROMPT } from '@/lib/prompts';

// Basic in-memory IP Rate Limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute


// Server-side Groq client — key stays on the server, never sent to browser
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const PLACES_CONTEXT = PLACES_DATA
    .slice(0, 30)
    .map(p => `- ${p.name} (${p.category} in ${p.location}): ${p.description}. Best time: ${p.bestTime}.`)
    .join('\n');

const SYSTEM_INSTRUCTION = `${MASTER_SYSTEM_PROMPT}

### CONTEXT DATA (curated examples; not exhaustive)
${PLACES_CONTEXT}
`;

// Quick replies to avoid hitting the API for common queries
const QUICK_REPLIES: Record<string, string> = {
    'beach': "Top beaches in Pondicherry include **Promenade Beach** (perfect for sunrise walks), **Paradise Beach** (ideal for water sports, accessible by boat), **Serenity Beach** (great for surfing), and **Auroville Beach** (quiet and peaceful). Don't miss the rock beach cafes!",
    'restaurants': "For French cuisine, try **Villa Shanti** or **Carte Blanche**. For distinct Tamil flavors, **Maison Perumal** is excellent. **Cafe des Arts** and **Coromandel Cafe** offer great vibes and continental dishes. Don't forget **Baker Street** for croissants!",
    'temple': "**Manakula Vinayagar Temple** is the most famous with a golden chariot. **Sri Aurobindo Ashram** is a major spiritual center. **Vedapureeswarar Temple** and **Varadaraja Perumal Temple** are also historically rich Dravidian temples.",
    'itinerary': "**Day 1**: Explore White Town, visit Sri Aurobindo Ashram, walk along Promenade Beach.\n**Day 2**: Morning trip to Auroville and Matrimandir. Afternoon at Paradise Beach.\n**Day 3**: Visit Manakula Vinayagar Temple, shop at Mission Street, enjoy a sunset beachside dinner.",
    'shop': "Best shopping spots: **Mission Street** for clothes and brands, **Serenity Beach Bazaar** for handicrafts on weekends, and **Auroville Boutiques** for handmade paper, pottery, and organic clothes.",
};

export async function POST(req: NextRequest) {
    try {
        // --- Rate Limit Check ---
        const ip = req.headers.get('x-forwarded-for') ?? 'unknown-ip';
        const now = Date.now();
        const rateData = rateLimitMap.get(ip) ?? { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

        if (now > rateData.resetTime) {
            rateData.count = 1;
            rateData.resetTime = now + RATE_LIMIT_WINDOW_MS;
        } else {
            rateData.count++;
        }
        rateLimitMap.set(ip, rateData);

        if (rateData.count > RATE_LIMIT_MAX) {
            return NextResponse.json(
                { error: 'Rate limit exceeded. Try again in a minute.' },
                { status: 429 }
            );
        }
        // ------------------------

        const { message } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Check quick replies
        const lower = message.toLowerCase();
        for (const [key, reply] of Object.entries(QUICK_REPLIES)) {
            if (lower.includes(key)) {
                return NextResponse.json({ response: reply });
            }
        }

        // Stream response from Groq
        const stream = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                { role: 'user', content: message },
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        });

        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            controller.enqueue(encoder.encode(content));
                        }
                    }
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('[/api/chat] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get AI response', details: (error as Error).message },
            { status: 500 }
        );
    }
}
