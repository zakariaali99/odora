# Message to give Antigravity now (Odora)

Re-read `ANTIGRAVITY.md` FIRST — the top **🚨 CRITICAL — NEVER LEAVE THIS FOLDER** rule (no symlinks, never read/write/delete outside `odora/`, never delete media/product images). All work stays in `odora/{frontend,backend,app}` — all real, standalone folders now.

**Verified state (I ran the checks):** no symlinks. Backend passes `manage.py check` (0 issues). The web store **builds clean** (`npm run build`, 1,676 modules). The app **fails to typecheck** (`tsc` stack-overflow crash).

**Do this, in order — the web store is already built, so FINISH/HARDEN/POLISH it, don't rebuild:**

1. **Backend security** (`odora/backend/odora_backend/settings.py`) — apply `plans/claude plans/fix-2026-09-08-backend-security.md`: DEBUG default False; real ALLOWED_HOSTS from env; lock CORS (drop allow-all-with-credentials → explicit origins); no SECRET_KEY fallback in prod; secure-cookie/HSTS when DEBUG False.
2. **Store design/elevation pass** (`odora/frontend/`) — the build is green; now make it premium: apply `01-design-system.md` + `03-design-elevation.md` + the web-store canvas (`design-reference/exports/store/`) — real imagery + depth, not flat. Verify **Arabic RTL** on every page. Confirm content-page copy is real (no lorem). Keep it API-connected (don't hardcode).
2b. **Fix the frontend UI bugs** (`plans/claude plans/fix-2026-09-08-frontend-ui.md`, found in a live review):
   - **`/fragrances` white-screens** — `FragranceLibraryPage.jsx` uses `useEffect` without importing it. One-line fix. (The vite build does NOT catch this — add ESLint `no-undef`/react-hooks to CI.)
   - **Wrap `<Routes>` in the existing `ErrorBoundary`** so one page crash doesn't blank the whole store.
   - **Replace placeholder product images** — every product currently shows the same design-reference moodboard collage; use real per-product/colorway photos.
   - **Dual language (AR/EN) is BROKEN** — the EN toggle flips nav to LTR but leaves the rest hardcoded-Arabic and misaligned (only ~13/38 components translate). Apply `plans/claude plans/fix-2026-09-08-dual-language.md`: either centralize ALL strings + logical-CSS direction so EN fully works, OR hide the toggle until EN is complete (owner decides). Do not ship the broken toggle.
3. Keep the **web store** and the **app in-app store** as two SEPARATE front-ends sharing the backend.

**Do NOT touch the mobile app yet** (Phase B). When it resumes: FIRST fix the typecheck crash (`plans/claude plans/fix-2026-09-08-review-findings.md`, Fix 8 — `tsc --noEmit` must pass), then the structural fixes (bottom-tab nav, RTL reload, getDeviceController, store→API, palette). Do NOT implement the cloud path — `CloudTransport` stays a stub.

Stop after the web store is secured + polished + RTL-verified for owner review.
