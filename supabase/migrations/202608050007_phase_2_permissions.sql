begin;

insert into public.permissions (key, module, action, name, description, is_active)
values
  (
    'parent_links.review', 'parent_links', 'review', 'Review parent links',
    'Review guardian-to-student link requests. Initially restricted to Super Admin.', true
  ),
  (
    'teacher_applications.review', 'teacher_applications', 'review',
    'Review teacher applications',
    'Move teacher applications through approved recruitment transitions and record review history.',
    true
  ),
  (
    'branches.read', 'branches', 'read', 'Read branches',
    'Read branch records within an assigned scope.', true
  ),
  (
    'branches.manage', 'branches', 'manage', 'Manage branches',
    'Create and manage academy branches. High-risk permission.', true
  ),
  (
    'staff.manage', 'staff', 'manage', 'Manage staff',
    'Assign eligible staff roles and branch memberships within the actor scope.', true
  )
on conflict (key) do update
set
  module = excluded.module,
  action = excluded.action,
  name = excluded.name,
  description = excluded.description,
  is_active = excluded.is_active,
  deleted_at = null,
  updated_at = now();

with grants (role_key, permission_key) as (
  values
    ('admission_officer', 'branches.read'),
    ('academic_coordinator', 'teacher_applications.review'),
    ('academic_coordinator', 'branches.read'),
    ('finance_manager', 'branches.read'),
    ('support_agent', 'branches.read'),
    ('content_manager', 'branches.read'),
    ('branch_manager', 'branches.read'),
    ('branch_manager', 'staff.manage')
)
insert into public.role_permissions (role_id, permission_id)
select role.id, permission.id
from grants
join public.roles role on role.key = grants.role_key
join public.permissions permission on permission.key = grants.permission_key
on conflict (role_id, permission_id) do nothing;

commit;
