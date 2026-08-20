begin;

drop policy if exists pricing_plans_public_read on public.pricing_plans;
drop index if exists public.pricing_plans_public_idx;

alter table public.pricing_plans rename to pricing_packages;
alter table public.pricing_packages rename column plan_key to slug;
alter table public.pricing_packages rename column classes_per_week to classes_per_month;
alter table public.pricing_packages rename column is_published to is_active;
alter table public.pricing_packages rename column sort_order to display_order;
alter table public.pricing_packages enable row level security;
alter table public.pricing_packages drop constraint if exists pricing_plans_classes_per_week_check;
alter table public.pricing_packages drop column prices;
alter table public.pricing_packages
  add column title text,
  add column description text,
  add column class_duration_minutes integer,
  add column class_type text,
  add column badge_text text,
  add column is_featured boolean not null default false,
  add column cta_label text,
  add column cta_url text,
  add column billing_period_label text;

update public.pricing_packages
set is_active = false,
    deleted_at = coalesce(deleted_at, now()),
    title = coalesce(title, initcap(replace(slug, '-', ' '))),
    description = coalesce(description, 'Archived legacy package'),
    class_duration_minutes = coalesce(class_duration_minutes, 30),
    class_type = coalesce(class_type, 'One-to-one class'),
    cta_label = coalesce(cta_label, 'Get Admission Now'),
    cta_url = coalesce(cta_url, '/free-trial'),
    billing_period_label = coalesce(billing_period_label, '/month');

alter table public.pricing_packages
  alter column title set not null,
  alter column description set not null,
  alter column class_duration_minutes set not null,
  alter column class_type set not null,
  alter column cta_label set not null,
  alter column cta_url set not null,
  alter column billing_period_label set not null,
  add constraint pricing_packages_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  add constraint pricing_packages_title_length check (char_length(title) between 2 and 100),
  add constraint pricing_packages_description_length check (char_length(description) between 2 and 500),
  add constraint pricing_packages_classes_check check (classes_per_month between 1 and 100),
  add constraint pricing_packages_duration_check check (class_duration_minutes between 15 and 180),
  add constraint pricing_packages_display_order_check check (display_order between 0 and 10000),
  add constraint pricing_packages_cta_url_check check (cta_url ~ '^/');

