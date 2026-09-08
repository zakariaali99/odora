# FIX PLAN — Frontend UI (from live review 2026-09-08)

> **Type:** PLAN. Source: `reviews/review-2026-09-08-ui.md`. Targeted fixes only.

## Fix 1 — `/fragrances` crash (High, one line)
`src/pages/content/FragranceLibraryPage.jsx` uses `useEffect` but doesn't import it.
- Change `import React, { useState } from 'react';` → `import React, { useState, useEffect } from 'react';`.
- **DoD:** `/fragrances` renders; no `useEffect is not defined` in console.

## Fix 2 — Wrap routes in the ErrorBoundary (High, robustness)
`src/components/common/ErrorBoundary.jsx` exists but isn't used around `<Routes>` in `App.jsx`.
- Wrap `<Routes>...</Routes>` in `<ErrorBoundary>` so one page crash shows a fallback, not a blank app.
- **DoD:** a thrown error in one route shows the fallback UI; the rest of the app still works.

## Fix 3 — Real product imagery (Med, design)
Every product currently renders the same `design-reference` moodboard collage.
- Use real product photos per product/colorway (ask owner for assets; until then use distinct placeholders, clearly marked — not the moodboard).
- Applies to shop cards, product detail gallery, home hero.
- **DoD:** products show distinct, real (or clearly-marked placeholder) images — never the brand moodboard as a product photo.

## Guard (add to lint/CI)
- Enable an ESLint rule (`no-undef` / `react-hooks`) and run it in CI so missing-import crashes like Fix 1 are caught before shipping (the vite build alone does not catch them).
