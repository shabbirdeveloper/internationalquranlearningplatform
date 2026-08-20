begin;

create extension if not exists pgcrypto;

create schema if not exists app_private;
revoke all on schema app_private from public, anon, authenticated;

create table public.users (
  id uuid primary key references auth.users (id) on delete restrict,
  email text,
  status text not null default 'active'
    constraint users_status_check check (
      status in ('invited', 'active', 'locked', 'suspended', 'deactivated')
    ),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint users_email_length_check check (
    email is null or char_length(email) between 3 and 320
  )
);

create unique index users_active_email_unique_idx
  on public.users (lower(email))
  where email is not null and deleted_at is null;
create index users_status_idx on public.users (status) where deleted_at is null;

create table public.profiles (
  user_id uuid primary key references public.users (id) on delete restrict,
  full_name text,
  phone_e164 text,
  avatar_path text,
  preferred_locale text not null default 'en'
    constraint profiles_preferred_locale_check check (
      preferred_locale in ('en', 'ur', 'ar', 'fa')
    ),
  time_zone text not null default 'UTC',
  country_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_full_name_length_check check (
    full_name is null or char_length(full_name) between 1 and 160
  ),
  constraint profiles_phone_e164_check check (
    phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'
  ),
  constraint profiles_country_code_check check (
    country_code is null or country_code ~ '^[A-Z]{2}$'
  )
);

create index profiles_country_code_idx
  on public.profiles (country_code)
  where deleted_at is null;

create table public.roles (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  description text,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint roles_key_format_check check (key ~ '^[a-z][a-z0-9_]{1,63}$'),
  constraint roles_name_length_check check (char_length(name) between 2 and 100)
);

create index roles_active_idx on public.roles (key) where deleted_at is null and is_active;

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  module text not null,
  action text not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint permissions_key_format_check check (
    key ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$'
  ),
  constraint permissions_module_format_check check (module ~ '^[a-z][a-z0-9_]*$'),
  constraint permissions_action_format_check check (action ~ '^[a-z][a-z0-9_]*$')
);

create index permissions_module_action_idx
  on public.permissions (module, action)
  where deleted_at is null and is_active;

create table public.role_permissions (
  role_id uuid not null references public.roles (id) on delete restrict,
  permission_id uuid not null references public.permissions (id) on delete restrict,
  granted_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

create index role_permissions_permission_id_idx
  on public.role_permissions (permission_id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete restrict,
  role_id uuid not null references public.roles (id) on delete restrict,
  assigned_by uuid references public.users (id) on delete set null,
  effective_from timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  revoked_by uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint user_roles_effective_range_check check (
    expires_at is null or expires_at > effective_from
  ),
  constraint user_roles_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create unique index user_roles_active_unique_idx
  on public.user_roles (user_id, role_id)
  where revoked_at is null and deleted_at is null;
create index user_roles_user_lookup_idx
  on public.user_roles (user_id, effective_from, expires_at)
  where revoked_at is null and deleted_at is null;
create index user_roles_role_id_idx on public.user_roles (role_id);
create index user_roles_assigned_by_idx on public.user_roles (assigned_by);
create index user_roles_revoked_by_idx on public.user_roles (revoked_by);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users (id) on delete set null,
  action text not null,
  target_table text,
  target_id uuid,
  request_id uuid,
  ip_address inet,
  user_agent text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint audit_logs_action_format_check check (
    action ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$'
  ),
  constraint audit_logs_metadata_object_check check (jsonb_typeof(metadata) = 'object')
);

create index audit_logs_actor_created_idx
  on public.audit_logs (actor_user_id, created_at desc);
create index audit_logs_target_idx
  on public.audit_logs (target_table, target_id, created_at desc);
create index audit_logs_action_created_idx
  on public.audit_logs (action, created_at desc);

create or replace function app_private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
before update on public.users
for each row execute function app_private.set_updated_at();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function app_private.set_updated_at();

create trigger roles_set_updated_at
before update on public.roles
for each row execute function app_private.set_updated_at();

create trigger permissions_set_updated_at
before update on public.permissions
for each row execute function app_private.set_updated_at();

create trigger user_roles_set_updated_at
before update on public.user_roles
for each row execute function app_private.set_updated_at();

create or replace function app_private.handle_auth_user_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, status, last_login_at)
  values (new.id, new.email, 'active', new.last_sign_in_at)
  on conflict (id) do update
    set email = excluded.email,
        last_login_at = excluded.last_login_at,
        updated_at = now();

  insert into public.profiles (user_id, full_name, preferred_locale, time_zone)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    case
      when new.raw_user_meta_data ->> 'preferred_locale' in ('en', 'ur', 'ar', 'fa')
        then new.raw_user_meta_data ->> 'preferred_locale'
      else 'en'
    end,
    coalesce(nullif(new.raw_user_meta_data ->> 'time_zone', ''), 'UTC')
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function app_private.handle_auth_user_change();

create trigger on_auth_user_updated
after update of email, last_sign_in_at on auth.users
for each row execute function app_private.handle_auth_user_change();

comment on table public.audit_logs is
  'Append-only security and administration audit trail. Direct client writes are denied by RLS.';
comment on table public.user_roles is
  'Time-bounded role assignments with revocation history; rows are not hard-deleted in normal operation.';

commit;
