# PLAN 01 — Odora Design System

> **Type:** PLAN (implement as the app/store theme) + DESIGN reference.
> **Source:** extracted directly from `design-reference/test.pdf` (the official brand book). Values below are the real ones from the PDF.
> **Direction:** Premium, minimal, natural, elegant, calm. The app AND the store must feel this way.

---

## 1) Brand
- **Name / logo:** lowercase wordmark **`odora`** (with ®). The logo *is* the name — geometric, rounded, even strokes. No separate icon mark.
- **Tagline:** **SCENT OF ATMOSPHERE** (uppercase, wide letter-spacing, small, muted).
- **Positioning:** a premium home-fragrance brand that blends technology with elegant interior design.
- **Mission:** luxurious scent experiences through beautifully designed electronic diffusers.
- **Vision:** the leading premium diffuser brand in the Middle East, then global.
- **Keywords:** Minimal · Natural · Elegant · Consistent.

## 2) Color tokens (EXACT — from the PDF)
| Token | Hex | Use |
|---|---|---|
| `brand/sage` | `#919C7A` | Primary brand color (buttons, slider, accents, logo) |
| `brand/paleGreen` | `#E1F2BD` | Secondary/accent, highlights, active fills, on-dark text |
| `neutral/canvas` | `#F4F0EC` | App/store background (cream) |
| `neutral/surface` | `#FBFAF7`→`#FFFFFF` | Cards/sheets (near-white on the cream canvas) |
| `ink/primary` | `#2B2B26` | Primary text (near-black) |
| `ink/muted` | `#8A8A7E` | Secondary text, labels, chevrons |
| `brand/olive` | `#464F39` | Deep olive (dark packaging, dark sections) |
| `control/dark` | `#1C1C1A` | Power button / "Matte Black" colorway |
Product colorways to surface in the UI: **Sage Green**, **Matte White (`#E8E3DA`)**, **Matte Black (`#1C1C1A`)**.
Scents seen: **Forest Sage**, **Cotton Linen** (amber bottle, cream label).

## 3) Typography
- **Primary typeface:** **Geomini** (geometric sans). If unavailable in build/design tools, use the closest geometric fallback: **Poppins** (or Questrial / "Century Gothic"-like). Wordmark is lowercase.
- **Arabic:** pair with a clean geometric Arabic sans (Tajawal / IBM Plex Sans Arabic). Ensure RTL mirroring.
- **Eyebrows/labels:** UPPERCASE, wide tracking (~0.12–0.18em), small (matches "FOREST SAGE", "ELECTRONIC DIFFUSER", "SCENT OF ATMOSPHERE").
- **Headings:** light/regular weight, large, airy line-height (the PDF uses thin large display type). Avoid heavy bold in UI.

## 4) Shape, space, motion
- **Radius:** generous, soft — cards ~16–20px, pill buttons fully rounded (echoes the soft-cylinder product).
- **Spacing:** very airy; large margins; lots of negative space.
- **Elevation:** very soft, low-contrast shadows; tonal separation over hard borders.
- **Motion:** slow, gentle easing; calm. No bouncy animation.
- **Imagery:** natural photography — stone, linen, wood, foliage, muted warm light.

## 5) UI patterns (observed in the PDF app mockup — follow these)
- **Top bar:** back arrow · centered lowercase `odora` wordmark · search icon. Minimal, on cream.
- **Room/device card:** e.g. "Living Room — 100%", device hero image on a white rounded card.
- **Slider:** thin track, sage fill, round knob (intensity/mist).
- **Setting rows:** label left, value + `>` chevron right (Mist: Medium · Timer: 2 Hours · Light: Low). Rows on white, rounded, subtle dividers.
- **Primary action:** large **dark pill button** (near-black `#1C1C1A`) with a centered icon (power). High contrast against cream.
- **Overall:** iOS-like, rounded, spacious, quiet.

## 5b) Depth & richness (avoid over-minimalism)
The tokens above define the calm base; a finished screen also needs **depth, real imagery, and earned content** so it reads *curated luxury*, not *unfinished*. See **`03-design-elevation.md`** for the full directive — apply it to every screen.

## 6) Implementation
- Build a `theme/` module: `colors`, `typography`, `spacing`, `radii`, `shadows`. Screens consume tokens only (no hardcoded hex).
- Do this in **M1**, before screens. Keep `design-reference/test.pdf` open as the visual truth.
- A dark theme can lean on `brand/olive` / `control/dark` grounds with `brand/paleGreen` accents.

---
## Mobile app UI mockups (Claude Design canvas)
- **Link:** https://claude.ai/code/artifact/360ba338-1343-4fba-ba27-fbfd0e5ff40e
- **Screens:** Home · Device Control · Schedule · Shop · Product · Cart (static mockups, mobile-first).
- **Working source:** `design/canvas-src/*.dc.html` + `canvas.json` (re-seed to edit).
- **Next:** web store UI canvas.

## Web store UI (Claude Design canvas)
- **Link:** https://claude.ai/code/artifact/c3d7587b-897a-44c2-aedd-3599842a7a72
- **Screens:** Landing · Shop · Product · Cart (desktop 1440, static).
- **Source:** `design/store-src/*.dc.html`.

## Logo assets (extracted from test.pdf)
- `design-reference/odora-logo.png` (transparent, ~5500px) · `odora-logo.svg` (vector) · `odora-logo-tagline.png`.
- UI-size: `design/*/logo.png` (sage), `logo-cream.png` (for dark/on-device). Integrated into app + store nav.

## PNG exports (rendered)
- `design-reference/exports/app/*.png` (6 screens) · `design-reference/exports/store/*.png` (4 screens).
