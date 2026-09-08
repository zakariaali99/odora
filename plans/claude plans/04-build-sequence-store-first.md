# PLAN 04 — Build Sequence: Store first, then App

> **Type:** PLAN (governs order of work). Owner decision, 2026-09-08: **build the web store BEFORE the mobile app.**
> This overrides the app-first ordering implied by `00-implementation-plan.md`. The app plan itself is unchanged — only its *timing* moves to second.

## Why store-first
- **Buildable now, zero hardware dependency.** The store needs no diffuser; the app's core (BLE) has a Phase-0 device dependency.
- **Revenue first.** The store sells diffusers + oils immediately.
- **Foundation for the app.** The app **reuses the store's Django + DRF + JWT backend and API**. Finalizing the store hardens the API the app will consume.
- **Brand rollout.** The store is where the Odora brand goes live publicly first.
- The device-independent app work already done (theme, i18n, `DeviceController`, Mock, screens) **stays valid** — it is paused, not discarded.

## Phase A — Web store (FIRST)
**The Odora web store is already substantially built in `odora/frontend/` — FINISH, VERIFY, and POLISH it (do not rebuild).**
- Reality (reviewed 2026-09-08): `frontend/` (React + Vite + Tailwind + zustand + axios) has the full route set (storefront + account + content + admin + 404), Odora tokens in `tailwind.config.js`, and a real `services/api.js` (JWT + guest cart). Backend is `odora/backend/` (Django, `odora_backend`), API-connected. ~5,700 lines, 19/27 pages call the API.
- **Your job now:** (1) confirm it **builds and runs** against `odora/backend`; (2) apply the **elevation/design pass** (`03-design-elevation.md` + web-store canvas + `design-reference/exports/store/`) so it's premium, not flat; (3) verify **Arabic RTL** on every page; (4) apply `fix-2026-09-08-backend-security.md` before deploy; (5) confirm content-page copy is real (no lorem).
- **This is the STANDALONE web store** (storefront + dashboard + more). It is **separate** from the mobile app's in-app store — two different front-ends, never merged.
- **Design source:** `odora-web-store` canvas + exports in `design-reference/exports/store/` + `01-design-system.md` + `03-design-elevation.md`.
- **Reuse:** the existing `frontend` code and the shared Django API (products, cart, orders, accounts, cms, crm, marketing, analytics). Restyle only — keep logic, routing, and API intact.
- **Elevation + tokens** apply (sage #919C7A, cream #F4F0EC, Geomini/Poppins, real logo in `design-reference/`, real photography).
- **Language:** Arabic (RTL) + English.

### Complete page inventory (build ALL — leave no page lacking)
**Storefront / shopping**
1. **Landing / Home** — hero, featured, how-it-works, testimonials, scent showcase, brand band, footer.
2. **Shop / Product listing** — grid + **filters** (category, colour, scent family, price) + **sort** + pagination/infinite scroll.
3. **Category pages** — Diffusers · Fragrance Oils · Bundles (same listing, scoped).
4. **Product detail** — image gallery + thumbnails, colourway swatches (swap image), **scent-note pyramid**, specs table, ratings + reviews, delivery/warranty/returns, related products, bundle upsell, add-to-cart.
5. **Search** — search bar + results + "no results" empty state.
6. **Cart** — line items, qty steppers, promo/coupon, free-delivery progress, summary.
7. **Checkout** — address, delivery method, **payment (cash-on-delivery + card)**, order review, place order (LYD).
8. **Order confirmation / thank-you** — order number, summary, next steps.
9. **Order tracking / status** — timeline (placed → packed → shipped → delivered).

**Account**
10. **Sign in** · 11. **Register** · 12. **Forgot / reset password**.
13. **Account dashboard** — overview.
14. **My orders** — list + **order detail**.
15. **Addresses** — add / edit / delete / default.
16. **Profile & settings** — name, phone, email, language, password.
17. **Wishlist / saved items** (optional but include the page).

**Content / trust**
18. **About** — brand story (positioning / mission / vision from the PDF).
19. **Technology / How it works** — waterless cold-air explainer.
20. **Fragrances / scent library** — all scents + note profiles.
21. **Contact** — form + branches (Misrata/Tripoli/etc. if provided).
22. **FAQ / Support** — shipping, warranty, returns.
23. **Legal** — Privacy Policy · Terms (required for a store).

**Global & system**
24. Header/nav (search, account, cart badge) + Footer (columns) — on every page.
25. **Empty states** — empty cart, no orders, no results, empty wishlist.
26. **Loading & error states** (skeletons; network/API errors).
27. **404 / not found**.
28. **Cookie/consent** — privacy-preserving (decline non-essential by default).
29. **Responsive** — verify all pages at mobile width.

- **DoD:** every page above exists and is on-brand; a real order completes end-to-end; account + orders work; API confirmed ready for mobile reuse.

## Phase B — Mobile app (SECOND)
Resume `00-implementation-plan.md` from where it stands (M0–M3 device-independent parts largely built).
- Apply `fix-2026-09-08-review-findings.md` first.
- Then continue: Store integration → M4 BLE (needs a real unit) → M5 → M6 WiFi → M7 release.
- Add the **Onboarding** and **Checkout** screens (designed this session) into the app during M2/M3.

## Unchanged rules
- ⛔ Cloud/remote path stays gated (`02-cloud-remote-path.md`).
- ⛔ Do not assume a physical device.
- Stop after each milestone for owner review.
