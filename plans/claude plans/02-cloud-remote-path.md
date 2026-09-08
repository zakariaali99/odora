# PLAN 02 — Cloud / Remote-Control Path

> # ⛔⛔ PLANNING ONLY — DO NOT IMPLEMENT ⛔⛔
> **To Antigravity / any implementer:** build **nothing** from this file until the owner (Zakaria) explicitly says **"start the cloud path."**
> Keep `CloudTransport.ts` a stub. This is a future reference, not a task.

---

## 1) Why this is deferred
- The MVP is **local control** (BLE primary + direct WiFi). It works while the user is near the device — enough to launch.
- Remote control (from anywhere) is **added value later**, built on top of the same app **without rewriting it**, thanks to the abstract `DeviceController`.
- Safe-first: we don't commit to cloud cost/complexity before the local product is proven and the owner decides.

## 2) Two options (chosen when activated)

### Option A — Cloud-to-cloud via Aroma-Link (requires a WiFi device)
```
Odora app → our cloud (Django/VPS) → Aroma-Link cloud API → WiFi device
```
- **No gateway, no firmware.** The WiFi device dials the manufacturer cloud; our cloud integrates with the (reverse-engineered) Aroma-Link API (`ha_aromalink`).
- **Cost:** dependency on the manufacturer's cloud (their downtime/API changes affect us; our data passes through them).

### Option B — Self-owned gateway (requires a BLE device + a box on-site)
```
Odora app → our cloud (VPS) → MQTT → Gateway (ESP32) on-site → BLE → device
```
- **Full ownership, no vendor dependency.** But requires **ESP32 firmware + hardware per site** (higher effort/cost).

> A vs B depends on the device Mostafa buys (WiFi → A; BLE-only → B) and how much independence from the manufacturer is wanted.

## 3) VPS (when activated)
- **Hosting: a VPS from Libyan Spider** (NOT shared — IoT needs persistent connections/ports/background workers; plus local payment in LYD + local data + lower latency for Libyan users).
- **Components:** existing Django REST + (Option B) self-hosted MQTT broker (EMQX/Mosquitto) + Celery (scheduling/sync) + WebSocket for live state.
- **Why shared hosting fails:** it typically blocks the broker, WebSockets, background workers, and custom ports (see the spec — NAT + hosting section).

## 4) Activation checklist (future)
- [ ] Owner explicitly says "start the cloud path."
- [ ] Device type decided (WiFi → A; BLE → B).
- [ ] Libyan Spider VPS provisioned.
- [ ] (A) Aroma-Link cloud API integration confirmed on a real account/device.
- [ ] (B) ESP32 gateway prototype working (firmware + MQTT + BLE).
- [ ] Implement `CloudTransport` behind `DeviceController` (no UI changes).
- [ ] Multi-tenant + RBAC if B2B customers come on board.

## 5) The design rule that makes this easy later
Because all control goes through the abstract `DeviceController`, adding `CloudTransport` later **touches neither the screens nor the flows** — just a new transport behind the same interface. This is the whole payoff of building the abstraction from the start.
