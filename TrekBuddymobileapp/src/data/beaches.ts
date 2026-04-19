import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const beachesData = ((puducherryData as any).Beaches || []).map((item: any, index: number) => ({
    id: `beach_${index}`,
    name: item['name'] || 'Unknown Beach',
    category: 'Beaches',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || '24 hours',
    description: {
        specialFeatures: item['description'] || 'A beautiful beach destination.',
    },
    images: ['https://images.unsplash.com/photo-1543362906-ac1b4526c1d0?w=800'],
    entryFee: item['entry_fee'] || 'Free',
    rating: 4.6,
}));

export default beachesData;
