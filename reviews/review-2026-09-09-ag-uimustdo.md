# Review — AG's UI-MUST-DO pass (verified live + code)

AG did a large pass. Verified by build, typecheck, and rendering the store.

## ✅ Done well (engineering + foundation)
- **Full TypeScript migration** — 0 `.jsx` left; **`tsc --noEmit` passes**; `npm run build` succeeds.
- **react-i18next added** — `i18n/locales/ar.json` + `en.json`; **English now works on migrated pages** (Shop fully translates + lays out LTR correctly).
- **`/fragrances` crash fixed** (`useEffect` now imported).
- **`ErrorBoundary` wraps `<Routes>`** in `App.tsx`.
- **Design tokens moved toward UI-MUST-DO** (`tailwind.config.js`): canvas → light neutral `#F7F7F5` (was saturated cream), sage darkened to `#717E57`, near-black `ink #181816`, darker `muted #52524B` (better contrast), white `surface`, and a **secondary amber accent `#A67336`** added. This is the right direction.
- `ProductCard` component with per-type image logic.

## 🔴 Incomplete / still wrong
1. **Redesign NOT applied consistently — the look barely changed on key pages.** The new tokens exist but pages weren't refactored to use them. **`HomePage.tsx` was not touched** — the home page still shows the old flat cream + big sage block. Rendered Home/Shop still look essentially like before. The owner's #1 complaint (flat single-tone field) is **not visibly resolved** where it matters most.
2. **Product images are still the moodboard collage.** The backend product `main_image` values are still the `design-reference` "Scent Meets Design" board (shop cards render it). AG added frontend fallbacks (`/brand_photo_*`), but they only trigger onError — the bad DB images still load. **Needs real product photos in the backend**, not just frontend fallbacks.
3. **i18n migration half-done.** `useTranslation` in 18 files, but the **old `useLanguageStore` is still imported in 29 files**. Inconsistent — some pages may still not fully translate. Finish removing `useLanguageStore`.
4. 🟠 Bundle 566 KB (>500 KB warning) — code-split later.

## Verdict
Strong **engineering** pass (TS, i18n plumbing, bug fixes, better tokens) — but the **visual redesign is not finished**. The token layer is right; it must now be **applied to every page (Home first)**, and **real product imagery** must replace the moodboard in the backend. i18n must be finished (drop the old store).

## Next for AG
1. Apply the new design system to **ALL pages, starting with `HomePage.tsx`** — kill remaining flat sage fields, use `surface`/`canvas`/`ink` tokens, add depth. Owner must SEE the change.
2. Replace product `main_image` in the **backend** with real product photos (or clearly-distinct placeholders — never the moodboard board).
3. Finish i18n: remove `useLanguageStore` everywhere; all 38 components via react-i18next.
