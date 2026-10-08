/* Public-read CMS layer. Pure functions over a Supabase client, so the same
   code runs in the browser (live refresh after hydration) and in Node at
   build time (scripts/cms-snapshot.ts), which keeps prerendered HTML and
   the hydrated app in agreement.

   Row-level security does the publishing work: anonymous reads only ever
   see published projects/articles, active capabilities and visible
   sections. Every fetcher returns null on failure so the caller keeps its
   seed value. Where a query uses columns added by migration 0010, it falls
   back to the pre-0010 column set so an unmigrated database still works. */
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Project, ProjectNarrative, NoteBlock, Category, TeamMember } from '../content/seed/data.en.ts'
import type { ArticleBlock } from './database.types.ts'
import type {
  Company,
  Social,
  Testimonial,
  CategoryMeta,
  LiveContent,
  MediaRef,
  MetaOverride,
  PageSections,
  SectionContent,
  SectionItem,
  Brand,
  Project as RichProject,
  Note as RichNote,
  Capability as RichCapability,
} from '../content/types.ts'

type MediaRow = {
  bucket: string
  storage_path: string
  file_type?: string | null
  alt_text?: string | null
  caption?: string | null
  focal_x?: number | null
  focal_y?: number | null
} | null

const MEDIA = 'bucket, storage_path, file_type, alt_text, caption, focal_x, focal_y'

function url(client: SupabaseClient, m: MediaRow): string {
  if (!m || !m.storage_path) return ''
  if (m.bucket === 'external') return m.storage_path
  return client.storage.from(m.bucket).getPublicUrl(m.storage_path).data.publicUrl
}

function mediaRef(client: SupabaseClient, m: MediaRow, fallbackAlt = ''): MediaRef | null {
  const u = url(client, m)
  if (!u) return null
  return {
    url: u,
    alt: m?.alt_text || fallbackAlt,
    kind: m?.file_type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(u) ? 'video' : 'image',
    caption: m?.caption || undefined,
    focalX: m?.focal_x ?? undefined,
    focalY: m?.focal_y ?? undefined,
  }
}

const clean = <T extends object>(o: T): T => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined && v !== '')) as T

function meta(client: SupabaseClient, r: Record<string, unknown>): MetaOverride {
  return clean({
    title: (r.seo_title as string) || undefined,
    description: (r.seo_description as string) || undefined,
    ogTitle: (r.og_title as string) || undefined,
    ogDescription: (r.og_description as string) || undefined,
    ogImage: url(client, (r.og as MediaRow) ?? null) || undefined,
    canonical: (r.canonical_url as string) || undefined,
    noindex: (r.noindex as boolean) || undefined,
  })
}

/** Runs the extended query; on a column error, the pre-0010 one. */
async function tryBoth<T>(rich: () => PromiseLike<{ data: T | null; error: unknown }>, base: () => PromiseLike<{ data: T | null; error: unknown }>) {
  const a = await rich()
  if (!a.error) return a.data
  const b = await base()
  return b.error ? null : b.data
}

/* ── Projects ──────────────────────────────────────────────────────────── */
const PROJECT_BASE = `id, slug, title, client, industry, year, location, short_description, introduction, challenge, insight, strategy, what_we_did,
  outcome, results, services, related_capability_slugs, featured, sort_order, credits, external_url,
  seo_title, seo_description, canonical_url, noindex,
  hero_image:media!hero_image_media_id ( ${MEDIA} ),
  thumbnail:media!thumbnail_media_id ( ${MEDIA} ),
  og:media!og_media_id ( ${MEDIA} ),
  project_media ( kind, video_url, caption, sort_order, media ( ${MEDIA} ) )`
const PROJECT_RICH = PROJECT_BASE + ', hero_video_url, og_title, og_description'

