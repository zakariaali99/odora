# Message to give Antigravity now (Odora) — store finish line

The store redesign is done and looks good (verified: TS build + typecheck pass, react-i18next AR/EN both work, real product images, admin live). Now close it out for launch. Re-read `ANTIGRAVITY.md` (never leave `odora/`; work only in `frontend/` + `backend/`).

## 1. Performance — route-level code-splitting
The production bundle is ~566 KB (over the 500 KB warning). Split it with `React.lazy` + `Suspense` on the route components in `frontend/src/App.tsx` (lazy-load pages, especially the admin pages), and/or `build.rollupOptions.output.manualChunks`. Target: no single chunk over ~500 KB; `npm run build` clean.

## 2. Accessibility — WCAG AA contrast pass
Audit text/background pairs against **WCAG AA** (≥ 4.5:1 body, ≥ 3:1 large text) across all pages, both AR and EN. Fix any muted-on-tint failures using the theme tokens (`ink`, `muted`, `surface`). Confirm interactive elements have visible focus states.

## 3. Final product imagery
Confirm every product's image is a real, final product photo (not a stand-in). Any product whose `main_image` is still a generic/brand-board image should get a proper product shot in `backend/media/products/`. No moodboard collages anywhere.

## 4. Deploy readiness (do NOT deploy — just prepare)
- Confirm the app reads config from env: frontend `VITE_API_BASE_URL`, backend `DJANGO_SECRET_KEY` / `DJANGO_DEBUG` / `DJANGO_ALLOWED_HOSTS` / CORS origins.
- Provide a short **`DEPLOY.md`** in `odora/` listing the exact env vars to set for production (DEBUG=False, real ALLOWED_HOSTS, a generated SECRET_KEY, CORS origins, VITE_API_BASE_URL) and the build/run commands for frontend and backend. Do not deploy or expose anything — just document it.

## Rules unchanged
- Web store (`frontend/`) and the app's in-app store (`app/`) stay SEPARATE front-ends sharing the backend.
- **Do NOT touch the mobile app** (Phase B). **Do NOT implement the cloud path** — `CloudTransport` stays a stub.
- No hardcoded data; keep everything on the backend API and react-i18next.

Stop after 1–4 are done (build clean, AA contrast, final images, DEPLOY.md written) for owner review — then the store is ready to ship.
