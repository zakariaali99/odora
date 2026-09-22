/**
 * Odora Spacing Tokens
 * Source of Truth: 05-app-design-system.md §4
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48, // Compatibility alias
  
  // Semantic layout measurements
  screenMargin: 20,
  cardPadding: 24,
  cardPaddingCompact: 16,
  touchTargetMin: 44,
} as const;

export type Spacing = typeof spacing;
