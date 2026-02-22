import puducherryData from '../../data/puducherry_data.json';
import { Place } from './types';
import { resolveLocalImage, resolveLocalGallery } from './localImages';

// Helper to format Excel time (fraction of day) to string
function formatExcelTime(time: string | number | undefined): string {
    if (typeof time === 'string') return time;
    if (typeof time === 'number') {
        const totalMinutes = Math.round(time * 24 * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
    }
    return '';
}

// Random Image Helper (Placeholder)
const PLACEHOLDER_IMAGES: Record<string, string[]> = {
    adventure: [
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1534150534220-43d7de08779b?w=800&auto=format&fit=crop&q=60"
    ],
    nature: [
        "https://images.unsplash.com/photo-1596707328604-faed4c53574c?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1549643276-fbc2bd380d6b?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60"
    ],
    nightlife: [
        "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1536935338788-843bb6d8d9b6?w=800&auto=format&fit=crop&q=60"
    ],
    emergency: [
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=60"
    ]
};

function getRandomImage(category: string): string {
    const images = PLACEHOLDER_IMAGES[category] || PLACEHOLDER_IMAGES.nature;
    return images[Math.floor(Math.random() * images.length)];
}

const importedPlaces: Place[] = [];

// 1. Adventure Activities
// @ts-ignore
if (puducherryData.AdventureActivities) {
    // @ts-ignore
    puducherryData.AdventureActivities.forEach((item: any, index: number) => {
        const name = item['Activity Name'] || item['name'] || 'Unknown Activity';
        importedPlaces.push({
            id: `adv_imp_${index}`,
            name,
            category: 'adventure',
            description: item['Notes'] || item['description'] || `Exciting ${item['Type']} activity in ${item['Area']}.`,
            location: item['Area'] || 'Puducherry',
            rating: 4.5,
            image: resolveLocalImage(name, getRandomImage('adventure')),
            gallery: resolveLocalGallery(name, [getRandomImage('adventure')]),
            tags: [item['Type'], 'Adventure', item['Best Time']].filter(Boolean),
            timeSlot: (item['Best Time'] && String(item['Best Time']).includes('Morning')) ? 'Morning' : 'Afternoon',
            bestTime: String(item['Best Time'] || 'Daytime'),
            openTime: formatExcelTime(item['Opening Time']) + ' - ' + formatExcelTime(item['Closing Time']),
            entryFee: String(item['Price Range'] || '')
        });
    });
}

// 2. Nature
// @ts-ignore
if (puducherryData.Nature) {
    // @ts-ignore
    puducherryData.Nature.forEach((item: any, index: number) => {
        const name = item['name'] || 'Unknown Spot';
        importedPlaces.push({
            id: `nature_imp_${index}`,
            name,
            category: 'nature',
            description: item['description'] || 'A beautiful nature spot.',
            location: item['location'] || 'Puducherry',
            rating: 4.4,
            image: resolveLocalImage(name, getRandomImage('nature')),
            gallery: resolveLocalGallery(name, [getRandomImage('nature')]),
            tags: [item['type'], item['activities']].filter(Boolean),
            timeSlot: item['best_time'] === 'Morning' ? 'Morning' : 'Evening',
            bestTime: item['best_time'],
            openTime: item['timing_weekday'],
            entryFee: item['entry_fee']
        });
    });
}

// 3. Pubs & Bars (Nightlife)
// @ts-ignore
if (puducherryData['Pubs & Bars']) {
    // @ts-ignore
    puducherryData['Pubs & Bars'].forEach((item: any, index: number) => {
        const name = item['Pub Name'] || 'Unknown Pub';
        importedPlaces.push({
            id: `pub_imp_${index}`,
            name,
            category: 'nightlife',
            description: item['Notes'] || `Popular nightlife spot with ${item['Music Type']}.`,
            location: item['Area'] || 'Puducherry',
            rating: 4.3,
            image: resolveLocalImage(name, getRandomImage('nightlife')),
            gallery: resolveLocalGallery(name, [getRandomImage('nightlife')]),
            tags: ['Pub', 'Nightlife', item['Music Type']].filter(Boolean),
            timeSlot: 'Evening',
            bestTime: item['Best Days'] || 'Weekend',
            openTime: formatExcelTime(item['Opening Time']) + ' - ' + formatExcelTime(item['Closing Time']),
            entryFee: item['Entry Fee'] ? `₹${item['Entry Fee']}` : 'Free'
        });
    });
}

// 4. Restaurants
// @ts-ignore
if (puducherryData.Restraunts) {
    // @ts-ignore
    puducherryData.Restraunts.forEach((item: any, index: number) => {
        const name = item['Restaurant Name'] || 'Unknown Restaurant';
        importedPlaces.push({
            id: `rest_imp_${index}`,
            name,
            category: 'restaurants',
            description: item['Description'] || `Serving delicious ${item['Main Cuisine']}.`,
            location: item['Location'] || 'Puducherry',
            rating: parseFloat(item['Rating']) || 4.0,
            image: resolveLocalImage(name, getRandomImage('restaurants')),
            gallery: resolveLocalGallery(name, [getRandomImage('restaurants')]),
            tags: (item['Tags (Select multiple)'] || '').split(',').map((t: string) => t.trim()).filter(Boolean),
            timeSlot: 'Evening',
            bestTime: 'Evening',
            openTime: (item['Opening_Time'] || '') + ' - ' + (item['Closing_Time'] || ''),
            entryFee: `₹${item['Price Range']}`
        });
    });
}

// 5. SOS (Hospitals)
// @ts-ignore
if (puducherryData.Sos) {
    // @ts-ignore
    puducherryData.Sos.forEach((item: any, index: number) => {
        const name = item['Hospital Name'] || 'Unknown Hospital';
        importedPlaces.push({
            id: `sos_imp_${index}`,
            name,
            category: 'emergency',
            description: item['Notes'] || `Specializing in ${item['Speciality']}.`,
            location: item['Area'] || 'Puducherry',
            rating: 4.0,
            image: resolveLocalImage(name, getRandomImage('emergency')),
            gallery: resolveLocalGallery(name, [getRandomImage('emergency')]),
            tags: ['Hospital', item['Hospital Type'], 'Medical'].filter(Boolean),
            timeSlot: 'Morning',
            bestTime: '24x7',
            openTime: item['Weekday Timings'],
            entryFee: 'Consultation Fees Apply'
        });
    });
}

export const IMPORTED_PLACES = importedPlaces;
