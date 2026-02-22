/**
 * imageSearchShared.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * UNIVERSAL image search module — runs identically on:
 *   ✅  Next.js website (client-side & server-side)
 *   ✅  React Native Expo app
 *
 * No Next.js imports. No Node.js builtins. Pure fetch + async/await.
 *
 * Usage (Next.js client):
 *   import { searchImages } from '@/lib/admin/imageSearchShared';
 *   const result = await searchImages({ placeName: 'Promenade Beach', location: 'Puducherry' });
 *
 * Usage (React Native):
 *   import { searchImages } from '../lib/imageSearchShared';  // copy to RN lib/
 *   const result = await searchImages({ placeName: 'Promenade Beach', location: 'Puducherry' });
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Shared Types (framework-agnostic) ────────────────────────────────────────

export type ImageSourceType = 'wikimedia' | 'pexels' | 'google' | 'manual';

export interface SharedImageResult {
    id: string;
    url: string;           // full-res URL (for upload)
    thumb: string;         // thumbnail URL (for grid display)
    thumbSmall?: string;   // small thumbnail (mobile grid)
    width: number;
    height: number;
    source: ImageSourceType;
    alt: string;
    credit?: string;       // uploader / photographer name
    creditUrl?: string;    // link to original page
    license?: string;      // e.g. "CC BY-SA 4.0"
    // Future AI slots
    aiCaption?: string;
    aiTags?: string[];
    duplicateScore?: number;
}

export interface SharedSearchResult {
    images: SharedImageResult[];
    source: ImageSourceType | 'mixed';
    cached: boolean;
    query: string;
    error?: string;
}

export interface SearchOptions {
    placeName: string;
    location?: string;      // defaults to 'Puducherry'
    limit?: number;         // defaults to 10
    pexelsApiKey?: string;  // required for Pexels fallback in React Native
    // For Next.js: calls /api/admin/images/search (server-proxied, key is secure)
    // For React Native: pass pexelsApiKey directly here
    useServerProxy?: boolean; // true = Next.js website mode; false = React Native mode
    serverProxyUrl?: string;  // custom Next.js API base URL if needed
}

// ─── In-memory cache (works in both environments) ────────────────────────────
interface CacheEntry { data: SharedSearchResult; ts: number }
const memCache = new Map<string, CacheEntry>();
const MEM_TTL = 30 * 60 * 1000; // 30 min

function memGet(key: string): SharedSearchResult | null {
    const e = memCache.get(key);
    if (!e) return null;
    if (Date.now() - e.ts > MEM_TTL) { memCache.delete(key); return null; }
    return { ...e.data, cached: true };
}
function memSet(key: string, data: SharedSearchResult): void {
    if (memCache.size > 100) {
        const first = memCache.keys().next().value;
        if (first) memCache.delete(first);
    }
    memCache.set(key, { data, ts: Date.now() });
}

// ─── Async Storage cache (React Native only — opt-in) ────────────────────────
// Call `setAsyncStorageAdapter(AsyncStorage)` once in your RN app entry point.
type AsyncStorageLike = {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
};
let asyncStorage: AsyncStorageLike | null = null;
const ASYNC_PREFIX = 'trekbuddy_imgcache_';

/** Call this once in your React Native app root (App.tsx / _layout.tsx) */
export function setAsyncStorageAdapter(adapter: AsyncStorageLike): void {
    asyncStorage = adapter;
}

async function asyncGet(key: string): Promise<SharedSearchResult | null> {
    if (!asyncStorage) return null;
    try {
        const raw = await asyncStorage.getItem(ASYNC_PREFIX + key);
        if (!raw) return null;
        const { data, ts }: CacheEntry = JSON.parse(raw);
        if (Date.now() - ts > 2 * 60 * 60 * 1000) return null; // 2h TTL for persistent cache
        return { ...data, cached: true };
    } catch { return null; }
}

async function asyncSet(key: string, data: SharedSearchResult): Promise<void> {
    if (!asyncStorage) return;
    try {
        await asyncStorage.setItem(ASYNC_PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
    } catch { /* storage full */ }
}

// ─── Wikimedia Commons (Direct — no API key, CORS-open) ──────────────────────
const WIKI_API = 'https://commons.wikimedia.org/w/api.php';
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);

