// Complete Categories Data for TrekBuddy
// This file contains all 12 main categories used across the app

export interface Category {
  id: string;
  label: string;
  image: any;
  icon?: string;
  emoji?: string;
  count?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  label: string;
  image: any;
  parentId: string;
}

// Main Categories - 11 Categories (Parks moved to Nature subcategory)
export const ALL_CATEGORIES: Category[] = [
  // 1. Temples
  {
    id: 'temples',
    label: 'Temples',
    image: require('../../assets/assets/temple/Kamakshmi amman temple.jpg'),
    count: '17 places',
    subcategories: [
      { id: 'hindu-temples', label: 'Hindu Temples', image: require('../../assets/assets/temple/varadaraja-temple-pondi.jpg'), parentId: 'temples' },
      { id: 'churches', label: 'Churches', image: require("../../assets/assets/temple/st andrew's church.jpg"), parentId: 'temples' },
      { id: 'mosques', label: 'Mosques', image: require('../../assets/assets/spot/museum 2.jfif'), parentId: 'temples' },
      { id: 'jain-temples', label: 'Jain Temples', image: require('../../assets/assets/spot/museum 3.jfif'), parentId: 'temples' },
      { id: 'buddhist-temples', label: 'Buddhist Temples', image: require('../../assets/assets/spot/aayi mandapam.jfif'), parentId: 'temples' },
    ],
  },

  // 2. Beaches
  {
    id: 'beaches',
    label: 'Beaches',
    image: require('../../assets/assets/beaches/promenade beach.jpg'),
    count: '8 spots',
  },

  // 3. Restaurants & Dining
  {
    id: 'restaurants',
    label: 'Restaurants & Dining',
    image: require('../../assets/assets/stay/villa shanti.webp'),
    count: '15 spots',
    subcategories: [
      { id: 'fine-dining', label: 'Fine Dining', image: require('../../assets/assets/stay/villa shanti 2.webp'), parentId: 'restaurants' },
      { id: 'cafes', label: 'Cafes', image: require('../../assets/assets/stay/villa shanti 3.webp'), parentId: 'restaurants' },
      { id: 'street-food', label: 'Street Food', image: require('../../assets/assets/stay/ocean spray 2.jfif'), parentId: 'restaurants' },
      { id: 'seafood', label: 'Seafood', image: require('../../assets/assets/stay/ocean spray 3.jfif'), parentId: 'restaurants' },
      { id: 'vegetarian', label: 'Vegetarian', image: require('../../assets/assets/stay/ocean spray.jfif'), parentId: 'restaurants' },
    ],
  },

  // 5. Accommodation
  {
    id: 'accommodation',
    label: 'Accommodation',
    image: require('../../assets/assets/stay/accord.jfif'),
    count: '15 places',
    subcategories: [
      { id: 'hotels', label: 'Hotels', image: require('../../assets/assets/stay/accord 2.jfif'), parentId: 'accommodation' },
      { id: 'resorts', label: 'Resorts', image: require('../../assets/assets/stay/accord 3.jfif'), parentId: 'accommodation' },
      { id: 'homestays', label: 'Homestays', image: require('../../assets/assets/stay/le pondy 2.jfif'), parentId: 'accommodation' },
      { id: 'hostels', label: 'Hostels', image: require('../../assets/assets/stay/le pondy 3.jfif'), parentId: 'accommodation' },
      { id: 'guesthouses', label: 'Guest Houses', image: require('../../assets/assets/stay/le pondy.jfif'), parentId: 'accommodation' },
    ],
  },

  // 6. Pubs / Bars
  {
    id: 'pubs',
    label: 'Pubs / Bars',
    image: require('../../assets/assets/spot/casablanca.jfif'),
    count: '12 places',
    subcategories: [
      { id: 'pubs-bars', label: 'Pubs & Bars', image: require('../../assets/assets/spot/casablanca 2.jfif'), parentId: 'pubs' },
      { id: 'wine-bars', label: 'Wine Bars', image: require('../../assets/assets/spot/casablanca 3.jfif'), parentId: 'pubs' },
      { id: 'rooftop-bars', label: 'Rooftop Bars', image: require('../../assets/assets/spot/casablanca.jfif'), parentId: 'pubs' },
    ],
  },

  // 7. Shopping Places
  {
    id: 'shopping',
    label: 'Shopping Places',
    image: require('../../assets/assets/spot/sunday market.jfif'),
    count: '9 spots',
    subcategories: [
      { id: 'markets', label: 'Markets', image: require('../../assets/assets/spot/sunday market 2.jfif'), parentId: 'shopping' },
      { id: 'malls', label: 'Malls', image: require('../../assets/assets/spot/sunday market 3.jfif'), parentId: 'shopping' },
      { id: 'boutiques', label: 'Boutiques', image: require('../../assets/assets/spot/sunday market.jfif'), parentId: 'shopping' },
      { id: 'handicrafts', label: 'Handicrafts', image: require('../../assets/assets/spot/sunday market 2.jfif'), parentId: 'shopping' },
    ],
  },

  // 8. Photoshoot Locations
  {
    id: 'photoshoot', label: 'Photoshoot Locations', image: require('../../assets/assets/spot/white-town-walks.jfif'),
    count: '14 spots',
    subcategories: [
      { id: 'french-colony', label: 'French Colony', image: require('../../assets/assets/spot/white town walks 2.jfif'), parentId: 'photoshoot' },
      { id: 'heritage-buildings', label: 'Heritage Buildings', image: require('../../assets/assets/spot/white town walks 3.jfif'), parentId: 'photoshoot' },
      { id: 'beach-spots', label: 'Beach Spots', image: require('../../assets/assets/beaches/promenade beach.jpg'), parentId: 'photoshoot' },
      { id: 'sunrise-sunset', label: 'Sunrise/Sunset Points', image: require('../../assets/assets/beaches/serenity beach.jpg'), parentId: 'photoshoot' },
    ],
  },

  // 9. Theatres & Cinemas
  {
    id: 'theatres',
    label: 'Theatres & Cinemas',
    image: require('../../assets/assets/spot/museum.jfif'),
    count: '6 places',
    subcategories: [
      { id: 'movie-theatres', label: 'Movie Theatres', image: require('../../assets/assets/spot/museum 2.jfif'), parentId: 'theatres' },
      { id: 'multiplexes', label: 'Multiplexes', image: require('../../assets/assets/spot/museum 3.jfif'), parentId: 'theatres' },
      { id: 'drama-theatres', label: 'Drama Theatres', image: require('../../assets/assets/spot/museum.jfif'), parentId: 'theatres' },
    ],
  },

  // 10. Adventure & Outdoor Activities
  {
    id: 'adventure',
    label: 'Adventure & Outdoor',
    image: require('../../assets/assets/activity/mangrove kayaking.jfif'),
    count: '7 spots',
    subcategories: [
      { id: 'surfing', label: 'Surfing', image: require('../../assets/assets/adventure/beach surfing 2.jfif'), parentId: 'adventure' },
      { id: 'kayaking', label: 'Kayaking', image: require('../../assets/assets/activity/mangrove kayaking 2.jfif'), parentId: 'adventure' },
      { id: 'boating', label: 'Boating', image: require('../../assets/assets/activity/mangrove kayaking.jfif'), parentId: 'adventure' },
      { id: 'cycling', label: 'Cycling', image: require('../../assets/assets/activity/auroville-beach-cycling.jfif'), parentId: 'adventure' },
      { id: 'trekking', label: 'Trekking', image: require('../../assets/assets/activity/mangrove kayaking 3.jfif'), parentId: 'adventure' },
      { id: 'scuba-diving', label: 'Scuba Diving', image: require('../../assets/assets/activity/mangrove kayaking.jfif'), parentId: 'adventure' },
    ],
  },

  // 11. Nightlife & Evening Activities
  {
    id: 'nightlife',
    label: 'Nightlife & Evening',
    image: require('../../assets/assets/spot/casablanca 2.jfif'),
    count: '5+ spots',
    subcategories: [
      { id: 'night-markets', label: 'Night Markets', image: require('../../assets/assets/spot/sunday market.jfif'), parentId: 'nightlife' },
      { id: 'night-walks', label: 'Night Walks', image: require('../../assets/assets/spot/white-town-walks.jfif'), parentId: 'nightlife' },
      { id: 'live-music', label: 'Live Music', image: require('../../assets/assets/spot/casablanca 3.jfif'), parentId: 'nightlife' },
      { id: 'beach-bonfires', label: 'Beach Bonfires', image: require('../../assets/assets/beaches/serenity beach.jpg'), parentId: 'nightlife' },
    ],
  },

  // 12. Nature
  {
    id: 'nature',
    label: 'Nature',
    image: require('../../assets/assets/spot/botanical garden.jfif'),
    count: '5 spots',
    subcategories: [
      { id: 'parks', label: 'Parks', image: require('../../assets/assets/spot/botanical garden 2.jfif'), parentId: 'nature' },
      { id: 'botanical-gardens', label: 'Botanical Gardens', image: require('../../assets/assets/spot/botanical garden 2.jfif'), parentId: 'nature' },
      { id: 'mangroves', label: 'Mangroves', image: require('../../assets/assets/spot/botanical garden.jfif'), parentId: 'nature' },
      { id: 'backwaters', label: 'Backwaters', image: require('../../assets/assets/spot/botanical garden 2.jfif'), parentId: 'nature' },
      { id: 'bird-sanctuaries', label: 'Bird Sanctuaries', image: require('../../assets/assets/spot/botanical garden 3.jfif'), parentId: 'nature' },
      { id: 'lakes', label: 'Lakes & Ponds', image: require('../../assets/assets/spot/botanical garden.jfif'), parentId: 'nature' },
    ],
  },

  // 13. Events & Festivals
  {
    id: 'events',
    label: 'Events & Festivals',
    image: require('../../assets/assets/spot/barathi park.jfif'),
    count: 'Top Events',
  },
];

