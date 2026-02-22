export type TripType = 'Family' | 'Friends' | 'Honeymoon' | 'Solo' | 'Business + Leisure';
export type BudgetType = 'per person' | 'total';
export type TravelPace = 'Relaxed' | 'Balanced' | 'Fast-paced';
export type TransportType = 'Walk + Local Transport' | 'Bike rental' | 'Cab' | 'Mixed';
export type TripInterest = 'Beaches' | 'Heritage' | 'Spiritual' | 'Food & Cafes' | 'Nature' | 'Adventure' | 'Shopping';
export type StayArea = 'White Town' | 'Beach side' | 'City area' | 'Not decided';

export interface TripDraft {
    name: string;
    type: TripType;
    travelers: number;
    startDate: string;
    endDate: string;
    budgetAmount: number;
    budgetType: BudgetType;
    pace: TravelPace;
    interests: TripInterest[];
    stayArea: StayArea;
    transport: TransportType;
    // Enhancers
    mobilityDetails?: boolean;
    travelingWithKids?: boolean;
    travelingWithElderly?: boolean;
    preferredStartTime?: 'Morning' | 'Late Morning' | 'Afternoon';
}

export interface DayActivity {
    timeSlot: 'Morning' | 'Afternoon' | 'Evening';
    timeRange: string;
    placeName: string;
    description: string;
    travelTime: string;
    tips?: string;
}

export interface DailyItinerary {
    dayNumber: number;
    date: string;
    activities: DayActivity[];
    totalTravelTime: string;
    notes: string;
}

export interface GeneratedTrip extends TripDraft {
    id: string;
    userId: string;
    createdAt: any; // Firestore timestamp
    itinerary: DailyItinerary[];
    totalCostEstimate: string;
    status: 'draft' | 'confirmed';
    places?: number;
    image?: string;
}
