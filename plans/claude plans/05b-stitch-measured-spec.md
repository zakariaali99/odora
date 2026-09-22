# 05b — Stitch Measured Spec (authoritative sizes)

**Why this file exists:** the owner reviewed Phase 1 and said the app "does not look even close" to the Stitch design. Root cause: `05-app-design-system.md` gave a type scale and component sizes that are **larger and heavier** than the real Stitch screens. These numbers were measured from the rendered Stitch HTML (`getComputedStyle`, 390pt-wide viewport) across 16 Idea-02 screens.

**Rule:** where this file and `05` disagree, **this file wins**. Colors in `05 §2` stay valid.

Reference images for every screen: `design-reference/stitch/idea-02/odora_<screen>/screen.png`.

---

## 1. Layout frame (every screen)
| Item | Value |
|---|---|
| Design width | 390pt |
| Horizontal screen margin | **20** (content width 350) |
| Top app bar | **64** high, background `bg` at **85%** + blur 24, no border, no shadow |
| Content top padding | = app bar height (content scrolls under the bar) |
| Content bottom padding | **112** on tab screens, **24 + sticky bar height** on screens with a sticky CTA |
| Gap between sections | **24** (default) · **16** inside a group · **40** before a major new block |
| Card inner padding | **16** (compact rows) · **20** (list cards) · **24** (hero/control cards) |

## 2. Typography (real usage, ranked by frequency)
| Token | Font | Size / Line | Weight | Tracking | Case | Use |
|---|---|---|---|---|---|---|
| `bodySm` | Plus Jakarta Sans | **12 / 18** | 400 | 0.02em | — | **Most common text**: subtitles, meta, descriptions in cards |
| `eyebrow` | Outfit | **10 / 14** | 600 | 0.05–0.14em | UPPERCASE (not in Arabic) | Section/card eyebrows: "AROMA DISPERSION", "PRIMARY CHAMBER" |
| `meta` | Outfit | **12 / 16** | 500 | 0.08em | — | Values, chip labels, small links ("60% · Level 6") |
| `titleMd` | Outfit | **18 / 26** | 500 | 0.01em | — | Section titles, card titles, **screen title in app bar** |
| `button` | Outfit | **14 / 20** | 600 | 0.04em | — | All button labels |
| `titleLg` | Outfit | **22 / 30** | 500 | 0 | — | Hero card title ("Living Room Diffuser") |
| `display` | Outfit | **26 / 34** | 500 | -0.025em | — | Greeting / page heading ("Good evening, …") — **largest text on a normal screen** |
| `bodyMd` | Plus Jakarta Sans | **14 / 22** | 400 | 0.015em | — | Longer descriptions (product copy) |
| `rowTitle` | Plus Jakarta Sans | **16 / 26** | 500 | 0.01em | — | List/menu row titles |
| `item` | Outfit | **16 / 22** | 400–500 | 0.01em | — | Product names, notification titles |
| `stat` | Outfit | **18 / 26** | 600 | 0.01em | — | Stat values ("68%", "Evening") |
| `gauge` | Outfit | **36 / 40** | **300** | -0.02em | — | Gauge number only |
| `tag` | Outfit | **10 / 14** | 600 | 0.14em | UPPERCASE | Badges on images ("BEST SELLER", "NEW") |

Nothing on a normal screen is bigger than 26pt except the gauge number (36, light weight). Remove the 36/56 display sizes from screens.

Text colors in use: primary `#1C1C19`, secondary `#46483F`, tertiary `#5B6057`, accent/active `#586244`.

## 3. Components — exact specs
| Component | Spec (height · radius · fill · text · shadow) |
|---|---|
| **Card (default)** | radius **32** · fill `#FFFFFF` **or** `#F7F3EF` (alternate to separate sections) · **no border** · shadow `0 1 2 rgba(0,0,0,.05)` or `0 4 16 rgba(35,40,33,.03)` · padding 16/20/24 |
| **Hero card** (home device, device-control gauge) | radius **32** · `#FFFFFF` · padding **24** · shadow `0 16 36 -12 rgba(35,40,33,.06)` |
| **Small card / tile** (product feature boxes, colorway options, thumbnails) | radius **16** · `#F7F3EF` or `#F1EDE9` · padding 12–16 |
| **Primary button** | **56** · pill · fill `#1C1C19` (ink) · text `#FDF9F5` · `button` style · shadow `0 4 6 -1 rgba(0,0,0,.10)` · full width (350) or with trailing price/arrow |
| **Primary button, compact** | **48** · pill · same colors (e.g. "Add to Bag", "Live track") |
| **Secondary button** | **48 / 40** · pill · fill `#EBE7E4` or `#F1EDE9` · text `#1C1C19` · no shadow |
| **Filled accent button** | **40** · pill · fill `#586244` · text white · `button` style (e.g. "Reorder all") |
| **Chip** | **32** (filters) or **36** (category tabs) · pill · padding 8/16 · inactive `#F1EDE9` + `#1C1C19` · **active = `#586244` fill + white text** · `meta` style |
| **Icon button (app bar)** | **44×44** · **transparent** · icon 22–24 |
| **Icon button (on card / stepper)** | **44** stepper · 40 power · **32** add / favorite · pill · fill `#F1EDE9` or frosted `rgba(253,249,245,.85)` |
| **Toggle** | 48×28 pill · on `#586244` · thumb white |
| **Search input** | **48** · pill · fill `#F7F3EF` · **no border** · leading icon inset 16, text inset 48 · text 14 |
| **Form input** | **48** · radius 16 · fill `#F7F3EF` · no border · focus ring `#919C7A` 2pt |
| **Segmented / weekday dots** | day dots **36** circles; active `#586244` + white |
| **Slider** | track **8** high, pill, `#F1EDE9`; fill `#919C7A`; thumb 24 white + soft shadow |
| **Intensity gauge** | box **224**, ring radius **82**, stroke **8**, track `#919C7A` @20%, fill `#919C7A`; number `gauge` style; − / + buttons **44** `#F1EDE9` either side |
| **Progress bar** | 6–8 high pill, track `#E6E2DE`, fill `#586244` |
| **Bottom tab bar** | **64** high (+ safe area) · fill `#F7F3EF` @ **90%** + blur 24 · no top border · 4 items, each **56×56**, icon **24**, label `eyebrow` style under icon; **active = `#586244`**, inactive `#46483F`; active icon uses filled variant (FILL 1) |
| **Badge on image** | `tag` style · pill · padding 4/10 · fill `#D5E6B2` or ink |
| **Status dot** | 8 circle `#8FB27A` with pulse |

