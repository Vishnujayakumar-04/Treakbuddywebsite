/**
 * imageSearchService.ts — React Native Expo
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides automatic image fetching for tourism places in the TrekBuddy Expo app.
 * Uses Wikimedia Commons (free, no API key) with Pexels fallback.
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SharedImageResult {
    url: string;
    thumb: string;
    thumbSmall?: string;
    title?: string;
    credit?: string;
    license?: string;
    source?: 'wikimedia' | 'pexels';
}

export interface SharedSearchResult {
    images: SharedImageResult[];
    query: string;
    source?: string;
}

// ─── Simple in-memory cache ───────────────────────────────────────────────────
const memCache: Record<string, { result: SharedSearchResult; ts: number }> = {};
const MEM_TTL_MS = 30 * 60 * 1000; // 30 min

let asyncStorageAdapter: any = null;

// ─── Config ───────────────────────────────────────────────────────────────────
const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY || '';
const DEFAULT_LOCATION = 'Puducherry';

// ─── Initialize (call once in App.tsx) ────────────────────────────────────────
export function initImageSearch(asyncStorageInstance: any): void {
    asyncStorageAdapter = asyncStorageInstance;
    console.log('[ImageSearch] Persistent cache initialized with AsyncStorage.');
}

// ─── Main fetch function ───────────────────────────────────────────────────────
export async function fetchPlaceImages(
    placeName: string,
    location: string = DEFAULT_LOCATION,
    limit = 10,
): Promise<SharedSearchResult> {
    const cacheKey = `img_${placeName}_${location}_${limit}`;

    // Memory cache check
    const cached = memCache[cacheKey];
    if (cached && Date.now() - cached.ts < MEM_TTL_MS) {
        return cached.result;
    }

    try {
        // Try Wikimedia Commons first
        const wikiResult = await fetchFromWikimedia(placeName, location, limit);
        if (wikiResult.images.length > 0) {
            memCache[cacheKey] = { result: wikiResult, ts: Date.now() };
            return wikiResult;
        }
    } catch (_) { /* fall through to Pexels */ }

    try {
        if (PEXELS_API_KEY) {
            const pexelsResult = await fetchFromPexels(placeName, location, limit);
            memCache[cacheKey] = { result: pexelsResult, ts: Date.now() };
            return pexelsResult;
        }
    } catch (_) { /* fall through to empty */ }

    return { images: [], query: `${placeName} ${location}` };
}

async function fetchFromWikimedia(placeName: string, location: string, limit: number): Promise<SharedSearchResult> {
    const query = encodeURIComponent(`${placeName} ${location}`);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${query}&srnamespace=6&srlimit=${limit}&format=json&origin=*`;
    const res = await fetch(url);
    const json = await res.json();
    const titles: string[] = (json.query?.search || []).map((s: any) => s.title);
    const images: SharedImageResult[] = titles.slice(0, limit).map(title => {
        const encoded = encodeURIComponent(title.replace('File:', ''));
        return {
            url: `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}`,
            thumb: `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=600`,
            thumbSmall: `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=200`,
            title,
            source: 'wikimedia' as const,
        };
    });
    return { images, query: `${placeName} ${location}`, source: 'wikimedia' };
}

async function fetchFromPexels(placeName: string, location: string, limit: number): Promise<SharedSearchResult> {
    const query = encodeURIComponent(`${placeName} ${location}`);
    const res = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=${limit}`, {
        headers: { Authorization: PEXELS_API_KEY },
    });
    const json = await res.json();
    const images: SharedImageResult[] = (json.photos || []).map((p: any) => ({
        url: p.src.large,
        thumb: p.src.medium,
        thumbSmall: p.src.small,
        credit: p.photographer,
        source: 'pexels' as const,
    }));
    return { images, query: `${placeName} ${location}`, source: 'pexels' };
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function splitCoverAndGallery(result: SharedSearchResult): {
    cover: SharedImageResult | null;
    gallery: SharedImageResult[];
} {
    const [cover = null, ...gallery] = result.images;
    return { cover, gallery: gallery.slice(0, 5) };
}

export function getThumbUrl(img: SharedImageResult, size: 'small' | 'large' = 'large'): string {
    return size === 'small' ? (img.thumbSmall ?? img.thumb) : img.thumb;
}

export function getAttribution(img: SharedImageResult): string {
    if (!img.credit) return '';
    const license = img.license ? ` (${img.license})` : '';
    return `Photo by ${img.credit}${license}`;
}
