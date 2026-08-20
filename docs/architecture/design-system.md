# Initial design system

The source references are the generated concept images in `docs/design/concepts/`.

## Visual direction

- Marketing background: true white, with restrained warm-off-white section bands.
- Portal background: true white content canvas with a near-black navy sidebar.
- Primary: deep emerald; primary foreground: white.
- Accent: muted gold for small secondary emphasis only.
- Borders: thin warm-gray; shadows: subtle and rare.
- Marketing typography: editorial serif headings with a highly legible sans-serif body.
- Product typography: compact sans-serif controls with serif page titles where appropriate.
- Geometry: medium radii, open bands and tables; avoid nested cards and generic bento grids.

## Component families

- Public: quiet header, strong split hero, trust rail, course rail, step sequence, teacher rows, world-time rail, testimonial feature, restrained plan preview, safety band, accordion and final CTA.
- Portal: collapsible sidebar, compact top bar, summary metric cards, operations list, data table, attention rail, activity list and mobile sheet navigation.
- Forms: shadcn Field/FieldGroup, accessible labels, inline errors, semantic alert summaries and pending-state buttons.
- Status: semantic Badge variants; never raw one-off colors.
- Inputs: text inputs, select menus, popovers, and a locale-aware date-picker composition.
- Navigation and disclosure: tabs, accordion, responsive sheet, drawer, modal dialog, dropdown menu, and tooltip.
- Data presentation: semantic tables, empty states, skeletons, and a Recharts-backed chart container reserved for real metrics.

## Token intent

- Radius: `0.75rem` default; smaller controls use `0.5rem`.
- Content width: `80rem` public, full-width bounded application canvas for portals.
- Motion: 150-220ms ease-out for hover, selection and drawer transitions; respect reduced motion.
- Focus: visible emerald ring with sufficient contrast.
- Icons: consistent Lucide outline style, no decorative icon overload.

## Responsive behavior

- Public navigation collapses to a labelled mobile menu.
- Hero changes from two columns to one without hiding primary actions.
- Data-heavy portal tables retain semantic table markup and use horizontal overflow on narrow screens.
- Portal sidebar becomes a sheet; critical actions remain reachable by keyboard.
- Locale direction is inherited at the document boundary, and directional spacing uses logical CSS where practical.

## Intentional implementation constraint

The admin concept contains example metrics and rows for design clarity. Phase 1 production pages will render real database results or a polished empty state; invented operational data will not ship in production paths.
