# Verification Review — 2026-09-08 · ran the actual checks

Beyond reading code, I ran build/checks on the standalone `odora/` project.

## Results
| Surface | Check | Result |
|---|---|---|
| **Structure** | symlinks under `odora/` | ✅ **0** — all real folders (no links, no submodules) |
| **Backend** | `python manage.py check` | ✅ **0 issues** |
| **Frontend (store)** | `npm run build` (vite) | ✅ **builds** — 1,676 modules, no errors; bundle 484 KB (134 KB gzip) |
| **Mobile app** | `npx tsc --noEmit` | 🔴 **CRASHES** — `RangeError: Maximum call stack size exceeded` in tsc; the app does not typecheck |

## Notes
- ✅ **Web store is healthy** — clean production build; backend passes Django's system check. The store is genuinely functional, not stubs.
- 🔴 **App typecheck crash (Phase B):** `tsc` blows the stack. Likely the bleeding-edge pinned versions (`typescript ~6.0.3`, React 19.2.3, RN 0.86.3, expo ~57) or a pathological type. Must be resolved before app work resumes — you can't trust the build until `tsc --noEmit` passes. Try: pin TypeScript to a stable release, `skipLibCheck: true`, and isolate the offending file.
- 🟠 **Frontend bundle 484 KB** — acceptable, but consider route-level code-splitting (`React.lazy`) later.
- Standing items unchanged: **backend security defaults** (`fix-2026-09-08-backend-security.md`), **store design/elevation + RTL pass**, **app structural fixes** (`fix-2026-09-08-review-findings.md`).

## Priority
1. Backend security (before deploy).
2. Store: design/elevation pass + RTL verify (build already green).
3. App (Phase B): fix the `tsc` crash FIRST, then the structural fixes.
