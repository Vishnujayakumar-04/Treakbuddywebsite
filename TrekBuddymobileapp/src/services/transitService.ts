import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firestore';
import { TRANSIT_DATA, TransitItem as LocalTransitItem } from '../data/transitData';

export type TransitItem = LocalTransitItem;

// Simple in-memory cache
const CACHE: Record<string, TransitItem[]> = {};

export async function getTransitItems(category: string): Promise<TransitItem[]> {
    // Return cached data immediately if available
    if (CACHE[category]) {
        return CACHE[category];
    }

    try {
        const transitRef = collection(db, 'transit');
        const q = query(transitRef, where('category', '==', category));

        const snapshot = await getDocs(q);

        let data: TransitItem[] = [];

        if (!snapshot.empty) {
            data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as TransitItem));
        } else {
            // Fallback to local hardcoded parity data if Firebase is empty/offline
            console.log(`Firebase empty for ${category}, falling back to local local data.`);
            data = TRANSIT_DATA.filter(item => item.category === category) || [];
        }

        // Store in cache
        CACHE[category] = data;
        return data;
    } catch (error) {
        console.warn(`Error fetching transit category [${category}] from Firebase, using local data:`, error);

        // Final fallback to local data on complete failure (offline)
        const localFallback = TRANSIT_DATA.filter(item => item.category === category) || [];
        CACHE[category] = localFallback;
        return localFallback;
    }
}
