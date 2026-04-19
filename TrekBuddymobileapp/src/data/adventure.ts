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

// Convert imported data to Place format
const adventureData = (puducherryData.AdventureActivities || []).map((item: any, index: number) => ({
    id: `adv_${index}`,
    name: item['Activity Name'] || 'Unknown Activity',
    category: item['Type'] || 'Adventure',
    location: item['Area'] || 'Puducherry',
    address: item['Route/Location'] || '',
    mapsUrl: item['Google Maps Link'] || '',
    openingTimeWeekdays: formatExcelTime(item['Opening Time']),
    closingTimeWeekdays: formatExcelTime(item['Closing Time']),
    description: {
        specialFeatures: item['Notes'] || `${item['Type']} activity in ${item['Area']}`,
    },
    images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
    entryFee: item['Price Range'] || 'Free',
    rating: 4.5,
}));

export default adventureData;
