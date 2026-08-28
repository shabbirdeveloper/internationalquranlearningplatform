begin;

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('en', 'ur', 'ar')),
  slug text not null check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 180),
  excerpt text not null check (char_length(excerpt) between 10 and 500),
  body text not null check (char_length(body) between 30 and 30000),
  category text not null check (char_length(category) between 2 and 80),
  cover_image_url text not null check (char_length(cover_image_url) between 1 and 500),
  cover_image_alt text not null check (char_length(cover_image_alt) between 5 and 200),
  author_name text not null default 'SHIA TALEEM' check (char_length(author_name) between 2 and 120),
  reading_time_minutes integer not null default 4 check (reading_time_minutes between 1 and 120),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  display_order integer not null default 0 check (display_order between 0 and 100000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (locale, slug)
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  locale text not null check (locale in ('en', 'ur', 'ar')),
  title text not null check (char_length(title) between 3 and 180),
  caption text not null check (char_length(caption) between 5 and 600),
  category text not null check (char_length(category) between 2 and 80),
  image_url text not null check (char_length(image_url) between 1 and 500),
  image_alt text not null check (char_length(image_alt) between 5 and 200),
  is_featured boolean not null default false,
  is_published boolean not null default false,
  published_at timestamptz,
  display_order integer not null default 0 check (display_order between 0 and 100000),
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger blog_posts_set_updated_at before update on public.blog_posts for each row execute function app_private.set_updated_at();
create trigger gallery_items_set_updated_at before update on public.gallery_items for each row execute function app_private.set_updated_at();

create index blog_posts_public_idx on public.blog_posts (locale, is_featured desc, display_order, published_at desc) where is_published and deleted_at is null;
create index gallery_items_public_idx on public.gallery_items (locale, is_featured desc, display_order, published_at desc) where is_published and deleted_at is null;
create index blog_posts_admin_idx on public.blog_posts (updated_at desc);
create index gallery_items_admin_idx on public.gallery_items (updated_at desc);

alter table public.blog_posts enable row level security;
alter table public.gallery_items enable row level security;

create policy blog_posts_public_read on public.blog_posts for select to anon, authenticated
  using (is_published and deleted_at is null and (published_at is null or published_at <= now()));
create policy gallery_items_public_read on public.gallery_items for select to anon, authenticated
  using (is_published and deleted_at is null and (published_at is null or published_at <= now()));

create policy blog_posts_admin_all on public.blog_posts for all to authenticated
  using ((select app_private.current_user_has_permission('content.manage')) or (select app_private.current_user_has_permission('system.full_access')))
  with check ((select app_private.current_user_has_permission('content.manage')) or (select app_private.current_user_has_permission('system.full_access')));
create policy gallery_items_admin_all on public.gallery_items for all to authenticated
  using ((select app_private.current_user_has_permission('content.manage')) or (select app_private.current_user_has_permission('system.full_access')))
  with check ((select app_private.current_user_has_permission('content.manage')) or (select app_private.current_user_has_permission('system.full_access')));

grant select on public.blog_posts, public.gallery_items to anon, authenticated;
grant insert, update, delete on public.blog_posts, public.gallery_items to authenticated;

insert into public.blog_posts (locale, slug, title, excerpt, body, category, cover_image_url, cover_image_alt, author_name, reading_time_minutes, is_featured, is_published, published_at, display_order)
values
  ('en', 'building-a-meaningful-quran-routine', 'Building a meaningful Quran routine at home', 'A calm, practical approach to helping learners make Quran study part of everyday family life.', E'A meaningful Quran routine begins with consistency, not intensity. Choose a quiet time that the learner can keep, prepare the learning space, and begin with a realistic goal.\n\nShort, focused lessons often create stronger habits than occasional long sessions. A caring teacher can help the learner balance reading, correction, understanding, and revision without feeling overwhelmed.\n\nFamilies can support progress by celebrating effort, listening with patience, and keeping the schedule predictable. Over time, these small actions build confidence and a lasting connection with the Quran.', 'Learning guidance', '/images/shia-taleem-hero-learning.png', 'A student learning the Quran online from home', 'SHIA TALEEM Academic Team', 4, true, true, now() - interval '8 days', 10),
  ('en', 'prepare-for-your-first-online-quran-lesson', 'How to prepare for your first online Quran lesson', 'Simple steps for a focused, comfortable first lesson with your teacher.', E'Your first lesson is an opportunity for the teacher to understand your current level, learning goals, and preferred pace. Keep your Quran, notebook, and a reliable device ready before the class begins.\n\nJoin from a quiet place with good lighting and test your microphone in advance. There is no need to worry about making mistakes: the lesson is designed to identify the best starting point and build a plan around you.\n\nAfter class, write down one small practice goal and confirm the next lesson time. A clear start makes consistent progress easier.', 'Getting started', '/images/hero-online-class.png', 'A learner preparing for an online Quran lesson', 'SHIA TALEEM Student Support', 3, false, true, now() - interval '14 days', 20),
  ('en', 'tajweed-with-confidence', 'Learning Tajweed with confidence and patience', 'Why steady correction and regular practice matter more than rushing through rules.', E'Tajweed becomes easier when each rule is connected to real recitation. Instead of trying to memorize everything at once, learners benefit from listening, repeating, and applying one principle at a time.\n\nPatient correction is essential. A teacher should explain what changed, demonstrate the sound clearly, and give the learner enough time to try again. Regular revision then turns conscious effort into a natural recitation habit.\n\nProgress may feel gradual, but every accurately pronounced letter is meaningful. Consistency and encouragement help learners recite with both care and confidence.', 'Quran studies', '/images/quran-trial-art.png', 'An open Quran prepared for a guided lesson', 'SHIA TALEEM Academic Team', 5, false, true, now() - interval '20 days', 30);

insert into public.gallery_items (locale, title, caption, category, image_url, image_alt, is_featured, is_published, published_at, display_order)
values
  ('en', 'Live one-to-one Quran learning', 'A focused lesson shaped around each learner''s level and pace.', 'Live lessons', '/images/shia-taleem-hero-learning.png', 'A student attending a live online Quran lesson', true, true, now() - interval '8 days', 10),
  ('en', 'Caring female teachers', 'Clear guidance, patient correction, and a respectful learning environment.', 'Teachers', '/images/shia-taleem-female-teacher.png', 'A female teacher leading an online lesson', false, true, now() - interval '10 days', 20),
  ('en', 'A thoughtful first step', 'Trial lessons help families meet a suitable teacher and agree on a practical plan.', 'Student journeys', '/images/hero-online-class.png', 'A student beginning an online Quran lesson', false, true, now() - interval '12 days', 30),
  ('en', 'Learning with the Quran', 'Structured practice helps reading become fluent, accurate, and confident.', 'Quran studies', '/images/quran-trial-art.png', 'An open Quran used during a lesson', false, true, now() - interval '16 days', 40);

commit;
