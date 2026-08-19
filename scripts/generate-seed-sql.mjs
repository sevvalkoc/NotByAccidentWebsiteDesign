// Generates supabase/migrations/0002_seed.sql from the current static
// content in src/data.ts, so the CMS launches already populated with
// everything that's live on the site today (task: "migrate existing
// content"). Run with: node --experimental-strip-types scripts/generate-seed-sql.mjs
//
// This does NOT touch Supabase — it only writes a .sql file for you (or the
// project owner) to run in the SQL Editor after 0001_init.sql.
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const data = await import('../src/data.ts')

function sqlStr(v) {
  if (v === null || v === undefined || v === '') return 'null'
  return `'${String(v).replace(/'/g, "''")}'`
}
function sqlArr(arr) {
  if (!arr || arr.length === 0) return "'{}'"
  return `ARRAY[${arr.map(v => sqlStr(v)).join(', ')}]::text[]`
}
function sqlBool(v) {
  return v ? 'true' : 'false'
}

const lines = []
lines.push('-- ============================================================================')
lines.push('-- NOT BY ACCIDENT — SEED DATA')
lines.push('-- ============================================================================')
lines.push('-- Auto-generated from src/data.ts by scripts/generate-seed-sql.mjs — do not')
lines.push('-- hand-edit; re-run the script instead if the static content changes.')
lines.push('-- Run this AFTER 0001_init.sql. Safe to re-run (upserts on the natural key).')
lines.push('--')
lines.push('-- This seeds published content for capabilities, projects/case studies,')
lines.push('-- articles/notes, testimonials, clients, partners and team members. Image')
lines.push('-- URLs are stored directly on a "media" row pointing at the existing Unsplash')
lines.push('-- URLs (file_type left as \'image\', bucket left null) so the site keeps')
lines.push('-- working immediately — replace them with real uploads from the Media')
lines.push('-- Library whenever you\'re ready; nothing forces you to do that on day one.')
lines.push('-- ============================================================================')
lines.push('')

// ---- capabilities ----
lines.push('-- Capabilities')
for (const [i, c] of data.capabilities.entries()) {
  lines.push(`insert into public.capabilities (slug, name, category, summary, lede, includes, question, outcome, queries, sort_order, is_active)
values (${sqlStr(c.slug)}, ${sqlStr(c.name)}, ${sqlStr(c.category)}, ${sqlStr(c.summary)}, ${sqlStr(c.lede)}, ${sqlArr(c.includes)}, ${sqlStr(c.question)}, ${sqlStr(c.outcome)}, ${sqlArr(c.queries)}, ${i}, true)
on conflict (slug) do update set name = excluded.name, category = excluded.category, summary = excluded.summary, lede = excluded.lede, includes = excluded.includes, question = excluded.question, outcome = excluded.outcome, queries = excluded.queries, sort_order = excluded.sort_order;`)
}
lines.push('')

// ---- media rows for external (Unsplash) URLs, keyed by a synthetic external path ----
// We store the full URL as storage_path with bucket 'external' so the frontend
// adapter can detect bucket === 'external' and use storage_path as-is
// instead of resolving it through Supabase Storage's public-URL helper.
const mediaUrls = new Set()
for (const p of data.projects) {
  if (p.img) mediaUrls.add(p.img)
  if (p.heroImg) mediaUrls.add(p.heroImg)
}
for (const n of data.notes) if (n.img) mediaUrls.add(n.img)
for (const t of data.team) if (t.img) mediaUrls.add(t.img)

lines.push('-- External (Unsplash) image references, so seeded rows below have something to point at')
lines.push("insert into public.media (bucket, storage_path, file_type, file_name, alt_text)")
lines.push('values')
lines.push(
  [...mediaUrls]
    .map(u => `  ('external', ${sqlStr(u)}, 'image', ${sqlStr(u.split('/').pop()?.split('?')[0] ?? 'image')}, null)`)
    .join(',\n') + ';'
)
lines.push('on conflict (bucket, storage_path) do nothing;')
lines.push('')

function mediaSubquery(url) {
  if (!url) return 'null'
  return `(select id from public.media where bucket = 'external' and storage_path = ${sqlStr(url)})`
}

// ---- projects ----
lines.push('-- Projects / Case studies')
for (const p of data.projects) {
  const n = p.narrative
  lines.push(`insert into public.projects (
  title, client, slug, year, industry, location, short_description,
  challenge, insight, strategy, outcome, results, services,
  related_capability_slugs, hero_image_media_id, thumbnail_media_id,
  featured, sort_order, status, published_at
) values (
  ${sqlStr(p.name)}, null, ${sqlStr(p.slug)}, ${sqlStr(p.year)}, null, ${sqlStr(p.location)}, ${sqlStr(p.brief)},
  ${sqlStr(n?.problem)}, ${sqlStr(n?.insight)}, ${sqlStr(n?.intervention)}, ${sqlStr(n?.outcome)}, ${sqlStr(p.result)}, ${sqlArr(p.services)},
  ${sqlArr(p.relatedCapabilities)}, ${mediaSubquery(p.heroImg)}, ${mediaSubquery(p.img)},
  ${sqlBool(p.featured)}, ${p.num}, 'published', now()
)
on conflict (slug) do update set title = excluded.title, short_description = excluded.short_description, challenge = excluded.challenge, insight = excluded.insight, strategy = excluded.strategy, outcome = excluded.outcome, results = excluded.results, services = excluded.services, related_capability_slugs = excluded.related_capability_slugs, featured = excluded.featured, sort_order = excluded.sort_order;`)
}
lines.push('')

