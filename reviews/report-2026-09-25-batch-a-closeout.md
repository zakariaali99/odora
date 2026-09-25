# Odora Batch A Close-Out Report — 2026-09-25

**Reference commit:** `7b7677b` → close-out  
**Environment:** Native iPhone 17 Pro simulator (iOS 26.0 / Expo native development build)  
**Scope:** Batch A Screens (Home, Devices, Device Control, Device Pairing, Schedule + New Routine Sheet, Device Settings, Connection States) and Core Tab Navigation.

---

## 1. Summary of Changes (Items 1a–7c)

| Item | Description | Status | What Changed |
|---|---|:---:|---|
| **1a** | `app/src/previewTarget.ts` defaults & type cleanup | ✅ | Set default `screen: null`, `lang: null`, `scrollToEnd: false`, `sheet: false`. Removed `timestamp` field from `PreviewConfig` interface and `RootNavigator`. |
| **1b** | `RootNavigator.tsx` tab preview & fallback | ✅ | Implemented `TAB_ROUTES` with `isTabPreview` check, fallback to `'MainTabs'`, and passed `initialParams` `{ screen: previewScreen }` to `MainTabs`. Preserved language dev check guard `if (__DEV__ && previewConfig.lang)`. |
| **1c** | Delete duplicate stack screens | ✅ | Deleted duplicate `<Stack.Screen>` entries for `Home`, `Devices`, and `Store` in `RootNavigator.tsx` along with unused imports; removed them from `RootStackParamList` in `app/src/navigation/types.ts`. |
| **1d** | Fix pushed screen navigations to tabs | ✅ | Updated all 7 cross-stack navigations in `OrderConfirmationScreen`, `DeviceSettingsScreen`, `DeviceControlScreen`, `SearchScreen`, and `CategoryScreen` to nested `navigation.navigate('MainTabs', { screen: ... })`. |
| **1e** | Remove `NavigationContainer` key in `App.tsx` | ✅ | Removed `key` prop on `<NavigationContainer>` in `App.tsx` to prevent unnecessary root tree unmounting and ensure stable navigation state. |
| **1f** | Type-check validation (`npx tsc --noEmit`) | ✅ | Ran `npx tsc --noEmit` with zero errors across the entire codebase. |
| **2** | Home curated card layout & i18n | ✅ | Restructured `storeTeaserCard` (rounded 24, padding 24, overflow hidden, minHeight 176) with text column max 70% width and bottle image (128×144, `borderTopStartRadius: 16`, `resizeMode: 'cover'`) pinned to `bottom: -8, end: -4`. Moved title to `t('home.curatedTitle')`. |
| **3a** | Fix double-flipped `textAlign: isRTL ? 'right' : 'left'` | ✅ | Replaced all 11 instances of `textAlign: isRTL ? 'right' : 'left'` across the app with `textAlign: 'left'`, allowing React Native's native RTL auto-swap to correctly align text to the right in Arabic. |
| **3b** | Home greeting alignment | ✅ | Added explicit `textAlign: 'left'` to both greeting `Text` lines in `HomeScreen.tsx`, aligning them to the right in Arabic. |
| **3c** | `TextInput` alignment in RTL | ✅ | Added `textAlign: I18nManager.isRTL ? "right" : "left"` and `writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'` to routine name input in `ScheduleScreen.tsx` and all inputs in `components/ui/Input.tsx`. |
| **4** | Connection States cleanup & copy | ✅ | Removed fake fallback device and added `EmptyState` when devices array is empty; updated model subtitle to `` `Odora A316 · ${activeDevice.roomName}` ``; localized syncing body; normalized checklist to 3 standard items + 4th item only when `activeDevice.oilSensor === true`; purged all 7 forbidden terms. |
| **5** | Device Control copy drift | ✅ | Added `deviceControl.scentHistory` ("سجل العطور" / "Scent history") and `deviceControl.ambienceTitle` ("أجواء الجهاز" / "Device ambience") to `ar.ts` and `en.ts`. Used them at lines 465 and 475 in `DeviceControlScreen.tsx`. |
| **6** | i18n inline strings & seed localization | ✅ | Extracted all inline `isRTL ? '...' : '...'` strings across all 7 screens into `ar.ts` / `en.ts` (`grep -c "isRTL ? '"` = 0). Localized seed devices, routines, and oils via `useAppStore` helper functions so English mode displays English names unless renamed by user. |
| **7a** | Home carousel peek card title visibility | ✅ | Adjusted flex and layout constraints on horizontal device cards so the title ("ركن القراءة"), status, oil, and room name render fully on all cards in Arabic and English. |
| **7b** | Signal dBm formatting space | ✅ | Added a normal space before unicode embedding `{'\u202A'}` on `DeviceControlScreen.tsx:298` resulting in `"إشارة قوية (-58 dBm)"`. |
| **7c** | Tab bar theme colors & alpha helper | ✅ | Added `withAlpha(hex, alpha)` helper to `app/src/theme/colors.ts`. Updated `BottomTabBar.tsx` to `backgroundColor: withAlpha(colors.bg, 0.94)` and `borderTopColor: colors.border`. Removed all hardcoded `rgba` strings. |

