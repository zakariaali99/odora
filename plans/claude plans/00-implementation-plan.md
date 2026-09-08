# PLAN 00 — Odora Implementation Plan

> **Type:** PLAN (implement this). Read `../../KNOWLEDGE-odora-spec.md` once for context, then build here.
> **Brand:** Odora · **Design:** follow `01-design-system.md` + `design-reference/test.pdf`.
> **Workflow:** build → owner reviews (see `reviews/`) → next milestone.

---

## 0) Governing principles
1. **BLE is the primary transport.** Direct WiFi is secondary. Remote/cloud is a **later, gated** phase (see `02-cloud-remote-path.md`).
2. **Everything goes through an abstract `DeviceController`** with swappable transports. UI never touches BLE/WiFi directly.
3. **Design is premium & minimal** — from the PDF. Do not invent identity.
4. **Reuse the existing Django + DRF + JWT store backend** for account + store.
5. **Schedules are written to the device** so it runs while the app is closed (also sidesteps iOS background-BLE limits).
6. **Arabic (RTL) + English** from day one.
7. **Do NOT assume a physical device exists** — build on `MockTransport` first.

---

> **⚠️ Sequencing (2026-09-08): the WEB STORE is built FIRST — see `04-build-sequence-store-first.md`. This app plan is Phase B (second).**

## ⭐ Start here (device-independent first)
The owner may not have bought the units yet. **Do not block on hardware.** ~70% of the app is built with **no device** via `MockTransport`.
- Build **M0 → M3** now (no hardware).
- A real unit is only needed from **M4**.
- Nothing on the critical path depends on the device purchase.

---

## 1) Tech stack (final)
| Layer | Choice | Why |
|---|---|---|
| Mobile | **React Native + Expo (Dev Client + EAS)** | One codebase, reuses React knowledge, OTA updates |
| BLE | **`react-native-ble-plx`** (+ Expo config plugin) | Most mature; needs Dev Client (not Expo Go) |
| State | **Zustand** + React Query | Matches web store |
| Nav | React Navigation | |
| i18n/RTL | i18next + `I18nManager` | Arabic + English |
| Backend | **Existing Django 4.2 + DRF + JWT** | Reuse store + account |
| WiFi transport | Local HTTP/TCP (confirm device API in §7) | Secondary local transport |
| Local storage | MMKV | Prefs + device cache |

> BLE needs a native module → use **Expo Dev Client** (`expo prebuild` + EAS build), not Expo Go.

### Why React Native (not Flutter or native Swift/Kotlin)
- **Reuse:** Mostafa's web store is **React + Zustand**; Zakaria already knows React. RN shares the mental model and can share code (API clients, types, validation, business logic). Flutter/Dart = a new language and zero reuse; native = two languages.
- **One codebase → iOS + Android.** Native (Swift **and** Kotlin) means two codebases, ~2× time/cost — not justified for a UI + BLE + store app, especially a white-label product that may be resold.
- **Mature BLE:** `react-native-ble-plx` is battle-tested for device control.
- **Speed:** Expo EAS **OTA updates** push JS/UI fixes without App-Store review (owner prioritized speed); JS/TS is also best-supported by AI tooling (Antigravity).
- **Performance is ample:** this is UI + BLE + REST, not graphics/real-time heavy.
- **Flutter is a valid alternative** (great UI engine, `flutter_blue_plus` exists) — RN wins here purely on **existing React investment**, not on Flutter being worse.
- **Native's one real edge = background-BLE reliability** — which we neutralize by keeping scheduling **on the device/gateway**, not on the phone. Revisit native only if heavy background BLE, real-time, or deep OS integration becomes core.

---

## 2) Project structure (monorepo)
```
odora/
├── design-reference/         # test.pdf — design source of truth
├── app/                      # React Native (Expo)
│   └── src/
│       ├── theme/            # design tokens from PDF (M1)
│       ├── i18n/             # ar / en
│       ├── navigation/
│       ├── screens/          # match the PDF
│       ├── components/
│       ├── device/           # ★ connection layer (the core)
│       │   ├── DeviceController.ts
│       │   ├── transports/
│       │   │   ├── MockTransport.ts   # ★ build without hardware first
│       │   │   ├── BleTransport.ts    # primary — Aroma-Link over BLE (needs device)
│       │   │   ├── WifiTransport.ts   # secondary — local HTTP/TCP
│       │   │   └── CloudTransport.ts  # ⛔ stub only — gated, do not implement
│       │   ├── aromalink/             # pure encode/decode of the protocol
│       │   └── types.ts
│       ├── store/            # Zustand
│       └── api/              # REST clients for the Django store
└── backend/                  # (reference) existing Django store
```

