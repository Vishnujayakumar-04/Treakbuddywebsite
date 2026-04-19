import AsyncStorage from '@react-native-async-storage/async-storage';
import { TripItinerary } from './gemini';
import { Place } from './api';
import { getCurrentUser } from './auth';
import * as FirestoreService from './firestore';
import { firebaseApp } from '../firebase/firebaseConfig';

const STORAGE_KEYS = {
  GEMINI_API_KEY: '@trekbuddy:gemini_api_key',
  VISITED_CATEGORIES: '@trekbuddy:visited_categories',
  TRIPS: '@trekbuddy:trips',
  FAVORITES: '@trekbuddy:favorites',
  THEME: '@trekbuddy:theme',
  LANGUAGE: '@trekbuddy:language',
};

// Interfaces for stored data
export interface StoredTrip {
  id: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelMode: string;
  categories: string[];
  itinerary: TripItinerary;
  createdAt: string;
}

export interface StoredFavorite {
  placeId: string;
  place: Place;
  addedAt: string;
}

/**
 * Save Gemini API key to AsyncStorage
 */
export const saveGeminiApiKey = async (apiKey: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);
  } catch (error) {
    console.error('Error saving API key:', error);
    throw error;
  }
};

/**
 * Get Gemini API key from AsyncStorage
 */
export const getGeminiApiKey = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  } catch (error) {
    console.error('Error getting API key:', error);
    return null;
  }
};

/**
 * Save visited category to track user preferences
 */
export const addVisitedCategory = async (category: string): Promise<void> => {
  try {
    const existing = await getVisitedCategories();
    const updated = [...new Set([...existing, category])];
    await AsyncStorage.setItem(STORAGE_KEYS.VISITED_CATEGORIES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving visited category:', error);
  }
};

/**
 * Get all visited categories
 */
export const getVisitedCategories = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.VISITED_CATEGORIES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting visited categories:', error);
    return [];
  }
};

/**
 * Clear all visited categories
 */
export const clearVisitedCategories = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.VISITED_CATEGORIES);
  } catch (error) {
    console.error('Error clearing visited categories:', error);
  }
};

// ==================== TRIP STORAGE ====================

/**
 * Save trip itinerary to AsyncStorage and sync to Firestore if authenticated
 */
export const saveTrip = async (trip: StoredTrip): Promise<void> => {
  try {
    // Always save to AsyncStorage for local cache
    const existingTrips = await loadTrips();
    const updatedTrips = [...existingTrips, trip];
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));

    // Sync to Firestore if user is authenticated
    const user = getCurrentUser();
    if (user && firebaseApp) {
      try {
        await FirestoreService.saveTrip(user.uid, trip);
      } catch (firestoreError) {
        console.error('Error syncing trip to Firestore:', firestoreError);
        // Don't throw - local save succeeded
      }
    }
  } catch (error) {
    console.error('Error saving trip:', error);
    throw error;
  }
};

/**
 * Load all saved trips from AsyncStorage and sync from Firestore if authenticated
 */
export const loadTrips = async (): Promise<StoredTrip[]> => {
  try {
    const user = getCurrentUser();
    
    // If authenticated and Firebase is initialized, try to load from Firestore first
    if (user && firebaseApp) {
      try {
        const firestoreTrips = await FirestoreService.getUserTrips(user.uid);
        if (firestoreTrips.length > 0) {
          // Sync Firestore data to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(firestoreTrips));
          return firestoreTrips;
        }
      } catch (firestoreError) {
        console.error('Error loading trips from Firestore:', firestoreError);
        // Fall through to AsyncStorage
      }
    }

    // Fallback to AsyncStorage
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading trips:', error);
    return [];
  }
};

/**
 * Update a trip in AsyncStorage and sync to Firestore if authenticated
 */
export const updateTrip = async (tripId: string, updates: Partial<StoredTrip>): Promise<void> => {
  try {
    const trips = await loadTrips();
    const updatedTrips = trips.map(trip => 
      trip.id === tripId ? { ...trip, ...updates } : trip
    );
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));

    // Sync to Firestore if authenticated
    const user = getCurrentUser();
    if (user && firebaseApp) {
      try {
        await FirestoreService.updateTrip(user.uid, tripId, updates);
      } catch (firestoreError) {
        console.error('Error syncing trip update to Firestore:', firestoreError);
        // Don't throw - local update succeeded
      }
    }
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
};

