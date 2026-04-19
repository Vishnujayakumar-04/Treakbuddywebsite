import { Place } from './api';

/**
 * Parse opening hours string to get open and close times
 * Examples: "7:00 AM - 6:00 PM", "24 Hours", "12:00 PM - 11:00 PM"
 */
export const parseOpeningHours = (opening: string): { isOpen24Hours: boolean; openTime?: number; closeTime?: number } => {
  if (opening.toLowerCase().includes('24 hours') || opening.toLowerCase().includes('24/7')) {
    return { isOpen24Hours: true };
  }

  const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)/gi;
  const matches = opening.match(timeRegex);
  
  if (!matches || matches.length < 2) {
    return { isOpen24Hours: false };
  }

  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(/\s+/);
    const [hours, minutes] = time.split(':').map(Number);
    let hour24 = hours;
    
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (period.toUpperCase() === 'AM' && hours === 12) {
      hour24 = 0;
    }
    
    return hour24 * 60 + minutes; // Convert to minutes since midnight
  };

  const openTime = parseTime(matches[0]);
  const closeTime = parseTime(matches[1]);

  return {
    isOpen24Hours: false,
    openTime,
    closeTime: closeTime < openTime ? closeTime + 24 * 60 : closeTime, // Handle overnight hours
  };
};

/**
 * Check if a place is open at a given time
 */
export const isPlaceOpen = (place: Place, currentHour: number, currentMinute: number = 0): boolean => {
  const { isOpen24Hours, openTime, closeTime } = parseOpeningHours(place.opening);
  
  if (isOpen24Hours) return true;
  if (!openTime || !closeTime) return true; // Default to open if can't parse

  const currentTime = currentHour * 60 + currentMinute;
  
  if (closeTime < openTime) {
    // Overnight hours (e.g., 10 PM - 2 AM)
    return currentTime >= openTime || currentTime <= closeTime;
  } else {
    return currentTime >= openTime && currentTime <= closeTime;
  }
};

/**
 * Estimate travel time between two places (in minutes)
 * Uses simple distance estimation for Pondicherry (small city)
 * In production, this would use Google Maps Distance Matrix API
 */
export const estimateTravelTime = (
  place1: Place,
  place2: Place,
  travelMode: 'Driving' | 'Walking' | 'Public Transport' = 'Driving'
): number => {
  // Simple estimation: Pondicherry is roughly 10km x 10km
  // Average speed: Driving = 30 km/h, Walking = 5 km/h, Public Transport = 20 km/h
  // For now, return a fixed estimate based on travel mode
  // In production, use Google Maps API for accurate distances
  
  const speeds = {
    Driving: 30, // km/h
    Walking: 5,
    'Public Transport': 20,
  };

  // Estimate distance (in km) - simplified
  // In real implementation, extract coordinates from mapUrl or use geocoding
  const estimatedDistance = 3; // Average distance between places in Pondicherry (km)
  const speed = speeds[travelMode] || 30;
  
  return Math.ceil((estimatedDistance / speed) * 60); // Convert to minutes
};

/**
 * Get meal recommendation based on time of day
 */
export const getMealRecommendation = (
  hour: number,
  restaurants: Place[]
): { type: 'breakfast' | 'lunch' | 'dinner' | 'snack'; places: Place[] } => {
  let mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  if (hour >= 6 && hour < 10) {
    mealType = 'breakfast';
  } else if (hour >= 10 && hour < 15) {
    mealType = 'lunch';
  } else if (hour >= 15 && hour < 18) {
    mealType = 'snack';
  } else {
    mealType = 'dinner';
  }

  // Filter restaurants that are open and sort by rating
  const openRestaurants = restaurants
    .filter(rest => isPlaceOpen(rest, hour))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3); // Top 3 recommendations

  return {
    type: mealType,
    places: openRestaurants,
  };
};

/**
 * Smart ordering of places based on:
 * 1. Opening hours (prioritize places that are open)
 * 2. Location proximity (group nearby places)
 * 3. Time of day (morning activities first, evening activities later)
 * 4. Rating (prefer higher rated places)
 */
