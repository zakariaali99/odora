# Review — Batch B (Store flow) · 2026-09-26

**Scope:** commit `8303daa` (built before the Batch A rules existed): Store, Category, Search, ProductDetail, Cart, Checkout, OrderConfirmation.
**Method:** code audit plus the native iPhone 17 Pro (Arabic), compared with Stitch `idea-02` (`odora_store`, `odora_category_botanical_cartridges`, `odora_search_discovery`, `odora_product_detail`, `odora_cart`, `odora_checkout`, `odora_order_confirmation`), rendered at 390 wide.

## Verdict: rebuild on real data, one screen at a time
The layouts roughly follow Stitch, but **the whole flow is a mock-up and not a store**.

| # | Finding | Evidence |
|---|---|---|
| B-1 | **Invented catalog.** "Autumn Harvest Trio", "Odora Air 01", "Santal Mist", "Stone Pedestal"… The real backend has **4 products**: Odora A316 (320 LYD, 3 colourways), Forest Sage oil (45), Cotton Linen oil (45), and the Signature Bundle (410 → 380). | `api.getProducts` is never called (0 `fetch`/`api` usages in the 7 screens) |
| B-2 | **Prices in USD** ("$280", "$340", "$42"…). The market is Libya (LYD). | 36 `$` occurrences across the 7 screens |
| B-3 | **Cart doesn't work.** "+" only shows a toast; every product opens the same `ProductDetail` with no id; Checkout jumps to the confirmation without creating an order. The backend cart and checkout (`/cart/`, `/cart/items/`, `/orders/checkout/`) are unused. | `StoreScreen.tsx` 288/324/354/384/419; `CheckoutScreen.tsx:455` |
| B-4 | "شراء الباقة" did nothing when tapped on native. | tap test |
| B-5 | **Banned wording:** "باقات الملاذ / Sanctuary", "Atelier", "whisper mist", "30ml Chamber", "2-Year Architectural Warranty … micro-turbines" (warranty is an undecided business value). | `StoreScreen.tsx` 48/277/372/451/454; `CategoryScreen.tsx` 129/428/442/469/472 |
| B-6 | **The Batch A rules aren't applied:** 254 inline `isRTL ?` strings, 196 `fontWeight`, 21 raw hex colours. | grep counts |
| B-7 | Store section header misaligned in Arabic (the title isn't at the start edge; "متوفر" floats). | native screenshot |
| B-8 | Backend seed copy has banned or unverified claims: "فائق الهدوء", "أقل من 25 ديسيبل", "Whisper-quiet", "900 m²"; `noise_level = '< 25 dB'`. | `core/management/commands/seed_odora.py` 127–135 |
| B-9 | Delivery fee (15) and free-delivery threshold (300) are hard-coded in `cart/models.py`. They are business values and belong in config. | `cart/models.py` 30–43 |
| B-10 | The guest cart session id is kept only in memory, so the cart is lost when the app restarts. | `app/src/services/api.ts` 11–18 |

## Plan
1. **B1:** backend config and data fixes + the app shop data layer + the **Store** screen on real data.
2. **B2:** Product Detail.
3. **B3:** Cart.
4. **B4:** Checkout + Order Confirmation (a real COD order).
5. **B5:** Category + Search.

Each step is its own task, with its own native verification.
