# Phase 1 file inventory

The repository was empty at the start of Phase 1. The implementation created the following project-owned files (generated dependency folders and build output are excluded).

## Root and tooling

- `.env.example`
- `.gitignore`
- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `components.json`
- `eslint.config.mjs`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `postcss.config.mjs`
- `tsconfig.json`
- `vitest.config.mts`

## Architecture, design, and QA

- `docs/architecture/current-state.md`
- `docs/architecture/design-system.md`
- `docs/architecture/development-checklist.md`
- `docs/architecture/entity-relationship-plan.md`
- `docs/architecture/environment-variables.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/phase-1-file-inventory.md`
- `docs/architecture/role-permission-matrix.md`
- `docs/architecture/target-architecture.md`
- `docs/design/concepts/homepage-opening.png`
- `docs/design/concepts/homepage-sections.png`
- `docs/design/concepts/portal-dashboard.png`
- `docs/design/qa/fidelity-ledger.md`
- `docs/design/qa/homepage-desktop.png`
- `docs/design/qa/homepage-ur-mobile.png`
- `docs/design/qa/homepage-ur-mobile-menu.png`

## Public assets

- `public/brand-mark.png`
- `public/images/hero-online-class.png`

## App Router

- `src/app/favicon.ico`
- `src/app/globals.css`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/auth/callback/route.ts`
- `src/app/[locale]/(public)/layout.tsx`
- `src/app/[locale]/(public)/page.tsx`
- `src/app/[locale]/(public)/free-trial/page.tsx`
- `src/app/[locale]/(auth)/layout.tsx`
- `src/app/[locale]/(auth)/login/page.tsx`
- `src/app/[locale]/(auth)/unauthorized/page.tsx`
- `src/app/[locale]/(portals)/layout.tsx`
- `src/app/[locale]/(portals)/admin/page.tsx`
- `src/app/[locale]/(portals)/student/page.tsx`
- `src/app/[locale]/(portals)/parent/page.tsx`
- `src/app/[locale]/(portals)/teacher/page.tsx`
- `src/app/[locale]/(portals)/staff/page.tsx`

## Academy components

- `src/components/auth/login-form.tsx`
- `src/components/brand/academy-brand.tsx`
- `src/components/portal/admin-dashboard.tsx`
- `src/components/portal/portal-placeholder.tsx`
- `src/components/portal/portal-shell.tsx`
- `src/components/providers/app-providers.tsx`
- `src/components/public-site/home-faq.tsx`
- `src/components/public-site/home-hero.tsx`
- `src/components/public-site/home-learning.tsx`
- `src/components/public-site/home-trust.tsx`
- `src/components/public-site/public-footer.tsx`
- `src/components/public-site/public-header.tsx`
- `src/components/public-site/public-mobile-nav.tsx`

## Shared UI primitives

- `src/components/ui/accordion.tsx`
- `src/components/ui/alert.tsx`
- `src/components/ui/avatar.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/calendar.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/chart.tsx`
- `src/components/ui/date-picker.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/empty.tsx`
- `src/components/ui/field.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/popover.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/separator.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/spinner.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`

## Application, internationalization, and authorization

- `src/config/env.ts`
- `src/config/permissions.ts`
- `src/config/permissions-sync.test.ts`
- `src/features/auth/actions.ts`
- `src/features/auth/redirects.ts`
- `src/features/auth/redirects.test.ts`
- `src/features/auth/schemas.ts`
- `src/features/auth/schemas.test.ts`
- `src/hooks/use-mobile.ts`
- `src/i18n/config.ts`
- `src/i18n/dictionaries.ts`
- `src/i18n/dictionaries/en.ts`
- `src/i18n/dictionaries/ur.ts`
- `src/i18n/dictionaries/ar.ts`
- `src/i18n/types.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/update-session.ts`
- `src/lib/utils.ts`
- `src/proxy.ts`
- `src/server/authorization/access.ts`
- `src/server/authorization/access.test.ts`
- `src/server/authorization/permissions.ts`
- `src/server/authorization/rls-migrations.test.ts`

## Supabase

- `supabase/README.md`
- `supabase/migrations/202608050001_foundation.sql`
- `supabase/migrations/202608050002_portal_profiles.sql`
- `supabase/migrations/202608050003_row_level_security.sql`
- `supabase/migrations/202608050004_seed_roles_permissions.sql`
