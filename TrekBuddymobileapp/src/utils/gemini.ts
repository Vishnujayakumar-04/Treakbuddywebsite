import { getGeminiApiKey } from './storage';
import { getCategoryData, Place } from './api';
import {
  smartOrderPlaces,
  calculateActivityTimings,
  getMealRecommendation,
  estimateTravelTime,
  isPlaceOpen,
} from './tripPlanner';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface AIRecommendation {
  type: 'best_time' | 'nearby_attraction' | 'safety_tip';
  title: string;
  content: string;
  placeName?: string;
  placeId?: string;
}

/**
 * Get weather hint (stubbed for now)
 */
export const getWeatherHint = (): string => {
  // Stubbed weather data - in production, this would call a weather API
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    return 'Morning: Clear skies, 28°C, perfect for outdoor activities';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Afternoon: Partly cloudy, 32°C, bring sunscreen';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Evening: Clear, 26°C, great for sunset views';
  } else {
    return 'Night: Clear, 24°C, pleasant for night walks';
  }
};

/**
 * Generate placeholder recommendation (used when API key is not set)
 */
const generatePlaceholderRecommendation = (
  type: 'best_time' | 'nearby_attraction' | 'safety_tip',
  visitedCategories: string[],
  allPlaces: Place[]
): AIRecommendation => {
  const weatherHint = getWeatherHint();
  const currentHour = new Date().getHours();

  switch (type) {
    case 'best_time': {
      // Find a popular place based on visited categories or use a default
      const preferredCategory = visitedCategories[0] || 'beaches';
      // Note: getCategoryData is now async, but for placeholder we use allPlaces directly
      const suggestedPlace = allPlaces.find(p => p.category === preferredCategory) || allPlaces[0];

      let bestTime = '';
      if (currentHour < 10) {
        bestTime = 'Early morning (6-10 AM) is perfect for visiting';
      } else if (currentHour < 14) {
        bestTime = 'Late morning to early afternoon (10 AM-2 PM) offers great conditions';
      } else if (currentHour < 18) {
        bestTime = 'Afternoon (2-6 PM) is ideal, though it may be warmer';
      } else {
        bestTime = 'Evening (6-9 PM) provides pleasant weather and beautiful views';
      }

      return {
        type,
        title: 'Best Time to Visit',
        content: `${bestTime} ${suggestedPlace?.name || 'popular attractions'} today. ${weatherHint}. The weather is perfect for outdoor exploration.`,
        placeName: suggestedPlace?.name,
        placeId: suggestedPlace?.id,
      };
    }

    case 'nearby_attraction': {
      // Suggest a place based on visited categories using allPlaces (already fetched)
      let suggestedPlace: Place | null = null;

      if (visitedCategories.length > 0) {
        // Find a place from a different category than the most visited one
        const allCategories = ['beaches', 'temples', 'parks', 'nature', 'restaurants', 'hotels', 'pubs', 'shopping', 'photoshoot', 'theatres'];
        const unvisitedCategories = allCategories.filter(cat => !visitedCategories.includes(cat));
        if (unvisitedCategories.length > 0) {
          const randomCategory = unvisitedCategories[Math.floor(Math.random() * unvisitedCategories.length)];
          // Use allPlaces instead of async getCategoryData for placeholder
          const placesInCategory = allPlaces.filter(p => p.category === randomCategory);
          suggestedPlace = placesInCategory[0] || null;
        }
      }

      if (!suggestedPlace) {
        // Default to a highly rated place
        const sortedPlaces = [...allPlaces].sort((a, b) => b.rating - a.rating);
        suggestedPlace = sortedPlaces[0];
      }

      if (!suggestedPlace) {
        return {
          type,
          title: 'Suggested Nearby Attraction',
          content: 'Explore the beautiful beaches and temples of Pondicherry. Perfect for today\'s weather!',
        };
      }

      const descriptionText = typeof suggestedPlace.description === 'string'
        ? suggestedPlace.description
        : suggestedPlace.description?.specialFeatures || 'Great place to visit';

      return {
        type,
        title: 'Suggested Nearby Attraction',
        content: `Based on your interests, we recommend visiting ${suggestedPlace.name}. ${descriptionText.substring(0, 100)}... It's rated ${suggestedPlace.rating} stars and is perfect for today's weather.`,
        placeName: suggestedPlace.name,
        placeId: suggestedPlace.id,
      };
    }

    case 'safety_tip': {
      let tip = '';
      if (currentHour >= 6 && currentHour < 12) {
        tip = 'Morning is the safest time with good visibility. Stay hydrated and wear comfortable shoes.';
      } else if (currentHour >= 12 && currentHour < 18) {
        tip = 'Afternoon can be hot. Use sunscreen, carry water, and take breaks in shaded areas.';
      } else if (currentHour >= 18 && currentHour < 22) {
        tip = 'Evening is pleasant but ensure you have adequate lighting if staying out late.';
      } else {
        tip = 'Night time: Stay in well-lit areas, travel in groups, and keep emergency contacts handy.';
      }

      return {
        type,
        title: 'Safety & Weather Tip',
        content: `${tip} ${weatherHint}. Always carry a water bottle and inform someone about your travel plans.`,
      };
    }
  }
};

