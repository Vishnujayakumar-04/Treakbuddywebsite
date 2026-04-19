import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const parksData = ((puducherryData as any).Parks || []).map((item: any, index: number) => ({
    id: `park_${index}`,
    name: item['name'] || 'Unknown Park',
    category: 'Parks',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || '6 AM - 6 PM',
    description: {
        specialFeatures: item['description'] || 'A peaceful park for relaxation.',
    },
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'],
    entryFee: item['entry_fee'] || 'Free',
    rating: 4.3,
}));

export default parksData;
