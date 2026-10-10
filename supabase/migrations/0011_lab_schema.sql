-- 0011 · THE LAB — schema and row-level security
--
-- The Lab is Not by Accident's market validation and matching product. It
-- lives in the same Supabase project as the website and the CMS, in tables
-- prefixed lab_. Additive and idempotent: nothing outside lab_* changes
-- except handle_new_user(), which learns to tell Lab accounts from CMS
-- staff sign-ups (see the end of this file).
--
-- Authorisation model
--   • Lab users own brands through lab_brand_members. Every brand-scoped
--     table checks lab_is_member(brand_id) in RLS.
--   • Lab administrators are the existing CMS staff: public.is_staff()
--     (approved admin or editor). Admin-only data (internal notes, partner
--     contacts, audit log) has no user-facing policy at all.
--   • Computed records (assessment results, matches, reports, introduction
--     status) have no insert/update policy for users: they are written only
--     by the SECURITY DEFINER functions in 0012, which check ownership
--     themselves. A user cannot forge a score.

-- ── Helpers ───────────────────────────────────────────────────────────────
create or replace function public.lab_is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_staff();
$$;

-- ── Settings (single row) ─────────────────────────────────────────────────
create table if not exists public.lab_settings (
  id int primary key default 1 check (id = 1),
  -- Fictional demonstration records (is_fixture) are only ever visible when
  -- this is true. It stays false in production; the staging seed flips it.
  fixtures_enabled boolean not null default false,
  intro_daily_limit int not null default 10 check (intro_daily_limit between 1 and 100),
  match_runs_per_hour int not null default 30 check (match_runs_per_hour between 1 and 500),
  reports_per_day int not null default 20 check (reports_per_day between 1 and 200),
  updated_at timestamptz not null default now()
);
insert into public.lab_settings (id) values (1) on conflict (id) do nothing;

-- ── People ────────────────────────────────────────────────────────────────
create table if not exists public.lab_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (full_name is null or char_length(full_name) <= 120),
  job_title text check (job_title is null or char_length(job_title) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz
);

create table if not exists public.lab_consents (
  id bigserial primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('terms', 'privacy', 'marketing', 'partner_sharing')),
  version text not null check (char_length(version) <= 40),
  granted boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists lab_consents_user_idx on public.lab_consents (user_id, kind, created_at desc);

-- ── Brands ────────────────────────────────────────────────────────────────
create table if not exists public.lab_brands (
  id uuid primary key default gen_random_uuid(),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  -- identity
  name text not null check (char_length(btrim(name)) between 1 and 120),
  website text check (website is null or (website ~* '^https?://[^\s]+$' and char_length(website) <= 300)),
  social_url text check (social_url is null or (social_url ~* '^https?://[^\s]+$' and char_length(social_url) <= 300)),
  origin_country text check (origin_country is null or origin_country ~ '^[A-Z]{2}$'),
  industry text check (industry is null or industry in ('fashion', 'jewellery', 'beauty', 'home', 'food_drink', 'wellness', 'design_objects', 'technology', 'services', 'other')),
  product_category text check (product_category is null or char_length(product_category) <= 120),
  offering text not null default 'physical' check (offering in ('physical', 'digital', 'service', 'mixed')),
  description text check (description is null or char_length(description) <= 800),
  logo_path text check (logo_path is null or char_length(logo_path) <= 300),
  -- commercial
  customer_segments text[] not null default '{}' check (customer_segments <@ array['young_adults', 'professionals', 'families', 'enthusiasts', 'gift_buyers', 'businesses', 'broad']::text[]),
  price_tier text check (price_tier is null or price_tier in ('value', 'mid', 'premium', 'luxury')),
  typical_price_eur numeric(12, 2) check (typical_price_eur is null or (typical_price_eur >= 0 and typical_price_eur < 10000000)),
  sales_channels text[] not null default '{}' check (sales_channels <@ array['own_ecommerce', 'marketplaces', 'own_retail', 'wholesale', 'distributors', 'popups', 'b2b_direct', 'subscriptions']::text[]),
  current_markets text[] not null default '{}',
  sales_stage text check (sales_stage is null or sales_stage in ('pre_launch', 'early', 'growing', 'established')),
  capacity text check (capacity is null or capacity in ('limited', 'moderate', 'scalable')),
  -- expansion
  target_markets text[] not null default '{}',
  entry_timeline text check (entry_timeline is null or entry_timeline in ('0_3', '3_6', '6_12', '12_plus')),
  primary_objective text check (primary_objective is null or primary_objective in ('test_demand', 'first_retailers', 'distribution', 'direct_to_consumer', 'partnerships', 'awareness')),
  distribution_model text check (distribution_model is null or distribution_model in ('retail', 'wholesale', 'distributor', 'dtc', 'marketplace', 'hybrid', 'undecided')),
  budget_range text check (budget_range is null or budget_range in ('under_10k', '10_25k', '25_75k', '75_150k', '150k_plus', 'undecided')),
  obstacles text[] not null default '{}' check (obstacles <@ array['market_choice', 'pricing', 'logistics', 'regulation', 'partners', 'brand_fit', 'budget', 'team_capacity', 'language']::text[]),
  languages text[] not null default '{}' check (languages <@ array['en', 'nl', 'de', 'fr', 'it', 'es', 'da', 'sv']::text[]),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_brands_markets_valid check (
    array_length(target_markets, 1) is null or array_length(target_markets, 1) <= 9
  )
);
create index if not exists lab_brands_created_by_idx on public.lab_brands (created_by);

