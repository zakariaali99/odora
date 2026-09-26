# Task for Antigravity — Odora · B1: real shop data + rebuild the Store tab

## 0. Before you start
1. Read `/Users/zakaria/projects/antigravity/odora/plans/claude plans/09-ag-rulebook.md` **in full**. The rules for this task are repeated in §9.
2. Read the review: `/Users/zakaria/projects/antigravity/odora/reviews/review-2026-09-26-batch-b-store.md`.
3. **Project root:** `/Users/zakaria/projects/antigravity/odora`. This task touches `backend/` (small, listed changes) and `app/`. **Don't touch `frontend/`.**
4. **Current commit:** `b9bf783`. Batch A screens (Home, Devices, Device Control, Pairing, Schedule, Device Settings, Connection States) are done — **don't edit them.**
5. **Only the Store tab is rebuilt in this task.** `CategoryScreen`, `SearchScreen`, `ProductDetailScreen`, `CartScreen`, `CheckoutScreen` and `OrderConfirmationScreen` stay as they are for now. Separate tasks will cover them.

## 1. Why
The Store tab today is a picture of a store, not a store:
- the products are invented ("Autumn Harvest Trio", "Odora Air 01", "Santal Mist", "Stone Pedestal");
- prices are in **dollars**;
- "+" only shows a toast and adds nothing;
- the backend is never called.

The real catalog is in the Django backend: **4 products, 3 categories, prices in LYD (Libyan dinar)**. After this task, the Store tab must show exactly that catalog, and "+" must really add to the backend cart.

**The real catalog** (from `backend/db.sqlite3`):
| slug | type | category slug | price | discount | colourways |
|---|---|---|---|---|---|
| `odora-diffuser-a316` | diffuser | `diffusers` | 320 | — | Sage Green `#919C7A`, Matte White `#E8E3DA`, Matte Black `#1C1C1A` (each has its own image) |
| `forest-sage-fragrance-oil` | oil | `fragrance-oils` | 45 | — | — |
| `cotton-linen-fragrance-oil` | oil | `fragrance-oils` | 45 | — | — |
| `odora-signature-bundle` | bundle | `bundles` | 410 | **380** | — |

Categories: `diffusers` "أجهزة التعطير الذكية", `fragrance-oils` "الزيوت العطرية النقية", `bundles` "الباقات الحصرية".

---

## 2. Backend changes (`/Users/zakaria/projects/antigravity/odora/backend`)
Activate the environment first: `cd backend && source venv/bin/activate`.

### 2.1 Business config endpoint `GET /api/v1/config/`
Business values (fees, thresholds, warranty) aren't decided yet. They must live in **one place** so the owner can change them without touching code.

