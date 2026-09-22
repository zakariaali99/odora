# Message to Antigravity (Odora) — Phase 1 fix pass

Phase 0 passed (tsc clean, app boots on web). Phase 1 is about 80% done: tokens, fonts, the 24 UI components, the 4-tab bar and light/dark all work. It needs one fix pass before Phase 2.

Read `reviews/review-2026-09-22-app-phase0-1.md`, then apply every item in `plans/claude plans/fix-2026-09-22-app-phase1.md`:

1. RTL must really mirror the layout (High). Language change → confirm sheet → reload with `Updates.reloadAsync()`; persist the language and apply RTL before first render; on web set `dir` + root `direction`. Use logical styles (start/end) in all `components/ui/`. Arabic: Home tab on the right, ListRow icon at start and chevron at end, inputs aligned to start.
2. i18n: add `nav.*` keys (tab labels show English in Arabic now); no hard-coded strings in UI components (e.g. PresetChips).
3. Dark skeleton is invisible — use `surfaceMuted` base + `surfaceHigh` shimmer.
4. Small fixes: Banner action overlaps text in Arabic; input error text = bodySm sentence case; StatBlock value truncates; Latin text inside Arabic UI should use Outfit; replace hard-coded #FFFFFF with tokens (add `thumb`).
5. Run `npx expo install --fix`; retest TypeScript 6.0.3 once — if it still crashes keep 5.8 and document why in `app/README.md`.
6. Report: commit Phase 0 and Phase 1 separately; `/dev/ui-kit` screenshots in AR light, AR dark, EN light, EN dark on the iOS simulator (and web) in `reviews/qa-app-2026-09-22/`; paste `tsc --noEmit` output.

Rules unchanged: do not touch `frontend/`, `CloudTransport` stays a stub, never use Stitch images. Do not start Phase 2 — stop after this fix pass for review.
