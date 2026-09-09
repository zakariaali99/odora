# UI MUST-DO — non-negotiable fixes (the current UI fails fundamentals)

> **Type:** PLAN (P0 — do before any "polish"). Owner verdict 2026-09-08: the store **looks bad** — one flat background color that's hard on the eyes and distracting, text that's hard to read, weak look everywhere. This is a **redesign gate**, not tweaks. What's below is "the tip"; hold everything to a higher bar than the current build.
> Supersedes the earlier "looks premium" assessment — that was wrong.

## P0 — must fix

### 1. Kill the flat single-tone field (biggest problem)
- The whole app is bathed in cream/sage — it's monotonous, distracting, and tiring. **Stop.**
- Establish a real **background + surface system**:
  - A calmer, near-neutral page background (a very light warm off-white/grey — LOW saturation), NOT a saturated cream that vibrates.
  - **Distinct elevated surfaces** (clean white cards) that clearly separate from the background with real shadow/contrast.
  - **Section rhythm** — vary tone between sections deliberately (light / white / one deeper band), don't paint every section the same.
  - **Sage becomes an ACCENT, not the field.** Remove the big sage flood-fills; use sage for accents, highlights, one hero moment — not as the dominant background.

### 2. Text must be readable (contrast)
- Body and secondary text are too low-contrast on the current background. Fix to **WCAG AA minimum (≥ 4.5:1 body, ≥ 3:1 large)**.
- Darken `inkPrimary` toward true near-black; raise `inkMuted` contrast or use it less; stop putting muted text on tinted grounds.
- Increase size/weight where text is straining (captions, labels, prices).

### 3. Real hierarchy & depth
- Content must **pop off** the background: layered surfaces, purposeful shadows, clear primary/secondary/tertiary levels. Right now everything sits on one flat plane.

### 4. Accent discipline (add life)
- Introduce a **secondary accent** (warm amber/wood from the oils, or a deep forest tone) used sparingly for emphasis — the near-monochrome sage is dead.
- One clear primary action per view; consistent button system with visible states (hover/press/focus/disabled).

### 5. Real imagery (no moodboard)
- Every product/hero currently shows the design-reference **moodboard collage** — replace with real, single, beautiful product/lifestyle photos. Placeholder collages are unacceptable in the shipped look.

### 6. Component & spacing consistency
- Audit cards, inputs, chips, spacing scale, radii, and empty/loading/error states for consistency and polish across ALL pages.

### 7. Migrate the frontend to TypeScript
- Convert the web store (`frontend/`) from plain JS/JSX to **TypeScript (`.tsx`)** — types on props, API responses (`services/api`), and store state.
- **Why:** type safety catches whole classes of bugs before runtime (e.g. the `useEffect is not defined` crash the JS build shipped).
- **DoD:** `tsc --noEmit` passes; API responses and component props are typed.

### 8. Replace the custom language store with `react-i18next`
- Remove the hand-rolled `useLanguageStore` translations dict. Adopt **`react-i18next`** with `ar`/`en` resource files, `dir`/`lang` on `<html>`, and logical CSS for direction.
- Every user-facing string comes from i18n (no hardcoded Arabic). Supersedes `fix-2026-09-08-dual-language.md`'s "centralize strings" step — do it via react-i18next.
- **DoD:** switching AR/EN translates ALL text and lays out correctly in both directions; no hardcoded strings; no mixed/misaligned state.

## Process
- **Redo the design language FIRST** (background/surface/contrast/accent tokens), then re-apply page by page. Don't polish pages on a broken foundation.
- Re-check against `03-design-elevation.md` (depth/texture/imagery) once the base is fixed.
- **Verify contrast** with a checker; verify on a real screen, not just in code.

## Definition of done
- [ ] Page background is calm/neutral; no large distracting flat sage fields.
- [ ] Surfaces are clearly layered; content pops off the background.
- [ ] All text passes WCAG AA contrast.
- [ ] Sage is an accent; a purposeful secondary accent exists.
- [ ] Real imagery everywhere (no moodboard collage).
- [ ] Consistent components + states across every page.
- [ ] Frontend is TypeScript; `tsc --noEmit` passes.
- [ ] Language is via react-i18next; AR/EN both fully translate and lay out correctly.
- [ ] Owner looks at it and it reads clean, legible, premium — not tiring.
