# Message to Antigravity (Odora) — Batch A: last pass (F1–F10)

I tested `dc34369` on the **native iPhone 17 Pro** (Arabic), tapped every flow, and read your English proofs in `reviews/qa-app-2026-09-25/`. Review: `reviews/review-2026-09-24-batch-a-native.md` → "Re-review of commits 7a8f4af + dc34369".

**Verified — don't touch:** the tab bar on all 4 tab roots; Forget device → Devices tab (with the bar); greeting from the right; curated card composition in Arabic; carousel names; Connection States uses the real device; the 3-step checklist; "سجل العطور" / "أجواء الجهاز"; 0 inline strings; 0 `textAlign: isRTL`; tab-bar tokens. Good work — this is close.

Your report says "no overlap", but your own English proofs (`home_en_end_native.png`, `device_control_en_end_native.png`) show a **red error toast** and **text running under an image**. Look at every proof before you write ✅.

Do the items in order. Change only what is listed.

---

## F1. Red error in dev: "Cannot update a component (`LanguageConfirmSheet`) while rendering a different component"

**Cause:** `app/src/navigation/RootNavigator.tsx` lines 30–43 call `i18n.changeLanguage(...)` and `useAppStore.setState(...)` **inside render**.

**Do:**
1. **Delete** lines 30–43 from `RootNavigator.tsx` (the whole `if (__DEV__ && previewConfig.lang) { … }` block). Remove the `Platform`, `i18n` and `useAppStore` imports if they become unused.
2. In `app/App.tsx`, inside `initApp()`, replace:
   ```ts
   const activeLang: 'ar' | 'en' =
     storedLang === 'en' || storedLang === 'ar' ? storedLang : 'ar';
   ```
   with:
   ```ts
   const previewLang = __DEV__ ? previewConfig.lang : null;
   const activeLang: 'ar' | 'en' =
     previewLang ?? (storedLang === 'en' || storedLang === 'ar' ? storedLang : 'ar');
   ```
   (`previewConfig` is already imported in `App.tsx`.)
3. In the same function, in the native branch: after `I18nManager.forceRTL(isRtl)`, if `I18nManager.isRTL !== isRtl`, call `await Updates.reloadAsync()`. The direction only applies after a reload — use the same `expo-updates` import that the language switch already uses.

**Check:** set `previewConfig.lang = 'en'` → cold launch → English, LTR, **no red toast**. Set `'ar'` → Arabic, RTL, no toast. Commit with `lang: null`.

---

## F2. English Home curated card: the text runs under the bottle

**Cause:** the image is `position: 'absolute'` (128 wide, `end: -4`), but the text column is `maxWidth: '70%'`. That is wider than the free space on a 390pt screen.

**Maths:** card inner width = 350 − 2×24 = 302. The image covers the last 124pt of the card, so the free text width is 302 − 124 + 24 − 12 (gap) = **190pt**.

**Do:** `HomeScreen.tsx` style `storeTeaserTextContent` (line ~940):
```ts
storeTeaserTextContent: {
  width: '100%',
  paddingEnd: 112,
  zIndex: 1,
},
```
(Remove `maxWidth: '70%'`.) Keep `numberOfLines={2}` on the description, and add `numberOfLines={2}` on the title.

**Check:** English and Arabic — no letter of the pill, title, description or link touches the bottle photo. There must be at least 12pt of space.

---

## F3. English carousel card footer: oil name touches the room chip, chip cut ("LIVING ROO")

**File:** `HomeScreen.tsx` lines 574–583 and styles `sanctuaryFooter` / `colorBadge` (~918–930).

**Do:**
- The oil-name `Text`: add `numberOfLines={1}` and style `{ flex: 1, marginEnd: 8 }`.
- The `colorBadge` `View`: add `flexShrink: 0`.
- The room text inside the chip: `numberOfLines={1}`, no uppercase and letterSpacing 0 (use the `labelSm` token as-is, without `textTransform`).

**Check:** English — "Forest Sage & Ce…" truncates with an ellipsis, the chip shows "Living Room" in full, there is a gap between them, and nothing is cut at the card edge.

---

## F4. Arabic "اكتشف التشكيلة" arrow points the wrong way

**Cause:** `HomeScreen.tsx:665` has `name={isRTL ? "arrow_back" : "arrow_forward"}`. Material Symbols **already mirrors** directional icons in RTL — at `7b7677b` the plain `arrow_forward` rendered ← in Arabic. Your ternary flips it back to →. It is the same double-flip as `row-reverse`.

**Do:** line 665 → `name="arrow_forward"`. Then grep the app for `isRTL ? "arrow_` / `isRTL ? 'arrow_` / `isRTL ? 'chevron_` and make every one a single LTR name:
```
grep -rn "isRTL ? ['\"]\(arrow\|chevron\)" app/src
```
**Rule:** icon names are always the LTR name; the font mirrors them.

**Check:** Arabic — the link arrow points ←. English — →. The app-bar back chevron stays correct (it already uses `chevron_left`).

---

## F5. Remove the acoustic / "quiet" claims (06 §1.4)

| File | Line | Key | Action |
|---|---|---|---|
| `i18n/ar.ts` | 102 | `quietDiffuser` "موزع رذاذ بارد هادئ" | delete |
| `i18n/ar.ts` | 103, 387 | `quietMark` "معتمد بهدوء فائق أقل من 22 ديسيبل" | delete both |
| `i18n/en.ts` | 101 | `quietDiffuser` "Cold-Air Acoustic Atomizer" | delete |
| `i18n/en.ts` | 102 (and any duplicate) | `quietMark` "Sub-22dB Quiet Mark Certified" | delete |

