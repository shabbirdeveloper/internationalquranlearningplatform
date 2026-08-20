# SHIA TALEEM public route expansion

## Visual contract

- Preserve the accepted homepage identity: warm ivory canvas, deep green surfaces, restrained gold accents, generous whitespace, rounded cards, and editorial heading scale.
- Public pages use the existing `max-w-7xl` shell, a compact eyebrow, a two-line maximum hero heading, and a short supporting paragraph.
- Marketplace pages place a calm filter surface before responsive result cards. Information pages alternate ivory and muted sections without introducing a second visual language.
- Forms use the shared shadcn `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `Alert`, and `Button` families. Every control has a visible label and server-side validation.

## Component families

- `PublicHeader` / `PublicMobileNav`: active route, locale-preserving language switch, mobile drawer closure after navigation.
- `PublicPageHero`: consistent page title, description, and optional actions.
- `CourseMarketplace`: searchable and filterable catalog cards.
- `TeacherMarketplace`: database-backed public tutor projection with a reviewed-empty state.
- `PublicRequestForm`: trial, contact, and tutor application flows with human-readable reference numbers.
- `PublicFooter`: real navigation, resources, policies, and account links.

## Responsive and direction rules

- One column below `md`, two columns from `md`, and three marketplace columns from `xl` where content density allows.
- Filters remain in document flow on small screens and do not obscure results.
- Logical properties (`ms`, `me`, `start`, `end`) and locale-level `dir` preserve Urdu and Arabic RTL behavior.
- Touch targets are at least 44px on mobile; sheets retain an accessible title and description.

## Content integrity

- Course curriculum examples are academy-owned catalog copy and may be published immediately.
- Tutor identity, qualifications, ratings, availability, prices, testimonials, and social handles are never fabricated. Empty, pending-review, and custom-quote states are intentional.
- Submission success is shown only after a database write succeeds.
