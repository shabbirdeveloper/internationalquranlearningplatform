# SHIA TALEEM

Phase 2 implementation of a multilingual, role-based online Shia Islamic learning platform. The application includes the public academy shell, Supabase authentication, database-backed RBAC and RLS, editable Student/Parent/Teacher/Staff profiles, parent-child approval, teacher recruitment and private document quarantine, branch-scoped staff administration, and a Super Admin people-operations workspace.

Payments, messaging, live-class providers, and advanced academic workflows are deliberately deferred.

## Technology

- Next.js 16 App Router, React 19, and strict TypeScript.
- Tailwind CSS 4 and shadcn/ui using Radix primitives.
- Supabase Auth and PostgreSQL with Row Level Security.
- Zod for server-side input validation and Vitest for unit/contract tests.
- Locale-prefixed English, Urdu, and Arabic routes with LTR/RTL direction.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a Supabase project for authentication.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The proxy redirects the unprefixed URL to the best supported locale. The public site works without Supabase configuration; sign-in shows a safe configuration message until the required public variables are present.

Set these values in `.env.local`:

```dotenv
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`NEXT_PUBLIC_*` values are compiled into browser bundles by Next.js, so configure them before a production build. Never expose the Supabase service-role key through a public variable or browser helper.

## Database setup

Apply the SQL files in `supabase/migrations/` in filename order. With the Supabase CLI linked to a project:

```bash
supabase db push
```

Create users through Supabase Auth. The database trigger creates the corresponding `public.users` and `public.profiles` rows. To bootstrap the first administrator, run this once from a trusted Supabase SQL session, replacing the UUID with an existing Auth user ID:

```sql
insert into public.user_roles (user_id, role_id)
select '00000000-0000-0000-0000-000000000000'::uuid, id
from public.roles
where key = 'super_admin';
```

Do not expose role assignment as a public registration operation. See `supabase/README.md` for the migration inventory and security posture.

## Available routes

- `/{locale}`: public academy homepage.
- `/{locale}/free-trial`: safeguarding-aware Phase 1 placeholder; it collects no personal or child data.
- `/{locale}/login`: email/password sign-in and role-based portal redirect.
- `/{locale}/admin`: Super Admin overview with live Phase 2 counts.
- `/{locale}/admin/people`, `/parent-links`, `/teachers`, `/staff`: protected people, review, branch, and staff operations.
- `/{locale}/student`, `/parent`, `/teacher`, `/staff`: role-specific onboarding dashboards.
- `/{locale}/{student|parent|teacher|staff}/profile`: editable profile and preference workflows.

Supported locale prefixes are `en`, `ur`, and `ar`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Tests include Phase 2 form validation, permission resolution, full-access behavior, migration security contracts, and database/application permission-catalogue synchronization.

## Architecture references

- `docs/architecture/current-state.md`
- `docs/architecture/target-architecture.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/phase-1-file-inventory.md`
- `docs/architecture/phase-2-file-inventory.md`
- `docs/architecture/entity-relationship-plan.md`
- `docs/architecture/role-permission-matrix.md`
- `docs/architecture/development-checklist.md`
- `docs/architecture/environment-variables.md`
- `docs/architecture/design-system.md`

Generated design references live in `docs/design/concepts/`. Production UI intentionally uses empty states instead of invented academy metrics, named teachers, admissions, or testimonials.

Phase 3 should add the academic catalogue, admissions/trials, enrollments, teacher assignment history, scheduling, sessions, and attendance. Payments, messaging, and live-class providers remain deliberately deferred.
