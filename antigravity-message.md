# Message to Antigravity (Odora) — Batch A: close-out (commit 7b7677b → next)

I tested `7b7677b` on the **native iPhone 17 Pro simulator** in Arabic and tapped through every flow. Full review: `reviews/review-2026-09-24-batch-a-native.md` → section "Re-review of commit 7b7677b".

**Verified fixed — do not touch these:** native RTL on rows and app bar (0 `row-reverse`), Home hero photo filling the 192 square, the time picker (hour ± and :00/:15/:30/:45), estimate wording on the low-oil alert, "أخضر ميرمية", `SHARED_ROOMS`, Schedule filtered by `deviceId`, Sun–Thu routines, per-routine icons, pairing "لم يتم تحميل زيت".

Do the items **in this order**. Each item has: the file and line, what is there now, what to change it to, and how I will check it. Do not change anything that is not listed.

---

## 1. CRITICAL — The tab bar is gone from the whole app

**Why:** `app/src/navigation/RootNavigator.tsx` line 48–49:
```ts
const initialRoute: keyof RootStackParamList =
  (previewConfig.screen as keyof RootStackParamList) || 'Home';
```
With `screen: null` the app starts on the bare stack screen `Home` (line 64), which has no tab bar. In `9c29830` the fallback was `'MainTabs'`. On top of that, `app/src/previewTarget.ts` was committed with `screen: 'Home'`.

**Do exactly this:**

1a. `app/src/previewTarget.ts` — commit it with:
```ts
export const previewConfig: PreviewConfig = {
  screen: null,
  lang: null,
  scrollToEnd: false,
  sheet: false,
};
```
Also: `lang: null`. Right now `lang: 'ar'` forces Arabic in every dev build and overrides the user's language choice. Remove the `timestamp` field from the type and from `RootNavigator` line 51 (the navigator key).

1b. `RootNavigator.tsx` — replace lines 48–49 with:
```ts
const TAB_ROUTES = ['Home', 'Devices', 'Store', 'Account'] as const;
type TabRoute = (typeof TAB_ROUTES)[number];

const previewScreen = __DEV__ ? previewConfig.screen : null;
const isTabPreview = !!previewScreen && (TAB_ROUTES as readonly string[]).includes(previewScreen);

const initialRoute: keyof RootStackParamList =
  !previewScreen || isTabPreview ? 'MainTabs' : (previewScreen as keyof RootStackParamList);
```
and give MainTabs the preview tab:
```tsx
<Stack.Screen
  name="MainTabs"
  component={MainTabsNavigator}
  initialParams={isTabPreview ? { screen: previewScreen as TabRoute } : undefined}
/>
```
Also wrap the whole language block at lines 33–46 in `if (__DEV__ && previewConfig.lang)` (already there) — with `lang: null` it will not run.

1c. **Delete the duplicate stack screens.** Remove these lines from `RootNavigator.tsx`:
```tsx
<Stack.Screen name="Home" component={HomeScreen} />
<Stack.Screen name="Devices" component={DevicesScreen} />
<Stack.Screen name="Store" component={StoreScreen} />
```
and their imports, plus `Home`, `Devices` and `Store` from `RootStackParamList` in `app/src/navigation/types.ts` (lines 13–15). Tabs must be the only way to reach them.

1d. **Fix every navigation from a pushed screen to a tab.** In React Navigation 7 you must name the nested navigator. Change each of these exactly:

| File:line | Now | Change to |
|---|---|---|
| `OrderConfirmationScreen.tsx:46` and `:424` | `navigation.navigate('Home')` | `navigation.navigate('MainTabs', { screen: 'Home' })` |
| `DeviceSettingsScreen.tsx:153` | `activeNav.navigate('Devices')` | `activeNav.navigate('MainTabs', { screen: 'Devices' })` |
| `DeviceControlScreen.tsx:155` | `activeNav.navigate('Account')` | `activeNav.navigate('MainTabs', { screen: 'Account' })` |
| `DeviceControlScreen.tsx:444` | `navigation.navigate('Store')` | `navigation.navigate('MainTabs', { screen: 'Store' })` |
| `SearchScreen.tsx:83` | `navigation.navigate('Account')` | `navigation.navigate('MainTabs', { screen: 'Account' })` |
| `CategoryScreen.tsx:151` | `navigation.navigate('Account')` | `navigation.navigate('MainTabs', { screen: 'Account' })` |
| `CategoryScreen.tsx:439` | `navigation.navigate('Store')` | `navigation.navigate('MainTabs', { screen: 'Store' })` |

