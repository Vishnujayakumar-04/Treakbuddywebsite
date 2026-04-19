import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { StoredTrip, StoredFavorite } from './storage';
import { Place } from './api';
import {
  FIRESTORE_COLLECTIONS,
  getUserSubcollectionPath,
  getCategoryCollectionPath
} from '../firebase/firestoreStructure';

// Use centralized collection names
const COLLECTIONS = {
  USERS: FIRESTORE_COLLECTIONS.USERS,
  TRIPS: FIRESTORE_COLLECTIONS.USER_TRIPS,
  FAVORITES: FIRESTORE_COLLECTIONS.USER_FAVORITES,
  HISTORY: FIRESTORE_COLLECTIONS.USER_HISTORY,
};

// ==================== USER PROFILE OPERATIONS ====================

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  profilePhotoUrl?: string;
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
}

/**
 * Create user profile in Firestore
 */
export const createUserProfile = async (
  userId: string,
  userData: {
    name: string;
    email: string;
    phone?: string;
    profilePhotoUrl?: string;
  }
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);

    // Remove undefined fields to prevent Firestore errors
    const cleanedData: any = {
      name: userData.name,
      email: userData.email,
      createdAt: serverTimestamp() as Timestamp,
      updatedAt: serverTimestamp() as Timestamp,
    };

    // Only add optional fields if they have values
    if (userData.phone) {
      cleanedData.phone = userData.phone;
    }
    if (userData.profilePhotoUrl) {
      cleanedData.profilePhotoUrl = userData.profilePhotoUrl;
    }

    await setDoc(userRef, cleanedData);
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    throw new Error(error.message || 'Failed to create user profile');
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting user profile:', error);
    throw new Error(error.message || 'Failed to get user profile');
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<UserProfile, 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw new Error(error.message || 'Failed to update user profile');
  }
};

/**
 * Ensure user profile exists in Firestore (create if missing)
 * This is useful when a user logs in but their profile doesn't exist yet
 */
export const ensureUserProfile = async (
  userId: string,
  userData: {
    name?: string;
    email: string;
    phone?: string;
    profilePhotoUrl?: string;
  }
): Promise<UserProfile> => {
  try {
    const existingProfile = await getUserProfile(userId);

    if (existingProfile) {
      // Profile exists, return it
      return existingProfile;
    }

    // Profile doesn't exist, create it
    const profileData = {
      name: userData.name || 'User',
      email: userData.email,
      phone: userData.phone,
      profilePhotoUrl: userData.profilePhotoUrl,
    };

    await createUserProfile(userId, profileData);

    // Return the newly created profile
    const newProfile = await getUserProfile(userId);
    if (!newProfile) {
      throw new Error('Failed to retrieve newly created profile');
    }

    return newProfile;
  } catch (error: any) {
    console.error('Error ensuring user profile:', error);
    throw new Error(error.message || 'Failed to ensure user profile');
  }
};

// ==================== TRIP OPERATIONS ====================

/**
 * Save trip to Firestore
 */
export const saveTrip = async (userId: string, trip: StoredTrip): Promise<void> => {
  try {
    const tripRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRIPS, trip.id);
    await setDoc(tripRef, {
      ...trip,
      createdAt: Timestamp.fromDate(new Date(trip.createdAt)),
    });
  } catch (error: any) {
    console.error('Error saving trip:', error);
    throw new Error(error.message || 'Failed to save trip');
  }
};

/**
 * Get all user trips from Firestore
 */
export const getUserTrips = async (userId: string): Promise<StoredTrip[]> => {
  try {
    const tripsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRIPS);
    const q = query(tripsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      } as StoredTrip;
    });
  } catch (error: any) {
    console.error('Error getting user trips:', error);
    throw new Error(error.message || 'Failed to get user trips');
  }
};

/**
 * Update trip in Firestore
 */
export const updateTrip = async (
  userId: string,
  tripId: string,
  updates: Partial<StoredTrip>
): Promise<void> => {
  try {
    const tripRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRIPS, tripId);
    await updateDoc(tripRef, updates);
  } catch (error: any) {
    console.error('Error updating trip:', error);
    throw new Error(error.message || 'Failed to update trip');
  }
};

/**
 * Delete trip from Firestore
 */
export const deleteTrip = async (userId: string, tripId: string): Promise<void> => {
  try {
    const tripRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRIPS, tripId);
    await deleteDoc(tripRef);
  } catch (error: any) {
    console.error('Error deleting trip:', error);
    throw new Error(error.message || 'Failed to delete trip');
  }
};

/**
 * Listen to user trips in real-time
 */
