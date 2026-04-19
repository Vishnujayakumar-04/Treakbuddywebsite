import puducherryData from './puducherry_data.json';

// Convert imported data to Place format
const restaurantsData = (puducherryData.Restraunts || []).map((item: any, index: number) => ({
    id: `rest_${index}`,
    name: item['Restaurant Name'] || 'Unknown Restaurant',
    category: 'Restaurants',
    location: item['Location'] || 'Puducherry',
    address: item['Address'] || '',
    mapsUrl: item['Google Maps Link'] || '',
    openingTimeWeekdays: `${item['Opening_Time'] || ''} - ${item['Closing_Time'] || ''}`,
    description: {
        specialFeatures: item['Description'] || `Serving delicious ${item['Main Cuisine']}`,
    },
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Coromandel_Cafe_Puducherry.jpg/800px-Coromandel_Cafe_Puducherry.jpg'],
    entryFee: `₹${item['Price Range']}`,
    rating: parseFloat(item['Rating']) || 4.0,
}));

export default restaurantsData;
