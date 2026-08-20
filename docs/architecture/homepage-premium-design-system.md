# Premium homepage design system

## Direction

The public homepage should feel calm, credible, and contemporary: generous white space, strong editorial hierarchy, restrained Islamic references, and very little decorative UI. The experience must remain family-friendly and trustworthy rather than luxurious for its own sake.

Reference concepts:

- `docs/design/concepts/homepage-premium-opening.png`
- `docs/design/concepts/homepage-premium-middle.png`
- `docs/design/concepts/homepage-premium-lower.png`

## Typography

- Latin body and display type: Poppins, self-hosted through `next/font/google`.
- Weights: 400 for body, 500 for labels, 600 for supporting headings, and 700 for primary display headings.
- Arabic and Urdu: Noto Naskh Arabic remains the locale-specific body and display family.
- Display headings use compact tracking and balanced line lengths; body copy stays open and readable.

## Palette

- Canvas: true white.
- Primary ink: deep navy, used for headings, footer, and the global-learning band.
- Brand primary: forest emerald, used for key actions and trusted accents.
- Supporting surface: very pale cool gray-green, never cream.
- Accent: muted antique gold, reserved for one secondary CTA and small icon details.
- Borders: quiet cool gray at low contrast.

All colors map to semantic Tailwind/shadcn tokens. Components must not introduce one-off color systems.

## Shape and spacing

- Main content width: `max-w-7xl`.
- Section rhythm: 5–7rem vertical space on desktop and 4–5rem on mobile.
- Media radius: 1.5–1.75rem with a soft, broad shadow.
- Controls: 0.75rem radius, 44–48px height for primary public actions.
- Prefer open rows, dividers, and bands over repeated floating cards.

## Homepage composition

1. A compact 80px sticky header with navigation, locale control, sign-in, and one primary action.
2. A full-width photographic hero carousel with a strong Poppins headline, two actions, and three existing live-class scenes.
3. An open four-point trust rail.
4. A two-column learning section: course rows beside a vertical four-step journey.
5. Two open teacher verification rows.
6. A full-bleed deep-navy learner and time-zone band.
7. A consent-safe testimonial empty state beside a single premium pricing card.
8. A pale safety band, two-column FAQ, deep-green trial CTA, and simple deep-navy footer.

## Components and interactions

- Buttons, Card, Avatar, Empty, Accordion, Separator, and Sheet use the installed shadcn primitives.
- Button icons use Lucide at the component default size with `data-icon` placement attributes.
- Header links, language switching, mobile Sheet navigation, anchor navigation, CTA links, and FAQ expansion must all remain functional.
- Hover motion is limited to small color, translation, and media-scale changes. Reduced-motion preferences disable these transitions.
- No gradients, decorative pills, invented testimonials, fake ratings, fabricated metrics, or stale local-time claims.

## Full-width hero carousel extension

- Container model: edge-to-edge media band beneath the header, with a `max-w-7xl` content alignment rail inside it.
- Height: approximately one remaining viewport on desktop, with a stable 38–52rem range; mobile keeps enough height for copy, actions, and controls without clipping.
- Media: three existing SHIA TALEEM learning photographs use `object-cover`, stable focal positions, and no color tint. A navy-to-transparent directional gradient is allowed only to keep overlaid text readable.
- Copy: every slide has one localized title and description. The existing “Book a free trial” and “Explore courses” actions remain unchanged and visible on every slide.
- Controls: previous/next arrows, direct slide dots, and pause/play. Auto-advance uses a calm interval, pauses while the user hovers or focuses the hero, and never removes manual control.
- Accessibility: the carousel is a labelled region, status changes are announced politely, every control has a localized accessible name, and focus rings use existing semantic tokens.
- Responsive behavior: full width at every breakpoint; headline and controls scale down, CTA buttons stack on narrow screens, image crops keep the learner or teacher as the focal subject, and no horizontal overflow is allowed.
- Palette lock: white slide copy, emerald primary action, quiet white outline action, gold active indicator, and deep navy readability gradient.

## Content integrity

- Homepage text comes from the locale dictionaries.
- Teacher profiles remain generic until approved profiles exist.
- Testimonials remain an explicit consent-safe empty state.
- The time-zone rail shows the actual IANA identifiers already supported by the product rather than fabricated times.

## Implementation fidelity ledger

- The implemented opening keeps the concept's white 80px header, Poppins navigation, left-aligned display headline, dual actions, and large rounded classroom image.
- The four-part trust rail remains an open divider-based strip with emerald line icons.
- Popular courses and the class journey keep the concept's desktop split, alternating green/gold icon treatments, open rows, and vertical progression line.
- Teacher verification uses two wide divider rows rather than repeated cards, followed directly by the full-bleed navy learner band.
- The learner band preserves the gold check accents, two-column hierarchy, and framed global time-zone rail.
- The lower page preserves the open testimonial/pricing split, pale safety band, two-column FAQ, green conversion band, and deep-navy footer.

## Intentional copy and product differences

- Locale controls remain in the header because multilingual switching is an existing product requirement, although they were omitted from the opening concept.
- Course, teacher, safety, FAQ, and CTA copy comes from the production dictionaries rather than the illustrative wording in the generated concepts.
- IANA identifiers replace illustrative local times so the page does not publish stale or fabricated schedule information.
- Generic verified-teacher rows and the consent-safe testimonial empty state remain until approved public content exists.

## Public-site premium system extension

- All public routes share a scoped `.public-site` interaction layer, keeping admin and authentication interfaces isolated from marketing-page styling.
- The surface cadence alternates true white, warm off-white, mountain green, and deep navy. Gold is reserved for short dividers, featured badges, and other micro-accents.
- Interior page heroes use a compact green band, a subtle geometric line pattern, and a short gold divider beside the eyebrow. This preserves hierarchy without consuming the first viewport.
- Public content cards use a 20px radius, a quiet one-pixel ring, and restrained shadow. Only cards explicitly marked interactive lift, and the lift is capped at three pixels.
- Course cards expose age, class type, duration, and language with consistent line icons, then end with a full-width primary action. Pricing cards remain equal dark-navy packages; the recommended option uses a green outline and one gold badge.
- Desktop navigation stays centered between the brand and account controls. On mobile, the logo remains left aligned and the menu control right aligned, with all destinations and the primary action available in the drawer.
- Public forms use persistent labels, visible required markers, 48px controls, rounded 14px fields, and a clear green focus ring. FAQ items are independent soft containers with comfortable trigger height.
- The footer follows a structured multi-column grid for academy, navigation, resources, and contact information, while avoiding unapproved social accounts or contact details.
- Responsive acceptance targets include 390px mobile width with no horizontal overflow, one-column package cards, readable type, and touch-sized controls.
