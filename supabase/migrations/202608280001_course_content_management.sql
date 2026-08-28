begin;

alter table public.courses
  add column if not exists cover_image_url text,
  add column if not exists detail_image_url text,
  add column if not exists method_image_url text,
  add column if not exists overview_heading text,
  add column if not exists guidance_heading text,
  add column if not exists guidance_body text,
  add column if not exists audience_heading text,
  add column if not exists audience_body text,
  add column if not exists benefits_heading text,
  add column if not exists benefits jsonb not null default '[]'::jsonb,
  add column if not exists method_heading text,
  add column if not exists method_body text;

alter table public.courses
  add constraint courses_cover_image_path_check check (cover_image_url is null or cover_image_url ~ '^/images/[A-Za-z0-9._/-]+$') not valid,
  add constraint courses_detail_image_path_check check (detail_image_url is null or detail_image_url ~ '^/images/[A-Za-z0-9._/-]+$') not valid,
  add constraint courses_method_image_path_check check (method_image_url is null or method_image_url ~ '^/images/[A-Za-z0-9._/-]+$') not valid,
  add constraint courses_benefits_array_check check (jsonb_typeof(benefits) = 'array') not valid,
  add constraint courses_outcomes_array_check check (jsonb_typeof(outcomes) = 'array') not valid,
  add constraint courses_syllabus_array_check check (jsonb_typeof(syllabus) = 'array') not valid;

create policy courses_staff_read on public.courses
for select to authenticated
using (
  app_private.current_user_has_permission('courses.read')
  or app_private.current_user_has_permission('courses.manage')
  or app_private.current_user_has_permission('system.full_access')
);

create policy courses_staff_insert on public.courses
for insert to authenticated
with check (
  app_private.current_user_has_permission('courses.manage')
  or app_private.current_user_has_permission('system.full_access')
);

create policy courses_staff_update on public.courses
for update to authenticated
using (
  app_private.current_user_has_permission('courses.manage')
  or app_private.current_user_has_permission('system.full_access')
)
with check (
  app_private.current_user_has_permission('courses.manage')
  or app_private.current_user_has_permission('system.full_access')
);

grant insert, update on public.courses to authenticated;

commit;