// Quick categories for Home screen (all 11 main categories in 2-column grid)
export const QUICK_CATEGORIES: Category[] = [
  ALL_CATEGORIES.find(c => c.id === 'temples')!,
  ALL_CATEGORIES.find(c => c.id === 'beaches')!,
  ALL_CATEGORIES.find(c => c.id === 'restaurants')!,
  ALL_CATEGORIES.find(c => c.id === 'accommodation')!,
  ALL_CATEGORIES.find(c => c.id === 'pubs')!,
  ALL_CATEGORIES.find(c => c.id === 'shopping')!,
  ALL_CATEGORIES.find(c => c.id === 'photoshoot')!,
  ALL_CATEGORIES.find(c => c.id === 'theatres')!,
  ALL_CATEGORIES.find(c => c.id === 'adventure')!,
  ALL_CATEGORIES.find(c => c.id === 'nightlife')!,
  ALL_CATEGORIES.find(c => c.id === 'nature')!,
  ALL_CATEGORIES.find(c => c.id === 'events')!,
];

// Featured categories for Explore screen
export const FEATURED_CATEGORIES: Category[] = [
  ALL_CATEGORIES.find(c => c.id === 'temples')!,
  ALL_CATEGORIES.find(c => c.id === 'beaches')!,
  ALL_CATEGORIES.find(c => c.id === 'restaurants')!,
  ALL_CATEGORIES.find(c => c.id === 'adventure')!,
  ALL_CATEGORIES.find(c => c.id === 'nature')!,
  ALL_CATEGORIES.find(c => c.id === 'nightlife')!,
];

// Get category by ID
export const getCategoryById = (id: string): Category | SubCategory | undefined => {
  // Check main categories
  const mainCategory = ALL_CATEGORIES.find(c => c.id === id);
  if (mainCategory) return mainCategory;

  // Check subcategories
  for (const category of ALL_CATEGORIES) {
    if (category.subcategories) {
      const subCategory = category.subcategories.find(s => s.id === id);
      if (subCategory) return subCategory;
    }
  }

  return undefined;
};

// Get all flat categories (including subcategories)
export const getAllFlatCategories = (): (Category | SubCategory)[] => {
  const flat: (Category | SubCategory)[] = [];

  for (const category of ALL_CATEGORIES) {
    flat.push(category);
    if (category.subcategories) {
      flat.push(...category.subcategories);
    }
  }

  return flat;
};

// Get parent category for a subcategory
export const getParentCategory = (subcategoryId: string): Category | undefined => {
  for (const category of ALL_CATEGORIES) {
    if (category.subcategories) {
      const found = category.subcategories.find(s => s.id === subcategoryId);
      if (found) return category;
    }
  }
  return undefined;
};
