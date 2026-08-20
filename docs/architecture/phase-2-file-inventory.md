# Phase 2 file inventory

## Database

- `supabase/migrations/202608050005_phase_2_portal_schema.sql`: Phase 2 tables, constraints, indexes, timestamps, and role-extension provisioning.
- `supabase/migrations/202608050006_phase_2_portal_security.sql`: branch scope, audit triggers, transactional workflows, forced RLS, grants, and private Storage policies.
- `supabase/migrations/202608050007_phase_2_permissions.sql`: review, branch, and staff permission catalogue/grants.

## Application contracts and server layer

- `src/config/permissions.ts`: application permission catalogue.
- `src/features/portal/schemas.ts`: Zod validation for profiles, links, reviews, staff assignment, availability, and uploads.
- `src/features/portal/actions.ts`: authenticated and authorized Server Actions.
- `src/server/repositories/portal-repository.ts`: parsed, RLS-bound portal and administration reads.

## User interface

- `src/components/portal/portal-onboarding-overview.tsx`: shared onboarding dashboard composition.
- `src/components/portal/role-dashboards.tsx`: real Student, Parent, Teacher, and Staff states.
- `src/components/portal/profile-forms.tsx` and `profile-pages.tsx`: role-aware editable profiles.
- `src/components/portal/teacher-document-upload.tsx`: allowlisted private quarantine upload.
- `src/components/portal/admin-phase-two-forms.tsx` and `admin-phase-two-pages.tsx`: approval, recruitment, branch, and staff operations.
- `src/components/portal/admin-dashboard.tsx` and `portal-shell.tsx`: live Phase 2 overview and navigation.
- `src/app/[locale]/(portals)/`: protected overview, profile, and Super Admin routes.

## Tests and design evidence

- `src/features/portal/schemas.test.ts`: form and file validation coverage.
- `src/server/authorization/phase-2-rls-migrations.test.ts`: migration/RLS/storage contract checks.
- `src/server/authorization/permissions-sync.test.ts`: seeded/application permission synchronization.
- `docs/design/concepts/phase-2-user-dashboard.png` and `phase-2-teacher-profile.png`: accepted visual direction.
- `docs/design/qa/phase-2-desktop.png`, `phase-2-mobile.png`, and `phase-2-mobile-nav.png`: browser QA evidence.

## Environment changes

Phase 2 adds no public environment variables. It continues to use `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. A future scanner worker must use a separately secured server-side credential; no service-role secret belongs in `.env.example` or browser code.