/**
 * Generate AI recommendation using Gemini 1.5 Flash
 */
export const generateAIRecommendation = async (
  type: 'best_time' | 'nearby_attraction' | 'safety_tip',
  visitedCategories: string[],
  allPlaces: Place[]
): Promise<AIRecommendation | null> => {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      // Return placeholder when API key is not set
      return generatePlaceholderRecommendation(type, visitedCategories, allPlaces);
    }

    const weatherHint = getWeatherHint();
    const categoryPlacesPromises = visitedCategories.map(cat => getCategoryData(cat));
    const categoryPlacesArrays = await Promise.all(categoryPlacesPromises);
    const visitedPlaces = categoryPlacesArrays
      .flat()
      .slice(0, 10); // Limit to 10 places for context

    let prompt = '';
    let title = '';

    switch (type) {
      case 'best_time':
        title = 'Best Time to Visit';
        prompt = `You are a travel assistant for Pondicherry, India. Based on the following information, suggest the best time to visit a place today.

Weather: ${weatherHint}
User's visited categories: ${visitedCategories.join(', ') || 'None yet'}

Available places in Pondicherry:
${allPlaces.slice(0, 15).map(p => {
          const desc = typeof p.description === 'string' ? p.description : p.description?.specialFeatures || '';
          return `- ${p.name}: ${desc.substring(0, 100)}...`;
        }).join('\n')}

Provide a concise recommendation (2-3 sentences) about the best time to visit a popular place in Pondicherry today, considering the weather and time of day. Be specific about which place and why.`;

        break;

      case 'nearby_attraction':
        title = 'Suggested Nearby Attraction';
        prompt = `You are a travel assistant for Pondicherry, India. Suggest a nearby attraction based on the user's interests.

User's visited categories: ${visitedCategories.join(', ') || 'None yet'}
Weather: ${weatherHint}

Available places in Pondicherry:
${allPlaces.map(p => {
          const desc = typeof p.description === 'string' ? p.description : p.description?.specialFeatures || '';
          return `- ${p.name} (${p.rating}⭐): ${desc.substring(0, 80)}...`;
        }).join('\n')}

Suggest ONE specific nearby attraction that the user might enjoy based on their visited categories. Include:
1. The place name
2. Why it's a good match (1-2 sentences)
3. Brief highlight (1 sentence)

Format: "Place Name: [why it's recommended] [brief highlight]"`;

        break;

      case 'safety_tip':
        title = 'Safety & Weather Tip';
        prompt = `You are a travel assistant for Pondicherry, India. Provide a helpful safety or weather tip for today.

Weather: ${weatherHint}
Current time: ${new Date().toLocaleTimeString()}

Provide a concise safety or weather tip (2-3 sentences) that would be helpful for someone visiting Pondicherry today. Consider the weather conditions and time of day.`;

        break;
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedText) {
      return null;
    }

    // Parse the response for nearby_attraction type
    let placeName: string | undefined;
    let placeId: string | undefined;
    let content = generatedText.trim();

    if (type === 'nearby_attraction') {
      const lines = content.split('\n');
      const firstLine = lines[0];
      if (firstLine.includes(':')) {
        placeName = firstLine.split(':')[0].trim();
        content = lines.slice(1).join('\n').trim() || firstLine.split(':').slice(1).join(':').trim();

        // Try to find matching place
        if (placeName) {
          const matchingPlace = allPlaces.find(
            p => (placeName && p.name.toLowerCase().includes(placeName.toLowerCase())) ||
              (placeName && placeName.toLowerCase().includes(p.name.toLowerCase()))
          );
          if (matchingPlace) {
            placeId = matchingPlace.id;
            placeName = matchingPlace.name;
          }
        }
      }
    }

    return {
      type,
      title,
      content,
      placeName,
      placeId,
    };
  } catch (error) {
    console.error('Error generating AI recommendation:', error);
    return null;
  }
};

