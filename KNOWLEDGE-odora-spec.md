# KNOWLEDGE — Odora Spec (understand only, DO NOT implement)

> **Type:** KNOWLEDGE. This is background context so you understand *why* the plans are shaped as they are.
> **Do NOT build from this file.** Build only from `plans/claude plans/`.

---

## 0) Architecture — three parts, one backend
- **Web store** — standalone `frontend/` (React + Vite): full storefront **+ dashboard + more**. Already built and working; reskin to Odora.
- **Mobile app** — `app/` (Expo/RN) with its **own smaller in-app store** — a SEPARATE front-end from the web store.
- **Backend** — Django, **shared** by both (accounts, cart, orders, products, cms, crm, marketing, analytics, recommendations).
- The web store and the app's in-app store are **two different front-ends**; both consume the shared API. Never merge them.

## 1) Purpose — white-labeling
Odora is Mostafa's **own brand** for smart aroma diffusers in Libya, replacing the Chinese manufacturer's "Scent Marketing" app. It is a **product/brand**, not a one-off. If built config-driven, the same platform could be resold to other distributors later (recurring revenue).

## 2) The device (dumb actuator)
- Model **A316** — commercial aroma diffuser (1000ml, 12V/2A, ~900 m² coverage → offices/hotels/malls).
- Manufacturer: **JCLOUD / Scenta** (Chinese OEM). Official app: "Scent Marketing".
- **Connectivity: BLE + (likely) WiFi.** The device has no intelligence — it just sprays on command. All logic (scheduling, users, state) lives outside it.
- "V2.0" = the device's protocol version (intensity 0–10), NOT Bluetooth 2.0.

## 3) Protocol (open-sourced)
- **Aroma-Link**, reverse-engineered in `mr-sparks/scent-assistant` (`PROTOCOL.md`) and `Memberapple/ha_aromalink`.
- Commands: on/off, intensity, spray on/off seconds, schedule, oil level.
- Caveat: documented for the family, not necessarily Mostafa's exact unit (UUIDs/firmware may differ) → verify on a real unit.

## 4) Connectivity reality (why the plan is BLE-first, cloud-later)
- **BLE:** local control, phone near device. No cloud, no gateway. → **primary path / MVP.**
- **Direct WiFi:** two meanings — *infrastructure WiFi* (joins router → internet, good for remote) vs *WiFi Direct* (P2P, local only, like Bluetooth). Confirm which.
- **Remote control + BLE-only device** would need a **gateway** on-site (ESP32) because of **NAT**: an internet server cannot open connections into a customer's private LAN; only outbound connections (device/gateway → cloud) work.
- **WiFi (infrastructure) devices connect out to the manufacturer's Aroma-Link cloud themselves** → remote control possible via **cloud-to-cloud** integration, no gateway. This is the escape hatch, but it's a dependency on the vendor cloud.
- **Hosting:** the cloud/backend can live on a **Libyan Spider VPS** (not shared hosting — IoT needs persistent connections, custom ports, background workers). A host in a data center can **never** act as the on-site gateway (NAT).

## 5) Owner decisions that shape the build
- **BLE is the primary transport; direct WiFi secondary; cloud/remote is later and gated.**
- Play safe: **do not assume the device is bought.** Build device-independent parts first via MockTransport.
- Design must be **premium & minimal** (sage green / matte white / matte black; warm neutrals; lowercase "odora" wordmark).

## 6) Future scope (not now)
- Remote control (cloud), multi-tenant + RBAC (Tenant → Locations → Devices; roles: super-admin/tenant-admin/operator), multi-product catalog, telemetry/analytics, reseller white-label config. All gated behind `02-cloud-remote-path.md` and owner approval.

## 7) Commercial note
Scope can grow from a local-control app to a full IoT SaaS. Pricing is discussed separately by the owner; recurring revenue (hosting/support/subscription) is the long-term value. Not your concern to implement.