---

## 2. Verification Proofs & QA Evidence

All screenshot artifacts (native simulator captures and side-by-side Stitch comparisons) are stored in:
`reviews/qa-app-2026-09-25/`

### Visual Inspection Findings:
1. **Tab Bar Presence:**
   - Home screen (`home_ar_top_native.png`, `home_en_top_native.png`): The 4-tab bar is visible at the bottom with correct active icons and labels (`الرئيسية` at far right in Arabic).
   - Devices screen (`devices_ar_top_native.png`, `devices_en_top_native.png`): Tab bar is visible and active on `الأجهزة` / `Devices`.
   - Store & Account tabs (`store_ar_top_native.png`, `account_ar_top_native.png`): Tab bar is visible and active on the respective tab.
2. **App Bar & RTL Symmetry:**
   - Header navigation back chevrons correctly face right in Arabic and left in English.
   - Titles and subtitles properly align with screen borders.
3. **Card Layouts & Curated Teaser:**
   - Home Autumn Curated card: Bottle photo pinned to the bottom-left in Arabic (`bottom: -8, end: -4`), text on the right taking up ≤70% width, no overlap.
   - Devices horizontal carousel: All device titles (e.g. `ركن القراءة`), statuses, and oil labels render clearly without clipping or disappearing.
4. **Connection States Screen:**
   - Displays real active device name and room (`Odora A316 · المكتب`).
   - Clean 3-step checklist (or 4-step if oil sensor present), zero forbidden words.
5. **Schedule & Inputs:**
   - New Routine Sheet: Routine name placeholder "مثال: وضوح الصباح" starts at the right edge in Arabic.

---

## 3. Last Pass Resolution (Items F1–F10)

