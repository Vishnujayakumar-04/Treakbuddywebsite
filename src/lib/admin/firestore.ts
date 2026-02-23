import {
    collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
    query, orderBy, limit, where, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminPlace, AdminCategory, DashboardStats, AdminTransit, AdminEvent } from '@/types/admin';

const PLACES_COL = 'adminPlaces';
const CATEGORIES_COL = 'adminCategories';
const TRANSIT_COL = 'transit';
const EVENTS_COL = 'events';

// ─── PLACES ──────────────────────────────────────────────────────────────────

export async function getAdminPlaces(): Promise<AdminPlace[]> {
    if (!db) return [];
    const q = query(collection(db, PLACES_COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminPlace));
}

export async function getAdminPlaceById(id: string): Promise<AdminPlace | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, PLACES_COL, id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as AdminPlace) : null;
}

export async function addAdminPlace(data: Omit<AdminPlace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = await addDoc(collection(db, PLACES_COL), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function updateAdminPlace(id: string, data: Partial<AdminPlace>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await updateDoc(doc(db, PLACES_COL, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteAdminPlace(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, PLACES_COL, id));
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export async function getAdminCategories(): Promise<AdminCategory[]> {
    if (!db) return [];
    const q = query(collection(db, CATEGORIES_COL), orderBy('order', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminCategory));
}

export async function addAdminCategory(data: Omit<AdminCategory, 'id' | 'createdAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = await addDoc(collection(db, CATEGORIES_COL), { ...data, createdAt: serverTimestamp() });
    return ref.id;
}

export async function updateAdminCategory(id: string, data: Partial<AdminCategory>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await updateDoc(doc(db, CATEGORIES_COL, id), data);
}

export async function deleteAdminCategory(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, CATEGORIES_COL, id));
}

// ─── TRANSIT ───────────────────────────────────────────────────────────────

export async function getAdminTransit(): Promise<AdminTransit[]> {
    if (!db) return [];
    const q = query(collection(db, TRANSIT_COL), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminTransit));
}

export async function getAdminTransitById(id: string): Promise<AdminTransit | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, TRANSIT_COL, id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as AdminTransit) : null;
}

export async function addAdminTransit(data: Omit<AdminTransit, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = await addDoc(collection(db, TRANSIT_COL), {
        ...data,
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function updateAdminTransit(id: string, data: Partial<AdminTransit>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await updateDoc(doc(db, TRANSIT_COL, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteAdminTransit(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, TRANSIT_COL, id));
}

// ─── EVENTS ────────────────────────────────────────────────────────────────

export async function getAdminEvents(): Promise<AdminEvent[]> {
    if (!db) return [];
    const q = query(collection(db, EVENTS_COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminEvent));
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
    if (!db) return null;
    const snap = await getDoc(doc(db, EVENTS_COL, id));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as AdminEvent) : null;
}

export async function addAdminEvent(data: Omit<AdminEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    const ref = await addDoc(collection(db, EVENTS_COL), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function updateAdminEvent(id: string, data: Partial<AdminEvent>): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await updateDoc(doc(db, EVENTS_COL, id), {
        ...data,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteAdminEvent(id: string): Promise<void> {
    if (!db) throw new Error('Firestore not initialized');
    await deleteDoc(doc(db, EVENTS_COL, id));
}

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
    if (!db) return { totalPlaces: 0, totalCategories: 0, featuredPlaces: 0, totalEvents: 0, totalTransit: 0, recentPlaces: [] };

    const [placesSnap, categoriesSnap, featuredSnap, recentSnap, eventsSnap, transitSnap] = await Promise.all([
        getDocs(collection(db, PLACES_COL)),
        getDocs(collection(db, CATEGORIES_COL)),
        getDocs(query(collection(db, PLACES_COL), where('isFeatured', '==', true))),
        getDocs(query(collection(db, PLACES_COL), orderBy('createdAt', 'desc'), limit(5))),
        getDocs(collection(db, EVENTS_COL)),
        getDocs(collection(db, TRANSIT_COL)),
    ]);

    return {
        totalPlaces: placesSnap.size,
        totalCategories: categoriesSnap.size,
        featuredPlaces: featuredSnap.size,
        totalEvents: eventsSnap.size,
        totalTransit: transitSnap.size,
        recentPlaces: recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as AdminPlace)),
    };
}
