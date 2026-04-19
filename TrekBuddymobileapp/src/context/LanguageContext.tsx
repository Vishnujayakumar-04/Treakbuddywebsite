import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_STORAGE_KEY = '@trekbuddy:language';

// All major Indian languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// Basic translations - fallback to English if missing
const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure your preferences',
    'settings.theme': 'Theme',
    'settings.language': 'App Language',
    'settings.language.description': 'Select your preferred language for the app interface.',
    'settings.apiKey': 'Gemini API Key',
    'settings.apiKey.description': 'Enter your Google Gemini API key to enable AI travel recommendations. Get your key from Google AI Studio.',
    'settings.about': 'About TrekBuddy',
    'settings.about.description': 'TrekBuddy helps you discover amazing places in Pondicherry and plan unforgettable trips. The AI assistant provides personalized recommendations based on your interests.',
    'settings.version': 'Version 1.0.0',
    'settings.lightTheme': 'Light Theme',
    'settings.darkTheme': 'Dark Theme',
    'settings.saveKey': 'Save Key',
    'settings.saving': 'Saving...',
    'settings.saved': 'Saved',
    'settings.apiKey.info': 'Your API key is stored securely on your device and never shared.',
  },
  hi: {
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'अपनी प्राथमिकताएं कॉन्फ़िगर करें',
    'settings.theme': 'थीम',
    'settings.language': 'ऐप भाषा',
    'settings.language.description': 'ऐप इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें।',
  },
  ta: {
    'settings.title': 'அமைப்புகள்',
    'settings.subtitle': 'உங்கள் விருப்பத்தேர்வுகளை கட்டமைக்கவும்',
    'settings.theme': 'தீம்',
    'settings.language': 'ஆப் மொழி',
    'settings.language.description': 'ஆப் இடைமுகத்திற்கான உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்।',
  },
  te: {
    'settings.title': 'సెట్టింగ్‌లు',
    'settings.subtitle': 'మీ ప్రాధాన్యతలను కాన్ఫిగర్ చేయండి',
    'settings.theme': 'థీమ్',
    'settings.language': 'యాప్ భాష',
    'settings.language.description': 'యాప్ ఇంటర్‌ఫేస్ కోసం మీకు ఇష్టమైన భాషను ఎంచుకోండి।',
  },
  ml: {
    'settings.title': 'ക്രമീകരണങ്ങൾ',
    'settings.subtitle': 'നിങ്ങളുടെ മുൻഗണനകൾ കോൺഫിഗർ ചെയ്യുക',
    'settings.theme': 'തീം',
    'settings.language': 'ആപ്പ് ഭാഷ',
    'settings.language.description': 'ആപ്പ് ഇന്റർഫേസിനായി നിങ്ങളുടെ പ്രിയപ്പെട്ട ഭാഷ തിരഞ്ഞെടുക്കുക।',
  },
  kn: {},
  mr: {},
  bn: {},
  gu: {},
  pa: {},
  ur: {},
  or: {},
  as: {},
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: string) => string;
  getLanguageName: (code: LanguageCode) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [loading, setLoading] = useState(true);

  // Load language from AsyncStorage on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        setLanguageState(savedLanguage as LanguageCode);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLanguage = async (newLanguage: LanguageCode) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    saveLanguage(newLanguage);
  };

  // Translation function with fallback to English
  const t = (key: string): string => {
    const langTranslations = translations[language] || {};
    const englishTranslations = translations.en || {};
    
    // Try current language first
    if (langTranslations[key]) {
      return langTranslations[key];
    }
    
    // Fallback to English
    if (englishTranslations[key]) {
      return englishTranslations[key];
    }
    
    // If not found, return key itself
    return key;
  };

  // Get language name by code
  const getLanguageName = (code: LanguageCode): string => {
    const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
    return lang?.name || 'English';
  };

  // Don't render children until language is loaded
  if (loading) {
    return null;
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getLanguageName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

