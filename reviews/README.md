# Reviews

Claude writes the results of its reviews here. **All review files are in English.**

## How reviews work
1. Claude reviews the implementer's work and writes a result file here, named `review-YYYYMMDD-<topic>.md`.
2. Each review states: what was checked, what passed, and any mistakes found (with file:line and severity).
3. **If a mistake is found**, Claude writes a matching **fix-plan** in `../plans/claude plans/`, named `fix-YYYYMMDD-<topic>.md`.
4. **The end of every review points to exactly where to go next** — the fix-plan file to open and apply. If nothing is wrong, the review says "no repairs needed."

## For the implementer (Antigravity)
- Read the latest review here.
- Open the fix-plan it points to (in `plans/claude plans/`).
- Apply it like any other plan, then stop for re-review.

## Naming
- Reviews: `reviews/review-YYYYMMDD-<topic>.md`
- Fix-plans: `plans/claude plans/fix-YYYYMMDD-<topic>.md`
