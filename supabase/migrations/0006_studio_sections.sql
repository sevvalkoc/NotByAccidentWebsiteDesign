-- ============================================================================
-- NOT BY ACCIDENT — STUDIO PAGE SECTIONS (Phase 2 of the Pages builder)
-- ============================================================================
-- Same pattern as 0005_homepage_sections.sql, applied to /studio (src/pages/
-- About.tsx): the opening statement, principles list, and culture list were
-- all hard-coded — this seeds page_sections rows for them so Admin → Pages
-- can edit them, and src/lib/cms.ts's fetchStudioSections() reads them back.
--
-- `principles` and `culture` are repeatable lists (name + body pairs), which
-- page_sections has no dedicated columns for — stored as extra.items, an
-- array of { title, body } objects, same convention as hero's extra.words.
-- ============================================================================

insert into public.pages (slug, title)
values ('studio', 'Studio')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, body, sort_order)
values (
  (select id from public.pages where slug = 'studio'),
  'opening',
  'Studio',
  'We make companies wanted.',
  'Growth is what happens next. Wanted, on purpose.',
  'Not by Accident is an independent creative company working across brand, product and demand. Brand thinking and commercial thinking do not sit in separate rooms.',
  1
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, sort_order, extra)
values (
  (select id from public.pages where slug = 'studio'),
  'principles',
  'How we think',
  2,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title', 'Specific', 'body', 'Name the material, the month, the number, the street. A range of possibilities is not a description. It is an avoidance of one.'),
    jsonb_build_object('title', 'Decided', 'body', 'Present decisions as decisions. Two routes, never three. The recommendation comes first, not last. We are paid to have a view.'),
    jsonb_build_object('title', 'Warm, not soft', 'body', 'People, hands, imperfection and humour. The work stays sharp. Warmth and rigour are not in tension. Softness is just politeness at the cost of truth.'),
    jsonb_build_object('title', 'Culturally awake', 'body', 'References from outside design, credited always and never explained. We do not borrow from culture without knowing where we borrowed from.'),
    jsonb_build_object('title', 'Quietly funny', 'body', 'One human moment per communication. In the last line, never the headline. Funny because it is true, not because it is trying.'),
    jsonb_build_object('title', 'Commercially literate', 'body', 'Every soft attribute shows up one step downstream as a hard number. We do not separate aesthetic decisions from commercial ones.')
  ))
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, sort_order, extra)
values (
  (select id from public.pages where slug = 'studio'),
  'culture',
  'The culture',
  'Small on purpose. Senior in the room. Commercial by instinct.',
  3,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title', 'One room', 'body', 'Strategy, design and demand sit together from day one — no relay races, no telephone game between departments.'),
    jsonb_build_object('title', 'Senior hands', 'body', 'The people who win the work do the work. We stay small so the standard never gets diluted downstream.'),
    jsonb_build_object('title', 'Commercial first', 'body', 'Every decision traces back to a number a client can actually move. Beauty is the method, not the goal.')
  ))
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, title, sort_order)
values (
  (select id from public.pages where slug = 'studio'),
  'cta',
  'If you would like to work with us, leave your email.',
  4
)
on conflict (page_id, section_key) do nothing;