export const smartOrderPlaces = (
  places: Place[],
  startHour: number = 9,
  travelMode: 'Driving' | 'Walking' | 'Public Transport' = 'Driving'
): Place[] => {
  if (places.length === 0) return [];

  // Separate places by time preference
  const morningPlaces: Place[] = [];
  const afternoonPlaces: Place[] = [];
  const eveningPlaces: Place[] = [];
  const anyTimePlaces: Place[] = [];

  places.forEach(place => {
    const { isOpen24Hours, openTime, closeTime } = parseOpeningHours(place.opening);
    
    if (isOpen24Hours) {
      anyTimePlaces.push(place);
      return;
    }

    if (!openTime || !closeTime) {
      anyTimePlaces.push(place);
      return;
    }

    // Convert to hour (0-23)
    const openHour = Math.floor(openTime / 60);
    const closeHour = Math.floor(closeTime / 60);

    // Categorize by typical opening times
    if (openHour <= 8 && closeHour <= 14) {
      // Morning places (temples, parks that close early)
      morningPlaces.push(place);
    } else if (openHour >= 14 && closeHour <= 20) {
      // Afternoon places
      afternoonPlaces.push(place);
    } else if (openHour >= 17 || closeHour >= 20) {
      // Evening places (restaurants, pubs)
      eveningPlaces.push(place);
    } else {
      anyTimePlaces.push(place);
    }
  });

  // Sort each category by rating
  const sortByRating = (a: Place, b: Place) => b.rating - a.rating;
  morningPlaces.sort(sortByRating);
  afternoonPlaces.sort(sortByRating);
  eveningPlaces.sort(sortByRating);
  anyTimePlaces.sort(sortByRating);

  // Combine: morning -> afternoon -> evening -> any time
  return [...morningPlaces, ...afternoonPlaces, ...eveningPlaces, ...anyTimePlaces];
};

/**
 * Calculate optimal time slots for activities
 */
export const calculateActivityTimings = (
  places: Place[],
  startHour: number = 9,
  travelMode: 'Driving' | 'Walking' | 'Public Transport' = 'Driving'
): Array<{ place: Place; startTime: string; endTime: string; travelTime: number }> => {
  const orderedPlaces = smartOrderPlaces(places, startHour, travelMode);
  const activities: Array<{ place: Place; startTime: string; endTime: string; travelTime: number }> = [];
  
  let currentHour = startHour;
  let currentMinute = 0;

  for (let i = 0; i < orderedPlaces.length; i++) {
    const place = orderedPlaces[i];
    
    // Calculate travel time from previous place
    const travelTime = i > 0 
      ? estimateTravelTime(orderedPlaces[i - 1], place, travelMode)
      : 0;
    
    // Add travel time
    currentMinute += travelTime;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }

    // Check if place is open
    if (!isPlaceOpen(place, currentHour, currentMinute)) {
      // Skip to when it opens
      const { openTime } = parseOpeningHours(place.opening);
      if (openTime) {
        currentHour = Math.floor(openTime / 60);
        currentMinute = openTime % 60;
      }
    }

    const startTime = formatTime(currentHour, currentMinute);
    
    // Estimate duration based on place type
    const duration = estimateActivityDuration(place);
    currentMinute += duration;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }

    const endTime = formatTime(currentHour, currentMinute);
    
    activities.push({
      place,
      startTime,
      endTime,
      travelTime,
    });
  }

  return activities;
};

/**
 * Estimate activity duration based on place category
 */
const estimateActivityDuration = (place: Place): number => {
  const category = place.category?.toLowerCase() || '';
  
  // Duration in minutes
  const durations: { [key: string]: number } = {
    beaches: 120, // 2 hours
    temples: 60, // 1 hour
    parks: 90, // 1.5 hours
    restaurants: 90, // 1.5 hours
    pubs: 180, // 3 hours
    shopping: 120, // 2 hours
    photoshoot: 60, // 1 hour
    theatres: 180, // 3 hours
    hotels: 0, // Not an activity
  };

  return durations[category] || 90; // Default 1.5 hours
};

/**
 * Format time as "HH:MM AM/PM"
 */
const formatTime = (hour: number, minute: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const minuteStr = minute.toString().padStart(2, '0');
  return `${hour12}:${minuteStr} ${period}`;
};

/**
 * Extract coordinates from mapUrl (if available)
 * For Google Maps URLs like: https://maps.google.com/?q=Place+Name
 */
export const extractLocationFromMapUrl = (mapUrl: string): { lat?: number; lng?: number } => {
  // Try to extract coordinates from URL
  const coordMatch = mapUrl.match(/[?&]q=([^&]+)/);
  if (coordMatch) {
    // In production, use geocoding API to convert place name to coordinates
    // For now, return empty
  }
  return {};
};

