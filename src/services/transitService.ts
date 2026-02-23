import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { TransitItem } from '@/utils/seedTransitData';

// Simple in-memory cache to prevent redundant Firestore reads
const CACHE: Record<string, TransitItem[]> = {};

export function clearTransitCache(category?: string) {
    if (category) {
        delete CACHE[category];
    } else {
        Object.keys(CACHE).forEach(k => delete CACHE[k]);
    }
}

export async function getTransitItems(category: string): Promise<TransitItem[]> {
    // Return cached data immediately if available
    if (CACHE[category]) {
        return CACHE[category];
    }

    try {
        const transitRef = collection(db, 'transit');
        const q = query(transitRef, where('category', '==', category));

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TransitItem));

        // Store in cache
        CACHE[category] = data;
        return data;
    } catch (error) {
        console.error(`Error fetching transit category [${category}]:`, error);
        throw error;
    }
}

export { seedTransitData } from '@/utils/seedTransitData';

