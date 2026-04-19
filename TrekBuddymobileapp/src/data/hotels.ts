import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const hotelsData = ((puducherryData as any).Hotels || []).map((item: any, index: number) => ({
    id: `hotel_${index}`,
    name: item['name'] || 'Unknown Hotel',
    category: 'Accommodation',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: '24 hours',
    description: {
        specialFeatures: item['description'] || 'Comfortable accommodation.',
    },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
    entryFee: item['price_range'] || '₹2000-5000',
    rating: parseFloat(item['rating']) || 4.0,
}));

export default hotelsData;
