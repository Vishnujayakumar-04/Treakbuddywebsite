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
    totalEvents: number;
    totalTransit: number;
    recentPlaces: AdminPlace[];
}

// ─── TRANSIT ───────────────────────────────────────────────────────────────
export interface AdminTransit {
    id: string;
    category: 'rentals' | 'cabs' | 'bus' | 'train';
    subCategory?: string;
    type?: string;
    name: string;
    description?: string;
    price?: string;
    availability?: string;
    image?: string;
    rating?: number;
    contact?: string;
    location?: string;
    // Bus/Train
    from?: string;
    to?: string;
    via?: string[];
    routeStops?: string[];
    baseFare?: number;
    farePerStop?: number;
    frequency?: string;
    duration?: string;
    departure?: string;
    arrival?: string;
    number?: string;
    // Cabs
    baseRate?: string;
    perKm?: string;
    bookingUrls?: { name: string; url: string }[];
    tips?: string;
    // Rentals
    mapUrl?: string;
    openHours?: string;
    about?: string;
    vehicles?: { category: string; models: string }[];
    documents?: { name: string; desc: string }[];
    securityDeposit?: string;
    terms?: { title: string; desc: string }[];
    updatedAt?: Timestamp;
}

// ─── EVENTS ────────────────────────────────────────────────────────────────
export interface AdminEvent {
    id: string;
    title: string;
    description: string;
    category: string; // e.g. 'music', 'concerts'
    date: string;
    location: string;
    interested: string;
    image: string;
    type: 'active' | 'nearby' | 'trending';
    isFeatured?: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
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
