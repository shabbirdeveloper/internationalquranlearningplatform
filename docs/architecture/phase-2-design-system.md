# Phase 2 portal design inventory

The accepted references are `docs/design/concepts/phase-2-user-dashboard.png` and
`docs/design/concepts/phase-2-teacher-profile.png`. They extend the Phase 1 portal
shell without changing its navigation geometry or brand treatment.

## Visual lock

- Canvas: true white. Sidebar: near-black navy. Primary action and selected state:
  deep emerald. Muted gold is reserved for incomplete or review-required states.
- Typography: editorial serif for page and section titles; compact sans-serif for
  controls, labels, values, and helper copy.
- Geometry: 10-12px radii, thin warm-gray borders, rare shadow, and visible emerald
  focus rings.
- Container model: open sections, checklist rows, status rails, semantic tables,
  and restrained side panels. No bento grids or nested card stacks.
- Icons: Lucide outline icons at a consistent optical size and stroke weight.

## Phase 2 component families

- Portal onboarding overview: welcome copy, profile-completion progress, checklist,
  role status rail, and honest downstream-module empty state.
- Profile forms: `FieldSet`, `FieldGroup`, visible labels, inline help/error text,
  responsive two-column field rows, primary save action, and pending state.
- Parent links: request form, relationship status rows, and admin review table.
- Teacher verification: four-step status rail, professional profile form, weekly
  availability rows, private-document checklist, and application history.
- Staff: branch membership list and permission summary; admin branch/staff forms use
  existing users and never create Auth accounts with privileged browser keys.
- Admin: real database counts or an em dash/empty state; no seeded or invented
  operational figures in production paths.

## Interaction and responsive rules

- Desktop preserves the existing fixed application sidebar and open content canvas.
- Tablet/mobile collapses the sidebar into the existing sheet and turns side rails
  into full-width sections below the main content.
- Disabled Phase 3+ modules remain legible and non-interactive.
- All mutations use authenticated Server Actions or narrowly scoped database RPCs;
  client-side private-document uploads land in a private quarantine path.
- RTL direction is inherited from the locale root and logical spacing is used.

## Allowed first-viewport copy

Only role-appropriate variants of the following appear above the fold: the portal
page title, welcome/profile-completion copy, profile checklist labels, role/account
status, and the actions to complete or view the profile. No new metrics, course
names, teacher names, payment claims, or class data may be invented.
