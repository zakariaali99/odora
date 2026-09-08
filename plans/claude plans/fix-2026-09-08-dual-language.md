# FIX PLAN — Dual language (AR/EN) is broken

> **Type:** PLAN. Source: live review 2026-09-08. The EN toggle produces a broken hybrid (English LTR nav + misaligned untranslated Arabic content).

## Root cause
- Only ~13 of 38 components read `store/useLanguageStore.js`; most user-facing strings are **hardcoded Arabic**.
- Switching to EN flips layout direction to LTR, but the untranslated Arabic content still needs RTL → misalignment.

## Decision first (owner)
Is **English required for launch**?
- **If NO:** hide the language toggle until EN is complete. Do NOT ship a visibly broken toggle. (Fastest.)
- **If YES:** do the full fix below.

## Full fix (if EN is required)
1. **Centralize ALL strings** — every user-facing string moves into the `ar`/`en` dictionaries (or adopt `react-i18next`). No hardcoded Arabic in components.
2. **Every component reads the active language** — all 38, not 13.
3. **Direction handling** — set `document.documentElement.dir`/`lang` per language; use **logical CSS** (`margin-inline-start`, `text-align: start`, `padding-inline`) instead of hardcoded left/right so both directions lay out correctly.
4. **Verify every page** in both AR (RTL) and EN (LTR) — no mixed direction, no misalignment, no leftover Arabic in EN.

## DoD
- [ ] EN toggle translates **all** visible text and lays out **LTR** correctly.
- [ ] AR lays out **RTL** correctly.
- [ ] No page shows a mixed/misaligned state.
- [ ] If EN isn't ready: toggle hidden, app is AR-only and clean.
