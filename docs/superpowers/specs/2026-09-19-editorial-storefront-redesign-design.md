# Odora Editorial Storefront Redesign

## Job and audience

Odora's customer-facing web store must make a Libyan home, hospitality, or workplace buyer perceive the diffuser as a considered interior object before presenting it as a connected appliance. The surface is a persuasive storefront: its first job is to create desire and trust, and its second is to make the path from discovery to checkout effortless in Arabic and English.

## Outcome and proof

- The first viewport communicates quiet luxury, natural materiality, and the A316's place in a designed room within seconds.
- Existing product photography, specifications, customer proof, delivery information, and working commerce flows substantiate the positioning.
- The visitor can move from the homepage to a product, add it to the cart, and check out without learning new interaction patterns.

## Selected direction

The visual world is **Odora Still Life**: an editorial interior-design catalogue built from warm mineral canvas, dusty sage, deep olive, near-black ink, stone surfaces, and slow ambient mist. The signature is one large photographic product tableau per key surface, with interface chrome kept quiet around it.

The homepage opens with a restrained split composition: decisive editorial copy and one lifestyle image using the existing brand photography. Product proof sits in a calm text rail rather than a cluster of badges. Subsequent sections alternate image-led editorial moments with sparse commerce grids so the scroll has rhythm instead of repeating cards.

## Design system

- Canvas: `#F4F0EC`; surface: `#FBFAF7`; sage: `#919C7A`; pale green: `#E1F2BD`; olive: `#464F39`; ink: `#2B2B26`; muted ink: `#747468`; dark control: `#1C1C1A`.
- English display/body: Poppins with light display weights and regular body weights. Arabic: Tajawal with matching weight contrast. Utility data uses tabular numerals, not monospace decoration.
- Corners echo the diffuser silhouette: 18-28px on major surfaces and fully rounded primary actions. Borders are rare; tonal separation and restrained offset shadows create depth.
- One authored motion motif: mist rises slowly from the hero product. All other motion is functional, short, and disabled through `prefers-reduced-motion`.

## Scope

### In scope

- Shared storefront tokens, browser surfaces, typography, motion, and reusable editorial classes.
- Customer navigation and footer.
- Homepage composition and content hierarchy.
- Product cards and the shop collection header/filter treatment.
- Product detail presentation, cart, and checkout visual consistency.
- Responsive desktop and mobile layouts, RTL/LTR behavior, keyboard focus, loading, empty, and disabled states.

### Preserved

- React routes, API calls, Zustand stores, authentication, product/cart/order data shapes, translations, pricing, and checkout behavior.
- Existing product and brand assets; no new factual claims.
- Admin, account, backend, and mobile-app implementation.

### Anti-goals

- No generic glassmorphism, colored gradients, decorative monospace, nested card stacks, repeated eyebrow labels, or feature-icon grids.
- No cloud/device-control feature work.
- No new dependency unless the existing stack cannot express the design.

## Interaction and layout

- Navigation remains familiar and functional but loses excess borders, shadows, badges, and capsule decoration.
- Product cards prioritize image, name, price, and add action; metadata is secondary and only appears when useful.
- Shop filters remain URL-driven and horizontally scrollable on small screens.
- Product detail retains colorway, quantity, specs, scent pyramid, reviews, and related products while consolidating trust information into one quiet rail.
- Cart and checkout keep their current forms and state transitions but use one clear surface hierarchy rather than multiple competing bordered cards.

## Verification

- `npm run typecheck` and `npm run build` must pass in `frontend/`.
- Review the homepage, shop, product detail, cart, and checkout at 1440px and 390px.
- Review both Arabic RTL and English LTR, including heading wrapping, controls, image crops, and order-summary alignment.
- Confirm visible focus, reduced-motion behavior, contrast, loading skeletons, empty states, and disabled checkout state.

