import Constants from 'expo-constants';

/**
 * Get Google API Key from Expo config
 */
export const getGoogleApiKey = (): string => {
  const apiKey = Constants.expoConfig?.extra?.googleApiKey;
  
  if (!apiKey) {
    console.warn('Google API Key not found in app.json');
    return '';
  }
  
  return apiKey;
};
