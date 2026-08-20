# Supabase foundation

Apply migrations in filename order:

1. `202608050001_foundation.sql` creates identity projections, profiles, roles, permissions, role assignments, audit history, indexes, and Auth projection triggers.
2. `202608050002_portal_profiles.sql` creates private Student, Parent, Teacher, and approved parent-child relationship records.
3. `202608050003_row_level_security.sql` enables and forces RLS on every private table, defines authorization helpers, and exposes the current user's access projection.
4. `202608050004_seed_roles_permissions.sql` idempotently seeds the role and permission catalogue plus the initial role grants.
5. `202608050005_phase_2_portal_schema.sql` adds branches, staff membership, teacher recruitment, availability, review history, document metadata, and profile extensions.
6. `202608050006_phase_2_portal_security.sql` adds branch-aware authorization helpers, auditable transactional RPCs, grants, forced RLS, and the private quarantined teacher bucket.
7. `202608050007_phase_2_permissions.sql` seeds Phase 2 review, branch, and staff permissions plus role grants.

## Security posture

- Browser and user-bound server clients use only the Supabase publishable key.
- Authorization is derived from database role assignments, never user-editable Auth metadata.
- `system.full_access` is seeded only for the `super_admin` role.
- Private profile, guardian-link, role-assignment, and audit access is subject-owned, approved-link-owned, branch-scoped, or explicitly review-scoped.
- Direct audit table writes are not granted. Security-definer workflow functions and profile audit triggers append bounded audit records.
- The private teacher table is never exposed as the public teacher directory. A reviewed public projection belongs in the managed-content phase.
- `teacher-private` is a non-public bucket with a 5 MB PDF/JPEG/PNG allowlist. Teachers upload only beneath their own user-ID prefix and create quarantined metadata for their own application.
- Reviewers cannot select stored objects until a trusted scanner changes the matching document metadata to `scan_status = 'clean'`. The scanner itself is an external operational dependency and is not implemented in this repository.

The seed contains capability keys for future modules, but a capability key does not bypass RLS or create row scope by itself.
