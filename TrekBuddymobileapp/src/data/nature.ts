import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const natureData = (puducherryData.Nature || []).map((item: any, index: number) => ({
    id: `nature_${index}`,
    name: item['name'] || 'Unknown Spot',
    category: 'Nature',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || '',
    description: {
        specialFeatures: item['description'] || 'A beautiful nature spot.',
    },
    images: ['https://images.unsplash.com/photo-1596707328604-faed4c53574c?w=800'],
    entryFee: item['entry_fee'] || 'Free',
    rating: 4.4,
}));

export default natureData;
