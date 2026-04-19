export const typography = {
  // Brand Typography Scale
  hero: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36, color: '#0F172A' },
  title: { fontSize: 22, fontWeight: '600' as const, lineHeight: 28, color: '#0F172A' },
  subtitle: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26, color: '#0F172A' },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24, color: '#0F172A' },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: '#64748B' },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16, color: '#94A3B8' },

  // Legacy mappings to prevent breaking existings screens (mapping to closest match)
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  h4: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },

  bodyLarge: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },

  cardLabel: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  cardText: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20, color: '#64748B' },

  buttonText: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24, color: '#FFFFFF' },

  labelLarge: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  labelMedium: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  labelSmall: { fontSize: 12, fontWeight: '600' as const, lineHeight: 16 },
};