export async function fetchProjects(client: SupabaseClient): Promise<RichProject[] | null> {
  const run = (cols: string) => client.from('projects').select(cols).eq('status', 'published').order('sort_order', { ascending: true })
  const data = await tryBoth(() => run(PROJECT_RICH), () => run(PROJECT_BASE))
  if (!data || (data as unknown[]).length === 0) return null
  type Row = Record<string, unknown> & {
    id: string
    slug: string
    title: string
    services: string[] | null
    related_capability_slugs: string[] | null
    featured: boolean
    hero_image: MediaRow
    thumbnail: MediaRow
    project_media: { kind: string; video_url: string | null; caption: string | null; sort_order: number; media: MediaRow }[] | null
  }
  return (data as unknown as Row[]).map((row, index): RichProject => {
    const s = (k: string) => (row[k] as string | null) ?? ''
    const hasNarrative = Boolean(s('challenge') || s('insight') || s('strategy') || s('what_we_did') || s('outcome'))
    const narrative: ProjectNarrative | null = hasNarrative
      ? { problem: s('challenge'), insight: s('insight'), intervention: s('strategy') || s('what_we_did'), outcome: s('outcome') || s('results') }
      : null
    const hero = url(client, row.hero_image) || url(client, row.thumbnail)
    const gallery = [...(row.project_media ?? [])]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((pm): MediaRef | null => {
        const m = mediaRef(client, pm.media, row.title)
        if (pm.kind === 'video' && pm.video_url) return { url: pm.video_url, alt: row.title, kind: 'video' as const, caption: pm.caption ?? undefined, poster: m?.url }
        return m ? { ...m, caption: pm.caption || m.caption } : null
      })
      .filter((m): m is MediaRef => m !== null)
    const base: Project = {
      id: row.id,
      num: String(index + 1).padStart(2, '0'),
      name: row.title,
      discipline: (row.services ?? []).join(' · '),
      year: s('year'),
      location: s('location'),
      brief: s('short_description'),
      narrative,
      services: row.services ?? [],
      relatedCapabilities: row.related_capability_slugs ?? [],
      img: url(client, row.thumbnail) || hero,
      heroImg: hero,
      result: s('results') || narrative?.outcome || '',
      slug: row.slug,
      featured: row.featured,
    }
    return {
      ...base,
      client: s('client') || undefined,
      industry: s('industry') || undefined,
      introduction: s('introduction') || undefined,
      heroVideo: s('hero_video_url') || undefined,
      gallery,
      credits: s('credits') || undefined,
      externalUrl: s('external_url') || undefined,
      seo: meta(client, row),
    }
  })
}

/* ── Capabilities ──────────────────────────────────────────────────────── */
export async function fetchCategoryMeta(client: SupabaseClient): Promise<CategoryMeta[] | null> {
  const { data, error } = await client.from('category_meta').select('key, label, blurb').order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return null
  return data as CategoryMeta[]
}

const CAP_BASE = 'slug, name, category, summary, lede, includes, question, outcome, queries'
const CAP_RICH = CAP_BASE + `, seo_title, seo_description, canonical_url, noindex, og:media!og_media_id ( ${MEDIA} )`

export async function fetchCapabilities(client: SupabaseClient): Promise<RichCapability[] | null> {
  const run = (cols: string) => client.from('capabilities').select(cols).eq('is_active', true).order('sort_order', { ascending: true })
  const data = await tryBoth(() => run(CAP_RICH), () => run(CAP_BASE))
  if (!data || (data as unknown[]).length === 0) return null
  type Row = Record<string, unknown> & { slug: string; name: string; category: Category; includes: string[] | null; queries: string[] | null }
  return (data as unknown as Row[]).map(
    (row): RichCapability => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      summary: (row.summary as string) ?? '',
      lede: (row.lede as string) ?? '',
      includes: row.includes ?? [],
      question: (row.question as string) ?? '',
      outcome: (row.outcome as string) ?? '',
      queries: row.queries ?? [],
      seo: meta(client, row),
    }),
  )
}

/* ── Notes ─────────────────────────────────────────────────────────────── */
const NOTE_BASE = `id, slug, title, excerpt, body, tags, reading_time_minutes, published_at,
  seo_title, seo_description, canonical_url, noindex,
  hero_image:media!hero_image_media_id ( ${MEDIA} ),
  og:media!og_media_id ( ${MEDIA} ),
  category:article_categories ( name )`
const NOTE_RICH = NOTE_BASE + ', og_title, og_description'

