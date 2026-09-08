# PLAN 03 — Design Elevation (make it premium, not bare)

> **Type:** PLAN (apply when building UI). Read with `01-design-system.md`.
> **Why:** the static mockups are the **structure/skeleton** — correct brand, correct layout — but they read as *over-minimalistic* (empty, unfinished). Minimal is the brand; **empty is not**. Build to an **editorial-premium** finish: depth, real imagery, and content that earns its place. Stay calm and elegant — do NOT go maximalist or busy.

> **Golden rule:** the mockups are the FLOOR, not the ceiling. Match their layout and tokens, then elevate every screen with the directives below.

---

## 1) Real photography over flat shapes (biggest lever)
- The CSS-drawn devices/bottles in the mockups are **placeholders**. Replace with **real product + lifestyle photography** in the brand mood: stone, linen, wood, foliage, soft natural light, warm neutrals (exactly the `design-reference/test.pdf` shots).
- Landing: a large/full-bleed lifestyle hero image (device in a styled room), not a flat sage block.
- Product cards & detail: product-in-context photos + a clean packshot gallery with thumbnails.
- **Asset need:** ask the owner for real product photos (or the PDF's source shots). Until then, use the PDF lifestyle images as placeholders and mark them as such.

## 2) Depth & atmosphere (kill the flatness)
- Layered, **soft multi-stop shadows**; gentle tonal gradients (never loud); a subtle **grain/noise** texture on large cream fills so backgrounds aren't dead-flat.
- **Ambient mist/vapor** wisps rising from the diffuser nozzle (animated on web/app).
- Frosted/blur (`backdrop-filter`) on surfaces that overlap imagery (nav on scroll, cards over photos).
- Rounded, tactile surfaces with a faint inner highlight — echo the soft matte product.

## 3) Content that earns its place (fills the "empty" feeling with value)
Add real, useful sections — not filler:
- **Product detail:** image gallery + thumbnails · **scent note pyramid** (Top / Heart / Base) · specs table (coverage m², capacity, runtime, noise dB, power) · a short **"how it works"** (waterless cold-air) explainer with a small diagram · **star ratings + 2–3 reviews** · delivery / warranty / returns row · **related products** + **bundle** upsell.
- **Landing:** lifestyle hero · **how-it-works 3-step** · scent-family showcase · testimonials · quality/press badges · newsletter · a proper multi-column footer.
- **App — device screen:** an **oil-level ring gauge**, active scent + note chips, "running 1h 20m" status, a **usage mini-chart**, and a quick scent switcher. **Home:** richer greeting, quick actions, per-room mood.
- Keep numbers/badges **meaningful** — no data-slop.

## 4) Richer components & every state
- Design **hover / press / focus / disabled / loading / empty** for every control (the mockups only show the default).
- Colour swatches that **swap the product image**; quantity steppers; slider with a **value bubble**; toggles and the power button with motion.
- Cards: imagery + subtle 1px warm border + **hover lift**.

## 5) Typographic richness
- Stronger **type scale & contrast**: large light display headings vs small wide-tracked eyebrows; a pull-quote or two; tabular numerals for specs/prices. Keep Geomini (Poppins fallback).

## 6) Motion (build phase, web + app)
- Gentle **scroll reveals**, hero **parallax**, slider **fill ease**, **mist drift**, image **cross-fade** on swatch change. Slow, calm easing (250–500ms). One orchestrated reveal beats scattered micro-animations.

## 7) Balance (stay on-brand)
- Keep generous whitespace, but pair it with **texture + imagery** so it reads *curated*, not *unfinished*.
- Do **not**: add gradients-for-drama, clutter, competing CTAs, or busy patterns. Elegant restraint with depth — that is the target.

---

## Definition of "elevated" (checklist per screen)
- [ ] Real/lifestyle imagery present (or clearly-marked placeholder)
- [ ] Depth: soft shadows + texture, no dead-flat fills
- [ ] At least one "earns-its-place" content section beyond the bare controls
- [ ] All interactive states designed
- [ ] Type hierarchy has real contrast
- [ ] Motion plan noted for the build
