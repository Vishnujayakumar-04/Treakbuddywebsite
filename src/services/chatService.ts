
import { PLACES_DATA } from '@/services/data/places';
import { groqService } from '@/lib/groq';

// Simplified Places Data for Context
const PLACES_CONTEXT = PLACES_DATA.map(p =>
    `- ${p.name} (${p.category} in ${p.location}): ${p.description}. Best time: ${p.bestTime}.`
).slice(0, 30).join('\n');

const SYSTEM_INSTRUCTION = `
You are TrekBuddy AI, an expert local guide for Puducherry (Pondicherry), India.
Your goal is to help tourists plan trips, find places to eat, and understand the culture.

CONTEXT DATA:
${PLACES_CONTEXT}

RULES:
1. Be friendly, concise, and helpful.
2. If asked about Puducherry, use the context data or your general knowledge.
3. If asked about **General Knowledge** (e.g., "Who is the CM of Telangana?", "Capital of France"), **ANSWER IT** accurately. Do not refuse to answer.
4. Keep answers under 3-4 sentences unless asked for a detailed list.
5. Formatting: Use **bold** for place names.
`;

const QUICK_REPLIES: Record<string, string> = {
    'beaches': "Top beaches in Pondicherry include **Promenade Beach** (perfect for sunrise walks), **Paradise Beach** (ideal for water sports, accessible by boat), **Serenity Beach** (great for surfing), and **Auroville Beach** (quiet and peaceful). Don't miss the rock beach cafes!",
    'restaurants': "For French cuisine, try **Villa Shanti** or **Carte Blanche**. For distinct Tamil flavors, **Maison Perumal** is excellent. **Cafe des Arts** and **Coromandel Cafe** offer great vibes and continental dishes. Don't forget **Baker Street** for croissants!",
    'temples': "**Manakula Vinayagar Temple** is the most famous, dedicated to Lord Ganesha with a golden chariot. **Sri Aurobindo Ashram** is a spiritual center. **Vedapureeswarar Temple** and **Varadaraja Perumal Temple** are also historically significant Dravidian style temples.",
    'itinerary': "**Day 1**: Explore White Town (French Quarter), visit Sri Aurobindo Ashram, and walk along Promenade Beach in the evening.\n**Day 2**: Morning trip to Auroville and Matrimandir. Afternoon at Paradise Beach.\n**Day 3**: Visit Manakula Vinayagar Temple, shop at Mission Street, and enjoy a sunset dinner at a beachside cafe.",
    'shopping': "Best shopping spots: **Mission Street** for clothes and huge brands, **Serenity Beach Bazaar** for handicrafts on weekends, and **Auroville Boutiques** for handmade paper, pottery, and organic clothes."
};

export async function getAIResponse(userMessage: string): Promise<string> {
    // 1. Check for Quick Replies (Instant Response)
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('beach')) return QUICK_REPLIES['beaches'];
    if (lowerMsg.includes('eat') || lowerMsg.includes('restaurant') || lowerMsg.includes('food')) return QUICK_REPLIES['restaurants'];
    if (lowerMsg.includes('temple')) return QUICK_REPLIES['temples'];
    if (lowerMsg.includes('itinerary') || lowerMsg.includes('plan')) return QUICK_REPLIES['itinerary'];
    if (lowerMsg.includes('shop')) return QUICK_REPLIES['shopping'];

    // 2. Use Groq AI
    try {
        const response = await groqService.generateResponse(userMessage, SYSTEM_INSTRUCTION);
        return response;
    } catch (error: any) {
        console.error("Groq Chat Error:", error);
        return `I'm having trouble connecting to Groq AI. But here's a quick tip: Try visiting **White Town** for a beautiful evening walk! (Error: ${error.message})`;
    }
}

export async function* getAIResponseStream(userMessage: string): AsyncGenerator<string> {
    // 1. Check for Quick Replies (Instant Response)
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('beach')) { yield QUICK_REPLIES['beaches']; return; }
    if (lowerMsg.includes('eat') || lowerMsg.includes('restaurant') || lowerMsg.includes('food')) { yield QUICK_REPLIES['restaurants']; return; }
    if (lowerMsg.includes('temple')) { yield QUICK_REPLIES['temples']; return; }
    if (lowerMsg.includes('itinerary') || lowerMsg.includes('plan')) { yield QUICK_REPLIES['itinerary']; return; }
    if (lowerMsg.includes('shop')) { yield QUICK_REPLIES['shopping']; return; }

    // 2. Use Groq AI with Streaming
    try {
        for await (const chunk of groqService.generateResponseStream(userMessage, SYSTEM_INSTRUCTION)) {
            yield chunk;
        }
    } catch (error: any) {
        console.error("Groq Chat Error:", error);
        yield `I'm having trouble connecting to Groq AI. But here's a quick tip: Try visiting **White Town** for a beautiful evening walk! (Error: ${error.message})`;
    }
}
