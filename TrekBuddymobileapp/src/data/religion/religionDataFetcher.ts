// Static import for local JSON file
import templesData from '../temples.json';

export type ReligionType = 'Hindu' | 'Christian' | 'Muslim' | 'Jain' | 'Buddhist' | string;
export type SubType = string;

export interface ReligionPlace {
  id: string;
  name: string; // English (default)
  // Multi-language support
  nameTamil?: string; // தமிழ்
  nameHindi?: string; // हिंदी
  nameTelugu?: string; // తెలుగు
  nameMalayalam?: string; // മലയാളം
  nameKannada?: string; // ಕನ್ನಡ
  nameFrench?: string; // Français
  religion: ReligionType;
  subType: SubType;
  mainDeity: string; // Main Deity / Patron
  location: string; // Location / Area Name
  address?: string;
  mapsUrl: string; // Google Maps Link

  // New JSON format fields
  timing?: string;
  contact?: string;
  price?: string;
  bestTime?: string;
  features?: string[];
  festivals?: string[];
  rules?: string[];
  image?: string;

  // Keep Old fields just in case
  openingTimeWeekdays?: string;
  closingTimeWeekdays?: string;
  openingTimeWeekends?: string;
  closingTimeWeekends?: string;
  description?: string; // Detailed Description / History (English - default)
  // Multi-language descriptions
  descriptionTamil?: string; // தமிழ்
  descriptionHindi?: string; // हिंदी
  descriptionTelugu?: string; // తెలుగు
  descriptionMalayalam?: string; // മലയാളം
  descriptionKannada?: string; // ಕನ್ನಡ
  descriptionFrench?: string; // Français
  images?: string[]; // Array of image URLs (minimum 2-3)
  entryFee?: string; // Usually "Free"
  dressCode?: string; // Dress Code
  phoneNumber?: string; // Phone Number (MANDATORY)
  crowdLevel?: 'Low' | 'Medium' | 'High' | string;
  famousMonths?: string; // Famous Month(s) in English + Tamil
  specialOccasions?: string; // Special Occasions / Festivals
  rating?: number | null;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Get all religion data
 */
export async function getAllReligionData(): Promise<ReligionPlace[]> {
  try {
    const data = templesData as unknown as ReligionPlace[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn('Failed to load temples data:', error);
    return [];
  }
}

/**
 * Get sub-types for a religion dynamically
 */
export function getSubTypesForReligion(religion: ReligionType): SubType[] {
  try {
    const data = templesData as unknown as ReligionPlace[];
    const subTypes = data.filter(p => p.religion === religion).map(p => p.subType);
    return Array.from(new Set(subTypes)).filter(Boolean);
  } catch (error) {
    console.warn(`Failed to get subtypes for ${religion}:`, error);
    return [];
  }
}

