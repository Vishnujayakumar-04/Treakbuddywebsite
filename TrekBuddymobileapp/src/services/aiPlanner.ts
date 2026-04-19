import { TripDraft, DailyItinerary } from '../types/planner';
import { PLACES_DATA } from '../data/places';

// IMPORTANT: Using hardcoded key for prototype/mobile as env vars are tricky with Expo Go without EAS.
// In production, use EAS Secrets or .env loaded via Babel.
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const MODEL = 'llama-3.3-70b-versatile';

export async function generateItinerary(draft: TripDraft): Promise<DailyItinerary[]> {
    try {


        const startDate = new Date(draft.startDate);
        const endDate = new Date(draft.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        // Context: Available Places
        // Limit context size if needed, but 70b should handle it.
        const placesContext = PLACES_DATA.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n');

        const prompt = `
        You are an expert travel planner for Puducherry, India.
        Create a detailed ${days}-day itinerary for a ${draft.type} trip.
        
        TRIP DETAILS:
        - Duration: ${days} days (${draft.startDate.split('T')[0]} to ${draft.endDate.split('T')[0]})
        - Travelers: ${draft.travelers}
        - Budget: ${draft.budgetType} ${draft.budgetAmount} INR
        - Pace: ${draft.pace}
        - Interests: ${draft.interests.join(', ')}
        - Transport: ${draft.transport || 'Mixed'}
        - Stay Area: ${draft.stayArea}
        
        CONSTRAINTS:
        - Mobility Issues: ${draft.mobilityDetails ? 'Yes' : 'No'}
        - Traveling with Kids: ${draft.travelingWithKids ? 'Yes' : 'No'}
        - Traveling with Elderly: ${draft.travelingWithElderly ? 'Yes' : 'No'}
        - Preferred Start Time: ${draft.preferredStartTime || 'Morning'}
        
        AVAILABLE PLACES (Prioritize these but you can suggest others if highly relevant):
        ${placesContext}

        INSTRUCTIONS:
        1. Generate a valid JSON array of DailyItinerary objects.
        2. Strict JSON format only. No markdown code blocks or extra text.
        3. Create a HIGHLY GRANULAR, hour-by-hour schedule with at least 6-8 distinct events per day.
        4. Standard flow example: Sunrise, Breakfast, Morning Place 1, Morning Place 2, Lunch, Afternoon Place 3, Evening Place 4, Dinner, Nightlife (if any).
        5. In the \`timeSlot\` field, put the category (e.g., "Sunrise", "Breakfast", "Morning Exploration", "Lunch", "Dinner").
        6. In the \`timeRange\` field, put the EXACT hours (e.g., "06:00 AM - 08:00 AM"). The UI will extract the start time from this!
        7. Consider travel time between places.
        8. Add specific tips based on constraints (e.g., 'Wheelchair accessible', 'Kid-friendly').

        OUTPUT SCHEMA (ONLY OUTPUT THIS JSON, NOTHING ELSE):
        [
            {
                "dayNumber": 1,
                "date": "YYYY-MM-DD",
                "activities": [
                    {
                        "timeSlot": "Sunrise",
                        "timeRange": "06:00 AM - 08:00 AM",
                        "placeName": "Name of Place",
                        "description": "Short activity description",
                        "travelTime": "15 mins",
                        "tips": "Optional tip"
                    }
                ],
                "totalTravelTime": "1 hour",
                "notes": "Day summary"
            }
        ]
        `;



        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: "You are a helpful travel assistant. You MUST output a valid JSON object only. No markdown ticking block, no preamble." },
                    { role: 'user', content: prompt }
                ],
                model: MODEL,
                temperature: 0.2, // Lower temperature for JSON reliability
                max_tokens: 4096,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';



        // Parse JSON
        const jsonString = extractJson(content);
        const itinerary: DailyItinerary[] = JSON.parse(jsonString);

        if (!Array.isArray(itinerary)) {
            throw new Error("AI returned invalid structure (not an array)");
        }

        // Validate structure
        for (const day of itinerary) {
            if (!day.dayNumber || !day.activities || !Array.isArray(day.activities)) {
                throw new Error("Invalid itinerary structure");
            }
        }


        return itinerary;

    } catch (error: any) {
        console.error("[Mobile Planner] AI Generation Error:", error);
        throw new Error(error.message || "Failed to generate itinerary. Please try again.");
    }
}

function extractJson(text: string): string {
    // Remove markdown code blocks if any (though response_format: json_object should prevent it)
    let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');

    if (start !== -1 && end !== -1 && end > start) {
        return cleaned.substring(start, end + 1);
    }
    return cleaned.trim();
}
