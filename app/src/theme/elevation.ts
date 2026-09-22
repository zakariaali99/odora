/**
 * Odora Elevation and Shadow Tokens
 * Source of Truth: 05-app-design-system.md §4
 */
import { ViewStyle } from 'react-native';

export interface ElevationStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export const lightElevation = {
  // e1: Cards
  e1: {
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 1,
  } as ViewStyle,

  // e2: Floating controls / tab bar / power pill
  e2: {
    shadowColor: '#232821',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.07,
    shadowRadius: 24,
    elevation: 4,
  } as ViewStyle,
};

export const darkElevation = {
  // Dark theme: soft subtle glow instead of shadow
  e1: {
    shadowColor: '#A3B88C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 1,
  } as ViewStyle,

  e2: {
    shadowColor: '#A3B88C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 4,
  } as ViewStyle,
};

export const elevation = lightElevation;
