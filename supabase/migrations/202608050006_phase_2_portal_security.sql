begin;

create or replace function app_private.current_user_shares_branch(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.branch_memberships actor_membership
    join public.branch_memberships target_membership
      on target_membership.branch_id = actor_membership.branch_id
    where actor_membership.user_id = (select auth.uid())
      and actor_membership.status = 'active'
      and actor_membership.deleted_at is null
      and target_membership.user_id = target_user_id
      and target_membership.status = 'active'
      and target_membership.deleted_at is null
  );
$$;

create or replace function app_private.current_user_can_manage_branch(target_branch_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    app_private.current_user_has_permission('system.full_access')
    or (
      app_private.current_user_has_permission('users.manage')
      and exists (
        select 1
        from public.branch_memberships membership
        join public.roles role on role.id = membership.role_id
        where membership.user_id = (select auth.uid())
          and membership.branch_id = target_branch_id
          and membership.status = 'active'
          and membership.deleted_at is null
          and role.key = 'branch_manager'
          and role.is_active
          and role.deleted_at is null
      )
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
    )
    or (
      app_private.current_user_has_permission('users.read')
      and app_private.current_user_shares_branch(target_user_id)
    );
$$;

create or replace function app_private.write_audit_event(
  event_action text,
  event_target_table text,
  event_target_id uuid,
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
  created_audit_id uuid;
begin
  insert into public.audit_logs (
    actor_user_id, action, target_table, target_id, before_data, after_data, metadata
  ) values (
    (select auth.uid()), event_action, event_target_table, event_target_id,
    event_before_data, event_after_data, coalesce(event_metadata, '{}'::jsonb)
  ) returning id into created_audit_id;

  return created_audit_id;
end;
$$;

create or replace function app_private.audit_profile_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old is distinct from new then
    perform app_private.write_audit_event(
      'profile.updated', tg_table_name, new.user_id,
      to_jsonb(old) - 'phone_e164',
      to_jsonb(new) - 'phone_e164'
    );
  end if;
  return new;
end;
$$;

create trigger profiles_audit_update
after update on public.profiles
for each row execute function app_private.audit_profile_change();

create trigger student_profiles_audit_update
after update on public.student_profiles
for each row execute function app_private.audit_profile_change();

create trigger parent_profiles_audit_update
after update on public.parent_profiles
for each row execute function app_private.audit_profile_change();

create trigger teacher_profiles_audit_update
after update on public.teacher_profiles
for each row execute function app_private.audit_profile_change();

create or replace function public.request_parent_student_link(
  requested_student_number text,
  requested_relationship text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_student_id uuid;
  existing_link_id uuid;
  created_link_id uuid;
begin
  if (select auth.uid()) is null
    or not app_private.current_user_has_role(array['parent']) then
    raise exception 'Parent access required';
  end if;

  if char_length(trim(coalesce(requested_relationship, ''))) not between 2 and 80 then
    raise exception 'Invalid relationship';
  end if;

  select sp.user_id into target_student_id
  from public.student_profiles sp
  where upper(sp.student_number) = upper(trim(requested_student_number))
    and sp.deleted_at is null;

  if target_student_id is null then
    raise exception 'Student record was not found';
  end if;

  select psl.id into existing_link_id
  from public.parent_student_links psl
  where psl.parent_user_id = (select auth.uid())
    and psl.student_user_id = target_student_id
    and psl.status in ('pending', 'active')
    and psl.deleted_at is null;

  if existing_link_id is not null then
    return existing_link_id;
  end if;

  insert into public.parent_student_links (
    parent_user_id, student_user_id, relationship, status, requested_by
  ) values (
    (select auth.uid()), target_student_id, trim(requested_relationship),
    'pending', (select auth.uid())
  ) returning id into created_link_id;

  perform app_private.write_audit_event(
    'parent_link.requested', 'parent_student_links', created_link_id,
    null, jsonb_build_object('status', 'pending')
  );

  return created_link_id;
end;
$$;

create or replace function public.review_parent_student_link(
  target_link_id uuid,
  decision text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_link public.parent_student_links%rowtype;
begin
  if not app_private.current_user_has_permission('system.full_access') then
    raise exception 'Insufficient permission';
  end if;

  if decision not in ('active', 'rejected') then
    raise exception 'Invalid decision';
  end if;

  select * into previous_link
  from public.parent_student_links
  where id = target_link_id and status = 'pending' and deleted_at is null
  for update;

  if not found then
    raise exception 'Pending link was not found';
  end if;

  update public.parent_student_links
  set status = decision,
      approved_by = case when decision = 'active' then (select auth.uid()) else null end,
      approved_at = case when decision = 'active' then now() else null end
  where id = target_link_id;

  perform app_private.write_audit_event(
    'parent_link.reviewed', 'parent_student_links', target_link_id,
    jsonb_build_object('status', previous_link.status),
    jsonb_build_object('status', decision)
  );
end;
$$;

create or replace function public.replace_teacher_languages(language_codes text[])
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  language_code text;
  normalized_codes text[];
begin
  if not app_private.current_user_has_role(array['teacher']) then
    raise exception 'Teacher access required';
  end if;

  select array_agg(distinct lower(trim(code))) into normalized_codes
  from unnest(coalesce(language_codes, '{}'::text[])) code;

  if coalesce(cardinality(normalized_codes), 0) not between 1 and 10 then
    raise exception 'Select between one and ten languages';
  end if;

  foreach language_code in array normalized_codes loop
    if language_code !~ '^[a-z]{2,3}(-[A-Z]{2})?$' then
      raise exception 'Invalid language code';
    end if;
  end loop;

  update public.teacher_languages
  set deleted_at = now()
  where teacher_user_id = (select auth.uid()) and deleted_at is null;

  foreach language_code in array normalized_codes loop
    insert into public.teacher_languages (teacher_user_id, language_code)
    values ((select auth.uid()), language_code);
  end loop;

  perform app_private.write_audit_event(
    'teacher.languages_updated', 'teacher_profiles', (select auth.uid()),
    null, jsonb_build_object('language_codes', normalized_codes)
  );
end;
$$;

create or replace function public.replace_teacher_availability(availability_slots jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  slot jsonb;
begin
  if not app_private.current_user_has_role(array['teacher']) then
    raise exception 'Teacher access required';
  end if;

  if jsonb_typeof(coalesce(availability_slots, '[]'::jsonb)) <> 'array'
    or jsonb_array_length(coalesce(availability_slots, '[]'::jsonb)) > 21 then
    raise exception 'Invalid availability';
  end if;

  update public.teacher_availability
  set deleted_at = now(), is_active = false
  where teacher_user_id = (select auth.uid()) and deleted_at is null;

  for slot in select value from jsonb_array_elements(availability_slots) loop
    insert into public.teacher_availability (
      teacher_user_id, weekday, local_start_time, local_end_time, time_zone
    ) values (
      (select auth.uid()),
      (slot ->> 'weekday')::smallint,
      (slot ->> 'start_time')::time,
      (slot ->> 'end_time')::time,
      slot ->> 'time_zone'
    );
  end loop;

  perform app_private.write_audit_event(
    'teacher.availability_updated', 'teacher_profiles', (select auth.uid()),
    null, jsonb_build_object('slot_count', jsonb_array_length(availability_slots))
  );
end;
$$;

create or replace function public.update_teacher_portal_profile(
  profile_biography text,
  profile_gender text,
  profile_country_code text,
  profile_education_summary text,
  profile_hawza_qualifications text,
  profile_teaching_experience_years smallint,
  profile_preferred_age_groups text[],
  profile_language_codes text[],
  profile_availability_slots jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not app_private.current_user_has_role(array['teacher']) then
    raise exception 'Teacher access required';
  end if;

  update public.teacher_profiles
  set biography = nullif(trim(profile_biography), ''),
      gender = profile_gender,
      country_code = upper(nullif(trim(profile_country_code), '')),
      education_summary = nullif(trim(profile_education_summary), ''),
      hawza_qualifications = nullif(trim(profile_hawza_qualifications), ''),
      teaching_experience_years = profile_teaching_experience_years,
      preferred_student_age_groups = coalesce(profile_preferred_age_groups, '{}'::text[])
  where user_id = (select auth.uid()) and deleted_at is null;

  if not found then
    raise exception 'Teacher profile was not found';
  end if;

  perform public.replace_teacher_languages(profile_language_codes);
  perform public.replace_teacher_availability(profile_availability_slots);
end;
$$;

create or replace function public.submit_teacher_application()
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  application_id uuid;
begin
  if not app_private.current_user_has_role(array['teacher']) then
    raise exception 'Teacher access required';
  end if;

  if not exists (
    select 1 from public.teacher_profiles tp
    where tp.user_id = (select auth.uid())
      and tp.deleted_at is null
      and nullif(trim(tp.biography), '') is not null
      and tp.country_code is not null
      and nullif(trim(tp.education_summary), '') is not null
  ) or not exists (
    select 1 from public.teacher_languages tl
    where tl.teacher_user_id = (select auth.uid()) and tl.deleted_at is null
  ) or not exists (
    select 1 from public.teacher_availability ta
    where ta.teacher_user_id = (select auth.uid())
      and ta.is_active and ta.deleted_at is null
  ) then
    raise exception 'Complete the professional profile, languages, and availability first';
  end if;

  if not exists (
    select 1 from public.teacher_documents td
    where td.teacher_user_id = (select auth.uid())
      and td.document_type = 'identity' and td.deleted_at is null
  ) or not exists (
    select 1 from public.teacher_documents td
    where td.teacher_user_id = (select auth.uid())
      and td.document_type = 'qualification' and td.deleted_at is null
  ) then
    raise exception 'Identity and qualification documents are required';
  end if;

  update public.teacher_applications
  set status = 'submitted', submitted_at = now()
  where teacher_user_id = (select auth.uid())
    and status in ('draft', 'information_requested')
    and deleted_at is null
  returning id into application_id;

  if application_id is null then
    raise exception 'Application cannot be submitted from its current status';
  end if;

  update public.teacher_profiles
  set verification_status = 'under_review'
  where user_id = (select auth.uid());

  perform app_private.write_audit_event(
    'teacher_application.submitted', 'teacher_applications', application_id,
    null, jsonb_build_object('status', 'submitted')
  );

  return application_id;
end;
$$;

create or replace function public.review_teacher_application(
  target_application_id uuid,
  next_status text,
  review_notes text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  previous_application public.teacher_applications%rowtype;
  transition_allowed boolean;
begin
  if not app_private.current_user_has_permission('teacher_applications.review') then
    raise exception 'Insufficient permission';
  end if;

  select * into previous_application
  from public.teacher_applications
  where id = target_application_id and deleted_at is null
  for update;

  if not found then
    raise exception 'Teacher application was not found';
  end if;

  transition_allowed := case previous_application.status
    when 'submitted' then next_status in ('documents_under_review', 'information_requested', 'rejected')
    when 'documents_under_review' then next_status in ('information_requested', 'interview_scheduled', 'rejected')
    when 'information_requested' then next_status in ('documents_under_review', 'rejected')
    when 'interview_scheduled' then next_status = 'interview_completed'
    when 'interview_completed' then next_status in ('demo_scheduled', 'reference_verification', 'rejected')
    when 'demo_scheduled' then next_status = 'demo_evaluated'
    when 'demo_evaluated' then next_status in ('reference_verification', 'rejected')
    when 'reference_verification' then next_status in ('approved', 'rejected')
    when 'approved' then next_status = 'suspended'
    when 'suspended' then next_status in ('approved', 'rejected')
    else false
  end;

  if not transition_allowed then
    raise exception 'Invalid application status transition';
  end if;

  update public.teacher_applications
  set status = next_status,
      assigned_reviewer_id = (select auth.uid()),
      decided_at = case when next_status in ('approved', 'rejected') then now() else decided_at end
  where id = target_application_id;

  insert into public.teacher_application_reviews (
    application_id, reviewer_user_id, review_type, from_status, to_status, notes
  ) values (
    target_application_id, (select auth.uid()),
    case
      when next_status = 'information_requested' then 'information_request'
      when next_status in ('approved', 'rejected') then 'decision'
      when next_status like 'interview_%' then 'interview'
      when next_status like 'demo_%' then 'demo'
      when next_status = 'reference_verification' then 'reference'
      else 'status_change'
    end,
    previous_application.status, next_status, nullif(trim(review_notes), '')
  );

  update public.teacher_profiles
  set verification_status = case
        when next_status = 'documents_under_review' then 'under_review'
        when next_status = 'information_requested' then 'information_required'
        when next_status like 'interview_%' then 'interview'
        when next_status like 'demo_%' then 'demo_class'
        when next_status = 'reference_verification' then 'reference_check'
        when next_status = 'approved' then 'approved'
        when next_status = 'rejected' then 'rejected'
        when next_status = 'suspended' then 'suspended'
        else verification_status
      end,
      approved_at = case when next_status = 'approved' then now() else approved_at end,
      approved_by = case when next_status = 'approved' then (select auth.uid()) else approved_by end,
      public_profile_enabled = case when next_status in ('rejected', 'suspended') then false else public_profile_enabled end
  where user_id = previous_application.teacher_user_id;

  perform app_private.write_audit_event(
    'teacher_application.reviewed', 'teacher_applications', target_application_id,
    jsonb_build_object('status', previous_application.status),
    jsonb_build_object('status', next_status)
  );
end;
$$;

create or replace function public.create_branch(
  branch_code text,
  branch_name text,
  branch_time_zone text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_branch_id uuid;
begin
  if not app_private.current_user_has_permission('system.full_access') then
    raise exception 'Insufficient permission';
  end if;

  insert into public.branches (code, name, time_zone, created_by)
  values (upper(trim(branch_code)), trim(branch_name), trim(branch_time_zone), (select auth.uid()))
  returning id into created_branch_id;

  perform app_private.write_audit_event(
    'branch.created', 'branches', created_branch_id,
    null, jsonb_build_object('code', upper(trim(branch_code)), 'name', trim(branch_name))
  );

  return created_branch_id;
end;
$$;

create or replace function public.assign_staff_to_branch(
  staff_email text,
  target_branch_id uuid,
  target_role_key text,
  staff_job_title text default null
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_user_id uuid;
  target_role_id uuid;
  existing_user_role_id uuid;
  created_membership_id uuid;
begin
  if not app_private.current_user_can_manage_branch(target_branch_id) then
    raise exception 'Insufficient branch permission';
  end if;

  if target_role_key not in (
    'admission_officer', 'academic_coordinator', 'finance_manager',
    'support_agent', 'content_manager'
  ) and not (
    target_role_key = 'branch_manager'
    and app_private.current_user_has_permission('system.full_access')
  ) then
    raise exception 'Role cannot be delegated';
  end if;

  select u.id into target_user_id
  from public.users u
  where lower(u.email) = lower(trim(staff_email))
    and u.status = 'active' and u.deleted_at is null;

  select r.id into target_role_id
  from public.roles r
  where r.key = target_role_key and r.is_active and r.deleted_at is null;

  if target_user_id is null or target_role_id is null then
    raise exception 'Active user or role was not found';
  end if;

  insert into public.staff_profiles (user_id, job_title)
  values (target_user_id, nullif(trim(staff_job_title), ''))
  on conflict (user_id) do update
    set job_title = coalesce(excluded.job_title, public.staff_profiles.job_title),
        deleted_at = null;

  select ur.id into existing_user_role_id
  from public.user_roles ur
  where ur.user_id = target_user_id and ur.role_id = target_role_id
    and ur.revoked_at is null and ur.deleted_at is null;

  if existing_user_role_id is null then
    insert into public.user_roles (user_id, role_id, assigned_by)
    values (target_user_id, target_role_id, (select auth.uid()));
  end if;

  select bm.id into created_membership_id
  from public.branch_memberships bm
  where bm.branch_id = target_branch_id and bm.user_id = target_user_id
    and bm.role_id = target_role_id and bm.status = 'active' and bm.deleted_at is null;

  if created_membership_id is null then
    insert into public.branch_memberships (
      branch_id, user_id, role_id, status, assigned_by
    ) values (
      target_branch_id, target_user_id, target_role_id, 'active', (select auth.uid())
    ) returning id into created_membership_id;
  end if;

  perform app_private.write_audit_event(
    'staff.branch_assigned', 'branch_memberships', created_membership_id,
    null, jsonb_build_object('branch_id', target_branch_id, 'role_key', target_role_key)
  );

  return created_membership_id;
end;
$$;

revoke insert, update on public.parent_student_links from authenticated;
revoke all on public.student_profiles, public.parent_profiles, public.teacher_profiles from authenticated;

grant select on public.student_profiles, public.parent_profiles, public.teacher_profiles to authenticated;
grant update (date_of_birth, gender, guardian_required) on public.student_profiles to authenticated;
grant update (occupation, preferred_contact_channel) on public.parent_profiles to authenticated;
grant update (
  gender, country_code, biography, education_summary, hawza_qualifications,
  teaching_experience_years, preferred_student_age_groups
) on public.teacher_profiles to authenticated;

grant select on public.branches, public.staff_profiles, public.branch_memberships to authenticated;
grant select on public.teacher_languages, public.teacher_availability to authenticated;
grant select on public.teacher_applications, public.teacher_application_reviews to authenticated;
grant select, insert on public.teacher_documents to authenticated;

alter table public.branches enable row level security;
alter table public.branches force row level security;
alter table public.staff_profiles enable row level security;
alter table public.staff_profiles force row level security;
alter table public.branch_memberships enable row level security;
alter table public.branch_memberships force row level security;
alter table public.teacher_languages enable row level security;
alter table public.teacher_languages force row level security;
alter table public.teacher_availability enable row level security;
alter table public.teacher_availability force row level security;
alter table public.teacher_applications enable row level security;
alter table public.teacher_applications force row level security;
alter table public.teacher_documents enable row level security;
alter table public.teacher_documents force row level security;
alter table public.teacher_application_reviews enable row level security;
alter table public.teacher_application_reviews force row level security;

create policy student_profiles_update_own
on public.student_profiles for update to authenticated
using (user_id = (select auth.uid()) and deleted_at is null)
with check (user_id = (select auth.uid()) and deleted_at is null);

create policy parent_profiles_update_own
on public.parent_profiles for update to authenticated
using (user_id = (select auth.uid()) and deleted_at is null)
with check (user_id = (select auth.uid()) and deleted_at is null);

create policy teacher_profiles_update_own
on public.teacher_profiles for update to authenticated
using (user_id = (select auth.uid()) and deleted_at is null)
with check (user_id = (select auth.uid()) and deleted_at is null);

create policy branches_select_scoped
on public.branches for select to authenticated
using (
  app_private.current_user_has_permission('system.full_access')
  or exists (
    select 1 from public.branch_memberships bm
    where bm.branch_id = id and bm.user_id = (select auth.uid())
      and bm.status = 'active' and bm.deleted_at is null
  )
);

create policy staff_profiles_select_scoped
on public.staff_profiles for select to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
  or (
    app_private.current_user_has_permission('users.read')
    and app_private.current_user_shares_branch(user_id)
  )
);

create policy branch_memberships_select_scoped
on public.branch_memberships for select to authenticated
using (
  user_id = (select auth.uid())
  or app_private.current_user_has_permission('system.full_access')
  or app_private.current_user_can_manage_branch(branch_id)
);

create policy teacher_languages_select_authorized
on public.teacher_languages for select to authenticated
using (
  teacher_user_id = (select auth.uid())
  or app_private.current_user_has_permission('teacher_applications.review')
  or app_private.current_user_has_permission('system.full_access')
);

create policy teacher_availability_select_authorized
on public.teacher_availability for select to authenticated
using (
  teacher_user_id = (select auth.uid())
  or app_private.current_user_has_permission('teacher_applications.review')
  or app_private.current_user_has_permission('system.full_access')
);

create policy teacher_applications_select_authorized
on public.teacher_applications for select to authenticated
using (
  teacher_user_id = (select auth.uid())
  or app_private.current_user_has_permission('teacher_applications.review')
  or app_private.current_user_has_permission('system.full_access')
);

create policy teacher_documents_select_authorized
on public.teacher_documents for select to authenticated
using (
  teacher_user_id = (select auth.uid())
  or app_private.current_user_has_permission('teacher_applications.review')
  or app_private.current_user_has_permission('system.full_access')
);

create policy teacher_documents_insert_own_quarantine
on public.teacher_documents for insert to authenticated
with check (
  teacher_user_id = (select auth.uid())
  and object_path like (select auth.uid())::text || '/%'
  and scan_status = 'quarantined'
  and review_status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
  and (
    application_id is null
    or exists (
      select 1 from public.teacher_applications ta
      where ta.id = application_id
        and ta.teacher_user_id = (select auth.uid())
        and ta.deleted_at is null
    )
  )
);

create policy teacher_application_reviews_select_authorized
on public.teacher_application_reviews for select to authenticated
using (
  exists (
    select 1 from public.teacher_applications ta
    where ta.id = application_id and ta.teacher_user_id = (select auth.uid())
  )
  or app_private.current_user_has_permission('teacher_applications.review')
  or app_private.current_user_has_permission('system.full_access')
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'teacher-private', 'teacher-private', false, 5242880,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy teacher_private_insert_own_quarantine
on storage.objects for insert to authenticated
with check (
  bucket_id = 'teacher-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy teacher_private_select_owner_or_clean_reviewer
on storage.objects for select to authenticated
using (
  bucket_id = 'teacher-private'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or exists (
      select 1 from public.teacher_documents td
      where td.object_path = name
        and td.scan_status = 'clean'
        and td.deleted_at is null
        and (
          app_private.current_user_has_permission('teacher_applications.review')
          or app_private.current_user_has_permission('system.full_access')
        )
    )
  )
);

create policy teacher_private_delete_own_quarantine
on storage.objects for delete to authenticated
using (
  bucket_id = 'teacher-private'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1 from public.teacher_documents td
    where td.object_path = name
      and td.scan_status in ('quarantined', 'rejected')
      and td.deleted_at is null
  )
);

revoke all on function public.request_parent_student_link(text, text) from public;
revoke all on function public.review_parent_student_link(uuid, text) from public;
revoke all on function public.replace_teacher_languages(text[]) from public;
revoke all on function public.replace_teacher_availability(jsonb) from public;
revoke all on function public.update_teacher_portal_profile(
  text, text, text, text, text, smallint, text[], text[], jsonb
) from public;
revoke all on function public.submit_teacher_application() from public;
revoke all on function public.review_teacher_application(uuid, text, text) from public;
revoke all on function public.create_branch(text, text, text) from public;
revoke all on function public.assign_staff_to_branch(text, uuid, text, text) from public;

grant execute on function public.request_parent_student_link(text, text) to authenticated;
grant execute on function public.review_parent_student_link(uuid, text) to authenticated;
grant execute on function public.replace_teacher_languages(text[]) to authenticated;
grant execute on function public.replace_teacher_availability(jsonb) to authenticated;
grant execute on function public.update_teacher_portal_profile(
  text, text, text, text, text, smallint, text[], text[], jsonb
) to authenticated;
grant execute on function public.submit_teacher_application() to authenticated;
grant execute on function public.review_teacher_application(uuid, text, text) to authenticated;
grant execute on function public.create_branch(text, text, text) to authenticated;
grant execute on function public.assign_staff_to_branch(text, uuid, text, text) to authenticated;

revoke all on function app_private.current_user_shares_branch(uuid) from public;
revoke all on function app_private.current_user_can_manage_branch(uuid) from public;
revoke all on function app_private.write_audit_event(text, text, uuid, jsonb, jsonb, jsonb) from public;
grant execute on function app_private.current_user_shares_branch(uuid) to authenticated;
grant execute on function app_private.current_user_can_manage_branch(uuid) to authenticated;

commit;