export async function fetchNotes(client: SupabaseClient): Promise<RichNote[] | null> {
  const run = (cols: string) => client.from('articles').select(cols).eq('status', 'published').order('published_at', { ascending: false })
  const data = await tryBoth(() => run(NOTE_RICH), () => run(NOTE_BASE))
  if (!data || (data as unknown[]).length === 0) return null
  type Row = Record<string, unknown> & {
    id: string
    slug: string
    title: string
    body: ArticleBlock[] | null
    tags: string[] | null
    hero_image: MediaRow
    category: { name: string } | null
  }
  const rows = data as unknown as Row[]
  const ids = new Set<string>()
  for (const row of rows) for (const b of row.body ?? []) if (b.type === 'image' && b.mediaId) ids.add(b.mediaId)
  const byId = new Map<string, string>()
  if (ids.size > 0) {
    const { data: media } = await client.from('media').select(`id, ${MEDIA}`).in('id', [...ids])
    for (const m of (media as (MediaRow & { id: string })[]) ?? []) byId.set(m!.id, url(client, m))
  }
  const toBlocks = (blocks: ArticleBlock[]): NoteBlock[] =>
    blocks
      .map((b): NoteBlock | null => {
        if (b.type === 'image') {
          const u = byId.get(b.mediaId)
          return u ? { type: 'image', url: u, caption: b.caption } : null
        }
        return b as NoteBlock
      })
      .filter((b): b is NoteBlock => b !== null)
  const toText = (blocks: ArticleBlock[]) =>
    blocks
      .map(b => (b.type === 'list' ? b.items.join('\n') : b.type === 'image' || b.type === 'divider' || b.type === 'embed' ? '' : b.text))
      .filter(Boolean)
      .join('\n\n')

  return rows.map((row): RichNote => {
    const blocks = row.body ?? []
    const published = row.published_at as string | null
    return {
      id: row.id,
      title: row.title,
      subtitle: (row.excerpt as string) ?? '',
      body: toText(blocks),
      blocks: toBlocks(blocks),
      date: published ? new Date(published).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Amsterdam' }) : '',
      category: row.category?.name ?? 'Notes',
      readTime: row.reading_time_minutes ? `${row.reading_time_minutes} min` : '',
      img: url(client, row.hero_image),
      slug: row.slug,
      tags: row.tags ?? [],
      seo: meta(client, row),
    }
  })
}

/* ── People ────────────────────────────────────────────────────────────── */
export async function fetchTestimonials(client: SupabaseClient): Promise<Testimonial[] | null> {
  const { data, error } = await client.from('testimonials').select('quote, person_name, role, company').eq('is_active', true).order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return null
  return (data as { quote: string; person_name: string; role: string | null; company: string | null }[]).map(r => ({
    quote: r.quote,
    name: r.person_name,
    role: r.role ?? '',
    company: r.company ?? '',
  }))
}

