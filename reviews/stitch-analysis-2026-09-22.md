# Stitch Output Analysis — Idea 01 vs Idea 02 (Mobile App)

**Date:** 2026-09-22 · **Source:** `design-reference/Idea-01.zip`, `design-reference/Idea-02.zip`
**Status:** Analysis only. Nothing here is approved for implementation yet. AG must NOT copy these screens as-is.

---

## 1. What is in the zips

| | Idea 01 | Idea 02 |
|---|---|---|
| Screens | 47 (HTML + PNG each) | 51 (HTML + PNG each) |
| Design system docs | `Atmospheric Serenity` | `Aura Botanical Luxury` (light) + `Evening Sanctuary Dark Luxury` (dark) |
| Extras | — | `interactive_prototype_hub` (clickable 42-screen hub) |
| Stack | Tailwind CDN + Material Symbols + inline JS | same |
| Scope | **Mobile app only** | **Mobile app only** |

The web platform (brand site + store + admin) is **not** in these exports.

---

## 2. Shared design language (stable in both = strong signal)

Both runs derived the same palette from the brand book:
- Canvas `#F4F0EC` (warm alabaster), cards white / `#FAF8F5`
- Primary sage `#919C7A`, light accent `#E1F2BD`, deep charcoal `#232821`–`#2D3329` for primary buttons and key text
- Muted text ~`#70756B`, hairline borders `rgba(35,40,33,.05–.10)`, very soft warm shadows
- Pill buttons and chips, large rounded cards, uppercase tracked micro-labels
- **Circular intensity gauge** as the device-control centrepiece
- 4-tab bottom navigation: Home · Devices · Store · Account
- Product photography inside soft cream frames

## 3. Differences

| Area | Idea 01 | Idea 02 |
|---|---|---|
| Display font | Space Grotesk (technical, quirky) | Outfit (rounded geometric, closer to the Geomini logo) |
| Body font | Plus Jakarta Sans | Plus Jakarta Sans |
| Radii | 8–24px | 16–48px (softer, more pill) |
| Density | Denser, more data per screen | Airier, more editorial, horizontal carousels |
| Motion | Tailwind pulse/ping/spin only | Custom keyframes: `subtleVapor` (mist), `gentle-pulse`, `shimmer-sweep`; animated skeletons |
| Dark mode | — | Full dark theme (sage + amber) |
| Unique ideas | Scent profile quiz, discovery bundles ("build your trio"), gift wrap, oil refill detail with note timeline, room "ping", diagnostics | Subscribe & save at checkout, choose free starter oil on PDP, floating "active · tap to pause" power pill, Face ID login, Arabic in settings, interactive error demo |

**Recommendation:** Idea 02 as the structural/visual base (cleaner, more premium, dark theme, real mist keyframes), plus these from Idea 01: device-control presets + modes, devices list density, schedule day-timeline, scent quiz, discovery bundles, gift wrap. Font: Outfit (+ an Arabic pair to be chosen).

---

## 4. Device reality check (BLE-only A316, no gateway)

Reference: Aroma-Link BLE protocol as implemented in `mr-sparks/scent-assistant`.

| Feature shown in Stitch | Reality | Decision |
|---|---|---|
| Power on/off | Supported | Build |
| Intensity (level 1–10) | Via spray/pause timing | Build (map levels → work/pause seconds) |
| Modes: Continuous / Interval | Via spray/pause timing | Build |
| Named schedules per weekday | Supported (per-day start/end, enable) — runs on the device itself | Build |
| Burst / Boost now | One-shot on *select* models | Verify on A316 |
| Fan | Aroma-Link models via BLE | Verify on A316 |
| Oil level % | Sensor on *select* models only | Verify; if absent show **estimate from runtime** |
| Phase + countdown (spraying/paused) | Supported | Build |
| Works without internet | True for BLE | Build ("local control" messaging) |
| Temperature / humidity / presence | No sensors | Remove |
| Warm glow LED | Only other models | Remove unless A316 has it |
| Night whisper / acoustic modes, dB claims | Not a controllable feature | Remove |
| Dual chamber / pods / slots, auto scent switching | A316 is single-bottle | Remove |
| Firmware OTA | Not in protocol | Remove / later if supplier provides |
| Cloud sync, BLE mesh, AES-256 claims | Not applicable | Remove |

---

## 5. Mockup content that must not ship

- **Wrong market:** USD/AED prices, UAE addresses, +971, Dubai/Zurich concierge, GCC wording, GDPR/UAE decree → LYD, Libyan cities, Libyan phone format, local policies.
- **Invented product names:** "Odora One", "Odora Air 01" → real model naming (A316) — owner decision.
- **Invented numbers:** ratings, review counts (128/184/428), warranty 2y/3y, 30-day trial, free express shipping, ml/hr figures → real data or owner decisions.
- **AI-generated images** (`lh3.googleusercontent.com`, may expire) → real product photos. One Idea 02 card even uses a brand-book page as a product image.
- **Copy tone:** "Sanctuary / Atelier / Concierge / Ritual" everywhere → tone down; final copy is Arabic-first anyway.
- **Navigation inconsistency:** tab labels/icons differ between screens; Idea 01 has a second tab set (Diffuser / Sanctuary / Curated); one Idea 02 screen has 5 tabs → one fixed tab bar.
- **"Cartridge" wording:** A316 uses an oil bottle.

---

## 6. New ideas — classification

**Build now (MVP):** intensity presets + modes · named routines · floating power pill · room chips · connection states (BT off / out of range / connecting) · offline local-control messaging · subscribe & save at checkout · choose free starter oil · oil level (real or estimated) + reorder · empty / loading / error states · WhatsApp support · Arabic toggle · system dark mode · "prepare your device for pairing" in order confirmation.

**Later:** scent profile quiz · discovery bundles / build-your-trio · gift wrap · structured reviews (quietness, intensity) · scent history · diagnostics · rooms "locate device" (if burst supported) · Face ID · return reasons.

**No (unless hardware proves otherwise):** sensors, LED glow, acoustic modes, multi-chamber, auto scent switching, cloud sync, OTA, mesh.

---

## 7. Data mapping (mockup → real)

| Area | Real source |
|---|---|
| Products, prices, categories, bundles | Backend `products` |
| Cart, checkout, orders, tracking | Backend `cart`, `orders` |
| Auth, profile, addresses | Backend `accounts` |
| Device state, intensity, modes, schedules | App `DeviceController` (Mock now, BLE later) |
| Rooms, device names | New: device registry on backend + local cache |
| Oil subscription / refill plan | New backend model |
| Reviews, wishlist | New backend models |
| Oil estimate | App: runtime × consumption rate (if no sensor) |

---

## 8. Open decisions for the owner

1. Base: Idea 02 + selected Idea 01 pieces — OK?
2. Font: Outfit — OK? (Arabic pair to pick.)
3. Confirm A316 capabilities on a real unit / with supplier: oil sensor, one-shot burst, fan, LED.
4. Business: product naming, warranty length, trial period, delivery fees, free starter oil.

After approval: `DESIGN-SYSTEM.md` (tokens + components), per-screen specs with data sources and states, then the AG plan.
