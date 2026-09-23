# 08 — Screen Fidelity Rebuild (image-to-image + UX flow)

**Status:** Owner decision 2026-09-22. **Replaces Phases 2–5 of `07-app-build-plan.md`** for how screens are built. Data rules from `06-app-screen-specs.md` and sizes from `05b-stitch-measured-spec.md` still apply.

## 0. The problem (owner's words)
The app "does not look even close" to the Stitch design. **Both UI and UX are broken.** Evidence: every current screen (Home, Devices, Device control, Store, Account…) is still the OLD design — language pill and "UI Kit" button on Home, brand-book collage images, floating round buttons instead of an app bar, the Devices tab opens a single-device screen instead of a device list, Account tab is the old Settings screen, no onboarding/auth flow. The Phase-1 UI kit exists but no screen uses it.

## 1. The goal
Each app screen must look like its Stitch screen **image-to-image**: put the Stitch `screen.png` and a screenshot of our screen side by side at 390×844 — at a glance they must look like the same design (same sections in the same order, same composition, same visual weight, same component types, same image placement, same app bar and tab bar). Differences allowed **only**: real content/data, Arabic text and RTL mirroring, removed invented features (replaced in the same slot — see §4).

And each flow must behave like the Stitch prototype (UX): same navigation paths, same interactions, same states.

## 2. Mandatory method (for every screen)
1. Open the target: `design-reference/stitch/idea-02/odora_<screen>/screen.png` **and** `code.html`.
2. Rebuild the screen by translating the HTML structure **1:1** into React Native: each section/card/row in the HTML becomes the same element in RN, in the same order, with the same spacing and sizes (read them from the Tailwind classes in `code.html`; `05b` lists the common ones). Do **not** simplify, merge sections, re-order, or "interpret".
3. Use the Phase-1 UI kit components only where they match the Stitch element exactly; otherwise fix the component (or build the element) to match the image.
4. Swap content: real product photos (`app/assets/photos/`) in the same image slots and crops; data from `DeviceController` / backend / config per `06`.
5. Remove invented features but **keep the composition**: fill the slot with the real equivalent from §4 so the screen does not get holes.
6. Build the Arabic RTL version as the mirrored composition of the same screen.
7. **Proof:** save `reviews/qa-app-<date>/<screen>__vs__en.png` and `…__vs__ar.png` = Stitch image on the left, our screen on the right, same size (full scroll height, not only the first viewport). No screen is "done" without its side-by-side.

## 3. Global UX rules
- **App bar** (every screen): 64pt, frosted, back chevron at start (pushed screens), title 18/500, 44pt transparent icon actions at end — exactly like Stitch. No floating round buttons at the top.
- **Tab bar** (only on the 4 tab roots): Home · Devices · Store · Account. **Hidden on every pushed screen.**
- **Remove dev clutter from Home:** the language pill and the "UI Kit" button. Language lives in Settings. The UI kit opens from Settings → About → long-press the version number (dev builds only).
- Sticky bottom CTA on Product, Cart, Checkout, Schedule editor, Pairing (as in Stitch).
- Bottom sheets for: create/edit routine, store filters, language confirm, remove-device confirm.
- Every tappable element has press feedback (scale 0.98, 150ms). Chips/toggles/steppers/gauge update instantly (optimistic) and reflect the device state.
- Mist animation only while the device is spraying.

## 4. Invented features → same-slot replacements
| Stitch element | Replace with (same place, same visual weight) |
|---|---|
| Temperature / humidity row (device card) | `Connected · Signal strong · Synced 2 min ago` row (3 items, same icons style) |
| "72°F · 48% RH" (Home status line) | Next routine time ("Next: 08:00 Morning") |
| Acoustics / "<16 dB" stat tile | **Next routine** tile (time + name) |
| Circadian tile | **Mode** tile (Continuous / Interval) |
| Base Warm Glow, Night Whisper toggles | **Auto-off timer** row and **Child lock** (only if capability) — else show **Schedule** + **Device settings** rows |
| "1.2 ml/hr dispersion" footer | Phase + countdown ("Spraying · 12s" / "Paused · 48s") |
| Dual-Chamber / Chamber 1 / pods | Current oil name only |
| Scent History button | keep (local history of oils used) |
| Firmware update anywhere | remove the row; nothing in its place |

## 5. Screens, targets and flows

