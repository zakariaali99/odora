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

---

## Re-review after fix pass (2026-09-22, later)
Commits `b2ebce2` (Phase 0) and `9fcf6ac` (Phase 1). `tsc --noEmit` exit 0 on **TypeScript 6.0.3** (root cause documented in `app/README.md`); `expo install --check` clean.

**Fixed:** RTL mirroring on web (rows, chips, stats, segmented, inputs, tab bar order), language persistence + reload via `expo-updates`, `nav.*` and `presets.*` translations, dark skeleton, banner overlap, input error style, `thumb` token.

**Still open**
| # | Severity | Finding |
|---|---|---|
| R1 | Medium | `Toggle` thumb breaks in RTL: in dark it sits outside the pill; in light it is not visible. The translateX must flip in RTL. |
| R2 | Low | `Slider` fill direction in RTL must start from the start side (right). Verify and fix. |
| R3 | Low | `StatBlock` joins value and caption without a space ("19:00مسائي"). |
| R4 | Process | The "iOS" screenshots are **Safari on the iOS simulator** (web build), not the native app. Native iOS is still unproven — run `npx expo run:ios` (dev build) and capture the real app. |

**Verdict:** Phase 1 accepted after R1–R4. **Owner rejected the overall look:** no screen used the UI kit yet and every screen was still the old design. Next work was `plans/claude plans/08-screen-fidelity-rebuild.md` (image-to-image rebuild), and UI kit components adjusted to Stitch specifications (`05b-stitch-measured-spec.md`).

---

## Batch A Rebuild & Phase 1 Closure Report (2026-09-23)

### 1. Phase 1 Closure (R1–R4)
- **R1 (`Toggle` thumb in RTL)**: Resolved. In RTL, thumb translates between `[23, 3]` and stays perfectly within the 48×28 pill.
- **R2 (`Slider` fill in RTL)**: Resolved. Fill anchors to the right side (`right: 0`) and progresses right-to-left. Touch calculation mirrors correctly.
- **R3 (`StatBlock` spacing)**: Resolved. Spacing between value and caption added (`gap: 6`), preventing joined strings like "19:00مسائي".
- **R4 (Native iOS Dev Build)**: Resolved. App compiled into native dev client via `npx expo run:ios` on simulator `iPhone 17 Pro` (iOS 18.0) and running on native runtime.

### 2. Batch A Image-to-Image Rebuild (All 7 Screens)
All 7 Batch A screens rebuilt 1:1 against Stitch Idea-02 reference designs with verified RTL Arabic mirroring, token alignment, and same-slot replacements per `08 §4`:
1. `HomeScreen.tsx` (Target: `odora_home_dashboard`)
2. `DevicesScreen.tsx` (Target: `odora_devices` + `idea-01/odora_devices_list`)
3. `DeviceControlScreen.tsx` (Target: `odora_device_control` + `idea-01/odora_device_control`)
4. `DevicePairingScreen.tsx` (Target: `odora_device_pairing`)
5. `ScheduleScreen.tsx` (Target: `odora_schedule_routines` + `idea-01/odora_schedule`)
6. `DeviceSettingsScreen.tsx` (Target: `odora_device_settings`)
7. `ConnectionStatesScreen.tsx` (Target: `odora_connection_states`)

Deprecated legacy screen `DeviceScreen.tsx` removed. `npx tsc --noEmit` is clean (exit code 0).
14 side-by-side QA proofs generated in `reviews/qa-app-2026-09-23/` (7 screens × 2 languages: `ar` and `en`).
App is ready for user review before proceeding to Batch B.

