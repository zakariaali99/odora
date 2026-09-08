/**
 * Odora Brand Color Tokens
 * Extracted directly from design-reference/test.pdf and 01-design-system.md
 */

export const colors = {
  // Brand
  brandSage: '#919C7A', // Primary brand color (buttons, slider, accents, logo)
  brandPaleGreen: '#E1F2BD', // Secondary/accent, highlights, active fills
  brandOlive: '#464F39', // Deep olive (dark packaging, deep accents)

  // Neutral Canvas & Surfaces
  canvas: '#F4F0EC', // Warm cream background
  canvasTint: '#ECE7E1', // Subtle dark-cream tint for sections/borders
  surface: '#FFFFFF', // Clean white card surfaces
  surfaceSubtle: '#FBFAF7', // Soft off-white for secondary cards
  surfaceMuted: '#F0ECE6', // Muted card / track background

  // Ink / Typography
  inkPrimary: '#2B2B26', // Primary high-contrast text (near-black)
  inkSecondary: '#5C5C52', // Secondary readable text
  inkMuted: '#8A8A7E', // Muted text, captions, chevrons, labels
  inkLight: '#A8A89C', // Faint placeholders, dividers

  // Controls & Action
  controlDark: '#1C1C1A', // Dark power button / "Matte Black" colorway
  controlDarkHover: '#2A2A27',
  borderLight: '#E8E3DA', // Subtle warm border (Matte White colorway)
  borderFaint: 'rgba(70, 79, 57, 0.08)',

  // Status & Functional
  statusOn: '#919C7A', // Active diffuser running indicator (matches brandSage)
  warningAmber: '#D97706', // Low oil warning
  dangerRed: '#DC2626', // Error / disconnect

  // Product Colorways
  colorwaySage: '#919C7A',
  colorwayWhite: '#E8E3DA',
  colorwayBlack: '#1C1C1A',
};

export type Colors = typeof colors;
