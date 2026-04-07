'use server';

import { TripDraft, DailyItinerary } from '@/types/planner';
import { PLACES_DATA } from '@/services/data/places';
import { groqService } from '@/lib/groq';

export async function generateItinerary(draft: TripDraft): Promise<DailyItinerary[]> {
    try {
        const startDate = new Date(draft.startDate);
        const endDate = new Date(draft.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Context: Filter places to user interests & limit to 25 to stay under token limits
        const interestCategories = draft.interests.map(i => i.toLowerCase());
        const relevantPlaces = PLACES_DATA
            .filter(p => {
                const cat = (p.category || '').toLowerCase();
                return interestCategories.some(ic => cat.includes(ic) || ic.includes(cat));
            })
            .slice(0, 20);
        // Add a few more top-rated ones if we have room
        const extraPlaces = PLACES_DATA
            .filter(p => !relevantPlaces.find(r => r.name === p.name))
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 5);
        const selectedPlaces = [...relevantPlaces, ...extraPlaces];

        const placesContext = selectedPlaces.map(p => {
            const desc = (p.description || '').substring(0, 40);
            return `- ${p.name} (${p.category})`;
        }).join('\n');

        const prompt = `
You are an expert Puducherry travel planner. Create a ${days}-day itinerary.

TRIP: ${draft.type}, ${draft.travelers} travelers, ₹${draft.budgetAmount} ${draft.budgetType}, ${draft.pace} pace
DATES: ${draft.startDate} to ${draft.endDate}
INTERESTS: ${draft.interests.join(', ')}
TRANSPORT: ${draft.transport} | STAY: ${draft.stayArea}
KIDS: ${draft.travelingWithKids ? 'Yes' : 'No'} | ELDERLY: ${draft.travelingWithElderly ? 'Yes' : 'No'}

AVAILABLE PLACES:
${placesContext}

OUTPUT: Valid JSON object only. No markdown. The output MUST be a JSON object containing a single key "itinerary" which is an array of days. Schema:
{"itinerary": [{"dayNumber":1,"date":"YYYY-MM-DD","activities":[{"timeSlot":"Morning","timeRange":"06:00 AM - 08:00 AM","placeName":"Name","description":"Short desc","travelTime":"10 mins","tips":"Tip"}],"totalTravelTime":"1 hour","notes":"Summary"}]}
        `;

        // Use Groq Service
        // We use generateJSON which forces the model to output valid JSON
        const text = await groqService.generateJSON(prompt, "You are a helpful travel assistant. You MUST output a valid JSON object only. No markdown ticking block, no preamble.");

        // Clean up markdown code blocks if present
        const jsonString = extractJson(text);

        try {
            const rawParsed = JSON.parse(jsonString);
            const itinerary: DailyItinerary[] = rawParsed.itinerary || rawParsed;

            if (!Array.isArray(itinerary)) {
                throw new Error("AI returned invalid structure (not an array inside 'itinerary' key)");
            }

            // Validate each day has required fields
            for (const day of itinerary) {
                if (!day.dayNumber || !day.activities || !Array.isArray(day.activities)) {
                    throw new Error("Invalid itinerary structure");
                }
            }

            return itinerary;
        } catch (error) {
            console.error("[Planner] JSON Parse Error:", error);
            console.error("[Planner] Raw Text:", text);
            throw new Error("AI returned invalid data format. Please try again.");
        }

    } catch (error) {
        console.error("[Planner] AI Generation Error:", error);
        throw new Error((error as Error).message || "Failed to generate itinerary. Please try again.");
    }
}

function extractJson(text: string): string {
    // Remove markdown code blocks
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Find JSON array
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');

    if (start !== -1 && end !== -1 && end > start) {
        return cleaned.substring(start, end + 1);
    }

    return cleaned.trim();
}
