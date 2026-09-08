# FIX PLAN — 2026-09-08 review findings

> **Type:** PLAN (implement). Source: `reviews/review-2026-09-08-app-and-design.md`.
> Apply all four, then stop for re-review. Targeted changes only — do not redesign untouched code.

## Fix 1 — Decouple screens from the mock transport (Medium, architecture)
**Files:** `app/src/screens/HomeScreen.tsx`, `app/src/screens/DeviceScreen.tsx` (and any other screen importing `mockDeviceController`).
- Replace `import { mockDeviceController } from '../device/transports/MockTransport'` with `import { getDeviceController } from '../device/DeviceController'`.
- Use `const controller = getDeviceController();` and call `controller.getState()`, `controller.onStateChange(...)`, `controller.setPower(...)`, `controller.setIntensity(...)`.
- **Goal:** no screen references a concrete transport. M4 then swaps BLE in with a single `setDeviceController(new BleTransport())` — zero screen edits.

## Fix 2 — On-brand status color (Low)
**Files:** `app/src/theme/colors.ts`, `app/src/screens/HomeScreen.tsx`.
- Remove `activeGreen: '#6B8E23'` (off-palette). Add `statusOn: '#919C7A'` (= brandSage) if a named status token is wanted.
- HomeScreen "On" dot should use `colors.brandSage` (or `colors.statusOn`) so it matches DeviceScreen. Status indicators stay within the brand palette.

## Fix 3 — Intensity: continuous slider, not stepper (Low, design fidelity)
**File:** `app/src/screens/DeviceScreen.tsx`.
- Replace the discrete `[2,4,6,8,10]` stepper with a **continuous 0–10 slider** (sage fill track + round knob + a small value bubble showing "Level N"), matching `01-design-system.md` / the approved mockup.
- Keep `setIntensity(level)` clamped 0–10 (already handled in MockTransport).

## Fix 4 — Use the token for the rating star (Low)
**File:** `app/src/screens/StoreScreen.tsx:76`.
- Replace hardcoded `#D97706` with `colors.warningAmber` (import from theme). No hardcoded hex in screens.

## Fix 5 — App in-app store must use the backend API, not hardcoded data (High, Phase B)
**File:** `app/src/screens/StoreScreen.tsx` (+ new `app/src/services/api.ts`).
- Remove the hardcoded `products` array (prices `480`/`140` etc.).
- Add an `api` layer (axios or fetch, JWT + guest cart header) that calls the **shared Django API** — mirror `frontend/src/services/api.js`.
- Load products/prices from the backend. The app store stays SEPARATE from the web store but shares the backend.

## Fix 6 — Wire the bottom-tab navigation (High, structure)
`@react-navigation/bottom-tabs` is installed but unused. Add a **Bottom Tab navigator** for the main sections (Home · Devices · Store · Schedule · Settings), and keep a **Stack** for detail/modal screens (Device control, Add-device, Product, Cart, Checkout). The persistent tab bar must match the design. Currently `RootNavigator` is stack-only — screens have no tab bar.

## Fix 7 — RTL language switch must re-layout (High)
`changeAppLanguage` calls `I18nManager.forceRTL()`, but RN needs an app reload for direction to change. Add `expo-updates` and call `Updates.reloadAsync()` after toggling language (or show a "restart to apply" prompt). Otherwise ar↔en flips text but not layout direction until a manual restart.

## Fix 8 — App does not typecheck (Blocker, Phase B)
`npx tsc --noEmit` crashes with `RangeError: Maximum call stack size exceeded`. The app cannot be trusted until this passes.
- Likely cause: bleeding-edge pinned deps (`typescript ~6.0.3`, React 19.2.3, RN 0.86.3, expo ~57). Pin TypeScript to a stable release, set `skipLibCheck: true` in `tsconfig.json`, and bisect to the offending file/type.
- **DoD:** `npx tsc --noEmit` exits 0.

## Definition of done
- [ ] No screen imports a concrete transport; all go through `getDeviceController()`.
- [ ] No off-palette status color; `activeGreen` removed.
- [ ] Intensity is a continuous 0–10 slider with value bubble.
- [ ] No hardcoded hex in screens.
- [ ] App in-app store loads from the shared backend API (no hardcoded products).
- [ ] Bottom-tab navigator wired; detail screens in a stack.
- [ ] Language toggle re-lays out RTL/LTR (reload).