/**
 * Generate placeholder full analysis (used when API key is not set)
 */
const generatePlaceholderFullAnalysis = (
  type: 'best_time' | 'nearby_attraction' | 'safety_tip',
  visitedCategories: string[],
  allPlaces: Place[]
): string => {
  const weatherHint = getWeatherHint();
  const currentHour = new Date().getHours();

  switch (type) {
    case 'best_time': {
      const topPlaces = allPlaces.sort((a, b) => b.rating - a.rating).slice(0, 5);
      return `Best Time to Visit Places in Pondicherry Today

Weather Conditions: ${weatherHint}

Based on the current time and weather conditions, here are the best times to visit different types of attractions:

Morning (6 AM - 10 AM): Perfect for outdoor activities like beaches and parks. The weather is cool and pleasant, making it ideal for ${topPlaces[0]?.name || 'beach visits'} and ${topPlaces[1]?.name || 'park walks'}.

Midday (10 AM - 2 PM): Great for indoor attractions like temples and museums. Consider visiting ${topPlaces[2]?.name || 'cultural sites'} during this time to avoid the afternoon heat.

Afternoon (2 PM - 6 PM): Suitable for shopping areas and cafes. The temperature is moderate, perfect for exploring ${topPlaces[3]?.name || 'local markets'}.

Evening (6 PM - 9 PM): Ideal for restaurants, pubs, and sunset views. This is the best time to visit ${topPlaces[4]?.name || 'dining areas'} and enjoy the pleasant evening weather.

Tips: Avoid peak hours (12-2 PM) for outdoor activities. Always check opening hours before visiting.`;
    }

    case 'nearby_attraction': {
      const recommendedPlaces = allPlaces
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5);

      const categoryText = visitedCategories.length > 0
        ? `Based on your interest in ${visitedCategories.join(', ')}, here are some great recommendations:`
        : 'Here are some top-rated attractions in Pondicherry:';

      return `Nearby Attractions in Pondicherry

${categoryText}

1. ${recommendedPlaces[0]?.name || 'Promenade Beach'}
   Rating: ${recommendedPlaces[0]?.rating || 4.5}⭐ | ${recommendedPlaces[0]?.description || 'A beautiful beach destination'}
   Opening: ${recommendedPlaces[0]?.opening || '6 AM - 9 PM'} | Entry: ${recommendedPlaces[0]?.entryFee || 'Free'}
   Best time to visit: Early morning or evening for the best experience.

2. ${recommendedPlaces[1]?.name || 'Sri Aurobindo Ashram'}
   Rating: ${recommendedPlaces[1]?.rating || 4.6}⭐ | ${recommendedPlaces[1]?.description || 'A spiritual destination'}
   Opening: ${recommendedPlaces[1]?.opening || '6 AM - 8 PM'} | Entry: ${recommendedPlaces[1]?.entryFee || 'Free'}
   Best time to visit: Morning hours for peaceful meditation.

3. ${recommendedPlaces[2]?.name || 'Botanical Garden'}
   Rating: ${recommendedPlaces[2]?.rating || 4.5}⭐ | ${recommendedPlaces[2]?.description || 'Beautiful gardens'}
   Opening: ${recommendedPlaces[2]?.opening || '7 AM - 6 PM'} | Entry: ${recommendedPlaces[2]?.entryFee || '₹20'}
   Best time to visit: Morning for pleasant weather and fewer crowds.

Weather: ${weatherHint}
All recommendations consider today's weather conditions for the best experience.`;
    }

    case 'safety_tip': {
      return `Safety & Weather Tips for Pondicherry Today

Current Weather: ${weatherHint}
Time: ${new Date().toLocaleTimeString()}

Weather Safety:
- ${currentHour >= 12 && currentHour < 18 ? 'Afternoon heat is expected. Stay hydrated and avoid prolonged sun exposure.' : 'Weather conditions are favorable. Still, carry water and stay protected.'}
- ${weatherHint.includes('sunny') || weatherHint.includes('Clear') ? 'Sunny conditions: Use sunscreen (SPF 30+), wear a hat, and seek shade during peak hours (12-3 PM).' : 'Moderate weather: Comfortable conditions, but always be prepared for sudden changes.'}

Health Precautions:
- Stay hydrated: Drink at least 2-3 liters of water throughout the day
- Carry a first-aid kit with basic medications
- Keep emergency contact numbers saved on your phone
- If you have any medical conditions, carry necessary medications

Transportation Safety:
- Use registered taxis or ride-sharing services
- Avoid traveling alone late at night
- Keep your belongings secure and be aware of your surroundings
- Share your location with family or friends

General Travel Safety:
- Keep copies of important documents (passport, ID) in a safe place
- Don't display expensive items or large amounts of cash
- Be cautious in crowded areas and watch for pickpockets
- Know the location of the nearest hospital and police station

Emergency Contacts:
- Police: 100
- Medical Emergency: 108
- Fire: 101

Remember: Your safety is the top priority. If you feel uncomfortable or unsafe, trust your instincts and seek help immediately.`;
    }
  }
};

