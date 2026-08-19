-- ============================================================================
-- NOT BY ACCIDENT — HOMEPAGE SECTIONS (Pages / Page Sections go live)
-- ============================================================================
-- Seeds the `pages` / `page_sections` rows for the homepage so the new
-- "Pages" admin screen has something real to edit, and the public homepage
-- (src/pages/Home.tsx, via src/content.ts) can read its hero copy and
-- section headings from Supabase instead of the hard-coded static seed.
--
-- Only the sections that were previously hard-coded text in src/content.ts
-- get a row here (hero, capabilities, notes, case_studies, final_cta) —
-- Testimonials, Clients, Partners and Case Studies TILES themselves already
-- come from their own tables and are untouched by this migration.
--
-- `extra` on the hero row carries the rotating headline words and the
-- hero image's placement nudge (imageOffsetX/Y, in px, applied as a CSS
-- transform on the public site — bounded and responsive-safe, not a
-- free pixel canvas).
-- ============================================================================

insert into public.media (bucket, storage_path, file_type, file_name, alt_text)
values (
  'external',
  'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000',
  'image',
  'photo-1764096534662-a194a348c4a0',
  'Materials and notes from a Not by Accident strategy session'
)
on conflict do nothing;

insert into public.pages (slug, title)
values ('home', 'Homepage')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, body, image_media_id, sort_order, extra)
values (
  (select id from public.pages where slug = 'home'),
  'hero',
  'Independent creative company · Amsterdam · Est. 2019',
  'We make companies',
  'Growth is what happens next. We work across brand, product and demand — in one room, to one commercial end.',
  'Not by Accident is an independent creative company that joins brand thinking and commercial thinking. Strategy, identity, websites, digital products and the marketing that makes them pay back.',
  (select id from public.media where bucket = 'external' and storage_path = 'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000'),
  1,
  jsonb_build_object('words', jsonb_build_array('wanted', 'chosen', 'remembered', 'recommended'), 'imageOffsetX', 0, 'imageOffsetY', 0)
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, sort_order)
values (
  (select id from public.pages where slug = 'home'),
  'capabilities',
  'What we do',
  'Capabilities. One way of working.',
  2
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, sort_order)
values (
  (select id from public.pages where slug = 'home'),
  'notes',
  'Notes — an independent publication',
  'How we think, in public.',
  3
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, sort_order)
values (
  (select id from public.pages where slug = 'home'),
  'case_studies',
  'Selected work',
  'Proof that the brand decision was the commercial one.',
  4
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, body, sort_order)
values (
  (select id from public.pages where slug = 'home'),
  'final_cta',
  'Start something',
  'Tell us the company you want to become.',
  'We work with founders, marketing leads and creative directors who suspect their company is better than its reputation. First reply within one working day — from a person, not a form.',
  5
)
on conflict (page_id, section_key) do nothing;