1. In `backend/odora_backend/settings.py`, at the end, add:
   ```python
   # Business config — PLACEHOLDER values until the owner confirms them.
   ODORA_BUSINESS = {
       'currency': 'LYD',
       'currency_symbol_ar': 'د.ل',
       'currency_symbol_en': 'LYD',
       'delivery_fee': os.environ.get('ODORA_DELIVERY_FEE', '15.00'),
       'free_delivery_threshold': os.environ.get('ODORA_FREE_DELIVERY_THRESHOLD', '300.00'),
       'cod_enabled': True,
       'card_enabled': False,
       'warranty_months': None,        # unknown → the app hides the warranty row
       'whatsapp_number': None,        # unknown → the app hides WhatsApp
       'cities': [
           {'key': 'tripoli', 'ar': 'طرابلس', 'en': 'Tripoli'},
           {'key': 'benghazi', 'ar': 'بنغازي', 'en': 'Benghazi'},
           {'key': 'misrata', 'ar': 'مصراتة', 'en': 'Misrata'},
           {'key': 'zawiya', 'ar': 'الزاوية', 'en': 'Zawiya'},
           {'key': 'zliten', 'ar': 'زليتن', 'en': 'Zliten'},
           {'key': 'khoms', 'ar': 'الخمس', 'en': 'Khoms'},
           {'key': 'gharyan', 'ar': 'غريان', 'en': 'Gharyan'},
           {'key': 'sabratha', 'ar': 'صبراتة', 'en': 'Sabratha'},
           {'key': 'tarhuna', 'ar': 'ترهونة', 'en': 'Tarhuna'},
           {'key': 'sirte', 'ar': 'سرت', 'en': 'Sirte'},
           {'key': 'ajdabiya', 'ar': 'أجدابيا', 'en': 'Ajdabiya'},
           {'key': 'bayda', 'ar': 'البيضاء', 'en': 'Bayda'},
           {'key': 'derna', 'ar': 'درنة', 'en': 'Derna'},
           {'key': 'tobruk', 'ar': 'طبرق', 'en': 'Tobruk'},
           {'key': 'sabha', 'ar': 'سبها', 'en': 'Sabha'},
       ],
   }
   ```
   (`os` is already imported at the top of `settings.py`. Check it, and add `import os` if it's missing.)
2. In `backend/core/views.py`, add:
   ```python
   from django.conf import settings
   from rest_framework.response import Response

   class BusinessConfigView(APIView):
       authentication_classes = []
       permission_classes = []

       def get(self, request):
           return Response(settings.ODORA_BUSINESS)
   ```
3. In `backend/core/urls.py`, add `path('config/', BusinessConfigView.as_view(), name='business-config'),` and import the view.
4. In `backend/cart/models.py` (lines 30–43), replace the hard-coded `Decimal('15.00')` and `Decimal('300.00')` with values read from settings:
   ```python
   from django.conf import settings
   FEE = Decimal(settings.ODORA_BUSINESS['delivery_fee'])
   THRESHOLD = Decimal(settings.ODORA_BUSINESS['free_delivery_threshold'])
   ```
   Use them in `delivery_fee` and `free_delivery_remaining`. The behaviour stays the same: free when subtotal ≥ threshold or subtotal = 0, otherwise the fee.

### 2.2 Product list needs capacity + scent notes
The Store oil cards show "1000 مل" and the scent notes (see §5.7). In `backend/products/serializers.py`, `ProductListSerializer`:
- add `scent_notes = ScentNotePyramidSerializer(read_only=True)`;
- add `'capacity'` and `'scent_notes'` to its `fields` list.

Keep everything else the same.

### 2.3 Remove unverified claims from the product copy (data migration)
The diffuser copy claims "ultra quiet, below 25 dB" and "900 m²". Neither is confirmed by the supplier, and both are banned (rulebook §1).

1. Create `backend/products/migrations/XXXX_remove_unverified_claims.py` (use the next number after the latest migration in that folder) with a `RunPython` that updates the product `odora-diffuser-a316`:
   | field | new value |
   |---|---|
   | `subtitle` | `Smart Cold-Air Diffuser · Bluetooth` |
   | `subtitle_ar` | `جهاز تعطير ذكي بالهواء البارد · بلوتوث` |
   | `description` | `Waterless cold-air diffusion with app control over Bluetooth: set the intensity, choose continuous or interval mode, and schedule it for every day of the week. A soft matte finish in three colours.` |
   | `description_ar` | `تعطير بالهواء البارد بدون ماء مع تحكم كامل من التطبيق عبر البلوتوث: اضبط الكثافة، واختر التشغيل المستمر أو بالفترات، وجدوِل التشغيل لكل أيام الأسبوع. تشطيب مطفي ناعم بثلاثة ألوان.` |
   | `noise_level` | `''` (empty) |
   | `coverage_area` | `''` (empty) |

   Also set `noise_level=''` and `coverage_area=''` on **all** products.
2. Edit `backend/core/management/commands/seed_odora.py` lines 127–135 to the same values, so a fresh seed matches.
3. Run `python manage.py migrate`.

### 2.4 Run the backend and check
```bash
cd /Users/zakaria/projects/antigravity/odora/backend && source venv/bin/activate
python manage.py runserver 0.0.0.0:8000        # leave running in its own terminal
curl -s localhost:8000/api/v1/config/ | head -c 300                      # → JSON with "currency": "LYD"
curl -s "localhost:8000/api/v1/products/" | python -m json.tool | grep -E '"slug"|"final_price"|"capacity"'   # 4 slugs, prices 380/45/45/320, capacity present
curl -s localhost:8000/api/v1/products/categories/ | python -m json.tool | grep -E '"slug"|"products_count"'
curl -s localhost:8000/api/v1/products/odora-diffuser-a316/ | grep -c "dB\|m²\|ديسيبل\|الهدوء"      # → 0
```
If port 8000 is already in use (`lsof -iTCP:8000 -sTCP:LISTEN`), **do not kill that process** — it may belong to another project. Stop and report it to the owner. Do not change the port either: the app uses `http://localhost:8000/api/v1`.

---

## 3. App data layer (`/Users/zakaria/projects/antigravity/odora/app/src`)

### 3.1 Persist the guest cart session — `services/api.ts`
Right now `getSessionId()` (lines 11–18) keeps the id in memory only, so the cart is lost on every restart. Change it to:
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
const SESSION_KEY = 'odora.cartSessionId';
let cachedSessionId = '';

export const initSessionId = async (): Promise<string> => {
  if (cachedSessionId) return cachedSessionId;
  const stored = await AsyncStorage.getItem(SESSION_KEY);
  cachedSessionId = stored || 'mobile_' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36);
  if (!stored) await AsyncStorage.setItem(SESSION_KEY, cachedSessionId);
  return cachedSessionId;
};
export const getSessionId = (): string => cachedSessionId;
```
Then:
- call `await initSessionId()` at the start of `initApp()` in `app/App.tsx`, **before** `setIsReady(true)`;
- make sure every request sends the header `X-Session-ID: <id>` (check `request()` in `api.ts` and add it if it's missing);
- add `getConfig: () => request<BusinessConfig>('/config/')` to the `api` object.

### 3.2 Types — new file `types/shop.ts`
```ts
export interface Colorway { id: string; name: string; name_ar: string; hex_code: string; image: string | null; is_default: boolean; }
export interface ScentNotes { top_notes: string; top_notes_ar: string; heart_notes: string; heart_notes_ar: string; }
export interface ProductListItem {
  id: string; slug: string; name: string; name_ar: string;
  product_type: 'diffuser' | 'oil' | 'bundle' | 'accessory';
  category_slug: string; subtitle: string; subtitle_ar: string;
  price: string; discount_price: string | null; final_price: string; has_discount: boolean;
  stock: number; main_image: string | null; is_featured: boolean;
  colorways: Colorway[]; capacity: string; scent_notes: ScentNotes | null;
}
export interface Category { id: string; slug: string; name: string; name_ar: string; products_count: number; order: number; }
export interface City { key: string; ar: string; en: string; }
export interface BusinessConfig {
  currency: 'LYD'; currency_symbol_ar: string; currency_symbol_en: string;
  delivery_fee: string; free_delivery_threshold: string;
  cod_enabled: boolean; card_enabled: boolean;
  warranty_months: number | null; whatsapp_number: string | null; cities: City[];
}
export interface CartItem { id: string; product: ProductListItem; colorway: Colorway | null; quantity: number; unit_price: string; line_total: string; }
export interface Cart { id: string; items: CartItem[]; total_items: number; subtotal: string; delivery_fee: string; free_delivery_remaining: string; total_price: string; }
```
Check the real JSON with the `curl` commands in §2.4. If a field differs (for example `product` in the cart is an id rather than an object), **fix the type to match the JSON** — never the other way round.

Paginated list endpoints return `{ count, next, previous, results: [...] }`. Read `results`.

### 3.3 Helpers — new file `utils/money.ts`
```ts
import i18n from '../i18n';
/** 380 → "380 د.ل" (ar) / "LYD 380" (en). Whole numbers without decimals; otherwise 2 decimals. Number wrapped in an LTR isolate. */
export const formatPrice = (value: string | number): string => {
  const n = Number(value);
  const num = Number.isInteger(n) ? String(n) : n.toFixed(2);
  const iso = `⁦${num}⁩`;
  return i18n.language === 'ar' ? `${iso} د.ل` : `LYD ${iso}`;
};
```
New file `utils/media.ts`:
```ts
const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
const ORIGIN = API.replace(/\/api\/v1\/?$/, '');
/** Backend returns "/media/products/x.png" or a full URL. Always return a full URL, or null. */
export const mediaUrl = (path: string | null | undefined): string | null =>
  !path ? null : path.startsWith('http') ? path : `${ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`;
