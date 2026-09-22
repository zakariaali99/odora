# Fix-plan — App Phase 1 (2026-09-22)

From `reviews/review-2026-09-22-app-phase0-1.md`. Do all items, then re-send the Phase 1 report. **Do not start Phase 2** until this is reviewed.

## 1. RTL — real mirroring (High)
- Native: when the language changes and `I18nManager.isRTL` must change, show a confirm sheet ("The app will restart to apply the language") and then reload with `Updates.reloadAsync()` (`expo-updates` is already installed; fall back to `DevSettings.reload()` in dev).
- Persist the chosen language (AsyncStorage) and apply `allowRTL/forceRTL` **before** the first render on next launch.
- Web: set `document.documentElement.dir` and wrap the root in a `View` with `style={{ direction: isRTL ? 'rtl' : 'ltr' }}`.
- Use logical styles everywhere in `components/ui/`: `marginStart/End`, `paddingStart/End`, `start/end`, `flexDirection: 'row'` (let direction flip it) — no `left/right`. Directional icons (chevrons, arrows, back) flip in RTL; non-directional icons do not.
- Verify: tab bar order (Home on the right in Arabic), ListRow (icon at start, chevron at end), Input (icon at start, Arabic text aligned start), ConnectionState, Banner, SegmentedControl.

## 2. i18n (Medium)
- Add `nav.home/devices/store/account` to `ar.ts` and `en.ts`.
- No hard-coded user-facing strings in `components/ui/`. Components take labels as props, or read keys via `useTranslation`. `PresetChips`: keys `presets.gentle/medium/intense/boost`.

## 3. Dark skeleton (Medium)
- `Skeleton` base = `surfaceMuted`, shimmer highlight = `surfaceHigh` (light and dark). Must be visible on `surface` cards in both themes.

## 4. Small fixes (Low)
- `Banner`: message wraps, action sits at the end on its own line when space is short — no overlap in Arabic.
- Input error text: `bodySm`, sentence case, `colors.error`, no uppercase/tracking.
- `StatBlock`: allow 2 lines or scale down; no truncation of the value.
- Latin inside Arabic UI (product names, model names, prices, numbers): render with Outfit via a `LatinText` helper or font prop.
- Replace hard-coded `#FFFFFF` in Button/Chip/Badge/Toggle/Slider with tokens; add `thumb: '#FFFFFF'` (light + dark) for slider/toggle thumbs.

## 5. Dependencies (Process)
- Run `npx expo install --fix` for the Expo patch versions.
- Re-test TypeScript 6.0.3 once. If `tsc` still crashes, keep 5.8 and write the reason in `app/README.md` (Dependency notes).

## 6. Report (required)
- Commit Phase 0 and Phase 1 separately.
- Screenshots of `/dev/ui-kit` in: AR light, AR dark, EN light, EN dark — **on the iOS simulator** (plus web). Save to `reviews/qa-app-2026-09-22/`.
- `npx tsc --noEmit` output.
