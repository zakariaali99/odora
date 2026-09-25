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

---

## Re-review of commit `7b7677b` (2026-09-25, native iPhone 17 Pro, Arabic)
Committed. `tsc` exit 0. **No report written** (asked for ✅/❌ per item).

**Verified fixed:** native RTL (0 `row-reverse`; app bar back chevron on the right, title next to it) · Home hero photo fills the 192 square · real time picker (hour ± and :00/:15/:30/:45) · low-oil alert reworded as an estimate · "أخضر ميرمية" · shared `SHARED_ROOMS` · Schedule filtered by `deviceId` · Sun–Thu seed routines, weekend Fri/Sat · per-routine icons · pairing sets "No oil loaded".

**New regressions — critical**
| # | Finding |
|---|---|
| R1 | **No tab bar anywhere.** `RootNavigator` now uses `previewConfig.screen \|\| 'Home'` as the initial route, so the app opens the bare `Home` stack screen instead of `MainTabs`. Before (9c29830) it defaulted to `MainTabs`. Also `previewTarget.ts` was committed with `screen: 'Home'`. |
| R2 | **Home curated card broke:** the image now sits under the text (stacked) instead of side by side, and the text block is indented. Stitch = text at the start, image bleeding at the end-bottom corner. |

**Still open / new small issues**
| # | Finding |
|---|---|
| O1 | Home greeting and subtitle are left-aligned in Arabic (should start from the right). The routine-name placeholder is also left-aligned. |
| O2 | Connection States shows an **invented device** — "Odora Air 01 · Model SA-200", "Hinoki Canopy", "cartridge piezo sensors" — instead of the real device from `DeviceController`. |
| O3 | Inline strings: 85 remain in Batch A (ConnectionStates 30, Schedule 14, Settings 12, Pairing 11, Devices 11). |
| O4 | Copy drift: "سجل العطور" became "مجموعة العطور الفاخرة" (wrong meaning — it's scent history); "أجواء الجهاز" became "المنظومة". |
| O5 | The Home carousel peek card shows no device name. There is also a missing space in "إشارة قوية(-58 dBm)". |
| O6 | The tab bar uses hard-coded rgba colours instead of tokens. |

---

## Re-review of commits `7a8f4af` + `dc34369` (2026-09-25, native iPhone 17 Pro)
Report: `reviews/report-2026-09-25-batch-a-closeout.md` (all ✅). `tsc` exit 0. Proofs: `reviews/qa-app-2026-09-25/`.

**Verified on native (Arabic):** tab bar back on all tab roots · Forget device → Devices tab with bar and the device removed · greeting starts from the right · curated card side by side, image bleeding bottom-start · carousel names visible · Connection States uses the real device, 3-step checklist, invented model names gone · "سجل العطور" / "أجواء الجهاز" · 0 inline `isRTL ? '…'` strings in the 7 screens · 0 `textAlign: isRTL` · tab-bar colours from tokens.

**Found (the report says "no overlap" — AG's own English proofs show these):**
| # | Finding |
|---|---|
| F1 | A red LogBox error on AG's English proofs: "Cannot update a component (`LanguageConfirmSheet`) while rendering a different component". Cause: `RootNavigator.tsx` lines 30–43 call `useAppStore.setState` and `i18n.changeLanguage` **during render**. |
| F2 | EN Home curated card: the title and description run **under the bottle image** (`maxWidth: '70%'` is too wide once the image is absolute). |
| F3 | EN Home carousel card footer: the oil name touches the room chip, and the chip is cut at the card edge ("LIVING ROO"). |
| F4 | AR Home "اكتشف التشكيلة" arrow points → (wrong). `HomeScreen.tsx:665` uses `isRTL ? 'arrow_back' : 'arrow_forward'`, but Material Symbols already mirrors `arrow_forward` in RTL (at 7b7677b the plain `arrow_forward` rendered ← correctly) → a double flip. |
| F5 | Connection States still has the acoustic claim "معتمد بهدوء فائق أقل من 22 ديسيبل" / "Sub-22dB Quiet Mark Certified" and "Cold-Air Acoustic Atomizer" (`ar.ts` 102, 103, 387; `en.ts` 101, 102). Banned in 06 §1.4. |
| F6 | Connection States hero: the leaf badge is clipped by the circle (`botanicalBadge` sits inside the `overflow: hidden` backdrop); the Bluetooth icon has a second manual slash (`btSlashLine`) → looks like an X. The body background is `surface` (white) instead of `bg` (cream). |
| F7 | "Circadian" wording in English: `en.ts` 178, 306, 354. |
| F8 | Devices oil pill shows "%68" in Arabic (bidi): `DevicesScreen.tsx:320` builds the string by concatenation. |
| F9 | Forget-device sheet title "إلغاء اقتران الجهاز؟" renders in a fallback font with spaced letters: `DeviceSettingsScreen.tsx` `sheetTitle` sets `fontWeight: '700'` over the Arabic family. |

**Verdict:** very close. After F1–F9, Batch A goes to the owner.

---

## Re-review of commit `550287c` (2026-09-25, native iPhone 17 Pro)
F1–F10 all verified on native (Arabic) and in AG's new English proofs: no red toast; the curated card text clears the image; the carousel footer truncates cleanly; arrows mirror correctly; acoustic claims removed; Connection States hero, background and device card fixed; "circadian" gone; "الزيت 68%"; the sheet title font is fixed; "فترات" is used everywhere. `tsc` 0.

**Last 3 small items**
| # | Finding |
|---|---|
| L1 | Device Control dial footer (`DeviceControlScreen.tsx` ~374–386): in English the two items collide ("…micro-diffusion✓ Waterless Cold-Air") and the second one touches the card edge. It also lost the phase countdown that 08 §4 requires ("Spraying · 12s" / "Paused · 48s"). |
| L2 | Forget sheet: the description and the "إلغاء" button still render in a fallback font (letters spaced apart). `fontWeight` on the Arabic family: 18 occurrences in `DeviceSettingsScreen.tsx`, and `Button` `textStyle` `fontWeight: '700'` plus a hard-coded `#FFFFFF` (line ~622). |
| L3 | English eyebrows use wide letter-spacing and uppercase ("ACTIVE", "LIVING ROOM", "HOME"). That's fine in English, but the tab labels ("HOME / DEVICES / STORE / ACCOUNT") are uppercase, which Stitch does not do → use sentence case for the tab labels. |

**Verdict:** Batch A is ready for the owner's review now. L1–L3 are polish and can go in with Batch B's review.
