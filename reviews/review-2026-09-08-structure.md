# Review — 2026-09-08 · Architecture & store/app separation

**Reviewer:** Claude · **Scope:** project structure, web store (`frontend`), shared `backend`, mobile `app`.

## The correct model (confirmed with owner)
Odora = ONE project, three parts sharing the **Django backend**:
1. **Web store** — the standalone `frontend` (React + Vite): full storefront **+ dashboard + more**. **UI already designed** (web-store canvas + `design-reference/exports/store/`).
2. **Mobile app** — the `app` (Expo/RN) with its **own, smaller in-app store**. This is a **separate front-end** — NOT the web store.
3. **Backend** — Django, shared by both. Apps present: accounts, cart, orders, products, cms, crm, marketing, analytics, recommendations, backups.

The web store and the app's in-app store are **two different front-ends**. Never merge them.

## Findings (most severe first)

| # | Sev | Where | Finding |
|---|-----|-------|---------|
| 1 | **High (scope/direction)** | plans | The web store **already exists and is functional** (`frontend`: pages Home/Products/ProductDetail/Cart/Checkout/OrderTracking/StaticPages/dashboard, `services/api.js` with JWT + guest cart, zustand, Tailwind). The task is **REBRAND/RESKIN it to the Odora design** (apply `01-design-system.md` + the web-store canvas) — **not build a store from scratch**. Plans must say this. |
| 2 | **High (correctness)** | `app/src/screens/StoreScreen.tsx` | The app's in-app store uses **hardcoded product data** (e.g. price `480`, `140`) and there is **no `services/api` layer** in the app. The in-app store must pull real data from the **shared backend API** (like the web `frontend/src/services/api.js`), not fake arrays. |
| 3 | Med (clarity) | plans/guide | Plans conflated "the store" (web) with the app's in-app store. They are separate front-ends; the guide must state this so AG doesn't build one into the other. |
| 4 | Med (carry-over) | `app/src` | Prior review findings still open (Phase B): screens import `mockDeviceController` directly (should be `getDeviceController()`), off-palette `activeGreen`, intensity stepper vs approved slider, hardcoded hex. See `fix-2026-09-08-review-findings.md`. |

## Repairs / direction
- Plans updated: `04-build-sequence-store-first.md` now says **reskin the existing `frontend`** to Odora, standalone (storefront + dashboard), backend shared; app's in-app store is separate (Phase B) and consumes the backend API.
- App-store data fix folded into `fix-2026-09-08-review-findings.md` (Phase B).
- `ANTIGRAVITY.md` now has an **"Errors to avoid (do not repeat)"** section.

## Bottom line
Direction correction: **don't rebuild the store — reskin the existing `frontend` to the Odora design.** Keep web store and app store separate. Wire the app store to the backend API (Phase B). App stays paused until the web store is done.
