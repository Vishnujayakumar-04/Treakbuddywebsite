import { Timestamp } from 'firebase/firestore';

export interface AdminPlace {
    id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    image: string; // cover image URL
    gallery: string[]; // gallery image URLs
    tags: string[];
    rating: number;
    isFeatured: boolean;
    openTime?: string;
    entryFee?: string;
    bestTime?: string;
    timeSlot?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface AdminCategory {
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    order: number;
    createdAt: Timestamp;
}

export interface AdminUser {
    uid: string;
    email: string;
    displayName: string;
    role: 'admin' | 'superadmin' | 'user';
    createdAt: Timestamp;
}

export interface DashboardStats {
    totalPlaces: number;
    totalCategories: number;
    featuredPlaces: number;
    recentPlaces: AdminPlace[];
}

// ─── Image Search System ────────────────────────────────────────────────────────────
export type ImageSource = 'google' | 'pexels' | 'wikimedia' | 'manual';

export interface ImageResult {
    id: string;
    url: string;         // full resolution URL
    thumb: string;       // thumbnail for grid display
    width: number;
    height: number;
    source: ImageSource;
    alt: string;
    photographer?: string;  // attribution (Pexels)
    photographerUrl?: string;
    // Future-ready fields:
    aiCaption?: string;     // AI-generated caption slot
    aiTags?: string[];      // auto-tagging slot
    duplicateScore?: number; // duplicate detection slot
}

export interface ImageSearchResponse {
    images: ImageResult[];
    source: ImageSource | 'mixed';
    cached: boolean;
    query: string;
    error?: string;
}
