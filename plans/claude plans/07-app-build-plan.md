# 07 — Odora App Build Plan (Stitch redesign)

**Scope:** mobile app only (`app/`). The web store (`frontend/`) is **on hold — do not touch it**. Backend changes only where listed.
**Inputs:** `05-app-design-system.md`, `06-app-screen-specs.md`, `reviews/stitch-analysis-2026-09-22.md`, references in `design-reference/stitch/idea-02/` and `idea-01/`.
**Stay inside `/Users/zakaria/projects/antigravity/odora`.**

> ⚠️ **2026-09-22:** Phases 2–5 are now built the way `08-screen-fidelity-rebuild.md` describes (image-to-image against the Stitch screens, batch by batch, with side-by-side proofs). Phases 0–1 below stay as they are.

---

## Phase 0 — Stabilize (blocker)
1. Fix `npx tsc --noEmit` crash in `app/` (see `fix-2026-09-08-review-findings.md` → Fix 8). Pin Expo SDK + React Native + TypeScript to a **stable, mutually compatible** set (Expo's recommended versions via `npx expo install --fix`).
2. App must run on **web** (`expo start --web`) and **iOS simulator**.

**Accept:** `tsc --noEmit` passes, app boots on both targets, no red-box errors.

## Phase 1 — Foundation
1. Replace `app/src/theme/*` with the tokens in `05` (light + dark, semantic names, `useTheme()` hook, system dark mode + manual override).
2. Load fonts (Outfit, Plus Jakarta Sans, IBM Plex Sans Arabic placeholder) and Material Symbols Outlined via `expo-font`.
3. Build the UI kit in `app/src/components/ui/` (every component in `05 §6`), each with light/dark and RTL.
4. Navigation: `RootStack` + `MainTabs` with the **fixed 4-tab bar** (Home · Devices · Store · Account). Update `navigation/types.ts`.
5. i18n: all strings through `app/src/i18n` (ar + en), RTL via `I18nManager` with a reload prompt when switching language.
6. Motion tokens + `useReducedMotion()`.

**Accept:** a hidden `/dev/ui-kit` screen shows every component in light, dark, LTR and RTL. Screenshots attached.

## Phase 2 — Device core (Mock)
1. Extend `DeviceController` + `MockTransport` per `06 §3` (scan, multiple devices, mode, phase + countdown, capabilities, oil estimate). Add the Mock dev panel to flip capability flags and simulate: Bluetooth off, out of range, connecting, low oil.
2. `device/intensityMap.ts` (levels 1–10 → spray on/off seconds, placeholder values).
3. Screens 9–17 from `06` (Home, Devices, Device Control, Pairing, Connection states, Schedule, Rooms, Device Settings, Troubleshooting).
4. Backend: device registry + rooms + schedule backup (new app or inside `accounts`), JWT-protected.

**Accept:** full flow on Mock — pair → name/room → control (gauge, presets, modes, power) → schedule → rename/remove. Mist animates only while spraying. Every capability flag combination renders correctly. No fake sensor data anywhere.

## Phase 3 — Store & checkout
1. Screens 18–26. Real products from the backend (`/api/v1/products`, categories). Real photos only.
2. Backend: `/api/v1/config/` (business config from `06 §1.3`, placeholders), Libyan cities + delivery fees, COD as default payment.
3. Cart → checkout → order creation → confirmation with the pairing-prep guide.

**Accept:** place a COD order end-to-end against the local backend; prices in LYD; config values change the UI without code changes.

## Phase 4 — Account & auth
1. Screens 1–8 and 27–36 (auth, primers, account, orders + tracking, scent library, notifications, settings, profile & security, addresses, help with WhatsApp, legal + **delete account**).
2. Refill plan (29) and Reviews (22–23) behind feature flags until their backend models exist.

**Accept:** sign up → verify → login → edit profile → change password → delete account works; orders list matches backend.

## Phase 5 — System states & QA
1. Screens 38–41 applied across the app (empty, skeleton, offline, error, maintenance).
2. QA matrix: every main screen × light/dark × AR/EN × small (SE) / large (Pro Max) phone. Screenshots in `reviews/qa-app-<date>/`.

**Accept:** matrix complete, `tsc` clean, no hard-coded strings, colors or prices in screens.

---

## Rules (errors to avoid)
- Do not embed Stitch HTML/Tailwind (no WebView, no web CSS). Translate each screen's structure 1:1 into React Native components — see `08-screen-fidelity-rebuild.md` §2.
- Never ship Stitch images (`lh3.googleusercontent.com`) — use `frontend/public/photos/` assets (copy into the app or load from backend media).
- Never show a value the device/backend cannot provide. Unknown capability → flag OFF.
- One tab bar, same four tabs, on every tab screen.
- No UAE/USD content. LYD, Libya, +218.
- Report after each phase with screenshots; wait for review before the next phase.
