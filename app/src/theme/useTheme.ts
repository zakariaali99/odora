/**
 * Odora Theme Hook
 * Provides reactive theme tokens based on current mode (system / light / dark) and script direction (RTL / LTR).
 */
import { useColorScheme } from 'react-native';
import { useAppStore, ThemeMode } from '../store/useAppStore';
import { lightColors, darkColors, ColorTokens } from './colors';
import { getTypography, TypographyTokens } from './typography';
import { spacing, Spacing } from './spacing';
import { radii, Radii } from './radii';
import { lightElevation, darkElevation } from './elevation';
import { motion } from './motion';

export interface Theme {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: Spacing;
  radii: Radii;
  elevation: typeof lightElevation;
  motion: typeof motion;
  isDark: boolean;
  themeMode: ThemeMode;
  isRTL: boolean;
  setThemeMode: (mode: ThemeMode) => void;
}

export function useTheme(): Theme {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppStore((s) => s.themeMode);
  const setThemeMode = useAppStore((s) => s.setThemeMode);
  const isRTL = useAppStore((s) => s.isRTL);

  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;
  const typography = getTypography(isRTL);
  const elevation = isDark ? darkElevation : lightElevation;

  return {
    colors,
    typography,
    spacing,
    radii,
    elevation,
    motion,
    isDark,
    themeMode,
    isRTL,
    setThemeMode,
  };
}
