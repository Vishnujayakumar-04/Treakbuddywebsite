import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const shoppingData = ((puducherryData as any).Shopping || []).map((item: any, index: number) => ({
    id: `shop_${index}`,
    name: item['name'] || 'Unknown Shop',
    category: 'Shopping',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || '10 AM - 8 PM',
    description: {
        specialFeatures: item['description'] || 'Great shopping destination.',
    },
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Pondicherry_shopping_street.jpg/800px-Pondicherry_shopping_street.jpg'],
    entryFee: item['entry_fee'] || 'Free Entry',
    rating: 4.2,
}));

export default shoppingData;
