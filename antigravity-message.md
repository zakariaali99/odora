# Message to Antigravity (Odora) — Batch A: RTL regression + remaining items

I tested your uncommitted changes on the **native iPhone 17 Pro simulator** in Arabic and tapped through every flow. Review: `reviews/review-2026-09-24-batch-a-native.md` → section "Re-review after AG's fix pass".

**Verified fixed:** pairing (name + room → new device → its own control screen), full-ring gauge, bidi, Western digits, oil-card collision, "chamber"/"sanctuary"/Boost/"جوليان"/"30ml" removed, Arabic letter-spacing, Device Settings cleanup, Connection States reachable and close to Stitch, routine sheet saves and updates the weekly chart, Sun–Thu default days. Good progress.

## 1. Critical — Arabic is laid out LTR on native (new regression)
Home and the app bar on every screen are **left-to-right in Arabic**: title on the left, avatar on the right, back arrow on the left, Home greeting/cards/progress bar LTR. Your own `native_batch_a/home_ar_top_comparison.png` shows it.

**Cause:** `flexDirection: isRTL ? 'row-reverse' : 'row'` (19 places in `AppBar.tsx` and `HomeScreen.tsx`). On native, `I18nManager.forceRTL(true)` already mirrors `row`. Adding `row-reverse` flips it back to LTR. Web does not auto-mirror, which is why it looked right there.

**Fix:** use plain `row` everywhere and let `I18nManager` mirror. Use `start`/`end` (not `left`/`right`) for margins, padding, position and textAlign. Web must follow the same rule via `dir="rtl"` on the root. Then grep the whole app for `row-reverse` and `isRTL ? 'right'` and remove every direction ternary. Devices already does this and renders correctly — use it as the model.

**Check:** in Arabic, every app bar has the back chevron on the **right** pointing right, the title next to it, and actions on the left.

## 2. Still open
2. **Time fields are free text.** Replace the start/end `TextInput`s with a real time picker (24h). End must be after start, or allow overnight explicitly.
3. **i18n (item 5 not done):** ~257 inline `isRTL ? … : …` strings remain in the 7 Batch A screens. Move them all to `ar.ts` / `en.ts`.
4. **Low-oil alert "<5%"** still shows with `oilSensor` OFF. Hide it, or reword it as an estimate ("تنبيه عند اقتراب نفاد الزيت (تقديري)"). "٪٥" still uses an Eastern digit.
5. **Mistranslation:** "Sage" is "أخضر حكيم" ("wise green"). Use **"أخضر ميرمية"** (`ar.ts:203`, Pairing lines 293/317).
6. **Pairing:** don't claim which oil is loaded. The default name must not duplicate an existing device (use "موزع + room", then add a number if needed).
7. **One shared room list** for Pairing and Settings. Right now they differ, and a device paired into "المكتب" shows no selected chip in Settings.
8. **Schedule belongs to a device:** opening Schedule from a device must show that device's routines and name. Right now it always shows "موزع غرفة المعيشة".
9. **Seed routines:** "5 days" must be **Sun–Thu**, not Mon–Fri.
10. **Home hero image:** the photo must **fill** the 192×192 square (radius 16, `object-cover`), with nothing behind it — no grey frame, no pale circle, no leaf. Match `odora_home_dashboard`.
11. **Routine icons:** one icon per routine by start time (sunrise / sun / moon), as in Stitch. Not the same clock for all.
12. The pairing success toast covers the app-bar title — show it below the app bar. The Devices button reads "+ + إقران جهاز": drop the "+" from the text.

## 3. Process
- **Commit** Batch A when done and write a short report listing items 1–12 with ✅/❌.
- Proof = native screenshots in Arabic **and** English, scrolled top and end, each next to its Stitch screen. **Before you send them, look at the Arabic ones yourself:** app bar mirrored, text starting from the right, nothing overlapping.

Fix 1–12, then stop and report. Do not touch Batch B or start Batch C.
