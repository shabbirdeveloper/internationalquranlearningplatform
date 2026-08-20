# Dynamic pricing design inventory

## Existing foundations to preserve

- Poppins remains the primary display and body face, with the existing Arabic font fallback for RTL locales.
- Public pages use a restrained white, deep green, navy, and gold palette with generous rounded corners.
- Public header, footer, localized routing, free-trial flow, portal sidebar, permission model, and shadcn primitives remain unchanged.
- Admin pages use the existing portal shell, compact cards, responsive tables, status badges, dialogs, tabs, and field composition.

## Pricing extension

- The supplied fee-page screenshot is the accepted information reference: a centered introduction followed by four comparable monthly packages.
- SHIA TALEEM's established design system replaces the reference site's pale patterned cards: package cards use the existing navy sidebar token, white text, green actions, and a gold featured treatment.
- The public grid is one column on mobile, two on tablet, and four on wide screens. Every card has equal-height content, a clear package title, lesson facts, feature checks, every active currency price, and one full-width action.
- Featured packages may carry an admin-controlled badge and gold ring, but do not change the content order.
- Pricing heading, highlighted heading, subtitle, introduction, CTA copy, packages, features, currencies, and prices are database-owned. Empty database states are explicit and do not invent prices.

## Admin interaction model

- Three tabs separate Packages, Currencies, and Page content.
- Packages use a searchable responsive table with status, featured state, display order, and edit/duplicate/activate/archive actions.
- Package editing happens in a scrollable dialog with grouped fields, repeatable features, repeatable currency prices, and a live preview.
- Ordering uses an explicit numeric display order, which remains keyboard accessible and predictable on touch devices.
- Destructive archive and activation actions are clearly labeled and server-authorized.

## Reuse decisions

- Reuse `pricing_plans` by evolving it to `pricing_packages`; do not introduce a competing pricing source.
- Reuse `content.manage` and `system.full_access` for admin authorization.
- Reuse public `/free-trial`, existing semantic color tokens, and installed shadcn components. No new component package is required.
