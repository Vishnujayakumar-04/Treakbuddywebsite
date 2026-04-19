// Define colors as immediate exports to prevent runtime errors

// Light theme colors object
const lightColorsObj = {
  primary: '#0F766E',      // Teal
  secondary: '#14B8A6',    // Light Teal
  accent: '#F59E0B',       // Warm travel orange
  background: '#F8FAFC',   // Light gray background
  cardBackground: '#FFFFFF', // White cards
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textMuted: '#94A3B8',
  success: '#22C55E',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.5)', // Slate overlay
  // Legacy mappings to prevent immediate breaking
  teal: '#0F766E',
  warning: '#F59E0B',
  error: '#EF4444',
  textLight: '#FFFFFF',
  info: '#3B82F6',
};

// Dark theme colors object
const darkColorsObj = {
  primary: '#0F766E',
  secondary: '#14B8A6',
  accent: '#F59E0B',
  background: '#0F172A',   // Slate 900
  cardBackground: '#1E293B', // Slate 800
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  success: '#22C55E',
  border: '#334155',
  divider: '#334155',
  overlay: 'rgba(0, 0, 0, 0.7)',
  // Legacy mappings
  teal: '#0F766E',
  warning: '#F59E0B',
  error: '#EF4444',
  textLight: '#FFFFFF',
  info: '#3B82F6',
};

// Export light colors as named export
export const lightColors = lightColorsObj;
export const darkColors = darkColorsObj;

// Export function to get colors based on theme
export function getColors(isDark: boolean = false) {
  return isDark ? darkColorsObj : lightColorsObj;
}

// Export colors (light theme) for backward compatibility
export const colors = lightColorsObj;

// Default export
export default lightColorsObj;