create table if not exists public.lab_brand_members (
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  created_at timestamptz not null default now(),
  primary key (brand_id, user_id)
);
create index if not exists lab_brand_members_user_idx on public.lab_brand_members (user_id);

create or replace function public.lab_is_member(p_brand uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.lab_brand_members where brand_id = p_brand and user_id = auth.uid());
$$;

-- The creator becomes the owner, atomically with the insert.
create or replace function public.lab_brands_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.created_by is not null then
    insert into public.lab_brand_members (brand_id, user_id, role) values (new.id, new.created_by, 'owner')
    on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists lab_brands_after_insert on public.lab_brands;
create trigger lab_brands_after_insert after insert on public.lab_brands
  for each row execute function public.lab_brands_after_insert();

-- Validation the CHECKs can't express: market codes, a sane brand count.
create or replace function public.lab_brands_validate()
returns trigger language plpgsql security definer set search_path = public as $$
declare bad text;
begin
  select m into bad from unnest(new.target_markets || new.current_markets) m where m !~ '^[A-Z]{2}$' limit 1;
  if bad is not null then raise exception 'invalid market code: %', bad using errcode = '22023'; end if;
  -- target markets are the markets The Lab covers; current markets can be anywhere
  select m into bad from unnest(new.target_markets) m where not exists (select 1 from public.lab_markets k where k.code = m) limit 1;
  if bad is not null then raise exception 'The Lab does not cover % yet', bad using errcode = '22023'; end if;
  new.name := btrim(new.name);
  new.updated_at := now();
  if tg_op = 'INSERT' then
    if new.created_by is distinct from auth.uid() and not public.lab_is_admin() then
      raise exception 'brands are created by their owner' using errcode = '42501';
    end if;
    if (select count(*) from public.lab_brand_members where user_id = new.created_by and role = 'owner') >= 5 then
      raise exception 'a user can own at most 5 brands' using errcode = '22023';
    end if;
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  return new;
end $$;
drop trigger if exists lab_brands_validate on public.lab_brands;
create trigger lab_brands_validate before insert or update on public.lab_brands
  for each row execute function public.lab_brands_validate();

-- ── Assessment configuration (versioned) ──────────────────────────────────
create table if not exists public.lab_assessment_versions (
  id uuid primary key default gen_random_uuid(),
  version int not null unique,
  title text not null default 'Market readiness',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  -- {"brand":15,"pmf":20,"commercial":15,"operations":20,"partnership":15,"strategy":15}
  category_weights jsonb not null,
  -- [{"key":"foundation","min":0,"max":39,"label":"…","summary":"…"}, …]
  bands jsonb not null,
  notes text,
  created_at timestamptz not null default now(),
  published_at timestamptz
);
create unique index if not exists lab_assessment_versions_one_published on public.lab_assessment_versions ((status)) where status = 'published';

create table if not exists public.lab_questions (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.lab_assessment_versions (id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9_]{2,60}$'),
  category text not null check (category in ('brand', 'pmf', 'commercial', 'operations', 'partnership', 'strategy')),
  kind text not null default 'single' check (kind in ('single', 'multi', 'scale')),
  prompt text not null check (char_length(prompt) between 3 and 300),
  help text check (help is null or char_length(help) <= 500),
  why text check (why is null or char_length(why) <= 600),
  weight numeric(6, 2) not null default 1 check (weight > 0 and weight <= 10),
  required boolean not null default true,
  in_preview boolean not null default false,
  -- [{"source":"brand","field":"offering","in":["physical","mixed"]},
  --  {"source":"answer","question":"has_wholesale","in":["yes"]}]  (all must hold)
  applies_if jsonb,
  sort int not null default 0,
  unique (version_id, key)
);
create index if not exists lab_questions_version_idx on public.lab_questions (version_id, sort);

create table if not exists public.lab_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.lab_questions (id) on delete cascade,
  key text not null check (key ~ '^[a-z0-9_]{1,60}$'),
  label text not null check (char_length(label) between 1 and 200),
  -- 0–100. For multi questions the selected scores add up, capped at 100.
  score numeric(6, 2) not null default 0 check (score between 0 and 100),
  -- "Doesn't apply to us": the question leaves the denominator instead of
  -- counting as a zero.
  is_na boolean not null default false,
  recommendation_key text,
  sort int not null default 0,
  unique (question_id, key)
);

