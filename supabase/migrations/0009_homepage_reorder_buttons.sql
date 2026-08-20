-- ============================================================================
-- NOT BY ACCIDENT — HOMEPAGE SECTION REORDERING + BUTTONS (Phase 5)
-- ============================================================================
-- Two things this adds on top of 0005_homepage_sections.sql:
--
-- 1. Every homepage section — including Testimonials, Clients and Partners,
--    which read their actual content from their own tables and never had a
--    page_sections row before — now has one, purely so its position
--    (sort_order) and visibility (is_visible) can be controlled from
--    Admin → Pages. The public homepage (src/pages/Home.tsx) now renders
--    sections in this order instead of a hard-coded JSX sequence.
-- 2. Buttons are now data: the hero's two buttons live in
--    extra.buttons (an array, since there are two), and the final CTA's
--    single button reuses the cta_label/cta_url columns that already
--    existed on page_sections but were never used until now.
-- ============================================================================

-- Renumber the five existing sections to their true current position —
-- Testimonials/Clients/Partners sit between capabilities and notes.
update public.page_sections set sort_order = 1 where page_id = (select id from public.pages where slug = 'home') and section_key = 'hero';
update public.page_sections set sort_order = 2 where page_id = (select id from public.pages where slug = 'home') and section_key = 'capabilities';
update public.page_sections set sort_order = 6 where page_id = (select id from public.pages where slug = 'home') and section_key = 'notes';
update public.page_sections set sort_order = 7 where page_id = (select id from public.pages where slug = 'home') and section_key = 'case_studies';
update public.page_sections set sort_order = 8 where page_id = (select id from public.pages where slug = 'home') and section_key = 'final_cta';

insert into public.page_sections (page_id, section_key, sort_order)
values
  ((select id from public.pages where slug = 'home'), 'testimonials', 3),
  ((select id from public.pages where slug = 'home'), 'clients', 4),
  ((select id from public.pages where slug = 'home'), 'partners', 5)
on conflict (page_id, section_key) do nothing;

update public.page_sections
set extra = extra || jsonb_build_object('buttons', jsonb_build_array(
  jsonb_build_object('label', 'Start a project', 'url', '/contact'),
  jsonb_build_object('label', 'See the work', 'url', '/work')
))
where page_id = (select id from public.pages where slug = 'home') and section_key = 'hero';

update public.page_sections
set cta_label = 'Start a project', cta_url = '/contact'
where page_id = (select id from public.pages where slug = 'home') and section_key = 'final_cta';
