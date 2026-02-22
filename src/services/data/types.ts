
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
