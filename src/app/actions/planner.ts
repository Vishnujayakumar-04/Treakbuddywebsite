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

        // Context: Available Places
        const placesContext = PLACES_DATA.map(p => `- ${p.name} (${p.category}): ${p.description}`).join('\n');

        const prompt = `
        You are an expert travel planner for Puducherry, India.
        Create a detailed ${days}-day itinerary for a ${draft.type} trip.
        
        TRIP DETAILS:
        - Duration: ${days} days (${draft.startDate} to ${draft.endDate})
        - Travelers: ${draft.travelers}
        - Budget: ${draft.budgetType} ${draft.budgetAmount} INR
        - Pace: ${draft.pace}
        - Interests: ${draft.interests.join(', ')}
        - Transport: ${draft.transport}
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
        3. Allocate activities to Morning, Afternoon, and Evening slots.
        4. Consider travel time between places.
        5. Add specific tips based on constraints (e.g., 'Wheelchair accessible', 'Kid-friendly').

        OUTPUT SCHEMA (ONLY OUTPUT THIS JSON, NOTHING ELSE):
        [
            {
                "dayNumber": 1,
                "date": "YYYY-MM-DD",
                "activities": [
                    {
                        "timeSlot": "Morning",
                        "timeRange": "10:00 AM - 01:00 PM",
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

        // Use Groq Service
        // We use generateJSON which forces the model to output valid JSON
        const text = await groqService.generateJSON(prompt, "You are a helpful travel assistant. You MUST output a valid JSON object only. No markdown ticking block, no preamble.");

        // Clean up markdown code blocks if present
        const jsonString = extractJson(text);

        try {
            const itinerary: DailyItinerary[] = JSON.parse(jsonString);

            if (!Array.isArray(itinerary)) {
                throw new Error("AI returned invalid structure (not an array)");
            }

            // Validate each day has required fields
            for (const day of itinerary) {
                if (!day.dayNumber || !day.activities || !Array.isArray(day.activities)) {
                    throw new Error("Invalid itinerary structure");
                }
            }

            return itinerary;
        } catch (error: any) {
            console.error("[Planner] JSON Parse Error:", error);
            console.error("[Planner] Raw Text:", text);
            throw new Error("AI returned invalid data format. Please try again.");
        }

    } catch (error: any) {
        console.error("[Planner] AI Generation Error:", error);
        throw new Error(error.message || "Failed to generate itinerary. Please try again.");
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
