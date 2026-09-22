---
name: Aura Botanical Luxury
colors:
  surface: '#fdf9f5'
  surface-dim: '#ddd9d6'
  surface-bright: '#fdf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ef'
  surface-container: '#f1ede9'
  surface-container-high: '#ebe7e4'
  surface-container-highest: '#e6e2de'
  on-surface: '#1c1c19'
  on-surface-variant: '#46483f'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f4f0ec'
  outline: '#76786e'
  outline-variant: '#c6c7bc'
  surface-tint: '#586244'
  primary: '#586244'
  on-primary: '#ffffff'
  primary-container: '#919c7a'
  on-primary-container: '#2a3319'
  inverse-primary: '#c0cba6'
  secondary: '#55633a'
  on-secondary: '#ffffff'
  secondary-container: '#d5e6b2'
  on-secondary-container: '#59683e'
  tertiary: '#5b6057'
  on-tertiary: '#ffffff'
  tertiary-container: '#94998f'
  on-tertiary-container: '#2c312a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce7c1'
  primary-fixed-dim: '#c0cba6'
  on-primary-fixed: '#161e07'
  on-primary-fixed-variant: '#404a2e'
  secondary-fixed: '#d8e9b5'
  secondary-fixed-dim: '#bccd9a'
  on-secondary-fixed: '#131f01'
  on-secondary-fixed-variant: '#3e4b25'
  tertiary-fixed: '#dfe4d9'
  tertiary-fixed-dim: '#c3c8be'
  on-tertiary-fixed: '#181d16'
  on-tertiary-fixed-variant: '#434840'
  background: '#fdf9f5'
  on-background: '#1c1c19'
  surface-variant: '#e6e2de'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 26px
    fontWeight: '400'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0.015em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Outfit
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.14em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  gutter-desktop: 2rem
  margin: 1.25rem
  margin-tablet: 2rem
  margin-desktop: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses quiet luxury, architectural balance, and sensorial calm. Designed for an intelligent connected fragrance device that doubles as a sculptural interior object, the interface embodies the core brand promise: *Scent of Atmosphere*. It unites organic nature with refined digital precision.

The visual tone draws heavily from **Warm Minimalism** paired with tactile editorial grace. The design rejects sterile, cold IoT aesthetics in favor of an artisanal sanctuary:
- **Atmospheric Whitespace:** Generous negative space that allows photographic hardware imagery and delicate controls to breathe.
- **Natural Tactility:** Soft, pill-shaped control surfaces, gentle pill enclosures, and warm stone-like surfaces that evoke alabaster, travertine, and matte ceramics.
- **Subtle Precision:** Refined hairline dividers and geometric clarity communicating bespoke engineering without visual clutter.
- **Emotional Resonance:** Inspiring an immediate sense of relaxation, grounding, and modern sophistication.

## Colors

The color palette is derived directly from the brand book, rooted in organic botanical hues and warm mineral neutrals.

### Palette Architecture
- **Primary (`#919c7a` - Forest Sage / Olive):** The anchor tone representing natural calm and botanical oils. Used for brand identity elements, active states, key toggles, and primary illustrative accents.
- **Secondary (`#e1f2bd` - Soft Cream Lime):** An airy, fresh accent color used sparingly for illuminated state badges, gentle highlight glow states, active mist intensity pills, and high-touch interactive accents.
- **Tertiary (`#232821` - Deep Slate Charcoal):** A deep, warm carbon tone providing high-contrast editorial hierarchy for primary typography, dominant power controls, and crisp tactile buttons.
- **Neutral Canvas (`#f4f0ec` - Warm Alabaster):** The base atmospheric surface. It provides warmth and softness, eliminating stark cold whites.
- **Surface Neutrals (`#faf8f5` / `#ebe6e0`):** Stratified card layers for elevated UI components and nested containers.
- **Hairline Borders (`rgba(35, 40, 33, 0.08)`): Extremely delicate separation lines to maintain pure lightness.

## Typography

The typographic expression mirrors the geometric balance of *Geomini* with modern, highly legible sans-serif pairings:
- **Display & Headline Voice (Outfit):** Clean, structural geometric construction with open circular counters that harmonize with circular diffuser hardware and rounded iconography. Relaxed letter-spacing provides an elevated, gallery-like poise.
- **Body Text & Readout Flow (Plus Jakarta Sans):** Crafted for effortless readability on compact touchscreens, handling telemetry, oil percentages, and schedule details without visual strain.
- **Uppercase Micro-Labels:** Used for category flags, status labels, and architectural subheadings (e.g., `SCENT OF ATMOSPHERE`), tracked out cleanly (`+0.08em` to `+0.14em`) to establish editorial rhythm.

## Layout & Spacing

The layout is built around a centralized single-column focus for mobile hardware controls, scaling up to a balanced fluid column grid on larger touchpads and web interfaces.

