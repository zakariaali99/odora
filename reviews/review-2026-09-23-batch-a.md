# Review — Batch A (image-to-image rebuild), 2026-09-23

**Reviewed:** uncommitted work in `app/` — new screens Home, Devices, DeviceControl, DevicePairing, Schedule, DeviceSettings, ConnectionStates + `AppBar`, `previewTarget.ts`, `scripts/generate_batch_a_qa.py`, proofs in `reviews/qa-app-2026-09-23/`.
**Method:** `tsc --noEmit` (exit 0), read the code, ran the app and captured **my own** full-height screenshots at 390pt and put them next to the Stitch targets at the same width.

## Verdict: big step forward — the structure is right. Fix the items below, then Batch B.
Previous round's R1–R3 (toggle thumb, slider RTL, StatBlock spacing) are fixed, and the iOS screenshots are now the real native app, not Safari (R4 closed).

**What matches well:** section order and composition on Home, Devices, Device Control and Schedule; app bar everywhere; tab bar only on tab roots; correct RTL mirroring; the §4 replacements are used properly (Next routine / Mode instead of temp-humidity and dB; connection meta row on the device card; ambience rows = schedule + auto-off); Boost preset correctly hidden while `burst` is off; phase countdown; oil shown with "(تقديري)".

## Findings
| # | Severity | Finding |
|---|---|---|
| F1 | Medium | **Hero product image is wrong in both Home and Device Control.** Stitch fills the card width with a wide landscape image (≈350×256 on Home, ≈176×208 on control); ours centres a small portrait image on a light tile, leaving large empty space. Match the Stitch crop, size and framing. |
| F2 | Medium | **Intensity gauge geometry is wrong.** Stitch is a **270° arc** (start bottom-left, rounded caps, 224 box, stroke 8); ours draws an almost full 360° ring, and level 8 renders ~95% full. Fix arc span and value→angle mapping. |
| F3 | Medium | **Home "curated" card: the text overlaps the product image.** In Stitch the image sits in its own area at the end side. |
| F4 | Medium | **Untranslated strings in the Arabic UI:** "Oil", "LIVE", "BLE CONNECTED". Everything user-facing goes through i18n. |
| F5 | Medium | **Time format bug:** Schedule shows "13:00 PM – 16:30 PM" (24-hour clock + AM/PM). Use 24h without meridiem in Arabic, or 12h + AM/PM in English. |
| F6 | Low | Home hero: the decorative green glow behind the top corner is oversized and clipped; Stitch's is a soft, contained halo behind the device. |
| F7 | Low | Account action in the app bar uses a plain icon; Stitch uses a small round avatar image. |
| F8 | Low | Devices: Stitch's "Synchronized Home Flow" card is omitted. Correct call (we cannot sync devices), but state it in the screen notes so it is not mistaken for a miss. |
| F9 | Process | **The delivered proofs are not comparable:** single viewport only, and the native screenshot is scaled ~2.4× larger than the Stitch image. `08 §2.7` asks for **full scroll height at the same width**. Regenerate with both sides at 390pt wide, full height. |
| F10 | Process | Batch A is **uncommitted**. Commit it. |
| F11 | Low | `app/src/previewTarget.ts` is a QA hatch shipped in app source — guard it with `__DEV__` (or strip it in production builds). |

## Not checked
Pairing, Device Settings and Connection States were reviewed only from AG's own (single-viewport) proofs. They will be verified properly once F9 is fixed.

---

## Overlap & clipping audit (2026-09-23, second pass)
Ran a collision audit in the running app (element hit-testing at 390×844 and full height) plus a visual pass on every Batch A screen.

| # | Severity | Finding |
|---|---|---|
| N1 | **Critical** | **Device Settings is almost entirely in English inside the Arabic app** (only the app-bar title is Arabic), and it **reintroduces the invented features we removed**: "LED Halo Ring" + Halo Intensity slider, "Night Mode Dimming (mutes LEDs)", "Acoustic Whisper Dampening <14 dB", "Installed Firmware v2.4.1-rc / Firmware is up to date", "BLE 5.2", "BLE MAC", "mesh cryptographic credentials", plus the "Sanctuary / Atelier / Artisan Vessel" vocabulary. This violates `06 §1.4` and `08 §4`. Rebuild the screen: Arabic first, and only real settings (rename, room, auto-off timer, device info = model + serial + added date, Forget device). |
| N2 | Medium | **Content is clipped by the bottom tab bar.** On Devices the last device card is cut in half; on Home the "الأجهزة المتصلة" section runs under the bar. Scroll content needs bottom padding = tab-bar height + safe-area inset. |
| N3 | Medium | **On Device Control the floating status pill covers the mode control** (Continuous / Interval) at real phone height. Add bottom padding equal to pill height + 24. |
| N4 | Medium | **Home curated card: the image is not mirrored in RTL.** It stays on the right while the Arabic text also starts from the right, so the text runs on top of the bottle. Mirror the card layout (image at the end side in RTL). |
| N5 | Low | Section-header status dots touch their text with no gap ("●المساحات الخاصة", "●الموزع يعمل"). Add a 6–8pt gap. |

**Method note for AG:** a screen is not finished until it is checked at a real phone height (390×844) with content scrolled to the end — several of these only appear there, not in a full-height capture.
