/**
 * categoryImages.ts
 * Static map of category keys to local require() images.
 * React Native cannot use dynamic paths, so all images must be listed here.
 */

// Each category gets a representative local image
const categoryImages: Record<string, any> = {
    // Beaches
    beaches: require('../../assets/assets/beaches/promenade beach.jpg'),
    beach: require('../../assets/assets/beaches/promenade beach.jpg'),

    // Adventure / Activities
    adventure: require('../../assets/assets/activity/mangrove kayaking.jfif'),
    activities: require('../../assets/assets/activity/beach-cycling.jfif'),
    boating: require('../../assets/assets/activity/chunnambar boat house.jfif'),
    cycling: require('../../assets/assets/activity/beach-cycling.jfif'),
    kayaking: require('../../assets/assets/activity/mangrove kayaking.jfif'),

    // Spots / Tourism
    parks: require('../../assets/assets/spot/barathi park.jfif'),
    nature: require('../../assets/assets/spot/botanical garden.jfif'),
    garden: require('../../assets/assets/spot/botanical garden.jfif'),
    museum: require('../../assets/assets/spot/museum.jfif'),
    shopping: require('../../assets/assets/spot/sunday market.jfif'),
    market: require('../../assets/assets/spot/sunday market.jfif'),
    heritage: require('../../assets/assets/spot/white-town-walks.jfif'),
    walk: require('../../assets/assets/spot/white-town-walks.jfif'),

    // Stays
    accommodation: require('../../assets/assets/stay/anandha inn.jpg'),
    hotels: require('../../assets/assets/stay/anandha inn.jpg'),

    // Defaults by first letter fallback
    default: require('../../assets/assets/beaches/promenade beach.jpg'),
};

/**
 * Get a local image for a category.
 * Returns a require() result or null if no match.
 */
export function getCategoryImage(category: string): any | null {
    if (!category) return categoryImages.default;
    const lower = category.toLowerCase();
    // Try direct match
    if (categoryImages[lower]) return categoryImages[lower];
    // Try partial key match
    const matchKey = Object.keys(categoryImages).find(k => lower.includes(k) || k.includes(lower));
    return matchKey ? categoryImages[matchKey] : categoryImages.default;
}

export default categoryImages;
