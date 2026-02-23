/**
 * chatService.ts
 * 
 * Client-side chat service — delegates all Groq API calls to the
 * server-side /api/chat route so the Groq API key is never exposed
 * to the browser.
 */

// Quick replies for zero-latency common queries (no API call needed)
const QUICK_REPLIES: Record<string, string> = {
    'beach': "Top beaches in Pondicherry include **Promenade Beach** (perfect for sunrise walks), **Paradise Beach** (ideal for water sports), **Serenity Beach** (great for surfing), and **Auroville Beach** (quiet and peaceful).",
    'restaurant': "For French cuisine, try **Villa Shanti** or **Carte Blanche**. For Tamil flavors, **Maison Perumal** is excellent. **Cafe des Arts** and **Baker Street** are also great picks.",
    'food': "For French cuisine, try **Villa Shanti** or **Carte Blanche**. For Tamil flavors, **Maison Perumal** is excellent. **Cafe des Arts** and **Baker Street** are also great picks.",
    'eat': "For French cuisine, try **Villa Shanti** or **Carte Blanche**. For Tamil flavors, **Maison Perumal** is excellent. **Cafe des Arts** and **Baker Street** are also great picks.",
    'temple': "**Manakula Vinayagar Temple** is the most famous with a golden chariot. **Sri Aurobindo Ashram** is a key spiritual center. **Vedapureeswarar Temple** is also historically significant.",
    'itinerary': "**Day 1**: Explore White Town & Promenade Beach.\n**Day 2**: Auroville & Matrimandir, then Paradise Beach.\n**Day 3**: Manakula Temple, Mission Street shopping, beachside dinner.",
    'plan': "**Day 1**: Explore White Town & Promenade Beach.\n**Day 2**: Auroville & Matrimandir, then Paradise Beach.\n**Day 3**: Manakula Temple, Mission Street shopping, beachside dinner.",
    'shop': "**Mission Street** for clothes, **Serenity Beach Bazaar** for handicrafts on weekends, and **Auroville Boutiques** for handmade paper, pottery, and organic products.",
};

function getQuickReply(message: string): string | null {
    const lower = message.toLowerCase();
    for (const [key, reply] of Object.entries(QUICK_REPLIES)) {
        if (lower.includes(key)) return reply;
    }
    return null;
}

/**
 * Non-streaming: get a single AI response string.
 */
export async function getAIResponse(userMessage: string): Promise<string> {
    const quick = getQuickReply(userMessage);
    if (quick) return quick;

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);

        // The API may return streaming or JSON
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const data = await res.json();
            return data.response || data.error || 'No response';
        }

        // Read streamed text fully
        return await res.text();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return `I'm having trouble connecting right now. Try visiting **White Town** for a beautiful evening walk! (${error.message})`;
    }
}

/**
 * Streaming: yields text chunks as they arrive from the server.
 */
export async function* getAIResponseStream(userMessage: string): AsyncGenerator<string> {
    const quick = getQuickReply(userMessage);
    if (quick) { yield quick; return; }

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!res.ok || !res.body) {
            throw new Error(`API error ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            if (chunk) yield chunk;
        }
    } catch (error: any) {
        console.error('Chat Streaming Error:', error);
        yield `I'm having trouble connecting right now. Try visiting **White Town** for a beautiful evening walk! (${error.message})`;
    }
}
