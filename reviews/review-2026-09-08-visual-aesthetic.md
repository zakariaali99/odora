# Visual / Aesthetic Review — 2026-09-08 (with my eyes, not code)

Looked at the rendered store as a designer, not an engineer. Colors, shapes, type, composition, overall feel.

## Overall impression: premium & cohesive — "quiet luxury"
It genuinely looks like a real brand, not a template. Calm, natural, confident. The brand book translated well.

## Colors — ✅ strong, slightly mono
- Sage `#919C7A` + cream `#F4F0EC` + near-black + pale-green accent = cohesive, warm, expensive-feeling. Consistent across every page.
- Pale-green badges (connected / "SCENT OF ATMOSPHERE" pill) are a nice touch.
- **Watch-out:** it's *almost monochrome sage*. Over many pages it can feel a little flat/samey. A sparing secondary accent (the warm amber/wood from the oil bottles, or a deeper forest-olive) used rarely would add depth without breaking the calm. Optional.

## Shapes — ✅ consistent, tactile
- Generous rounded corners on cards + fully-rounded pill buttons echo the soft cylindrical product. One consistent radius language.
- Near-black pill CTAs pop nicely against cream. Good contrast discipline (one dark primary action).

## Typography — ✅ good hierarchy
- Poppins (Latin, matches the wordmark) + an Arabic geometric face. Large light display headings, small wide-tracked eyebrows, muted body. Reads premium.

## Composition — ✅ airy
- Lots of whitespace, split hero, clean stat row. Restrained and elegant.

## The real visual weaknesses
1. 🟠 **Imagery is the weak link.** The hero and EVERY product image show the **design-reference moodboard collage** (a busy board of tiny images + text). It reads as a press-kit/placeholder and *cheapens* an otherwise premium page. This is the #1 thing dragging the look down — needs a single, beautiful product/lifestyle shot per context. (Already in the frontend fix-plan.)
2. 🟠 **A bit flat / under-textured.** Some sections are flat sage blocks; the depth/texture/mist from `03-design-elevation.md` isn't fully realized yet. The planned elevation pass fixes this.
3. 🔴 **English mode looks broken** (see dual-language below).

## 🔴 Dual language — BROKEN (confirmed visually)
Toggling to **English**: the **nav flips to English + LTR**, but **all page content stays Arabic** and is now **left-aligned/misaligned** (hero headline's punctuation ends up on the wrong side; text hugs the wrong edge). Result: a broken hybrid — English chrome around misaligned Arabic content.
- **Root cause:** only **13 of 38** components read `useLanguageStore`; the rest have **hardcoded Arabic** strings. And switching to EN flips layout direction to LTR while the untranslated Arabic content still needs RTL.
- Fix-plan: `plans/claude plans/fix-2026-09-08-dual-language.md`.

## Verdict
Aesthetically this is 80% of a premium store. Two things unlock the rest: **real photography** (kill the moodboard placeholders) and the **elevation pass** for depth. And the **English/RTL system must be fixed or the toggle hidden** — right now it actively looks broken.
