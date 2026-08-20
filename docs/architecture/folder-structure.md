# Proposed folder structure

```text
.
|-- docs/
|   |-- architecture/
|   `-- design/concepts/
|-- public/
|-- src/
|   |-- app/
|   |   |-- [locale]/
|   |   |   |-- (public)/
|   |   |   |-- (auth)/
|   |   |   `-- (portals)/
|   |   |       |-- student/
|   |   |       |-- parent/
|   |   |       |-- teacher/
|   |   |       |-- staff/
|   |   |       `-- admin/
|   |   |-- auth/callback/
|   |   |-- globals.css
|   |   `-- layout.tsx
|   |-- components/
|   |   |-- brand/
|   |   |-- public-site/
|   |   |-- portal/
|   |   `-- ui/
|   |-- config/
|   |-- features/
|   |   |-- auth/
|   |   |-- access-control/
|   |   |-- audit/
|   |   |-- identity/
|   |   |-- public-site/
|   |   |-- students/
|   |   |-- parents/
|   |   |-- teachers/
|   |   `-- admin/
|   |-- i18n/
|   |-- lib/
|   |   |-- supabase/
|   |   `-- validation/
|   |-- server/
|   |   |-- authorization/
|   |   |-- repositories/
|   |   `-- services/
|   |-- test/
|   `-- types/
|-- supabase/
|   |-- migrations/
|   `-- README.md
|-- src/proxy.ts
|-- components.json
|-- package.json
`-- .env.example
```

Feature folders own validation schemas, server actions, domain types, and feature-specific components. Shared UI primitives contain no academy business rules. Database access is restricted to server-side repositories and Supabase clients; presentation components do not assemble authorization queries.