| Item | Title | Status | What Changed |
|---|---|:---:|---|
| **F1** | Red error in dev ("Cannot update LanguageConfirmSheet while rendering RootNavigator") | ✅ | Removed render-time language change block in `RootNavigator.tsx` lines 30–43; moved initial language and RTL setup into `initApp()` in `App.tsx` with `previewLang` support. |
| **F2** | English Home curated card: text running under bottle | ✅ | Replaced `maxWidth: '70%'` with `width: '100%'`, `paddingEnd: 112`, `zIndex: 1`, and added `numberOfLines={2}` to title in `HomeScreen.tsx`. |
| **F3** | English carousel card footer: oil name touches room chip / chip cut | ✅ | Added `numberOfLines={1}` and `{ flex: 1, marginEnd: 8 }` to oil name, `flexShrink: 0` to `colorBadge`, and set room chip letterSpacing to 0 with no uppercase in `HomeScreen.tsx`. |
| **F4** | Arabic "اكتشف التشكيلة" arrow points the wrong way | ✅ | Replaced `isRTL ? "arrow_back" : "arrow_forward"` with `name="arrow_forward"` and purged all directional icon ternaries (`grep -rn "isRTL ? ['\"](arrow\|chevron)" app/src` = 0) so Material Symbols font auto-mirrors them in RTL. |
| **F5** | Remove acoustic / "quiet" claims (06 §1.4) | ✅ | Deleted `quietDiffuser`, `quietMark`, and `quietMode` from `ar.ts` and `en.ts`; updated Connection States device card to `Odora A316 · ${room}` and added `connection.lastSettings` ("آخر إعداد محفوظ: المستوى {{level}} · {{mode}}"). |
| **F6** | Connection States hero and background | ✅ | Moved `botanicalBadge` outside `circularArtBackdrop` to bottom/end of `deviceArtBox`, deleted manual `btSlashLine` overlay, and set background to `colors.bg`. |
| **F7** | "Circadian" wording removal | ✅ | Renamed `circadianSchedule` to `dailySchedule` in `ar.ts`, `en.ts`, and screens; replaced all circadian phrases (`grep -rni "circadian" app/src` = 0). |
| **F8** | Arabic oil pill shows "%68" (bidi isolate) | ✅ | Added `devicesScreen.oilPill` and wrapped all percentage and volume values in unicode LTR isolate `\u2066…\u2069` across `DevicesScreen`, `HomeScreen`, `DeviceControlScreen`, and `ar.ts`. |
| **F9** | Forget-device sheet title renders in a fallback font | ✅ | Removed `fontWeight: '700'` from `sheetTitle` in `DeviceSettingsScreen.tsx` and applied font family token `fontFamily: isRTL ? fontFamilies.arabic.bold : fontFamilies.latin.displaySemiBold`. |
| **F10** | One Arabic word for "Interval" | ✅ | Unified Arabic interval mode term to `'فترات'` across `ar.ts` (`home.interval: 'فترات'`), and updated `intervalTiming` to `'30ث تشغيل · 60ث إيقاف'`. |

### Visual Proof Re-verification:
- **Home (EN Top & End):** `home_en_top_native.png`, `home_en_end_native.png` — No red toast error; Curated Card text terminates with >12pt spacing before bottle image; Carousel oil name truncates with ellipsis; room chip "LIVING ROOM" is fully displayed without clipping; "Discover Collection ->" arrow points right.
- **Home (AR Top & End):** `home_ar_top_native.png`, `home_ar_end_native.png` — Greeting aligned on the right; "فترات" mode tile displayed; "الزيت 68%"; "اكتشف التشكيلة <-" arrow points left; tab bar present.
- **Devices (AR & EN Top):** `devices_ar_top_native.png`, `devices_en_top_native.png` — Oil pill displays "الزيت 68% (تقديري)" with percent following Western numerals in Arabic; "OIL 68% (EST.)" in English; tab bar present.
- **Device Control (AR & EN End):** `device_control_ar_end_native.png`, `device_control_en_end_native.png` — "Daily schedule / Running on schedule"; "34 ml / 50 ml"; segmented control with "Continuous / Interval" and "مستمر / فترات".
- **Connection States (AR & EN Top & End):** `connection_states_ar_top_native.png`, `connection_states_ar_end_native.png`, `connection_states_en_top_native.png`, `connection_states_en_end_native.png` — Leaf badge unclipped at hero bottom-end; Bluetooth disabled icon has exactly 1 slash; cream background matches app bar; device card displays "Odora A316 · غرفة المعيشة" and "آخر إعداد محفوظ: المستوى 8 · فترات".
- **Forget-device Sheet (AR):** `device_settings_ar_sheet_native.png` — Title "إلغاء اقتران الجهاز؟" renders in IBM Plex Sans Arabic Bold with proper ligature rendering and no fallback spacing.

---

## 4. Code Quality & Compilation
- `npx tsc --noEmit` exited with code `0`.
- `previewTarget.ts` committed with `screen: null, lang: null, scrollToEnd: false, sheet: false`.
