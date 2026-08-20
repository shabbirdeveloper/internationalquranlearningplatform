begin;

insert into public.roles (key, name, description, is_system, is_active)
values
  ('student', 'Student', 'Learner with access to their own academy records.', true, true),
  ('parent', 'Parent or guardian', 'Guardian with access to approved linked children.', true, true),
  ('teacher', 'Teacher', 'Approved instructor with access to assigned learners.', true, true),
  ('admission_officer', 'Admission officer', 'Staff member responsible for enquiries, trials, and enrolment.', true, true),
  ('academic_coordinator', 'Academic coordinator', 'Staff member responsible for courses, teachers, and academic delivery.', true, true),
  ('finance_manager', 'Finance manager', 'Staff member responsible for financial operations and reporting.', true, true),
  ('support_agent', 'Support agent', 'Staff member responsible for assigned support cases.', true, true),
  ('content_manager', 'Content manager', 'Staff member responsible for public and academy content.', true, true),
  ('branch_manager', 'Branch manager', 'Manager responsible for operations within an assigned branch scope.', true, true),
  ('super_admin', 'Super Admin', 'Platform-wide administrator. Assignment must be tightly controlled and audited.', true, true)
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  is_system = excluded.is_system,
  is_active = excluded.is_active,
  deleted_at = null,
  updated_at = now();

