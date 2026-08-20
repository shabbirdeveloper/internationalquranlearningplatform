# Pak-inspired SHIA TALEEM homepage design system

## Visual specification

Accepted section concepts:

- `docs/design/concepts/homepage-pak-inspired-opening.png`
- `docs/design/concepts/homepage-pak-inspired-middle.png`
- `docs/design/concepts/homepage-pak-inspired-lower.png`

Production imagery:

- `public/images/shia-taleem-hero-learning.png`
- `public/images/shia-taleem-female-teacher.png`
- `public/images/quran-trial-art.png`

The design adopts the reference site's useful marketing structure—course-rich navigation, a clear trial journey, teacher credibility, pricing and FAQs—without reproducing its branding, old visual treatment, copy, contact details or unsupported claims.

## Content hierarchy

1. Slim international-learning strip.
2. White navigation with Home, Courses, Teachers, How It Works, Pricing and Contact.
3. Split photographic hero.
4. Three-step enquiry, trial and admission journey.
5. Four family benefits.
6. Six-course catalogue with two featured entries and four open rows.
7. Forest-green trial invitation.
8. Teacher standards with a large editorial photograph.
9. Deep-navy pricing preview with one monthly plan.
10. Four-question FAQ.
11. Compact conversion band and structured footer.

## Allowed opening copy

- “Learn from anywhere · Flexible international scheduling”
- “SHIA TALEEM”
- “Home”, “Courses”, “Teachers”, “How It Works”, “Pricing”, “Contact”
- “Sign in”, “Book a free trial”
- “Live Quran learning, shaped around every student.”
- “One-to-one online lessons with caring teachers, flexible schedules, and progress families can follow.”
- “Explore courses”
- “Tell us what you need”, “Attend a live trial”, “Begin your program”

No additional eyebrow, badge, metric, price, phone number or email is permitted above the fold.

## Color and typography

- Canvas: true white.
- Primary ink: deep navy `oklch(0.205 0.035 250)`.
- Primary action: forest emerald `oklch(0.34 0.09 161)`.
- Dark band: deep navy `oklch(0.19 0.04 248)`.
- Supporting surface: cool pale green `oklch(0.975 0.009 155)`.
- Accent: restrained antique gold `oklch(0.76 0.105 82)`.
- Borders: low-contrast cool gray.
- Latin UI and content: Poppins 400, 500, 600 and 700.
- Arabic and Urdu: Noto Naskh Arabic.
- Hero: 4rem desktop, 2.5rem mobile, 700 weight, compact tracking.
- Section headings: 2.25–3rem desktop, 600 weight.
- Controls: 14px, 500–600 weight, 44–48px height.

## Container and component model

- Header and content: `max-w-7xl` with 16/24/32px responsive gutters.
- Header: 32px contact strip plus 80px navigation.
- Hero: two equal visual halves at desktop; image fills a stable 4:3 frame without an overlay.
- Steps: open three-column rail with separators; stacked on mobile.
- Benefits: editorial heading paired with four bordered rows.
- Courses: two featured Card compositions followed by four open rows.
- Trial CTA: full-width forest band with the original transparent Quran-and-rehal artwork.
- Teacher standards: large 4:5 photograph plus a two-column quality grid.
- Pricing: full-width deep-navy band plus one complete Card.
- FAQ: one full-width Accordion with four items.
- Mobile navigation: existing Sheet with complete title and actions.

## Icon inventory

- Globe for international scheduling.
- Clipboard, teacher and book for the three admission steps.
- Book/user, heart, calendar and progress chart for family benefits.
- Book, message, bookmark, library and mosque metaphors for courses.
- Book, user, message, heart, clipboard and shield for teacher standards.
- Calendar and checks for the monthly plan.
- Arrow Right for all forward actions; it reverses in RTL.

Icons use Lucide's outline family at the component default size and approximately 2px stroke weight.

## Interaction and responsive rules

- Buttons and course links move their arrow slightly on hover.
- Feature and course surfaces lift by no more than 2px.
- Hero and teacher images scale by no more than 1.5% on hover.
- Hash navigation must account for the 112px sticky header.
- At mobile width, the hero image follows the copy, steps stack, featured courses become one column, teacher photograph precedes standards, and the footer becomes a vertical hierarchy.
- Respect `prefers-reduced-motion`.

## Content integrity

- No “three days free”, 24/7 availability, certificates, refunds, fixed duration or exact fee claims.
- Teacher language remains approval-focused rather than asserting unverified credentials.
- The plan preview intentionally omits a price until academy fees are confirmed.
- Generic teacher standards replace fabricated public staff profiles.
- English copy is original SHIA TALEEM copy derived from the content study, not duplicated source wording.
