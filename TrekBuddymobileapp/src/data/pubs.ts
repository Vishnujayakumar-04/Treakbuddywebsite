import puducherryData from './puducherry_data.json';

// Helper to format Excel time
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

// Convert imported data to Place format
const pubsData = (puducherryData['Pubs & Bars'] || []).map((item: any, index: number) => ({
    id: `pub_${index}`,
    name: item['Pub Name'] || 'Unknown Pub',
    category: 'Nightlife',
    location: item['Area'] || 'Puducherry',
    address: item['Address'] || '',
    mapsUrl: item['Google Maps Link'] || '',
    openingTimeWeekdays: formatExcelTime(item['Opening Time']),
    closingTimeWeekdays: formatExcelTime(item['Closing Time']),
    description: {
        specialFeatures: item['Notes'] || `Popular nightlife spot with ${item['Music Type']}`,
    },
    images: ['https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Pondicherry_Cafe.jpg/800px-Pondicherry_Cafe.jpg'],
    entryFee: item['Entry Fee'] ? `₹${item['Entry Fee']}` : 'Free',
    rating: 4.3,
}));

export default pubsData;
