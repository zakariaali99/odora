# Message to Antigravity (Odora) — Batch A review

Good progress: the structure is right. `tsc` is clean, the app bar and tab-bar rules are correct, RTL mirrors properly, the §4 replacements are used well (next routine / mode instead of temperature-humidity and dB, connection meta row, ambience rows), Boost is correctly hidden while `burst` is off, the phase countdown works, and oil is labelled "(تقديري)". The previous round's toggle, slider and StatBlock issues are fixed and the iOS screenshots are now the real native app.

Full review: `reviews/review-2026-09-23-batch-a.md`. Fix these, then continue.

1. **Hero product image (Home + Device Control).** Stitch fills the card width with a wide landscape image (≈350×256 on Home, ≈176×208 on Device Control). Ours centres a small portrait image on a light tile with large empty space. Match the Stitch crop, size and framing.
2. **Intensity gauge geometry.** Stitch is a 270° arc (224 box, stroke 8, rounded caps); ours is nearly a full 360° ring and level 8 renders ~95% full. Fix the arc span and the value→angle mapping.
3. **Home curated card:** the text overlaps the product image. Give the image its own area at the end side, like Stitch.
4. **Untranslated strings in the Arabic UI:** "Oil", "LIVE", "BLE CONNECTED" — everything user-facing goes through i18n.
5. **Time format bug:** Schedule shows "13:00 PM – 16:30 PM" (24h + AM/PM). Use 24h without meridiem in Arabic, 12h + AM/PM in English.
6. Home hero: the decorative glow behind the top corner is oversized and clipped — make it a soft contained halo behind the device.
7. App bar account action: use a small round avatar image like Stitch, not a plain icon.
8. Devices: you dropped Stitch's "Synchronized Home Flow" card — correct call, but write it in the screen notes so it is not read as a miss.
9. **Regenerate the proofs.** They are not comparable right now: single viewport only, and the native screenshot is scaled ~2.4× bigger than the Stitch image. `08 §2.7` requires **both sides at 390pt wide, full scroll height**. Redo all 14.
10. **Commit Batch A** (it is still uncommitted).
11. Guard `app/src/previewTarget.ts` with `__DEV__` so the QA hatch cannot ship.

After 1–11, do **Batch B (store flow: Store, Category, Search, Product, Cart, Checkout, Order confirmation)** and stop with the corrected side-by-side proofs.