Icons: Material Symbols Outlined, sizes in use **20** (most), 16, 18, 22; **24** only in the tab bar. Active/selected icons use FILL 1.

## 4. Imagery
- Images are **rectangular inside a rounded container** (container clips at 16 or 32). Never round the image itself separately.
- Store grid product image: **151×189 (4:5)** inside a white card radius 32, padding 8.
- Product detail hero: **350×438 (4:5)**, radius 16 container; thumbnails **64×64** radius 16.
- Device on Device Control: **176×208** product cut-out centered in the hero card; soft circular glow behind it (`#D8E9B5` @ 40%, 192 diameter) with the mist animation above.
- Devices list thumbnail: **80×96**.
- Horizontal "my devices" cards on Home: **256×130**, radius 32, padding 16.

## 5. Screen blueprints (top → bottom)
**Home** — app bar (title 18/500, bell 44) · status pill (dot + "Living room · Optimal", `eyebrow`) · greeting `display` + `bodySm` subtitle · **hero device card** (eyebrow, `titleLg` name, status line, power button 56 ink circle top-end; device image 192 on glow; scent chip; "AROMA DISPERSION" row with progress + 3 labels) · **3 stat tiles** in a row (each ~110 wide, radius 24–32, `eyebrow` label + icon, `stat` value, `bodySm` caption, 4pt progress) · section title "My devices" + "Manage (3)" link · horizontal device cards 256×130 · curated scent card (`#F7F3EF`, image on the end side) · tab bar.

**Device Control** — app bar (back, title, more) · status row (dot + "Connected · Living room", badge "ACTIVE") · **device card** (`#F7F3EF`, radius 32, device image 176×208 on glow, mist) · **gauge card** (white hero: eyebrow "MIST INTENSITY" + mode badge; gauge 224 with −/+; preset chips row; footer meta row) · mode segmented (Continuous / Interval) · **oil card** (white, radius 32, padding 20: scent thumbnail 56 round, name, % in `stat`, progress, "~N days left · Estimated", two buttons 48: Reorder oil (accent fill) + Schedule (secondary)) · schedule row card · floating status pill **56**, ink, full width 350, bottom 24.

**Store** — app bar · search 48 · category chips 36 · featured bundle card (radius 32, image 350×224, text block padding 24, price + old price, primary compact button) · section title · product grid 2 columns, gap 16, cards 167×307 (image 151×189) · tab bar.

**Product Detail** — app bar (back, share, cart with count badge) · hero 350×438 · thumbnails row 64 · eyebrow + rating row · name `display` 26 · price 22/500 + delivery badge · description `bodyMd` · colorway tiles (3 × ~111×68, radius 16, selected = accent fill + check) · starter-oil card (`#F7F3EF`, radius 16, padding 16) · feature cards (radius 16) · sticky bottom bar: stepper 44 + primary compact 48 with price.

**Checkout** — step indicator (3 steps, 10/600 eyebrow labels) · cards radius 32 padding 24, gap 24: Address · Delivery options (radio rows radius 16 `#F7F3EF`) · Payment (radio rows; COD default with badge) · Subscribe & save card (`#F1EDE9`) · Order summary · sticky primary 56 "Place order · total".

## 6. Motion (from Stitch code)
- Mist: `translateY 0 → -7`, `scale .96 → 1.05`, opacity `.35 → .65`, **4.5s** ease-in-out infinite.
- Pulse (status dot, pairing radar): scale 1 → 1.05, opacity .9 → 1, **3s**.
- Skeleton shimmer: 2.2s sweep, highlight `rgba(255,255,255,.55)` → `rgba(220,231,193,.35)`.
