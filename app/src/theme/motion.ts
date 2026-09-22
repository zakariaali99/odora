/**
 * Odora Motion Tokens
 * Source of Truth: 05-app-design-system.md §5
 */
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const motion = {
  fast: 150,   // Press feedback
  base: 250,   // Toggles, chips, tab switch
  slow: 400,   // Sheets, screen entrance
  mist: 4500,  // Mist loop: 4.5s
  pulse: 3200, // Status pulse: 3.2s
  shimmer: 2200, // Skeleton sweep: 2.2s
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

/**
 * Hook to respect system accessibility setting for reduced motion
 */
export function useReducedMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
