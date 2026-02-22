export const LOCAL_IMAGES: Record<string, string[]> = {};

export function resolveLocalImage(name: string, fallback: string): string {
    if (!name) return fallback;
    const key = name.toLowerCase().replace(/[\d\W_]+/g, '');
    for (const k in LOCAL_IMAGES) {
        // Simple subset match
        if (key.includes(k) || k.includes(key) && key.length > 3) {
            return LOCAL_IMAGES[k][0];
        }
    }
    return fallback;
}

export function resolveLocalGallery(name: string, fallback: string[]): string[] {
    if (!name) return fallback;
    const key = name.toLowerCase().replace(/[\d\W_]+/g, '');
    for (const k in LOCAL_IMAGES) {
        if (key.includes(k) || k.includes(key) && key.length > 3) {
            return LOCAL_IMAGES[k];
        }
    }
    return fallback;
}
