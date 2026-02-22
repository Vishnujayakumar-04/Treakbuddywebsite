import {
    collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
    query, orderBy, limit, where, serverTimestamp, Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminPlace, AdminCategory, DashboardStats } from '@/types/admin';

const PLACES_COL = 'adminPlaces';
const CATEGORIES_COL = 'adminCategories';

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

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
    if (!db) return { totalPlaces: 0, totalCategories: 0, featuredPlaces: 0, recentPlaces: [] };

    const [placesSnap, categoriesSnap, featuredSnap, recentSnap] = await Promise.all([
        getDocs(collection(db, PLACES_COL)),
        getDocs(collection(db, CATEGORIES_COL)),
        getDocs(query(collection(db, PLACES_COL), where('isFeatured', '==', true))),
        getDocs(query(collection(db, PLACES_COL), orderBy('createdAt', 'desc'), limit(5))),
    ]);

    return {
        totalPlaces: placesSnap.size,
        totalCategories: categoriesSnap.size,
        featuredPlaces: featuredSnap.size,
        recentPlaces: recentSnap.docs.map(d => ({ id: d.id, ...d.data() } as AdminPlace)),
    };
}
