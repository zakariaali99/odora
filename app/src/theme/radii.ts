/**
 * Odora Radii Tokens
 * Source of Truth: 05-app-design-system.md §4
 */

export const radii = {
  sm: 8,
  md: 16,
  card: 24, // Compatibility alias
  lg: 24,
  deviceCard: 28,
  xl: 32,
  pill: 999,
} as const;

export type Radii = typeof radii;
