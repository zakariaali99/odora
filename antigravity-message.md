# Message to give Antigravity now (Odora) — round 2

Good progress on the engineering, but the **UI redesign is not finished** and the owner still sees the same flat look. Re-read `ANTIGRAVITY.md` (never leave `odora/`).

**What's confirmed done (don't redo):** TypeScript migration (`tsc` passes, build works), react-i18next added, `/fragrances` fixed, ErrorBoundary wired, design tokens improved (light neutral canvas, darker sage, near-black ink, amber accent), backend security.

**Now finish these — the look must actually change:**

## 1. 🔴 Apply the redesign to EVERY page — start with `HomePage.tsx`
The new tokens exist but pages weren't refactored to use them. **`HomePage.tsx` was never touched** and still shows the old flat cream + big sage block. Per `plans/claude plans/UI-MUST-DO.md`:
- Refactor **every page** to the new tokens (`canvas`/`surface`/`ink`/`amber`) — Home FIRST.
- **Kill the remaining flat sage fields**; use layered white surfaces on the light neutral canvas; add real depth/hierarchy; sage is an ACCENT.
- Verify **WCAG AA** text contrast on every page. The owner must SEE a clear change on Home.

## 2. 🔴 Real product imagery (backend data, not just frontend)
Shop/product cards still render the `design-reference` "Scent Meets Design" **moodboard collage** because the backend product `main_image` values ARE that board. Your frontend fallbacks only fire onError. **Replace the product images in the backend** (`media/products/`) with real, distinct product photos (or clearly-distinct placeholders — never the moodboard board).

## 3. 🟠 Finish the i18n migration
`react-i18next` is in, but **29 files still import the old `useLanguageStore`**. Remove it everywhere; every component (all 38) uses `useTranslation`. Verify AR (RTL) and EN (LTR) on every page — no mixed/untranslated state.

## Rules unchanged
- Web store and app in-app store are SEPARATE front-ends sharing the backend.
- Do NOT touch the mobile app (Phase B). Do NOT implement the cloud path (`CloudTransport` stays a stub).

Stop after Home + all pages visibly match the UI-MUST-DO bar, real product images are in, and i18n is fully on react-i18next — for owner review.
