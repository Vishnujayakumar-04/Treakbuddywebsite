/**
 * Static image map for transit items.
 * React Native requires local images to be resolved at compile-time via require().
 * This module maps transit item IDs → local image requires.
 *
 * NOTE: metro.config.js has been updated to include 'jfif' in assetExts.
 */

export const RENTAL_IMAGES: Record<string, any> = {
    // Bike rentals → cycling images
    r1: require('../../assets/assets/activity/beach-cycling.jfif'),
    r3: require('../../assets/assets/activity/auroville-beach-cycling.jfif'),

    // Scooty rental → cycling image variant
    r4: require('../../assets/assets/activity/promenade-beach-cycling.jfif'),

    // Cycle rentals
    r2: require('../../assets/assets/activity/promenade-beach-cycling.jfif'),
    r5: require('../../assets/assets/activity/beach-cycling2.jfif'),

    // Car rental → white town image (no car image available)
    rc1: require('../../assets/assets/spot/white-town-walks.jfif'),
};

/** Returns a local require() image for the given transit item id, or null if none. */
export function getRentalImage(id: string): any | null {
    return RENTAL_IMAGES[id] ?? null;
}
