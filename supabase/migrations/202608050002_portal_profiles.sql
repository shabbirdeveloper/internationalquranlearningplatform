begin;

create table public.student_profiles (
  user_id uuid primary key references public.users (id) on delete restrict,
  student_number text unique,
  date_of_birth date,
  gender text constraint student_profiles_gender_check check (
    gender is null or gender in ('male', 'female', 'not_specified')
  ),
  guardian_required boolean not null default false,
  enrollment_status text not null default 'prospective'
    constraint student_profiles_enrollment_status_check check (
      enrollment_status in ('prospective', 'trial', 'active', 'paused', 'completed', 'inactive')
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint student_profiles_birth_date_check check (
    date_of_birth is null or date_of_birth <= current_date
  )
);

create index student_profiles_status_idx
  on public.student_profiles (enrollment_status)
  where deleted_at is null;

create table public.parent_profiles (
  user_id uuid primary key references public.users (id) on delete restrict,
  occupation text,
  preferred_contact_channel text not null default 'email'
    constraint parent_profiles_contact_channel_check check (
      preferred_contact_channel in ('email', 'phone', 'whatsapp', 'in_app')
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table public.teacher_profiles (
  user_id uuid primary key references public.users (id) on delete restrict,
  teacher_number text unique,
  gender text constraint teacher_profiles_gender_check check (
    gender is null or gender in ('male', 'female', 'not_specified')
  ),
  country_code text,
  biography text,
  verification_status text not null default 'pending'
    constraint teacher_profiles_verification_status_check check (
      verification_status in (
        'pending', 'under_review', 'information_required', 'interview',
        'demo_class', 'reference_check', 'approved', 'rejected', 'suspended'
      )
    ),
  public_profile_enabled boolean not null default false,
  approved_at timestamptz,
  approved_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint teacher_profiles_country_code_check check (
    country_code is null or country_code ~ '^[A-Z]{2}$'
  ),
  constraint teacher_profiles_biography_length_check check (
    biography is null or char_length(biography) <= 5000
  ),
  constraint teacher_profiles_public_approval_check check (
    not public_profile_enabled or verification_status = 'approved'
  )
);

create index teacher_profiles_status_idx
  on public.teacher_profiles (verification_status)
  where deleted_at is null;
create index teacher_profiles_country_idx
  on public.teacher_profiles (country_code)
  where deleted_at is null;
create index teacher_profiles_approved_by_idx on public.teacher_profiles (approved_by);

create table public.parent_student_links (
  id uuid primary key default gen_random_uuid(),
  parent_user_id uuid not null references public.parent_profiles (user_id) on delete restrict,
  student_user_id uuid not null references public.student_profiles (user_id) on delete restrict,
  relationship text not null,
  status text not null default 'pending'
    constraint parent_student_links_status_check check (
      status in ('pending', 'active', 'rejected', 'revoked')
    ),
  can_view_messages boolean not null default true,
  requested_by uuid references public.users (id) on delete set null,
  approved_by uuid references public.users (id) on delete set null,
  approved_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint parent_student_links_distinct_users_check check (
    parent_user_id <> student_user_id
  ),
  constraint parent_student_links_relationship_length_check check (
    char_length(relationship) between 2 and 80
  )
);

create unique index parent_student_links_active_unique_idx
  on public.parent_student_links (parent_user_id, student_user_id)
  where status in ('pending', 'active') and deleted_at is null;
create index parent_student_links_student_idx
  on public.parent_student_links (student_user_id, status)
  where deleted_at is null;
create index parent_student_links_parent_idx
  on public.parent_student_links (parent_user_id, status)
  where deleted_at is null;
create index parent_student_links_requested_by_idx on public.parent_student_links (requested_by);
create index parent_student_links_approved_by_idx on public.parent_student_links (approved_by);

create trigger student_profiles_set_updated_at
before update on public.student_profiles
for each row execute function app_private.set_updated_at();

create trigger parent_profiles_set_updated_at
before update on public.parent_profiles
for each row execute function app_private.set_updated_at();

create trigger teacher_profiles_set_updated_at
before update on public.teacher_profiles
for each row execute function app_private.set_updated_at();

create trigger parent_student_links_set_updated_at
before update on public.parent_student_links
for each row execute function app_private.set_updated_at();

comment on table public.teacher_profiles is
  'Private operational teacher profile. A separate public projection is introduced with managed website content.';

commit;
