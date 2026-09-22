# 06 — Odora App Screen Specs (real data, not mockup data)

**Read with:** `05-app-design-system.md`. **Visual references:** `design-reference/stitch/idea-02/<screen>/screen.png` + `code.html` (and `idea-01/…` where noted). Full analysis: `reviews/stitch-analysis-2026-09-22.md`.

> Rule: every value on screen comes from a real source (backend API, device state, or app config). If the source does not exist yet, use the **Mock layer** (`MockTransport`, mock API fixtures) — never hard-code numbers inside a screen.

---

## 1. Global rules

### 1.1 Navigation
- `RootStack`: Splash → (Onboarding → Auth) or `MainTabs`.
- `MainTabs` (**one fixed tab bar**): **Home · Devices · Store · Account**.
- Pushed/modal on top of tabs: Device Control, Pairing, Schedule, Rooms, Device Settings, Troubleshooting, Product, Reviews, Write Review, Search, Category, Cart, Checkout, Order Confirmation, all Account sub-screens, permission primers, connection states.
- Deep links later: `odora://device/:id`, `odora://product/:slug`, `odora://order/:id`.

### 1.2 Device capability flags (owner decision pending — default OFF)
Add to `DeviceRef`/`DeviceState` a `capabilities` object filled by the transport:

```ts
interface DeviceCapabilities {
  oilSensor: boolean;   // true → show measured %; false → show ESTIMATE from runtime
  burst: boolean;       // one-shot / Boost
  fan: boolean;
  led: boolean;         // A316 assumed false
}
```
- `MockTransport` exposes a dev toggle to flip each flag so every UI branch can be tested.
- **Oil estimate** (when `oilSensor=false`): `remaining = bottleMl − (sprayingSeconds × mlPerSecond)`; reset on "I refilled". Always labelled *"Estimated"*. `bottleMl` and `mlPerSecond` come from app config (placeholders until supplier data).

### 1.3 Business config (owner decision pending)
Served by backend (`/api/v1/config/`), with placeholders in mock fixtures: `productDisplayName` (placeholder "Odora A316"), `warrantyMonths`, `trialDays`, `deliveryFees` per city, `freeDeliveryThreshold`, `freeStarterOil` (on/off + options), `subscriptionDiscountPct`. **No screen hard-codes these.**

### 1.4 Remove from all mockups
Temperature/humidity/presence readouts · LED "warm glow" · acoustic/"night whisper" modes and dB claims · dual chamber / pods / slots · automatic scent switching · cloud sync / cloud gateway · firmware OTA · BLE mesh / AES claims · USD/AED/UAE/+971 · invented ratings, review counts, warranty years · "Odora One / Odora Air 01" names · AI placeholder images.

### 1.5 Every screen ships with
Loading (skeleton), empty, error (banner + retry), offline (store/account show cached data read-only; device control keeps working over BLE), RTL layout, dark theme.

---

## 2. Screens

Format: **Screen** — Stitch ref · Keep · Remove/Change · Data · Notes

### A. Entry & auth
1. **Splash** — `idea-02/odora_splash` · logo + tagline, subtle fade · button text "Awaken Sanctuary" → auto-continue · none.
2. **Onboarding (3 slides)** — `idea-02/odora_onboarding` + slide titles from `idea-01/odora_onboarding` (Waterless cold-air · App control & schedules · Pure oils) · real product photos · local only; "seen" flag in storage.
3. **Login** — `idea-02/odora_login` · email/password, show/hide, forgot link · Face ID → later · `POST /auth/login` (JWT) · errors inline.
4. **Sign up** — `idea-02/odora_sign_up` · name, email, phone (+218), password, terms · Apple/Google → later · `POST /auth/register`.
5. **Forgot / Reset password** — `idea-02/odora_reset_password` · email → "check your inbox" + resend timer · `POST /auth/password/reset`.
6. **OTP / email verification** — `idea-02/odora_email_otp_verification` · 6-digit, resend 60s · `POST /auth/verify`.
7. **Bluetooth permission primer** — `idea-02/odora_bluetooth_permission_primer` · why + Allow / Not now · remove "mesh discovery" claim · triggers OS permission.
8. **Notifications permission primer** — `idea-02/odora_notifications_permission_primer` · low oil, order updates, schedule reminders · OS permission.

