# Odora — خطة التنفيذ (Implementation Plan)

> **الغرض:** خطة عملية جاهزة للبناء في **Antigravity**. تُقرأ بعد [mostafa-diffuser-app.md](mostafa-diffuser-app.md) (الـ spec/الفهم).
> **آخر تحديث:** 2026-09-08 · **العلامة:** Odora · **مجلّد المشروع:** `/Users/zakaria/projects/antigravity/odora`
> **طريقة العمل:** نخطّط هنا → Antigravity يبني → نراجع هنا بعد كل Milestone.

---

## 0) المبادئ الحاكمة (اقرأها أولاً)
1. **BLE هو التركيز الأساسي.** WiFi المباشر ثانوي. التحكّم عن بُعد السحابي مرحلة لاحقة.
2. **كل تحكّم يمرّ عبر `DeviceController` مجرّد** (نقل قابل للتبديل — §4). الـ UI لا يعرف النقل.
3. **التصميم من `design-reference/test.pdf` هو المصدر المُعتمد.** التزم بألوانه وخطوطه وشاشاته. لا تخترع هوية.
4. **أعِد استخدام backend متجر الويب** (Django+DRF+JWT) للمتجر والحساب — لا تبنِ نظاماً جديداً.
5. **الجدولة تُكتب على الجهاز** لينفّذها والتطبيق مغلق (يحلّ قيود iOS الخلفية).
6. **عربي RTL + إنجليزي** من اليوم الأول.
7. راجِع مع المالك بعد كل Milestone قبل الانتقال.

---

## 1) العلامة والتصميم
- **الاسم:** Odora.
- **مرجع التصميم:** `/Users/zakaria/projects/antigravity/odora/design-reference/test.pdf`
  - لوحة Adobe Illustrator، صفحة واحدة، ~11 صورة/شاشة UI.
  - **مهمة أولى لـ Antigravity:** افتح الـ PDF، استخرج **الألوان (hex)، الخطوط، المسافات، ومكوّنات الشاشات**، وابنِ منها **design tokens** (theme) قبل أي شاشة.
  - أي أصول إضافية (لوجو، أيقونات) تُطلب من المالك وتوضع في `assets/`.

---

## 2) Stack التقني (قرارات نهائية)
| الطبقة | الاختيار | السبب |
|---|---|---|
| **الموبايل** | **React Native + Expo (Dev Client + EAS)** | منصّتان من كود واحد، يعيد استخدام معرفة React، OTA للسرعة |
| **BLE** | **`react-native-ble-plx`** (+ Expo config plugin) | الأنضج؛ يحتاج dev client (ليس Expo Go) |
| **الحالة** | **Zustand** (اتساقاً مع متجر الويب) + React Query لبيانات السيرفر | |
| **التنقّل** | React Navigation | |
| **i18n/RTL** | i18next + `I18nManager` | عربي/إنجليزي |
| **Backend** | **Django 4.2 + DRF + JWT الموجود** (متجر العطور) | إعادة استخدام المتجر/الحساب |
| **WiFi transport** | HTTP/TCP محلي (يُؤكَّد من الجهاز في Phase 0) | نقل محلي ثانٍ |
| **التخزين المحلي** | MMKV / AsyncStorage | تفضيلات + كاش الأجهزة |

> **ملاحظة Expo:** BLE يحتاج **native module** → استخدم **Expo Dev Client** (`expo prebuild` + EAS build)، وليس Expo Go.

---

## 3) بنية المشروع (Monorepo مقترح)
```
odora/
├── design-reference/        # test.pdf (موجود) — مصدر التصميم
├── app/                     # React Native (Expo)
│   ├── src/
│   │   ├── theme/           # design tokens من الـ PDF
│   │   ├── i18n/            # ar / en
│   │   ├── navigation/
│   │   ├── screens/         # مطابقة لشاشات الـ PDF
│   │   ├── components/
│   │   ├── device/          # ★ طبقة الاتصال (القلب)
│   │   │   ├── DeviceController.ts   # الواجهة المجرّدة
│   │   │   ├── transports/
│   │   │   │   ├── BleTransport.ts   # أساسي — Aroma-Link عبر BLE
│   │   │   │   ├── WifiTransport.ts  # ثانوي — HTTP/TCP محلي
│   │   │   │   └── CloudTransport.ts # لاحقاً — Aroma-Link cloud
│   │   │   ├── aromalink/            # ترميز/فكّ بروتوكول Aroma-Link
│   │   │   └── types.ts
│   │   ├── store/           # Zustand
│   │   └── api/             # عملاء REST لمتجر Django
├── backend/                 # (مرجع) متجر Django الموجود — إعادة استخدام
└── docs/
    ├── mostafa-diffuser-app.md      # الـ spec (منسوخ)
    └── odora-implementation-plan.md # هذا الملف (منسوخ)
```