/**
 * Delete a trip from AsyncStorage and sync to Firestore if authenticated
 */
export const deleteTrip = async (tripId: string): Promise<void> => {
  try {
    const trips = await loadTrips();
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(updatedTrips));

    // Sync to Firestore if authenticated
    const user = getCurrentUser();
    if (user && firebaseApp) {
      try {
        await FirestoreService.deleteTrip(user.uid, tripId);
      } catch (firestoreError) {
        console.error('Error syncing trip deletion to Firestore:', firestoreError);
        // Don't throw - local deletion succeeded
      }
    }
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
};

/**
 * Clear all trips from AsyncStorage
 */
export const clearTrips = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TRIPS);
  } catch (error) {
    console.error('Error clearing trips:', error);
  }
};

// ==================== FAVORITES STORAGE ====================

/**
 * Save a favorite place to AsyncStorage and sync to Firestore if authenticated
 */
export const saveFavorite = async (place: Place): Promise<void> => {
  try {
    const existingFavorites = await loadFavorites();
    const isAlreadyFavorite = existingFavorites.some(fav => fav.placeId === place.id);
    if (isAlreadyFavorite) {
      return;
    }
    
    const favorite: StoredFavorite = {
      placeId: place.id,
      place,
      addedAt: new Date().toISOString(),
    };
    
    const updatedFavorites = [...existingFavorites, favorite];
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));

    // Sync to Firestore if authenticated
    const user = getCurrentUser();
    if (user && firebaseApp) {
      try {
        await FirestoreService.addFavorite(user.uid, place.id, place);
      } catch (firestoreError) {
        console.error('Error syncing favorite to Firestore:', firestoreError);
        // Don't throw - local save succeeded
      }
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
    throw error;
  }
};

/**
 * Load all favorite places from AsyncStorage and sync from Firestore if authenticated
 */
export const loadFavorites = async (): Promise<StoredFavorite[]> => {
  try {
    const user = getCurrentUser();
    
    // If authenticated and Firebase is initialized, try to load from Firestore first
    if (user && firebaseApp) {
      try {
        const firestoreFavorites = await FirestoreService.getFavorites(user.uid);
        if (firestoreFavorites.length > 0) {
          // Sync Firestore data to AsyncStorage
          await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(firestoreFavorites));
          return firestoreFavorites;
        }
      } catch (firestoreError) {
        console.error('Error loading favorites from Firestore:', firestoreError);
        // Fall through to AsyncStorage
      }
    }

    // Fallback to AsyncStorage
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
};

/**
 * Remove a favorite place from AsyncStorage and sync to Firestore if authenticated
 */
export const removeFavorite = async (placeId: string): Promise<void> => {
  try {
    const favorites = await loadFavorites();
    const updatedFavorites = favorites.filter(fav => fav.placeId !== placeId);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));

    // Sync to Firestore if authenticated
    const user = getCurrentUser();
    if (user && firebaseApp) {
      try {
        await FirestoreService.removeFavorite(user.uid, placeId);
      } catch (firestoreError) {
        console.error('Error syncing favorite removal to Firestore:', firestoreError);
        // Don't throw - local removal succeeded
      }
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

/**
 * Check if a place is favorited (checks both AsyncStorage and Firestore)
 */
export const isFavorite = async (placeId: string): Promise<boolean> => {
  try {
    const user = getCurrentUser();
    
    // If authenticated, check Firestore first
    if (user && firebaseApp) {
      try {
        return await FirestoreService.isFavorite(user.uid, placeId);
      } catch (firestoreError) {
        console.error('Error checking favorite in Firestore:', firestoreError);
        // Fall through to AsyncStorage
      }
    }

    // Fallback to AsyncStorage
    const favorites = await loadFavorites();
    return favorites.some(fav => fav.placeId === placeId);
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

/**
 * Clear all favorites from AsyncStorage
 */
export const clearFavorites = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
  } catch (error) {
    console.error('Error clearing favorites:', error);
  }
};
