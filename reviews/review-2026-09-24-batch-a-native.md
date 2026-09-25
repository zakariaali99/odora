# Review — Batch A on the native iOS app vs Stitch (2026-09-24)

**Scope:** commit `9c29830` + all 7 Batch A screens, checked on the **native dev build** (iPhone 17 Pro simulator, Arabic). Stitch targets rendered from `code.html` at 390 wide (`odora_device_control/screen.png` in the export is corrupt).
**Batch B:** not reviewed yet.

## Fixed in 9c29830 (verified)
- "…" in Device Control opens Device Settings.
- "Level 8" is now Arabic.
- Navigation smoke-test screenshots were added.

## Corrections to my earlier review (my mistakes)
- **Home hero image:** I said Stitch uses a full-width landscape image. That was wrong. Stitch uses **192×192, square, centred, radius 16** (`w-48 h-48 rounded-2xl`).
- **Intensity gauge:** I asked for a 270° arc. That was wrong. Stitch idea-02 and `05b` both use a **full ring** (r 82, stroke 8, `dasharray 515.2`) with − / + buttons (44) on either side.
- The Device Control image (176×208) is correct as built.

## Critical — UX flows
| # | Finding |
|---|---|
| C1 | **New-routine sheet has no start/end time.** You can't make a real routine without it. The sheet must have: name, days, start, end, intensity, mode. |
| C2 | **Connection States can't be reached.** Nothing navigates to it, and `/ConnectionStates` on web redirects to Home. It must appear inline in Device Control (disconnected / out of range / connecting), full-screen from Pairing when Bluetooth is off, and be triggerable from the mock dev panel. |
| C3 | **Pairing flow is fake.** There is no name step. "Complete setup" opens the existing Living-Room device with the same data, not the new device. |
| C4 | **Screen data is hard-coded** (`68%`, `~18 days`, `19:00`, `34 ml / 50 ml`…) instead of coming from `DeviceController`. That is why C3 happens. |
| C5 | **~570 inline `isRTL ? 'ar' : 'en'` strings** across screens instead of i18n. This ties language to layout direction and breaks the Phase-1 rule "all strings through i18n". |

## Visual — overlaps and Arabic
| # | Finding |
|---|---|
| V1 | **Home: the power button still touches the device title on native** (zero gap). Stitch puts it at the top-end of the header row (`justify-between items-start`), with the text column flexing and a gap between them. |
| V2 | **Device Control oil card: "68%" collides with the "active" eyebrow** and pushes the title. |
| V3 | **Letter-spacing on Arabic eyebrows breaks the Arabic letters** (Device Settings l.652/740/774/885/929 and others). Arabic must use letterSpacing 0. |
| V4 | **Digits are mixed:** Eastern (٦٨٪, ١٩:٠٠) and Western (68%, 20:00, 24%, 45د) appear on the same screen. Decision: **Western digits 0–9 everywhere** (the Libyan norm). Remove `toArabicNumerals`. |
| V5 | **Connection States is not image-to-image.** Stitch has a centred header, a large round photo with the BT icon, centred copy, two buttons (primary + "continue offline"), a device card and a footer. Ours squeezes everything into one grey card. |
| V6 | Home hero image → 192 square (see corrections). |
| V7 | Gauge → full ring (see corrections). |
| V8 | App-bar title is centred. Stitch puts it at the start, next to the back chevron (Device Control, Settings, Schedule, Pairing). |
| V9 | The tab bar is a solid grey slab. Stitch uses a frosted bar close to `bg`. |
| V10 | Device Settings: an extra grey circle behind the image (not in Stitch); "المنطقة ٠١" (Zone 01) is invented; the "تغيير >" chevron isn't mirrored. |
| V11 | Bidi: "(dBm 58-)" renders reversed; the "/١٠" in the gauge is misordered. |

