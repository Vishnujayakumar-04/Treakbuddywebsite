'use server';

import { TripDraft, TripItinerary, TripDay } from '@/types/planner';
import { PLACES_DATA } from '@/services/data/places';
import { groqService } from '@/lib/groq';

const TRIP_SYSTEM_PROMPT = `
You are TrekBuddy AI — an expert Puducherry travel planner.
Your job is to generate a COMPLETE, DETAILED, DAY-BY-DAY trip itinerary
for Puducherry, India.

CRITICAL RULES:
1. Every single day MUST follow the EXACT structure below — no exceptions.
2. Every day must have EXACTLY 10–12 activity slots as shown.
3. Never return fewer than 10 slots per day.
4. All times must be realistic and in 12-hour format (e.g., 06:00 AM).
5. Activities must be REAL places, restaurants, or experiences in Puducherry.
6. Meals must be at real Puducherry restaurants or food streets.
7. Always return valid JSON — no extra text, no markdown, no explanation.

MANDATORY DAILY STRUCTURE (follow this order every day):

Slot 1  — 05:30 AM - 06:30 AM  → SUNRISE (beach or viewpoint)
Slot 2  — 07:00 AM - 08:30 AM  → BREAKFAST (restaurant name + dish recommendation)
Slot 3  — 09:00 AM - 11:00 AM  → MORNING PLACE (main attraction)
Slot 4  — 11:30 AM - 01:00 PM  → LATE MORNING PLACE (second attraction)
Slot 5  — 01:00 PM - 02:00 PM  → LUNCH (restaurant name + dish recommendation)
Slot 6  — 02:30 PM - 04:30 PM  → AFTERNOON PLACE (third attraction)
Slot 7  — 04:30 PM - 05:00 PM  → EVENING SNACK (café or street food spot)
Slot 8  — 05:00 PM - 06:30 PM  → SUNSET (beach or promenade)
Slot 9  — 07:00 PM - 08:30 PM  → DINNER (restaurant name + dish recommendation)
Slot 10 — 09:00 PM - 10:00 PM  → NIGHT ACTIVITY (beach walk, night market, or rooftop)
Slot 11 — 10:00 PM             → HOTEL CHECK-IN / RETURN TO STAY

For Day 1 ONLY — add this as the VERY FIRST slot before sunrise:
Slot 0  — HOTEL CHECK-IN (upon arrival, before itinerary begins)

SLOT TYPE VALUES (use exactly these strings):
"hotel_checkin" | "sunrise" | "breakfast" | "place" | "lunch" |
"snack" | "sunset" | "dinner" | "night_activity" | "hotel_return"

RETURN FORMAT — respond ONLY with this JSON structure, nothing else:

{
  "tripTitle": "string — creative trip name",
  "tripSummary": "string — 2 sentence overview of the full trip",
  "totalDays": number,
  "tripType": "Solo" | "Friends" | "Family" | "Couple",
  "budget": "string",
  "accommodation": "string — recommended hotel or stay type in Puducherry",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "dayTheme": "string — e.g. Beaches & Colonial Heritage",
      "estimatedCommute": "string — e.g. 45 minutes total",
      "slots": [
        {
          "slotNumber": 1,
          "type": "hotel_checkin",
          "title": "Hotel Check-In",
          "location": "string — hotel name or area in Puducherry",
          "startTime": "02:00 PM",
          "endTime": "03:00 PM",
          "description": "string — what to do, what to expect",
          "tip": "string — practical tip for this slot",
          "travelToNext": "string — how to get to next slot, e.g. 10 min walk"
        }
      ],
      "daySummary": "string — 1 sentence summary of the day"
    }
  ],
  "packingTips": ["tip1", "tip2", "tip3"],
  "budgetBreakdown": {
    "accommodation": "string — estimated cost per night",
    "food": "string — estimated daily food cost",
    "transport": "string — estimated daily transport cost",
    "activities": "string — estimated activity costs",
    "total": "string — estimated total trip cost"
  }
}
`;

const buildTripUserPrompt = (
    tripType: string,
    days: number,
    travelers: number,
    budget: string,
    interests: string[],
    startDate: string
  ) => `
  Generate a complete ${days}-day Puducherry trip itinerary with the following details:
  
  - Trip Type: ${tripType}
  - Number of Travelers: ${travelers}
  - Total Budget: ₹${budget}
  - Start Date: ${startDate}
  - Interests: ${interests.join(", ")}
  
  REQUIREMENTS:
  - Every day must follow the MANDATORY DAILY STRUCTURE exactly (10–12 slots per day)
  - Day 1 must include Hotel Check-In as the first slot
  - Every day must have: Sunrise → Breakfast → Morning Place → Late Morning Place → Lunch → Afternoon Place → Evening Snack → Sunset → Dinner → Night Activity → Hotel Return
  - Use REAL Puducherry locations for every slot
  - Meals must be at real Puducherry restaurants (e.g., Le Café, Surguru, Satsanga, Baker Street, Café des Arts, Villa Shanti, Surguru, Hot Breads)
  - Sunrise and Sunset must be at real Puducherry spots (Promenade Beach, Paradise Beach, Serenity Beach, Chunnambar Boat House)
  - Vary the places across days — do not repeat the same location on multiple days
  - Budget the itinerary within ₹${budget} total
  - Return ONLY the JSON object — no extra text, no markdown code blocks
`;

export async function generateItinerary(draft: TripDraft): Promise<TripItinerary> {
    try {
        const startDate = new Date(draft.startDate);
        const endDate = new Date(draft.endDate);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const daysCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const userPrompt = buildTripUserPrompt(
            draft.type,
            daysCount,
            draft.travelers,
            draft.budgetAmount.toString(),
            draft.interests,
            draft.startDate
        );

        // We use generateJSON which forces the model to output valid JSON
        const text = await groqService.generateJSON(userPrompt, TRIP_SYSTEM_PROMPT);

        // Clean up markdown code blocks if present
        const jsonString = extractJson(text);

        try {
            const parsedItinerary = JSON.parse(jsonString) as TripItinerary;

            if (!parsedItinerary || !parsedItinerary.days || !Array.isArray(parsedItinerary.days)) {
                throw new Error("AI returned invalid structure (missing 'days' array)");
            }

            return parsedItinerary;
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

    // Find JSON object boundaries (since the prompt now expects a JSON object, not an array natively root)
    const startObj = cleaned.indexOf('{');
    const endObj = cleaned.lastIndexOf('}');

    if (startObj !== -1 && endObj !== -1 && endObj > startObj) {
        return cleaned.substring(startObj, endObj + 1);
    }

    return cleaned.trim();
}