In `ConnectionStatesScreen.tsx` (~598–611, the device card):
- Subtitle → `` `Odora A316 · ${getLocalizedRoomName(activeDevice.roomName, isRTL)}` ``
- Badge row → new key `connection.lastSettings`: "آخر إعداد محفوظ: المستوى {{level}} · {{mode}}" / "Last saved: Level {{level}} · {{mode}}". `level = activeDevice.intensity`; `mode` = `t('deviceControl.continuous')` or `t('deviceControl.interval')`.

**Check:** `grep -rn "22\|dB\|ديسيبل\|Acoustic\|Quiet" app/src/i18n app/src/screens/ConnectionStatesScreen.tsx` returns nothing related to sound. The card shows name, "Odora A316 · room" and the last saved level and mode.

---

## F6. Connection States hero and background

**File:** `ConnectionStatesScreen.tsx` lines ~302–321.
1. Move the `botanicalBadge` `View` (lines ~317–319) **out of** `circularArtBackdrop`. Make it the last child of `deviceArtBox`, positioned `bottom: 8, end: 8` relative to the box, so the circle's `overflow: hidden` no longer cuts it.
2. Delete the manual slash `<View style={[styles.btSlashLine, …]} />` (line ~315) and its style. The `bluetooth_disabled` icon already has a slash.
3. Background: lines 85 and 135 `backgroundColor: colors.surface` → `colors.bg`. And in `RootNavigator.tsx:62`, `contentStyle: { backgroundColor: colors.surface }` → `colors.bg`, so no pushed screen shows a white body under the cream app bar.

**Check:** the leaf badge is a full circle at the bottom-start of the hero, the Bluetooth icon has one slash, and the whole screen is cream (the same as the app bar).

---

## F7. "Circadian" wording (English)

| `en.ts` line | Now | Change to |
|---|---|---|
| 178 | `circadianSchedule: 'Circadian Schedule'` | `'Daily schedule'` (rename the key to `dailySchedule` in both files and at every use) |
| 306 | `'Automate cold-air diffusion across your daily circadian rhythms.'` | `'Automate your diffuser throughout the day.'` |
| 354 | `'Your diffuser will continue its last active circadian cycle independently.'` | `'Your diffuser keeps running its saved schedule on its own.'` |

Arabic for 306: "أتمتة الموزع على مدار اليوم."

**Check:** `grep -rni "circadian" app/src` → 0.

---

## F8. Arabic oil pill shows "%68" (bidi)

**File:** `DevicesScreen.tsx:320`:
```ts
{`${t('home.oil')} ${device.oilLevel}% ${device.oilSensor ? '' : t('home.oilEstimated')}`}
```
**Do:** add an i18n key and wrap the number in an LTR isolate:
```ts
// ar.ts: oilPill: 'الزيت {{percent}}',   en.ts: oilPill: 'Oil {{percent}}'
const pct = `\u2066${device.oilLevel}%\u2069`;
t('devicesScreen.oilPill', { percent: pct }) + (device.oilSensor ? '' : ` ${t('home.oilEstimated')}`)
```
Apply the same `\u2066…\u2069` wrapping to **every** percentage and "ml" value in Arabic strings: Home stat tile, Device Control oil card ("34 ml / 50 ml"), Settings.

**Check:** Arabic — "الزيت 68% (تقديري)" with the % after the number, on all three device cards.

---

## F9. Forget-device sheet title renders in a fallback font

**File:** `DeviceSettingsScreen.tsx`, style `sheetTitle` (line ~1041) sets `fontWeight: '700'` on top of the Arabic font family. iOS then substitutes a system font (spaced letters, different shape).

**Do:** remove `fontWeight` from `sheetTitle` and use the family token instead: `fontFamily: isRTL ? fontFamilies.arabic.bold : fontFamilies.latin.displaySemiBold` (both exported from `theme/typography.ts`).

**Rule:** never set `fontWeight` on text that uses a custom font family — pick the weight through the family token. Grep the 7 Batch A screens for `fontWeight:` on Arabic text and apply the same fix wherever the glyphs change.

**Check:** the sheet title "إلغاء اقتران الجهاز؟" uses the same font as the rest of the app, with no spaced letters.

---

## F10. One Arabic word for "Interval"

`ar.ts` uses two different words for the same mode: `home.interval: 'نبض'` (line 129) and `deviceControl.interval: 'فترات'` (lines 176 and 324). The Home stat tile says "نبض" while Device Control says "فترات".

**Do:** use **"فترات"** everywhere — change line 129 to `'فترات'`. Also check `intervalTiming` (line 137, "30ث / 60ث") reads as "30ث تشغيل · 60ث إيقاف" / "30s on · 60s off", so the numbers make sense.

**Check:** Home mode tile, Devices cards, Device Control segmented control and the Schedule chips all say "فترات" / "Interval".


---

## Report, proof, commit
1. Add a section "F1–F10" to `reviews/report-2026-09-25-batch-a-closeout.md`: ✅/❌ per item, plus one line on what changed.
2. Re-capture only the affected screens, native, **Arabic and English**: Home (top + end), Devices (top), Device Control (end), Connection States (top + end), and the Forget-device sheet (Arabic). **Open each PNG and check it:** no red toast, no text under images, no cut chips, arrows pointing the right way.
3. `npx tsc --noEmit` = 0. Commit `previewTarget.ts` with `screen: null, lang: null`.
4. Commit message: `fix(batch-a): dev render warning, EN overlaps, icon mirroring, remove acoustic claims`.

Then stop. Batch A goes to the owner after this. Don't touch Batch B, and don't start Batch C.