export const subscribeToUserTrips = (
  userId: string,
  callback: (trips: StoredTrip[]) => void
): (() => void) => {
  try {
    const tripsRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.TRIPS);
    const q = query(tripsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (querySnapshot) => {
        const trips = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          } as StoredTrip;
        });
        callback(trips);
      },
      (error) => {
        console.error('Error in trips subscription:', error);
        // Return empty array on error
        callback([]);
      }
    );
  } catch (error: any) {
    console.error('Error subscribing to trips:', error);
    return () => { };
  }
};

// ==================== FAVORITES OPERATIONS ====================

/**
 * Add favorite place to Firestore
 */
export const addFavorite = async (
  userId: string,
  placeId: string,
  place: Place
): Promise<void> => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.FAVORITES, placeId);
    const favorite: StoredFavorite = {
      placeId,
      place,
      addedAt: new Date().toISOString(),
    };
    await setDoc(favoriteRef, favorite);
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    throw new Error(error.message || 'Failed to add favorite');
  }
};

/**
 * Remove favorite from Firestore
 */
export const removeFavorite = async (userId: string, placeId: string): Promise<void> => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.FAVORITES, placeId);
    await deleteDoc(favoriteRef);
  } catch (error: any) {
    console.error('Error removing favorite:', error);
    throw new Error(error.message || 'Failed to remove favorite');
  }
};

/**
 * Get all user favorites from Firestore
 */
export const getFavorites = async (userId: string): Promise<StoredFavorite[]> => {
  try {
    const favoritesRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.FAVORITES);
    const q = query(favoritesRef, orderBy('addedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as StoredFavorite);
  } catch (error: any) {
    console.error('Error getting favorites:', error);
    throw new Error(error.message || 'Failed to get favorites');
  }
};

/**
 * Listen to user favorites in real-time
 */
export const subscribeToFavorites = (
  userId: string,
  callback: (favorites: StoredFavorite[]) => void
): (() => void) => {
  try {
    const favoritesRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.FAVORITES);
    const q = query(favoritesRef, orderBy('addedAt', 'desc'));

    return onSnapshot(
      q,
      (querySnapshot) => {
        const favorites = querySnapshot.docs.map((doc) => doc.data() as StoredFavorite);
        callback(favorites);
      },
      (error) => {
        console.error('Error in favorites subscription:', error);
        callback([]);
      }
    );
  } catch (error: any) {
    console.error('Error subscribing to favorites:', error);
    return () => { };
  }
};

/**
 * Check if a place is favorited
 */
export const isFavorite = async (userId: string, placeId: string): Promise<boolean> => {
  try {
    const favoriteRef = doc(db, COLLECTIONS.USERS, userId, COLLECTIONS.FAVORITES, placeId);
    const favoriteSnap = await getDoc(favoriteRef);
    return favoriteSnap.exists();
  } catch (error: any) {
    console.error('Error checking favorite:', error);
    return false;
  }
};

// ==================== HISTORY OPERATIONS ====================

export interface HistoryItem {
  id: string;
  type: 'trip' | 'place' | 'category';
  title: string;
  date: string;
  details?: string;
  category?: string;
  placeId?: string;
  tripId?: string;
  createdAt: Timestamp | string;
}

/**
 * Add item to history in Firestore
 */
export const addToHistory = async (
  userId: string,
  item: Omit<HistoryItem, 'id' | 'createdAt'>
): Promise<void> => {
  try {
    const historyRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.HISTORY);
    const newHistoryRef = doc(historyRef);

    const historyItem: HistoryItem = {
      ...item,
      id: newHistoryRef.id,
      createdAt: serverTimestamp() as Timestamp,
    };

    await setDoc(newHistoryRef, historyItem);
  } catch (error: any) {
    console.error('Error adding to history:', error);
    throw new Error(error.message || 'Failed to add to history');
  }
};

/**
 * Get user history from Firestore
 */
export const getHistory = async (userId: string): Promise<HistoryItem[]> => {
  try {
    const historyRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.HISTORY);
    const q = query(historyRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      } as HistoryItem;
    });
  } catch (error: any) {
    console.error('Error getting history:', error);
    throw new Error(error.message || 'Failed to get history');
  }
};

/**
 * Listen to user history in real-time
 */
export const subscribeToHistory = (
  userId: string,
  callback: (history: HistoryItem[]) => void
): (() => void) => {
  try {
    const historyRef = collection(db, COLLECTIONS.USERS, userId, COLLECTIONS.HISTORY);
    const q = query(historyRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (querySnapshot) => {
        const history = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          } as HistoryItem;
        });
        callback(history);
      },
      (error) => {
        console.error('Error in history subscription:', error);
        // Return empty array on error
        callback([]);
      }
    );
  } catch (error: any) {
    console.error('Error subscribing to history:', error);
    return () => { };
  }
};

