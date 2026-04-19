export interface Place {
    id: string;
    name: string;
    category: string;
    description: string;
    location: string;
    rating: number;
    image: string;
    gallery?: string[];
    tags: string[];
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    bestTime: string;
    openTime: string;
    opening?: string; // For API compatibility
    entryFee?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
}