---

## 3) ★ Connection layer (the core)
```ts
interface DeviceController {
  connect(device: DeviceRef): Promise<void>;
  disconnect(): Promise<void>;
  setPower(on: boolean): Promise<void>;
  setIntensity(level: number): Promise<void>;      // 0..10
  setSpray(onSec: number, offSec: number): Promise<void>;
  setSchedule(schedule: Schedule): Promise<void>;   // written to the device
  readOilLevel(): Promise<number>;
  onStateChange(cb: (s: DeviceState) => void): Unsub;
}
```
- **`MockTransport`** implements this with **no hardware** (simulates state, oil level, timing) → build all UI/flows against it first.
- **`BleTransport`** (primary) and **`WifiTransport`** (secondary) implement the same interface (need a real unit).
- **Transport selection:** prefer BLE when available, else local WiFi. `CloudTransport` is added later without touching the UI.
- **Aroma-Link protocol:** port command encoding from `mr-sparks/scent-assistant` (`PROTOCOL.md`) + `Memberapple/ha_aromalink` into a **pure, testable** `aromalink/` module. Commands: on/off, intensity, spray on/off seconds, schedule, read oil level, read state. Discover BLE service/characteristic UUIDs from the real unit (§7). Do NOT invent bytes — cite the source in code.

### Permissions
- **Android 12+:** `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`; **≤11:** `ACCESS_FINE_LOCATION`. Plus `INTERNET`, `POST_NOTIFICATIONS` (13+).
- **iOS:** `NSBluetoothAlwaysUsageDescription`. Foreground BLE works; do not rely on background BLE (schedules live on the device).

---

> **Note — the app's in-app store is SEPARATE from the standalone web store** (`frontend/`) and smaller. It is its own front-end; it must pull real products/orders from the **shared Django API** (add an `app/src/services/api` layer) — never hardcode products/prices.

## 4) Backend (reuse + tiny additions)
- MVP needs no backend for control (BLE is local). Backend is used for **account (JWT)** and **store** (existing endpoints).
- Optional small addition: sync the user's device list + names to the cloud (can start local via MMKV, defer sync).
- Later/gated: device registry, multi-tenant, cloud transport, telemetry (see spec + `02-cloud-remote-path.md`).

---

## 5) Screens — complete inventory (build ALL; leave no page lacking)
> Match the design system + `03-design-elevation.md`. Legend: ✅ exists in `app/` · ➕ to add.

**Onboarding & auth**
1. ➕ **Splash** (brand)
2. ➕ **Onboarding** (2–3 slides; "Get started" / "Sign in")
3. ➕ **Sign in** · 4. ➕ **Register** · 5. ➕ **Forgot / reset password** (+ OTP verify if phone-based)

**Devices — core**
6. ✅ **Home / My spaces** — rooms + active device + quick actions + discover scents
7. ➕ **Add device — flow:** (a) BLE scan / discovery · (b) pairing · (c) **WiFi provisioning (SoftAP)** for WiFi units · (d) name + assign room · (e) success
8. ✅ **Device control** — power, intensity slider, mist, timer, ambient light, oil-level gauge, scent + notes, usage chart
9. ✅ **Schedule** — routines list + ➕ **add/edit routine** (days, time window, intensity, scent)
10. ➕ **Scent library / switch scent** — all scents + note profiles + set active

**Store (in-app)**
11. ✅ **Shop / browse** (categories, chips) · 12. ✅ **Product detail** (notes, specs, ratings)
13. ✅ **Cart** · 14. ➕ **Checkout** (address, delivery, COD + card, LYD) *(designed this session — add to code)*
15. ➕ **Order confirmation** · 16. ➕ **Orders / order tracking**

**Account**
17. ➕ **Profile** · 18. ➕ **Addresses** (manage)
19. ✅ **Settings** — language (ar/en), notifications, about, help
20. ➕ **Notifications center** (low oil, order status)

