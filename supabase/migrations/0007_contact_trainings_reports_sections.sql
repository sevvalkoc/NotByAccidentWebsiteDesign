-- ============================================================================
-- NOT BY ACCIDENT — CONTACT / TRAININGS / REPORTS PAGE SECTIONS (Phase 3)
-- ============================================================================
-- Same pattern as 0005/0006: seeds page_sections rows carrying the copy that
-- was hard-coded in src/pages/Contact.tsx, Trainings.tsx and Reports.tsx.
-- ============================================================================

insert into public.pages (slug, title) values
  ('contact', 'Contact'),
  ('trainings', 'Trainings'),
  ('reports', 'Reports')
on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, body, sort_order, extra)
values (
  (select id from public.pages where slug = 'contact'),
  'header',
  'Contact',
  'Write to us.',
  'We work with founders and creative leads who suspect their company is better than its reputation.',
  'We do not work with everyone. We work on fewer projects than most, and each one receives the attention it requires.',
  1,
  jsonb_build_object('body2', 'Before writing, it is worth knowing that we typically begin with a strategy engagement. If you are looking for a production company or an execution partner, we are probably not the right fit.')
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, body, sort_order, extra)
values (
  (select id from public.pages where slug = 'trainings'),
  'header',
  'Trainings — Opening 2027',
  'Teaching the work, not the theory.',
  'Everything we have learned about brand strategy and creative direction, taught directly.',
  'Two workshops, available in 2027. The first on brand strategy — the real work of positioning, naming and building a brief. The second on creative direction — how to make things that are genuinely different and commercially sound.',
  1,
  jsonb_build_object(
    'body2', 'In person. Deliberately small. Amsterdam and one other city per year. No certification. No slides you will never open again.',
    'waitingListNote', 'Leave your email address and we will write to you first when registration opens. One email. No marketing.',
    'items', jsonb_build_array(
      jsonb_build_object('title', 'Format', 'body', 'In-person workshop, two days'),
      jsonb_build_object('title', 'Group size', 'body', 'Maximum twelve participants'),
      jsonb_build_object('title', 'Location', 'body', 'Amsterdam, one further city per year'),
      jsonb_build_object('title', 'First date', 'body', '2027 — date to be confirmed'),
      jsonb_build_object('title', 'Disciplines', 'body', 'Brand Strategy · Creative Direction')
    )
  )
)
on conflict (page_id, section_key) do nothing;

insert into public.page_sections (page_id, section_key, eyebrow, title, subtitle, sort_order)
values (
  (select id from public.pages where slug = 'reports'),
  'header',
  'Reports · Coming soon',
  'The research, in the open.',
  'We are putting together a small library of original reports — benchmarks, field notes and the working we usually keep to ourselves. Honest numbers, plainly argued. It is not ready yet, but it is close.',
  1
)
on conflict (page_id, section_key) do nothing;
