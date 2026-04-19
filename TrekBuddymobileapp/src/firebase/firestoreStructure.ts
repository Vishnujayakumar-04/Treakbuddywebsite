/**
 * Firestore Database Structure for TrekBuddy
 * 
 * This file defines the complete database structure with separate collections
 * for different modules and categories.
 * 
 * Database Structure:
 * 
 * 1. USERS COLLECTION
 *    users/{userId}
 *      - User profile data (name, email, phone, profilePhotoUrl, etc.)
 *      - Subcollections:
 *        - trips/{tripId} - User's saved trips
 *        - favorites/{placeId} - User's favorite places
 *        - history/{historyId} - User's visit history
 *        - chats/{chatId} - AI chatbot conversation history
 * 
 * 2. CATEGORIES COLLECTION
 *    categories/{categoryId}
 *      - Category metadata (name, description, icon, etc.)
 * 
 * 3. PLACES COLLECTIONS (Category-based)
 *    places/beaches/{placeId}
 *    places/parks/{placeId}
 *    places/restaurants/{placeId}
 *    places/pubs/{placeId}
 *    places/shopping/{placeId}
 *    places/photoshoot/{placeId}
 *    places/theatres/{placeId}
 *    places/accommodation/{placeId}
 *    places/nature/{placeId}
 *    places/nightlife/{placeId}
 *    places/adventure/{placeId}
 *    places/transport/{placeId}
 *    places/emergency/{placeId}
 * 
 * 4. RELIGIOUS PLACES COLLECTIONS
 *    places/religious/hindu-temples/{placeId}
 *    places/religious/christian-churches/{placeId}
 *    places/religious/muslim-mosques/{placeId}
 *    places/religious/jain-temples/{placeId}
 *    places/religious/buddhist-temples/{placeId}
 * 
 * 5. TRIP PLANS COLLECTION (Optional - for sharing/public trips)
 *    tripPlans/{tripId}
 *      - Public/shared trip plans
 */

// Main Collections
export const FIRESTORE_COLLECTIONS = {
  // User-related collections
  USERS: 'users',
  USER_TRIPS: 'trips',
  USER_FAVORITES: 'favorites',
  USER_HISTORY: 'history',
  USER_CHATS: 'chats',
  
  // Category and place collections
  CATEGORIES: 'categories',
  PLACES: 'places',
  
  // Category subcollections under places
  PLACES_BEACHES: 'beaches',
  PLACES_PARKS: 'parks',
  PLACES_RESTAURANTS: 'restaurants',
  PLACES_PUBS: 'pubs',
  PLACES_SHOPPING: 'shopping',
  PLACES_PHOTOSHOOT: 'photoshoot',
  PLACES_THEATRES: 'theatres',
  PLACES_ACCOMMODATION: 'accommodation',
  PLACES_NATURE: 'nature',
  PLACES_NIGHTLIFE: 'nightlife',
  PLACES_ADVENTURE: 'adventure',
  PLACES_TRANSPORT: 'transport',
  PLACES_EMERGENCY: 'emergency',
  
  // Religious places subcollections
  PLACES_RELIGIOUS: 'religious',
  PLACES_HINDU_TEMPLES: 'hindu-temples',
  PLACES_CHRISTIAN_CHURCHES: 'christian-churches',
  PLACES_MUSLIM_MOSQUES: 'muslim-mosques',
  PLACES_JAIN_TEMPLES: 'jain-temples',
  PLACES_BUDDHIST_TEMPLES: 'buddhist-temples',
  
  // Optional: Public trip plans
  TRIP_PLANS: 'tripPlans',
} as const;

// Category mapping for easy access
export const CATEGORY_COLLECTION_MAP: { [key: string]: string } = {
  beaches: FIRESTORE_COLLECTIONS.PLACES_BEACHES,
  parks: FIRESTORE_COLLECTIONS.PLACES_PARKS,
  restaurants: FIRESTORE_COLLECTIONS.PLACES_RESTAURANTS,
  pubs: FIRESTORE_COLLECTIONS.PLACES_PUBS,
  shopping: FIRESTORE_COLLECTIONS.PLACES_SHOPPING,
  photoshoot: FIRESTORE_COLLECTIONS.PLACES_PHOTOSHOOT,
  theatres: FIRESTORE_COLLECTIONS.PLACES_THEATRES,
  accommodation: FIRESTORE_COLLECTIONS.PLACES_ACCOMMODATION,
  nature: FIRESTORE_COLLECTIONS.PLACES_NATURE,
  nightlife: FIRESTORE_COLLECTIONS.PLACES_NIGHTLIFE,
  adventure: FIRESTORE_COLLECTIONS.PLACES_ADVENTURE,
  transport: FIRESTORE_COLLECTIONS.PLACES_TRANSPORT,
  emergency: FIRESTORE_COLLECTIONS.PLACES_EMERGENCY,
  'hindu-temples': FIRESTORE_COLLECTIONS.PLACES_HINDU_TEMPLES,
  'christian-churches': FIRESTORE_COLLECTIONS.PLACES_CHRISTIAN_CHURCHES,
  'muslim-mosques': FIRESTORE_COLLECTIONS.PLACES_MUSLIM_MOSQUES,
  'jain-temples': FIRESTORE_COLLECTIONS.PLACES_JAIN_TEMPLES,
  'buddhist-temples': FIRESTORE_COLLECTIONS.PLACES_BUDDHIST_TEMPLES,
};

/**
 * Get the Firestore collection path for a category
 */
export const getCategoryCollectionPath = (category: string): string => {
  const categoryLower = category.toLowerCase();
  const collectionName = CATEGORY_COLLECTION_MAP[categoryLower];
  
  if (!collectionName) {
    throw new Error(`Unknown category: ${category}`);
  }
  
  // Religious categories go under places/religious/{category}
  const religiousCategories = [
    'hindu-temples',
    'christian-churches',
    'muslim-mosques',
    'jain-temples',
    'buddhist-temples',
  ];
  
  if (religiousCategories.includes(categoryLower)) {
    return `${FIRESTORE_COLLECTIONS.PLACES}/${FIRESTORE_COLLECTIONS.PLACES_RELIGIOUS}/${collectionName}`;
  }
  
  // Regular categories go under places/{category}
  return `${FIRESTORE_COLLECTIONS.PLACES}/${collectionName}`;
};

/**
 * Get the user subcollection path
 */
export const getUserSubcollectionPath = (
  userId: string,
  subcollection: 'trips' | 'favorites' | 'history' | 'chats'
): string => {
  const subcollectionMap = {
    trips: FIRESTORE_COLLECTIONS.USER_TRIPS,
    favorites: FIRESTORE_COLLECTIONS.USER_FAVORITES,
    history: FIRESTORE_COLLECTIONS.USER_HISTORY,
    chats: FIRESTORE_COLLECTIONS.USER_CHATS,
  };
  
  return `${FIRESTORE_COLLECTIONS.USERS}/${userId}/${subcollectionMap[subcollection]}`;
};

