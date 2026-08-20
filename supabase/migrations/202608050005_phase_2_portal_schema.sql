begin;

alter table public.profiles
  add column onboarding_completed_at timestamptz;

alter table public.teacher_profiles
  add column education_summary text,
  add column hawza_qualifications text,
  add column teaching_experience_years smallint,
  add column preferred_student_age_groups text[] not null default '{}'::text[];

alter table public.teacher_profiles
  add constraint teacher_profiles_education_length_check
    check (education_summary is null or char_length(education_summary) <= 3000),
  add constraint teacher_profiles_hawza_length_check
    check (hawza_qualifications is null or char_length(hawza_qualifications) <= 3000),
  add constraint teacher_profiles_experience_check
    check (teaching_experience_years is null or teaching_experience_years between 0 and 80),
  add constraint teacher_profiles_age_groups_check
    check (
      preferred_student_age_groups <@ array['children', 'teens', 'adults']::text[]
    );

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  time_zone text not null default 'UTC',
  is_active boolean not null default true,
  created_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint branches_code_check check (code ~ '^[A-Z][A-Z0-9_-]{1,31}$'),
  constraint branches_name_check check (char_length(name) between 2 and 120),
  constraint branches_time_zone_check check (char_length(time_zone) between 1 and 100)
);

create index branches_active_idx
  on public.branches (name)
  where deleted_at is null and is_active;
create index branches_created_by_idx on public.branches (created_by);

create table public.staff_profiles (
  user_id uuid primary key references public.users (id) on delete restrict,
  employee_number text unique,
  job_title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint staff_profiles_job_title_check check (
    job_title is null or char_length(job_title) between 2 and 120
  )
);

create table public.branch_memberships (
  id uuid primary key default gen_random_uuid(),
  branch_id uuid not null references public.branches (id) on delete restrict,
  user_id uuid not null references public.users (id) on delete restrict,
  role_id uuid not null references public.roles (id) on delete restrict,
  status text not null default 'active'
    constraint branch_memberships_status_check check (
      status in ('invited', 'active', 'suspended', 'revoked')
    ),
  is_primary boolean not null default false,
  assigned_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz,
  deleted_at timestamptz
);

create unique index branch_memberships_active_unique_idx
  on public.branch_memberships (branch_id, user_id, role_id)
  where status in ('invited', 'active') and deleted_at is null;
create unique index branch_memberships_primary_unique_idx
  on public.branch_memberships (user_id)
  where is_primary and status = 'active' and deleted_at is null;
create index branch_memberships_user_scope_idx
  on public.branch_memberships (user_id, branch_id)
  where status = 'active' and deleted_at is null;
create index branch_memberships_branch_scope_idx
  on public.branch_memberships (branch_id, user_id)
  where status = 'active' and deleted_at is null;
create index branch_memberships_role_id_idx on public.branch_memberships (role_id);
create index branch_memberships_assigned_by_idx on public.branch_memberships (assigned_by);