async function wikimediaSearch(
    placeName: string,
    location: string,
    limit: number,
): Promise<SharedImageResult[]> {
    const queries = [
        `${placeName} ${location}`,
        `${placeName} Pondicherry`,
        `${placeName} India`,
    ];

    const seen = new Set<string>();
    const out: SharedImageResult[] = [];

    for (const q of queries) {
        if (out.length >= limit) break;

        const params = new URLSearchParams({
            action: 'query', format: 'json', origin: '*',
            generator: 'search',
            gsrsearch: q,
            gsrnamespace: '6',
            gsrlimit: String(Math.min(limit - out.length + 4, 15)),
            prop: 'imageinfo',
            iiprop: 'url|size|mime|extmetadata|thumburl',
            iiurlwidth: '900',
            iiurlheight: '700',
        });

        try {
            const res = await fetch(`${WIKI_API}?${params}`, {
                headers: { Accept: 'application/json' },
            });
            if (!res.ok) continue;
            const data = await res.json();
            const pages: Record<string, any> = data?.query?.pages ?? {};

            for (const page of Object.values(pages)) {
                if (out.length >= limit) break;
                const info = page.imageinfo?.[0];
                if (!info || !ALLOWED_MIME.has(info.mime ?? '')) continue;
                if ((info.width ?? 0) < 500 || (info.height ?? 0) < 350) continue;

                const id = `wiki_${page.pageid}`;
                if (seen.has(id)) continue;
                seen.add(id);

                const meta = info.extmetadata ?? {};
                const desc = (meta.ImageDescription?.value ?? meta.ObjectName?.value ?? '')
                    .replace(/<[^>]+>/g, '').trim().slice(0, 200);
                const author = (meta.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim();
                const license = meta.LicenseShortName?.value ?? '';
                const thumb: string = info.thumburl ?? info.url;
                const thumbSmall = thumb.replace('/900px-', '/400px-');

                out.push({
                    id,
                    url: info.url,
                    thumb,
                    thumbSmall,
                    width: info.width ?? 900,
                    height: info.height ?? 700,
                    source: 'wikimedia',
                    alt: desc || placeName,
                    credit: author || undefined,
                    creditUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
                    license: license || undefined,
                });
            }
        } catch {
            // silently try next query
        }

        // Rate-limit: wait 200ms between requests
        if (out.length < limit && queries.indexOf(q) < queries.length - 1) {
            await new Promise(r => setTimeout(r, 200));
        }
    }

    return out;
}

// ─── Pexels API (Direct — needs API key, for React Native) ────────────────────
async function pexelsSearch(
    query: string,
    apiKey: string,
    limit: number,
): Promise<SharedImageResult[]> {
    try {
        const res = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=landscape`,
            { headers: { Authorization: apiKey } }
        );
        if (!res.ok) return [];
        const data = await res.json();

        return (data.photos ?? []).map((p: any): SharedImageResult => ({
            id: `pexels_${p.id}`,
            url: p.src.large2x || p.src.large,
            thumb: p.src.medium,
            thumbSmall: p.src.small,
            width: p.width,
            height: p.height,
            source: 'pexels',
            alt: p.alt || query,
            credit: p.photographer,
            creditUrl: p.photographer_url,
            license: 'Pexels License',
        }));
    } catch {
        return [];
    }
}

// ─── Next.js server proxy (delegates to /api/admin/images/search) ─────────────
async function serverProxySearch(
    placeName: string,
    location: string,
    baseUrl = '',
): Promise<SharedSearchResult> {
    const params = new URLSearchParams({ name: placeName, location });
    const res = await fetch(`${baseUrl}/api/admin/images/search?${params}`);
    if (!res.ok) throw new Error(`Search API ${res.status}`);
    const data = await res.json();

    // Re-map to SharedImageResult (compatible superset)
    return {
        ...data,
        images: (data.images as any[]).map(img => ({
            ...img,
            credit: img.photographer,
            creditUrl: img.photographerUrl,
        } satisfies SharedImageResult)),
    };
}

// ─── Main export: searchImages ────────────────────────────────────────────────
/**
 * Universal search function.
 *
 * Next.js website (admin panel):
 *   searchImages({ placeName, location, useServerProxy: true })
 *   → hits /api/admin/images/search (safe, server-side API keys)
 *
 * React Native Expo:
 *   searchImages({ placeName, location, pexelsApiKey: PEXELS_KEY })
 *   → calls Wikimedia directly (no key), then Pexels as fallback
 */
export async function searchImages(opts: SearchOptions): Promise<SharedSearchResult> {
    const {
        placeName,
        location = 'Puducherry',
        limit = 10,
        pexelsApiKey,
        useServerProxy = false,
        serverProxyUrl = '',
    } = opts;

    if (!placeName.trim()) {
        return { images: [], source: 'manual', cached: false, query: '', error: 'Place name required' };
    }

    const cacheKey = `${placeName.toLowerCase()}_${location.toLowerCase()}`;

    // 1. Check in-memory cache
    const mem = memGet(cacheKey);
    if (mem) return mem;

    // 2. Check persistent cache (React Native AsyncStorage)
    const async_ = await asyncGet(cacheKey);
    if (async_) { memSet(cacheKey, async_); return async_; }

    let result: SharedSearchResult;

    if (useServerProxy) {
        // ── Next.js mode: delegate to secure server API route ────────────────────
        try {
            result = await serverProxySearch(placeName, location, serverProxyUrl);
        } catch (err: any) {
            result = { images: [], source: 'manual', cached: false, query: placeName, error: err.message };
        }
    } else {
        // ── React Native mode: call APIs directly ─────────────────────────────────
        const pexelsQuery = `${placeName} ${location} tourism`;

        const [wikiImgs, pexelsImgs] = await Promise.all([
            wikimediaSearch(placeName, location, limit),
            pexelsApiKey ? pexelsSearch(pexelsQuery, pexelsApiKey, limit) : Promise.resolve([]),
        ]);

        const seen = new Set<string>();
        const merged: SharedImageResult[] = [];
        for (const img of [...wikiImgs, ...pexelsImgs]) {
            if (merged.length >= limit) break;
            if (!seen.has(img.id)) { seen.add(img.id); merged.push(img); }
        }

        const hasWiki = wikiImgs.length > 0;
        const hasPexels = pexelsImgs.length > 0;
        const source: SharedSearchResult['source'] =
            hasWiki && hasPexels ? 'mixed' :
                hasWiki ? 'wikimedia' :
                    hasPexels ? 'pexels' : 'manual';

        result = { images: merged, source, cached: false, query: `${placeName} ${location}` };
    }

    // Store in both caches
    if (result.images.length > 0) {
        memSet(cacheKey, result);
        asyncSet(cacheKey, result); // no-op if AsyncStorage not configured
    }

    return result;
}

// ─── Export Wikimedia client directly for advanced usage ─────────────────────
export { wikimediaSearch };
