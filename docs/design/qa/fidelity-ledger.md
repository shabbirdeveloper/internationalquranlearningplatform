# Phase 1 visual fidelity ledger

Reference: `docs/design/concepts/homepage-opening.png`  
Rendered capture: `docs/design/qa/homepage-desktop.png`  
RTL interaction capture: `docs/design/qa/homepage-ur-mobile-menu.png`

## Comparison points

1. **Header density and hierarchy:** the live build preserves the quiet white header, left-aligned identity in LTR, centered navigation, language switch, sign-in action, and emerald trial CTA.
2. **Hero split:** both reference and implementation use a near-even editorial-copy/photo split with a hard boundary and no decorative gradient.
3. **Headline scale and wrapping:** the rendered heading maintains the large emerald serif treatment and intentional three-line desktop wrap from the concept.
4. **Primary actions:** Free Trial remains primary and Explore Courses remains outlined; button sizing and placement follow the reference. Decorative arrows from the generated concept were omitted where they did not add meaning.
5. **Trust rail:** the four equal bordered trust items, icon rhythm, and compact vertical spacing match the opening concept.
6. **Opening content rhythm:** Popular Courses and How Online Classes Work begin in a two-column composition below a generous white-space band, preserving the reference hierarchy while using production copy.
7. **Responsive/RTL behavior:** at 390px, the split hero stacks, actions remain visible, the mobile sheet includes EN/UR/AR switching, Urdu and Arabic set `dir="rtl"`, and measured document width has no horizontal overflow.

## Above-the-fold copy check

The live English headline, supporting sentence, and primary CTA copy match the approved reference wording. The implementation adds semantic punctuation and accessible labels without changing the promise. Course card wording below the fold follows the product brief rather than the concept's illustrative labels.

The round Next.js development-tools control visible in local captures is development-only and is not emitted by the production build.

# Phase 2 portal fidelity ledger

References: `docs/design/concepts/phase-2-user-dashboard.png` and `docs/design/concepts/phase-2-teacher-profile.png`  
Rendered captures: `docs/design/qa/phase-2-desktop.png`, `docs/design/qa/phase-2-mobile.png`, and `docs/design/qa/phase-2-mobile-nav.png`

## Comparison points

1. **Shell geometry:** the 1584 × 992 implementation capture preserves the reference's fixed navy sidebar, quiet white header, wide content canvas, and right-hand status rail.
2. **Hierarchy and onboarding:** serif page titles, progress-first onboarding, three-row checklist, status card, empty learning state, and paired actions follow the accepted user-dashboard composition.
3. **Palette and components:** true-white surfaces, ink navy, restrained emerald states, amber incomplete status, hairline borders, and shared shadcn primitives match the locked Phase 2 system.
4. **Typography and spacing:** the Cormorant/Geist pairing, compact navigation, open card padding, and low-density operational layout stay faithful without reproducing image-generation artifacts.
5. **Iconography and states:** Lucide line icons replace the concept's illustrative glyphs while retaining each semantic role; unavailable academic modules are visibly disabled.
6. **Responsive behavior:** at the mobile breakpoint the header compresses, cards stack, checklist labels remain readable, and the 18rem navigation drawer opens over a dimmed page without horizontal overflow.
7. **Teacher workflow fidelity:** the production profile separates professional data, languages, age groups, weekly availability, private uploads, verification status, and application history as shown in the teacher reference.

## Above-the-fold copy and intentional deviations

The implementation keeps the approved welcome, completion, checklist, account-status, and teacher-verification meanings. It uses the signed-in full name and calculated completion percentage rather than the illustrative concept values. Search and notifications remain visibly disabled because their modules are not implemented. Avatar photography, notification counts, keyboard hints, and fake academic activity were omitted; production shows initials, real profile state, and an honest empty state. The development-tools control in local captures is not part of the production build.
