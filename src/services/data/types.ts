
export interface Place {
    id: string;
    name: string;
    category: string;
    description: string;
    location: string;
    rating: number;
    image: string;
    tags: string[];
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    bestTime?: string;
    openTime?: string;
    entryFee?: string;
    gallery?: string[];
}

export interface AdventureActivity {
    "Activity Name"?: string;
    "Type"?: string;
    "Area"?: string;
    "Route/Location"?: string;
    "Google Maps Link"?: string;
    "Opening Time"?: number | string;
    "Closing Time"?: number | string;
    "Rental Available"?: string;
    "Price Range"?: string;
    "Best Time"?: string;
    "Safety Notes"?: string;
    "Contact Number"?: string;
    "Notes"?: string;
}

export interface NaturePlace {
    name?: string;
    type?: string;
    location?: string;
    "Google maps"?: string;
    timing_weekday?: string;
    timing_weekend?: string;
    entry_fee?: string;
    facilities?: string;
    best_time?: string;
    description?: string;
    activities?: string;
    "contact number"?: string;
    authority?: string;
    restrictions?: string;
    "image url"?: string;
    crowd?: string;
    nearby?: string;
}

export interface PubAndBar {
    "Pub Name"?: string;
    "Type"?: string;
    "Music Type"?: string;
    "Area"?: string;
    "Google Maps Link"?: string;
    "Phone Number"?: number | string;
    "Opening Time"?: number | string;
    "Closing Time"?: number | string;
    "Happy Hours"?: string;
    "Entry Fee"?: string | number;
    "Age Restriction"?: string;
    "Dress Code"?: string;
    "Crowd Level"?: string;
    "Best Days"?: string;
    "Notes"?: string;
}

export interface RestaurantData {
    "Restaurant Name"?: string;
    "Menu card "?: string;
    Category?: string;
    "Main Cuisine"?: string;
    "Veg/NonVeg"?: string;
    Location?: string;
    "Google Maps Link"?: string;
    "Contact Number"?: number | string;
    Opening_Time?: string;
    Closing_Time?: string;
    Weekend_Timing?: string;
    "Price Range"?: string;
    Rating?: string | number;
    "Popular Dishes"?: string;
    Description?: string;
    "Tags (Select multiple)"?: string;
    Rooftop?: string;
    Cafe?: string;
    Bar?: string;
    "Family Friendly"?: string;
    Seafood?: string;
    Romantic?: string;
    Luxury?: string;
    "Budget Friendly"?: string;
    "Live Music"?: string;
    "Garden Seating"?: string;
    "Beach View"?: string;
    "Quick Bites"?: string;
    "Buffet Available"?: string;
    "Parking Available"?: string;
    "Air Conditioned"?: string;
    "Pet Friendly"?: string;
    "Kids Friendly"?: string;
}

export interface SosHospital {
    "Hospital Name"?: string;
    "Hospital Type"?: string;
    Speciality?: string;
    Area?: string;
    "Google Maps Link"?: string;
    "Phone Number"?: string;
    "Weekday Timings"?: string;
    "Weekend Timings"?: string;
    "Emergency 24x7"?: string;
    "Ambulance Available"?: string;
    Facilities?: string;
    "Nearest Landmark"?: string;
    "Crowd Level"?: string;
    "Best For"?: string;
    Notes?: string;
}

export interface PuducherryDataContent {
    AdventureActivities?: AdventureActivity[];
    Nature?: NaturePlace[];
    "Pubs & Bars"?: PubAndBar[];
    Restraunts?: RestaurantData[];
    Sos?: SosHospital[];
}