---

## 4) ★ طبقة الاتصال (Connection Layer) — القلب

### 4.1 الواجهة الموحّدة
```ts
interface DeviceController {
  connect(device: DeviceRef): Promise<void>;
  disconnect(): Promise<void>;
  setPower(on: boolean): Promise<void>;
  setIntensity(level: number): Promise<void>;      // 0..10
  setSpray(onSec: number, offSec: number): Promise<void>;
  setSchedule(schedule: Schedule): Promise<void>;   // يُكتب على الجهاز
  readOilLevel(): Promise<number>;
  onStateChange(cb: (s: DeviceState) => void): Unsub;
}
```
- **BleTransport (أساسي)** و **WifiTransport (ثانوي)** ينفّذان نفس الواجهة.
- **اختيار النقل:** BLE عند التوفّر، ثم WiFi المحلي. `CloudTransport` يُضاف لاحقاً بلا لمس الـ UI.

### 4.2 بروتوكول Aroma-Link
- **المرجع:** `mr-sparks/scent-assistant` (`PROTOCOL.md`) + `Memberapple/ha_aromalink`.
- **الأوامر المنطقية:** on/off · شدّة (0–10) · مدة الرش (on/off ثوانٍ) · جدولة (أيام/نوافذ) · قراءة مستوى الزيت · قراءة الحالة.
- **مهمة Antigravity:** انقل ترميز الأوامر من `PROTOCOL.md` إلى `aromalink/` كوحدة نقية (pure encode/decode) قابلة للاختبار بمعزل عن BLE.
- **BLE mechanics:** اكتشف service/characteristic UUIDs من الوحدة الفعلية (Phase 0)، اكتب الأوامر على الـ characteristic، واشترك في الإشعارات (notify) للحالة/مستوى الزيت.

### 4.3 أذونات
- **Android 12+:** `BLUETOOTH_SCAN`, `BLUETOOTH_CONNECT`؛ **≤11:** `ACCESS_FINE_LOCATION`. + `INTERNET`, `POST_NOTIFICATIONS` (13+).
- **iOS:** `NSBluetoothAlwaysUsageDescription` في Info.plist. تحكّم foreground يعمل عادي؛ لا نعتمد على BLE خلفي (الجدولة على الجهاز).

---

## 5) Backend (إعادة استخدام + إضافات صغيرة للـ MVP)
- **MVP لا يحتاج backend للتحكّم** (BLE محلي مباشر). يُستخدم backend فقط لـ:
  - **الحساب/الدخول** (JWT الموجود).
  - **المتجر** (منتجات/سلة/طلبات — endpoints موجودة).
- **إضافة صغيرة اختيارية:** حفظ قائمة أجهزة المستخدم وتسمياتها سحابياً للمزامنة بين أجهزته (يمكن تأجيلها — تبدأ محلية MMKV).
- **مراحل لاحقة** (لا الآن): device registry، multi-tenant، cloud transport، telemetry (§ الـ spec).

---

## 6) الشاشات (تُطابَق مع الـ PDF)
> القائمة مبدئية — **الـ PDF هو الحاكم**؛ عدّل الأسماء/التدفّق حسبه.
1. **Splash / Onboarding** (هوية Odora).
2. **الدخول/الحساب** (JWT).
3. **أجهزتي (Devices):** قائمة، حالة كل جهاز، إضافة جهاز.
4. **إضافة جهاز:** مسح BLE، اقتران، تسمية، (WiFi كخيار).
5. **شاشة الجهاز:** on/off، شدّة، مدة الرش، مستوى الزيت، حالة حيّة.
6. **الجدولة:** أيام/نوافذ عمل → تُكتب على الجهاز.
7. **المتجر:** تصفّح، تفاصيل منتج، سلة، checkout، تتبّع.
8. **إعادة الطلب** من شاشة الجهاز (زيت منخفض → المتجر).
9. **الإعدادات:** اللغة (ar/en)، الحساب، حول.

---

## 7) Milestones (مع Definition of Done)

### M0 — Bootstrap (الأساس)
- Expo + Dev Client + EAS، بنية المجلّدات، React Navigation، i18n RTL/EN، **design tokens من الـ PDF**.
- **DoD:** التطبيق يقلع على أندرويد (dev client)، يبدّل ar/en، ثيم Odora مطبّق.

