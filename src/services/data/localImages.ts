export const LOCAL_IMAGES: Record<string, string[]> = {
    'promenadebeach': ['/assets/beaches/promenade beach.jpg'],
    'paradisebeach': ['/assets/beaches/paradise beach.jpeg'],
    'serenitybeach': ['/assets/beaches/serenity beach.jpg'],
    'aurovillebeach': ['/assets/beaches/auroville beach.jpg'],
    'reppobeach': ['/assets/beaches/reppo beach.jfif'],
    'botanicalgarden': ['/assets/spot/botanical garden.jfif'],
    'barathipark': ['/assets/spot/barathi park.jfif'],
    'aayimandapam': ['/assets/spot/aayi mandapam.jfif'],
    'villashanti': ['/assets/stay/villa shanti.webp', '/assets/stay/villa shanti 2.webp', '/assets/stay/villa shanti 3.webp'],
    'lamaisoncharu': ['/assets/stay/la maison charu.webp', '/assets/stay/la maison charu 2.webp', '/assets/stay/la maison charu 3.webp'],
    'anandhainn': ['/assets/stay/anandha inn.jpg', '/assets/stay/anandha inn 2.jpg', '/assets/stay/anandha inn 3.jpg'],
    'coromandel': ['/assets/stay/coromandel heritage.jfif', '/assets/stay/coromandel heritag2.jfif', '/assets/stay/coromandel heritag 3.jfif'],
    'gingerhotel': ['/assets/stay/ginger hotel.jfif', '/assets/stay/ginger hotel 2.jfif', '/assets/stay/ginger hotel 3.jfif'],
    'hotelatithi': ['/assets/stay/hotel atithi.jfif', '/assets/stay/hotel atithi 2.jfif', '/assets/stay/hotel atithi 3.jfif'],
    'lepondy': ['/assets/stay/le pondy.jfif', '/assets/stay/le pondy 2.jfif', '/assets/stay/le pondy 3.jfif'],
    'oceanspray': ['/assets/stay/ocean spray.jfif', '/assets/stay/ocean spray 2.jfif', '/assets/stay/ocean spray 3.jfif'],
    'paradiselagoon': ['/assets/stay/paradise lagoon.jfif', '/assets/stay/paradise lagoon 2.jfif', '/assets/stay/paradise lagoon 3.jfif'],
    'accord': ['/assets/stay/accord.jfif', '/assets/stay/accord 2.jfif', '/assets/stay/accord 3.jfif'],
    'cycling': ['/assets/activity/beach cycling.jfif', '/assets/activity/beach cyclin2.jfif', '/assets/activity/promenade beach cycling.jfif'],
    'museum': ['/assets/spot/museum.jfif', '/assets/spot/museum 2.jfif', '/assets/spot/museum 3.jfif'],
    'memorial': ['/assets/spot/french wa rmemorial.jfif', '/assets/spot/french wa rmemorial 2.jfif', '/assets/spot/french wa rmemorial 3.jfif']
};

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
