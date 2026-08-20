-- ============================================================================
-- NOT BY ACCIDENT — WORK / CASE STUDIES / CAPABILITIES INDEX HEADERS (Phase 4)
-- ============================================================================
-- Same page_sections pattern, applied to the three remaining index-page
-- headers that were still hard-coded in their page components.
--
-- Capabilities' heading is "<N> capabilities, in the order a company
-- actually needs them." where <N> is capabilities.length — a live count,
-- not something an editor should hand-type and have go stale. `title`
-- stores only the part after the count; the count itself stays
-- code-generated (see src/pages/Capabilities.tsx).
-- ============================================================================

insert into public.pages (slug, title) values
  ('work', 'Work'),
  ('case-studies', 'Case Studies'),
  ('capabilities', 'Capabilities')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order)
values (
  (select id from public.pages where slug = 'work'),
  'header',
  'Work',
  'An independent record of what we have made.',
  'We work on fewer projects than most. Each one receives the attention it requires. This is the archive.',
  1
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order)
values (
  (select id from public.pages where slug = 'case-studies'),
  'header',
  'Case Studies',
  'Work examined at length.',
  'Each case study is a full account of a project — the problem, the thinking and the result. Not a highlights reel.',
  1
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order)
values (
  (select id from public.pages where slug = 'capabilities'),
  'header',
  'Capabilities',
  'capabilities, in the order a company actually needs them.',
  'Five groups — Brand & Identity, Digital & Product, Growth & Demand, Market & Expansion, and Experiences. Take one, or the whole sequence. Each has its own team, method and page.',
  1
)
on conflict (page_id, section_key) do nothing;

-- ── Privacy ──────────────────────────────────────────────────────────────
insert into public.pages (slug, title) values ('privacy', 'Privacy')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order, extra)
values (
  (select id from public.pages where slug = 'privacy'),
  'header',
  'Privacy',
  'What we hold, and why.',
  'We collect very little and we treat it plainly. This notice explains exactly how, in language you should not need a lawyer to follow.',
  1,
  jsonb_build_object('lastUpdated', '8 August 2026')
)
on conflict (page_id, section_key) do nothing;

-- Five legal sections. Each item's body holds its paragraphs joined by a
-- blank line; the public page splits on that to render separate <p> tags.
-- Anchor ids for the "On this page" nav stay fixed by position (below in
-- src/pages/Privacy.tsx), independent of the editable heading text.
insert into public.page_sections (page_id, section_key, eyebrow, sort_order, extra)
values (
  (select id from public.pages where slug = 'privacy'),
  'legal',
  null,
  2,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title', 'Who we are', 'body', 'Not by Accident is an independent creative company. When we refer to "we", "us" or "our" in this notice, we mean Not by Accident. When we refer to "you", we mean anyone who visits this website or corresponds with us. Our full registered company details will be added here before this notice is treated as final.' || chr(10) || chr(10) || 'This notice explains what we collect, why we collect it, and what you can ask us to do about it. It is written to be read, not to be survived.'),
    jsonb_build_object('title', 'What we collect', 'body', 'We collect only what a conversation requires. When you write to us through the contact form or by email, we hold your name, your company, your email address and whatever you choose to tell us about your project. We keep it for as long as the conversation is live and for a reasonable period afterwards.' || chr(10) || chr(10) || 'When you browse the site, our hosting provider records standard technical information — the pages requested, the approximate region, the browser used. This is ordinary server activity, not surveillance.'),
    jsonb_build_object('title', 'Why we hold it', 'body', 'We use your information for one purpose: to respond to you and, where it becomes relevant, to carry out work you have asked us to do. We do not sell it. We do not build advertising profiles. We do not enrich it with data bought from elsewhere.' || chr(10) || chr(10) || 'Our lawful basis is either your consent, given when you write to us, or our legitimate interest in running a small business well.'),
    jsonb_build_object('title', 'Who sees it', 'body', 'Your information is seen by the people at Not by Accident who need to see it, and by a short list of service providers who help us operate — email, hosting and analytics. Each is bound by its own obligations. We choose them carefully and review them.'),
    jsonb_build_object('title', 'Your rights', 'body', 'You may ask to see the information we hold about you, to correct it, or to have it deleted. You may withdraw consent at any time. You may also complain to the Information Commissioner''s Office, though we would rather you told us first, so we can put it right.' || chr(10) || chr(10) || 'To exercise any of these rights, write to hello@notbyaccident.com. We will respond within one month, usually sooner.')
  ))
)
on conflict (page_id, section_key) do nothing;

-- ── Cookies ──────────────────────────────────────────────────────────────
insert into public.pages (slug, title) values ('cookies', 'Cookies')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order)
values (
  (select id from public.pages where slug = 'cookies'),
  'header',
  'Cookies',
  'A short note on cookies.',
  'We use a handful, and only the useful kind. No advertising trackers, no third-party profiling, no reselling of attention.',
  1
)
on conflict (page_id, section_key) do nothing;

-- Table rows. item.meta holds the lifespan column (e.g. "12 months") — the
-- one place a plain title+body list item isn't enough.
insert into public.page_sections (page_id, section_key, sort_order, extra)
values (
  (select id from public.pages where slug = 'cookies'),
  'table',
  2,
  jsonb_build_object('items', jsonb_build_array(
    jsonb_build_object('title', 'Essential', 'body', 'Keeps the site working — remembers your cookie choice and secures the connection. Nothing to opt out of; without these, nothing loads.', 'meta', 'Session – 12 months'),
    jsonb_build_object('title', 'Analytics', 'body', 'A single, privacy-respecting measure of which pages are read and roughly where readers arrive from. Aggregated, never tied to a name.', 'meta', '12 months'),
    jsonb_build_object('title', 'Preferences', 'body', 'Remembers small things you would rather we did not ask twice — such as whether you have dismissed a notice.', 'meta', '6 months')
  ))
)
on conflict (page_id, section_key) do nothing;

-- Body is only the explanatory paragraph — the closing sentence in the
-- component keeps its live links (to /privacy and the contact mailto) in
-- code rather than as unstyled plain text, so editing this copy can never
-- silently break those links.
insert into public.page_sections (page_id, section_key, title, body, sort_order)
values (
  (select id from public.pages where slug = 'cookies'),
  'managing',
  'Managing them yourself',
  'Every browser lets you see, block or delete cookies from its settings. Blocking the essential ones will stop parts of the site working; blocking the rest changes nothing you would notice.',
  3
)
on conflict (page_id, section_key) do nothing;
