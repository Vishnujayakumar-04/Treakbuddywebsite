import puducherryData from './puducherry_data.json';

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

export interface Place {
    id: string;
    name: string;
    category: string;
    description: string;
    location: string;
    rating: number;
    image: string;
    tags: string[];
    timeSlot: string;
    bestTime?: string;
    openTime?: string;
    entryFee?: string;
    gallery?: string[];
}

// Convert imported data to Place format
export const getAdventureActivities = (): Place[] => {
    return (puducherryData.AdventureActivities || []).map((item: any, index: number) => ({
        id: `adv_${index}`,
        name: item['Activity Name'] || 'Unknown Activity',
        category: 'adventure',
        description: item['Notes'] || `${item['Type']} activity in ${item['Area']}`,
        location: item['Area'] || 'Puducherry',
        rating: 4.5,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Serenity_Beach_Puducherry.jpg/800px-Serenity_Beach_Puducherry.jpg',
        tags: [item['Type'], 'Adventure', item['Best Time']].filter(Boolean),
        timeSlot: item['Best Time']?.includes('Morning') ? 'Morning' : 'Afternoon',
        bestTime: item['Best Time'],
        openTime: `${formatExcelTime(item['Opening Time'])} - ${formatExcelTime(item['Closing Time'])}`,
        entryFee: item['Price Range']
    }));
};

export const getNaturePlaces = (): Place[] => {
    return (puducherryData.Nature || []).map((item: any, index: number) => ({
        id: `nature_${index}`,
        name: item['name'] || 'Unknown Spot',
        category: 'nature',
        description: item['description'] || 'A beautiful nature spot.',
        location: item['location'] || 'Puducherry',
        rating: 4.4,
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Bharathi_Park_Puducherry.jpg',
        tags: [item['type'], item['activities']].filter(Boolean),
        timeSlot: item['best_time'] === 'Morning' ? 'Morning' : 'Evening',
        bestTime: item['best_time'],
        openTime: item['timing_weekday'],
        entryFee: item['entry_fee']
    }));
};

export const getPubsAndBars = (): Place[] => {
    return (puducherryData['Pubs & Bars'] || []).map((item: any, index: number) => ({
        id: `pub_${index}`,
        name: item['Pub Name'] || 'Unknown Pub',
        category: 'nightlife',
        description: item['Notes'] || `Popular nightlife spot with ${item['Music Type']}`,
        location: item['Area'] || 'Puducherry',
        rating: 4.3,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pondicherry_Cafe.jpg/800px-Pondicherry_Cafe.jpg',
        tags: ['Pub', 'Nightlife', item['Music Type']].filter(Boolean),
        timeSlot: 'Evening',
        bestTime: item['Best Days'] || 'Weekend',
        openTime: `${formatExcelTime(item['Opening Time'])} - ${formatExcelTime(item['Closing Time'])}`,
        entryFee: item['Entry Fee'] ? `₹${item['Entry Fee']}` : 'Free'
    }));
};

export const getRestaurants = (): Place[] => {
    return (puducherryData.Restraunts || []).map((item: any, index: number) => ({
        id: `rest_${index}`,
        name: item['Restaurant Name'] || 'Unknown Restaurant',
        category: 'restaurants',
        description: item['Description'] || `Serving delicious ${item['Main Cuisine']}`,
        location: item['Location'] || 'Puducherry',
        rating: parseFloat(item['Rating']) || 4.0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Coromandel_Cafe_Puducherry.jpg/800px-Coromandel_Cafe_Puducherry.jpg',
        tags: (item['Tags (Select multiple)'] || '').split(',').map((t: string) => t.trim()).filter(Boolean),
        timeSlot: 'Evening',
        bestTime: 'Evening',
        openTime: `${item['Opening_Time'] || ''} - ${item['Closing_Time'] || ''}`,
        entryFee: `₹${item['Price Range']}`
    }));
};

export const getHospitals = (): Place[] => {
    return (puducherryData.Sos || []).map((item: any, index: number) => ({
        id: `sos_${index}`,
        name: item['Hospital Name'] || 'Unknown Hospital',
        category: 'emergency',
        description: item['Notes'] || `Specializing in ${item['Speciality']}`,
        location: item['Area'] || 'Puducherry',
        rating: 4.0,
        image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/JIPMER_Puducherry.jpg',
        tags: ['Hospital', item['Hospital Type'], 'Medical'].filter(Boolean),
        timeSlot: 'Morning',
        bestTime: '24x7',
        openTime: item['Weekday Timings'],
        entryFee: 'Consultation Fees Apply'
    }));
};

// Get all places combined
export const getAllPlacesFromData = (): Place[] => {
    return [
        ...getAdventureActivities(),
        ...getNaturePlaces(),
        ...getPubsAndBars(),
        ...getRestaurants(),
        ...getHospitals()
    ];
};

export default {
    getAdventureActivities,
    getNaturePlaces,
    getPubsAndBars,
    getRestaurants,
    getHospitals,
    getAllPlacesFromData
};