Leave the calls inside the tab screens themselves (`HomeScreen.tsx` 131/136/486/572, `DevicesScreen.tsx:91`, `StoreScreen.tsx:84`) — they are siblings inside the tab navigator and work as they are.

1e. `App.tsx:118` — the `NavigationContainer` `key` uses `previewConfig.screen || 'Home'`. Remove that `key` prop entirely. It remounts the whole app and is not needed.

1f. Run `npx tsc --noEmit`. Any leftover `navigate('Home' | 'Devices' | 'Store')` from a stack screen will now show as a type error — fix each one with the `MainTabs` form above.

**Check (I will do this):** cold-launch the app → Home **with the 4-tab bar** at the bottom (الرئيسية at the right in Arabic). Tap each of the 4 tabs → the bar stays. From Device Settings → Forget device → I land on the Devices **tab**, with the bar. From Device Control → avatar → Account tab, with the bar.

---

## 2. CRITICAL — Home curated card: the image dropped under the text

**Why:** `HomeScreen.tsx` style `storeTeaserCard` (around line 930) has no `flexDirection`, so `Card` stacks its children in a column.

**Target (Stitch `odora_home_dashboard`, the "Autumn Curated" card):** card `rounded 24`, `surfaceMuted`/`surface-container-low` background, padding 24, `overflow: hidden`, min height 176. Text column max **70%** width at the start. Image **128×144** pinned to the **end-bottom corner**, offset `bottom: -8`, `end: -4`, only its top-start corner rounded 16, `resizeMode: 'cover'`.

**Do exactly this:**
```ts
storeTeaserCard: {
  padding: 24,
  borderRadius: 24,
  overflow: 'hidden',
  minHeight: 176,
},
storeTeaserTextContent: {
  maxWidth: '70%',
  zIndex: 1,
},
teaserImageContainer: {
  position: 'absolute',
  bottom: -8,
  end: -4,
  width: 128,
  height: 144,
  borderTopStartRadius: 16,
  overflow: 'hidden',
},
teaserBottleImage: { width: '100%', height: '100%' },
```
- Change `resizeMode="contain"` to `resizeMode="cover"` on the teaser `Image`.
- Remove `paddingEnd: 16` from the inline style on `storeTeaserTextContent` (around line 585).
- Use `end`, never `right`, so it mirrors in Arabic by itself.
- The title `'هينوكي مدخن وشاي أبيض' / 'Smoky Hinoki & White Tea'` (around line 625) moves to i18n: `home.curatedTitle`.

**Check:** Arabic — text at the right, bottle photo at the bottom-left corner, cropped by the card edge. English — the mirror of that. Nothing overlaps the text.

---

## 3. Arabic text that starts from the left

**Symptoms:** Home "مساء الخير" and the line under it (`HomeScreen.tsx:184–191`) are left-aligned. The routine-name field placeholder in the New-routine sheet (`ScheduleScreen.tsx:433–445`) is left-aligned.

**Cause and rule:** React Native swaps `left`/`right` in RTL (`I18nManager.doLeftAndRightSwapInRTL` is `true` by default). So `textAlign: 'left'` already means **start**, and `isRTL ? 'right' : 'left'` flips back to the wrong side — the same double-flip we had with `row-reverse`.

**Do exactly this:**
- 3a. Replace **all 11** `textAlign: isRTL ? 'right' : 'left'` in the app with `textAlign: 'left'`. Find them with:
  ```
  grep -rn "textAlign: isRTL" app/src
  ```
  They include `SearchScreen.tsx:98`, `StoreScreen.tsx:128`, `components/ui/Banner.tsx:83` and `components/ui/ListRow.tsx:69, 82`.