### B. Devices (core)
9. **Home** — `idea-02/odora_home_dashboard` · greeting; hero device card (real photo per colorway, room, status, power); stat row: Oil (measured or *Estimated*), Intensity level, Next schedule; "My devices" horizontal cards; one store teaser (from backend featured product) · remove temp/humidity, acoustics dB, "Dual-Resonance / Chamber" · device list from registry + live state from `DeviceController`.
10. **Devices** — `idea-02/odora_devices` + density from `idea-01/odora_devices_list` · room chips (All + rooms), device cards with status/intensity/oil, quick power, "Pair device" · empty state → Pairing.
11. **Device Control** — layout `idea-02/odora_device_control`, controls from `idea-01/odora_device_control` · device photo with **mist animation only when spraying**; `IntensityGauge` + − / +; `PresetChips` (Boost only if `burst`); mode `SegmentedControl` Continuous / Interval (maps to `setSpray(on, off)`); phase + countdown ("Spraying · 12s / Paused · 48s"); oil card (measured/estimated) + **Reorder oil** (→ product of current scent); Schedule row; current scent card (from device record, user-editable); floating `StatusPill` · remove Device Ambience block (glow, night whisper), 21.5°C/48%, ml/hr claim · `DeviceController` state + commands.
12. **Pairing** — `idea-02/odora_device_pairing` · scanning radar (pulse), found devices (name, signal), Connect, then **name + room** step, success · "Enter serial" → keep as fallback · `DeviceController.scan()/connect()`; save to backend registry.
13. **Connection states** — `idea-02/odora_connection_states` · Bluetooth off (Open settings) · Out of range (Retry) · Connecting (Cancel) · shown inline on Device Control and full-screen from Home when needed.
14. **Schedule** — `idea-02/odora_schedule_routines` + day timeline bar from `idea-01/odora_schedule` · named routines (name, days, start/end, intensity, mode, on/off), create/edit sheet · remove "Smart Adaptive Air" (humidity/presence) · `setSchedule()` writes to device (runs on the device itself); also saved to backend for restore.
15. **Rooms** — `idea-02/odora_rooms_management` · create/rename/delete room, assign devices · remove "mist choreography" · backend rooms + registry.
16. **Device Settings** — `idea-02/odora_device_settings` · rename, room, auto-off timer, device info (model, serial, added date), Remove device · remove firmware check, LED, "Reset local cache" wording → "Forget device" · registry + controller.
17. **Troubleshooting** — `idea-02/odora_device_troubleshooting` (simplified) · steps: check oil, restart device, re-pair, contact support (WhatsApp) · remove "purge cycle", "claim" automation.

### C. Store (in-app, smaller than the web store)
18. **Store** — `idea-02/odora_store` · search entry, category chips, featured bundle card, product list/grid · fix the card that uses a brand-book page as image · `GET /products`, `GET /categories`.
19. **Category** — `idea-02/odora_category_botanical_cartridges` → rename to Oils/Diffusers/Bundles/Accessories · filters: scent family, size, price · remove "Subtle Veil/Enclosure" level filter · `GET /products?category=`.
20. **Search** — `idea-02/odora_search_discovery` · recent, suggestions, results, no-results · remove "Bespoke consultation" · `GET /products?search=`; recent searches local.
21. **Product Detail** — `idea-02/odora_product_detail` · gallery + thumbnails, name, rating (real or hidden if none), price LYD, colorway selector, **choose free starter oil** (only if `freeStarterOil` config on), specs (real), add to cart sticky bar · remove "Dual-Chamber BLE", "Nano-Mist" claims, fake 4.9 (184) · `GET /products/:slug`.
22. **Reviews** — `idea-02/odora_reviews_ratings` · average + breakdown, filters, list · hidden until real reviews exist · new backend model.
23. **Write Review** — `idea-02/odora_write_a_review` · stars, text, photos; attributes Quietness / Intensity (keep, they are useful) · verified buyers only.
24. **Cart** — `idea-02/odora_cart` · items, variant, stepper, remove, promo code, summary, free-delivery progress · `useCartStore` + `/cart`.
25. **Checkout** — `idea-02/odora_checkout` · steps Address · Payment · Review; Libyan cities + fees from config; **Cash on delivery default**; card/e-wallet later; **Subscribe & save** row for oils (if config on) · remove Dubai addresses, Apple Pay (later), "256-bit" footer · `POST /orders`.
26. **Order Confirmation** — `idea-02/odora_order_confirmation` · order number, summary, ETA, **"Prepare your device for pairing"** guide link · remove "Transit Hub DXB" map.

