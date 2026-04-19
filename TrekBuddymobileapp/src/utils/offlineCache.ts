import AsyncStorage from '@react-native-async-storage/async-storage';
import { Place } from './api';

const CACHE_KEYS = {
  PLACES_CACHE: '@trekbuddy:places_cache',
  CATEGORIES_CACHE: '@trekbuddy:categories_cache',
  CACHE_TIMESTAMP: '@trekbuddy:cache_timestamp',
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if cache is still valid
 */
export const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestamp = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp) return false;
    
    const cacheTime = parseInt(timestamp, 10);
    const now = Date.now();
    return (now - cacheTime) < CACHE_DURATION;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

/**
 * Save places data to cache
 */
export const cachePlaces = async (places: Place[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.PLACES_CACHE, JSON.stringify(places));
    await AsyncStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error caching places:', error);
  }
};

/**
 * Get cached places data
 */
export const getCachedPlaces = async (): Promise<Place[] | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.PLACES_CACHE);
    if (!cached) return null;
    
    const isValid = await isCacheValid();
    if (!isValid) {
      // Clear invalid cache
      await clearCache();
      return null;
    }
    
    return JSON.parse(cached) as Place[];
  } catch (error) {
    console.error('Error getting cached places:', error);
    return null;
  }
};

/**
 * Save category data to cache
 */
export const cacheCategoryData = async (category: string, data: Place[]): Promise<void> => {
  try {
    const key = `${CACHE_KEYS.CATEGORIES_CACHE}_${category}`;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error caching category data:', error);
  }
};

/**
 * Get cached category data
 */
export const getCachedCategoryData = async (category: string): Promise<Place[] | null> => {
  try {
    const key = `${CACHE_KEYS.CATEGORIES_CACHE}_${category}`;
    const cached = await AsyncStorage.getItem(key);
    if (!cached) return null;
    
    return JSON.parse(cached) as Place[];
  } catch (error) {
    console.error('Error getting cached category data:', error);
    return null;
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEYS.PLACES_CACHE);
    await AsyncStorage.removeItem(CACHE_KEYS.CACHE_TIMESTAMP);
    // Clear all category caches
    const allKeys = await AsyncStorage.getAllKeys();
    const categoryKeys = allKeys.filter(key => key.startsWith(CACHE_KEYS.CATEGORIES_CACHE));
    await AsyncStorage.multiRemove(categoryKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Simple network check (basic implementation)
 * For production, use @react-native-community/netinfo
 * This is a lightweight check that doesn't block
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    // Use a timeout to avoid blocking (2 seconds max)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    try {
      await fetch('https://www.google.com', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      return false;
    }
  } catch (error) {
    // Default to offline if check fails (allows app to work offline)
    return false;
  }
};

