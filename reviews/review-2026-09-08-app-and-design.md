# Review — 2026-09-08 · App code + design deliverables

**Reviewer:** Claude · **Scope:** `app/` (Expo/RN source), plan files, design canvases/tokens.
**Against:** `ANTIGRAVITY.md`, `plans/claude plans/00,01,03`, `KNOWLEDGE-odora-spec.md`.

## Verdict: strong start, ships after small fixes
The build closely follows the plan. Hard rules are honored. A few real issues (one architectural) should be fixed before continuing.

## What passed ✓
- **Gated cloud rule honored** — `CloudTransport.ts` is an unimplemented throwing stub. ✓
- **Transport abstraction exists** — `DeviceController` interface + `MockTransport` + `getDeviceController()`/`setDeviceController()`. ✓
- **No-device assumption** — everything runs on `MockTransport`. ✓
- **Arabic-first + RTL** — `DEFAULT_LANGUAGE='ar'`, `I18nManager.forceRTL`, Tajawal (ar) + Poppins (en). ✓
- **Design tokens** — `theme/colors.ts` matches `01-design-system.md` (sage #919C7A, cream #F4F0EC, olive, ink ramp). ✓
- **Elevation applied** — real brand photography used in the device hero; mist/status cues present. ✓
- **Structure** — theme / i18n / device / components / screens / store, as planned. ✓

## Findings (most severe first)

| # | Sev | File | Finding |
|---|-----|------|---------|
| 1 | **Medium (architecture)** | `screens/HomeScreen.tsx`, `screens/DeviceScreen.tsx` | Screens import `mockDeviceController` **directly** instead of `getDeviceController()`. This couples the UI to the mock transport and **defeats the swappable-transport design** — M4 (BLE) would require editing every screen instead of one line in `setDeviceController`. |
| 2 | Low (design/consistency) | `theme/colors.ts:32`, `screens/HomeScreen.tsx:112` | `activeGreen: '#6B8E23'` is **off-palette** (saturated olive, not brand sage). HomeScreen uses it for the "On" dot while DeviceScreen uses `brandSage` → inconsistent + off-brand. |
| 3 | Low (design fidelity) | `screens/DeviceScreen.tsx` | Intensity is a **discrete stepper [2,4,6,8,10]**; the approved design is a **continuous 0–10 slider with a value bubble**. Odd levels (1,3,5,7,9) are unreachable and it diverges from the mockup. |
| 4 | Low (tokens) | `screens/StoreScreen.tsx:76` | Hardcoded `#D97706` for the rating star instead of the existing token `colors.warningAmber` (same value). Use the token. |
| 5 | Info (gap) | `app/src/screens/` | **Onboarding** and **Checkout** screens (latest designs) are not yet in the app code. Add when their milestone comes. |
| 6 | Info (data) | `screens/StoreScreen.tsx` | Prices (320 / 45 LYD) are **placeholders** — confirm real prices before shipping. |

## Repairs
Findings **1–4** are actionable now. A fix-plan is written here:

➡️ **`plans/claude plans/fix-2026-09-08-review-findings.md`** — open it and apply, then stop for re-review.

Findings 5–6 are tracked for their milestones, no action required yet.

## Note on sequencing
Per the owner's decision this session, the **web store is now the first deliverable** (before the mobile app). See **`plans/claude plans/04-build-sequence-store-first.md`**. The device-independent app work already done remains valid and is not wasted.