## Content rules (06 / 08 §4)
- "Chamber" wording is still there: "حجرة 1" (Home carousel), "الحجرة النشطة" (oil card), "تم ضبط الحجرة الأساسية" (pairing). Per 08 §4, show the current oil name only.
- "Sanctuary" wording: "الملاذ الحيوي", "ملاذ المساء".
- The Boost chip "تعزيز" shows on a routine while `burst` is OFF.
- The pairing sheet claims the oil is pre-filled (30 ml). The app can't know that.
- The weekly-rhythm chart isn't built from the routines, and it uses a Sat/Sun weekend. Libya's weekend is **Fri/Sat**.
- The low-oil alert "<5%" assumes an oil sensor. Show it only when `oilSensor` is on; otherwise use estimate wording.
- English leaks: "Sage Green" (pairing sheet), "30ml" (Home). The greeting uses the placeholder name "جوليان".

---

## Re-review after AG's fix pass (2026-09-25, native iPhone 17 Pro, Arabic)
State: **uncommitted** (20 files, +2497/−1305), no report. `tsc --noEmit` exit 0.

**Verified fixed:** pairing creates a new device with name + room and opens that device's control screen · full-ring gauge · bidi "(-52 dBm)" and "7 /10" · Western digits (mostly) · oil-card collision gone and "chamber" removed · Arabic letter-spacing in Device Settings · grey circle and "Zone 01" removed, chevron mirrored · Connection States reachable (Device Control + Pairing) and now close to Stitch · routine sheet has start/end, Save adds the routine and the weekly chart updates from routines · Sun–Thu default days · Boost chip and "sanctuary" wording gone in Batch A · "جوليان" and "30ml" gone.

**New regression — critical**
| # | Finding |
|---|---|
| N1 | **Home and the app bar render LTR in Arabic on native.** Cause: `flexDirection: isRTL ? 'row-reverse' : 'row'` (19 places: `AppBar.tsx`, `HomeScreen.tsx`). On native, `I18nManager.forceRTL` already mirrors `row`, so `row-reverse` flips it back to LTR (web doesn't auto-mirror, which is why web looked right). Visible: title at the left, avatar at the right, back arrow on the left on every pushed screen, Home greeting/cards/progress LTR. AG's own `home_ar_top_comparison.png` shows the same thing and was submitted as passing. |

**Still open**
| # | Finding |
|---|---|
| S1 | Start/end time are free-text `TextInput`s (no picker, no validation). |
| S2 | ~257 inline `isRTL ? … : …` strings remain in the 7 Batch A screens (item 5 not done). |
| S3 | Low-oil alert "<5%" still shown with `oilSensor` OFF; "٪٥" is still an Eastern digit. |
| S4 | "Sage" translated as "أخضر حكيم" ("wise green"); it should be "أخضر ميرمية" (`ar.ts:203`, Pairing l.293/317). |
| S5 | Pairing sheet still claims which oil is loaded ("مريمية الغابة"); the default name duplicates an existing device ("موزع غرفة المعيشة"). |
| S6 | Room lists differ between Pairing (…استوديو السبا) and Settings (…صالة الضيوف); the device paired into "المكتب" shows no selected chip in Settings. One shared room list. |
| S7 | Schedule opened from the new device shows "موزع غرفة المعيشة": the schedule isn't tied to the device it was opened from. |
| S8 | Seed routines "5 days" = Mon–Fri (Friday on, Sunday off); Libyan work week is Sun–Thu. |
| S9 | Home hero: a 192 grey frame holding a smaller portrait photo, plus a pale circle and a leaf. Stitch = the photo **fills** the 192 square (`object-cover`), nothing behind it. |
| S10 | All routine icons became the same clock; Stitch uses a distinct icon per routine (sunrise / sun / moon by start time). |
| S11 | Pairing success toast covers the app-bar title; Devices button still shows "+ + إقران جهاز" (icon plus a "+" in the text). |
| S12 | Not committed; no report. |
