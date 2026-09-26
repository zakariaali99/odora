# 09 — Rulebook for Antigravity (Odora mobile app)

**Read this whole file before every task.** It holds everything a reviewer checks. Every task message also repeats the rules that matter for that task. When something here conflicts with an older plan (`05`, `06`, `07`, `08`), this file wins, except that `05b` wins on sizes.

Project root: `/Users/zakaria/projects/antigravity/odora`. App: `app/` (Expo SDK 57, React Native 0.86, React 19, TypeScript 6). Design reference: `design-reference/stitch/idea-02/odora_<screen>/screen.png` (the picture) and `code.html` (exact sizes as Tailwind classes).

---

## 1. Product facts (never contradict these)
- **Device:** "Odora A316" aroma diffuser. It connects over **Bluetooth only** — no Wi-Fi, no gateway, no cloud control, no remote control from outside the house.
- **What the device can do:** power on/off; intensity 1–10, which the app turns into spray-on / pause seconds; interval mode (spray N s, pause M s, repeat) or continuous mode; weekly schedules stored on the device; a clock sync.
- **Unknown until the supplier confirms**, so they sit behind capability flags that **default OFF**: oil-level sensor (`oilSensor`), burst/boost (`burst`), fan (`fan`), LED (`led`). When a flag is OFF, the feature is **not shown at all**. The oil level is then an **estimate** and must always say "تقديري" / "Est.".
- **Never show or mention:** temperature, humidity, air quality, presence, LED/halo/night light, sound/decibels/"quiet"/"acoustic", firmware/OTA updates, BLE MAC, mesh, Wi-Fi, "chamber", "cartridge sensor", "sanctuary", "atelier", "circadian", "ritual", or UAE/USD.
- **Market:** Libya. Currency **LYD (د.ل)**, phone **+218**, work week **Sun–Thu**, weekend **Fri–Sat**. Digits are **Western 0–9 in both languages**.
- **Languages:** Arabic (default, RTL) and English (LTR). Every string exists in both.

## 2. Architecture (where code goes)
| Concern | Lives in | Never in |
|---|---|---|
| Device behaviour (state, timers, phase, timing, commands) | `app/src/device/` — `DeviceController.ts`, `transports/MockTransport.ts`; later `BleTransport.ts` | screens |
| Level → seconds table | `app/src/device/intensityMap.ts` (one table) | anywhere else |
| App data (devices list, rooms, routines, selected device, language) | `app/src/store/useAppStore.ts` (zustand) | component state |
| Every visible string | `app/src/i18n/ar.ts` + `en.ts`, used through `t('block.key')` | inline `isRTL ? 'ع' : 'e'` |
| Colours, fonts, sizes, radii, spacing, motion | `app/src/theme/*` tokens via `useTheme()` | raw hex or numbers in screens (except layout numbers taken from `05b`) |
| Reusable UI | `app/src/components/ui/` | copy-pasted per screen |

- Screens **read** state (controller subscription + store) and **call** actions. They never run timers or compute device logic.
- To read live device state in a screen:
  ```ts
  const controller = getDeviceController();
  const [deviceState, setDeviceState] = useState<DeviceState>(controller.getState());
  useEffect(() => controller.onStateChange(setDeviceState), [controller]);
  ```
- **Navigation:** a root stack contains `MainTabs` (4 tabs: Home · Devices · Store · Account) plus pushed screens. From a pushed screen to a tab, use `navigation.navigate('MainTabs', { screen: 'Home' })`. The tab bar shows **only** on the 4 tab roots and is hidden on pushed screens.
- `app/src/previewTarget.ts` must always be **committed** as `screen: null, lang: null`.

## 3. Design tokens (use the token name; hex shown for checking)
**Colours — light (dark in brackets):**
| Token | Light | Dark | Use |
|---|---|---|---|
| `bg` | #FDF9F5 | #111512 | screen background, **every** screen including pushed ones |
| `surface` | #FFFFFF | #181D19 | hero/white cards |
| `surfaceLow` | #F7F3EF | #202621 | alternate cards, inputs, search |
| `surfaceMuted` | #F1EDE9 | #202621 | chips (inactive), stepper buttons, tracks |
| `surfaceHigh` | #EBE7E4 | #323632 | secondary buttons |
| `text` | #1C1C19 | #F4F0EC | primary text |
| `textMuted` | #46483F | #C5C8C2 | secondary text, inactive tab |
| `textSubtle` | #76786E | #8F9287 | captions ≥ 11pt only |
| `primary` | #586244 | #BED4A6 | active chip fill, toggles on, progress fill, links, active tab |
| `primarySoft` | #919C7A | #A3B88C | gauge ring, slider fill, small progress |
| `accent` | #D5E6B2 | #374926 | soft badges ("نشط"), accent button fill |
| `ink` | #232821 | #F4F0EC | primary button fill, power button, floating pill |
| `onInk` / `onPrimary` | #FFFFFF | #111512 | text on ink / primary |
| `error` / `errorSoft` / `onError` | #BA1A1A / #FFDAD6 / #FFFFFF | — | destructive |
| `border` | rgba(35,40,33,.08) | — | hairlines only |