create table if not exists public.lab_recommendation_rules (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key ~ '^[a-z0-9_]{2,60}$'),
  title text not null check (char_length(title) <= 160),
  body text not null check (char_length(body) <= 800),
  category text check (category is null or category in ('brand', 'pmf', 'commercial', 'operations', 'partnership', 'strategy')),
  -- {"type":"category_below","category":"operations","value":50}
  -- {"type":"category_at_least","category":"brand","value":75}
  -- {"type":"overall_below","value":40} | {"type":"overall_at_least","value":80}
  -- {"type":"option_selected","question":"q_key","option":"opt_key"}
  -- {"type":"brand_field","field":"distribution_model","in":["undecided"]}
  -- {"type":"manual"}  (only via an option's recommendation_key)
  condition jsonb not null default '{"type":"manual"}',
  priority int not null default 50 check (priority between 0 and 100),
  partner_types text[] not null default '{}',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- Published (and archived) versions are frozen, so historical results stay
-- reproducible. Edit a draft copy instead (lab_admin_clone_version).
create or replace function public.lab_freeze_published()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_status text;
begin
  if tg_table_name = 'lab_questions' then
    select status into v_status from public.lab_assessment_versions where id = coalesce(new.version_id, old.version_id);
  else
    select v.status into v_status from public.lab_questions q join public.lab_assessment_versions v on v.id = q.version_id
    where q.id = coalesce(new.question_id, old.question_id);
  end if;
  if v_status is distinct from 'draft' and v_status is not null then
    raise exception 'version is % and frozen; clone it to a draft to edit', v_status using errcode = '42501';
  end if;
  return coalesce(new, old);
end $$;
drop trigger if exists lab_questions_freeze on public.lab_questions;
create trigger lab_questions_freeze before insert or update or delete on public.lab_questions
  for each row execute function public.lab_freeze_published();
drop trigger if exists lab_options_freeze on public.lab_options;
create trigger lab_options_freeze before insert or update or delete on public.lab_options
  for each row execute function public.lab_freeze_published();

create or replace function public.lab_versions_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and old.status <> 'draft' then
    -- only the status of a non-draft version may change (publish/archive)
    if new.category_weights is distinct from old.category_weights or new.bands is distinct from old.bands or new.version <> old.version then
      raise exception 'version % is frozen', old.version using errcode = '42501';
    end if;
  end if;
  if tg_op = 'DELETE' and (old.status <> 'draft' or exists (select 1 from public.lab_assessments where version_id = old.id)) then
    raise exception 'only unused drafts can be deleted' using errcode = '42501';
  end if;
  return coalesce(new, old);
end $$;
drop trigger if exists lab_versions_guard on public.lab_assessment_versions;
create trigger lab_versions_guard before update or delete on public.lab_assessment_versions
  for each row execute function public.lab_versions_guard();

-- ── Assessments, responses, results ───────────────────────────────────────
create table if not exists public.lab_assessments (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  version_id uuid not null references public.lab_assessment_versions (id) on delete restrict,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  started_by uuid references auth.users (id) on delete set null,
  last_question_key text,
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create unique index if not exists lab_assessments_one_open on public.lab_assessments (brand_id) where status = 'in_progress';
create index if not exists lab_assessments_brand_idx on public.lab_assessments (brand_id, started_at desc);

create table if not exists public.lab_responses (
  assessment_id uuid not null references public.lab_assessments (id) on delete cascade,
  question_id uuid not null references public.lab_questions (id) on delete restrict,
  option_keys text[] not null check (array_length(option_keys, 1) between 1 and 20),
  updated_at timestamptz not null default now(),
  primary key (assessment_id, question_id)
);

create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.lab_assessments (id) on delete cascade,
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  version_id uuid not null references public.lab_assessment_versions (id) on delete restrict,
  version int not null,
  overall numeric(5, 1),
  band_key text,
  band_label text,
  -- {"brand":{"score":72,"weight":15,"answered":3,"applicable":3,"na":0}, …}
  categories jsonb not null,
  -- [{"key":"…","category":"…","score":75,"weight":1,"options":["…"]}, …]
  contributions jsonb not null,
  weights jsonb not null,
  bands jsonb not null,
  answered int not null,
  applicable int not null,
  computed_at timestamptz not null default now()
);
create index if not exists lab_results_brand_idx on public.lab_results (brand_id, computed_at desc);

create table if not exists public.lab_result_recommendations (
  id uuid primary key default gen_random_uuid(),
  result_id uuid not null references public.lab_results (id) on delete cascade,
  rule_key text not null,
  title text not null,
  body text not null,
  category text,
  priority int not null,
  partner_types text[] not null default '{}'
);
create index if not exists lab_result_recs_idx on public.lab_result_recommendations (result_id, priority desc);

-- ── Markets ───────────────────────────────────────────────────────────────
create table if not exists public.lab_markets (
  code text primary key check (code ~ '^[A-Z]{2}$'),
  name text not null check (char_length(name) <= 80),
  status text not null default 'draft' check (status in ('draft', 'published')),
  is_fixture boolean not null default false,
  priority int not null default 50,
  eu_member boolean,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  languages text[] not null default '{}',
  overview text check (overview is null or char_length(overview) <= 1500),
  consumer_notes text check (consumer_notes is null or char_length(consumer_notes) <= 1500),
  distribution_channels text[] not null default '{}',
  pricing_notes text check (pricing_notes is null or char_length(pricing_notes) <= 1500),
  logistics_notes text check (logistics_notes is null or char_length(logistics_notes) <= 1500),
  regulatory_notes text check (regulatory_notes is null or char_length(regulatory_notes) <= 1500),
  entry_barriers text[] not null default '{}',
  -- unverified: basic facts only · partial: some fields sourced · verified: reviewed with sources
  confidence text not null default 'unverified' check (confidence in ('unverified', 'partial', 'verified')),
  last_verified_at date,
  outdated boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create table if not exists public.lab_market_category_notes (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.lab_markets (code) on delete cascade,
  industry text not null,
  note text not null check (char_length(note) <= 1200),
  updated_at timestamptz not null default now(),
  unique (market_code, industry)
);

create table if not exists public.lab_market_sources (
  id uuid primary key default gen_random_uuid(),
  market_code text not null references public.lab_markets (code) on delete cascade,
  field text not null default 'general' check (char_length(field) <= 40),
  title text not null check (char_length(title) <= 200),
  url text not null check (url ~* '^https?://[^\s]+$' and char_length(url) <= 500),
  publisher text check (publisher is null or char_length(publisher) <= 120),
  published_on date,
  accessed_on date not null default current_date,
  created_at timestamptz not null default now()
);
create index if not exists lab_market_sources_idx on public.lab_market_sources (market_code);

-- ── Partners ──────────────────────────────────────────────────────────────
create table if not exists public.lab_partner_types (
  key text primary key check (key ~ '^[a-z0-9_]{2,40}$'),
  label text not null check (char_length(label) <= 80),
  description text check (description is null or char_length(description) <= 400),
  -- the readiness a brand usually needs before this type of partner takes a call
  expected_readiness int not null default 40 check (expected_readiness between 0 and 100),
  sort int not null default 0,
  active boolean not null default true
);

create table if not exists public.lab_partners (
  id uuid primary key default gen_random_uuid(),
  -- identity
  name text not null check (char_length(btrim(name)) between 1 and 160),
  website text check (website is null or (website ~* '^https?://[^\s]+$' and char_length(website) <= 300)),
  website_domain text generated always as (lower(regexp_replace(regexp_replace(coalesce(website, ''), '^https?://(www\.)?', '', 'i'), '/.*$', ''))) stored,
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  city text check (city is null or char_length(city) <= 80),
  type_key text not null references public.lab_partner_types (key) on update cascade,
  description text check (description is null or char_length(description) <= 1000),
  -- commercial profile
  industries text[] not null default '{}',
  product_categories text[] not null default '{}',
  customer_segments text[] not null default '{}',
  price_tiers text[] not null default '{}' check (price_tiers <@ array['value', 'mid', 'premium', 'luxury']::text[]),
  distribution_models text[] not null default '{}' check (distribution_models <@ array['retail', 'wholesale', 'distributor', 'dtc', 'marketplace', 'hybrid']::text[]),
  accepts_offering text[] not null default '{}' check (accepts_offering <@ array['physical', 'digital', 'service', 'mixed']::text[]),
  brand_requirements text check (brand_requirements is null or char_length(brand_requirements) <= 800),
  business_size text check (business_size is null or business_size in ('independent', 'small_group', 'mid_size', 'large')),
  -- matching
  excluded_industries text[] not null default '{}',
  min_readiness int check (min_readiness is null or min_readiness between 0 and 100),
  -- provenance
  source_url text check (source_url is null or (source_url ~* '^https?://[^\s]+$' and char_length(source_url) <= 500)),
  last_verified_at date,
  verification_status text not null default 'research_prospect'
    check (verification_status in ('research_prospect', 'verified_organization', 'contacted_prospect', 'confirmed_partner')),
  accepts_introductions boolean not null default false,
  -- a partner is only shown to brands once an admin lists it
  listed boolean not null default false,
  archived boolean not null default false,
  is_fixture boolean not null default false,
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);
create index if not exists lab_partners_type_idx on public.lab_partners (type_key) where not archived;
create index if not exists lab_partners_country_idx on public.lab_partners (country_code) where not archived;
create unique index if not exists lab_partners_domain_uq on public.lab_partners (website_domain) where website_domain <> '' and not archived;

create table if not exists public.lab_partner_markets (
  partner_id uuid not null references public.lab_partners (id) on delete cascade,
  market_code text not null check (market_code ~ '^[A-Z]{2}$'),
  primary key (partner_id, market_code)
);
create index if not exists lab_partner_markets_code_idx on public.lab_partner_markets (market_code);

-- Contact people: staff only, with the lawful basis recorded.
create table if not exists public.lab_partner_contacts (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references public.lab_partners (id) on delete cascade,
  name text check (name is null or char_length(name) <= 120),
  role text check (role is null or char_length(role) <= 120),
  email text check (email is null or (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 200)),
  phone text check (phone is null or char_length(phone) <= 40),
  lawful_basis text not null default 'legitimate_interest' check (lawful_basis in ('consent', 'legitimate_interest', 'public_business_contact')),
  notes text check (notes is null or char_length(notes) <= 1000),
  created_at timestamptz not null default now()
);

create or replace function public.lab_fixtures_visible()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select fixtures_enabled from public.lab_settings where id = 1), false);
$$;

