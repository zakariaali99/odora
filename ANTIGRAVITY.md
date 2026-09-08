# Odora — Guide for Antigravity (READ FIRST)

> # 🚨 CRITICAL — NEVER LEAVE THIS FOLDER
> **All work happens inside `odora/` only.** The only code locations are:
> - `odora/frontend/` — the web store (React)
> - `odora/backend/` — the Django API
> - `odora/app/` — the mobile app (RN)
>
> **Absolutely forbidden:**
> 1. **NEVER create symbolic links** (`ln -s`) to code outside `odora/`. A past incident symlinked `odora/backend` and `odora/store` to a DIFFERENT project — every edit silently modified that other project's real files, replaced its logo, and **deleted its product images**. This must never repeat.
> 2. **NEVER read from, write to, or delete anything outside `odora/`.** No other project folder exists for you.
> 3. **NEVER delete media/product/banner images.** If an asset seems wrong, ADD a new one — do not remove existing files.
> 4. If a path you need is outside `odora/`, **stop and ask the owner** instead of linking or editing it.


This repository builds **Odora**: a white-label smart aroma-diffuser mobile app + store.
This file tells you **what to implement, what to only understand, and how we work.** Read it fully before doing anything.

---

## 1) Two kinds of documents — do not confuse them

| Type | Meaning | Location | Your action |
|---|---|---|---|
| **PLAN** | Work to be implemented | `plans/claude plans/` | **Implement**, in order, following each plan |
| **KNOWLEDGE** | Background to understand only | `KNOWLEDGE-odora-spec.md` | **Understand only. Do NOT implement from it.** |
| **DESIGN** | Visual source of truth | `design-reference/` + `plans/claude plans/01-design-system.md` | Follow for all UI |
| **ELEVATION** | How to finish to premium quality | `plans/claude plans/03-design-elevation.md` | Apply to every screen |
| **REVIEW** | Results of Claude's reviews | `reviews/` | Read fix-plans referenced here; apply the repairs they point to |

> **Order:** `plans/claude plans/04-build-sequence-store-first.md` sets Store-first. Open fix-plans (`fix-*.md`) after a review points to them.

> **Rule:** Only files under `plans/claude plans/` are instructions to build. Everything else is context.

---

## 1b) Two SEPARATE front-ends (never merge)
- **Web store** = the standalone `frontend/` (React) — storefront **+ dashboard + more**. Already exists; **reskin** it to Odora.
- **Mobile app in-app store** = a **separate, smaller** store inside `app/` (RN). NOT the web store.
- Both talk to the **same Django backend**. Do not build one into the other; do not duplicate the backend.

## Errors to avoid (do NOT repeat)
1. **Do not rebuild the web store from scratch** — it exists in `frontend/`. Reskin to the Odora design; keep its logic, routing, and `services/api.js`.
2. **Do not hardcode store data.** The app's in-app store currently fakes products/prices — that is wrong. Every store (web and app) must pull real data from the **shared backend API**.
3. **Do not merge the web store and the app store** — separate front-ends, one shared backend.
4. **Do not couple screens to a concrete transport** — use `getDeviceController()`, never import `mockDeviceController`/`BleTransport` in a screen.
5. **Do not use off-palette colors or hardcoded hex** — only `01-design-system.md` tokens.
6. **Do not implement the cloud/remote path** — `CloudTransport` stays a stub.

## 2) Hard rules (do not break)

1. **⛔ Do NOT implement the cloud / remote-control path** (`CloudTransport`, VPS, Aroma-Link cloud) until the owner explicitly says "start the cloud path." See `plans/claude plans/02-cloud-remote-path.md` — it is **planning-only**. Leave `CloudTransport.ts` as an unimplemented stub.
2. **⛔ Do NOT assume a physical device exists.** The critical path is built on **MockTransport** (a fake device) until a real unit is available. Everything green in the milestones needs no hardware.
3. **All control goes through the abstract `DeviceController`.** UI/screens must never call BLE/WiFi directly.
4. **Design is premium & minimal.** Follow `01-design-system.md` and `design-reference/test.pdf`. Do not invent brand identity.
5. **Reuse the existing Django store backend** for account + store. Do not build a new store.
6. **Arabic (RTL) + English** from day one.
7. **Build to premium finish, not bare mockups.** The static mockups are the STRUCTURE (correct brand + layout); they are intentionally skeletal. Elevate every screen per `plans/claude plans/03-design-elevation.md` — real imagery, depth/texture, content that earns its place, all interactive states. Minimal is the brand; empty is not.
8. **Stop after each milestone** for owner review.

---

## 3) Build order (summary — full detail in the plan)

> **⚠️ Order (owner decision 2026-09-08): build the WEB STORE first, then the mobile app.** See `plans/claude plans/04-build-sequence-store-first.md`. The milestones below describe the APP (Phase B); do the store (Phase A) first.


Green = no device needed → **build these first.** Blue = needs a real unit. Red = gated.

- 🟢 **M0** Bootstrap → 🟢 **M1** Design system from PDF → 🟢 **M2** Full app on MockTransport → 🟢 **M3** Store integration
- — split line —
- 🔵 **M4** BLE on/off → 🔵 **M5** BLE full control → 🔵 **M6** WiFi transport
- 🟢/🔵 **M7** Polish + release
- ⛔ Cloud/remote, multi-tenant → **gated, owner's order only**

---

## 4) Review workflow (how Claude reviews your work)

1. Claude reviews your output and writes a result file in `reviews/`.
2. If a mistake is found, Claude writes a **fix-plan** in `plans/claude plans/` (e.g. `fix-YYYYMMDD-<topic>.md`).
3. The end of each review **tells you exactly which fix-plan to open and apply.**
4. You then implement that fix-plan like any other plan.

See `reviews/README.md`.

---

## 5) Language & cost
All PLAN and REVIEW files are in **English** intentionally (lower token cost). Keep any docs you add in English too.

---

## 6) Where to start right now
1. Read `KNOWLEDGE-odora-spec.md` once for context.
2. **Start with the WEB STORE — Phase A in `plans/claude plans/04-build-sequence-store-first.md`.** Build every page in its inventory, following `01-design-system.md` and `03-design-elevation.md`.
3. The mobile app is **Phase B** (second) — `00-implementation-plan.md`. Do not start it until the store is done or the owner says so.
4. If a review left a `fix-*.md` in `plans/claude plans/`, apply it first.