create table public.teacher_languages (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references public.teacher_profiles (user_id) on delete restrict,
  language_code text not null,
  proficiency text not null default 'professional'
    constraint teacher_languages_proficiency_check check (
      proficiency in ('native', 'fluent', 'professional', 'conversational')
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint teacher_languages_code_check check (
    language_code ~ '^[a-z]{2,3}(-[A-Z]{2})?$'
  )
);

create unique index teacher_languages_active_unique_idx
  on public.teacher_languages (teacher_user_id, language_code)
  where deleted_at is null;
create index teacher_languages_teacher_idx
  on public.teacher_languages (teacher_user_id)
  where deleted_at is null;

create table public.teacher_availability (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references public.teacher_profiles (user_id) on delete restrict,
  weekday smallint not null,
  local_start_time time not null,
  local_end_time time not null,
  time_zone text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint teacher_availability_weekday_check check (weekday between 0 and 6),
  constraint teacher_availability_time_check check (local_end_time > local_start_time),
  constraint teacher_availability_time_zone_check check (char_length(time_zone) between 1 and 100)
);

create unique index teacher_availability_active_unique_idx
  on public.teacher_availability (
    teacher_user_id, weekday, local_start_time, local_end_time, time_zone
  )
  where is_active and deleted_at is null;
create index teacher_availability_teacher_day_idx
  on public.teacher_availability (teacher_user_id, weekday, local_start_time)
  where is_active and deleted_at is null;

create table public.teacher_applications (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null unique references public.teacher_profiles (user_id) on delete restrict,
  application_number text not null unique default (
    'TCH-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))
  ),
  status text not null default 'draft'
    constraint teacher_applications_status_check check (
      status in (
        'draft', 'submitted', 'documents_under_review', 'information_requested',
        'interview_scheduled', 'interview_completed', 'demo_scheduled',
        'demo_evaluated', 'reference_verification', 'approved', 'rejected',
        'suspended'
      )
    ),
  submitted_at timestamptz,
  decided_at timestamptz,
  assigned_reviewer_id uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index teacher_applications_status_created_idx
  on public.teacher_applications (status, created_at desc)
  where deleted_at is null;
create index teacher_applications_reviewer_idx
  on public.teacher_applications (assigned_reviewer_id, status)
  where deleted_at is null;

create table public.teacher_documents (
  id uuid primary key default gen_random_uuid(),
  teacher_user_id uuid not null references public.teacher_profiles (user_id) on delete restrict,
  application_id uuid references public.teacher_applications (id) on delete restrict,
  document_type text not null
    constraint teacher_documents_type_check check (
      document_type in (
        'identity', 'qualification', 'hawza_certificate', 'reference', 'intro_video', 'other'
      )
    ),
  object_path text not null unique,
  original_filename text not null,
  content_type text not null,
  size_bytes bigint not null,
  scan_status text not null default 'quarantined'
    constraint teacher_documents_scan_status_check check (
      scan_status in ('quarantined', 'scanning', 'clean', 'rejected')
    ),
  review_status text not null default 'pending'
    constraint teacher_documents_review_status_check check (
      review_status in ('pending', 'accepted', 'rejected')
    ),
  uploaded_at timestamptz not null default now(),
  reviewed_by uuid references public.users (id) on delete set null,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint teacher_documents_path_check check (
    object_path !~ '(^/|\.\.)' and char_length(object_path) between 8 and 500
  ),
  constraint teacher_documents_filename_check check (
    char_length(original_filename) between 1 and 240
  ),
  constraint teacher_documents_content_type_check check (
    content_type in ('application/pdf', 'image/jpeg', 'image/png')
  ),
  constraint teacher_documents_size_check check (size_bytes between 1 and 5242880),
  constraint teacher_documents_rejection_reason_check check (
    rejection_reason is null or char_length(rejection_reason) <= 1000
  )
);

create index teacher_documents_teacher_created_idx
  on public.teacher_documents (teacher_user_id, created_at desc)
  where deleted_at is null;
create index teacher_documents_application_idx
  on public.teacher_documents (application_id)
  where deleted_at is null;
create index teacher_documents_review_queue_idx
  on public.teacher_documents (scan_status, review_status, created_at)
  where deleted_at is null;
create index teacher_documents_reviewed_by_idx on public.teacher_documents (reviewed_by);

create table public.teacher_application_reviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.teacher_applications (id) on delete restrict,
  reviewer_user_id uuid references public.users (id) on delete set null,
  review_type text not null
    constraint teacher_application_reviews_type_check check (
      review_type in (
        'status_change', 'information_request', 'interview', 'demo', 'reference', 'decision'
      )
    ),
  from_status text,
  to_status text not null,
  notes text,
  created_at timestamptz not null default now(),
  constraint teacher_application_reviews_notes_check check (
    notes is null or char_length(notes) <= 5000
  )
);

create index teacher_application_reviews_application_created_idx
  on public.teacher_application_reviews (application_id, created_at desc);
create index teacher_application_reviews_reviewer_idx
  on public.teacher_application_reviews (reviewer_user_id, created_at desc);

create trigger branches_set_updated_at
before update on public.branches
for each row execute function app_private.set_updated_at();

create trigger staff_profiles_set_updated_at
before update on public.staff_profiles
for each row execute function app_private.set_updated_at();

create trigger branch_memberships_set_updated_at
before update on public.branch_memberships
for each row execute function app_private.set_updated_at();

create trigger teacher_languages_set_updated_at
before update on public.teacher_languages
for each row execute function app_private.set_updated_at();

create trigger teacher_availability_set_updated_at
before update on public.teacher_availability
for each row execute function app_private.set_updated_at();

create trigger teacher_applications_set_updated_at
before update on public.teacher_applications
for each row execute function app_private.set_updated_at();

create trigger teacher_documents_set_updated_at
before update on public.teacher_documents
for each row execute function app_private.set_updated_at();

create or replace function app_private.sync_role_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned_role_key text;
begin
  select r.key into assigned_role_key
  from public.roles r
  where r.id = new.role_id;

  if assigned_role_key = 'student' then
    insert into public.student_profiles (user_id) values (new.user_id)
    on conflict (user_id) do nothing;
  elsif assigned_role_key = 'parent' then
    insert into public.parent_profiles (user_id) values (new.user_id)
    on conflict (user_id) do nothing;
  elsif assigned_role_key = 'teacher' then
    insert into public.teacher_profiles (user_id) values (new.user_id)
    on conflict (user_id) do nothing;

    insert into public.teacher_applications (teacher_user_id) values (new.user_id)
    on conflict (teacher_user_id) do nothing;
  elsif assigned_role_key in (
    'admission_officer', 'academic_coordinator', 'finance_manager',
    'support_agent', 'content_manager', 'branch_manager'
  ) then
    insert into public.staff_profiles (user_id) values (new.user_id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

create trigger user_roles_sync_profile
after insert or update of role_id, revoked_at, deleted_at on public.user_roles
for each row
when (new.revoked_at is null and new.deleted_at is null)
execute function app_private.sync_role_profile();

insert into public.student_profiles (user_id)
select distinct ur.user_id
from public.user_roles ur
join public.roles r on r.id = ur.role_id and r.key = 'student'
where ur.revoked_at is null and ur.deleted_at is null
on conflict (user_id) do nothing;

insert into public.parent_profiles (user_id)
select distinct ur.user_id
from public.user_roles ur
join public.roles r on r.id = ur.role_id and r.key = 'parent'
where ur.revoked_at is null and ur.deleted_at is null
on conflict (user_id) do nothing;

insert into public.teacher_profiles (user_id)
select distinct ur.user_id
from public.user_roles ur
join public.roles r on r.id = ur.role_id and r.key = 'teacher'
where ur.revoked_at is null and ur.deleted_at is null
on conflict (user_id) do nothing;

insert into public.teacher_applications (teacher_user_id)
select tp.user_id from public.teacher_profiles tp
where tp.deleted_at is null
on conflict (teacher_user_id) do nothing;

insert into public.staff_profiles (user_id)
select distinct ur.user_id
from public.user_roles ur
join public.roles r on r.id = ur.role_id
where r.key in (
    'admission_officer', 'academic_coordinator', 'finance_manager',
    'support_agent', 'content_manager', 'branch_manager'
  )
  and ur.revoked_at is null
  and ur.deleted_at is null
on conflict (user_id) do nothing;

comment on table public.teacher_documents is
  'Private metadata for teacher files. Objects remain quarantined until an external scanner marks them clean.';
comment on table public.branch_memberships is
  'Establishes the row scope for delegated staff permissions; global permissions alone do not grant cross-branch access.';

commit;
