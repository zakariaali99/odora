/**
 * Odora Typography Tokens
 * Geometric Sans Pairing: Tajawal for Arabic, Poppins for English.
 * Light/regular display headings, airy line heights, wide tracking for uppercase labels.
 */

export const typography = {
  fontFamily: {
    ar: {
      light: 'Tajawal_300Light',
      regular: 'Tajawal_400Regular',
      medium: 'Tajawal_500Medium',
      bold: 'Tajawal_700Bold',
    },
    en: {
      light: 'Poppins_300Light',
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semiBold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
  },
  fontSize: {
    hero: 32,
    title1: 26,
    title2: 22,
    title3: 18,
    body: 15,
    bodySm: 13,
    caption: 12,
    eyebrow: 11,
    tag: 10,
  },
  lineHeight: {
    hero: 40,
    title1: 34,
    title2: 28,
    title3: 24,
    body: 22,
    bodySm: 18,
    caption: 16,
    eyebrow: 14,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.8,
    eyebrow: 1.5, // 0.12 - 0.18em tracking
  },
};

export type Typography = typeof typography;
