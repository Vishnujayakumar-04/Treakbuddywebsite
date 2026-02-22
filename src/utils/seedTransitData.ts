import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface TransitItem {
    id: string;
    category: 'rentals' | 'cabs' | 'bus' | 'train';
    subCategory?: string; // 'bike', 'scooty', 'car', 'cycle', 'auto', 'city-taxi', 'local', 'interstate', 'express', etc.
    type?: string;
    name: string;
    description?: string;
    price?: string;
    availability?: string;
    image?: string;
    rating?: number;
    contact?: string;
    location?: string;
    // Bus/Train specific fields
    from?: string;
    to?: string;
    via?: string[];
    routeStops?: string[];
    baseFare?: number;
    farePerStop?: number;
    frequency?: string;
    duration?: string;
    stops?: number;
    classes?: string[];
    departure?: string;
    arrival?: string;
    number?: string;
    // Cabs specific
    baseRate?: string;
    perKm?: string;
    bookingMethod?: string;
    bookingUrl?: string;
    bookingUrls?: { name: string; url: string }[];
    tips?: string;
    specialty?: string;
    // Train Station
    code?: string;
    address?: string;
    facilities?: string[];
    // Rental specific
    mapUrl?: string;
    openHours?: string;
}

export const SEED_DATA: TransitItem[] = [
    // --- RENTALS (SELF-DRIVE VEHICLES) ---
    // 🚲 Bike / Scooter Rental (Most Popular)
    {
        id: 'r1', category: 'rentals', subCategory: 'Bike', name: 'HAPPY RIDE BIKE RENTAL',
        rating: 4.8, price: '₹300-750/day',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
        contact: '+91 96776 87007', location: '152, South Boulevard, near Railway Station',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9266421,79.8253956',
        openHours: 'Open 24 hours',
        description: 'Popular choice near Railway Station. Well-maintained bikes and scooters. Helmet provided.'
    },
    {
        id: 'r2', category: 'rentals', subCategory: 'Bike', name: 'Bike Rental Pondy MANI',
        rating: 4.9, price: '₹350-800/day',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        contact: '+91 94869 63681', location: 'Sardar Vallabbhai Patel Salai, White Town',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9390,79.8361',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Located in the heart of White Town. Wide range of geared and non-geared bikes.'
    },
    {
        id: 'r3', category: 'rentals', subCategory: 'Scooty', name: 'Mariyal Bike Rental',
        rating: 4.9, price: '₹350-700/day',
        image: 'https://images.unsplash.com/photo-1599819177477-0c1c63a8f5e1?w=800',
        contact: '+91 75399 76025', location: '12, Hyder Ali Street, South Boulevard, opposite Water Tank',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9416,79.8083',
        openHours: 'Open 24 hours',
        description: 'Reliable service opposite Water Tank. Good condition scooters available.'
    },
    {
        id: 'r4', category: 'rentals', subCategory: 'Bike', name: 'Bombay Bike Rental',
        rating: 4.8, price: '₹400-750/day',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        contact: '+91 98940 12345', location: 'Rue Milad Street, MG Road area',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9350,79.8300',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Central location near MG Road. Good for city exploring.'
    },
    {
        id: 'r5', category: 'rentals', subCategory: 'Bike', name: 'Les Pondy Two wheeler Bike Rent',
        rating: 4.7, price: '₹300-600/day',
        image: 'https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800',
        contact: '+91 99440 54321', location: 'Mission St, Heritage Town',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9333,79.8320',
        openHours: '7:30 AM - 9:30 PM',
        description: 'Convenient location in Heritage Town. Budget-friendly options.'
    },
    {
        id: 'r6', category: 'rentals', subCategory: 'Scooty', name: 'Joy ride\'s bike rental',
        rating: 4.6, price: '₹300-650/day',
        image: 'https://images.unsplash.com/photo-1525160354320-545e39edee96?w=800',
        contact: '+91 90030 98765', location: 'Karunanidhi St, Govindasalai',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9300,79.8200',
        openHours: '8:00 AM - 10:00 PM',
        description: 'Known for well-maintained scooters and friendly service.'
    },
    {
        id: 'r7', category: 'rentals', subCategory: 'Bike', name: 'PY Two Wheeler Rent',
        rating: 4.8, price: '₹350-700/day',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        contact: '+91 98423 11223', location: 'Near Pondicherry Bus Stand (Market St)',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9400,79.8060',
        openHours: 'Open 24 hours',
        description: 'Very closer to main bus stand. Convenient for travelers arriving by bus.'
    },
    {
        id: 'r8', category: 'rentals', subCategory: 'Bike', name: 'Rishi Bike rentals',
        rating: 4.9, price: '₹300-600/day',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
        contact: '+91 77082 23700', location: 'Market St, Nellithope',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9350,79.8250',
        openHours: 'Open 24 hours',
        description: 'Top rated. Excellent customer service and quick process.'
    },
    {
        id: 'r9', category: 'rentals', subCategory: 'Scooty', name: 'Sowmmya Bike Rent',
        rating: 4.7, price: '₹350-650/day',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        contact: '+91 96290 55444', location: 'Thennanjalai Rd (Subaiya Nagar)',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9280,79.8220',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Good variety of scooters available at reasonable rates.'
    },
    {
        id: 'r10', category: 'rentals', subCategory: 'Bike', name: 'Arunachalam Bike Rent',
        rating: 4.8, price: '₹350-800/day',
        image: 'https://images.unsplash.com/photo-1599819177477-0c1c63a8f5e1?w=800',
        contact: '+91 73392 55722', location: 'Pavazha Nagar',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9320,79.8150',
        openHours: 'Open 24 hours',
        description: 'Reliable service with transparent pricing.'
    },
    {
        id: 'r11', category: 'rentals', subCategory: 'Bike', name: 'Golden Bikes Rental',
        rating: 4.9, price: '₹400-800/day',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        contact: '+91 90924 44222', location: 'Opposite Le Royal Park Hotel',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9360,79.8310',
        openHours: 'Open 24 hours',
        description: 'Premium bikes available. Located opposite Le Royal Park.'
    },
    {
        id: 'r12', category: 'rentals', subCategory: 'Bike', name: 'Sai two wheeler rent',
        rating: 4.6, price: '₹300-600/day',
        image: 'https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800',
        contact: '+91 97890 23456', location: 'Mission St, Heritage Town',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9333,79.8320',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Heritage town location. Easy pick up and drop.'
    },
    {
        id: 'r13', category: 'rentals', subCategory: 'Bike', name: 'DIVAKAR BIKE RENT',
        rating: 5.0, price: '₹300-550/day',
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800',
        contact: '+91 99528 96808', location: 'Near New Bus Stand',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9410,79.8090',
        openHours: 'Open 24 hours',
        description: 'Highly rated. Best for travelers arriving at new bus stand.'
    },
    {
        id: 'r14', category: 'rentals', subCategory: 'Bike', name: 'Shri Vaasan Bike Rental',
        rating: 4.7, price: '₹350-700/day',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        contact: '+91 98941 67890', location: 'Kamaraj Salai, Naveena Garden',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9380,79.8280',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Good condition vehicles and friendly staff.'
    },
    {
        id: 'r15', category: 'rentals', subCategory: 'Bike', name: 'Anthuvan Bike Rental',
        rating: 4.8, price: '₹300-650/day',
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800',
        contact: '+91 81223 45678', location: 'Milad St, MG Road area',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9350,79.8300',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Central location. Hassle-free rental process.'
    },

    // 🚗 Car Self-Drive Rental
    {
        id: 'rc1', category: 'rentals', subCategory: 'Car', name: 'RIDE EASY CARS',
        rating: 4.8, price: '₹2000-4000/day',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        contact: '+91 63802 22267', location: 'Police Quarters Lane, Venkata Nagar',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9380,79.8280',
        openHours: 'Open 24 hours',
        description: 'Self Drive Car Rental. Verified cars. Easy documentation.'
    },
    {
        id: 'rc2', category: 'rentals', subCategory: 'Car', name: 'My Trip Cars',
        rating: 4.7, price: '₹1800-3500/day',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
        contact: '+91 78712 02798', location: 'Govindasalai',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9370,79.8250',
        openHours: '8:00 AM - 10:00 PM',
        description: 'Self Drive Car Rental. Hatchbacks and Sedans available.'
    },
    {
        id: 'rc3', category: 'rentals', subCategory: 'Car', name: 'PondyCar',
        rating: 4.5, price: '₹2000-4500/day',
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
        contact: '+91 99445 67890', location: 'Near New Bus Stand',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9420,79.8080',
        openHours: 'Open 24 hours',
        description: 'Wide range of self-drive cars near bus stand.'
    },
    {
        id: 'rc4', category: 'rentals', subCategory: 'Car', name: 'SAN CARS',
        rating: 4.6, price: '₹2200-4000/day',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        contact: '+91 88701 23456', location: 'Ilango Nagar',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9450,79.8100',
        openHours: '7:00 AM - 11:00 PM',
        description: 'Self Drive Car Rental. Clean and well-maintained cars.'
    },
    {
        id: 'rc5', category: 'rentals', subCategory: 'Car', name: 'RISHI CARS',
        rating: 4.8, price: '₹2500-5000/day',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        contact: '+91 77082 23700', location: 'MG Road Area',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9350,79.8300',
        openHours: 'Open 24 hours',
        description: 'Top rated car rental. SUVs and luxury cars also available.'
    },
    {
        id: 'rc6', category: 'rentals', subCategory: 'Car', name: 'City Car Rental PY',
        rating: 4.5, price: '₹2000-3500/day',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
        contact: '+91 90031 54321', location: 'Oulgaret Area',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9430,79.8050',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Affordable self-drive cars in Oulgaret area.'
    },
    {
        id: 'rc7', category: 'rentals', subCategory: 'Car', name: 'OVA CARS',
        rating: 4.7, price: '₹2000-4000/day',
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
        contact: '+91 96002 98765', location: 'Near Jipmer Campus',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9560,79.7990',
        openHours: 'Open 24 hours',
        description: 'Convenient for JIPMER visitors. Reliable service.'
    },
    {
        id: 'rc8', category: 'rentals', subCategory: 'Car', name: 'Alex Self driving cars',
        rating: 4.6, price: '₹1800-3800/day',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        contact: '+91 98405 67890', location: 'Nellithope',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9350,79.8250',
        openHours: '7:30 AM - 10:00 PM',
        description: 'Budget friendly car rental in Nellithope.'
    },
    {
        id: 'rc9', category: 'rentals', subCategory: 'Car', name: 'PY01 self drive car',
        rating: 4.8, price: '₹2500-4500/day',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        contact: '+91 99441 23456', location: 'White Town',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9390,79.8361',
        openHours: 'Open 24 hours',
        description: 'Located in White Town. Premium cars for self drive.'
    },
    {
        id: 'rc10', category: 'rentals', subCategory: 'Car', name: 'ASH Self Drive Cars',
        rating: 4.7, price: '₹2200-4000/day',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
        contact: '+91 88705 67890', location: 'Lawspet',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9500,79.8100',
        openHours: '8:00 AM - 9:00 PM',
        description: 'Reliable car rental service in Lawspet area.'
    },
    {
        id: 'rc11', category: 'rentals', subCategory: 'Car', name: 'AKN CARS',
        rating: 4.6, price: '₹2000-3800/day',
        image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800',
        contact: '+91 96006 54321', location: 'Lawspet',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9510,79.8120',
        openHours: '7:00 AM - 10:00 PM',
        description: 'Self Drive Car Rental. Good options in Lawspet.'
    },
    {
        id: 'rc12', category: 'rentals', subCategory: 'Car', name: 'AUTO CARS',
        rating: 4.8, price: '₹2500-4500/day',
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        contact: '+91 98408 12345', location: 'White Town',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9390,79.8361',
        openHours: 'Open 24 hours',
        description: 'Premium self drive cars in White Town area.'
    },
    // 🚲 Cycle Rental
    {
        id: 'cy1', category: 'rentals', subCategory: 'Cycle', name: 'Heritage Cycles',
        rating: 4.5, price: '₹80/hour',
        image: 'https://images.unsplash.com/photo-1485965120184-e224f7a1dbfe?w=800',
        contact: '+91 98765 43217', location: 'White Town Promenade',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9360,79.8350',
        openHours: '6:00 AM - 7:00 PM',
        description: 'Perfect for White Town exploration. ₹400/day. Easy rides along beach.'
    },
    {
        id: 'cy2', category: 'rentals', subCategory: 'Cycle', name: 'Beach Cruiser Hub',
        rating: 4.4, price: '₹60/hour',
        image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
        contact: '+91 98765 43218', location: 'Rock Beach',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=11.9360,79.8350',
        openHours: '6:00 AM - 8:00 PM',
        description: 'Comfortable cruisers. ₹300/day. Great for promenade rides.'
    },
    {
        id: 'cy3', category: 'rentals', subCategory: 'Cycle', name: 'Auroville Eco Cycles',
        rating: 4.6, price: '₹100/hour',
        image: 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800',
        contact: '+91 98765 43219', location: 'Auroville Visitors Center',
        mapUrl: 'https://www.google.com/maps/search/?api=1&query=12.0070,79.8100',
        openHours: '9:00 AM - 5:00 PM',
        description: 'Eco-friendly bikes. ₹500/day. Well-maintained cycles for Auroville.'
    },


    // --- CABS (Types) ---
    {
        id: 'c1', category: 'cabs', type: 'service', name: 'Auto Rickshaw',
        description: 'Classic three-wheeler for short trips',
        baseRate: '₹30', perKm: '₹15/km', availability: '24/7',
        bookingMethod: 'Hail on street or call',
        bookingUrls: [
            { name: 'NammaOoruTaxi', url: 'https://nammaoorutaxi.com/' },
            { name: 'Rapido', url: 'https://www.rapido.bike/Home' }
        ],
        tips: 'Negotiate fare before starting.',
        image: '🛺'
    },
    {
        id: 'c2', category: 'cabs', type: 'service', name: 'Bike Taxi',
        description: 'Quick two-wheeler rides',
        baseRate: '₹20', perKm: '₹10/km', availability: '6 AM - 11 PM',
        bookingMethod: 'Rapido app or local stands',
        bookingUrls: [
            { name: 'Rapido', url: 'https://www.rapido.bike/Home' }
        ],
        tips: 'Helmets provided.',
        image: '🏍️'
    },
    {
        id: 'c3', category: 'cabs', type: 'service', name: 'City Taxi / Cab',
        description: 'Comfortable car rides',
        baseRate: '₹100', perKm: '₹18/km', availability: '24/7',
        bookingMethod: 'Call local operators',
        bookingUrls: [
            { name: 'HurryUpCabs', url: 'https://hurryupcabs.com/city/pondicherry' },
            { name: 'Rapido', url: 'https://www.rapido.bike/Home' }
        ],
        tips: 'AC cabs available.',
        image: '🚕'
    },
    // --- CABS (Operators) ---
    { id: 'co1', category: 'cabs', type: 'operator', name: 'Pondy Cabs', contact: '+91 9876543210', specialty: 'Airport transfers' },
    { id: 'co2', category: 'cabs', type: 'operator', name: 'French Town Autos', contact: '+91 9876543211', specialty: 'City tours' },
    { id: 'co3', category: 'cabs', type: 'operator', name: 'Auroville Taxi Service', contact: '+91 9876543212', specialty: 'Auroville trips' },

    // --- LOCAL TOWN BUSES (PRTC / TNSTC) ---
    {
        id: 'b1', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Gorimedu',
        from: 'New Bus Stand', to: 'Gorimedu', via: ['Rajiv Gandhi Signal', 'Kamaraj Nagar'],
        routeStops: ['New Bus Stand', 'Nellithope', 'Indira Gandhi Square', 'Rajiv Gandhi Signal', 'Kamaraj Nagar', 'Gorimedu'],
        baseFare: 5, farePerStop: 2,
        frequency: '15 mins', duration: '25 mins',
        price: '₹10 - ₹15', availability: '5:00 AM - 10:30 PM', type: 'PRTC'
    },
    {
        id: 'b2', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Lawspet',
        from: 'New Bus Stand', to: 'Lawspet', via: ['Rajiv Gandhi Signal', 'Ellaipillaichavady'],
        routeStops: ['New Bus Stand', 'Nellithope', 'Indira Gandhi Square', 'Rajiv Gandhi Signal', 'Ellaipillaichavady', 'Lawspet'],
        baseFare: 5, farePerStop: 2,
        frequency: '12 mins', duration: '20 mins',
        price: '₹8 - ₹12', availability: '5:30 AM - 10:00 PM', type: 'PRTC'
    },
    {
        id: 'b3', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Muthialpet',
        from: 'New Bus Stand', to: 'Muthialpet', via: ['Mission Street', 'MG Road'],
        routeStops: ['New Bus Stand', 'Anthoniyar Kovil', 'Mission Street', 'MG Road', 'Muthialpet'],
        baseFare: 5, farePerStop: 2,
        frequency: '18 mins', duration: '22 mins',
        price: '₹10 - ₹15', availability: '6:00 AM - 9:30 PM', type: 'PRTC'
    },
    {
        id: 'b4', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Ariyankuppam',
        from: 'New Bus Stand', to: 'Ariyankuppam', via: ['Mudaliarpet', 'Murungapakkam'],
        routeStops: ['New Bus Stand', 'Anthoniyar Kovil', 'Mudaliarpet', 'Marapalam', 'Nainarmandapam', 'Murungapakkam', 'Ariyankuppam'],
        baseFare: 5, farePerStop: 2,
        frequency: '20 mins', duration: '30 mins',
        price: '₹10', availability: '6:00 AM - 9:00 PM', type: 'PRTC'
    },
    {
        id: 'b5', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Villianur',
        from: 'New Bus Stand', to: 'Villianur', via: ['Reddiarpalayam', 'Moolakulam'],
        routeStops: ['New Bus Stand', 'Nellithope', 'Indira Gandhi Square', 'Reddiarpalayam', 'Moolakulam', 'Villianur'],
        baseFare: 5, farePerStop: 2,
        frequency: '20 mins', duration: '25 mins',
        price: '₹10 - ₹15', availability: '5:30 AM - 10:00 PM', type: 'TNSTC'
    },
    {
        id: 'b6', category: 'bus', subCategory: 'local', name: 'New Bus Stand - Bahour',
        from: 'New Bus Stand', to: 'Bahour', via: ['Moolakulam', 'Villianur'],
        routeStops: ['New Bus Stand', 'Nellithope', 'Indira Gandhi Square', 'Reddiarpalayam', 'Moolakulam', 'Villianur', 'Bahour'],
        baseFare: 5, farePerStop: 3,
        frequency: '25 mins', duration: '35 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 8:30 PM', type: 'TNSTC'
    },
    {
        id: 'b7', category: 'bus', subCategory: 'local', name: 'Old Bus Stand - White Town Loop',
        from: 'Old Bus Stand', to: 'White Town', via: ['Mission Street', 'Beach Road'],
        routeStops: ['Old Bus Stand', 'Mission Street', 'MG Road', 'Bharathi Park', 'White Town', 'Beach Road', 'Goubert Avenue', 'Old Bus Stand'],
        baseFare: 5, farePerStop: 1,
        frequency: '15 mins', duration: '20 mins',
        price: '₹8 - ₹12', availability: '6:00 AM - 10:00 PM', type: 'PRTC'
    },
    {
        id: 'b8', category: 'bus', subCategory: 'local', name: 'Muthialpet - Railway Station',
        from: 'Muthialpet', to: 'Railway Station', via: ['Vaithikuppam', 'White Town'],
        routeStops: ['Muthialpet', 'Kurusukuppam', 'Vaithikuppam', 'White Town', 'Railway Station'],
        baseFare: 5, farePerStop: 2,
        frequency: '20 mins', duration: '18 mins',
        price: '₹10 - ₹15', availability: '6:00 AM - 10:00 PM', type: 'PRTC'
    },
    {
        id: 'b9', category: 'bus', subCategory: 'local', name: 'Lawspet - Airport',
        from: 'Lawspet', to: 'Airport', via: ['Karuvadikuppam'],
        routeStops: ['Lawspet', 'Karuvadikuppam', 'Airport'],
        baseFare: 5, farePerStop: 2,
        frequency: '25 mins', duration: '15 mins',
        price: '₹8 - ₹12', availability: '6:00 AM - 9:00 PM', type: 'PRTC'
    },
    {
        id: 'b10', category: 'bus', subCategory: 'local', name: 'Ariyankuppam - Chinna Veerampattinam',
        from: 'Ariyankuppam', to: 'Chinna Veerampattinam', via: ['ECR'],
        routeStops: ['Ariyankuppam', 'Chunnambar Boat House', 'Nonankuppam', 'Chinna Veerampattinam'],
        baseFare: 5, farePerStop: 2,
        frequency: '30 mins', duration: '20 mins',
        price: '₹10 - ₹15', availability: '7:00 AM - 8:00 PM', type: 'TNSTC'
    },

    // --- ELECTRIC BUSES (PRTC E-Fleet) ---
    {
        id: 'e1', category: 'bus', subCategory: 'local', name: '1E - Gorimedu/Mettupalayam',
        from: 'Gorimedu', to: 'Mettupalayam', via: ['Town Center'],
        routeStops: ['Gorimedu', 'JIPMER', 'Kamaraj Salai', 'Town Center', 'Nellithope', 'Mettupalayam'],
        baseFare: 10, farePerStop: 2,
        frequency: '20 mins', duration: '18 mins',
        price: '₹10 - ₹15', availability: '6:00 AM - 9:30 PM', type: 'PRTC Electric'
    },
    {
        id: 'e2', category: 'bus', subCategory: 'local', name: '2E - Railway Station/Gorimedu',
        from: 'Railway Station', to: 'Gorimedu', via: ['New Bus Stand'],
        routeStops: ['Railway Station', 'Old Bus Stand', 'Anna Salai', 'Ajantha Signal', 'New Bus Stand', 'JIPMER', 'Gorimedu'],
        baseFare: 10, farePerStop: 2,
        frequency: '15 mins', duration: '20 mins',
        price: '₹10 - ₹12', availability: '6:00 AM - 10:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e3a', category: 'bus', subCategory: 'local', name: '3EA - Pathukannu/Gorimedu',
        from: 'Pathukannu', to: 'Gorimedu', via: ['Main Road'],
        routeStops: ['Pathukannu', 'Thondamanatham', 'Villianur', 'Moolakulam', 'Reddiarpalayam', 'Gorimedu'],
        baseFare: 10, farePerStop: 2,
        frequency: '20 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e3b', category: 'bus', subCategory: 'local', name: '3EB - Pathukannu/Gorimedu',
        from: 'Pathukannu', to: 'Gorimedu', via: ['Alternate Route'],
        routeStops: ['Pathukannu', 'Ozhukarai', 'Mettupalayam', 'Gorimedu'],
        baseFare: 10, farePerStop: 2,
        frequency: '25 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e7', category: 'bus', subCategory: 'local', name: '7E - Navarkulam/Nonankuppam',
        from: 'Navarkulam', to: 'Nonankuppam', via: ['Coastal Road'],
        routeStops: ['Navarkulam', 'Lawspet', 'Muthialpet', 'Beach Road', 'Chunnambar', 'Nonankuppam'],
        baseFare: 10, farePerStop: 2,
        frequency: '25 mins', duration: '22 mins',
        price: '₹10 - ₹15', availability: '6:30 AM - 8:30 PM', type: 'PRTC Electric'
    },
    {
        id: 'e8', category: 'bus', subCategory: 'local', name: '8E - Chinna Veerampattinam/Kurunji Nagar',
        from: 'Chinna Veerampattinam', to: 'Kurunji Nagar', via: ['ECR'],
        routeStops: ['Chinna Veerampattinam', 'Nonankuppam', 'Ariankuppam', 'Murungapakkam', 'New Bus Stand', 'Lawspet', 'Kurunji Nagar'],
        baseFare: 10, farePerStop: 3,
        frequency: '30 mins', duration: '25 mins',
        price: '₹12 - ₹18', availability: '6:00 AM - 8:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e9', category: 'bus', subCategory: 'local', name: '9E - Chinna Veerampattinam/Gorimedu MGPGI',
        from: 'Chinna Veerampattinam', to: 'Gorimedu MGPGI', via: ['Town'],
        routeStops: ['Chinna Veerampattinam', 'Ariankuppam', 'Town Center', 'JIPMER', 'Gorimedu MGPGI'],
        baseFare: 10, farePerStop: 3,
        frequency: '20 mins', duration: '30 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e10a', category: 'bus', subCategory: 'local', name: '10EA - JIPMER-Auroville-Kottakuppam',
        from: 'JIPMER', to: 'Kottakuppam', via: ['Auroville', 'Pondicherry University'],
        routeStops: ['JIPMER', 'Gorimedu', 'Kalapet', 'Pondicherry University', 'Auroville', 'Kottakuppam'],
        baseFare: 15, farePerStop: 3,
        frequency: '25 mins', duration: '35 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e10b', category: 'bus', subCategory: 'local', name: '10EB - JIPMER-Auroville-Kottakuppam',
        from: 'JIPMER', to: 'Kottakuppam', via: ['Auroville'],
        routeStops: ['JIPMER', 'Gorimedu', 'Auroville', 'Kottakuppam'],
        baseFare: 15, farePerStop: 3,
        frequency: '30 mins', duration: '35 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e11a', category: 'bus', subCategory: 'local', name: '11EA - Villianur/Mettupalayam',
        from: 'Villianur', to: 'Mettupalayam', via: ['Town Center'],
        routeStops: ['Villianur', 'Arumparthapuram', 'Moolakulam', 'Town Center', 'Mettupalayam'],
        baseFare: 10, farePerStop: 2,
        frequency: '20 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '5:30 AM - 10:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e11b', category: 'bus', subCategory: 'local', name: '11EB - Villianur/Mettupalayam',
        from: 'Villianur', to: 'Mettupalayam', via: ['Alternate'],
        routeStops: ['Villianur', 'Ozhukarai', 'Mettupalayam'],
        baseFare: 10, farePerStop: 2,
        frequency: '25 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '5:30 AM - 10:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e12a', category: 'bus', subCategory: 'local', name: '12EA - Veerampattinam/Gorimedu',
        from: 'Veerampattinam', to: 'Gorimedu', via: ['Main Road'],
        routeStops: ['Veerampattinam', 'Murungapakkam', 'Town Center', 'JIPMER', 'Gorimedu'],
        baseFare: 10, farePerStop: 2,
        frequency: '20 mins', duration: '30 mins',
        price: '₹12 - ₹18', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e12b', category: 'bus', subCategory: 'local', name: '12EB - Veerampattinam/Gorimedu',
        from: 'Veerampattinam', to: 'Gorimedu', via: ['ECR'],
        routeStops: ['Veerampattinam', 'Ariankuppam', 'New Bus Stand', 'Gorimedu'],
        baseFare: 10, farePerStop: 2,
        frequency: '25 mins', duration: '30 mins',
        price: '₹12 - ₹18', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e13', category: 'bus', subCategory: 'local', name: '13E - Thavalakuppam/Lawspet',
        from: 'Thavalakuppam', to: 'Lawspet', via: ['Government Colleges'],
        routeStops: ['Thavalakuppam', 'Ariankuppam', 'New Bus Stand', 'Government Colleges', 'Lawspet'],
        baseFare: 10, farePerStop: 2,
        frequency: '20 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e17a', category: 'bus', subCategory: 'local', name: '17EA - Nallavadu/Gorimedu-Veerampattinam',
        from: 'Nallavadu', to: 'Gorimedu', via: ['Veerampattinam'],
        routeStops: ['Nallavadu', 'Veerampattinam', 'Town Center', 'Gorimedu'],
        baseFare: 15, farePerStop: 3,
        frequency: '25 mins', duration: '35 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 8:30 PM', type: 'PRTC Electric'
    },
    {
        id: 'e17b', category: 'bus', subCategory: 'local', name: '17EB - Nallavadu/Gorimedu-Veerampattinam',
        from: 'Nallavadu', to: 'Gorimedu', via: ['Veerampattinam Alt'],
        routeStops: ['Nallavadu', 'Thavalakuppam', 'Veerampattinam Alt', 'Gorimedu'],
        baseFare: 15, farePerStop: 3,
        frequency: '30 mins', duration: '35 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 8:30 PM', type: 'PRTC Electric'
    },
    {
        id: 'e18', category: 'bus', subCategory: 'local', name: '18E - PIMS/Karikalampakkam/Gorimedu',
        from: 'PIMS', to: 'Gorimedu', via: ['Karikalampakkam'],
        routeStops: ['PIMS', 'Kalapet', 'Karikalampakkam', 'Villianur', 'Gorimedu'],
        baseFare: 15, farePerStop: 3,
        frequency: '25 mins', duration: '30 mins',
        price: '₹15 - ₹20', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e19', category: 'bus', subCategory: 'local', name: '19E - Pudhukuppam/PIMS',
        from: 'Pudhukuppam', to: 'PIMS', via: ['Medical College Route'],
        routeStops: ['Pudhukuppam', 'Bahour', 'Villianur', 'Medical College Route', 'PIMS'],
        baseFare: 15, farePerStop: 3,
        frequency: '20 mins', duration: '25 mins',
        price: '₹12 - ₹15', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },
    {
        id: 'e20', category: 'bus', subCategory: 'local', name: '20E - Pudhukuppam/Panithittu/PIMS',
        from: 'Pudhukuppam', to: 'PIMS', via: ['Panithittu'],
        routeStops: ['Pudhukuppam', 'Panithittu', 'Pondicherry University', 'PIMS'],
        baseFare: 15, farePerStop: 3,
        frequency: '25 mins', duration: '28 mins',
        price: '₹12 - ₹18', availability: '6:00 AM - 9:00 PM', type: 'PRTC Electric'
    },

    // --- INTERSTATE BUSES ---
    {
        id: 'b11', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Chennai',
        from: 'Puducherry Bus Stand', to: 'Chennai CMBT', via: ['Tindivanam', 'Chengalpattu', 'Tambaram'],
        frequency: '10-20/day', duration: '3.5 hrs',
        price: '₹180 - ₹350', availability: '5:00 AM - 11:00 PM', type: 'TNSTC / SETC / Private'
    },
    {
        id: 'b12', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Villupuram',
        from: 'Puducherry Bus Stand', to: 'Villupuram', via: ['Ariyur', 'Kandamangalam'],
        frequency: 'Very Frequent (5-10/day)', duration: '1 hr',
        price: '₹45', availability: '24 Hours', type: 'TNSTC'
    },
    {
        id: 'b13', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Cuddalore',
        from: 'Puducherry Bus Stand', to: 'Cuddalore', via: ['Mudaliarpet'],
        frequency: 'Frequent (5-10/day)', duration: '1.5 hrs',
        price: '₹50 - ₹80', availability: '6:00 AM - 9:00 PM', type: 'TNSTC'
    },
    {
        id: 'b14', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Tindivanam',
        from: 'Puducherry Bus Stand', to: 'Tindivanam', via: ['Ozhukarai'],
        frequency: 'Frequent', duration: '45 mins',
        price: '₹35 - ₹60', availability: '5:00 AM - 10:00 PM', type: 'TNSTC'
    },
    {
        id: 'b15', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Bangalore',
        from: 'Puducherry Bus Stand', to: 'Bangalore Majestic', via: ['Tindivanam', 'Tiruvannamalai', 'Hosur'],
        frequency: 'Multiple (2-6/day)', duration: '7 hrs',
        price: '₹450 - ₹800', availability: 'Evening / Night', type: 'Private / TNSTC'
    },
    {
        id: 'b16', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Tiruvannamalai',
        from: 'Puducherry Bus Stand', to: 'Tiruvannamalai', via: ['Gingee'],
        frequency: 'Daily', duration: '3 hrs',
        price: '₹120 - ₹200', availability: '6:00 AM - 8:00 PM', type: 'TNSTC'
    },
    {
        id: 'b17', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Trichy',
        from: 'Puducherry Bus Stand', to: 'Trichy', via: ['Villupuram', 'Ariyalur'],
        frequency: 'Daily (2-6/day)', duration: '5 hrs',
        price: '₹200 - ₹400', availability: '6:00 AM - 10:00 PM', type: 'Private / TNSTC'
    },
    {
        id: 'b18', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Salem',
        from: 'Puducherry Bus Stand', to: 'Salem', via: ['Villupuram', 'Kallakurichi'],
        frequency: 'Occasional', duration: '5 hrs',
        price: '₹250 - ₹450', availability: 'Limited', type: 'Private / TNSTC'
    },
    {
        id: 'b19', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Coimbatore',
        from: 'Puducherry Bus Stand', to: 'Coimbatore', via: ['Villupuram', 'Salem', 'Erode'],
        frequency: 'Occasional', duration: '8 hrs',
        price: '₹400 - ₹700', availability: 'Limited', type: 'Private'
    },
    {
        id: 'b20', category: 'bus', subCategory: 'interstate', name: 'Puducherry - Chennai (Volvo / AC)',
        from: 'Puducherry Bus Stand', to: 'Chennai CMBT', via: ['Tindivanam', 'Chengalpattu'],
        frequency: 'Several/day', duration: '3 hrs',
        price: '₹300 - ₹500', availability: '5:00 AM - 11:00 PM', type: 'Private Volvo'
    },

    // --- TRAIN ---
    // REAL PUDUCHERRY (PDY) TRAINS

    // INCOMING TO PDY
    {
        id: 't1', category: 'train', type: 'route', name: 'Chennai Egmore - Puducherry Express', number: '16115',
        from: 'Chennai Egmore (MS)', to: 'Puducherry (PDY)', departure: '18:10', arrival: '22:15',
        duration: '4h 05m', frequency: 'Daily', classes: ['2S', 'SL', 'CC'], subCategory: 'Express',
        price: '₹120 - ₹600', availability: 'Daily'
    },
    {
        id: 't2', category: 'train', type: 'route', name: 'New Delhi - Puducherry SF Express', number: '22404',
        from: 'New Delhi (NDLS)', to: 'Puducherry (PDY)', departure: '23:15', arrival: '13:20 (Day 3)',
        duration: '38h 05m', frequency: 'Sun, Wed', classes: ['1A', '2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹950 - ₹5800', availability: 'Wed, Sun'
    },
    {
        id: 't3', category: 'train', type: 'route', name: 'Yesvantpur - Puducherry Weekly Express', number: '16573',
        from: 'Yesvantpur Jn (YPR)', to: 'Puducherry (PDY)', departure: '20:45', arrival: '07:15',
        duration: '10h 30m', frequency: 'Fri', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹450 - ₹1800', availability: 'Friday'
    },
    {
        id: 't4', category: 'train', type: 'route', name: 'Dadar - Puducherry Chalukya Express', number: '11005',
        from: 'Dadar (DR)', to: 'Puducherry (PDY)', departure: '21:30', arrival: '07:15 (Day 3)',
        duration: '33h 45m', frequency: 'Sun, Mon, Tue', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹750 - ₹2800', availability: 'Sun, Mon, Tue'
    },
    {
        id: 't5', category: 'train', type: 'route', name: 'Howrah - Puducherry SF Express', number: '12867',
        from: 'Howrah Jn (HWH)', to: 'Puducherry (PDY)', departure: '23:25', arrival: '08:50 (Day 3)',
        duration: '33h 25m', frequency: 'Sun', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹850 - ₹3200', availability: 'Sunday'
    },
    {
        id: 't6', category: 'train', type: 'route', name: 'Mangaluru Central - Puducherry Express', number: '16856',
        from: 'Mangaluru Cntl (MAQ)', to: 'Puducherry (PDY)', departure: '16:35', arrival: '10:00 (Next Day)',
        duration: '17h 25m', frequency: 'Fri', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹400 - ₹1600', availability: 'Friday'
    },

    // OUTGOING FROM PDY
    {
        id: 't7', category: 'train', type: 'route', name: 'Puducherry - Chennai Egmore Express', number: '16116',
        from: 'Puducherry (PDY)', to: 'Chennai Egmore (MS)', departure: '05:35', arrival: '09:25',
        duration: '3h 50m', frequency: 'Daily', classes: ['2S', 'CC'], subCategory: 'Express',
        price: '₹120 - ₹600', availability: 'Daily'
    },
    {
        id: 't8', category: 'train', type: 'route', name: 'Puducherry - New Delhi SF Express', number: '22403',
        from: 'Puducherry (PDY)', to: 'New Delhi (NDLS)', departure: '09:55', arrival: '00:20 (Day 3)',
        duration: '38h 25m', frequency: 'Wed', classes: ['1A', '2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹950 - ₹5800', availability: 'Wednesday'
    },
    {
        id: 't9', category: 'train', type: 'route', name: 'Puducherry - Yesvantpur Weekly Express', number: '16574',
        from: 'Puducherry (PDY)', to: 'Yesvantpur Jn (YPR)', departure: '21:00', arrival: '08:10 (Next Day)',
        duration: '11h 10m', frequency: 'Sun', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹450 - ₹1800', availability: 'Sunday'
    },
    {
        id: 't10', category: 'train', type: 'route', name: 'Puducherry - Dadar Chalukya Express', number: '11006',
        from: 'Puducherry (PDY)', to: 'Dadar (DR)', departure: '21:25', arrival: '05:40 (Day 3)',
        duration: '32h 15m', frequency: 'Tue, Wed, Sun', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹750 - ₹2800', availability: 'Tue, Wed, Sun'
    },
    {
        id: 't11', category: 'train', type: 'route', name: 'Puducherry - Howrah SF Express', number: '12868',
        from: 'Puducherry (PDY)', to: 'Howrah Jn (HWH)', departure: '14:15', arrival: '23:25 (Next Day)',
        duration: '33h 10m', frequency: 'Wed', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹850 - ₹3200', availability: 'Wednesday'
    },
    {
        id: 't12', category: 'train', type: 'route', name: 'Puducherry - Mangaluru Central Express', number: '16855',
        from: 'Puducherry (PDY)', to: 'Mangaluru Cntl (MAQ)', departure: '16:45', arrival: '09:30 (Next Day)',
        duration: '16h 45m', frequency: 'Thu', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹400 - ₹1600', availability: 'Thursday'
    },
    {
        id: 't13', category: 'train', type: 'route', name: 'Puducherry - Kanyakumari Express', number: '16861',
        from: 'Puducherry (PDY)', to: 'Kanyakumari (CAPE)', departure: '12:00', arrival: '02:00 (Next Day)',
        duration: '14h 00m', frequency: 'Thu', classes: ['2A', '3A', 'SL'], subCategory: 'Express',
        price: '₹350 - ₹1400', availability: 'Thursday'
    },

    {
        id: 'ts1', category: 'train', type: 'station', name: 'Puducherry Railway Station',
        code: 'PDY', address: 'Railway Station Road, near Botanical Garden', facilities: ['Waiting Room', 'Ticket Counter', 'Parking', 'Food Stalls']
    }
];

export async function seedTransitData(): Promise<void> {
    try {
        const transitRef = collection(db, 'transit');
        // Always seed to ensure updates
        console.log('Seeding transit data...');

        // Chunk logic for batch limits (though SEED_DATA is small, robust code handles >500)
        const CHUNK_SIZE = 450;
        for (let i = 0; i < SEED_DATA.length; i += CHUNK_SIZE) {
            const chunk = SEED_DATA.slice(i, i + CHUNK_SIZE);
            const batch = writeBatch(db);

            chunk.forEach((item) => {
                const docRef = doc(transitRef, item.id);
                batch.set(docRef, item);
            });

            await batch.commit();
            console.log(`Seeded batch ${i / CHUNK_SIZE + 1}`);
        }

        console.log('Transit data seeded successfully!');
    } catch (error) {
        console.error('Error seeding transit data:', error);
        throw error;
    }
}