### M1 — BLE أساسي (★ الأهم)
- `DeviceController` + `BleTransport` + وحدة `aromalink`. مسح، اقتران، **on/off**.
- **DoD:** من التطبيق، أشغّل/أطفئ وحدة A316 حقيقية عبر BLE.

### M2 — BLE تحكّم كامل
- شدّة (0–10)، مدة الرش، **كتابة الجدولة على الجهاز**، قراءة مستوى الزيت، حالة حيّة (notify).
- **DoD:** كل الأوامر تعمل على جهاز حقيقي؛ الجدولة تنفّذ والتطبيق مغلق.

### M3 — إدارة الأجهزة (UI)
- عدّة أجهزة، تسمية، شاشة جهاز مطابقة للـ PDF، تخزين محلي (MMKV).
- **DoD:** إدارة ≥2 جهاز والتنقّل بينها بسلاسة.

### M4 — WiFi transport (ثانوي)
- `WifiTransport` خلف نفس `DeviceController` (بعد تأكيد WiFi API للجهاز في Phase 0).
- **DoD:** نفس الأوامر تعمل عبر WiFi المحلي؛ التطبيق يختار النقل تلقائياً.

### M5 — تكامل المتجر
- ربط REST بمتجر Django الموجود: تصفّح/سلة/checkout/تتبّع + **إعادة الطلب من شاشة الجهاز**.
- **DoD:** طلب حقيقي يكتمل من داخل التطبيق.

### M6 — صقل وإطلاق
- تلميع RTL/EN، إشعارات (زيت منخفض/حالة الطلب)، **إصدار أندرويد** (APK/Play داخلي) + **iOS TestFlight**.
- **DoD:** بناء قابل للتوزيع على المنصّتين؛ مراجعة المالك.

### مراحل لاحقة (خارج هذا الـ plan)
- `CloudTransport` (تحكّم عن بُعد عبر Aroma-Link cloud) · multi-tenant + RBAC · telemetry/analytics · white-label config للموزّعين. (تفاصيلها في الـ spec.)

---

## 8) إعداد البيئة (لـ Antigravity)
```bash
# داخل odora/app
npx create-expo-app@latest . --template
npx expo install react-native-ble-plx
npx expo install react-native-mmkv zustand @react-navigation/native i18next react-i18next
# BLE يحتاج dev client:
npx expo prebuild
# بناء dev client عبر EAS (أو محلياً)
eas build --profile development --platform android
```
- **iOS:** يتطلب حساب Apple Developer ($99/سنة) للأجهزة الحقيقية/TestFlight — يُحسم مع المالك (§ الأسئلة في الـ spec).
- **أجهزة الاختبار:** وحدة A316 حقيقية ضرورية من **M1**.

---

## 9) الاختبار
- **وحدة `aromalink`:** اختبارات نقية encode/decode (بلا جهاز).
- **BLE:** اختبار يدوي موجّه على جهاز حقيقي لكل Milestone (لا يمكن محاكاته جيّداً).
- **المتجر:** اختبار تدفّق الطلب مقابل الـ backend الموجود.
- **RTL:** تدقيق بصري عربي/إنجليزي لكل شاشة.

---

## 10) نقاط تحقّق قبل البدء (Phase 0 التقنية)
هذه تُحسم على **وحدة حقيقية** قبل/أثناء M1 — راجع §14 في الـ spec:
1. BLE service/characteristic UUIDs لوحدة A316، ونسخة firmware.
2. هل `PROTOCOL.md` من scent-assistant يطابق وحدته فعلاً؟
3. هل الجهاز يخزّن الجدولة داخلياً وينفّذها منفصلاً؟
4. قراءة مستوى الزيت دقيقة للتنبيهات؟
5. (لـ M4) هل الجهاز يكشف WiFi API محلي؟ وما شكله (HTTP/TCP)؟

---

## 11) قواعد لـ Antigravity
- ابدأ بفتح `design-reference/test.pdf` واشتقّ الـ theme منه **قبل** بناء الشاشات.
- اجعل `device/` نقية وقابلة للاختبار؛ لا تسرّب تفاصيل BLE إلى الـ UI.
- التزم بترتيب الـ Milestones؛ **قف بعد كل واحد** لمراجعة المالك.
- لا تخترع أوامر بروتوكول — انقلها من `PROTOCOL.md` / `ha_aromalink` وأشِر للمصدر في الكود.
- سجّل أي انحراف عن هذه الخطة في `docs/` مع السبب.
