import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminEvent } from '@/types/admin';

// Simple in-memory cache
const CACHE: Record<string, AdminEvent[]> = {};

export function clearEventCache(category?: string) {
    if (category) {
        delete CACHE[category];
    } else {
        Object.keys(CACHE).forEach(k => delete CACHE[k]);
    }
}

export async function getEventsByCategory(category: string): Promise<AdminEvent[]> {
    if (CACHE[category]) return CACHE[category];

    try {
        const eventsRef = collection(db, 'events');
        const q = query(
            eventsRef,
            where('category', '==', category.toLowerCase()),
            orderBy('updatedAt', 'desc')
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as AdminEvent));

        CACHE[category] = data;
        return data;
    } catch (error: any) {
        console.error(`Error fetching events for [${category}]:`, error);
        
        // If the error is specifically due to a missing compound index, retry without ordering
        if (error.code === 'failed-precondition') {
            try {
                const retryQ = query(collection(db, 'events'), where('category', '==', category.toLowerCase()));
                const retrySnapshot = await getDocs(retryQ);
                return retrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminEvent));
            } catch (retryError) {
                console.error(`Secondary error fetching events for [${category}]:`, retryError);
                return [];
            }
        }
        
        // Otherwise (like permission-denied), return an empty array safely so the UI doesn't crash
        return [];
    }
}

export async function getAllEvents(): Promise<AdminEvent[]> {
    try {
        const snapshot = await getDocs(collection(db, 'events'));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminEvent));
    } catch (error) {
        console.error("Error fetching all events:", error);
        return [];
    }
}