insert into public.permissions (key, module, action, name, description, is_active)
values
  ('system.full_access', 'system', 'full_access', 'Full system access', 'Grants every configured permission. Reserved for Super Admin.', true),
  ('portal.student.view', 'portal', 'student_view', 'View student portal', 'Open the student portal shell and permitted student views.', true),
  ('portal.parent.view', 'portal', 'parent_view', 'View parent portal', 'Open the parent portal shell and approved linked-child views.', true),
  ('portal.teacher.view', 'portal', 'teacher_view', 'View teacher portal', 'Open the teacher portal shell and assigned-student views.', true),
  ('portal.staff.view', 'portal', 'staff_view', 'View staff portal', 'Open the staff operations portal shell.', true),
  ('portal.admin.view', 'portal', 'admin_view', 'View Super Admin portal', 'Open the platform administration portal shell.', true),
  ('profile.read_own', 'profile', 'read_own', 'Read own profile', 'Read the authenticated user profile.', true),
  ('profile.update_own', 'profile', 'update_own', 'Update own profile', 'Update safe fields on the authenticated user profile.', true),
  ('child.read_linked', 'child', 'read_linked', 'Read linked children', 'Read student records through an approved guardian link.', true),
  ('student.read_assigned', 'student', 'read_assigned', 'Read assigned students', 'Read learners assigned through an approved academic relationship.', true),
  ('users.read', 'users', 'read', 'Read users', 'Read user records within the actor scope.', true),
  ('users.manage', 'users', 'manage', 'Manage users', 'Manage user lifecycle and approved relationship records within scope.', true),
  ('roles.read', 'roles', 'read', 'Read roles', 'Read roles, permissions, and assignments within scope.', true),
  ('roles.manage', 'roles', 'manage', 'Manage roles', 'Manage roles, permissions, and assignments. High-risk permission.', true),
  ('courses.read', 'courses', 'read', 'Read courses', 'Read courses and curriculum within scope.', true),
  ('courses.manage', 'courses', 'manage', 'Manage courses', 'Manage courses and curriculum within scope.', true),
  ('admissions.read', 'admissions', 'read', 'Read admissions', 'Read admission and trial records within scope.', true),
  ('admissions.manage', 'admissions', 'manage', 'Manage admissions', 'Manage admission and trial workflows within scope.', true),
  ('scheduling.read', 'scheduling', 'read', 'Read schedules', 'Read schedules and classes within scope.', true),
  ('scheduling.manage', 'scheduling', 'manage', 'Manage schedules', 'Manage schedules and classes within scope.', true),
  ('attendance.read', 'attendance', 'read', 'Read attendance', 'Read attendance and progress within scope.', true),
  ('attendance.manage', 'attendance', 'manage', 'Manage attendance', 'Manage attendance and progress within scope.', true),
  ('finance.read', 'finance', 'read', 'Read finance', 'Read financial records within scope.', true),
  ('finance.manage', 'finance', 'manage', 'Manage finance', 'Manage financial workflows within scope.', true),
  ('content.read', 'content', 'read', 'Read content', 'Read managed content within scope.', true),
  ('content.manage', 'content', 'manage', 'Manage content', 'Manage public and academy content within scope.', true),
  ('support.read', 'support', 'read', 'Read support', 'Read support cases within scope.', true),
  ('support.manage', 'support', 'manage', 'Manage support', 'Manage assigned support cases and escalations within scope.', true),
  ('security.read', 'security', 'read', 'Read security center', 'Read safeguarding and security signals within scope.', true),
  ('audit.read', 'audit', 'read', 'Read audit log', 'Read immutable audit events within scope.', true),
  ('settings.manage', 'settings', 'manage', 'Manage settings', 'Manage platform or scoped operational settings.', true)
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
    ('student', 'portal.student.view'),
    ('student', 'profile.read_own'),
    ('student', 'profile.update_own'),
    ('student', 'courses.read'),
    ('student', 'scheduling.read'),
    ('student', 'attendance.read'),
    ('student', 'support.read'),

    ('parent', 'portal.parent.view'),
    ('parent', 'profile.read_own'),
    ('parent', 'profile.update_own'),
    ('parent', 'child.read_linked'),
    ('parent', 'courses.read'),
    ('parent', 'scheduling.read'),
    ('parent', 'attendance.read'),
    ('parent', 'finance.read'),
    ('parent', 'support.read'),

    ('teacher', 'portal.teacher.view'),
    ('teacher', 'profile.read_own'),
    ('teacher', 'profile.update_own'),
    ('teacher', 'student.read_assigned'),
    ('teacher', 'courses.read'),
    ('teacher', 'scheduling.read'),
    ('teacher', 'scheduling.manage'),
    ('teacher', 'attendance.read'),
    ('teacher', 'attendance.manage'),
    ('teacher', 'finance.read'),
    ('teacher', 'support.read'),

    ('admission_officer', 'portal.staff.view'),
    ('admission_officer', 'profile.read_own'),
    ('admission_officer', 'profile.update_own'),
    ('admission_officer', 'users.read'),
    ('admission_officer', 'courses.read'),
    ('admission_officer', 'admissions.read'),
    ('admission_officer', 'admissions.manage'),
    ('admission_officer', 'scheduling.read'),
    ('admission_officer', 'scheduling.manage'),
    ('admission_officer', 'support.read'),

    ('academic_coordinator', 'portal.staff.view'),
    ('academic_coordinator', 'profile.read_own'),
    ('academic_coordinator', 'profile.update_own'),
    ('academic_coordinator', 'users.read'),
    ('academic_coordinator', 'roles.read'),
    ('academic_coordinator', 'courses.read'),
    ('academic_coordinator', 'courses.manage'),
    ('academic_coordinator', 'admissions.read'),
    ('academic_coordinator', 'admissions.manage'),
    ('academic_coordinator', 'scheduling.read'),
    ('academic_coordinator', 'scheduling.manage'),
    ('academic_coordinator', 'attendance.read'),
    ('academic_coordinator', 'attendance.manage'),
    ('academic_coordinator', 'support.read'),
    ('academic_coordinator', 'security.read'),
    ('academic_coordinator', 'audit.read'),

    ('finance_manager', 'portal.staff.view'),
    ('finance_manager', 'profile.read_own'),
    ('finance_manager', 'profile.update_own'),
    ('finance_manager', 'users.read'),
    ('finance_manager', 'finance.read'),
    ('finance_manager', 'finance.manage'),
    ('finance_manager', 'support.read'),
    ('finance_manager', 'audit.read'),

    ('support_agent', 'portal.staff.view'),
    ('support_agent', 'profile.read_own'),
    ('support_agent', 'profile.update_own'),
    ('support_agent', 'users.read'),
    ('support_agent', 'support.read'),
    ('support_agent', 'support.manage'),
    ('support_agent', 'security.read'),

    ('content_manager', 'portal.staff.view'),
    ('content_manager', 'profile.read_own'),
    ('content_manager', 'profile.update_own'),
    ('content_manager', 'courses.read'),
    ('content_manager', 'content.read'),
    ('content_manager', 'content.manage'),

    ('branch_manager', 'portal.staff.view'),
    ('branch_manager', 'profile.read_own'),
    ('branch_manager', 'profile.update_own'),
    ('branch_manager', 'users.read'),
    ('branch_manager', 'users.manage'),
    ('branch_manager', 'roles.read'),
    ('branch_manager', 'courses.read'),
    ('branch_manager', 'courses.manage'),
    ('branch_manager', 'admissions.read'),
    ('branch_manager', 'admissions.manage'),
    ('branch_manager', 'scheduling.read'),
    ('branch_manager', 'scheduling.manage'),
    ('branch_manager', 'attendance.read'),
    ('branch_manager', 'attendance.manage'),
    ('branch_manager', 'finance.read'),
    ('branch_manager', 'content.read'),
    ('branch_manager', 'content.manage'),
    ('branch_manager', 'support.read'),
    ('branch_manager', 'support.manage'),
    ('branch_manager', 'security.read'),
    ('branch_manager', 'audit.read'),

    ('super_admin', 'portal.admin.view'),
    ('super_admin', 'system.full_access')
)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from grants g
join public.roles r on r.key = g.role_key
join public.permissions p on p.key = g.permission_key
on conflict (role_id, permission_id) do nothing;

commit;