create table public.currencies (
  code text primary key check (code ~ '^[A-Z]{3}$'),
  name text not null check (char_length(name) between 2 and 80),
  symbol text not null check (char_length(symbol) between 1 and 8),
  display_order integer not null default 0 check (display_order between 0 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger currencies_set_updated_at before update on public.currencies for each row execute function app_private.set_updated_at();

create table public.pricing_package_features (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.pricing_packages (id) on delete cascade,
  feature_text text not null check (char_length(feature_text) between 2 and 180),
  display_order integer not null default 0 check (display_order between 0 and 10000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pricing_package_features_package_idx on public.pricing_package_features (package_id, display_order);
create trigger pricing_package_features_set_updated_at before update on public.pricing_package_features for each row execute function app_private.set_updated_at();

create table public.pricing_package_prices (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.pricing_packages (id) on delete cascade,
  currency_code text not null references public.currencies (code) on update cascade on delete restrict,
  amount numeric(12,2) not null check (amount >= 0 and amount <= 1000000),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (package_id, currency_code)
);
create index pricing_package_prices_package_idx on public.pricing_package_prices (package_id);
create index pricing_package_prices_currency_idx on public.pricing_package_prices (currency_code);
create trigger pricing_package_prices_set_updated_at before update on public.pricing_package_prices for each row execute function app_private.set_updated_at();

create table public.pricing_page_content (
  id boolean primary key default true check (id),
  heading text not null check (char_length(heading) between 2 and 120),
  highlighted_heading text not null check (char_length(highlighted_heading) between 2 and 120),
  subtitle text not null check (char_length(subtitle) between 2 and 240),
  intro_text text not null check (char_length(intro_text) between 2 and 600),
  cta_section_title text not null check (char_length(cta_section_title) between 2 and 160),
  cta_section_description text not null check (char_length(cta_section_description) between 2 and 500),
  cta_button_label text not null check (char_length(cta_button_label) between 2 and 80),
  cta_button_url text not null check (cta_button_url ~ '^/'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger pricing_page_content_set_updated_at before update on public.pricing_page_content for each row execute function app_private.set_updated_at();

create index pricing_packages_public_idx on public.pricing_packages (display_order, title) where is_active and deleted_at is null;
create index pricing_features_public_idx on public.pricing_package_features (package_id, display_order) where is_active;
create index pricing_prices_public_idx on public.pricing_package_prices (package_id, currency_code) where is_active;
create index currencies_public_idx on public.currencies (display_order, code) where is_active;

alter table public.currencies enable row level security;
alter table public.pricing_package_features enable row level security;
alter table public.pricing_package_prices enable row level security;
alter table public.pricing_page_content enable row level security;

create policy pricing_packages_public_read on public.pricing_packages for select to anon, authenticated
  using (is_active and deleted_at is null);
create policy pricing_features_public_read on public.pricing_package_features for select to anon, authenticated
  using (is_active and exists (
    select 1 from public.pricing_packages p
    where p.id = package_id and p.is_active and p.deleted_at is null
  ));
create policy pricing_prices_public_read on public.pricing_package_prices for select to anon, authenticated
  using (is_active and exists (
    select 1 from public.pricing_packages p
    where p.id = package_id and p.is_active and p.deleted_at is null
  ) and exists (
    select 1 from public.currencies c where c.code = currency_code and c.is_active
  ));
create policy currencies_public_read on public.currencies for select to anon, authenticated using (is_active);
create policy pricing_page_content_public_read on public.pricing_page_content for select to anon, authenticated using (true);

create policy pricing_packages_admin_all on public.pricing_packages for all to authenticated
  using (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'))
  with check (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'));
create policy pricing_features_admin_all on public.pricing_package_features for all to authenticated
  using (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'))
  with check (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'));
create policy pricing_prices_admin_all on public.pricing_package_prices for all to authenticated
  using (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'))
  with check (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'));
create policy currencies_admin_all on public.currencies for all to authenticated
  using (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'))
  with check (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'));
create policy pricing_page_content_admin_all on public.pricing_page_content for all to authenticated
  using (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'))
  with check (app_private.current_user_has_permission('content.manage') or app_private.current_user_has_permission('system.full_access'));

grant select on public.pricing_packages, public.pricing_package_features, public.pricing_package_prices, public.currencies, public.pricing_page_content to anon, authenticated;
grant insert, update, delete on public.pricing_packages, public.pricing_package_features, public.pricing_package_prices, public.currencies, public.pricing_page_content to authenticated;

create or replace function public.save_pricing_package(
  p_package_id uuid,
  p_package jsonb,
  p_features jsonb,
  p_prices jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_package_id uuid;
begin
  if not (
    app_private.current_user_has_permission('content.manage')
    or app_private.current_user_has_permission('system.full_access')
  ) then
    raise exception 'Not authorized to manage pricing';
  end if;

  if p_package_id is null then
    insert into public.pricing_packages (
      slug, title, description, classes_per_month, class_duration_minutes,
      class_type, badge_text, is_featured, cta_label, cta_url,
      billing_period_label, display_order, is_active, deleted_at
    ) values (
      p_package->>'slug', p_package->>'title', p_package->>'description',
      (p_package->>'classes_per_month')::integer,
      (p_package->>'class_duration_minutes')::integer,
      p_package->>'class_type', nullif(p_package->>'badge_text', ''),
      (p_package->>'is_featured')::boolean,
      p_package->>'cta_label', p_package->>'cta_url',
      p_package->>'billing_period_label',
      (p_package->>'display_order')::integer,
      (p_package->>'is_active')::boolean, null
    ) returning id into v_package_id;
  else
    update public.pricing_packages set
      slug = p_package->>'slug',
      title = p_package->>'title',
      description = p_package->>'description',
      classes_per_month = (p_package->>'classes_per_month')::integer,
      class_duration_minutes = (p_package->>'class_duration_minutes')::integer,
      class_type = p_package->>'class_type',
      badge_text = nullif(p_package->>'badge_text', ''),
      is_featured = (p_package->>'is_featured')::boolean,
      cta_label = p_package->>'cta_label',
      cta_url = p_package->>'cta_url',
      billing_period_label = p_package->>'billing_period_label',
      display_order = (p_package->>'display_order')::integer,
      is_active = (p_package->>'is_active')::boolean,
      deleted_at = null
    where id = p_package_id
    returning id into v_package_id;

    if v_package_id is null then
      raise exception 'Pricing package was not found';
    end if;
  end if;

  delete from public.pricing_package_features where package_id = v_package_id;
  insert into public.pricing_package_features (package_id, feature_text, display_order, is_active)
  select v_package_id, x.feature_text, x.display_order, x.is_active
  from jsonb_to_recordset(coalesce(p_features, '[]'::jsonb))
    as x(feature_text text, display_order integer, is_active boolean);

  delete from public.pricing_package_prices where package_id = v_package_id;
  insert into public.pricing_package_prices (package_id, currency_code, amount, is_active)
  select v_package_id, x.currency_code, x.amount, x.is_active
  from jsonb_to_recordset(coalesce(p_prices, '[]'::jsonb))
    as x(currency_code text, amount numeric, is_active boolean);

  return v_package_id;
end;
$$;

revoke all on function public.save_pricing_package(uuid, jsonb, jsonb, jsonb) from public;
grant execute on function public.save_pricing_package(uuid, jsonb, jsonb, jsonb) to authenticated;

insert into public.currencies (code, name, symbol, display_order, is_active) values
  ('USD', 'US Dollar', '$', 10, true),
  ('CAD', 'Canadian Dollar', 'C$', 20, true),
  ('GBP', 'British Pound', '£', 30, true),
  ('AUD', 'Australian Dollar', 'A$', 40, true),
  ('EUR', 'Euro', '€', 50, true)
on conflict (code) do update set name = excluded.name, symbol = excluded.symbol, display_order = excluded.display_order, is_active = excluded.is_active;

insert into public.pricing_packages (slug, title, description, classes_per_month, class_duration_minutes, class_type, badge_text, is_featured, cta_label, cta_url, billing_period_label, display_order, is_active, deleted_at) values
  ('four-classes', '4 Classes/Month', 'A gentle learning rhythm for steady foundations.', 4, 30, 'One-to-one class', null, false, 'Get Admission Now', '/free-trial', '/month', 10, true, null),
  ('eight-classes', '8 Classes/Month', 'A balanced plan for consistent weekly progress.', 8, 30, 'One-to-one class', null, false, 'Get Admission Now', '/free-trial', '/month', 20, true, null),
  ('twelve-classes', '12 Classes/Month', 'More guided practice for learners ready to accelerate.', 12, 30, 'One-to-one class', null, false, 'Get Admission Now', '/free-trial', '/month', 30, true, null),
  ('twenty-classes', '20 Classes/Month', 'Our most focused plan for ambitious learning goals.', 20, 30, 'One-to-one class', 'Most focused', true, 'Get Admission Now', '/free-trial', '/month', 40, true, null)
on conflict (slug) do update set title = excluded.title, description = excluded.description, classes_per_month = excluded.classes_per_month, class_duration_minutes = excluded.class_duration_minutes, class_type = excluded.class_type, badge_text = excluded.badge_text, is_featured = excluded.is_featured, cta_label = excluded.cta_label, cta_url = excluded.cta_url, billing_period_label = excluded.billing_period_label, display_order = excluded.display_order, is_active = excluded.is_active, deleted_at = null;

insert into public.pricing_package_features (package_id, feature_text, display_order, is_active)
select id, 'Live one-to-one classes', 10, true from public.pricing_packages where slug in ('four-classes','eight-classes','twelve-classes','twenty-classes');
insert into public.pricing_package_features (package_id, feature_text, display_order, is_active)
select id, 'Teacher feedback and progress guidance', 20, true from public.pricing_packages where slug in ('four-classes','eight-classes','twelve-classes','twenty-classes');

with package_prices(slug, code, amount) as (values
  ('four-classes','USD',30.00),('four-classes','CAD',30.00),('four-classes','GBP',20.00),('four-classes','AUD',30.00),('four-classes','EUR',20.00),
  ('eight-classes','USD',35.00),('eight-classes','CAD',35.00),('eight-classes','GBP',22.00),('eight-classes','AUD',35.00),('eight-classes','EUR',22.00),
  ('twelve-classes','USD',40.00),('twelve-classes','CAD',40.00),('twelve-classes','GBP',25.00),('twelve-classes','AUD',40.00),('twelve-classes','EUR',25.00),
  ('twenty-classes','USD',50.00),('twenty-classes','CAD',50.00),('twenty-classes','GBP',35.00),('twenty-classes','AUD',50.00),('twenty-classes','EUR',35.00)
)
insert into public.pricing_package_prices (package_id, currency_code, amount, is_active)
select p.id, pp.code, pp.amount, true
from package_prices pp
join public.pricing_packages p on p.slug = pp.slug
on conflict (package_id, currency_code) do update set amount = excluded.amount, is_active = true;

insert into public.pricing_page_content (id, heading, highlighted_heading, subtitle, intro_text, cta_section_title, cta_section_description, cta_button_label, cta_button_url) values
  (true, 'Monthly Fee Packages', 'Online Quran & Islamic Classes', 'Choose the learning plan that best fits your schedule and educational needs.', 'Every plan includes live guidance from a carefully reviewed teacher, a schedule agreed around your family, and a clear path for steady progress.', 'Ready to begin your learning journey?', 'Book a free live trial so we can understand your goals and recommend the most suitable plan.', 'Book a Free Trial', '/free-trial')
on conflict (id) do update set heading = excluded.heading, highlighted_heading = excluded.highlighted_heading, subtitle = excluded.subtitle, intro_text = excluded.intro_text, cta_section_title = excluded.cta_section_title, cta_section_description = excluded.cta_section_description, cta_button_label = excluded.cta_button_label, cta_button_url = excluded.cta_button_url;

commit;
