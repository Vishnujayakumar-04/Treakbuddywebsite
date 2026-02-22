/**
 * Wikimedia Commons API Client
 * ─────────────────────────────────────────────────────────────────────────────
 * Universal: works in Node.js (Next.js server), browser, and React Native Expo.
 * No API key required. Free, public domain & Creative Commons licensed images.
 *
 * API Docs: https://www.mediawiki.org/wiki/API:Main_page
 * CORS:     Enabled via `origin=*` — works directly from any client.
 *
 * Future-ready slots in WikimediaImage:
 *   aiCaption      → hook for AI caption generation
 *   aiTags         → hook for auto-tagging via vision API
 *   duplicateScore → hook for perceptual hash dedup
 */

export interface WikimediaImage {
    id: string;
    url: string;           // full resolution JPEG/PNG
    thumb: string;         // ~800px wide thumbnail
    thumbSmall: string;    // ~400px wide thumbnail (grid display)
    width: number;
    height: number;
    title: string;         // clean filename without "File:" prefix
    description: string;  // extracted from EXIF / Commons description
    license?: string;      // e.g. "CC BY-SA 4.0"
    author?: string;       // photographer/uploader credit
    pageUrl: string;       // link to Wikimedia Commons page
    // Future-ready hooks
    aiCaption?: string;
    aiTags?: string[];
    duplicateScore?: number;
}

const WIKIMEDIA_API = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'TrekBuddyAdmin/2.0 (https://trekbuddy.app; admin@trekbuddy.app)';
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];
const MIN_WIDTH = 500;
const MIN_HEIGHT = 350;

// ─── Request rate-limiting (max 1 req / 200ms) ────────────────────────────────
let lastRequestTime = 0;
async function throttle(): Promise<void> {
    const now = Date.now();
    const gap = now - lastRequestTime;
    if (gap < 200) await new Promise(r => setTimeout(r, 200 - gap));
    lastRequestTime = Date.now();
}

// ─── Build fetch headers (cross-platform) ────────────────────────────────────
function buildHeaders(): HeadersInit {
    // In React Native, 'User-Agent' can't always be set in fetch headers.
    // We still include it for Node.js / Next.js server-side calls.
    return {
        'Accept': 'application/json',
        'User-Agent': USER_AGENT,
    };
}

// ─── Strip HTML tags from description text ────────────────────────────────────
function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// ─── Main search function ─────────────────────────────────────────────────────
export async function searchWikimediaImages(
    query: string,
    limit = 10,
): Promise<WikimediaImage[]> {
    await throttle();

    const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        origin: '*',              // enables CORS for browser & RN
        generator: 'search',
        gsrsearch: query,
        gsrnamespace: '6',             // File: namespace only
        gsrlimit: String(Math.min(limit + 6, 20)), // over-fetch to allow filtering
        prop: 'imageinfo',
        iiprop: 'url|size|mime|extmetadata|thumburl',
        iiurlwidth: '900',            // request 900px wide thumbnail
        iiurlheight: '700',
    });

    try {
        const res = await fetch(`${WIKIMEDIA_API}?${params.toString()}`, {
            headers: buildHeaders(),
        });

        if (!res.ok) throw new Error(`Wikimedia HTTP ${res.status}`);
        const data = await res.json();

        const pages: Record<string, any> = data?.query?.pages ?? {};
        const results: WikimediaImage[] = [];

        for (const page of Object.values(pages)) {
            if (results.length >= limit) break;

            const info = page.imageinfo?.[0];
            if (!info) continue;

            // ── Quality filters ───────────────────────────────────────────────────
            const mime: string = info.mime ?? '';
            if (!ALLOWED_MIME.includes(mime)) continue;        // skip SVG, PDF, etc.
            if ((info.width ?? 0) < MIN_WIDTH) continue;      // skip tiny images
            if ((info.height ?? 0) < MIN_HEIGHT) continue;

            // ── Metadata extraction ───────────────────────────────────────────────
            const meta = info.extmetadata ?? {};

            const rawDesc = meta.ImageDescription?.value
                ?? meta.ObjectName?.value
                ?? '';
            const description = stripHtml(rawDesc).slice(0, 300) || page.title?.replace('File:', '') || query;

            const license = meta.LicenseShortName?.value
                ?? meta.License?.value
                ?? 'Unknown';

            const author = stripHtml(
                meta.Artist?.value
                ?? meta.Credit?.value
                ?? ''
            ).slice(0, 80) || undefined;

            const cleanTitle = (page.title as string)
                .replace('File:', '')
                .replace(/_/g, ' ')
                .replace(/\.[^.]+$/, '') // remove extension
                .trim();

            // ── Build thumbnail URLs ──────────────────────────────────────────────
            // Wikimedia thumb pattern:
            //   https://upload.wikimedia.org/wikipedia/commons/thumb/a/b/File.jpg/{width}px-File.jpg
            const fullUrl: string = info.url ?? '';
            const thumbUrl: string = info.thumburl ?? fullUrl;

            // Derive a smaller 400px thumb from the 900px thumb URL
            const thumbSmall = thumbUrl.includes('/900px-')
                ? thumbUrl.replace('/900px-', '/400px-')
                : thumbUrl;

            results.push({
                id: `wiki_${page.pageid}`,
                url: fullUrl,
                thumb: thumbUrl,
                thumbSmall,
                width: info.width ?? 900,
                height: info.height ?? 700,
                title: cleanTitle,
                description,
                license,
                author,
                pageUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
            });
        }

        return results;
    } catch (err) {
        console.warn('[WikimediaAPI] Search failed:', err);
        return [];
    }
}

// ─── Multi-query search (tries multiple variations for best coverage) ─────────
export async function searchWikimediaMulti(
    placeName: string,
    location = 'Puducherry',
    limit = 10,
): Promise<WikimediaImage[]> {
    // Try queries in priority order — stop once we have enough results
    const queries = [
        `${placeName} ${location}`,              // e.g. "Promenade Beach Puducherry"
        `${placeName} Pondicherry`,              // alternate spelling
        `${placeName} India tourism`,            // broader fallback
        `${location} ${placeName.split(' ')[0]}`, // short form
    ];

    const seen = new Set<string>();
    const collected: WikimediaImage[] = [];

    for (const q of queries) {
        if (collected.length >= limit) break;
        const results = await searchWikimediaImages(q, limit - collected.length + 3);
        for (const img of results) {
            if (!seen.has(img.id)) {
                seen.add(img.id);
                collected.push(img);
            }
        }
    }

    return collected.slice(0, limit);
}
