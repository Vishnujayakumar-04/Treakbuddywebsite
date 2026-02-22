import knowledgeBase from '@/data/puducherry_knowledge.json';

const KEYWORDS_MAP: Record<string, string[]> = {
    'history': ['history', 'independence', 'french', '1947', '1954', 'goubert', 'politics'],
    'geography': ['geography', 'districts', 'karaikal', 'mahe', 'yanam', 'climate', 'weather', 'rain', 'summer', 'winter'],
    'culture': ['culture', 'festival', 'pongal', 'bastille', 'language', 'tamil', 'creole'],
    'food': ['food', 'cuisine', 'dish', 'eat', 'restaurant', 'cafe', 'breakfast', 'dinner', 'lunch', 'croissant', 'biryani'],
    'tourism': ['tourist', 'place', 'visit', 'sightseeing', 'landmark', 'beach', 'ashram', 'auroville', 'temple', 'church', 'mosque', 'museum'],
    'transport': ['transport', 'bus', 'train', 'flight', 'airport', 'taxi', 'auto', 'rent', 'bike']
};

export function getLocalResponse(query: string): string | null {
    const lowerQuery = query.toLowerCase();

    // 0. Check for Greetings & Help (Priority)
    // Using word boundaries to avoid partial matches (e.g., 'ship' matching 'hi')
    const greetings = ['hi', 'hello', 'hey', 'greetings', 'vanakkam', 'namaste'];
    if (greetings.some(g => new RegExp(`\\b${g}\\b`, 'i').test(lowerQuery))) {
        return "Vanakkam! I'm your TrekBuddy AI Guide. I can help you with top beaches, heritage spots, food, or local transport. What would you like to explore?";
    }

    const helpKeywords = ['help', 'options', 'menu', 'start', 'guide'];
    if (helpKeywords.some(h => new RegExp(`\\b${h}\\b`, 'i').test(lowerQuery))) {
        return "I can help you plan your trip! Try asking about:\n• Beaches (Promenade, Paradise)\n• Heritage (White Town, Ashram)\n• Food (Cafes, Biryani)\n• Transport (Bike rental, Buses)";
    }

    // 1. Direct Factual Answers (CM, Governor, Language, Climate)
    if (lowerQuery.includes('cm') || lowerQuery.includes('chief minister')) {
        const cms = knowledgeBase.history_and_politics.chief_ministers || [];
        const currentCM = cms.find(c => c.tenure.toLowerCase().includes('present')) || (cms.length > 0 ? cms[cms.length - 1] : { name: "N/A", tenure: "Unknown" });
        return `The current Chief Minister of Puducherry is ${currentCM.name} (${currentCM.tenure}).`;
    }

    if (lowerQuery.includes('governor') || lowerQuery.includes('lt governor') || lowerQuery.includes('lieutenant')) {
        return `The Lieutenant Governor of Puducherry is responsible for administration. Currently, the role is held by the appointee of the President of India. (${knowledgeBase.history_and_politics.administration.head_of_state})`;
    }

    if (lowerQuery.includes('language') || lowerQuery.includes('speak')) {
        const langs = knowledgeBase.culture.languages || [];
        const tamilLang = langs.find(l => l.includes('Tamil')) || 'Tamil';
        // Extract percentage if available or default
        // Assuming format "Tamil (88%)"
        const tamilMatch = tamilLang.match(/\((\d+%)\)/);
        const percentage = tamilMatch ? tamilMatch[1] : '88%';

        return `The main languages spoken in Puducherry are: ${langs.join(', ')}. Tamil is the most widely spoken (${percentage}), followed by French and English.`;
    }

    if (lowerQuery.includes('weather') || lowerQuery.includes('climate') || lowerQuery.includes('best time')) {
        const climate = knowledgeBase.geography.climate || { best_time_to_visit: "Winter", winter: "Pleasant", summer: "Hot", monsoon: "Rainy" };
        return `The best time to visit Puducherry is ${climate.best_time_to_visit}. \n• Winter (Dec-Feb): ${climate.winter}\n• Summer (Mar-Jun): ${climate.summer}\n• Monsoon (Jul-Nov): ${climate.monsoon}`;
    }

    // 2. Check for specific landmarks (Direct lookup)
    const landmarks = knowledgeBase.tourism.landmarks || [];
    const foundLandmark = landmarks.find(l => lowerQuery.includes(l.name.toLowerCase()));
    if (foundLandmark) {
        return `${foundLandmark.name} (${foundLandmark.type}): ${foundLandmark.desc}`;
    }

    // 3. Check for keywords to route to sections
    for (const [category, keywords] of Object.entries(KEYWORDS_MAP)) {
        if (keywords.some(k => lowerQuery.includes(k))) {
            if (category === 'history') {
                return `Here's a brief history: Puducherry became a Union Territory in 1963 after de facto transfer from France in 1954. The first CM was Edouard Goubert. It has a unique political history involving the 1962 Treaty of Cession.`;
            }
            if (category === 'geography') {
                return `Puducherry has 4 districts: Puducherry, Karaikal, Mahe, and Yanam. The best time to visit is October to March (Winter). Summer can be hot (up to 40°C).`;
            }
            if (category === 'culture') {
                return `Puducherry has a Franco-Tamil culture. Major festivals include Pongal (Jan) and Bastille Day (July 14). Languages spoken are Tamil, English, and French.`;
            }
            if (category === 'food') {
                return `You must try French dishes like Quiche and Croissants, and Tamil dishes like Mutton Biryani. A unique local dish is the 'Puducherry Fish Curry'.`;
            }
            if (category === 'tourism') {
                return `Top places to visit: Promenade Beach, Auroville, Sri Aurobindo Ashram, Paradise Beach, and White Town. Don't miss the Manakula Vinayagar Temple!`;
            }
            if (category === 'transport') {
                return `You can reach by Bus (PRTC), Train (Puducherry Station), or Flight (Bengaluru/Hyderabad connection). Within the city, renting a bike (scooty) is the best option.`;
            }
        }
    }

    return null;
}
