import { AdminPlace, AdminCategory, DashboardStats, AdminTransit, AdminEvent } from '@/types/admin';
import { auth } from '@/lib/firebase';

async function getIdToken(): Promise<string> {
    const u = auth?.currentUser;
    if (!u) throw new Error('Not authenticated');
    return await u.getIdToken(true);
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getIdToken();
    const res = await fetch(path, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers || {}),
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res.ok) {
        let msg = `Request failed: ${res.status}`;
        try {
            const j = await res.json();
            if (j?.error) msg = j.error;
        } catch { /* ignore */ }
        throw new Error(msg);
    }
    return await res.json();
}

//  PLACES 

export async function getAdminPlaces(): Promise<AdminPlace[]> {
    return await adminFetch<AdminPlace[]>('/api/admin/places', { method: 'GET' });
}

export async function getAdminPlaceById(id: string): Promise<AdminPlace | null> {
    return await adminFetch<AdminPlace>(`/api/admin/places/${id}`, { method: 'GET' });
}

export async function addAdminPlace(data: Omit<AdminPlace, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const res = await adminFetch<{ id: string }>('/api/admin/places', { method: 'POST', body: JSON.stringify(data) });
    return res.id;
}

export async function updateAdminPlace(id: string, data: Partial<AdminPlace>): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/places/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAdminPlace(id: string): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/places/${id}`, { method: 'DELETE' });
}

//  CATEGORIES 

export async function getAdminCategories(): Promise<AdminCategory[]> {
    return await adminFetch<AdminCategory[]>('/api/admin/categories', { method: 'GET' });
}

export async function addAdminCategory(data: Omit<AdminCategory, 'id' | 'createdAt'>): Promise<string> {
    const res = await adminFetch<{ id: string }>('/api/admin/categories', { method: 'POST', body: JSON.stringify(data) });
    return res.id;
}

export async function updateAdminCategory(id: string, data: Partial<AdminCategory>): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAdminCategory(id: string): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/categories/${id}`, { method: 'DELETE' });
}

//  TRANSIT 

export async function getAdminTransit(): Promise<AdminTransit[]> {
    return await adminFetch<AdminTransit[]>('/api/admin/transit', { method: 'GET' });
}

export async function getAdminTransitById(id: string): Promise<AdminTransit | null> {
    return await adminFetch<AdminTransit>(`/api/admin/transit/${id}`, { method: 'GET' });
}

export async function addAdminTransit(data: Omit<AdminTransit, 'id'>): Promise<string> {
    const res = await adminFetch<{ id: string }>('/api/admin/transit', { method: 'POST', body: JSON.stringify(data) });
    return res.id;
}

export async function updateAdminTransit(id: string, data: Partial<AdminTransit>): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/transit/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAdminTransit(id: string): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/transit/${id}`, { method: 'DELETE' });
}

//  EVENTS 

export async function getAdminEvents(): Promise<AdminEvent[]> {
    return await adminFetch<AdminEvent[]>('/api/admin/events', { method: 'GET' });
}

export async function getAdminEventById(id: string): Promise<AdminEvent | null> {
    return await adminFetch<AdminEvent>(`/api/admin/events/${id}`, { method: 'GET' });
}

export async function addAdminEvent(data: Omit<AdminEvent, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const res = await adminFetch<{ id: string }>('/api/admin/events', { method: 'POST', body: JSON.stringify(data) });
    return res.id;
}

export async function updateAdminEvent(id: string, data: Partial<AdminEvent>): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/events/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteAdminEvent(id: string): Promise<void> {
    await adminFetch<{ ok: true }>(`/api/admin/events/${id}`, { method: 'DELETE' });
}

//  DASHBOARD STATS 

export async function getDashboardStats(): Promise<DashboardStats> {
    return await adminFetch<DashboardStats>('/api/admin/stats', { method: 'GET' });
}
