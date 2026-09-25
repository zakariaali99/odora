# Message to Antigravity (Odora) — Batch A: final polish (L1–L3)

I verified `550287c` on the **native iPhone 17 Pro** (Arabic) and in your new English proofs. **F1–F10 are all done and correct**: no red toast, curated card clear, carousel footer clean, arrows mirrored, acoustic claims gone, Connection States fixed, "circadian" gone, "الزيت 68%", sheet title font, "فترات" everywhere. Good work — and thank you for checking the proofs this time.

Batch A now goes to the owner. While they review it, do these 3 small items. Change nothing else.

---

## L1. Device Control dial footer: collision + missing phase countdown

**Symptoms (English, `device_control_en_end_native.png`):** the row reads "Active · Cold-air micro-diffusion✓ Waterless Cold-Air". The two items touch, and the second one runs into the card edge. The row also lost the phase countdown that `08 §4` requires ("Spraying · 12s" / "Paused · 48s").

**Part A — the data.** `app/src/device/types.ts` `DeviceState` (line 28) has no phase. Add:
```ts
phase: 'spraying' | 'paused' | 'off';
phaseRemainingSec: number;
```
In the mock transport (`app/src/device/transports/`), run a 1-second tick while `power === true`:
- start in `'spraying'` with `phaseRemainingSec = sprayOnSec`;
- decrement each second; at 0, switch to `'paused'` with `sprayOffSec`, then back to `'spraying'`, and so on;
- in `continuous` mode, stay `'spraying'` with `phaseRemainingSec = 0`;
- `power === false` → `'off'`, 0;
- emit the new state through the existing subscribe mechanism;
- clear the interval on disconnect and on power off.

**Part B — the row.** `DeviceControlScreen.tsx` lines ~374–386 (`dialFooterRow`):
- **Item 1** (start side): icon `airwave` + the phase text from new keys:
  - `deviceControl.phaseSpraying`: "ينتشر الآن · {{sec}} ث" / "Spraying · {{sec}}s"
  - `deviceControl.phasePaused`: "متوقف مؤقتاً · {{sec}} ث" / "Paused · {{sec}}s"
  - `deviceControl.phaseContinuous`: "ينتشر باستمرار" / "Spraying continuously"
  - `deviceControl.phaseOff`: "متوقف" / "Off"
  
  Wrap the number in `⁦…⁩`.
- **Item 2** (end side): keep the check icon, but shorten the text to `deviceControl.waterlessShort`: "بدون ماء" / "Waterless".
- **Styles:** `dialFooterRow` → `flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12`. Each `dialFooterItem` → `flexShrink: 1, flexDirection: 'row', alignItems: 'center'`. Both `Text`s → `numberOfLines={1}`.
- Remove `fontWeight: '500'` from item 1's Text (see L2).
- The mist animation must follow `phase === 'spraying'` (per `05 §5`): it runs while spraying and stops while paused or off.

**Check:** in Interval mode, the number counts down every second and switches between "ينتشر الآن" and "متوقف مؤقتاً". The mist animates only while spraying. Continuous mode shows "ينتشر باستمرار". Power off shows "متوقف" and no mist. In English, the two items have a visible gap and nothing touches the card edge.

---

## L2. Arabic fallback font caused by `fontWeight`

**Symptom:** in the Forget sheet (`device_settings_ar_sheet_native.png`), the description "هل أنت متأكد…" and the "إلغاء" button render in a system fallback font with spaced letters. The title is correct now.

**Cause:** `fontWeight` on top of the IBM Plex Sans Arabic family. There are 18 occurrences in `DeviceSettingsScreen.tsx` alone. Also line ~622: `textStyle={{ color: '#FFFFFF', fontWeight: '700' }}`.

**Do:**
1. In `app/src/theme/typography.ts`, make every token carry its weight through `fontFamily` only — no `fontWeight` field on any Arabic token.
2. Remove `fontWeight` from all inline styles in the **7 Batch A screens** and in `components/ui/Button.tsx`. Where a heavier weight is needed, switch the family instead: `fontFamilies.arabic.semiBold` / `.bold` in RTL, `fontFamilies.latin.displaySemiBold` in LTR. Add a tiny helper in `typography.ts`:
   ```ts
   export const weightFamily = (isRTL: boolean, w: 'regular'|'medium'|'semiBold'|'bold') =>
     isRTL ? fontFamilies.arabic[w] : fontFamilies.latin[w === 'regular' ? 'displayRegular' : w === 'medium' ? 'displayMedium' : 'displaySemiBold'];
   ```
3. Line ~622: `'#FFFFFF'` → `colors.onInk` (or whichever on-error token exists; add `onError: '#FFFFFF'` to both themes if missing).

**Check:**
```
grep -c "fontWeight" app/src/screens/{Home,Devices,DeviceControl,DevicePairing,Schedule,DeviceSettings,ConnectionStates}Screen.tsx app/src/components/ui/Button.tsx
```
must print 0 for every file. On native Arabic, open the Forget sheet: all three texts use the same app font, with no spaced letters.

---

## L3. English tab labels: no uppercase

**File:** `components/ui/BottomTabBar.tsx` lines 89–90:
```ts
letterSpacing: isRTL ? 0 : 0.8,
textTransform: isRTL ? 'none' : 'uppercase',
```
**Do:** set `letterSpacing: 0` and remove `textTransform`. Stitch uses sentence case: "Home · Devices · Store · Account". Do the same for the Home app-bar title ("HOME" → "Home"; `HomeScreen.tsx` ~line 118, `textTransform: isRTL ? 'none' : 'uppercase'` → remove it).

**Check:** English tab bar reads "Home  Devices  Store  Account" and the Home app bar reads "Home".

---

## Report, proof, commit
1. Add "L1–L3" to `reviews/report-2026-09-25-batch-a-closeout.md` (✅/❌ + one line each).
2. Native proofs, Arabic + English:
   - Device Control **end** — two captures a few seconds apart, showing the countdown changing;
   - the Forget sheet (AR);
   - Home top (EN, for the tab bar).
   
   Open each PNG and check it before writing ✅.
3. `npx tsc --noEmit` = 0. `previewTarget.ts` committed with `screen: null, lang: null`.
4. Commit message: `fix(batch-a): phase countdown, arabic font weights, sentence-case tabs`.

Then stop. **Next, I will review Batch B (Store flow) screen by screen against Stitch** — wait for that review before touching any Store screen, and don't start Batch C.
