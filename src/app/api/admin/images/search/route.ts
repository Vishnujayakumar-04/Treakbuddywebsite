import { NextRequest, NextResponse } from 'next/server';
import { ImageResult, ImageSearchResponse, ImageSource } from '@/types/admin';
import { searchWikimediaMulti, WikimediaImage } from '@/lib/admin/wikimediaApi';

// ─── In-memory server-side cache ──────────────────────────────────────────────
// Survives across requests in the same worker, resets on cold start / deploy.
const searchCache = new Map<string, { data: ImageSearchResponse; ts: number }>();
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours (Wikimedia images are stable)

function getCached(key: string): ImageSearchResponse | null {
    const entry = searchCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL_MS) { searchCache.delete(key); return null; }
    return { ...entry.data, cached: true };
}
function setCache(key: string, data: ImageSearchResponse): void {
    // Keep cache under 500 entries — evict oldest on overflow
    if (searchCache.size >= 500) {
        const firstKey = searchCache.keys().next().value;
        if (firstKey) searchCache.delete(firstKey);
    }
    searchCache.set(key, { data, ts: Date.now() });
}

// ─── Source 1: Wikimedia Commons (Primary — free, no key, CORS-open) ─────────
async function fetchWikimediaImages(
    placeName: string,
    location: string
): Promise<ImageResult[]> {
    try {
        const imgs: WikimediaImage[] = await searchWikimediaMulti(placeName, location, 10);
        return imgs.map((img): ImageResult => ({
            id: img.id,
            url: img.url,
            thumb: img.thumb,
            width: img.width,
            height: img.height,
            source: 'wikimedia',
            alt: img.description || img.title,
            photographer: img.author,
            photographerUrl: img.pageUrl,
            // future-ready slots
            aiCaption: undefined,
            aiTags: undefined,
            duplicateScore: undefined,
        }));
    } catch {
        return [];
    }
}

// ─── Source 2: Pexels API (Fallback — requires key) ───────────────────────────
async function fetchPexelsImages(query: string): Promise<ImageResult[]> {
    const key = process.env.PEXELS_API_KEY;
    if (!key || key === 'your_pexels_api_key_here') return [];

    try {
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
            { headers: { Authorization: key } }
        );
        if (!res.ok) return [];
        const data = await res.json();

        return (data.photos || []).map((photo: any): ImageResult => ({
            id: `pexels_${photo.id}`,
            url: photo.src.large2x || photo.src.large,
            thumb: photo.src.medium,
            width: photo.width,
            height: photo.height,
            source: 'pexels',
            alt: photo.alt || query,
            photographer: photo.photographer,
            photographerUrl: photo.photographer_url,
        }));
    } catch {
        return [];
    }
}

// ─── Source 3: Google Places (Bonus — if key configured) ─────────────────────
async function fetchGoogleImages(query: string): Promise<ImageResult[]> {
    const key = process.env.GOOGLE_PLACES_API_KEY;
    if (!key || key === 'your_google_places_api_key_here') return [];

    try {
        const searchRes = await fetch('https://places.googleapis.com/v1/places:searchText', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': key,
                'X-Goog-FieldMask': 'places.id,places.displayName,places.photos',
            },
            body: JSON.stringify({ textQuery: query, maxResultCount: 1 }),
        });
        if (!searchRes.ok) return [];
        const searchData = await searchRes.json();
        const place = searchData.places?.[0];
        if (!place?.photos?.length) return [];

        const photoPromises = place.photos.slice(0, 5).map(async (photo: any, i: number) => {
            try {
                const mediaRes = await fetch(
                    `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1200&maxHeightPx=900&key=${key}&skipHttpRedirect=true`
                );
                if (!mediaRes.ok) return null;
                const { photoUri } = await mediaRes.json();
                if (!photoUri) return null;
                return {
                    id: `google_${i}_${Date.now()}`,
                    url: photoUri,
                    thumb: photoUri.replace('maxWidthPx=1200', 'maxWidthPx=400'),
                    width: 1200, height: 900,
                    source: 'google' as ImageSource,
                    alt: `${query} - photo ${i + 1}`,
                } satisfies ImageResult;
            } catch { return null; }
        });

        return (await Promise.all(photoPromises)).filter((r): r is ImageResult => r !== null);
    } catch {
        return [];
    }
}

// ─── Route Handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const placeName = searchParams.get('name')?.trim() || '';
    const location = searchParams.get('location')?.trim() || 'Puducherry';

    if (!placeName) {
        return NextResponse.json({ error: 'Place name is required' }, { status: 400 });
    }

    // Cache key uses both name + location for specificity
    const cacheKey = `${placeName.toLowerCase()}__${location.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
        return NextResponse.json(cached, {
            headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, max-age=3600' }
        });
    }

    // ── Fetch strategy ────────────────────────────────────────────────────────
    // Priority: Wikimedia (primary, free) → Google Places → Pexels (fill gaps)
    const pexelsQuery = `${placeName} ${location} tourism`;
    const googleQuery = `${placeName} ${location}`;

    // Start Wikimedia immediately; start others in parallel
    const [wikiImages, googleImages, pexelsImages] = await Promise.all([
        fetchWikimediaImages(placeName, location),
        fetchGoogleImages(googleQuery),
        fetchPexelsImages(pexelsQuery),
    ]);

    // Deduplicate + merge: Wikimedia first, then Google, then Pexels top-off
    const seenIds = new Set<string>();
    const merged: ImageResult[] = [];

    for (const img of [...wikiImages, ...googleImages, ...pexelsImages]) {
        if (merged.length >= 12) break;
        if (!seenIds.has(img.id)) {
            seenIds.add(img.id);
            merged.push(img);
        }
    }

    // Determine dominant source for UI labelling
    const hasWiki = wikiImages.length > 0;
    const hasGoogle = googleImages.length > 0;
    const hasPexels = pexelsImages.length > 0;
    const sourceCount = [hasWiki, hasGoogle, hasPexels].filter(Boolean).length;
    const source: ImageSearchResponse['source'] =
        sourceCount > 1 ? 'mixed' :
            hasWiki ? 'wikimedia' :
                hasGoogle ? 'google' :
                    hasPexels ? 'pexels' : 'manual';

    const response: ImageSearchResponse = {
        images: merged,
        source,
        cached: false,
        query: `${placeName} ${location}`,
    };

    if (merged.length > 0) setCache(cacheKey, response);

    return NextResponse.json(response, {
        headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, max-age=3600' }
    });
}