**Type (Latin uses Outfit for display/labels and Plus Jakarta Sans for body; Arabic uses IBM Plex Sans Arabic for everything):**
| Token | Size/line | Use |
|---|---|---|
| `display` | 26/34 | page greeting / page heading — the largest text on a normal screen |
| `titleLg` (`headlineMd`) | 22/30 | hero card title |
| `titleMd` (`headlineSm`) | 18/26 | app-bar title, section and card titles, stat values |
| `rowTitle` | 16/26 | list rows |
| `bodyMd` | 14/22 | long descriptions |
| `bodySm` | 12/18 (Arabic 12/20) | most small text, captions |
| `labelMd` | 12/16 | chip labels, small links, values |
| `labelSm` / eyebrow | 10/14 | eyebrows — **uppercase + tracking in English only** |
| `button` | 14/20 | all button labels |
| `gauge` | 36/40, light | gauge number only |

**Shapes and sizes:** screen margin **20**; section gap **24**; card padding **16 / 20 / 24** (compact / list / hero); card radius **32** (hero, default), **24** (stat tiles, curated card), **16** (small tiles, inputs, image frames); pill (999) for buttons, chips, toggles and inputs. Buttons: primary **56** (ink), compact **48**, secondary **48/40** (`surfaceHigh`). Chips **32–36** (inactive `surfaceMuted`, active `primary` + `onPrimary`). App-bar icon buttons **44×44**, transparent. Icons: Material Symbols Outlined, **20** default, 16 in meta rows, **24** in the tab bar. Toggle 48×28. Progress bars 4–8 high, pill. App bar 64 high; tab bar 64 + safe area.

**Shadows:** cards `0 4 16 rgba(35,40,33,.03)`; hero `0 16 36 rgba(35,40,33,.06)`; none on chips or inputs. No borders on cards.

**Motion:** press = scale 0.98 over 150 ms. Mist = 4.5 s loop, **only while `phase === 'spraying'`**. Status-dot pulse = 3 s. Respect Reduce Motion.

## 4. Arabic / RTL rules (the most common mistakes)
1. Native mirrors automatically (`I18nManager.forceRTL`). So **never** write `isRTL ? 'row-reverse' : 'row'`, `isRTL ? 'right' : 'left'` or `isRTL ? 'arrow_back' : 'arrow_forward'`. Use plain `row`, `textAlign: 'left'` (it means start), `marginStart`/`paddingEnd`/`start`/`end`, and the LTR icon name. All of these flip by themselves.
2. **Exception:** `TextInput` doesn't auto-align. Use `textAlign: I18nManager.isRTL ? 'right' : 'left'` plus `writingDirection`.
3. **Never set `fontWeight`** on text. Choose the weight with the family: `weightFamily(isRTL, 'regular' | 'medium' | 'semiBold' | 'bold')` from `theme/typography.ts`. `fontWeight` on Arabic makes iOS fall back to a system font with spaced letters.
4. No `letterSpacing` and no `textTransform: 'uppercase'` on Arabic. English eyebrows may use them; tab labels and titles use sentence case.
5. **Numbers inside Arabic text:** Western digits, wrapped in an LTR isolate `⁦…⁩` — for example `الزيت ⁦68%⁩`. Never build mixed strings by concatenation; use i18n placeholders (`'الزيت {{percent}}'`).
6. One Arabic word per concept: interval = **فترات**, continuous = **مستمر**, scent history = **سجل العطور**, pair = **إقران**, estimated = **تقديري**.
7. Every row must be checked in **both** languages. English text is longer: use `numberOfLines`, `flexShrink: 1`, and `flexShrink: 0` on chips, so nothing collides or gets cut.

## 5. Screen building method (image-to-image)
1. Open the target `screen.png` and `code.html`. List its sections top to bottom.
2. Build the same sections in the same order, with the same component types and image positions. Take the sizes from the Tailwind classes (`w-48` = 192, `p-6` = 24, `rounded-2xl` = 16, `rounded-[2rem]` = 32, `gap-4` = 16, …) or from §3.
3. Replace fake content with real data or config. Remove banned features (§1) **but keep the slot**, filling it with the real equivalent:
   - temp/humidity row → connection · signal · sync;
   - acoustics tile → next routine;
   - firmware → nothing.
4. Build states for each screen: loading (skeleton), empty, error/disconnected, and a long-text English version.

## 6. How to run and verify (every task)
From `/Users/zakaria/projects/antigravity/odora/app`:
```bash
npx tsc --noEmit                                   # must exit 0, print nothing
xcrun simctl boot "iPhone 17 Pro" 2>/dev/null; open -a Simulator
npx expo start --dev-client --port 8081            # keep running in its own terminal
xcrun simctl openurl booted "com.odora.diffuser://expo-development-client/?url=http%3A%2F%2Flocalhost%3A8081"
xcrun simctl io booted screenshot ../reviews/qa-app-<date>/<name>.png
```
- A red "No script URL provided" screen means Metro isn't running.
- To test English, set `previewConfig.lang = 'en'` in `app/src/previewTarget.ts`, restart the app, then set it back to `null` before you commit.
- **Proof = native simulator screenshots, not web.** Test Arabic **and** English, scrolled to the top **and** to the end.
- **Before writing ✅, open every PNG and check:**
  1. no red/yellow error toast;
  2. no text touching or under another element or image;
  3. nothing cut at card edges or hidden behind the tab bar or floating pill;
  4. arrows and the back chevron point the right way;
  5. the tab bar is visible only on tab roots;
  6. no English in the Arabic screens and no Arabic in the English screens;
  7. numbers read correctly ("68%", not "%68").
- Report with ✅/❌ per item, honestly. Commit with the exact message the task gives. Then stop.
