# Odora Editorial Storefront Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the customer-facing storefront into the quiet, photographic, editorial premium experience defined by the Odora brand reference while preserving all commerce behavior.

**Architecture:** Keep the existing React route and data architecture. Establish the brand world in shared Tailwind/CSS tokens, then reshape shared components and the purchase-path pages around those primitives without changing API contracts or stores.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, React Router, i18next, Zustand, Lucide React.

**Spec:** `docs/superpowers/specs/2026-09-19-editorial-storefront-redesign-design.md`

## Global Constraints

- Preserve all routes, API calls, stores, authentication, product/cart/order types, translation behavior, and checkout semantics.
- Use the existing brand and product images under `frontend/public/`; do not delete or replace source assets.
- Keep Arabic RTL and English LTR functional from the same components.
- Do not change backend, admin, account, or mobile-app code.
- Add no dependency.
- All customer-facing text must meet WCAG AA contrast, all controls require visible focus, and motion must honor `prefers-reduced-motion`.

---

### Task 1: Establish the editorial design foundation

**Files:**
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`
- Modify: `frontend/src/App.tsx`

**Interfaces:**
- Produces: shared `brand-*` tokens and semantic CSS utilities consumed by every subsequent task.

- [ ] Replace drifted color tokens with the exact brand-book canvas, sage, pale green, olive, ink, muted, surface, and dark values.
- [ ] Define Poppins and Tajawal font utilities so `font-sans` and `font-arabic` resolve to intentional families.
- [ ] Add reusable editorial surface, button, input, image-stage, and section-spacing classes with focus and reduced-motion treatment.
- [ ] Run `npm run typecheck`; expected result: exit 0.

### Task 2: Simplify shared storefront chrome

**Files:**
- Modify: `frontend/src/components/layout/Navbar.tsx`
- Modify: `frontend/src/components/layout/Footer.tsx`
- Modify: `frontend/src/components/common/ProductCard.tsx`

**Interfaces:**
- Consumes: Task 1 tokens and utilities.
- Produces: a quieter navigation shell, editorial product card, and restrained footer used by all storefront routes.

- [ ] Remove decorative capsules, persistent shadow/border noise, emoji, and nonessential chrome from navigation and footer while retaining every destination and menu action.
- [ ] Recompose `ProductCard` around a large product stage, concise identity, price, colorways, and a single accessible quick-add control.
- [ ] Preserve loading, discount, image fallback, RTL naming, cart mutation, and keyboard focus behavior.
- [ ] Run `npm run typecheck`; expected result: exit 0.

### Task 3: Rebuild the homepage as an editorial product story

**Files:**
- Modify: `frontend/src/pages/store/HomePage.tsx`

**Interfaces:**
- Consumes: existing featured-product and newsletter APIs, Task 1 utilities, Task 2 ProductCard.
- Produces: the primary persuasive Odora landing experience.

- [ ] Replace the nested product-control hero with a split editorial hero using `/brand_photo_0.png`, one primary CTA, one text link, and a calm proof rail.
- [ ] Keep featured products but reduce surrounding labels and repeated card containers.
- [ ] Create one image-led brand story from existing brand photography, a concise ordered three-step explanation, restrained customer proof, and a simple newsletter close.
- [ ] Keep API loading and newsletter success/error behavior intact, and ensure no factual claim is added beyond existing copy.
- [ ] Run `npm run typecheck`; expected result: exit 0.

### Task 4: Carry the visual system through discovery and product detail

**Files:**
- Modify: `frontend/src/pages/store/ShopPage.tsx`
- Modify: `frontend/src/pages/store/ProductDetailPage.tsx`
- Modify as needed: `frontend/src/components/common/SpecsGrid.tsx`
- Modify as needed: `frontend/src/components/common/ScentPyramid.tsx`
- Modify as needed: `frontend/src/components/common/ColorwaySelector.tsx`

**Interfaces:**
- Consumes: existing product/category APIs and Task 1-2 primitives.
- Produces: cohesive collection browsing and product evaluation surfaces.

- [ ] Replace the shop banner with an editorial collection masthead and simplify category/sort controls without altering URL parameters.
- [ ] Give the product detail page a larger photographic stage, clearer purchase hierarchy, and one consolidated trust rail.
- [ ] Preserve colorway selection, quantity bounds, add-to-cart, specifications, scent notes, reviews, related products, loading, and not-found behavior.
- [ ] Run `npm run typecheck`; expected result: exit 0.

### Task 5: Refine cart and checkout into one calm transaction flow

**Files:**
- Modify: `frontend/src/pages/store/CartPage.tsx`
- Modify: `frontend/src/pages/store/CheckoutPage.tsx`

**Interfaces:**
- Consumes: existing cart/order stores and Task 1 primitives.
- Produces: visually consistent cart and checkout with unchanged business behavior.

- [ ] Simplify cart item rows, totals, coupon entry, delivery messaging, empty state, and checkout CTA into a clear two-column hierarchy.
- [ ] Simplify checkout section containers, fields, payment choices, errors, and sticky order summary while preserving validation and submission payloads.
- [ ] Confirm disabled, loading, error, empty, and success transitions remain visible and accessible.
- [ ] Run `npm run typecheck`; expected result: exit 0.

### Task 6: Verify and finish

**Files:**
- Review only: all files changed in Tasks 1-5.

**Interfaces:**
- Produces: build and visual evidence for the final result.

- [ ] Run `npm run typecheck`; expected result: exit 0.
- [ ] Run `npm run build`; expected result: exit 0 with no unresolved imports or CSS errors.
- [ ] Start the Vite dev server and capture 1440px and 390px views of homepage, shop, product detail, cart, and checkout.
- [ ] Inspect Arabic RTL and English LTR for overflow, clipping, image crop, focus, contrast, and reduced motion in one bounded pass.
- [ ] Apply one consolidated correction batch, rerun typecheck/build, and stop after the confirmation pass.