```

### 3.4 Shop store — new file `store/useShopStore.ts` (zustand, same style as `useAppStore.ts`)
**State:**
- `config: BusinessConfig | null`;
- `categories: Category[]`;
- `products: ProductListItem[]`;
- `cart: Cart | null`;
- `status: 'idle' | 'loading' | 'ready' | 'error'`;
- `error: string | null`;
- `addingId: string | null` (the product being added, for a button spinner).

**Actions:**
- `loadStore()` — calls `api.getConfig()`, `api.getCategories()`, `api.getProducts()` and `api.getCart()` in parallel. Sets `status` to `'loading'` first, then `'ready'`. On failure: `'error'` with `error` = the i18n key `store.loadError`.
- `addToCart(productId, colorwayId?)` — sets `addingId`, calls `api.addToCart(productId, colorwayId ?? null, 1)`, then re-fetches the cart with `api.getCart()` into `cart`, then clears `addingId`. Returns `true` on success and `false` on failure.
- `refreshCart()`.

**Selectors (plain functions in the same file):**
- `cartCount(state)` = `state.cart?.total_items ?? 0`.

No screen calls `api` directly any more. **Screens use this store only.**

---

## 4. i18n keys to add — block `store` in `i18n/ar.ts` and `i18n/en.ts`
| key | ar | en |
|---|---|---|
| `title` | أودورا · المتجر | Odora · Store |
| `searchPlaceholder` | ابحث عن الزيوت والأجهزة | Search oils and diffusers |
| `all` | الكل | All |
| `chipWithCount` | {{name}} ({{count}}) | {{name}} ({{count}}) |
| `featuredBadge` | باقة مميزة | Featured bundle |
| `shopBundle` | تسوّق الباقة | Shop bundle |
| `youSave` | وفّر {{amount}} | Save {{amount}} |
| `collectionTitle` | منتجات أودورا | The Odora collection |
| `collectionCount` | {{count}} منتجات | {{count}} products |
| `inStock` | متوفر | In stock |
| `add` | أضف | Add |
| `addedToCart` | أُضيف إلى السلة | Added to cart |
| `addFailed` | تعذّرت الإضافة، حاول مرة أخرى | Couldn't add — try again |
| `benefitDeliveryTitle` | توصيل مجاني فوق {{amount}} | Free delivery over {{amount}} |
| `benefitDeliveryBody` | رسوم التوصيل {{fee}} للطلبات الأقل | {{fee}} delivery on smaller orders |
| `benefitCodTitle` | الدفع عند الاستلام | Cash on delivery |
| `benefitCodBody` | ادفع نقداً عند وصول طلبك | Pay in cash when your order arrives |
| `benefitWaterlessTitle` | بالهواء البارد وبدون ماء | Cold-air, waterless |
| `benefitWaterlessBody` | الزيت يُنشر كما هو دون تخفيف أو تسخين | Oil is diffused as it is — no dilution, no heat |
| `benefitWarrantyTitle` | ضمان {{months}} شهراً | {{months}}-month warranty |
| `benefitWarrantyBody` | يشمل عيوب التصنيع | Covers manufacturing defects |
| `loadError` | تعذّر تحميل المتجر | Couldn't load the store |
| `retry` | إعادة المحاولة | Try again |
| `emptyFilter` | لا توجد منتجات في هذا القسم | No products in this section |
| `cartA11y` | السلة، {{count}} منتجات | Cart, {{count}} items |

Names, subtitles and notes come from the backend: use `name_ar` / `subtitle_ar` / `*_ar` when the language is `ar`, otherwise the English field. Put this in one helper, `utils/localized.ts`:
```ts
export const loc = (obj: any, field: string, lang: string) => (lang === 'ar' ? obj?.[`${field}_ar`] : obj?.[field]) ?? '';
```

---

## 5. Rebuild `app/src/screens/StoreScreen.tsx` (image-to-image)
**Target:** `design-reference/stitch/idea-02/odora_store/screen.png` + `code.html`. Open both. Replace the whole file.

Stitch token → our token:
| Stitch | Ours |
|---|---|
| `bg-surface` | `bg` |
| `surface-container-lowest` | `surface` |
| `surface-container-low` | `surfaceLow` |
| `surface-container` | `surfaceMuted` |
| `surface-container-high` | `surfaceHigh` |
| `inverse-surface` | `ink` |
| `secondary-container` | `accent` |
| `primary-container` (active chip) | `primary` + `onPrimary` |
| `text-tertiary` / `text-outline` | `textSubtle` |
| `on-surface-variant` | `textMuted` |

Radii: `rounded-lg` = **32**, `rounded` = **16**. Spacing: `space-xs` 4, `space-sm` 8, `space-md` 16, `space-lg` 24, margin 20.

The screen is a `ScrollView` on `bg`, horizontal padding **20**, `paddingBottom: 112 + insets.bottom` (to clear the tab bar). The sections, top to bottom:

### 5.1 App bar (use `AppBar`)
- **Leading:** an 8×8 dot in `primarySoft` (the pulse animation from Home) + title `t('store.title')` in `typography.headlineSm`, colour `text`, 8pt gap. Sentence case, no uppercase.
- **Actions:**
  1. `{ icon: 'shopping_bag', badge: cartCount > 0 ? cartCount : undefined, label: t('store.cartA11y', { count }), onPress: () => navigation.navigate('Cart') }`.
  2. The avatar (as today) → `navigation.navigate('Account')`.

### 5.2 Search row (margin-top 16, `flexDirection: 'row'`, `gap: 8`, `alignItems: 'center'`)
- **Search pill:** a `Pressable` with `flex: 1`, height **48**, radius 999, bg `surface`, shadow `{ shadowColor: '#232821', shadowOpacity: 0.03, shadowRadius: 12, shadowOffset: { width: 0, height: 2 } }`, `paddingHorizontal: 16`. Inside: icon `search` 20 in `textSubtle`, then 8pt gap, then the text `t('store.searchPlaceholder')` in `typography.bodySm`, colour `textSubtle`, `textAlign: 'left'`. It is **not** an input — pressing it calls `navigation.navigate('Search')`.
- **Filter button:** 48×48 circle, bg `surfaceHigh`, icon `tune` 20 in `textMuted`. `onPress` → `navigation.navigate('Category', {})`.

### 5.3 Category chips (margin-top 16)
- A horizontal `ScrollView`, `showsHorizontalScrollIndicator={false}`, `contentContainerStyle={{ gap: 8 }}`. Let it run edge to edge: `marginHorizontal: -20`, `paddingHorizontal: 20`.
- **Chips:**
  - first `t('store.all')` + ` (${products.length})`;
  - then one per category, sorted by `order`: `t('store.chipWithCount', { name: loc(cat,'name',lang), count: cat.products_count })`.
- Use the `Chip` component if it matches, otherwise build it: height **36**, `paddingHorizontal: 16`, radius 999, label `typography.labelMd`.
  - **Inactive:** bg `surfaceMuted`, text `text`.
  - **Active:** bg `primary`, text `onPrimary`.
- Selection is **local state** (`selectedCategory: string | 'all'`) and **filters this screen**. It does not navigate.

### 5.4 Featured bundle card (margin-top 16)
**Shown only when** a product with `product_type === 'bundle' && is_featured` exists and the chip is `all` or `bundles`.
- **Outer:** radius **32**, bg `surfaceLow`, `overflow: 'hidden'`, shadow `{ opacity 0.06, radius 32, offset (0,12) }`.
- **Image area:** full width, height **224**, bg `surfaceMuted`. `Image` with `source={{ uri: mediaUrl(p.main_image) }}`, `resizeMode="cover"`, `width: '100%', height: '100%'`.
- **Badge** on the image: absolute, `top: 8, start: 8`. `t('store.featuredBadge')`, bg `accent`, text `text`, `typography.labelSm`, padding 4/8, radius 999. Uppercase + tracking only in English.
- **Text block:** bg `surface`, padding **24**, gap **8**.
  - **Row 1** (`flexDirection: 'row'`, `justifyContent: 'space-between'`, `alignItems: 'baseline'`, gap 12):
    - name `loc(p,'name',lang)` in `typography.headlineSm`, colour `text`, `flexShrink: 1`, `numberOfLines={2}`;
    - price group (row, gap 6): `formatPrice(p.final_price)` in `typography.labelMd` with `weightFamily(isRTL,'semiBold')`, colour `primary`. If `has_discount`, also `formatPrice(p.price)` in `typography.labelMd`, colour `textSubtle`, `textDecorationLine: 'line-through'`.
  - **Row 2:** `loc(p,'subtitle',lang)` in `typography.bodySm`, colour `textMuted`, `numberOfLines={2}`.
  - **Row 3** (row, `space-between`, `alignItems: 'center'`, margin-top 4):
    - at the start, if `has_discount`: `t('store.youSave', { amount: formatPrice(price - final_price) })` in `typography.labelMd`, colour `primary`;
    - at the end, a button 44 high, `paddingHorizontal: 24`, radius 999, bg `ink`: text `t('store.shopBundle')` in `typography.labelMd` with `weightFamily(isRTL,'semiBold')`, colour `onInk`, plus icon `arrow_forward` 16 in `onInk`, gap 6. `onPress` → `navigation.navigate('ProductDetail', { productId: p.slug })`.
  - The whole card is also pressable to the same destination (the button stops propagation).

**Definitions used below** (compute them once, with `useMemo`):
- `filtered` = all products when the chip is `all`, otherwise the products whose `category_slug` equals the chip.
- `featuredBundle` = the first item in `filtered` with `product_type === 'bundle' && is_featured`, or null.
- `visibleProducts` = `filtered` minus `featuredBundle`.
- The **empty state** (§5.10) shows only when `featuredBundle` is null **and** `visibleProducts` is empty.
- The **section header** (§5.5) shows only when `visibleProducts` is not empty.

### 5.5 Section header (margin-top 24)
- Row, `justifyContent: 'space-between'`, `alignItems: 'flex-end'`.
- **Start:** a column with title `t('store.collectionTitle')` (`typography.headlineSm`, `text`) and under it `t('store.collectionCount', { count: visibleProducts.length })` (`typography.bodySm`, `textSubtle`). **Both `textAlign: 'left'`** — this fixes the misaligned header in Arabic.
- **End:** `t('store.inStock')` in `typography.labelSm`, colour `textSubtle`. Show it only if every visible product has `stock > 0`.

### 5.6 Diffuser card(s) — full width (margin-top 8)
**One card per visible product with `product_type === 'diffuser'`.**
- **Card:** bg `surface`, radius **32**, padding **16**, gap **8**, shadow `{ opacity 0.03, radius 16, offset (0,4) }`.
- **Image:** full width, height **224**, radius **16**, `overflow: 'hidden'`, bg `surfaceMuted`. The source is the selected colourway's `image` (via `mediaUrl`), falling back to `main_image`; `resizeMode="cover"`.
- **Row** (`space-between`, `alignItems: 'flex-start'`):
  - name (`typography.headlineSm`, `text`, `flexShrink: 1`);
  - price `formatPrice(final_price)` (`typography.labelLg`, `weightFamily(isRTL,'semiBold')`, `primary`).
- **Subtitle:** `loc(p,'subtitle',lang)`, `typography.bodySm`, `textMuted`, `numberOfLines={2}`.
- **Bottom row** (`space-between`, `alignItems: 'center'`, margin-top 4):
  - **Colour dots** (row, gap 8), one per colourway: a 20×20 circle filled with `hex_code`. When selected: an outer 2pt ring in `primary` with a 2pt gap (wrap it in a 26×26 circle with `borderWidth: 2, borderColor: primary`). When not selected: `borderWidth: 1, borderColor: border`. Tap → select. **The default is the colourway with `is_default`, else the first.** `accessibilityLabel` = `loc(cw,'name',lang)`.
  - **Add button:** height **36**, `paddingHorizontal: 16`, radius 999, bg `accent`: icon `add` 16 in `text` + `t('store.add')` in `typography.labelMd`, colour `text`, gap 4. `onPress` → `addToCart(p.id, selectedColorway?.id)`. While `addingId === p.id`, show a small `ActivityIndicator` (colour `text`) instead of the icon, and disable the button.
- Tapping the card (outside the buttons) → `navigation.navigate('ProductDetail', { productId: p.slug })`.

### 5.7 Oils / accessories grid (margin-top 16)
**Visible products whose type is `oil` or `accessory`.** Two columns: a row with `flexWrap: 'wrap'`, `gap: 16`, each card `width: (screenWidth - 40 - 16) / 2` (use `useWindowDimensions`).
- **Card:** bg `surface`, radius **32**, padding **8**, shadow `{ opacity 0.03, radius 16, offset (0,4) }`, `justifyContent: 'space-between'`.
- **Image:** `width: '100%'`, `aspectRatio: 4/5`, radius **16**, `overflow: 'hidden'`, bg `surfaceMuted`, `main_image` cover.
- **Text block** (padding-top 4, gap 2, horizontal padding 4):
  - name: `typography.labelLg` with `weightFamily(isRTL,'semiBold')`, `text`, `numberOfLines={1}`;
  - capacity: `p.capacity` shown as "1000 مل" in Arabic ("1000 ml" in English); wrap the number with the LTR isolate; `typography.bodySm`, `textSubtle`;
  - notes: `${loc(n,'top_notes',lang)}` — only the top notes, one line — `typography.labelSm`, `textSubtle`, `numberOfLines={1}`. Hide the line if `scent_notes` is null.
- **Bottom row** (`space-between`, `alignItems: 'center'`, padding-top 8, horizontal padding 4):
  - price `formatPrice(final_price)` in `typography.labelMd`, `text`, `weightFamily(isRTL,'medium')`;
  - a 32×32 circle button, bg `surfaceMuted`, icon `add` 16 in `text` → `addToCart(p.id)`. Use the same spinner rule as §5.6.
- Tapping the card → `ProductDetail { productId: p.slug }`.

### 5.8 Benefits card (margin-top 24)
- bg `surfaceMuted`, radius **32**, padding **24**, gap **16**.
- **Each row:** a row with gap 16, `alignItems: 'flex-start'`:
  - a 40×40 circle, bg `surface`, icon 20 in `primary`;
  - a text column with the title (`typography.labelMd`, `weightFamily(isRTL,'medium')`, `text`) and the body (`typography.bodySm`, `textSubtle`), both `textAlign: 'left'`.
- **Rows**, from `config`:
  1. `local_shipping`: `benefitDeliveryTitle` with `amount = formatPrice(config.free_delivery_threshold)`; body `benefitDeliveryBody` with `fee = formatPrice(config.delivery_fee)`.
  2. `payments`: `benefitCodTitle` / `benefitCodBody` — **only if `config.cod_enabled`**.
  3. `water_drop`: `benefitWaterlessTitle` / `benefitWaterlessBody`.
  4. `verified_user`: `benefitWarrantyTitle` / `benefitWarrantyBody` — **only if `config.warranty_months` is a number.** Today it's `null`, so the row is hidden.

### 5.9 Wordmark (margin-top 32, centred)
`odora` in `typography.headlineSm`, colour `textSubtle`, `letterSpacing: 4`. It stays Latin in both languages, so wrap it in `LatinText` if that component exists. **Nothing under it** — no tagline.

### 5.10 States
- **`status === 'loading'`:** show skeletons in the same layout, using the `Skeleton` component:
  - a 48 pill;
  - a row of 4 chips (36 × 80);
  - a card 224 + 120 (radius 32);
  - two grid cards (aspect 4:5 + 60).
- **`status === 'error'`:** `EmptyState` with icon `cloud_off`, title `t('store.loadError')`, no description text, and action `t('store.retry')` → `loadStore()`.
- **A filter with no products:** `EmptyState`, icon `inventory_2`, title `t('store.emptyFilter')`.
- **Pull to refresh:** add a `RefreshControl` (colour `primary`) → `loadStore()`.
- **On mount:** `useEffect(() => { if (status === 'idle') loadStore(); }, [])`.

### 5.11 Toast after "Add"
Use the `Toast` component.
- **Success:** icon `check_circle`, message `t('store.addedToCart')`.
- **Failure:** message `t('store.addFailed')`.
- Duration 2000 ms. Position: top, 80pt below the safe area, centred (as in Stitch).
- If `Toast` can't be placed at the top, place it bottom **above the tab bar** (`bottom: 64 + insets.bottom + 16`). It must never cover the tab bar.

### 5.12 Must not remain in the file
The old hard-coded products; any `$`; "Sanctuary/الملاذ"; "Atelier"; "whisper"; "Chamber/حجرة"; "Warranty" text that isn't from config; inline `isRTL ? '…' : '…'` text; `fontWeight`; raw hex colours (the colourway `hex_code` from the backend is the only allowed colour value); `row-reverse`; `textAlign: isRTL ? …`.

---

## 6. Navigation types
In `app/src/navigation/types.ts` the entry is `ProductDetail: { productId?: string }`. Keep the name but pass the **slug** (`productId: p.slug`). `ProductDetailScreen` will be rebuilt to read it in task B2. For now, only check that tapping opens the screen without crashing.

---

## 7. Verify
From `/Users/zakaria/projects/antigravity/odora/app`, with the backend running (§2.4):

1. `npx tsc --noEmit` → exit 0, prints nothing.
2. Greps:
   ```bash
   grep -c "isRTL ? '" src/screens/StoreScreen.tsx     # 0
   grep -c "fontWeight" src/screens/StoreScreen.tsx    # 0
   grep -n '\$[0-9]\|USD\|Sanctuary\|الملاذ\|Atelier\|whisper\|Chamber\|حجرة' src/screens/StoreScreen.tsx   # nothing
   grep -n "#[0-9A-Fa-f]\{6\}" src/screens/StoreScreen.tsx   # nothing
   ```
3. Run the app:
   ```bash
   xcrun simctl boot "iPhone 17 Pro" 2>/dev/null; open -a Simulator
   npx expo start --dev-client --port 8081          # own terminal
   xcrun simctl openurl booted "com.odora.diffuser://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
   ```
4. Manual test (Arabic). Open the **المتجر** tab.
   | # | Action | Expected |
   |---|---|---|
   | 1 | Open the tab | App bar "أودورا · المتجر"; search pill; chips "الكل (4)", "أجهزة التعطير الذكية (1)", "الزيوت العطرية النقية (2)", "الباقات الحصرية (1)" |
   | 2 | Look at the bundle card | Real bundle photo; "380 د.ل" + struck-through "410 د.ل"; "وفّر 30 د.ل"; button "تسوّق الباقة ←" (the arrow points left in Arabic) |
   | 3 | Scroll | Header "منتجات أودورا · 3 منتجات" aligned to the right edge; the A316 card at "320 د.ل" with 3 colour dots; tapping a dot changes the photo |
   | 4 | Scroll | Two oil cards "زيت مريمية الغابة النقي" / "زيت ندى الكتان والقطن", "1000 مل", notes line, "45 د.ل" |
   | 5 | Tap "أضف" on A316 | Spinner, then toast "أُضيف إلى السلة"; the cart icon badge shows **1** |
   | 6 | Tap "+" on an oil | Badge **2** |
   | 7 | Kill the app (`xcrun simctl terminate booted com.odora.diffuser`) and reopen it | The badge is still **2** (session persisted) |
   | 8 | Tap the chip "الزيوت العطرية النقية (2)" | Only the 2 oil cards; the bundle and A316 are hidden; the count reads "2 منتجات" |
   | 9 | Scroll to the end | Benefits card: free delivery over "300 د.ل", fee "15 د.ل", cash on delivery, cold-air. **No warranty row.** "odora" wordmark. Nothing hidden under the tab bar |
   | 10 | Stop the backend (Ctrl-C) and pull to refresh | Error state "تعذّر تحميل المتجر" + "إعادة المحاولة"; start the backend and tap retry → the store loads |
   | 11 | Set `lang: 'en'` in `src/previewTarget.ts`, reload, repeat 1–4 and 9 | "LYD 380", English names, no Arabic anywhere, nothing cut or overlapping; then set `lang` back to `null` |
5. Screenshots, native only, into `/Users/zakaria/projects/antigravity/odora/reviews/qa-app-2026-09-26/`:
   `b1_ar_top.png`, `b1_ar_middle.png`, `b1_ar_end.png`, `b1_ar_after_add.png` (badge visible), `b1_ar_filter_oils.png`, `b1_ar_error.png`, `b1_en_top.png`, `b1_en_end.png`.
   Use `xcrun simctl io booted screenshot <path>`. Also save the Stitch reference next to them for comparison.
   **Open every PNG and check** the 7 points in rulebook §6 before you report.

## 8. Report and commit
1. Create `/Users/zakaria/projects/antigravity/odora/reviews/report-2026-09-26-b1-store.md`: one table, one row per test 1–11 plus tsc and the greps, with ✅/❌ and one line of evidence each. Write ❌ honestly.
2. Commit from the project root:
   ```bash
   git add backend app/src reviews/qa-app-2026-09-26 reviews/report-2026-09-26-b1-store.md
   git commit -m "feat(store): business config API, real catalog + cart data layer, Store tab rebuilt on live data"
   ```
   Make sure `backend/db.sqlite3` changes are **not** committed if the file is untracked or ignored. Check with `git status` before committing.

## 9. Rules for this task (from the rulebook)
- **Market:** Libya, prices in **LYD** via `formatPrice`, **never `$`**. Western digits, wrapped in `⁦…⁩`.
- **Never show:** sound or decibels, "quiet", coverage m², warranty (unless config has it), "sanctuary", "atelier", "chamber", "whisper".
- **All text through i18n.** Product text comes from the backend via `loc()`.
- **RTL:** plain `row`, `textAlign: 'left'`, `start`/`end`; LTR icon names (`arrow_forward`); no `row-reverse`; no `isRTL` for direction.
- **No `fontWeight`** — use `weightFamily()`. **No raw hex** except backend colourway `hex_code`.
- **Screens don't call `api` directly** — use `useShopStore`.
- **Proof = native simulator screenshots**, Arabic and English, which you check yourself.

## 10. Stop
Stop after the commit. Don't edit Product Detail, Cart, Checkout, Order Confirmation, Category or Search — the next tasks cover them one by one.
