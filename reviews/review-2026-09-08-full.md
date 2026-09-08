# Full Review — 2026-09-08 · Odora (frontend + backend + app)

**Reviewer:** Claude · **Scope:** the standalone `odora/` project (after the symlink incident was resolved).
**Overall:** the **web store is in strong shape**; the **backend works but ships insecure production defaults**; the **mobile app has structural gaps**. Priority order for fixes: backend security → app structure → app store wiring.

---

## 0) Structure — RESOLVED
Odora is now standalone: `frontend/`, `backend/`, `app/` are all real folders. The earlier symlink leak into another project was reverted (that project's git is clean). See `reviews/incident-2026-09-08-symlink-leak.md`. Prevention rule added to `ANTIGRAVITY.md`.

---

## 1) Web store — `frontend/` ✅ STRONG
React + Vite + Tailwind + zustand + axios. **Substantial and API-connected** (~5,700 lines; 19/27 pages call the API).
- ✅ **Full routing** — storefront (home, shop, product, cart, checkout, order-confirmation, tracking, search), account (login, register, forgot, dashboard, orders, addresses, profile), content (about, technology, fragrances, contact, faq, legal), **admin** (dashboard, products, orders, customers, cms), 404.
- ✅ **Odora brand tokens** in `tailwind.config.js` + `index.css` (sage `#919C7A`, cream `#F4F0EC`, Poppins).
- ✅ **Real API layer** (`services/api.js`) with JWT + guest cart; ShopPage/ProductDetail/Checkout are substantive (330–360 lines each).
- **Checks (not blockers):**
  - [ ] Confirm it **builds** (`npm run build`) and runs against the backend.
  - [ ] Apply the **elevation pass** (`03-design-elevation.md`) — real imagery/depth, not flat — and verify against the web-store canvas.
  - [ ] Content pages (about/legal/faq) are static by design — confirm copy is real, not lorem.
  - [ ] RTL (Arabic) verified on every page.

## 2) Backend — `backend/` ⚠️ WORKS, INSECURE DEFAULTS
Django + DRF + SimpleJWT + cors-headers + filter + Pillow. Apps: accounts, cart, orders, products, cms, crm, marketing, analytics, core. Migrations exist (`0001_initial` across apps). Project: `odora_backend`.
- 🔴 **`ALLOWED_HOSTS = ['*']`** — wildcard.
- 🔴 **`CORS_ALLOW_ALL_ORIGINS = True` + `CORS_ALLOW_CREDENTIALS = True`** — allowing every origin *with credentials* is a real security hole.
- 🔴 **`DEBUG` defaults to `True`** — insecure default; must be False in production.
- 🟠 **`SECRET_KEY` has a hardcoded fallback** — if the env var is unset in prod, it runs on a known key.
- These are **fine for local dev** but **must be locked before any deploy**. Fix-plan: `plans/claude plans/fix-2026-09-08-backend-security.md`.
- Note: `db.sqlite3` and `venv/` are inside the folder — fine locally; ensure they're git-ignored and not deployed.

## 3) Mobile app — `app/` ⚠️ STRUCTURAL GAPS (Phase B — paused)
Expo/RN, good foundation (theme, i18n ar+en, `DeviceController`+Mock, gated `CloudTransport` stub, real photography). But:
- 🔴 **No bottom-tab navigation.** `@react-navigation/bottom-tabs` is installed but **unused**; `RootNavigator` is a stack only. The designed persistent tab bar (Home/Devices/Store/Schedule/Settings) is missing — main sections aren't reachable as designed.
- 🔴 **RTL toggle doesn't re-layout at runtime.** `changeAppLanguage` calls `I18nManager.forceRTL` but RN needs an app reload; `expo-updates` isn't installed. Switching ar↔en flips text but not direction until restart.
- 🔴 **In-app store is hardcoded** — `StoreScreen` uses a fake `products` array; `addToCart` is a no-op; no product/cart/checkout screens. Must consume the shared backend API (separate front-end from the web store).
- 🟠 Screens import `mockDeviceController` directly (should be `getDeviceController()`).
- 🟠 `activeGreen '#6B8E23'` is off-palette (use `brandSage`).
- ℹ️ Missing screens vs inventory: Splash, Onboarding, Auth, **Add-device flow**, Scent library, Checkout, Orders, Notifications, empty/error states.
- Fixes: `plans/claude plans/fix-2026-09-08-review-findings.md` (updated with nav + RTL).

---

## Where to go now
1. **Backend:** apply `fix-2026-09-08-backend-security.md` before any deploy.
2. **Store (frontend):** verify build + run against backend; apply the elevation/design pass; verify RTL.
3. **App (Phase B, later):** apply `fix-2026-09-08-review-findings.md` (bottom-tab nav, RTL reload, getDeviceController, store→API, palette).
