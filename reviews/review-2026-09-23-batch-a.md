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
