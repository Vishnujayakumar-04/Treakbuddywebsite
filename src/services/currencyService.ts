export interface Currency {
    code: string;
    name: string;
    symbol: string;
    flag: string;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '' },
];

export interface ExchangeLocation {
    id: string;
    name: string;
    type: 'Bank' | 'Forex' | 'ATM';
    address: string;
    phone: string;
    hours: string;
    rating: number;
    currencies: string[];
}

export const EXCHANGE_LOCATIONS: ExchangeLocation[] = [
    {
        id: '1',
        name: 'SBI Bank Main Branch',
        type: 'Bank',
        address: '5, Rue Suffren, White Town, Puducherry',
        phone: '+91 413 234 5678',
        hours: '10:00 AM - 4:00 PM (Closed Sundays)',
        rating: 4.2,
        currencies: ['USD', 'EUR', 'GBP', 'AUD', 'SGD']
    },
    {
        id: '2',
        name: 'Canara Bank Foreign Exchange',
        type: 'Bank',
        address: 'MG Road, Heritage Town, Puducherry',
        phone: '+91 413 233 4455',
        hours: '10:00 AM - 5:00 PM (Mon-Fri)',
        rating: 4.0,
        currencies: ['USD', 'EUR', 'GBP', 'CAD']
    },
    {
        id: '3',
        name: 'Thomas Cook India',
        type: 'Forex',
        address: 'Bussy Street, MG Road Area, Puducherry',
        phone: '+91 413 222 1122',
        hours: '9:30 AM - 6:30 PM (Mon-Sat)',
        rating: 4.5,
        currencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'SGD', 'AED']
    },
    {
        id: '4',
        name: 'Wall Street Forex',
        type: 'Forex',
        address: 'Mission Street, Heritage Town, Puducherry',
        phone: '+91 413 233 8899',
        hours: '10:00 AM - 7:00 PM',
        rating: 4.6,
        currencies: ['USD', 'EUR', 'GBP', 'SGD', 'AED', 'AUD']
    },
    {
        id: '5',
        name: 'HDFC Bank ATM (International)',
        type: 'ATM',
        address: 'Aurobindo Ashram Area, White Town, Puducherry',
        phone: 'N/A',
        hours: '24/7',
        rating: 3.9,
        currencies: ['INR']
    },
    {
        id: '6',
        name: 'ICICI Bank ATM',
        type: 'ATM',
        address: 'Promenade Beach Road, Puducherry',
        phone: 'N/A',
        hours: '24/7',
        rating: 4.1,
        currencies: ['INR']
    }
];
