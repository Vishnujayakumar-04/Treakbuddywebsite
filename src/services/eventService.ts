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
    } catch (error) {
        console.error(`Error fetching events for [${category}]:`, error);
        // If it fails (maybe index missing), try without order
        const q = query(collection(db, 'events'), where('category', '==', category.toLowerCase()));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminEvent));
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
