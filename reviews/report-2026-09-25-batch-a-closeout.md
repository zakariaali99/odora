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

All 68 screenshot artifacts (native simulator captures and side-by-side Stitch comparisons) are stored in:
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

## 3. Code Quality & Compilation
- `npx tsc --noEmit` exited with code `0`.
- All unit files validated for clean syntax and strict types.
