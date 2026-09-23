# 05 — Odora App Design System (React Native)

**Status:** Approved direction (owner, 2026-09-22). Supersedes `01-design-system.md` and `03-design-elevation.md` **for the mobile app**.
**Source:** Stitch exports in `design-reference/stitch/idea-02/` (base) + selected pieces of `design-reference/stitch/idea-01/`. Design docs: `idea-02/aura_botanical_luxury/DESIGN.md` (light) and `idea-02/evening_sanctuary_dark_luxury/DESIGN.md` (dark).

> Do not embed the Stitch HTML/Tailwind. Translate each screen's structure 1:1 into React Native (see `08-screen-fidelity-rebuild.md`). All images in the exports are AI-generated placeholders — never ship them.

> ⚠️ **2026-09-22 correction:** sizes in §3 (typography), §4 (shape/spacing/elevation) and §6 (component sizes) were too large. **Use `05b-stitch-measured-spec.md` for all sizes** — it was measured from the real Stitch screens. Colors (§2) and rules here remain valid.

---

## 1. Decisions
- Base look: **Idea 02 (Aura Botanical Luxury)**.
- Display/labels font: **Outfit**. Body font: **Plus Jakarta Sans**.
- Arabic font: **pending owner choice**. Until then use **IBM Plex Sans Arabic** as the placeholder for both display and body in RTL. Keep it one token (`fonts.arabic*`) so it can be swapped in one place.
- Icons: **Material Symbols Outlined** (same set as the mockups), loaded with `expo-font`, weight 300–400.
- Themes: **light** (default) and **dark** (follows system setting; manual override in Settings).

## 2. Color tokens

Use semantic names in code. Never hard-code hex in screens.

| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | `#FDF9F5` | `#111512` | Screen background |
| `bgAlt` | `#F4F0EC` | `#181D19` | Section bands, recessed areas |
| `surface` | `#FFFFFF` | `#181D19` | Cards |
| `surfaceMuted` | `#F1EDE9` | `#202621` | Nested cards, tracks, inactive chips |
| `surfaceHigh` | `#EBE7E4` | `#323632` | Pressed / high containers |
| `text` | `#1C1C19` | `#F4F0EC` | Primary text |
| `textMuted` | `#46483F` | `#C5C8C2` | Secondary text |
| `textSubtle` | `#76786E` | `#8F9287` | Captions, timestamps |
| `border` | `rgba(35,40,33,0.08)` | `rgba(163,184,140,0.18)` | Hairlines |
| `primary` | `#586244` | `#BED4A6` | Filled primary accents, active text |
| `primarySoft` | `#919C7A` | `#A3B88C` | Brand sage: gauges, progress, active states |
| `accent` | `#D5E6B2` | `#374926` | Active chip bg, badges ("Misting now") |
| `accentStrong` | `#E1F2BD` | `#D4EABB` | Glow highlights |
| `ink` | `#232821` | `#F4F0EC` | Primary button background (light) |
| `onInk` | `#FFFFFF` | `#111512` | Text on `ink` |
| `warm` | — | `#D4AF7A` | Dark theme only: warm accents, low-oil warnings |
| `success` | `#8FB27A` | `#A3B88C` | Connected / online dot |
| `warning` | `#B7892F` | `#E7C08A` | Low oil, attention |
| `error` | `#BA1A1A` | `#FFB4AB` | Errors, destructive |
| `errorSoft` | `#FFDAD6` | `#93000A` | Error backgrounds |

Contrast rule: body text must pass WCAG AA on its background. `textSubtle` is for ≥12px captions only.

## 3. Typography

| Token | Font | Size / Line | Weight | Tracking |
|---|---|---|---|---|
| `display` | Outfit | 36 / 44 | 400 | -0.015em |
| `headlineLg` | Outfit | 26 / 34 | 400 | -0.01em |
| `headlineMd` | Outfit | 22 / 30 | 500 | 0 |
| `headlineSm` | Outfit | 18 / 26 | 500 | 0.01em |
| `bodyLg` | Plus Jakarta Sans | 16 / 26 | 400 | 0.01em |
| `bodyMd` | Plus Jakarta Sans | 14 / 22 | 400 | 0.015em |
| `bodySm` | Plus Jakarta Sans | 12 / 18 | 400 | 0.02em |
| `labelLg` | Outfit | 14 / 20 | 600 | 0.04em |
| `labelMd` | Outfit | 12 / 16 | 500 | 0.08em |
| `labelSm` (eyebrow, UPPERCASE) | Outfit | 10 / 14 | 600 | 0.14em |
| `numeric` (gauge number) | Outfit | 56 / 60 | 300 | -0.02em |

RTL: Arabic text uses the Arabic font token at the same sizes; **no letter-spacing and no uppercase** in Arabic. Numbers, prices and times stay LTR inside RTL layouts.

## 4. Shape, spacing, elevation

