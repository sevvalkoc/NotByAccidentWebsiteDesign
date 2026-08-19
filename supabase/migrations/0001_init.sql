-- ============================================================================
-- NOT BY ACCIDENT — CMS SCHEMA
-- ============================================================================
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New
-- query → paste → Run) against project nfpvygufottgzdbthgwt, or via the
-- Supabase CLI: `supabase db push`.
--
-- This file is idempotent-ish (uses IF NOT EXISTS / OR REPLACE throughout)
-- so it is safe to re-run if something fails partway through, but it is
-- still a real schema change — take a backup / run during a quiet period
-- if this project ever holds real user data before you run it.
--
-- After running this, see docs/CMS.md for the remaining manual steps
-- (creating your first admin user, setting Vercel env vars).
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. PROFILES & ROLES
-- ============================================================================
-- Extends auth.users. There is deliberately no public sign-up path — admin
-- users are created in the Supabase Dashboard (Authentication → Users →
-- Add user), then given a profiles row (see docs/CMS.md).

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- security definer + fixed search_path: safe to call from RLS policies on
-- other tables without recursing into profiles' own RLS.
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- 2. MEDIA LIBRARY
-- ============================================================================

create table if not exists public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  storage_path text not null,
  file_type text not null check (file_type in ('image', 'svg', 'pdf', 'video', 'document')),
  file_name text not null,
  mime_type text,
  file_size_bytes bigint,
  width int,
  height int,
  alt_text text,
  caption text,
  focal_x numeric(4, 3) not null default 0.5,
  focal_y numeric(4, 3) not null default 0.5,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, storage_path)
);

-- ============================================================================
-- 3. SITE-WIDE SETTINGS (singleton rows: id is always 1)
-- ============================================================================

create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'Not by Accident',
  site_description text,
  default_seo_title text,
  default_meta_description text,
  default_og_image_url text,
  domain text,
  language text not null default 'en-GB',
  locale text not null default 'en_GB',
  contact_email text,
  new_business_email text,
  press_email text,
  phone text,
  address_line1 text,
  address_line2 text,
  address_city text,
  address_postcode text,
  address_country text,
  registration_note text,
  hours text,
  social_links jsonb not null default '[]',
  analytics_ids jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.brand_settings (
  id smallint primary key default 1 check (id = 1),
  logo_primary_media_id uuid references public.media (id) on delete set null,
  logo_secondary_media_id uuid references public.media (id) on delete set null,
  symbol_media_id uuid references public.media (id) on delete set null,
  favicon_media_id uuid references public.media (id) on delete set null,
  og_default_media_id uuid references public.media (id) on delete set null,
  colors jsonb not null default '{
    "background": "#F0EADA",
    "surface": "#FFFFFF",
    "primaryText": "#221E1B",
    "secondaryText": "#6A6560",
    "primaryBrand": "#6E2237",
    "secondaryBrand": "#221E1B",
    "accent": "#E9C558",
    "border": "#D8CFC0"
  }',
  display_font text not null default 'Lora',
  heading_font text not null default 'Lora',
  body_font text not null default 'DM Sans',
  ui_font text not null default 'DM Sans',
  font_source text not null default 'google' check (font_source in ('google', 'hosted', 'system')),
  updated_at timestamptz not null default now()
);
insert into public.brand_settings (id) values (1) on conflict (id) do nothing;

-- ============================================================================
-- 4. NAVIGATION
-- ============================================================================

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  location text not null check (location in ('header', 'footer')),
  label text not null,
  url text not null,
  is_internal boolean not null default true,
  open_new_tab boolean not null default false,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (location, label)
);

-- ============================================================================
-- 5. PAGES & SECTIONS (structured, not a free-form page builder)
-- ============================================================================

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  seo_title text,
  seo_description text,
  og_media_id uuid references public.media (id) on delete set null,
  canonical_url text,
  noindex boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  section_key text not null,
  eyebrow text,
  title text,
  subtitle text,
  body text,
  cta_label text,
  cta_url text,
  image_media_id uuid references public.media (id) on delete set null,
  video_url text,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  extra jsonb not null default '{}',
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

