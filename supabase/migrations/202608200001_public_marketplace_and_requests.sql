begin;

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  description text,
  category text not null,
  level text not null,
  age_group text not null,
  class_type text not null,
  duration_minutes integer not null check (duration_minutes between 15 and 180),
  languages text[] not null default '{}',
  outcomes jsonb not null default '[]'::jsonb,
  syllabus jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index courses_public_catalog_idx on public.courses (category, level, title) where is_published and deleted_at is null;
create trigger courses_set_updated_at before update on public.courses for each row execute function app_private.set_updated_at();

create table public.public_teacher_profiles (
  teacher_user_id uuid primary key references public.teacher_profiles (user_id) on delete restrict,
  slug text not null unique,
  display_name text not null,
  headline text not null,
  biography text not null,
  subjects text[] not null default '{}',
  languages text[] not null default '{}',
  age_groups text[] not null default '{}',
  years_experience integer check (years_experience between 0 and 80),
  availability_summary text,
  is_verified boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index public_teacher_profiles_catalog_idx on public.public_teacher_profiles (display_name) where is_verified and is_published and deleted_at is null;
create index public_teacher_profiles_subjects_idx on public.public_teacher_profiles using gin (subjects) where is_verified and is_published and deleted_at is null;
create trigger public_teacher_profiles_set_updated_at before update on public.public_teacher_profiles for each row execute function app_private.set_updated_at();

create table public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null unique,
  classes_per_week integer not null check (classes_per_week between 1 and 7),
  prices jsonb not null default '{}'::jsonb,
  is_published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index pricing_plans_public_idx on public.pricing_plans (sort_order) where is_published and deleted_at is null;
create trigger pricing_plans_set_updated_at before update on public.pricing_plans for each row execute function app_private.set_updated_at();

create table public.free_trial_requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique default ('TRL-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  status text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED')),
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  time_zone text not null,
  learner_age text not null,
  course_slug text references public.courses (slug) on delete set null,
  teacher_preference text,
  learning_goals text not null,
  preferred_schedule text not null,
  locale text not null default 'en' check (locale in ('en', 'ur', 'ar')),
  assigned_to uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index free_trial_requests_queue_idx on public.free_trial_requests (status, created_at desc) where deleted_at is null;