create or replace function public.lab_partner_visible(p public.lab_partners)
returns boolean language sql stable security definer set search_path = public as $$
  select p.listed and not p.archived and (not p.is_fixture or public.lab_fixtures_visible());
$$;

-- ── Matching ──────────────────────────────────────────────────────────────
create table if not exists public.lab_matching_configs (
  id uuid primary key default gen_random_uuid(),
  version int not null unique,
  -- {"category":25,"geography":20,"price":15,"segment":15,"distribution":15,"readiness":10}
  weights jsonb not null,
  min_score int not null default 40 check (min_score between 0 and 100),
  active boolean not null default false,
  notes text,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create unique index if not exists lab_matching_configs_one_active on public.lab_matching_configs ((active)) where active;

create table if not exists public.lab_match_runs (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  config_id uuid not null references public.lab_matching_configs (id) on delete restrict,
  result_id uuid references public.lab_results (id) on delete set null,
  filters jsonb not null default '{}',
  eligible_count int not null default 0,
  excluded_count int not null default 0,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists lab_match_runs_brand_idx on public.lab_match_runs (brand_id, created_at desc);

create table if not exists public.lab_matches (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null references public.lab_match_runs (id) on delete cascade,
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  partner_id uuid not null references public.lab_partners (id) on delete cascade,
  score int not null check (score between 0 and 100),
  coverage int not null check (coverage between 0 and 100),
  rank int not null,
  criteria jsonb not null,
  reasons text[] not null default '{}',
  limitations text[] not null default '{}',
  missing text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (run_id, partner_id)
);
create index if not exists lab_matches_run_idx on public.lab_matches (run_id, rank);

create table if not exists public.lab_saved_matches (
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  partner_id uuid not null references public.lab_partners (id) on delete cascade,
  note text check (note is null or char_length(note) <= 2000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (brand_id, partner_id)
);

create or replace function public.lab_saved_matches_guard()
returns trigger language plpgsql security definer set search_path = public as $$
declare p public.lab_partners;
begin
  if tg_op = 'INSERT' then
    select * into p from public.lab_partners where id = new.partner_id;
    if p.id is null or not public.lab_partner_visible(p) then
      raise exception 'partner not available' using errcode = '42501';
    end if;
    new.created_by := auth.uid();
  else
    new.brand_id := old.brand_id;
    new.partner_id := old.partner_id;
    new.created_by := old.created_by;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists lab_saved_matches_guard on public.lab_saved_matches;
create trigger lab_saved_matches_guard before insert or update on public.lab_saved_matches
  for each row execute function public.lab_saved_matches_guard();

-- ── Introductions ─────────────────────────────────────────────────────────
create table if not exists public.lab_introductions (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  -- null = a research request ("find us someone in …")
  partner_id uuid references public.lab_partners (id) on delete restrict,
  requested_by uuid references auth.users (id) on delete set null,
  purpose text not null check (purpose in ('retail_listing', 'distribution', 'wholesale', 'market_entry_support', 'collaboration', 'service', 'research', 'other')),
  message text check (message is null or char_length(message) <= 1500),
  market_codes text[] not null default '{}',
  partner_types text[] not null default '{}',
  status text not null default 'requested' check (status in ('requested', 'under_review', 'more_info_needed', 'approved', 'declined', 'introduction_sent', 'in_discussion', 'completed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists lab_introductions_one_open on public.lab_introductions (brand_id, partner_id)
  where partner_id is not null and status not in ('declined', 'completed', 'closed');
create index if not exists lab_introductions_status_idx on public.lab_introductions (status, created_at desc);

create table if not exists public.lab_introduction_events (
  id uuid primary key default gen_random_uuid(),
  introduction_id uuid not null references public.lab_introductions (id) on delete cascade,
  status text not null,
  note text check (note is null or char_length(note) <= 1500),
  actor_id uuid references auth.users (id) on delete set null,
  actor_role text not null check (actor_role in ('user', 'staff', 'system')),
  created_at timestamptz not null default now()
);
create index if not exists lab_intro_events_idx on public.lab_introduction_events (introduction_id, created_at);

-- Internal notes live in their own table so no user policy can ever reach them.
create table if not exists public.lab_introduction_notes (
  id uuid primary key default gen_random_uuid(),
  introduction_id uuid not null references public.lab_introductions (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Opportunities ─────────────────────────────────────────────────────────
create table if not exists public.lab_opportunities (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  partner_id uuid references public.lab_partners (id) on delete set null,
  introduction_id uuid unique references public.lab_introductions (id) on delete set null,
  kind text not null default 'other' check (kind in ('retail', 'distribution', 'wholesale', 'collaboration', 'market_entry', 'other')),
  title text not null check (char_length(btrim(title)) between 1 and 160),
  status text not null default 'exploring' check (status in ('exploring', 'in_discussion', 'negotiating', 'pilot', 'won', 'lost', 'paused')),
  next_action text check (next_action is null or char_length(next_action) <= 300),
  next_action_on date,
  notes text check (notes is null or char_length(notes) <= 4000),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now()
);
create index if not exists lab_opportunities_brand_idx on public.lab_opportunities (brand_id, last_activity_at desc);

create table if not exists public.lab_opportunity_activities (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references public.lab_opportunities (id) on delete cascade,
  kind text not null default 'note' check (kind in ('note', 'status', 'next_action', 'system')),
  body text not null check (char_length(body) between 1 and 2000),
  visible_to_user boolean not null default true,
  actor_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists lab_opp_activities_idx on public.lab_opportunity_activities (opportunity_id, created_at);

-- Status changes and new next actions leave a trail automatically.
create or replace function public.lab_opportunities_trail()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
    new.last_activity_at := now();
    return new;
  end if;
  new.brand_id := old.brand_id;
  new.created_by := old.created_by;
  if new.status is distinct from old.status then
    insert into public.lab_opportunity_activities (opportunity_id, kind, body, actor_id)
    values (new.id, 'status', 'Status: ' || replace(old.status, '_', ' ') || ' → ' || replace(new.status, '_', ' '), auth.uid());
    new.last_activity_at := now();
  end if;
  if new.next_action is distinct from old.next_action and new.next_action is not null then
    insert into public.lab_opportunity_activities (opportunity_id, kind, body, actor_id)
    values (new.id, 'next_action', 'Next action: ' || new.next_action, auth.uid());
    new.last_activity_at := now();
  end if;
  return new;
end $$;
drop trigger if exists lab_opportunities_trail on public.lab_opportunities;
create trigger lab_opportunities_trail before insert or update on public.lab_opportunities
  for each row execute function public.lab_opportunities_trail();

-- Runs as the caller (not SECURITY DEFINER) so current_user tells a direct
-- API insert ('authenticated') from one made inside a Lab function.
create or replace function public.lab_activities_guard()
returns trigger language plpgsql set search_path = public as $$
declare direct boolean := current_user in ('authenticated', 'anon');
begin
  new.actor_id := auth.uid();
  if direct and not public.lab_is_admin() then
    -- only staff write staff-only or system entries
    new.visible_to_user := true;
    if new.kind in ('status', 'system') then new.kind := 'note'; end if;
  end if;
  -- entries written by the opportunity's own trigger (depth > 1) are already
  -- stamped there; touching the row again would collide with that update
  if pg_trigger_depth() = 1 then
    update public.lab_opportunities set last_activity_at = now() where id = new.opportunity_id;
  end if;
  return new;
end $$;
drop trigger if exists lab_activities_guard on public.lab_opportunity_activities;
create trigger lab_activities_guard before insert on public.lab_opportunity_activities
  for each row execute function public.lab_activities_guard();

-- ── Reports ───────────────────────────────────────────────────────────────
create table if not exists public.lab_reports (
  id uuid primary key default gen_random_uuid(),
  brand_id uuid not null references public.lab_brands (id) on delete cascade,
  result_id uuid references public.lab_results (id) on delete set null,
  title text not null,
  snapshot jsonb not null,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists lab_reports_brand_idx on public.lab_reports (brand_id, created_at desc);

-- ── Notifications, audit, analytics ───────────────────────────────────────
create table if not exists public.lab_notifications (
  id uuid primary key default gen_random_uuid(),
  -- null user_id = the staff inbox
  user_id uuid references auth.users (id) on delete cascade,
  brand_id uuid references public.lab_brands (id) on delete cascade,
  kind text not null check (char_length(kind) <= 40),
  title text not null check (char_length(title) <= 200),
  body text check (body is null or char_length(body) <= 1000),
  link text check (link is null or (link ~ '^/' and char_length(link) <= 300)),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists lab_notifications_user_idx on public.lab_notifications (user_id, created_at desc);

create table if not exists public.lab_audit (
  id bigserial primary key,
  actor_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  detail jsonb,
  created_at timestamptz not null default now()
);
create index if not exists lab_audit_created_idx on public.lab_audit (created_at desc);

-- Aggregate product analytics: an event name, a few non-personal properties
-- and a timestamp. No user id, no IP, no free text.
create table if not exists public.lab_events (
  id bigserial primary key,
  kind text not null check (kind in ('preview_completed', 'match_viewed', 'report_downloaded', 'markets_compared', 'landing_cta')),
  props jsonb not null default '{}' check (pg_column_size(props) < 1024),
  created_at timestamptz not null default now()
);
create index if not exists lab_events_kind_idx on public.lab_events (kind, created_at desc);

-- ── updated_at housekeeping ───────────────────────────────────────────────
create or replace function public.lab_touch()
returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;
do $$ declare t text; begin
  foreach t in array array['lab_profiles', 'lab_markets', 'lab_partners', 'lab_introductions', 'lab_recommendation_rules', 'lab_market_category_notes', 'lab_settings'] loop
    execute format('drop trigger if exists %1$s_touch on public.%1$s', t);
    execute format('create trigger %1$s_touch before update on public.%1$s for each row execute function public.lab_touch()', t);
  end loop;
end $$;

-- ── Row-level security ────────────────────────────────────────────────────
do $$ declare t text; begin
  foreach t in array array[
    'lab_settings', 'lab_profiles', 'lab_consents', 'lab_brands', 'lab_brand_members', 'lab_assessment_versions',
    'lab_questions', 'lab_options', 'lab_recommendation_rules', 'lab_assessments', 'lab_responses', 'lab_results',
    'lab_result_recommendations', 'lab_markets', 'lab_market_category_notes', 'lab_market_sources', 'lab_partner_types',
    'lab_partners', 'lab_partner_markets', 'lab_partner_contacts', 'lab_matching_configs', 'lab_match_runs', 'lab_matches',
    'lab_saved_matches', 'lab_introductions', 'lab_introduction_events', 'lab_introduction_notes', 'lab_opportunities',
    'lab_opportunity_activities', 'lab_reports', 'lab_notifications', 'lab_audit', 'lab_events'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    -- every policy below is (re)created by this migration
    execute (select coalesce(string_agg(format('drop policy if exists %I on public.%I;', policyname, t), ' '), '')
             from pg_policies where schemaname = 'public' and tablename = t);
  end loop;
end $$;

-- settings: staff only
create policy lab_settings_staff on public.lab_settings for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- profiles
create policy lab_profiles_own_read on public.lab_profiles for select using (user_id = auth.uid() or public.lab_is_admin());
create policy lab_profiles_own_update on public.lab_profiles for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- consents: append-only history
create policy lab_consents_own_read on public.lab_consents for select using (user_id = auth.uid() or public.lab_is_admin());
create policy lab_consents_own_insert on public.lab_consents for insert with check (user_id = auth.uid());

-- brands
-- created_by: the creator reads the row back in the same INSERT … RETURNING,
-- before the after-insert trigger has written the owner membership
create policy lab_brands_read on public.lab_brands for select using (public.lab_is_member(id) or created_by = auth.uid() or public.lab_is_admin());
create policy lab_brands_insert on public.lab_brands for insert with check (
  created_by = auth.uid() and exists (select 1 from public.lab_profiles p where p.user_id = auth.uid())
);
create policy lab_brands_update on public.lab_brands for update using (public.lab_is_member(id) or public.lab_is_admin()) with check (public.lab_is_member(id) or public.lab_is_admin());
create policy lab_brands_delete on public.lab_brands for delete using (
  exists (select 1 from public.lab_brand_members m where m.brand_id = id and m.user_id = auth.uid() and m.role = 'owner') or public.lab_is_admin()
);
create policy lab_members_read on public.lab_brand_members for select using (user_id = auth.uid() or public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_members_staff on public.lab_brand_members for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- assessment configuration: published content is readable by anyone (the
-- public readiness preview uses the in_preview questions); drafts are staff only
create policy lab_versions_read on public.lab_assessment_versions for select using (status = 'published' or public.lab_is_admin());
create policy lab_versions_staff on public.lab_assessment_versions for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_questions_read on public.lab_questions for select using (
  exists (select 1 from public.lab_assessment_versions v where v.id = version_id and v.status = 'published')
  or exists (select 1 from public.lab_assessments a where a.version_id = lab_questions.version_id and public.lab_is_member(a.brand_id))
  or public.lab_is_admin()
);
create policy lab_questions_staff on public.lab_questions for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_options_read on public.lab_options for select using (
  exists (select 1 from public.lab_questions q join public.lab_assessment_versions v on v.id = q.version_id where q.id = question_id and v.status = 'published')
  or exists (select 1 from public.lab_questions q join public.lab_assessments a on a.version_id = q.version_id where q.id = question_id and public.lab_is_member(a.brand_id))
  or public.lab_is_admin()
);
create policy lab_options_staff on public.lab_options for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_rules_staff on public.lab_recommendation_rules for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- assessments and results: read by brand members; written only by functions
create policy lab_assessments_read on public.lab_assessments for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_responses_read on public.lab_responses for select using (
  exists (select 1 from public.lab_assessments a where a.id = assessment_id and (public.lab_is_member(a.brand_id) or public.lab_is_admin()))
);
create policy lab_results_read on public.lab_results for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_result_recs_read on public.lab_result_recommendations for select using (
  exists (select 1 from public.lab_results r where r.id = result_id and (public.lab_is_member(r.brand_id) or public.lab_is_admin()))
);

-- markets: published profiles for signed-in users, everything for staff
create policy lab_markets_read on public.lab_markets for select to authenticated using (
  (status = 'published' and (not is_fixture or public.lab_fixtures_visible())) or public.lab_is_admin()
);
create policy lab_markets_staff on public.lab_markets for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_market_notes_read on public.lab_market_category_notes for select to authenticated using (
  exists (select 1 from public.lab_markets m where m.code = market_code and m.status = 'published') or public.lab_is_admin()
);
create policy lab_market_notes_staff on public.lab_market_category_notes for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_market_sources_read on public.lab_market_sources for select to authenticated using (
  exists (select 1 from public.lab_markets m where m.code = market_code and m.status = 'published') or public.lab_is_admin()
);
create policy lab_market_sources_staff on public.lab_market_sources for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- partners: the table itself is staff only. Brands see partners through
-- the matching functions, which return the public fields only.
create policy lab_partner_types_read on public.lab_partner_types for select using (true);
create policy lab_partner_types_staff on public.lab_partner_types for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_partners_staff on public.lab_partners for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_partner_markets_staff on public.lab_partner_markets for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_partner_contacts_staff on public.lab_partner_contacts for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- matching
create policy lab_matching_configs_read on public.lab_matching_configs for select to authenticated using (true);
create policy lab_matching_configs_staff on public.lab_matching_configs for all using (public.lab_is_admin()) with check (public.lab_is_admin());
create policy lab_match_runs_read on public.lab_match_runs for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_matches_read on public.lab_matches for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_saved_read on public.lab_saved_matches for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_saved_insert on public.lab_saved_matches for insert with check (public.lab_is_member(brand_id));
create policy lab_saved_update on public.lab_saved_matches for update using (public.lab_is_member(brand_id)) with check (public.lab_is_member(brand_id));
create policy lab_saved_delete on public.lab_saved_matches for delete using (public.lab_is_member(brand_id));

-- introductions: read by members; created and moved only by functions
create policy lab_intros_read on public.lab_introductions for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_intro_events_read on public.lab_introduction_events for select using (
  exists (select 1 from public.lab_introductions i where i.id = introduction_id and (public.lab_is_member(i.brand_id) or public.lab_is_admin()))
);
create policy lab_intro_notes_staff on public.lab_introduction_notes for all using (public.lab_is_admin()) with check (public.lab_is_admin());

-- opportunities: a brand's own lightweight pipeline
create policy lab_opps_read on public.lab_opportunities for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_opps_insert on public.lab_opportunities for insert with check (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_opps_update on public.lab_opportunities for update using (public.lab_is_member(brand_id) or public.lab_is_admin()) with check (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_opps_delete on public.lab_opportunities for delete using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_opp_acts_read on public.lab_opportunity_activities for select using (
  exists (select 1 from public.lab_opportunities o where o.id = opportunity_id and ((public.lab_is_member(o.brand_id) and visible_to_user) or public.lab_is_admin()))
);
create policy lab_opp_acts_insert on public.lab_opportunity_activities for insert with check (
  exists (select 1 from public.lab_opportunities o where o.id = opportunity_id and (public.lab_is_member(o.brand_id) or public.lab_is_admin()))
);

-- reports
create policy lab_reports_read on public.lab_reports for select using (public.lab_is_member(brand_id) or public.lab_is_admin());
create policy lab_reports_delete on public.lab_reports for delete using (public.lab_is_member(brand_id));

-- notifications
create policy lab_notifications_read on public.lab_notifications for select using (user_id = auth.uid() or (user_id is null and public.lab_is_admin()));
create policy lab_notifications_mark on public.lab_notifications for update using (user_id = auth.uid() or (user_id is null and public.lab_is_admin()))
  with check (user_id = auth.uid() or (user_id is null and public.lab_is_admin()));

-- audit and analytics: staff read; written by functions
create policy lab_audit_staff_read on public.lab_audit for select using (public.lab_is_admin());
create policy lab_events_staff_read on public.lab_events for select using (public.lab_is_admin());

-- Column guard: a member may edit the note on a saved match, a brand's
-- fields, an opportunity; nobody but functions writes computed tables.
revoke insert, update, delete on public.lab_results, public.lab_result_recommendations, public.lab_matches, public.lab_match_runs,
  public.lab_reports, public.lab_assessments, public.lab_responses, public.lab_introductions, public.lab_introduction_events,
  public.lab_audit, public.lab_events from anon, authenticated;
revoke all on public.lab_partners, public.lab_partner_contacts, public.lab_partner_markets from anon;
revoke all on public.lab_brands, public.lab_profiles, public.lab_consents, public.lab_saved_matches, public.lab_opportunities,
  public.lab_opportunity_activities, public.lab_notifications from anon;
-- staff keep their write access to the computed tables through the admin
-- functions in 0012 (SECURITY DEFINER), not through table grants.

-- ── Storage: brand logos (private, per-brand folders) ─────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lab-logos', 'lab-logos', false, 1048576, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = 1048576, allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp'];

drop policy if exists lab_logos_read on storage.objects;
drop policy if exists lab_logos_write on storage.objects;
drop policy if exists lab_logos_update on storage.objects;
drop policy if exists lab_logos_delete on storage.objects;
-- path: brand/<brand_id>/<file>
create policy lab_logos_read on storage.objects for select using (
  bucket_id = 'lab-logos' and (public.lab_is_admin() or (split_part(name, '/', 1) = 'brand' and public.lab_is_member(nullif(split_part(name, '/', 2), '')::uuid)))
);
create policy lab_logos_write on storage.objects for insert with check (
  bucket_id = 'lab-logos' and split_part(name, '/', 1) = 'brand' and public.lab_is_member(nullif(split_part(name, '/', 2), '')::uuid)
);
create policy lab_logos_update on storage.objects for update using (
  bucket_id = 'lab-logos' and split_part(name, '/', 1) = 'brand' and public.lab_is_member(nullif(split_part(name, '/', 2), '')::uuid)
);
create policy lab_logos_delete on storage.objects for delete using (
  bucket_id = 'lab-logos' and split_part(name, '/', 1) = 'brand' and public.lab_is_member(nullif(split_part(name, '/', 2), '')::uuid)
);

-- ── Sign-ups: Lab accounts are not CMS staff ──────────────────────────────
-- Before: every new auth user became a pending CMS editor. Lab sign-ups pass
-- {"account":"lab"} in their metadata and get a Lab profile instead (plus
-- the consents they ticked), so they never appear in Admin → Users as staff
-- applicants. CMS sign-ups behave exactly as before.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  if meta->>'account' = 'lab' then
    insert into public.lab_profiles (user_id, full_name)
    values (new.id, nullif(left(btrim(coalesce(meta->>'full_name', '')), 120), ''))
    on conflict (user_id) do nothing;
    if meta ? 'consents' then
      insert into public.lab_consents (user_id, kind, version, granted)
      select new.id, c.key, left(coalesce(meta->>'consent_version', 'v1'), 40), (c.value)::text::boolean
      from jsonb_each(meta->'consents') c
      where c.key in ('terms', 'privacy', 'marketing', 'partner_sharing') and jsonb_typeof(c.value) = 'boolean';
    end if;
  else
    insert into public.profiles (id, email, role, status)
    values (new.id, new.email, 'editor', 'pending')
    on conflict (id) do nothing;
  end if;
  return new;
end $$;