### Batch A — Device core (build first, then STOP for review)
| # | Our screen | Stitch target | Flow / interactions |
|---|---|---|---|
| A1 | **Home** (tab) | `odora_home_dashboard` | Hero card tap → Device Control. Power button toggles power. Stat tiles tap → Device Control. "My devices" horizontal cards tap → that device's control. "Manage (n)" → Devices tab. Curated card → Product. Bell → Notifications. |
| A2 | **Devices** (tab) | `odora_devices` (layout) + `idea-01/odora_devices_list` (density) | Room chips filter. Card tap → Device Control. Quick power per card. "Pair device" → Pairing. Empty state when no devices. |
| A3 | **Device Control** (pushed) | `odora_device_control` + presets/modes from `idea-01/odora_device_control` | Gauge −/+ and preset chips set intensity. Mode segmented sets spray timing. Floating status pill: tap = pause/resume. Reorder oil → Product. Schedule row → Schedule. "…" → Device Settings. Connection problems → inline Connection State. |
| A4 | **Pairing** (pushed, full flow) | `odora_device_pairing` | Scan (radar pulse) → list → Connect → name + room (chips) → Complete Setup → back to Device Control of the new device. "Enter serial" fallback. Bluetooth off → Connection State. |
| A5 | **Schedule** (pushed) | `odora_schedule_routines` + day timeline from `idea-01/odora_schedule` | Weekly rhythm chart, routine cards with toggles, "New routine" → bottom sheet (days, start/end, intensity, mode) → Save. |
| A6 | **Device Settings** (pushed) | `odora_device_settings` | Rename, room chips, auto-off chips, device info (copy serial), Forget device (confirm sheet). |
| A7 | **Connection states** | `odora_connection_states` | Bluetooth off / out of range / connecting — inline and full-screen variants. |

### Batch B — Store flow
| # | Our screen | Stitch target | Flow |
|---|---|---|---|
| B1 | Store (tab) | `odora_store` | Search → Search. Chips filter. Bundle card → Product. Add (+) adds to cart with toast. |
| B2 | Category | `odora_category_botanical_cartridges` | Filters bottom sheet. |
| B3 | Search | `odora_search_discovery` | Recent, trending, results, no-results. |
| B4 | Product | `odora_product_detail` | Gallery swipe + thumbs, colorway tiles, starter-oil selector (config), sticky Add to cart. Cart icon badge count. |
| B5 | Cart | `odora_cart` | Stepper, remove, promo, free-delivery progress, sticky Checkout. |
| B6 | Checkout | `odora_checkout` | 3 steps, Libyan cities, COD default, subscribe & save (config), sticky Place order. |
| B7 | Order confirmation | `odora_order_confirmation` | Receipt, "Prepare your device for pairing", Track order → My Orders. |

### Batch C — Account flow
| # | Our screen | Stitch target |
|---|---|---|
| C1 | Account (tab) | `odora_account_dashboard` |
| C2 | My Orders (+ detail + tracking) | `odora_my_orders` |
| C3 | Refill plan | `odora_sanctuary_refill_plan` |
| C4 | Scent library | `odora_scent_library` |
| C5 | Notifications | `odora_notifications` |
| C6 | Settings | `odora_settings` |
| C7 | Profile & security | `odora_profile_security` (+ `odora_edit_profile`, `odora_change_password`) |
| C8 | Addresses & payments | `odora_addresses_payments` |
| C9 | Help & support | `odora_help_support` (WhatsApp) |
| C10 | Legal & delete account | `odora_legal_privacy` |

### Batch D — Entry, auth & system
| # | Our screen | Stitch target |
|---|---|---|
| D1 | Splash | `odora_splash` |
| D2 | Onboarding | `odora_onboarding` |
| D3 | Login / Sign up / Reset / OTP | `odora_login`, `odora_sign_up`, `odora_reset_password`, `odora_email_otp_verification` |
| D4 | Bluetooth + Notification primers | `odora_bluetooth_permission_primer`, `odora_notifications_permission_primer` |
| D5 | Empty / Loading / Error / Maintenance | `odora_dynamic_empty_states`, `odora_loading_skeletons_animated`, `odora_service_recovery_error`, `odora_system_maintenance_update` |

**App entry flow:** Splash → (first launch) Onboarding → Sign up / Login → Bluetooth primer → Home. Returning user: Splash → Home.

## 6. Acceptance
- Each screen: side-by-side proofs (EN + AR). The owner must be able to say "this is the Stitch screen".
- `tsc --noEmit` clean. No old screens left in the navigator; delete replaced files.
- Stop after **each batch** with the proofs. Batch A first.