-- ============================================================================
-- 6. CAPABILITIES (mirrors the existing static taxonomy; admin CRUD for
-- these is a follow-up phase — this table exists so the frontend can start
-- reading from Supabase with a static-data fallback while that's built).
-- ============================================================================

create table if not exists public.capabilities (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null check (
    category in ('Brand & Identity', 'Digital & Product', 'Growth & Demand', 'Market & Expansion', 'Experiences')
  ),
  summary text,
  lede text,
  includes text[] not null default '{}',
  question text,
  outcome text,
  queries text[] not null default '{}',
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 7. WORK / CASE STUDIES
-- ============================================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text,
  slug text not null unique,
  year text,
  industry text,
  location text,
  short_description text,
  introduction text,
  challenge text,
  insight text,
  strategy text,
  what_we_did text,
  outcome text,
  results text,
  services text[] not null default '{}',
  related_capability_slugs text[] not null default '{}',
  hero_image_media_id uuid references public.media (id) on delete set null,
  thumbnail_media_id uuid references public.media (id) on delete set null,
  credits text,
  external_url text,
  featured boolean not null default false,
  homepage_order int,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  scheduled_at timestamptz,
  sort_order int not null default 0,
  seo_title text,
  seo_description text,
  og_media_id uuid references public.media (id) on delete set null,
  canonical_url text,
  noindex boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_status_idx on public.projects (status);
create index if not exists projects_slug_idx on public.projects (slug);

create table if not exists public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  kind text not null default 'gallery' check (kind in ('gallery', 'video')),
  video_url text,
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.related_projects (
  project_id uuid not null references public.projects (id) on delete cascade,
  related_project_id uuid not null references public.projects (id) on delete cascade,
  primary key (project_id, related_project_id),
  check (project_id <> related_project_id)
);

-- ============================================================================
-- 8. ARTICLES / NOTES
-- ============================================================================

create table if not exists public.article_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  -- Structured block content for the constrained rich editor — an array of
  -- typed blocks, e.g. [{"type":"paragraph","text":"..."},
  -- {"type":"h2","text":"..."},{"type":"image","mediaId":"...","caption":"..."}]
  -- Typography always comes from the design system when rendering; the
  -- editor never stores raw font/colour choices.
  body jsonb not null default '[]',
  author_id uuid references public.profiles (id) on delete set null,
  category_id uuid references public.article_categories (id) on delete set null,
  tags text[] not null default '{}',
  hero_image_media_id uuid references public.media (id) on delete set null,
  reading_time_minutes int,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  scheduled_at timestamptz,
  seo_title text,
  seo_description text,
  og_media_id uuid references public.media (id) on delete set null,
  canonical_url text,
  noindex boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_slug_idx on public.articles (slug);

create table if not exists public.article_related_projects (
  article_id uuid not null references public.articles (id) on delete cascade,
  project_id uuid not null references public.projects (id) on delete cascade,
  primary key (article_id, project_id)
);

create table if not exists public.article_related_articles (
  article_id uuid not null references public.articles (id) on delete cascade,
  related_article_id uuid not null references public.articles (id) on delete cascade,
  primary key (article_id, related_article_id),
  check (article_id <> related_article_id)
);

-- ============================================================================
-- 9. TESTIMONIALS, CLIENTS, PARTNERS, TEAM
-- ============================================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  person_name text not null,
  role text,
  company text,
  photo_media_id uuid references public.media (id) on delete set null,
  related_project_id uuid references public.projects (id) on delete set null,
  sort_order int not null default 0,
  featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (person_name, company)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_name text not null unique,
  logo_media_id uuid references public.media (id) on delete set null,
  website_url text,
  alt_text text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null unique,
  logo_media_id uuid references public.media (id) on delete set null,
  website_url text,
  alt_text text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  role text,
  bio text,
  portrait_media_id uuid references public.media (id) on delete set null,
  email text,
  social_url text,
  personal_url text,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ============================================================================
-- 10. TRAININGS — schema is fully live; PUBLIC visibility is gated in the
-- application layer (the /trainings route always shows "Coming Soon"
-- regardless of published rows here) until you deliberately flip that
-- switch in code. RLS still only exposes 'published' rows to anon, so even
-- direct API access can't see draft/ready/coming_soon training content.
-- ============================================================================

create table if not exists public.trainings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  full_description text,
  instructor text,
  cover_media_id uuid references public.media (id) on delete set null,
  category text,
  level text,
  duration text,
  language text,
  format text,
  price text,
  status text not null default 'draft' check (
    status in ('draft', 'ready', 'coming_soon', 'published', 'archived')
  ),
  pdf_media_id uuid references public.media (id) on delete set null,
  video_media_id uuid references public.media (id) on delete set null,
  external_video_url text,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  og_media_id uuid references public.media (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.training_files (
  id uuid primary key default gen_random_uuid(),
  training_id uuid not null references public.trainings (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  kind text not null default 'resource' check (kind in ('resource', 'supporting')),
  label text,
  sort_order int not null default 0
);

-- ============================================================================
-- 11. REPORTS
-- ============================================================================

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  cover_media_id uuid references public.media (id) on delete set null,
  category text,
  author text,
  published_at timestamptz,
  pdf_media_id uuid references public.media (id) on delete set null,
  file_size_bytes bigint,
  featured boolean not null default false,
  related_project_id uuid references public.projects (id) on delete set null,
  related_article_id uuid references public.articles (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  seo_title text,
  seo_description text,
  og_media_id uuid references public.media (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 12. CONTACT SUBMISSIONS — never publicly readable.
-- ============================================================================

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  company text,
  website text,
  message text,
  budget text,
  timeline text,
  source text not null default 'contact',
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 13. REDIRECTS
-- ============================================================================

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  redirect_type smallint not null default 301 check (redirect_type in (301, 302)),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_path <> to_path)
);

-- ============================================================================
-- 14. updated_at TRIGGERS
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'profiles', 'site_settings', 'brand_settings', 'navigation_items', 'pages',
      'page_sections', 'capabilities', 'projects', 'articles', 'testimonials',
      'trainings', 'reports', 'redirects'
    ])
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end $$;

-- ============================================================================
-- 15. ROW LEVEL SECURITY
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.media enable row level security;
alter table public.site_settings enable row level security;
alter table public.brand_settings enable row level security;
alter table public.navigation_items enable row level security;
alter table public.pages enable row level security;
alter table public.page_sections enable row level security;
alter table public.capabilities enable row level security;
alter table public.projects enable row level security;
alter table public.project_media enable row level security;
alter table public.related_projects enable row level security;
alter table public.article_categories enable row level security;
alter table public.articles enable row level security;
alter table public.article_related_projects enable row level security;
alter table public.article_related_articles enable row level security;
alter table public.testimonials enable row level security;
alter table public.clients enable row level security;
alter table public.partners enable row level security;
alter table public.team_members enable row level security;
alter table public.trainings enable row level security;
alter table public.training_files enable row level security;
alter table public.reports enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.redirects enable row level security;

-- profiles: self-read, admin-manage
create policy "profiles_select_self_or_admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "profiles_admin_write" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- media: public read (see docs/CMS.md for the storage-bucket-level policy
-- that actually serves the files; this just gates the metadata row), staff write
create policy "media_public_read" on public.media for select using (true);
create policy "media_staff_write" on public.media for all using (public.is_staff()) with check (public.is_staff());

-- site_settings / brand_settings: public read (frontend needs these), admin write
create policy "site_settings_public_read" on public.site_settings for select using (true);
create policy "site_settings_admin_write" on public.site_settings for update using (public.is_admin()) with check (public.is_admin());
create policy "brand_settings_public_read" on public.brand_settings for select using (true);
create policy "brand_settings_admin_write" on public.brand_settings for update using (public.is_admin()) with check (public.is_admin());

-- navigation: public reads visible items, staff manages all
create policy "nav_public_read" on public.navigation_items for select using (is_visible = true);
create policy "nav_staff_read_all" on public.navigation_items for select using (public.is_staff());
create policy "nav_staff_write" on public.navigation_items for all using (public.is_staff()) with check (public.is_staff());

-- pages & sections: public read, staff write
create policy "pages_public_read" on public.pages for select using (true);
create policy "pages_staff_write" on public.pages for all using (public.is_staff()) with check (public.is_staff());
create policy "page_sections_public_read" on public.page_sections for select using (is_visible = true);
create policy "page_sections_staff_read_all" on public.page_sections for select using (public.is_staff());
create policy "page_sections_staff_write" on public.page_sections for all using (public.is_staff()) with check (public.is_staff());

-- capabilities: public reads active, staff manages all
create policy "capabilities_public_read" on public.capabilities for select using (is_active = true);
create policy "capabilities_staff_read_all" on public.capabilities for select using (public.is_staff());
create policy "capabilities_staff_write" on public.capabilities for all using (public.is_staff()) with check (public.is_staff());

-- projects: public reads published only, staff sees & manages everything
create policy "projects_public_read" on public.projects for select using (status = 'published');
create policy "projects_staff_read_all" on public.projects for select using (public.is_staff());
create policy "projects_staff_write" on public.projects for all using (public.is_staff()) with check (public.is_staff());

create policy "project_media_public_read" on public.project_media for select using (
  exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy "project_media_staff_all" on public.project_media for all using (public.is_staff()) with check (public.is_staff());

create policy "related_projects_public_read" on public.related_projects for select using (true);
create policy "related_projects_staff_write" on public.related_projects for all using (public.is_staff()) with check (public.is_staff());

-- articles: same pattern as projects
create policy "article_categories_public_read" on public.article_categories for select using (true);
create policy "article_categories_staff_write" on public.article_categories for all using (public.is_staff()) with check (public.is_staff());

create policy "articles_public_read" on public.articles for select using (status = 'published');
create policy "articles_staff_read_all" on public.articles for select using (public.is_staff());
create policy "articles_staff_write" on public.articles for all using (public.is_staff()) with check (public.is_staff());

create policy "article_related_projects_public_read" on public.article_related_projects for select using (true);
create policy "article_related_projects_staff_write" on public.article_related_projects for all using (public.is_staff()) with check (public.is_staff());
create policy "article_related_articles_public_read" on public.article_related_articles for select using (true);
create policy "article_related_articles_staff_write" on public.article_related_articles for all using (public.is_staff()) with check (public.is_staff());

-- testimonials / clients / partners / team: public reads active, staff manages
create policy "testimonials_public_read" on public.testimonials for select using (is_active = true);
create policy "testimonials_staff_read_all" on public.testimonials for select using (public.is_staff());
create policy "testimonials_staff_write" on public.testimonials for all using (public.is_staff()) with check (public.is_staff());

create policy "clients_public_read" on public.clients for select using (is_active = true);
create policy "clients_staff_read_all" on public.clients for select using (public.is_staff());
create policy "clients_staff_write" on public.clients for all using (public.is_staff()) with check (public.is_staff());

create policy "partners_public_read" on public.partners for select using (is_active = true);
create policy "partners_staff_read_all" on public.partners for select using (public.is_staff());
create policy "partners_staff_write" on public.partners for all using (public.is_staff()) with check (public.is_staff());

create policy "team_public_read" on public.team_members for select using (is_active = true);
create policy "team_staff_read_all" on public.team_members for select using (public.is_staff());
create policy "team_staff_write" on public.team_members for all using (public.is_staff()) with check (public.is_staff());

-- trainings: public can ONLY ever read published rows (belt-and-braces —
-- the app also hard-codes /trainings as Coming Soon regardless)
create policy "trainings_public_read_published_only" on public.trainings for select using (status = 'published');
create policy "trainings_staff_read_all" on public.trainings for select using (public.is_staff());
create policy "trainings_staff_write" on public.trainings for all using (public.is_staff()) with check (public.is_staff());
create policy "training_files_staff_only" on public.training_files for all using (public.is_staff()) with check (public.is_staff());

-- reports: public reads published only, staff manages
create policy "reports_public_read" on public.reports for select using (status = 'published');
create policy "reports_staff_read_all" on public.reports for select using (public.is_staff());
create policy "reports_staff_write" on public.reports for all using (public.is_staff()) with check (public.is_staff());

-- contact_submissions: anyone can INSERT (the contact form), nobody but staff can read
create policy "contact_submissions_public_insert" on public.contact_submissions for insert with check (true);
create policy "contact_submissions_staff_read" on public.contact_submissions for select using (public.is_staff());
create policy "contact_submissions_staff_write" on public.contact_submissions for update using (public.is_staff()) with check (public.is_staff());
create policy "contact_submissions_staff_delete" on public.contact_submissions for delete using (public.is_staff());

-- redirects: public read (needed at request-time to actually redirect), staff writes
create policy "redirects_public_read" on public.redirects for select using (is_active = true);
create policy "redirects_staff_read_all" on public.redirects for select using (public.is_staff());
create policy "redirects_staff_write" on public.redirects for all using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 16. STORAGE BUCKETS
-- ============================================================================
-- media / documents: public read (general site imagery, report PDFs).
-- trainings: fully private — nothing in this bucket is ever public, matching
-- the "training resources must never leak" requirement, independent of any
-- row's status.

insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('documents', 'documents', true), ('trainings', 'trainings', false)
on conflict (id) do nothing;

create policy "media_bucket_public_read" on storage.objects for select using (bucket_id = 'media');
create policy "media_bucket_staff_write" on storage.objects for insert with check (bucket_id = 'media' and public.is_staff());
create policy "media_bucket_staff_update" on storage.objects for update using (bucket_id = 'media' and public.is_staff());
create policy "media_bucket_staff_delete" on storage.objects for delete using (bucket_id = 'media' and public.is_staff());

create policy "documents_bucket_public_read" on storage.objects for select using (bucket_id = 'documents');
create policy "documents_bucket_staff_write" on storage.objects for insert with check (bucket_id = 'documents' and public.is_staff());
create policy "documents_bucket_staff_update" on storage.objects for update using (bucket_id = 'documents' and public.is_staff());
create policy "documents_bucket_staff_delete" on storage.objects for delete using (bucket_id = 'documents' and public.is_staff());

create policy "trainings_bucket_staff_only_read" on storage.objects for select using (bucket_id = 'trainings' and public.is_staff());
create policy "trainings_bucket_staff_write" on storage.objects for insert with check (bucket_id = 'trainings' and public.is_staff());
create policy "trainings_bucket_staff_update" on storage.objects for update using (bucket_id = 'trainings' and public.is_staff());
create policy "trainings_bucket_staff_delete" on storage.objects for delete using (bucket_id = 'trainings' and public.is_staff());

-- ============================================================================
-- End of migration.
-- ============================================================================
