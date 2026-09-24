# Message to Antigravity (Odora) — Batch A: overlap & language audit

I ran a collision/clipping audit on the running app plus a visual pass on every Batch A screen. The structure is good, but there are real overlaps and one screen that breaks the rules badly. Full review: `reviews/review-2026-09-23-batch-a.md` (both sections).

## Must fix first (critical)
1. **Device Settings is almost entirely in English** inside the Arabic app — only the app-bar title is Arabic. And it **reintroduces the invented features we removed**: "LED Halo Ring" + Halo Intensity slider, "Night Mode Dimming (mutes LEDs)", "Acoustic Whisper Dampening <14 dB", "Installed Firmware v2.4.1-rc / Firmware is up to date", "BLE 5.2", "BLE MAC", "mesh cryptographic credentials", and the "Sanctuary / Atelier / Artisan Vessel" wording. This violates `06 §1.4` and `08 §4`. Rebuild it: Arabic first through i18n, and only real settings — rename, room, auto-off timer, device info (model, serial, added date), Forget device. No LED, no acoustics, no firmware, no MAC, no mesh.

## Overlaps and clipping
2. **Content is clipped by the bottom tab bar:** on Devices the last device card is cut in half; on Home the "الأجهزة المتصلة" section runs under the bar. Add bottom padding = tab-bar height + safe-area inset to every scroll view.
3. **Device Control: the floating status pill covers the mode control** (Continuous / Interval). Add bottom padding = pill height + 24.
4. **Home curated card: the image is not mirrored in RTL** — it stays on the right while the Arabic text also starts from the right, so the text sits on top of the bottle. Mirror the card layout.
5. Section-header status dots touch their text ("●المساحات الخاصة", "●الموزع يعمل") — add a 6–8pt gap.

## Still open from the first Batch A review
6. Hero product image (Home + Device Control): Stitch fills the card width with a wide landscape image; ours is a small portrait with empty space.
7. Intensity gauge: must be a 270° arc (224 box, stroke 8); ours is nearly a full ring and level 8 looks ~95%.
8. Untranslated strings elsewhere: "Oil", "LIVE", "BLE CONNECTED".
9. Schedule time format: "13:00 PM – 16:30 PM" (24h + AM/PM).
10. Home hero glow is oversized and clipped; app-bar account action should be a round avatar.
11. Regenerate all 14 proofs at **390pt wide, full scroll height, both sides** — and additionally check every screen at **390×844 scrolled to the end**, because the clipping bugs only appear there.
12. Commit Batch A, and guard `app/src/previewTarget.ts` with `__DEV__`.

**Before you say a screen is done:** run a self-check that no text/image overlaps another element and nothing is hidden behind the tab bar or a floating button, in **both** Arabic and English.

Fix 1–12, then stop and report. Do not start Batch B yet.
