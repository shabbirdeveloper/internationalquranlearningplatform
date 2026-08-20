begin;

create or replace function app_private.current_user_has_permission(permission_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    join public.role_permissions rp on rp.role_id = r.id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = (select auth.uid())
      and ur.deleted_at is null
      and ur.revoked_at is null
      and ur.effective_from <= now()
      and (ur.expires_at is null or ur.expires_at > now())
      and r.deleted_at is null
      and r.is_active
      and p.deleted_at is null
      and p.is_active
      and (p.key = permission_key or p.key = 'system.full_access')
  );
$$;

create or replace function app_private.current_user_has_role(role_keys text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = (select auth.uid())
      and ur.deleted_at is null
      and ur.revoked_at is null
      and ur.effective_from <= now()
      and (ur.expires_at is null or ur.expires_at > now())
      and r.deleted_at is null
      and r.is_active
      and r.key = any(role_keys)
  );
$$;

create or replace function app_private.can_access_user(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    target_user_id = (select auth.uid())
    or app_private.current_user_has_permission('system.full_access')
    or exists (
      select 1
      from public.parent_student_links psl
      where psl.parent_user_id = (select auth.uid())
        and psl.student_user_id = target_user_id
        and psl.status = 'active'
        and psl.deleted_at is null
    );
$$;

create or replace function public.get_current_user_access()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'user_id', u.id,
    'email', u.email,
    'display_name', pr.full_name,
    'time_zone', coalesce(pr.time_zone, 'UTC'),
    'role_keys', coalesce((
      select jsonb_agg(role_key order by role_key)
      from (
        select distinct r.key as role_key
        from public.user_roles ur
        join public.roles r on r.id = ur.role_id
        where ur.user_id = u.id
          and ur.deleted_at is null
          and ur.revoked_at is null
          and ur.effective_from <= now()
          and (ur.expires_at is null or ur.expires_at > now())
          and r.deleted_at is null
          and r.is_active
      ) active_roles
    ), '[]'::jsonb),
    'permission_keys', coalesce((
      select jsonb_agg(permission_key order by permission_key)
      from (
        select distinct p.key as permission_key
        from public.user_roles ur
        join public.roles r on r.id = ur.role_id
        join public.role_permissions rp on rp.role_id = r.id
        join public.permissions p on p.id = rp.permission_id
        where ur.user_id = u.id
          and ur.deleted_at is null
          and ur.revoked_at is null
          and ur.effective_from <= now()
          and (ur.expires_at is null or ur.expires_at > now())
          and r.deleted_at is null
          and r.is_active
          and p.deleted_at is null
          and p.is_active
      ) active_permissions
    ), '[]'::jsonb)
  )
  from public.users u
  left join public.profiles pr
    on pr.user_id = u.id and pr.deleted_at is null
  where u.id = (select auth.uid())
    and u.deleted_at is null
    and u.status = 'active';
$$;

