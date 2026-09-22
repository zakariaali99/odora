# Odora Mobile Application

Odora luxury fragrance diffuser mobile application built with React Native and Expo (SDK 57).

## Architecture & Design System
- **Theme**: Luxury botanical design system based on Idea 02 (Aura Botanical Luxury / Evening Sanctuary).
- **Default Locale**: Arabic (Libya / Tripoli context), full RTL layout mirroring.
- **Typography**: Display/Headlines in Outfit, Body in Plus Jakarta Sans, Arabic in IBM Plex Sans Arabic.
- **Components**: 24 core UI components located in `src/components/ui/`.
- **Navigation**: Fixed 4-tab bar (Home · Devices · Store · Account) + `/dev/ui-kit` design system showcase.

## Dependency Notes

### TypeScript & Expo Compatibility (2026-09-22)
- **Expo Version**: `~57.0.24`
- **TypeScript Version**: `~6.0.3`
- **Resolution**:
  - In Phase 0, `tsc --noEmit` initially failed with `RangeError: Maximum call stack size exceeded` due to TypeScript 6.0.3 recursing through unexcluded build directories and external library type definitions.
  - Resolved by configuring `app/tsconfig.json` with `"skipLibCheck": true` and explicitly excluding `["node_modules", "dist", ".expo", "web-build"]`.
  - With these compiler options active, TypeScript 6.0.3 executes cleanly with exit code 0 across the entire codebase.
- **Persistence & Native Updates**:
  - `@react-native-async-storage/async-storage` is used to persist user language selection across cold launches.
  - `expo-updates` provides `Updates.reloadAsync()` (with `DevSettings.reload()` dev fallback) to restart the native runtime upon language/RTL change so native Yoga engine mirrors layout.
  - On Web (`react-native-web`), root view direction and `document.documentElement.dir` mirror flexbox layout.