### Grid & Margins
- **Mobile (Default Canvas):** 4-column fluid layout with a `1.25rem` screen margin and `1rem` internal gutters. Hardware cards span the full 4 columns, preserving clear vertical stacks for tactile thumb reach.
- **Tablet & Wall Panels (640px – 1024px):** 8-column layout with `2rem` margins, allowing simultaneous device telemetry and schedule editing side-by-side.
- **Desktop & Hubs (>1024px):** 12-column layout with `3.5rem` margins and max-width containers locked to `1200px` to maintain focused white space and prevent control dispersion.

### Layout Principles
- **Uncluttered Air:** Generous vertical padding (`space-xl`) between hardware representations and controller sliders creates the feeling of an artful physical catalog.
- **Thumb Zone Ergonomics:** Power toggles, intensity sliders, and chamber selector pills sit consistently in the lower half of the screen.

## Elevation & Depth

This design system avoids harsh drop shadows and heavy skeuomorphism, opting for **Tonal Stratification and Diffused Ambient Lighting**.

### Layering Rules
- **Base Ambient Layer:** `#f4f0ec` (Warm Alabaster).
- **Surface Level 1 (Cards & Modules):** `#faf8f5` or `#ffffff` with a subtle 1px border (`rgba(35, 40, 33, 0.05)`).
- **Surface Level 2 (Nested Control Pills & Lists):** `#ebe6e0` or `#f4f0ec` for recessed tracks and segmented toggles.
- **Active Ambient Depth:** When controls or cards are elevated, they cast an ultra-soft, warm shadow:
  `box-shadow: 0 12px 32px -8px rgba(35, 40, 33, 0.06), 0 4px 12px -2px rgba(35, 40, 33, 0.03)`.
- **Frosted Translucency:** Modal sheets and floating glass navigation bars employ backdrop blur (`backdrop-filter: blur(16px)`) with `rgba(244, 240, 236, 0.85)` fill, blending digital controls seamlessly with hardware product photography.

## Shapes

The shape system adopts smooth, organic curvature directly inspired by the cylindrical, soft-shouldered silhouette of the diffuser:
- **Pill Philosophy (Level 3):** Buttons, segmented switches, slider thumbs, and status indicators employ pure pill curvature (`rounded-full` / `9999px`).
- **Surface Containers:** Cards, control modules, and floating dialog sheets use generous rounded corners (`1.5rem` to `2rem`) to echo the soft, ceramic body of the product.
- **Tactile Inputs:** Sliders and gauge rings retain concentric organic circular profiles, avoiding sharp 90-degree junctions across the entire experience.

## Components

### Buttons
- **Primary Pill (Master Action):** Deep slate charcoal background (`#232821`), pure white text, fully rounded pill shape (`9999px`), height `56px` for touch accessibility. Features a subtle sage highlight on active press.
- **Secondary Pill:** Forest sage background (`#919c7a`), alabaster text (`#faf8f5`), height `48px`.
- **Soft Botanical Pill:** Soft cream lime background (`#e1f2bd`), dark slate text (`#232821`), used for subtle lifestyle prompts and activation triggers.
- **Ghost Pill:** Transparent background with a `1px` border in `rgba(35, 40, 33, 0.15)` and dark slate text.

### Tactile Slider & Controls
- **Diffuser Mist Slider:** A recessed pill track (`#ebe6e0`) with height `12px` or `40px` (for full-width capsule sliders). The filled portion uses primary forest sage (`#919c7a`), and the thumb is an oversized pill or circle with an ambient warm shadow.
- **Circular Gauge:** A fine ring displaying oil chamber capacity (0–100%) with stroke thickness `3px`, using `#919c7a` against a pale track (`rgba(145, 156, 122, 0.2)`).

### Cards & Containers
- **Device Control Card:** Enclosed in `#faf8f5` with corner radius `28px`, internal padding `space-lg`, and a hairline perimeter (`1px solid rgba(35, 40, 33, 0.05)`). Holds device render, chamber percentage, and quick-toggle toggles.
- **Scent Profile Card:** Minimalist vertical card with soft image header, title set in `headline-sm`, and fragrance notes set in tracked `label-sm`.

### Chips & Tags
- **Selection Chips:** Height `36px`, pill-shaped. Inactive: `#ebe6e0` with `#232821` typography. Active: `#919c7a` background with `#faf8f5` typography, or `#e1f2bd` with `#232821` typography for light intensity modes.

### Lists & Settings
- **Row Items:** Clean minimal rows (`height: 56px`) with generous internal padding, separated by soft hairline dividers (`rgba(35, 40, 33, 0.06)`). Trailing indicators feature lightweight chevron icons or concise values (e.g., "Medium", "2 Hours") set in muted slate (`rgba(35, 40, 33, 0.6)`).

### Input Fields
- **Search & Text Input:** Rounded pill enclosures (`border-radius: 9999px`), height `48px`, background `#faf8f5`, minimal border (`rgba(35, 40, 33, 0.1)`). Focus state transitions border to `#919c7a` with a subtle soft glow.