create or replace function public.log_audit_event(
  event_action text,
  event_target_table text default null,
  event_target_id uuid default null,
  event_before_data jsonb default null,
  event_after_data jsonb default null,
  event_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  audit_id uuid;
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  if not app_private.current_user_has_permission('system.full_access') then
    raise exception 'Insufficient permission';
  end if;

  if event_action !~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$' then
    raise exception 'Invalid audit action';
  end if;

  if jsonb_typeof(coalesce(event_metadata, '{}'::jsonb)) <> 'object' then
    raise exception 'Audit metadata must be a JSON object';
  end if;

  insert into public.audit_logs (
    actor_user_id,
    action,
    target_table,
    target_id,
    before_data,
    after_data,
    metadata
  ) values (
    (select auth.uid()),
    event_action,
    event_target_table,
    event_target_id,
    event_before_data,
    event_after_data,
    coalesce(event_metadata, '{}'::jsonb)
  )
  returning id into audit_id;

  return audit_id;
end;
$$;

revoke all on function public.get_current_user_access() from public;
revoke all on function public.log_audit_event(text, text, uuid, jsonb, jsonb, jsonb) from public;
grant execute on function public.get_current_user_access() to authenticated;
grant execute on function public.log_audit_event(text, text, uuid, jsonb, jsonb, jsonb) to authenticated;

revoke all on all tables in schema public from anon, authenticated;

grant select on public.users to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.roles to authenticated;
grant select, insert, update, delete on public.permissions to authenticated;
grant select, insert, update, delete on public.role_permissions to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select on public.audit_logs to authenticated;
grant select on public.student_profiles to authenticated;
grant select on public.parent_profiles to authenticated;
grant select on public.teacher_profiles to authenticated;
grant select, insert, update on public.parent_student_links to authenticated;

alter table public.users enable row level security;
alter table public.users force row level security;
alter table public.profiles enable row level security;
alter table public.profiles force row level security;
alter table public.roles enable row level security;
alter table public.roles force row level security;
alter table public.permissions enable row level security;
alter table public.permissions force row level security;
alter table public.role_permissions enable row level security;
alter table public.role_permissions force row level security;
alter table public.user_roles enable row level security;
alter table public.user_roles force row level security;
alter table public.audit_logs enable row level security;
alter table public.audit_logs force row level security;
alter table public.student_profiles enable row level security;
alter table public.student_profiles force row level security;
alter table public.parent_profiles enable row level security;
alter table public.parent_profiles force row level security;
alter table public.teacher_profiles enable row level security;
alter table public.teacher_profiles force row level security;
alter table public.parent_student_links enable row level security;
alter table public.parent_student_links force row level security;

create policy users_select_own_or_authorized
on public.users for select to authenticated
using (app_private.can_access_user(id));

create policy profiles_select_own_or_authorized
on public.profiles for select to authenticated
using (app_private.can_access_user(user_id));

create policy profiles_update_own
on public.profiles for update to authenticated
using ((select auth.uid()) = user_id and deleted_at is null)
with check ((select auth.uid()) = user_id and deleted_at is null);

create policy roles_select_authorized
on public.roles for select to authenticated
using (app_private.current_user_has_permission('roles.read'));

create policy roles_manage_authorized
on public.roles for all to authenticated
using (app_private.current_user_has_permission('roles.manage'))
with check (app_private.current_user_has_permission('roles.manage'));

create policy permissions_select_authorized
on public.permissions for select to authenticated
using (app_private.current_user_has_permission('roles.read'));

create policy permissions_manage_authorized
on public.permissions for all to authenticated
using (app_private.current_user_has_permission('roles.manage'))
with check (app_private.current_user_has_permission('roles.manage'));

create policy role_permissions_select_authorized
on public.role_permissions for select to authenticated
using (app_private.current_user_has_permission('roles.read'));

create policy role_permissions_manage_authorized
on public.role_permissions for all to authenticated
using (app_private.current_user_has_permission('roles.manage'))
with check (app_private.current_user_has_permission('roles.manage'));

create policy user_roles_select_own_or_authorized
on public.user_roles for select to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
);

create policy user_roles_manage_authorized
on public.user_roles for all to authenticated
using (app_private.current_user_has_permission('roles.manage'))
with check (app_private.current_user_has_permission('roles.manage'));

create policy audit_logs_select_authorized
on public.audit_logs for select to authenticated
using (app_private.current_user_has_permission('system.full_access'));

create policy student_profiles_select_authorized
on public.student_profiles for select to authenticated
using (app_private.can_access_user(user_id));

create policy parent_profiles_select_own_or_authorized
on public.parent_profiles for select to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
);

create policy teacher_profiles_select_own_or_authorized
on public.teacher_profiles for select to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
);

create policy parent_student_links_select_participant_or_authorized
on public.parent_student_links for select to authenticated
using (
  parent_user_id = (select auth.uid())
  or student_user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
);

create policy parent_student_links_request_own
on public.parent_student_links for insert to authenticated
with check (
  parent_user_id = (select auth.uid())
  and requested_by = (select auth.uid())
  and status = 'pending'
  and approved_by is null
  and approved_at is null
);

create policy parent_student_links_manage_authorized
on public.parent_student_links for update to authenticated
using (app_private.current_user_has_permission('system.full_access'))
with check (app_private.current_user_has_permission('system.full_access'));

grant usage on schema app_private to authenticated;
revoke all on all functions in schema app_private from public;
grant execute on function app_private.current_user_has_permission(text) to authenticated;
grant execute on function app_private.current_user_has_role(text[]) to authenticated;
grant execute on function app_private.can_access_user(uuid) to authenticated;

commit;