create index free_trial_requests_email_idx on public.free_trial_requests (lower(email), created_at desc) where deleted_at is null;
create trigger free_trial_requests_set_updated_at before update on public.free_trial_requests for each row execute function app_private.set_updated_at();

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_number text not null unique default ('INQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12))),
  status text not null default 'NEW' check (status in ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
  full_name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  locale text not null default 'en' check (locale in ('en', 'ur', 'ar')),
  assigned_to uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index contact_inquiries_queue_idx on public.contact_inquiries (status, created_at desc) where deleted_at is null;
create trigger contact_inquiries_set_updated_at before update on public.contact_inquiries for each row execute function app_private.set_updated_at();

alter table public.teacher_applications alter column teacher_user_id drop not null;
alter table public.teacher_applications add column if not exists applicant_name text;
alter table public.teacher_applications add column if not exists applicant_email text;
alter table public.teacher_applications add column if not exists applicant_phone text;
alter table public.teacher_applications add column if not exists applicant_country text;
alter table public.teacher_applications add column if not exists teaching_subjects text;
alter table public.teacher_applications add column if not exists teaching_languages text;
alter table public.teacher_applications add column if not exists teaching_experience text;
alter table public.teacher_applications add column if not exists qualifications text;
alter table public.teacher_applications add column if not exists weekly_availability text;
alter table public.teacher_applications add column if not exists professional_biography text;
alter table public.teacher_documents alter column teacher_user_id drop not null;

alter table public.courses enable row level security;
alter table public.public_teacher_profiles enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.free_trial_requests enable row level security;
alter table public.free_trial_requests force row level security;
alter table public.contact_inquiries enable row level security;
alter table public.contact_inquiries force row level security;

create policy courses_public_read on public.courses for select to anon, authenticated using (is_published and deleted_at is null);
create policy public_teacher_profiles_public_read on public.public_teacher_profiles for select to anon, authenticated using (is_verified and is_published and deleted_at is null);
create policy pricing_plans_public_read on public.pricing_plans for select to anon, authenticated using (is_published and deleted_at is null);
create policy free_trial_requests_staff_read on public.free_trial_requests for select to authenticated using (app_private.current_user_has_permission('admissions.read') or app_private.current_user_has_permission('admissions.manage') or app_private.current_user_has_permission('system.full_access'));
create policy contact_inquiries_staff_read on public.contact_inquiries for select to authenticated using (app_private.current_user_has_permission('support.read') or app_private.current_user_has_permission('support.manage') or app_private.current_user_has_permission('system.full_access'));

grant select on public.courses, public.public_teacher_profiles, public.pricing_plans to anon, authenticated;
grant select on public.free_trial_requests, public.contact_inquiries to authenticated;

insert into public.courses (slug, title, summary, category, level, age_group, class_type, duration_minutes, languages, is_published, published_at) values
('quran-foundations','Quran Foundations','Learn Arabic letters, joining rules, and confident first reading.','Quran','Beginner','Children','One-to-one',30,array['English','Urdu','Arabic'],true,now()),
('quran-reading','Quran Reading','Build fluent, accurate recitation with patient live correction.','Quran','Intermediate','All ages','One-to-one',30,array['English','Urdu','Arabic'],true,now()),
('quran-with-tajweed','Quran with Tajweed','Apply practical Tajweed rules verse by verse.','Quran','Intermediate','Teens & adults','One-to-one',45,array['English','Urdu','Arabic'],true,now()),
('quran-memorization','Quran Memorization','Follow a realistic Hifz and revision plan.','Quran','All levels','All ages','One-to-one',45,array['English','Urdu','Arabic'],true,now()),
('quran-with-tafseer','Quran with Tafseer','Explore meaning, themes, and context with guided study.','Quran','Advanced','Teens & adults','One-to-one',45,array['English','Urdu','Arabic'],true,now()),
('nahjul-balagha','Nahjul Balagha','Study selected sermons, letters, wisdom, and their living lessons.','Ahlul Bayt','Intermediate','Teens & adults','Small group',45,array['English','Urdu','Arabic'],true,now()),
('sahifa-sajjadiya','Sahifa Sajjadiya','Understand the language, themes, and spiritual practice of the supplications.','Ahlul Bayt','Intermediate','Teens & adults','Small group',45,array['English','Urdu','Arabic'],true,now()),
('islamic-beliefs','Islamic Beliefs','Build a clear, age-appropriate foundation in Usul al-Din.','Islamic Studies','Beginner','All ages','One-to-one',30,array['English','Urdu','Arabic'],true,now()),
('shia-fiqh','Shia Fiqh','Learn everyday rulings with structured, practical guidance.','Islamic Studies','All levels','Teens & adults','One-to-one',45,array['English','Urdu','Arabic'],true,now()),
('akhlaq-character','Akhlaq & Character','Connect Islamic values to daily choices, habits, and relationships.','Islamic Studies','Beginner','Children & teens','Small group',30,array['English','Urdu','Arabic'],true,now()),
('seerah-prophet','Seerah of the Prophet','Journey through the life and mission of Prophet Muhammad (s).','History','Beginner','All ages','Small group',45,array['English','Urdu','Arabic'],true,now()),
('lives-of-ahlul-bayt','Lives of the Ahlul Bayt','Study the lives, values, and enduring guidance of the Ahlul Bayt (a).','History','All levels','All ages','Small group',45,array['English','Urdu','Arabic'],true,now()),
('arabic-for-quran','Arabic for Quran','Develop vocabulary and grammar for deeper Quran understanding.','Language','Beginner','Teens & adults','One-to-one',45,array['English','Urdu','Arabic'],true,now()),
('duas-ziyarat','Duas & Ziyarat','Learn accurate recitation, meaning, and devotional context.','Devotional','All levels','All ages','One-to-one',30,array['English','Urdu','Arabic'],true,now()),
('islamic-studies-children','Islamic Studies for Children','A warm, structured introduction to beliefs, worship, history, and manners.','Islamic Studies','Beginner','Children','One-to-one',30,array['English','Urdu','Arabic'],true,now())
on conflict (slug) do update set title = excluded.title, summary = excluded.summary, category = excluded.category, level = excluded.level, age_group = excluded.age_group, class_type = excluded.class_type, duration_minutes = excluded.duration_minutes, languages = excluded.languages, is_published = true, published_at = coalesce(public.courses.published_at, now());

insert into public.pricing_plans (plan_key, classes_per_week, sort_order, is_published) values ('steady',2,1,true),('progress',3,2,true),('intensive',5,3,true) on conflict (plan_key) do nothing;

commit;