export async function fetchTeam(client: SupabaseClient): Promise<TeamMember[] | null> {
  const { data, error } = await client
    .from('team_members')
    .select(`id, name, role, bio, portrait:media!portrait_media_id ( ${MEDIA} )`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return null
  type Row = { id: string; name: string; role: string | null; bio: string | null; portrait: MediaRow }
  return (data as unknown as Row[]).map(r => ({ id: r.id, name: r.name, role: r.role ?? '', bio: r.bio ?? '', img: url(client, r.portrait) }))
}

/* ── Settings, brand, navigation ───────────────────────────────────────── */
export async function fetchSiteSettings(
  client: SupabaseClient,
  fallback: Company,
): Promise<{ company: Company; socials: Social[]; seoDefaults: MetaOverride } | null> {
  const { data, error } = await client.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return null
  const row = data as Record<string, string | null> & { social_links: { label: string; url: string }[] | null }
  const company: Company = {
    ...fallback,
    name: row.site_name || fallback.name,
    legalName: row.site_name || fallback.legalName,
    proposition: row.site_description || fallback.proposition,
    email: row.contact_email || fallback.email,
    pressEmail: row.press_email || fallback.pressEmail,
    newBusinessEmail: row.new_business_email || fallback.newBusinessEmail,
    phone: row.phone ?? '',
    registrationNote: row.registration_note ?? '',
    address: {
      line1: row.address_line1 ?? '',
      line2: row.address_line2 ?? '',
      city: row.address_city ?? '',
      postcode: row.address_postcode ?? '',
      country: row.address_country ?? '',
    },
    hours: row.hours || fallback.hours,
  }
  const socials: Social[] = (row.social_links ?? []).filter(s => s.url).map(s => ({ label: s.label, handle: s.label, url: s.url }))
  const seoDefaults = clean({
    title: row.default_seo_title || undefined,
    description: row.default_meta_description || undefined,
    ogImage: row.default_og_image_url || undefined,
  })
  return { company, socials, seoDefaults }
}

export async function fetchBrand(client: SupabaseClient): Promise<{ brand: Brand; ogImage?: string } | null> {
  const { data, error } = await client
    .from('brand_settings')
    .select(`logo:media!logo_primary_media_id ( ${MEDIA} ), favicon:media!favicon_media_id ( ${MEDIA} ), og:media!og_default_media_id ( ${MEDIA} )`)
    .eq('id', 1)
    .maybeSingle()
  if (error || !data) return null
  const r = data as unknown as { logo: MediaRow; favicon: MediaRow; og: MediaRow }
  return { brand: clean({ logoUrl: url(client, r.logo) || undefined, faviconUrl: url(client, r.favicon) || undefined }), ogImage: url(client, r.og) || undefined }
}

/* ── Pages and their sections ──────────────────────────────────────────── */
const PAGE_BASE = `slug, seo_title, seo_description, canonical_url, noindex, og:media!og_media_id ( ${MEDIA} ),
  page_sections ( section_key, eyebrow, title, subtitle, body, cta_label, cta_url, video_url, is_visible, extra, image:media!image_media_id ( ${MEDIA} ) )`
const PAGE_RICH = PAGE_BASE + ', og_title, og_description'

export async function fetchPages(client: SupabaseClient): Promise<{ pages: Record<string, PageSections>; meta: Record<string, MetaOverride> } | null> {
  const run = (cols: string) => client.from('pages').select(cols).like('slug', 'next/%')
  const data = await tryBoth(() => run(PAGE_RICH), () => run(PAGE_BASE))
  if (!data || (data as unknown[]).length === 0) return null
  type SectionRow = {
    section_key: string
    eyebrow: string | null
    title: string | null
    subtitle: string | null
    body: string | null
    cta_label: string | null
    cta_url: string | null
    video_url: string | null
    is_visible: boolean
    extra: Record<string, unknown> | null
    image: MediaRow
  }
  type Row = Record<string, unknown> & { slug: string; page_sections: SectionRow[] | null }
  const pages: Record<string, PageSections> = {}
  const metaOut: Record<string, MetaOverride> = {}
  for (const row of data as unknown as Row[]) {
    const slug = row.slug.replace(/^next\//, '')
    metaOut[slug] = meta(client, row)
    const sections: PageSections = {}
    for (const s of row.page_sections ?? []) {
      const { items, ...extra } = (s.extra ?? {}) as { items?: SectionItem[] } & Record<string, unknown>
      const text = (v: string | null) => v ?? undefined
      const content: SectionContent = {
        eyebrow: text(s.eyebrow),
        title: text(s.title),
        subtitle: text(s.subtitle),
        body: text(s.body),
        ctaLabel: text(s.cta_label),
        ctaUrl: text(s.cta_url),
        image: mediaRef(client, s.image),
        videoUrl: text(s.video_url),
        items: Array.isArray(items) ? items : undefined,
        extra,
        visible: s.is_visible,
      }
      sections[s.section_key] = content
    }
    pages[slug] = sections
  }
  return { pages, meta: metaOut }
}

/** Everything the public site reads from the CMS, in one call. Only fields
 *  that came back are present, so a partial outage degrades per collection. */
export async function fetchLiveContent(client: SupabaseClient, fallbackCompany: Company): Promise<LiveContent> {
  const out: LiveContent = {}
  let brandOg: string | undefined
  await Promise.allSettled([
    fetchProjects(client).then(v => v && (out.projects = v)),
    fetchCapabilities(client).then(v => v && (out.capabilities = v)),
    fetchCategoryMeta(client).then(v => v && (out.categories = v)),
    fetchNotes(client).then(v => v && (out.notes = v)),
    fetchTestimonials(client).then(v => v && (out.testimonials = v)),
    fetchTeam(client).then(v => v && (out.team = v)),
    fetchPages(client).then(v => {
      if (!v) return
      out.pages = v.pages
      out.pageMeta = v.meta
    }),
    fetchBrand(client).then(v => {
      if (!v) return
      out.brand = v.brand
      brandOg = v.ogImage
    }),
    fetchSiteSettings(client, fallbackCompany).then(v => {
      if (!v) return
      out.company = v.company
      if (v.socials.length) out.socials = v.socials
      out.seoDefaults = v.seoDefaults
    }),
  ])
  if (brandOg) out.seoDefaults = { ogImage: brandOg, ...(out.seoDefaults ?? {}) }
  return out
}
