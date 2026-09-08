/**
 * Odora Elevation & Soft Layered Shadows
 * Warm, low-contrast shadows reflecting the olive/sage brand tone.
 */

import { Platform } from 'react-native';

export const shadows = {
  subtle: Platform.select({
    ios: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
    },
    android: {
      elevation: 1,
    },
    default: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
    },
  }),
  card: Platform.select({
    ios: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
    },
    android: {
      elevation: 2,
    },
    default: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
    },
  }),
  elevated: Platform.select({
    ios: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
    android: {
      elevation: 4,
    },
    default: {
      shadowColor: '#464F39',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 24,
    },
  }),
  powerGlow: Platform.select({
    ios: {
      shadowColor: '#7C8863',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 28,
    },
    android: {
      elevation: 6,
    },
    default: {
      shadowColor: '#7C8863',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.28,
      shadowRadius: 28,
    },
  }),
};