- 3b. Home greeting: add `textAlign: 'left'` to both `Text`s at lines 185 and 188.
- 3c. `TextInput` does **not** auto-align. On the routine-name input (`ScheduleScreen.tsx:433`), and on every `TextInput` in `components/ui/Input.tsx`, add:
  ```ts
  textAlign: I18nManager.isRTL ? 'right' : 'left',
  writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
  ```
  (Here the explicit `I18nManager.isRTL` is correct, because TextInput is not swapped.)

**Check:** Arabic — the greeting starts at the right edge, aligned with the "التالي: 08:00" row. The routine-name placeholder "مثال: وضوح الصباح" starts at the right. English — both at the left.

---

## 4. Connection States: remove the invented device and sensor wording

**File:** `app/src/screens/ConnectionStatesScreen.tsx`

| Line | Now | Change to |
|---|---|---|
| 47–59 | A fallback fake device ("موزع أودورا 01" / "Odora Air 01", "كانوبي الهينوكي" / "Hinoki Canopy", `oilSensor: true`, `burst: true`) | No fallback. If `devices` is empty, render `EmptyState`: title `connection.noDevicesTitle` = "لا توجد أجهزة مقترنة" / "No paired devices", button `connection.pairCta` = "إقران جهاز" / "Pair a device" → `navigation.navigate('DevicePairing')`. |
| ~378 | `'أودورا إير 01 · طراز SA-200'` / `'Odora Air 01 • Model SA-200'` | `` `Odora A316 · ${activeDevice.roomName}` `` (the model name stays Latin in both languages) |
| ~490 | "جارٍ إنشاء اتصال مشفر مع موزع أودورا وقراءة مستشعرات العبوة." / "Establishing encrypted handshake with Odora Air 01 and querying cartridge piezo sensors." | `connection.syncingBody` = "جارٍ الاتصال بـ {{name}} ومزامنة الإعدادات والجدول." / "Connecting to {{name}} and syncing settings and schedule." |
| ~495–530 sync checklist | "الاتفاق على المفتاح الآمن / Secure Key Agreement", "مستوى الزيت الدقيق", … | Exactly 3 rows: ① "تم العثور على الجهاز" / "Device found" ② "تم الاتصال" / "Connected" ③ "مزامنة الإعدادات والجدول" / "Syncing settings & schedule". Add a 4th row "قراءة مستوى الزيت" / "Reading oil level" **only when `activeDevice.oilSensor === true`**. |

Also search the file for "Atelier", "Air 01", "SA-200", "Hinoki", "piezo", "Resonance" and "Telemetry". After this item, none of them may remain.

**Check:** Device Control → tap the connection line → Connection States shows the **same** device name and room as the Device Control I came from. Pair a new device into "المكتب", open its Connection States → it shows that name and "Odora A316 · المكتب".

---

## 5. Copy drift in Device Control (wrong keys reused)

`DeviceControlScreen.tsx:460` uses `home.scentsCollection` (= "مجموعة العطور الفاخرة" / "Luxury Fragrance Collection"). This button is **scent history**. Line 470 uses `devicesScreen.ecosystem` (= "المنظومة").

**Do exactly this:**
- Add to `ar.ts` / `en.ts`, under a new `deviceControl` block:
  ```ts
  scentHistory: 'سجل العطور',   // en: 'Scent history'
  ambienceTitle: 'أجواء الجهاز', // en: 'Device ambience'
  ```
- Line 460 → `t('deviceControl.scentHistory')`. Line 470 → `t('deviceControl.ambienceTitle')`.
- Leave `devicesScreen.ecosystem` as it is — it is correct on the Devices screen.
- Rule from now on: one key per meaning. Never reuse a key from another screen because the text happens to fit.

**Check:** Device Control, scrolled down → the buttons read "طلب زيت جديد" and "سجل العطور", and the section title reads "أجواء الجهاز".

---

## 6. i18n — move the remaining inline strings

