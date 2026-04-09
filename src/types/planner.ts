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

export type SlotType =
  | "hotel_checkin"
  | "sunrise"
  | "breakfast"
  | "place"
  | "lunch"
  | "snack"
  | "sunset"
  | "dinner"
  | "night_activity"
  | "hotel_return";

export interface TripSlot {
  slotNumber: number;
  type: SlotType;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  tip?: string;
  travelToNext?: string;
}

export interface TripDay {
  dayNumber: number;
  date: string;
  dayTheme: string;
  estimatedCommute: string;
  slots: TripSlot[];
  daySummary: string;
}

export interface TripItinerary {
  tripTitle: string;
  tripSummary: string;
  totalDays: number;
  tripType: "Solo" | "Friends" | "Family" | "Couple";
  budget: string;
  accommodation: string;
  days: TripDay[];
  packingTips: string[];
  budgetBreakdown: {
    accommodation: string;
    food: string;
    transport: string;
    activities: string;
    total: string;
  };
}

export interface GeneratedTrip extends TripDraft {
    id: string;
    userId: string;
    createdAt: any; // Firestore timestamp
    itinerary: TripDay[];
    fullItinerary?: TripItinerary;
    totalCostEstimate: string;
    status: 'draft' | 'confirmed';
    places?: number;
    image?: string;
}
