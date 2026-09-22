/**
 * Odora Elevation & Soft Layered Shadows
 * Compatibility layer mapping to 05-app-design-system.md §4
 */
import { lightElevation, darkElevation } from './elevation';

export const shadows = {
  subtle: lightElevation.e1,
  card: lightElevation.e1,
  elevated: lightElevation.e2,
  powerGlow: lightElevation.e2,
};

export { lightElevation, darkElevation };
