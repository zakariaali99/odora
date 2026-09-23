/**
 * Odora Radii Tokens
 * Source of Truth: 05-app-design-system.md §4
 */

export const radii = {
  xs: 4,
  sm: 8,
  md: 16,
  card: 32, // Authoritative Stitch 05b
  lg: 32,   // Authoritative Stitch 05b
  deviceCard: 32,
  xl: 32,
  pill: 999,
  full: 999,
} as const;

export type Radii = typeof radii;