// ---- article category + articles ----
lines.push('-- Article categories')
const categories = [...new Set(data.notes.map(n => n.category))]
for (const c of categories) {
  lines.push(`insert into public.article_categories (name, slug) values (${sqlStr(c)}, ${sqlStr(c.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}) on conflict (name) do nothing;`)
}
lines.push('')
lines.push('-- Articles / Notes')
for (const n of data.notes) {
  const bodyBlocks = n.body
    .split('\n\n')
    .filter(Boolean)
    .map(text => ({ type: 'paragraph', text }))
  const bodyJson = JSON.stringify(bodyBlocks).replace(/'/g, "''")
  // Parse "3 July 2026" style dates into a real timestamp.
  const parsed = new Date(n.date)
  const publishedAt = Number.isNaN(parsed.getTime()) ? 'now()' : `'${parsed.toISOString()}'`
  lines.push(`insert into public.articles (
  title, slug, excerpt, body, category_id, hero_image_media_id,
  reading_time_minutes, status, published_at
) values (
  ${sqlStr(n.title)}, ${sqlStr(n.slug)}, ${sqlStr(n.subtitle)}, '${bodyJson}'::jsonb,
  (select id from public.article_categories where name = ${sqlStr(n.category)}),
  ${mediaSubquery(n.img)}, ${parseInt(n.readTime) || null}, 'published', ${publishedAt}
)
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, body = excluded.body, category_id = excluded.category_id, reading_time_minutes = excluded.reading_time_minutes;`)
}
lines.push('')

// ---- testimonials ----
lines.push('-- Testimonials')
for (const [i, t] of data.testimonials.entries()) {
  lines.push(`insert into public.testimonials (quote, person_name, role, company, sort_order, is_active)
values (${sqlStr(t.quote)}, ${sqlStr(t.name)}, ${sqlStr(t.role)}, ${sqlStr(t.company)}, ${i}, true)
on conflict (person_name, company) do nothing;`)
}
lines.push('')

// ---- clients / partners (typographic wordmarks — no logo files yet) ----
lines.push('-- Clients (typographic placeholders — replace logo_media_id once real logo files are uploaded)')
for (const [i, c] of data.clientLogos.entries()) {
  lines.push(`insert into public.clients (company_name, alt_text, sort_order, is_active) values (${sqlStr(c.name)}, ${sqlStr(c.name)}, ${i}, true) on conflict (company_name) do nothing;`)
}
lines.push('')
lines.push('-- Partners')
for (const [i, p] of data.partnerLogos.entries()) {
  lines.push(`insert into public.partners (partner_name, alt_text, sort_order, is_active) values (${sqlStr(p.name)}, ${sqlStr(p.name)}, ${i}, true) on conflict (partner_name) do nothing;`)
}
lines.push('')

// ---- team ----
lines.push('-- Team members')
for (const [i, m] of data.team.entries()) {
  lines.push(`insert into public.team_members (name, role, bio, portrait_media_id, sort_order, is_active)
values (${sqlStr(m.name)}, ${sqlStr(m.role)}, ${sqlStr(m.bio)}, ${mediaSubquery(m.img)}, ${i}, true)
on conflict (name) do nothing;`)
}
lines.push('')

// ---- site settings ----
const c = data.company
lines.push('-- Site settings (singleton)')
lines.push(`update public.site_settings set
  site_name = ${sqlStr(c.name)},
  site_description = ${sqlStr(c.proposition)},
  default_seo_title = ${sqlStr('Independent creative company, Amsterdam')},
  contact_email = ${sqlStr(c.email)},
  new_business_email = ${sqlStr(c.newBusinessEmail)},
  press_email = ${sqlStr(c.pressEmail)},
  hours = ${sqlStr(c.hours)},
  social_links = '${JSON.stringify(data.socials.map(s => ({ label: s.label, url: s.url }))).replace(/'/g, "''")}'::jsonb
where id = 1;`)
lines.push('')

// ---- navigation ----
lines.push('-- Header navigation')
const navItems = [
  { label: 'Work', url: '/work' },
  { label: 'Notes', url: '/notes' },
  { label: 'Studio', url: '/studio' },
  { label: 'Trainings', url: '/trainings' },
  { label: 'Reports', url: '/reports' },
  { label: 'Contact', url: '/contact' },
]
for (const [i, item] of navItems.entries()) {
  lines.push(`insert into public.navigation_items (location, label, url, sort_order) values ('header', ${sqlStr(item.label)}, ${sqlStr(item.url)}, ${i}) on conflict (location, label) do nothing;`)
}
lines.push('')

const outPath = join(__dirname, '..', 'supabase', 'migrations', '0002_seed.sql')
writeFileSync(outPath, lines.join('\n') + '\n')
console.log(`Wrote ${outPath} (${lines.length} lines)`)