- Radius: `sm 8` · `md 16` · `lg 24` · `xl 32` · `device card 28` · `pill 999`. Buttons, chips, inputs and toggles are pills.
- Spacing scale: `4 · 8 · 16 · 24 · 40`. Screen margin **20**. Card padding **24** (compact widgets 16).
- Touch targets ≥ 44pt.
- Elevation (soft, warm): 
  - `e1` cards: `shadowColor #232821, opacity 0.04, radius 12, offset (0,4)`; Android `elevation 1`.
  - `e2` floating controls / tab bar / power pill: `opacity 0.07, radius 24, offset (0,12)`; Android `elevation 4`.
  - Dark theme: replace shadows with a subtle glow (`primarySoft` at 16% opacity) on active elements only.
- Frosted surfaces (tab bar, sheets): `expo-blur` intensity ~40 over `bg` at 85%.

## 5. Motion

Library: `react-native-reanimated` (already standard with Expo). Respect **Reduce Motion** (`AccessibilityInfo.isReduceMotionEnabled`): disable loops, keep only fades.

| Token | Value | Use |
|---|---|---|
| `fast` | 150ms | Press feedback |
| `base` | 250ms | Toggles, chips, tab switch |
| `slow` | 400ms | Sheets, screen entrance |
| `easing` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `mist` | 4.5s loop, translateY 0 → -8, scale 0.96 → 1.06, opacity 0.35 → 0.7 | Mist above the device while spraying (Stitch `subtleVapor`) |
| `pulse` | 3.2s loop, opacity 0.95 → 0.72 | "Misting now" dot, pairing radar |
| `shimmer` | 2.2s sweep | Skeletons |

Rules: mist animation runs **only when the real device state is spraying**; it stops when paused/off/disconnected. Press = scale 0.98 + `fast`.

## 6. Components (build once in `app/src/components/ui/`)

| Component | Spec |
|---|---|
| `Button` | Variants: `primary` (ink bg, onInk text, h56), `secondary` (primarySoft bg, h48), `soft` (accent bg, text), `ghost` (border only). Pill. Loading + disabled states. |
| `IconButton` | 44×44 circle, `surface` bg, `border`. |
| `Chip` | h36 pill. Inactive `surfaceMuted`; active `accent` + `text`. Optional count. |
| `SegmentedControl` | Pill track `surfaceMuted`, active segment `surface` + `e1`. Used for modes (Continuous / Interval). |
| `Card` | `surface`, radius 24 (device card 28), padding 24, `e1`, hairline `border`. |
| `IntensityGauge` | Ring 240pt, stroke 10, track `primarySoft` 20%, fill `primarySoft`. Center: `numeric` value + "/10" + caption. − / + IconButtons at the sides. Drag on ring optional (phase 2). |
| `PresetChips` | Gentle (2) · Medium (5) · Intense (8) · Boost (10). Selecting sets the gauge. Boost hidden if device has no burst capability — see capability flags. |
| `Slider` | Track h8 `surfaceMuted`, fill `primarySoft`, thumb 24 white + `e1`. |
| `Toggle` | Pill 52×32, on = `primary`. |
| `ListRow` | h56, leading icon, title, trailing value/chevron (mirrored in RTL), hairline divider. |
| `Input` | Pill h48 (text area radius 16), `surface`, `border`; focus border `primarySoft` + soft ring; error text below. |
| `BottomTabBar` | **Fixed, 4 tabs everywhere:** Home · Devices · Store · Account. Icons: `home`, `nest_remote` (or `air`), `storefront`, `person`. Active = `primary` icon + label. Frosted, `e2`. |
| `StatusPill` (floating) | Bottom-anchored above tab bar on Device Control: dot + "Diffuser active · tap to pause". `ink` bg. |
| `StatBlock` | Small card: label (labelSm), value (headlineSm), optional progress bar. |
| `ProductCard` | Image in cream frame (`bgAlt`, radius 16), eyebrow, name, price (LYD), add IconButton; optional tag (Sale / New). |
| `QuantityStepper` | − value +, pill. |
| `Badge` | Small pill: `accent` (active), `warning`, `error`. |
| `EmptyState` | Illustration or icon, title, one line, one action. |
| `Skeleton` | `bgAlt` blocks + shimmer. |
| `Banner` / `Toast` | Inline banner (info/warn/error) and bottom toast, auto-dismiss 4s. |
| `ConnectionState` | Full-screen or inline: Bluetooth off · Out of range · Connecting · Disconnected, each with one primary action. |
| `Sheet` | Bottom sheet, radius 32 top, frosted handle. |

## 7. Content & imagery rules
- Product photos: only real Odora photos from `frontend/public/photos/` (served from the backend media in production). Cream frame behind every cut-out.
- Tone: calm and clear. Drop the mockups' "Sanctuary / Atelier / Concierge / Ritual" vocabulary. Arabic copy is primary; English second.
- Currency LYD, Libyan cities, Libyan phone format (+218).
- Never show a number the system cannot measure (see `06-app-screen-specs.md` → capability flags).
