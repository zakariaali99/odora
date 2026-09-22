/**
 * Odora Typography Tokens
 * Source of Truth: 05-app-design-system.md §3
 * Display/Labels: Outfit
 * Body: Plus Jakarta Sans
 * Arabic placeholder: IBM Plex Sans Arabic
 */
import { TextStyle } from 'react-native';

export const fontFamilies = {
  latin: {
    displayLight: 'Outfit_300Light',
    displayRegular: 'Outfit_400Regular',
    displayMedium: 'Outfit_500Medium',
    displaySemiBold: 'Outfit_600SemiBold',
    bodyRegular: 'PlusJakartaSans_400Regular',
    bodyMedium: 'PlusJakartaSans_500Medium',
    bodySemiBold: 'PlusJakartaSans_600SemiBold',
  },
  arabic: {
    light: 'IBMPlexSansArabic_300Light',
    regular: 'IBMPlexSansArabic_400Regular',
    medium: 'IBMPlexSansArabic_500Medium',
    semiBold: 'IBMPlexSansArabic_600SemiBold',
    bold: 'IBMPlexSansArabic_700Bold',
  },
};

export interface TypographyTokens {
  display: TextStyle;
  headlineLg: TextStyle;
  headlineMd: TextStyle;
  headlineSm: TextStyle;
  bodyLg: TextStyle;
  bodyMd: TextStyle;
  bodySm: TextStyle;
  labelLg: TextStyle;
  labelMd: TextStyle;
  labelSm: TextStyle;
  numeric: TextStyle;
}

/**
 * Generates typography tokens adjusted for language/script direction.
 * RTL (Arabic): No letter-spacing and no uppercase text.
 */
export function getTypography(isRTL: boolean = false): TypographyTokens {
  const arabic = fontFamilies.arabic;
  const latin = fontFamilies.latin;

  if (isRTL) {
    return {
      display: {
        fontFamily: arabic.regular,
        fontSize: 36,
        lineHeight: 46,
        fontWeight: '400',
        letterSpacing: 0,
      },
      headlineLg: {
        fontFamily: arabic.regular,
        fontSize: 26,
        lineHeight: 36,
        fontWeight: '400',
        letterSpacing: 0,
      },
      headlineMd: {
        fontFamily: arabic.medium,
        fontSize: 22,
        lineHeight: 32,
        fontWeight: '500',
        letterSpacing: 0,
      },
      headlineSm: {
        fontFamily: arabic.medium,
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '500',
        letterSpacing: 0,
      },
      bodyLg: {
        fontFamily: arabic.regular,
        fontSize: 16,
        lineHeight: 28,
        fontWeight: '400',
        letterSpacing: 0,
      },
      bodyMd: {
        fontFamily: arabic.regular,
        fontSize: 14,
        lineHeight: 24,
        fontWeight: '400',
        letterSpacing: 0,
      },
      bodySm: {
        fontFamily: arabic.regular,
        fontSize: 12,
        lineHeight: 20,
        fontWeight: '400',
        letterSpacing: 0,
      },
      labelLg: {
        fontFamily: arabic.semiBold,
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '600',
        letterSpacing: 0,
      },
      labelMd: {
        fontFamily: arabic.medium,
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '500',
        letterSpacing: 0,
      },
      labelSm: {
        fontFamily: arabic.semiBold,
        fontSize: 10,
        lineHeight: 16,
        fontWeight: '600',
        letterSpacing: 0,
      },
      numeric: {
        fontFamily: latin.displayLight,
        fontSize: 56,
        lineHeight: 60,
        fontWeight: '300',
        letterSpacing: -1,
      },
    };
  }

  // English / Latin typography
  return {
    display: {
      fontFamily: latin.displayRegular,
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '400',
      letterSpacing: -0.5,
    },
    headlineLg: {
      fontFamily: latin.displayRegular,
      fontSize: 26,
      lineHeight: 34,
      fontWeight: '400',
      letterSpacing: -0.3,
    },
    headlineMd: {
      fontFamily: latin.displayMedium,
      fontSize: 22,
      lineHeight: 30,
      fontWeight: '500',
      letterSpacing: 0,
    },
    headlineSm: {
      fontFamily: latin.displayMedium,
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '500',
      letterSpacing: 0.18,
    },
    bodyLg: {
      fontFamily: latin.bodyRegular,
      fontSize: 16,
      lineHeight: 26,
      fontWeight: '400',
      letterSpacing: 0.16,
    },
    bodyMd: {
      fontFamily: latin.bodyRegular,
      fontSize: 14,
      lineHeight: 22,
      fontWeight: '400',
      letterSpacing: 0.21,
    },
    bodySm: {
      fontFamily: latin.bodyRegular,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '400',
      letterSpacing: 0.24,
    },
    labelLg: {
      fontFamily: latin.displaySemiBold,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      letterSpacing: 0.56,
    },
    labelMd: {
      fontFamily: latin.displayMedium,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.96,
    },
    labelSm: {
      fontFamily: latin.displaySemiBold,
      fontSize: 10,
      lineHeight: 14,
      fontWeight: '600',
      letterSpacing: 1.4,
      textTransform: 'uppercase',
    },
    numeric: {
      fontFamily: latin.displayLight,
      fontSize: 56,
      lineHeight: 60,
      fontWeight: '300',
      letterSpacing: -1.1,
    },
  };
}

export const typography = {
  ...getTypography(false),
  fontFamily: {
    ar: {
      light: fontFamilies.arabic.light,
      regular: fontFamilies.arabic.regular,
      medium: fontFamilies.arabic.medium,
      semiBold: fontFamilies.arabic.semiBold,
      bold: fontFamilies.arabic.bold,
    },
    en: {
      light: fontFamilies.latin.displayLight,
      regular: fontFamilies.latin.displayRegular,
      medium: fontFamilies.latin.displayMedium,
      semiBold: fontFamilies.latin.displaySemiBold,
      bold: fontFamilies.latin.displaySemiBold,
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
    eyebrow: 1.5,
  },
};
