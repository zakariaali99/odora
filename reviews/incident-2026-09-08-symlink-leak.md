# INCIDENT — 2026-09-08 · Symlink leak into another project

## What happened
`odora/backend` and `odora/store` were created as **symbolic links** pointing to a **different project's** `backend/` and `frontend/`. Because a symlink is the same file on disk, all Odora branding work silently modified that other project's real files.

## Damage (confirmed via git)
- Replaced its `frontend/public/logo.png` and `frontend/src/assets/logo.png`
- Modified `frontend/dist/index.html`
- **Deleted** `backend/media/products/Oud_Malaki_Chopard_99VGasF.avif` (a real product image)
- **Deleted** `backend/media/cms/banners/B-1-...png`
- Added Odora files into its media/assets (`brand_photo_*`, `categories/`, `logo.svg`, `assets/images/`)

## Resolution
1. `odora/backend` materialized as a **real folder** (full copy) — Odora is now standalone (`frontend/`, `backend/`, `app/` all real). Nothing lost.
2. The other project **fully restored**: `git restore` recovered the deleted product image and banner and the original logos; all leaked Odora files removed. Its `git status` is **clean**.

## Root cause
Using `ln -s` to "reuse" code from another project instead of keeping Odora self-contained.

## Prevention (now enforced)
`ANTIGRAVITY.md` carries a top-level **🚨 CRITICAL — NEVER LEAVE THIS FOLDER** rule: no symlinks, no access outside `odora/`, never delete media/product images, ask instead of linking.