85 inline `isRTL ? '…' : '…'` strings remain in Batch A:

| File | Count |
|---|---|
| ConnectionStatesScreen | 30 |
| ScheduleScreen | 14 |
| DeviceSettingsScreen | 12 |
| DevicePairingScreen | 11 |
| DevicesScreen | 11 |
| DeviceControlScreen | 5 |
| HomeScreen | 2 |

**Rule:** every user-visible string goes through `t('<screen>.<key>')`, with the Arabic in `ar.ts` and the English in `en.ts`. Key blocks: `home`, `devicesScreen`, `deviceControl`, `pairing`, `scheduleScreen`, `deviceSettings`, `connection`. `isRTL` may only remain for things that are **not** text and **not** layout direction (for example, choosing a directional icon). Count them with:
```
grep -c "isRTL ? '" app/src/screens/<File>.tsx
```

**Seed data:** `app/src/store/useAppStore.ts` lines 95, 113, 131 (device names) and 153, 166, 179 (routine names) are hard-coded Arabic, so English mode shows Arabic names. Store them as i18n keys (`seed.deviceLiving`, `seed.deviceReading`, `seed.deviceBedroom`, `seed.routineMorning`, `seed.routineAfternoon`, `seed.routineEvening`). Resolve them with `t()` at render time **only while the user hasn't renamed them**. A user-typed name is stored and shown as typed.

**Check:** the grep count above = 0 for all 7 Batch A screens. Switch to English → no Arabic anywhere on the 7 screens, including device and routine names.

---

## 7. Small fixes

- 7a. **Home carousel peek card shows no name.** The second card (ركن القراءة) shows its image and "خامل" but no title. Cards are `width: 220` (`HomeScreen.tsx:868`). Find out why the name `Text` (line ~525, `numberOfLines={1}`, `flex: 1`) renders empty on the second card in RTL. Likely: the horizontal `ScrollView` in RTL is laying the second card out from the wrong side. Fix it, then confirm the title shows on **every** card, including the partly visible one.
- 7b. **Missing space** before the signal value: `DeviceControlScreen.tsx:298` renders "إشارة قوية(-58 dBm)". Put a normal space before `{'‪'}` so it reads "إشارة قوية (-58 dBm)".
- 7c. **Tab bar colours** (`components/ui/BottomTabBar.tsx:53, 55`) are hard-coded rgba, and the dark value `rgba(28,25,23)` isn't even our dark `bg` (`#111512`). Change to:
  ```ts
  backgroundColor: withAlpha(colors.bg, 0.94),
  borderTopColor: colors.border,
  ```
  Add a small `withAlpha(hex, a)` helper in `app/src/theme/colors.ts` if one doesn't exist.

**Check:** 7a — scroll the Home devices carousel; every card shows name + status + oil + room. 7b — visually. 7c — `grep -n "rgba" app/src/components/ui/BottomTabBar.tsx` returns nothing, and the bar looks the same in light, with the correct dark colour in dark.

---

## 8. Report, proof, commit

1. Write `reviews/report-2026-09-25-batch-a-closeout.md`, with a table of items 1a–7c, each ✅ or ❌, plus one line saying what you changed.
2. Native simulator screenshots into `reviews/qa-app-2026-09-25/`, for Home, Devices, Device Control, Pairing, Schedule (plus the New-routine sheet), Device Settings and Connection States:
   - Arabic and English;
   - top and scrolled to the end;
   - **the tab bar must be visible** on Home and Devices, and on the Store and Account tabs too;
   - each next to its Stitch screen, same width.
3. **Before you send the proofs, look at every Arabic screenshot yourself and confirm:** app bar mirrored (back chevron on the right), text starting at the right, nothing overlapping, the tab bar present on tab screens. If any screenshot fails, fix it first.
4. `npx tsc --noEmit` = 0.
5. Commit with the message `fix(batch-a): restore tab bar, curated card, RTL text alignment, i18n close-out`.

Then **stop**. After this, Batch A goes to the owner for review. Do not start Batch C, and do not touch Batch B (Store screens) until I review it.
