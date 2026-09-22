# Review — App Phase 0 + Phase 1 (2026-09-22)

**Scope reviewed:** uncommitted changes in `app/` (theme, UI kit, navigation, fonts, deps). `frontend/` untouched ✅.
**Method:** `tsc --noEmit`, `expo install --check`, code read, app run on web (`expo start --web`), `/dev/ui-kit` captured in Arabic/English × light/dark.

## Verdict
- **Phase 0 — PASS with a note.** `tsc --noEmit` exits 0; app boots on web. iOS simulator run **not evidenced**.
- **Phase 1 — ~80%. Needs one fix pass before Phase 2.** Fix-plan: `plans/claude plans/fix-2026-09-22-app-phase1.md`.

## What is good
- Color tokens match `05 §2` exactly (light + dark). Light / Dark / System switching works.
- Fonts loaded: Outfit, Plus Jakarta Sans, IBM Plex Sans Arabic; Material Symbols Outlined bundled.
- All 24 UI kit components exist (`app/src/components/ui/`) and render in both themes.
- Fixed 4-tab bar (Home · Devices · Store · Account) via `MainTabsNavigator`.
- Capability rules respected: Boost hidden when `burst` is off; oil stat shows "(Est.)"; Libyan phone validation (+218); prices in LYD.
- Motion tokens + `useReducedMotion()` present.

## Findings
| # | Severity | Finding |
|---|---|---|
| 1 | High | **RTL layout is not mirrored.** Text right-aligns, but row order is still LTR: tab bar (Home on the left), list rows (icon/chevron), inputs (icon left, Arabic text left-aligned), connection-state cards, segmented control. `changeAppLanguage` calls `forceRTL` with **no reload and no prompt** (explicit Phase 1 requirement; also an open finding since 2026-09-08). `expo-updates` was added but never used. On web `I18nManager` does not flip layout at all. |
| 2 | Medium | Tab labels show English in Arabic — `nav.*` keys missing from `src/i18n/ar.ts` / `en.ts`. |
| 3 | Medium | UI components hard-code English strings (e.g. `PresetChips`: Gentle/Medium/Intense/Boost). No component uses i18n. |
| 4 | Medium | Dark theme skeleton is invisible — `Skeleton` uses `bgAlt`, which equals `surface` in dark. |
| 5 | Low | Arabic low-oil `Banner`: action text ("اطلب الآن") overlaps the message. |
| 6 | Low | Error text under inputs uses the uppercase eyebrow style; should be `bodySm`, sentence case, `error` color. |
| 7 | Low | `StatBlock` value truncates ("19:00 Evenin…"). |
| 8 | Low | Latin text inside Arabic UI renders in IBM Plex Sans Arabic instead of Outfit (product names, "Odora A316"). |
| 9 | Low | Hard-coded `#FFFFFF` in Button, Chip, Badge, Toggle, Slider → tokens (add `thumb` token for white thumbs). |
| 10 | Process | `expo install --check`: `expo 57.0.20→57.0.24`, `expo-font`, `expo-localization` patches pending; TypeScript pinned to **5.8** while Expo expects **6.0.3**. Acceptable as the crash fix, but must be documented. |
| 11 | Process | No phase report, no screenshots, no iOS proof (required by `07` acceptance). Work is uncommitted. |

## Not in scope yet (noted for Phase 2)
Old screens (Home, Device, Store, Checkout, Schedule, Settings, Onboarding) still use `lucide-react-native`, old fonts (Poppins/Tajawal) and hard-coded hex; the Home hero still uses a brand-book collage image. These are rebuilt in Phases 2–4.
