begin;

alter table public.free_trial_requests drop constraint if exists free_trial_requests_locale_check;
alter table public.free_trial_requests
  add constraint free_trial_requests_locale_check check (locale in ('en', 'ur', 'ar', 'fa'));

alter table public.contact_inquiries drop constraint if exists contact_inquiries_locale_check;
alter table public.contact_inquiries
  add constraint contact_inquiries_locale_check check (locale in ('en', 'ur', 'ar', 'fa'));

alter table public.blog_posts drop constraint if exists blog_posts_locale_check;
alter table public.blog_posts
  add constraint blog_posts_locale_check check (locale in ('en', 'ur', 'ar', 'fa'));

alter table public.gallery_items drop constraint if exists gallery_items_locale_check;
alter table public.gallery_items
  add constraint gallery_items_locale_check check (locale in ('en', 'ur', 'ar', 'fa'));

commit;