/**
 * Generate full AI analysis for a specific recommendation type
 */
export const generateFullAIAnalysis = async (
  type: 'best_time' | 'nearby_attraction' | 'safety_tip',
  visitedCategories: string[],
  allPlaces: Place[]
): Promise<string | null> => {
  try {
    const apiKey = await getGeminiApiKey();
    if (!apiKey) {
      // Return placeholder when API key is not set
      return generatePlaceholderFullAnalysis(type, visitedCategories, allPlaces);
    }

    const weatherHint = getWeatherHint();
    const categoryPlacesPromises = visitedCategories.map(cat => getCategoryData(cat));
    const categoryPlacesArrays = await Promise.all(categoryPlacesPromises);
    const visitedPlaces = categoryPlacesArrays.flat();

    let prompt = '';

    switch (type) {
      case 'best_time':
        prompt = `You are a travel assistant for Pondicherry, India. Provide a detailed analysis of the best time to visit places today.

Weather: ${weatherHint}
Current time: ${new Date().toLocaleTimeString()}
User's visited categories: ${visitedCategories.join(', ') || 'None yet'}

Available places:
${allPlaces.map(p => `- ${p.name}: ${p.description} (Rating: ${p.rating}⭐, Opening: ${p.opening})`).join('\n')}

Provide a comprehensive analysis (4-5 paragraphs) covering:
1. Best time slots for different types of activities today
2. Weather considerations
3. Specific recommendations for popular places
4. Tips for avoiding crowds
5. General advice for the day`;
        break;

      case 'nearby_attraction':
        prompt = `You are a travel assistant for Pondicherry, India. Provide a detailed analysis of nearby attractions based on user interests.

User's visited categories: ${visitedCategories.join(', ') || 'None yet'}
Weather: ${weatherHint}

All available places in Pondicherry:
${allPlaces.map(p => `- ${p.name} (${p.rating}⭐): ${p.description}\n  Opening: ${p.opening}, Entry: ${p.entryFee}`).join('\n')}

Provide a comprehensive analysis (4-5 paragraphs) covering:
1. Top 3-5 recommended attractions based on user's interests
2. Why each is recommended
3. Best times to visit each
4. How to get there
5. What to expect at each place`;
        break;

      case 'safety_tip':
        prompt = `You are a travel assistant for Pondicherry, India. Provide comprehensive safety and weather tips for today.

Weather: ${weatherHint}
Current time: ${new Date().toLocaleTimeString()}
Date: ${new Date().toLocaleDateString()}

Provide a detailed safety and weather guide (4-5 paragraphs) covering:
1. Current weather conditions and what to expect
2. Safety tips for today's weather
3. Health precautions
4. Transportation safety
5. General travel safety tips for Pondicherry`;
        break;
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.error('Error generating full AI analysis:', error);
    return null;
  }
};

export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
  diningSuggestions: string[];
}

