import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const theatresData = ((puducherryData as any).Theatres || []).map((item: any, index: number) => ({
    id: `theatre_${index}`,
    name: item['name'] || 'Unknown Theatre',
    category: 'Theatres',
    location: item['location'] || 'Puducherry',
    address: item['address'] || '',
    mapsUrl: item['google_maps_link'] || '',
    openingTimeWeekdays: item['timing_weekday'] || '10 AM - 11 PM',
    description: {
        specialFeatures: item['description'] || 'Cinema and entertainment venue.',
    },
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Puducherry_Cinema_Hall.jpg/800px-Puducherry_Cinema_Hall.jpg'],
    entryFee: item['entry_fee'] || '₹150-300',
    rating: 4.1,
}));

export default theatresData;
