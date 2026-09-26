// Level → spray timing in seconds.
// PLACEHOLDER values until the supplier confirms the real Odora A316 timings.
// Change timings ONLY in this file.
export const INTENSITY_MAP: Record<number, { onSec: number; offSec: number }> = {
  1: { onSec: 5,  offSec: 180 },
  2: { onSec: 5,  offSec: 150 },
  3: { onSec: 10, offSec: 150 },
  4: { onSec: 10, offSec: 120 },
  5: { onSec: 15, offSec: 120 },
  6: { onSec: 15, offSec: 90 },
  7: { onSec: 20, offSec: 90 },
  8: { onSec: 20, offSec: 60 },
  9: { onSec: 30, offSec: 60 },
  10: { onSec: 30, offSec: 30 },
};

export const timingForLevel = (level: number) =>
  INTENSITY_MAP[Math.max(1, Math.min(10, Math.round(level)))];

/** Share of time spent spraying, 0..1. Used for the small progress bars. */
export const dutyCycle = (onSec: number, offSec: number) =>
  onSec + offSec === 0 ? 0 : onSec / (onSec + offSec);
