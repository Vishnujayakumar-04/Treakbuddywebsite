import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const photoshootData = ((puducherryData as any)['Photoshoot Spots'] || []).map((item: any, index: number) => ({
    id: `photo_${index}`,
    name: item['name'] || 'Unknown Spot',
    category: 'Photoshoot',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || 'All day',
    description: {
        specialFeatures: item['description'] || 'Perfect spot for photography.',
    },
    images: ['https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800'],
    entryFee: item['entry_fee'] || 'Free',
    rating: 4.5,
}));

export default photoshootData;
