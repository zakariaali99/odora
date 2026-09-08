# Odora — خطة التنفيذ (Implementation Plan)

> **الغرض:** خطة عملية جاهزة للبناء في **Antigravity**. تُقرأ بعد [mostafa-diffuser-app.md](mostafa-diffuser-app.md) (الـ spec/الفهم).
> **آخر تحديث:** 2026-09-08 · **العلامة:** Odora · **مجلّد المشروع:** `/Users/zakaria/projects/antigravity/odora`
> **طريقة العمل:** نخطّط هنا → Antigravity يبني → نراجع هنا بعد كل Milestone.

---

## ⭐ ابدأ من هنا (What You Must Do First)

> **الوضع:** غير مؤكّد إن كان مصطفى اشترى الأجهزة. **لا تبنِ على افتراض وجود جهاز.** المفتاح: **معظم التطبيق يُبنى بلا جهاز** خلف الطبقة المجرّدة عبر **MockTransport** (§4). الجهاز يلزم فقط لمرحلة BLE الحقيقية.

**أولوياتك أنت (المالك) — بالترتيب:**
1. **اسأل مصطفى سؤالين حاسمين فوراً:** (أ) هل اشترى الأجهزة؟ أي موديل؟ **BLE أم WiFi؟** (ب) هل التصميم في `test.pdf` نهائي، وأين اللوجو/الأصول؟
2. **دبّر وحدة واحدة حقيقية** في أقرب وقت — لكن **لا تنتظرها لتبدأ**؛ تلزم فقط من M4.
3. **ابدأ البناء المستقل عن الجهاز الآن** (M0→M3): bootstrap + تصميم + كل الشاشات والتدفّقات على **MockTransport** + تكامل المتجر. هذا ~٧٠٪ من التطبيق **بلا جهاز ولا مخاطرة.**
4. **الأسئلة التجارية** (خطة مصطفى، B2B؟، الميزانية) من §14 في الـ spec — تحسم النطاق والسعر لاحقاً، لا تعطّل البدء.
5. **التحكّم عن بُعد السحابي:** لا تقربه الآن — موصوف في [odora-cloud-path.md](odora-cloud-path.md) وهو **موقوف حتى تأمر أنت.**

**القاعدة الذهبية:** كل ما لا يحتاج جهازاً يُبنى أولاً. لا شيء في مسارك الحرج يتوقّف على شراء مصطفى للجهاز.

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
│   │   │   │   ├── MockTransport.ts  # ★ للبناء بلا جهاز (يبدأ به)
│   │   │   │   ├── BleTransport.ts   # أساسي — Aroma-Link عبر BLE (يحتاج جهاز)
│   │   │   │   ├── WifiTransport.ts  # ثانوي — HTTP/TCP محلي
│   │   │   │   └── CloudTransport.ts # ⛔ موقوف — لا يُنفَّذ إلا بأمر المالك
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
- **MockTransport** ينفّذ الواجهة **بلا جهاز** (يحاكي الحالة/مستوى الزيت) → يُبنى به كل الـ UI والتدفّقات أولاً.
- **BleTransport (أساسي)** و **WifiTransport (ثانوي)** ينفّذان نفس الواجهة (يحتاجان جهازاً حقيقياً).
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
> 🟢 = بلا جهاز · 🔵 = يحتاج جهازاً حقيقياً. **ابنِ كل الأخضر أولاً.**

### 🟢 M0 — Bootstrap
- Expo + Dev Client + EAS، بنية المجلّدات، React Navigation، i18n RTL/EN.
- **DoD:** يقلع على أندرويد، يبدّل ar/en.

### 🟢 M1 — التصميم من الـ PDF
- افتح `design-reference/test.pdf`، اشتقّ **design tokens** (ألوان/خطوط/مسافات)، ابنِ الثيم والمكوّنات الأساسية.
- **DoD:** ثيم Odora مطبّق ومكوّنات UI جاهزة مطابقة للـ PDF.

### 🟢 M2 — التطبيق كامل على MockTransport (★ أكبر مكسب آمن)
- كل الشاشات والتدفّقات (أجهزتي، إضافة جهاز، شاشة الجهاز، on/off/شدّة/رش/جدولة، مستوى زيت) تعمل على **MockTransport** — بلا جهاز.
- **DoD:** تجربة كاملة قابلة للعرض (demo) بلا أي هاردوير؛ الـ UI مفصول تماماً عن النقل.

### 🟢 M3 — تكامل المتجر
- ربط REST بمتجر Django الموجود: تصفّح/سلة/checkout/تتبّع + إعادة الطلب من شاشة الجهاز.
- **DoD:** طلب حقيقي يكتمل من داخل التطبيق (لا يحتاج جهاز عطور).

> **— نقطة الفصل: ما فوق لا يحتاج جهازاً. ما تحت يبدأ عند توفّر وحدة حقيقية. —**

### 🔵 M4 — BLE أساسي (يحتاج جهاز)
- `BleTransport` + وحدة `aromalink`: مسح، اقتران، **on/off** على وحدة حقيقية.
- **DoD:** أشغّل/أطفئ A316 فعلية من التطبيق. (الـ UI جاهز من M2 — نبدّل Mock بـ BLE فقط.)

### 🔵 M5 — BLE تحكّم كامل
- شدّة (0–10)، مدة الرش، **كتابة الجدولة على الجهاز**، قراءة مستوى الزيت، حالة حيّة (notify).
- **DoD:** كل الأوامر على جهاز حقيقي؛ الجدولة تنفّذ والتطبيق مغلق.

### 🔵 M6 — WiFi transport (ثانوي)
- `WifiTransport` خلف نفس `DeviceController` (بعد تأكيد WiFi API للجهاز، §10).
- **DoD:** نفس الأوامر عبر WiFi المحلي؛ اختيار النقل تلقائي.

### 🟢/🔵 M7 — صقل وإطلاق
- تلميع RTL/EN، إشعارات، **إصدار أندرويد** + **iOS TestFlight**.
- **DoD:** بناء قابل للتوزيع على المنصّتين؛ مراجعة المالك.

### ⛔ مراحل موقوفة (لا تُنفَّذ إلا بأمر المالك)
- **التحكّم عن بُعد السحابي** (`CloudTransport` + VPS) → [odora-cloud-path.md](odora-cloud-path.md).
- multi-tenant + RBAC · telemetry/analytics · white-label config للموزّعين. (تفاصيلها في الـ spec.)

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
- **⛔ لا تنفّذ مسار السحابة/التحكّم عن بُعد (`CloudTransport`, VPS, Aroma-Link cloud) إطلاقاً** حتى يأمر المالك صراحةً. موصوف في [odora-cloud-path.md](odora-cloud-path.md) **للتخطيط فقط**. اترك `CloudTransport.ts` غير مُنفَّذ (stub) حتى ذلك.
- **⛔ لا تفترض وجود جهاز.** المسار الحرج يبقى على MockTransport حتى تتوفّر وحدة حقيقية.