export interface Activity {
  time: string;
  place: string;
  description: string;
  duration: string;
  cost: number;
  mapUrl: string;
  category: string;
  travelTime?: number; // Travel time from previous place in minutes
  distance?: string; // Distance from previous place (optional, for future Google Maps integration)
}

export interface TripItinerary {
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  estimatedCost: number;
  days: DayItinerary[];
  summary: string;
}

/**
 * Generate trip itinerary using Gemini API
 */
export const generateTripItinerary = async (
  startDate: string,
  endDate: string,
  budget: string,
  categories: string[],
  travelMode: string,
  allPlaces: Place[]
): Promise<TripItinerary | null> => {
  // Calculate number of days (defined outside try block for catch block access)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  try {
    const apiKey = await getGeminiApiKey();

    // Get places for selected categories (map food->restaurants, nightlife->pubs)
    const categoryPlacesPromises = categories.map(async cat => {
      // Map UI category names to actual category keys
      const categoryKey = cat === 'food' ? 'restaurants' : cat === 'nightlife' ? 'pubs' : cat;
      return await getCategoryData(categoryKey);
    });
    const categoryPlacesArrays = await Promise.all(categoryPlacesPromises);
    const categoryPlaces = categoryPlacesArrays.flat();

    // If no API key, return placeholder itinerary
    if (!apiKey) {
      return generatePlaceholderItinerary(startDate, endDate, budget, categories, travelMode, totalDays, categoryPlaces);
    }

    const weatherHint = getWeatherHint();
    const budgetNum = Number(budget);

    // Use smart ordering for better itinerary
    const orderedPlaces = smartOrderPlaces(categoryPlaces, 9, travelMode as 'Driving' | 'Walking' | 'Public Transport');

    // Get restaurants for meal recommendations
    const restaurants = categoryPlaces.filter(p =>
      p.category === 'restaurants' ||
      p.name.toLowerCase().includes('restaurant') ||
      p.name.toLowerCase().includes('cafe')
    );

    const prompt = `You are a travel assistant for Pondicherry, India. Create a detailed day-wise itinerary using REAL data.

Trip Details:
- Start Date: ${startDate}
- End Date: ${endDate}
- Duration: ${totalDays} days
- Budget: ₹${budget}
- Interests: ${categories.join(', ')}
- Travel Mode: ${travelMode}
- Weather: ${weatherHint}

Available Places in Pondicherry (with REAL opening hours and locations):
${orderedPlaces.map(p => {
      const isOpen = isPlaceOpen(p, 12, 0); // Check if open at noon
      return `- ${p.name} (${p.rating}⭐): ${p.description}
  Opening Hours: ${p.opening} ${isOpen ? '(Open at noon)' : '(Closed at noon)'}
  Entry Fee: ${p.entryFee}
  Location: ${p.mapUrl}`;
    }).join('\n')}

IMPORTANT: Use REAL opening hours to schedule activities. Consider:
1. Places that open early (6-8 AM) should be scheduled in the morning
2. Places that open late (after 5 PM) should be scheduled in the evening
3. Include travel time between places (${travelMode === 'Driving' ? '15-30 minutes' : travelMode === 'Walking' ? '10-20 minutes' : '20-40 minutes'} average in Pondicherry)
4. Lunch should be scheduled around 12:30 PM - 1:30 PM
5. Dinner should be scheduled around 7:00 PM - 8:30 PM

Available Restaurants for meals:
${restaurants.map(r => `- ${r.name} (${r.rating}⭐): ${r.opening}, ${r.entryFee}`).join('\n')}

Create a comprehensive ${totalDays}-day itinerary with:
1. Day-wise schedule with REAL timings based on opening hours
2. Activities with accurate duration (consider travel time between places)
3. Real Google Maps links for each location
4. Lunch and dinner suggestions based on opening hours
5. Cost breakdown per day using real entry fees
6. Total estimated cost within budget

Format the response as JSON with this structure:
{
  "summary": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "${startDate}",
      "activities": [
        {
          "time": "09:00 AM",
          "place": "Place Name",
          "description": "What to do",
          "duration": "2 hours",
          "cost": 500,
          "mapUrl": "https://maps.google.com/?q=...",
          "category": "beaches"
        }
      ],
      "totalCost": 2000,
      "diningSuggestions": ["Restaurant 1 (Lunch)", "Restaurant 2 (Dinner)"]
    }
  ],
  "estimatedCost": 10000
}

Make sure:
- Total estimated cost is within budget of ₹${budget}
- Activities respect opening hours
- Travel time is included between activities
- Meal times are realistic (lunch 12-2 PM, dinner 7-9 PM)`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedText) {
      return generatePlaceholderItinerary(startDate, endDate, budget, categories, travelMode, totalDays, categoryPlaces);
    }

    // Try to parse JSON from the response
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = generatedText.match(/```json\n([\s\S]*?)\n```/) || generatedText.match(/```\n([\s\S]*?)\n```/);
      const jsonText = jsonMatch ? jsonMatch[1] : generatedText;
      const parsed = JSON.parse(jsonText.trim());

      return {
        startDate,
        endDate,
        totalDays,
        totalBudget: budgetNum,
        estimatedCost: parsed.estimatedCost || budgetNum * 0.8,
        days: parsed.days || [],
        summary: parsed.summary || 'Your personalized trip itinerary for Pondicherry',
      };
    } catch (parseError) {
      console.error('Error parsing itinerary JSON:', parseError);
      // Fallback to placeholder if parsing fails
      return generatePlaceholderItinerary(startDate, endDate, budget, categories, travelMode, totalDays, categoryPlaces);
    }
  } catch (error) {
    console.error('Error generating trip itinerary:', error);
    return generatePlaceholderItinerary(startDate, endDate, budget, categories, travelMode, totalDays, allPlaces);
  }
};

