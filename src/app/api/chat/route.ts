import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { PLACES_DATA } from '@/services/data/places';

// Server-side Groq client — key stays on the server, never sent to browser
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || '',
});

const PLACES_CONTEXT = PLACES_DATA
    .slice(0, 30)
    .map(p => `- ${p.name} (${p.category} in ${p.location}): ${p.description}. Best time: ${p.bestTime}.`)
    .join('\n');

const SYSTEM_INSTRUCTION = `
You are TrekBuddy AI, an expert local guide for Puducherry (Pondicherry), India.
Your goal is to help tourists plan trips, find places to eat, and understand the culture.

CONTEXT DATA:
${PLACES_CONTEXT}

RULES:
1. Be friendly, concise, and helpful.
2. If asked about Puducherry, use the context data or your general knowledge.
3. If asked about General Knowledge (e.g., "Who is the CM of Telangana?"), answer accurately. Do not refuse.
4. Keep answers under 3-4 sentences unless asked for a detailed list.
5. Formatting: Use **bold** for place names.
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
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 1024,
            stream: true,
        });

        // Return a streaming response
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
    } catch (error: any) {
        console.error('[/api/chat] Error:', error);
        return NextResponse.json(
            { error: 'Failed to get AI response', details: error.message },
            { status: 500 }
        );
    }
}