### D. Account
27. **Account** — `idea-02/odora_account_dashboard` · profile, stat row (devices, orders, refill plan status), menu · `GET /me`.
28. **My Orders + detail + tracking** — `idea-02/odora_my_orders` + timeline from `idea-01/odora_order_confirmation_tracking` · filters, status timeline, reorder, request return · `GET /orders`.
29. **Refill plan (oil subscription)** — `idea-02/odora_sanctuary_refill_plan` + cadence chips from `idea-01/odora_oil_subscription` (30/45/60/90 days) · oil, cadence, next delivery, skip, pause, cancel · new backend model; hidden until backend ready.
30. **Scent library** — `idea-02/odora_scent_library` · all oils with families and notes, favourite, buy/refill · remove "Push blend to diffuser" · products API (oil category).
31. **Notifications** — `idea-02/odora_notifications` · filters Device / Orders / Refills; items: low oil, device disconnected, order status, refill shipped · remove "BLE firmware update v2.4" · local (device) + push (orders).
32. **Settings** — `idea-02/odora_settings` · language (العربية / English), theme (system/light/dark), units (ml), notification prefs, connected devices, privacy · remove °C/°F, "18 dB / 14 dB" options.
33. **Profile & security** — `idea-02/odora_profile_security` + `odora_edit_profile` + `odora_change_password` · edit profile, change password, sessions (later) · `PATCH /me`.
34. **Addresses & payments** — `idea-02/odora_addresses_payments` · addresses (city list), default; payment methods later · COD note.
35. **Help & support** — `idea-02/odora_help_support` · FAQ, **WhatsApp**, phone, warranty info (from config) · remove certificates.
36. **Legal & delete account** — `idea-02/odora_legal_privacy` · privacy policy, terms, warranty, **delete account** (confirm) · remove GDPR/UAE decree text · `DELETE /me` (required by App Store).
37. **Return request** — `idea-02/odora_return_refund_request` · pick order/items, reason list (from `idea-01`), photos, submit · later phase.

### E. System
38. **Empty states** — `idea-02/odora_dynamic_empty_states` (no devices, empty cart, no orders, no notifications, empty wishlist).
39. **Skeletons** — `idea-02/odora_loading_skeletons_animated` (shimmer).
40. **Offline / error** — `idea-02/odora_service_recovery_error` · "No internet — your diffusers still work over Bluetooth" + retry; server error; banner/toast rules.
41. **Force update / maintenance** — `idea-02/odora_system_maintenance_update` (simplified) · remote config flag.

**Not built:** firmware update screen, dark duplicates (dark is a theme, not separate screens), `interactive_prototype_hub` (reference only), wishlist in the app (web only for now).

---

## 3. DeviceController changes needed

Current interface: `connect, disconnect, setPower, setIntensity, setSpray, setSchedule, readOilLevel, onStateChange, getState`. Add:

```ts
scan(onFound: (d: DeviceRef) => void): Unsubscribe;
burst?(seconds: number): Promise<void>;          // only if capabilities.burst
setFan?(on: boolean): Promise<void>;             // only if capabilities.fan
// DeviceState additions:
mode: 'continuous' | 'interval';
phase: 'spraying' | 'paused' | 'idle' | 'off';
phaseRemainingSec: number;
oilSource: 'sensor' | 'estimate';
capabilities: DeviceCapabilities;
```
Support **multiple registered devices** (list + one active connection at a time). Intensity levels 1–10 map to `(sprayOnSec, sprayOffSec)` via one table in `device/intensityMap.ts` (placeholder values until tested on a real A316).