/**
 * Generate placeholder itinerary (used when API key is not set or API fails)
 * Now uses real data: opening hours, travel times, smart ordering
 */
const generatePlaceholderItinerary = (
  startDate: string,
  endDate: string,
  budget: string,
  categories: string[],
  travelMode: string,
  totalDays: number,
  availablePlaces: Place[]
): TripItinerary => {
  const budgetNum = Number(budget);
  const costPerDay = Math.floor(budgetNum / totalDays);

  const days: DayItinerary[] = [];
  const start = new Date(startDate);

  // Get restaurants for meal recommendations
  const restaurants = availablePlaces.filter(p =>
    p.category === 'restaurants' ||
    p.name.toLowerCase().includes('restaurant') ||
    p.name.toLowerCase().includes('cafe')
  );

  // Distribute places across days using smart ordering
  const placesPerDay = Math.max(2, Math.ceil(availablePlaces.length / totalDays));

  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Get places for this day
    const dayPlacesRaw = availablePlaces.slice(i * placesPerDay, (i + 1) * placesPerDay);

    // Use smart ordering based on opening hours and time of day
    const dayPlaces = smartOrderPlaces(dayPlacesRaw, 9, travelMode as 'Driving' | 'Walking' | 'Public Transport');

    // Calculate activity timings with real travel times
    const activitiesWithTimings = calculateActivityTimings(dayPlaces, 9, travelMode as 'Driving' | 'Walking' | 'Public Transport');

    const activities: Activity[] = activitiesWithTimings.map((activity, index) => {
      const place = activity.place;

      // Extract cost from entryFee
      let cost = 0;
      const costMatch = place.entryFee.match(/₹?(\d+)/);
      if (costMatch) {
        cost = parseInt(costMatch[1], 10);
      } else if (place.entryFee.toLowerCase().includes('free')) {
        cost = 0;
      } else {
        // Default cost based on category
        cost = index === 0 ? Math.floor(costPerDay * 0.4) : Math.floor(costPerDay * 0.3);
      }

      // Calculate duration from start and end times
      const duration = calculateDuration(activity.startTime, activity.endTime);

      return {
        time: activity.startTime,
        place: place.name,
        description: (typeof place.description === 'string' ? place.description : place.description?.specialFeatures || '').substring(0, 100),
        duration: duration,
        cost: cost,
        mapUrl: place.mapUrl,
        category: place.category || categories[0] || 'general',
        travelTime: activity.travelTime, // Include travel time from previous place
      };
    });

    // Get meal recommendations based on time of day
    const lunchRecommendation = getMealRecommendation(13, restaurants); // 1 PM for lunch
    const dinnerRecommendation = getMealRecommendation(19, restaurants); // 7 PM for dinner

    const diningSuggestions: string[] = [];
    if (lunchRecommendation.places.length > 0) {
      diningSuggestions.push(`${lunchRecommendation.places[0].name} (Lunch)`);
    }
    if (dinnerRecommendation.places.length > 0) {
      diningSuggestions.push(`${dinnerRecommendation.places[0].name} (Dinner)`);
    }

    // Fallback if no restaurants found
    if (diningSuggestions.length === 0) {
      diningSuggestions.push('Local Restaurant', 'Street Food');
    }

    const dayCost = activities.reduce((sum, a) => sum + a.cost, 0) + Math.floor(costPerDay * 0.3);

    days.push({
      day: i + 1,
      date: dateStr,
      activities,
      totalCost: dayCost,
      diningSuggestions,
    });
  }

  const estimatedCost = days.reduce((sum, d) => sum + d.totalCost, 0);

  return {
    startDate,
    endDate,
    totalDays,
    totalBudget: budgetNum,
    estimatedCost: Math.min(estimatedCost, budgetNum),
    days,
    summary: `A ${totalDays}-day trip to Pondicherry exploring ${categories.join(', ')}. This itinerary includes ${availablePlaces.length} places with real opening hours, travel times, and smart scheduling.`,
  };
};

/**
 * Calculate duration string from start and end times
 */
const calculateDuration = (startTime: string, endTime: string): string => {
  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;

    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0;
    }

    return hour24 * 60 + minutes;
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);
  const durationMinutes = end - start;

  if (durationMinutes < 60) {
    return `${durationMinutes} minutes`;
  } else {
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
  }
};

