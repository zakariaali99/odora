/**
 * Odora Theme Colors
 * Source of Truth: 05-app-design-system.md §2
 * Based on Idea 02 (Aura Botanical Luxury / Evening Sanctuary)
 */

export interface ColorTokens {
  bg: string;
  bgAlt: string;
  surface: string;
  surfaceLow: string;
  surfaceMuted: string;
  surfaceHigh: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  primary: string;
  primarySoft: string;
  accent: string;
  accentStrong: string;
  ink: string;
  onInk: string;
  onPrimary: string;
  thumb: string;
  warm?: string;
  success: string;
  warning: string;
  error: string;
  errorSoft: string;
  onError: string;
}

export const lightColors: ColorTokens = {
  bg: '#FDF9F5',
  bgAlt: '#F4F0EC',
  surface: '#FFFFFF',
  surfaceLow: '#F7F3EF',
  surfaceMuted: '#F1EDE9',
  surfaceHigh: '#EBE7E4',
  text: '#1C1C19',
  textMuted: '#46483F',
  textSubtle: '#76786E',
  border: 'rgba(35, 40, 33, 0.08)',
  primary: '#586244',
  primarySoft: '#919C7A',
  accent: '#D5E6B2',
  accentStrong: '#E1F2BD',
  ink: '#232821',
  onInk: '#FFFFFF',
  onPrimary: '#FFFFFF',
  thumb: '#FFFFFF',
  success: '#8FB27A',
  warning: '#B7892F',
  error: '#BA1A1A',
  errorSoft: '#FFDAD6',
  onError: '#FFFFFF',
};

export const darkColors: ColorTokens = {
  bg: '#111512',
  bgAlt: '#181D19',
  surface: '#181D19',
  surfaceLow: '#202621',
  surfaceMuted: '#202621',
  surfaceHigh: '#323632',
  text: '#F4F0EC',
  textMuted: '#C5C8C2',
  textSubtle: '#8F9287',
  border: 'rgba(163, 184, 140, 0.18)',
  primary: '#BED4A6',
  primarySoft: '#A3B88C',
  accent: '#374926',
  accentStrong: '#D4EABB',
  ink: '#F4F0EC',
  onInk: '#111512',
  onPrimary: '#111512',
  thumb: '#FFFFFF',
  warm: '#D4AF7A',
  success: '#A3B88C',
  warning: '#E7C08A',
  error: '#FFB4AB',
  errorSoft: '#93000A',
  onError: '#111512',
};

// Default export with compatibility mappings for existing screens
export const colors = {
  ...lightColors,
  canvas: lightColors.bg,
  canvasTint: lightColors.bgAlt,
  surfaceSubtle: lightColors.surfaceMuted,
  inkPrimary: lightColors.text,
  inkSecondary: lightColors.textMuted,
  inkMuted: lightColors.textSubtle,
  inkLight: lightColors.textSubtle,
  brandSage: lightColors.primarySoft,
  brandPaleGreen: lightColors.accent,
  brandOlive: lightColors.primary,
  controlDark: lightColors.ink,
  statusOn: lightColors.primarySoft,
  warningAmber: lightColors.warning,
  dangerRed: lightColors.error,
  borderLight: lightColors.border,
  borderFaint: lightColors.border,
  colorwaySage: '#919C7A',
  colorwayWhite: '#E8E3DA',
  colorwayBlack: '#1C1C1A',
};

export const withAlpha = (hexOrColor: string, alpha: number): string => {
  if (hexOrColor.startsWith('#')) {
    const clean = hexOrColor.slice(1);
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexOrColor;
};