**System & states (design these, don't skip)**
21. ➕ **Empty states** — no devices, empty cart, no orders
22. ➕ **Error / offline** — Bluetooth off, device disconnected, no internet
23. ➕ **Permission primers** — Bluetooth / notifications (foreground, friendly)

> The ✅ Onboarding + Checkout screens were designed on the canvas this session — port them into the app code.

## 6) Milestones (🟢 no device · 🔵 needs device)
> Build all 🟢 first. Stop after each for owner review.

### 🟢 M0 — Bootstrap
Expo + Dev Client + EAS, folder structure, React Navigation, i18n RTL/EN.
**DoD:** boots on Android; switches ar/en.

### 🟢 M1 — Design system from PDF
Open `design-reference/test.pdf`, derive **design tokens** (colors/type/spacing) per `01-design-system.md`, build theme + base components.
**DoD:** Odora theme applied; core UI components match the PDF.

### 🟢 M2 — Full app on MockTransport (★ biggest safe win)
All screens + flows (devices, add, device screen: power/intensity/spray/schedule, oil level) working on `MockTransport` — no hardware.
**DoD:** fully demoable experience with zero hardware; UI fully decoupled from transport.
**Elevation:** build every screen to the premium standard in `03-design-elevation.md` — real/lifestyle imagery, depth & texture, earns-its-place content, all interactive states. Not bare mockups.

### 🟢 M3 — Store integration
Wire REST to the existing Django store: browse/cart/checkout/tracking + reorder from device screen.
**DoD:** a real order completes from inside the app (no diffuser needed).

> **— SPLIT LINE: everything above needs no device. Everything below starts when a real unit is available. —**

### 🔵 M4 — BLE core (needs device)
`BleTransport` + `aromalink`: scan, pair, **on/off** on a real A316.
**DoD:** power a real unit on/off from the app. (UI already exists from M2 — just swap Mock → BLE.)

### 🔵 M5 — BLE full control
Intensity (0–10), spray timing, **write schedule to device**, read oil level, live state (notify).
**DoD:** all commands on a real unit; schedule runs with the app closed.

### 🔵 M6 — WiFi transport (secondary)
`WifiTransport` behind the same `DeviceController` (after confirming the device's local WiFi API, §7).
**DoD:** same commands over local WiFi; transport auto-selected.

### 🟢/🔵 M7 — Polish & release
RTL/EN polish, notifications, **Android release** (APK/internal Play) + **iOS TestFlight**.
**DoD:** distributable builds on both platforms; owner review.

### ⛔ Gated (owner's order only)
Cloud/remote (`CloudTransport` + VPS), multi-tenant + RBAC, telemetry/analytics, white-label config for resellers → `02-cloud-remote-path.md`.

---

## 7) Technical checks on a real unit (do during/before M4)
1. BLE service/characteristic UUIDs + firmware version of the A316.
2. Does `scent-assistant`'s `PROTOCOL.md` match this unit?
3. Does the device store schedules internally and run standalone?
4. Is oil-level reading accurate enough for alerts?
5. (For M6) Does the device expose a local WiFi API? What shape (HTTP/TCP)?

---

## 8) Environment setup
```bash
cd app
npx create-expo-app@latest . --template
npx expo install react-native-ble-plx react-native-mmkv zustand @react-navigation/native i18next react-i18next
npx expo prebuild
eas build --profile development --platform android
```
- iOS real-device/TestFlight needs an Apple Developer account ($99/yr) — owner decision.

---

## 9) Testing
- `aromalink`: pure encode/decode unit tests (no device).
- BLE: guided manual test on a real unit per milestone.
- Store: order-flow test against the existing backend.
- RTL: visual audit ar/en on every screen.

---

## 10) Rules for the implementer
- Open `design-reference/test.pdf` and derive the theme **before** building screens.
- Keep `device/` pure and testable; never leak BLE details into the UI.
- Build to premium finish per `03-design-elevation.md` (mockups are the floor, not the ceiling); ask the owner for real product photography early.
- Follow milestone order; **stop after each** for owner review.
- Do not invent protocol bytes — port from the cited sources.
- **⛔ Never implement the cloud/remote path** (`CloudTransport`, VPS, Aroma-Link cloud) until the owner says so; keep it a stub. See `02-cloud-remote-path.md`.
- **⛔ Never assume a device exists** — stay on MockTransport until a real unit is provided.
- Log any deviation from this plan (with reason) in a note under `plans/claude plans/`.
