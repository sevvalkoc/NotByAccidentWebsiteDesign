/* Public-read data layer: fetches published content from Supabase and maps
   it onto the exact shapes src/data.ts already exports, so every existing
   page keeps working unchanged — it just calls a hook instead of importing
   a static array. Every fetcher returns `null` (not `[]`) on any failure or
   when Supabase isn't configured yet, so callers can tell "empty" apart
   from "couldn't ask" and fall back to the static seed data accordingly. */
import { supabase, supabaseReady, publicMediaUrl } from '@/lib/supabase'
import type { Project, ProjectNarrative, Note, NoteBlock, Capability, Category, TeamMember } from '@/data'
import type {
  Testimonial,
  Wordmark,
  Social,
  Company,
  Hero,
  Homepage,
  Studio,
  StudioListItem,
  ContactCopy,
  ReportsCopy,
  PageHeader,
  CapabilitiesPageCopy,
  LegalCopy,
  CookiesCopy,
  NavLink,
  Seo,
  Trainings,
} from '@/content'
import type { ArticleBlock } from '@/lib/database.types'

type MediaRef = { bucket: string; storage_path: string } | null
function mediaUrl(m: MediaRef): string {
  return m ? publicMediaUrl(m.bucket, m.storage_path) : ''
}

export async function fetchProjects(): Promise<Project[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('projects')
    .select(
      `id, slug, title, year, location, short_description, challenge, insight, strategy, what_we_did,
       outcome, results, services, related_capability_slugs, featured, sort_order,
       hero_image:media!hero_image_media_id ( bucket, storage_path ),
       thumbnail:media!thumbnail_media_id ( bucket, storage_path )`
    )
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  type Row = {
    id: string
    slug: string
    title: string
    year: string | null
    location: string | null
    short_description: string | null
    challenge: string | null
    insight: string | null
    strategy: string | null
    what_we_did: string | null
    outcome: string | null
    results: string | null
    services: string[] | null
    related_capability_slugs: string[] | null
    featured: boolean
    sort_order: number
    hero_image: MediaRef
    thumbnail: MediaRef
  }
  return (data as unknown as Row[]).map((row, index): Project => {
    const hasNarrative = Boolean(row.challenge || row.insight || row.strategy || row.what_we_did || row.outcome)
    const narrative: ProjectNarrative | null = hasNarrative
      ? {
          problem: row.challenge ?? '',
          insight: row.insight ?? '',
          intervention: row.strategy ?? row.what_we_did ?? '',
          outcome: row.outcome ?? row.results ?? '',
        }
      : null
    const hero = mediaUrl(row.hero_image) || mediaUrl(row.thumbnail)
    const thumb = mediaUrl(row.thumbnail) || mediaUrl(row.hero_image)
    return {
      id: row.id,
      // Display position, not the raw sort_order value — keeps numbering
      // dense and starting at 01 regardless of what sort_order a new row
      // happens to have been created with.
      num: String(index + 1).padStart(2, '0'),
      name: row.title,
      discipline: (row.services ?? []).join(' · '),
      year: row.year ?? '',
      location: row.location ?? '',
      brief: row.short_description ?? '',
      narrative,
      services: row.services ?? [],
      relatedCapabilities: row.related_capability_slugs ?? [],
      img: thumb,
      heroImg: hero,
      result: row.results || narrative?.outcome || '',
      slug: row.slug,
      featured: row.featured,
    }
  })
}

export async function fetchCapabilities(): Promise<Capability[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('capabilities')
    .select('slug, name, category, summary, lede, includes, question, outcome, queries')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  type Row = {
    slug: string
    name: string
    category: Category
    summary: string | null
    lede: string | null
    includes: string[] | null
    question: string | null
    outcome: string | null
    queries: string[] | null
  }
  return (data as Row[]).map(
    (row): Capability => ({
      slug: row.slug,
      name: row.name,
      category: row.category,
      summary: row.summary ?? '',
      lede: row.lede ?? '',
      includes: row.includes ?? [],
      question: row.question ?? '',
      outcome: row.outcome ?? '',
      queries: row.queries ?? [],
    })
  )
}

export async function fetchNotes(): Promise<Note[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('articles')
    .select(
      `id, slug, title, excerpt, body, reading_time_minutes, published_at,
       hero_image:media!hero_image_media_id ( bucket, storage_path ),
       category:article_categories ( name )`
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false })
  if (error || !data) return null
  type Row = {
    id: string
    slug: string
    title: string
    excerpt: string | null
    body: ArticleBlock[] | null
    reading_time_minutes: number | null
    published_at: string | null
    hero_image: MediaRef
    category: { name: string } | null
  }
  const rows = data as unknown as Row[]

  // Image blocks store a media id, not a URL — resolve every referenced id
  // across all articles in one batch instead of one query per block.
  const imageMediaIds = new Set<string>()
  for (const row of rows) for (const b of row.body ?? []) if (b.type === 'image' && b.mediaId) imageMediaIds.add(b.mediaId)
  const mediaById = new Map<string, string>()
  if (imageMediaIds.size > 0) {
    const { data: mediaRows } = await supabase.from('media').select('id, bucket, storage_path').in('id', [...imageMediaIds])
    for (const m of (mediaRows as { id: string; bucket: string; storage_path: string }[]) ?? []) {
      mediaById.set(m.id, publicMediaUrl(m.bucket, m.storage_path))
    }
  }

  function toNoteBlocks(blocks: ArticleBlock[]): NoteBlock[] {
    return blocks
      .map((b): NoteBlock | null => {
        if (b.type === 'image') {
          const url = mediaById.get(b.mediaId)
          return url ? { type: 'image', url, caption: b.caption } : null
        }
        return b as NoteBlock
      })
      .filter((b): b is NoteBlock => b !== null)
  }

  function toPlainText(blocks: ArticleBlock[]): string {
    return blocks
      .map(b => {
        if (b.type === 'list') return b.items.join('\n')
        if (b.type === 'image' || b.type === 'divider' || b.type === 'embed') return ''
        return b.text
      })
      .filter(Boolean)
      .join('\n\n')
  }

  return rows.map((row): Note => {
    const blocks = row.body ?? []
    return {
      id: row.id,
      title: row.title,
      subtitle: row.excerpt ?? '',
      body: toPlainText(blocks),
      blocks: toNoteBlocks(blocks),
      date: row.published_at
        ? new Date(row.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : '',
      category: row.category?.name ?? 'Notes',
      readTime: row.reading_time_minutes ? `${row.reading_time_minutes} min` : '',
      img: mediaUrl(row.hero_image),
      slug: row.slug,
    }
  })
}

export async function fetchTestimonials(): Promise<Testimonial[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('testimonials')
    .select('quote, person_name, role, company')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  return (data as { quote: string; person_name: string; role: string | null; company: string | null }[]).map(
    (row): Testimonial => ({ quote: row.quote, name: row.person_name, role: row.role ?? '', company: row.company ?? '' })
  )
}

async function fetchWordmarks(table: 'clients' | 'partners', nameCol: 'company_name' | 'partner_name'): Promise<Wordmark[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from(table)
    .select(`${nameCol}, logo:media!logo_media_id ( bucket, storage_path )`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  type Row = Record<string, unknown> & { logo: MediaRef }
  return (data as unknown as Row[]).map((row): Wordmark => {
    const name = String(row[nameCol] ?? '')
    // No uploaded logo yet — fall back to a typographic wordmark so the
    // slider still reads as distinct marks rather than blank tiles.
    const styles: Wordmark['style'][] = ['serif', 'sans-tight', 'sans-wide', 'mono', 'italic', 'black']
    const style = styles[Math.abs(hashCode(name)) % styles.length]
    return { name, style }
  })
}
function hashCode(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return h
}
export const fetchClients = () => fetchWordmarks('clients', 'company_name')
export const fetchPartners = () => fetchWordmarks('partners', 'partner_name')

export async function fetchTeam(): Promise<TeamMember[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('team_members')
    .select('id, name, role, bio, portrait:media!portrait_media_id ( bucket, storage_path )')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  type Row = { id: string; name: string; role: string | null; bio: string | null; portrait: MediaRef }
  return (data as unknown as Row[]).map(
    (row): TeamMember => ({ id: row.id, name: row.name, role: row.role ?? '', bio: row.bio ?? '', img: mediaUrl(row.portrait) })
  )
}

/* Homepage hero copy and section headings — reads the `pages` / `page_sections`
   rows seeded by supabase/migrations/0005_homepage_sections.sql. Returns only
   the fields present in the DB; content.ts merges this over the static seed
   so a section that hasn't been edited yet just keeps its seed value. */
type PageSectionRow = {
  section_key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  extra: {
    words?: string[]
    imageOffsetX?: number
    imageOffsetY?: number
    items?: StudioListItem[]
    body2?: string
    waitingListNote?: string
    lastUpdated?: string
  } | null
  image: MediaRef
}

/** Shared by every page's section-fetcher below — one page lookup, one
 *  section-rows query, reused instead of repeated per page. */
async function fetchPageSectionRows(slug: string): Promise<PageSectionRow[] | null> {
  if (!supabase) return null
  const { data: page } = await supabase.from('pages').select('id').eq('slug', slug).maybeSingle()
  if (!page) return null
  const { data, error } = await supabase
    .from('page_sections')
    .select(
      `section_key, eyebrow, title, subtitle, body, extra,
       image:media!image_media_id ( bucket, storage_path )`
    )
    .eq('page_id', (page as { id: string }).id)
    .eq('is_visible', true)
  if (error || !data) return null
  return data as unknown as PageSectionRow[]
}

export async function fetchHomeSections(): Promise<{ hero: Partial<Hero>; homepage: Partial<Homepage> } | null> {
  const rows = await fetchPageSectionRows('home')
  if (!rows) return null

  const hero: Partial<Hero> = {}
  const homepage: Partial<Homepage> = {}

  for (const row of rows) {
    switch (row.section_key) {
      case 'hero':
        if (row.extra?.words?.length) hero.words = row.extra.words
        if (row.subtitle) hero.subhead = row.subtitle
        if (row.body) hero.definition = row.body
        if (row.image) hero.image = mediaUrl(row.image)
        if (typeof row.extra?.imageOffsetX === 'number') hero.imageOffsetX = row.extra.imageOffsetX
        if (typeof row.extra?.imageOffsetY === 'number') hero.imageOffsetY = row.extra.imageOffsetY
        break
      case 'capabilities':
        if (row.eyebrow) homepage.capabilitiesEyebrow = row.eyebrow
        if (row.title) homepage.capabilitiesHeading = row.title
        break
      case 'notes':
        if (row.eyebrow) homepage.notesEyebrow = row.eyebrow
        if (row.title) homepage.journalHeading = row.title
        break
      case 'case_studies':
        if (row.eyebrow) homepage.featuredEyebrow = row.eyebrow
        if (row.title) homepage.featuredHeading = row.title
        break
      case 'final_cta':
        if (row.eyebrow) homepage.ctaEyebrow = row.eyebrow
        if (row.title) homepage.ctaHeading = row.title
        if (row.body) homepage.ctaBody = row.body
        break
    }
  }
  return { hero, homepage }
}

export async function fetchStudioSections(): Promise<Partial<Studio> | null> {
  const rows = await fetchPageSectionRows('studio')
  if (!rows) return null

  const studio: Partial<Studio> = {}
  for (const row of rows) {
    switch (row.section_key) {
      case 'opening':
        if (row.eyebrow) studio.eyebrow = row.eyebrow
        if (row.title) studio.heading = row.title
        if (row.subtitle) studio.subhead = row.subtitle
        if (row.body) studio.body = row.body
        break
      case 'principles':
        if (row.eyebrow) studio.principlesEyebrow = row.eyebrow
        if (row.extra?.items?.length) studio.principles = row.extra.items
        break
      case 'culture':
        if (row.eyebrow) studio.cultureEyebrow = row.eyebrow
        if (row.title) studio.cultureHeading = row.title
        if (row.extra?.items?.length) studio.cultureItems = row.extra.items
        break
      case 'cta':
        if (row.title) studio.ctaHeading = row.title
        break
    }
  }
  return studio
}

export async function fetchContactSections(): Promise<Partial<ContactCopy> | null> {
  const rows = await fetchPageSectionRows('contact')
  const row = rows?.find(r => r.section_key === 'header')
  if (!row) return null
  const c: Partial<ContactCopy> = {}
  if (row.eyebrow) c.eyebrow = row.eyebrow
  if (row.title) c.heading = row.title
  if (row.subtitle) c.subhead = row.subtitle
  if (row.body) c.intro1 = row.body
  if (row.extra?.body2) c.intro2 = row.extra.body2
  return c
}

export async function fetchReportsSections(): Promise<Partial<ReportsCopy> | null> {
  const rows = await fetchPageSectionRows('reports')
  const row = rows?.find(r => r.section_key === 'header')
  if (!row) return null
  const r: Partial<ReportsCopy> = {}
  if (row.eyebrow) r.eyebrow = row.eyebrow
  if (row.title) r.heading = row.title
  if (row.subtitle) r.subhead = row.subtitle
  return r
}

export async function fetchTrainingsPageSections(): Promise<Partial<Trainings> | null> {
  const rows = await fetchPageSectionRows('trainings')
  const row = rows?.find(r => r.section_key === 'header')
  if (!row) return null
  const t: Partial<Trainings> = {}
  if (row.eyebrow) t.eyebrow = row.eyebrow
  if (row.title) t.heading = row.title
  if (row.subtitle) t.subhead = row.subtitle
  if (row.body) t.body1 = row.body
  if (row.extra?.body2) t.body2 = row.extra.body2
  if (row.extra?.waitingListNote) t.waitingListNote = row.extra.waitingListNote
  if (row.extra?.items?.length) t.format = row.extra.items.map(i => ({ label: i.title, value: i.body }))
  return t
}

async function fetchPageHeader(slug: string): Promise<Partial<PageHeader> | null> {
  const rows = await fetchPageSectionRows(slug)
  const row = rows?.find(r => r.section_key === 'header')
  if (!row) return null
  const h: Partial<PageHeader> = {}
  if (row.eyebrow) h.eyebrow = row.eyebrow
  if (row.title) h.heading = row.title
  if (row.subtitle) h.subhead = row.subtitle
  return h
}
export const fetchWorkSections = () => fetchPageHeader('work')
export const fetchCaseStudiesSections = () => fetchPageHeader('case-studies')

export async function fetchCapabilitiesPageSections(): Promise<Partial<CapabilitiesPageCopy> | null> {
  const rows = await fetchPageSectionRows('capabilities')
  const row = rows?.find(r => r.section_key === 'header')
  if (!row) return null
  const c: Partial<CapabilitiesPageCopy> = {}
  if (row.eyebrow) c.eyebrow = row.eyebrow
  if (row.title) c.headingSuffix = row.title
  if (row.subtitle) c.subhead = row.subtitle
  return c
}

export async function fetchPrivacySections(): Promise<Partial<LegalCopy> | null> {
  const rows = await fetchPageSectionRows('privacy')
  if (!rows) return null
  const header = rows.find(r => r.section_key === 'header')
  const legal = rows.find(r => r.section_key === 'legal')
  const p: Partial<LegalCopy> = {}
  if (header?.eyebrow) p.eyebrow = header.eyebrow
  if (header?.title) p.heading = header.title
  if (header?.subtitle) p.subhead = header.subtitle
  if (typeof header?.extra?.lastUpdated === 'string') p.lastUpdated = header.extra.lastUpdated
  if (legal?.extra?.items?.length) p.sections = legal.extra.items
  return p
}

export async function fetchCookiesSections(): Promise<Partial<CookiesCopy> | null> {
  const rows = await fetchPageSectionRows('cookies')
  if (!rows) return null
  const header = rows.find(r => r.section_key === 'header')
  const table = rows.find(r => r.section_key === 'table')
  const managing = rows.find(r => r.section_key === 'managing')
  const c: Partial<CookiesCopy> = {}
  if (header?.eyebrow) c.eyebrow = header.eyebrow
  if (header?.title) c.heading = header.title
  if (header?.subtitle) c.subhead = header.subtitle
  if (table?.extra?.items?.length) c.rows = table.extra.items
  if (managing?.title) c.managingHeading = managing.title
  if (managing?.body) c.managingBody = managing.body
  return c
}

export async function fetchSiteSettings(): Promise<{ company: Company; socials: Social[]; seo: Seo } | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return null
  const row = data as {
    site_name: string
    site_description: string | null
    default_seo_title: string | null
    default_meta_description: string | null
    default_og_image_url: string | null
    contact_email: string | null
    new_business_email: string | null
    press_email: string | null
    phone: string | null
    address_line1: string | null
    address_line2: string | null
    address_city: string | null
    address_postcode: string | null
    address_country: string | null
    registration_note: string | null
    hours: string | null
    social_links: { label: string; url: string }[] | null
  }
  const company: Company = {
    name: row.site_name,
    legalName: row.site_name,
    tagline: 'Wanted, on purpose.',
    proposition: row.site_description ?? '',
    email: row.contact_email ?? '',
    pressEmail: row.press_email ?? '',
    newBusinessEmail: row.new_business_email ?? '',
    phone: row.phone ?? '',
    phonePlaceholder: 'Phone number — to be added',
    registrationNote: row.registration_note ?? 'Company registration details to be added.',
    address: {
      line1: row.address_line1 ?? '',
      line2: row.address_line2 ?? '',
      city: row.address_city ?? '',
      postcode: row.address_postcode ?? '',
      country: row.address_country ?? '',
    },
    addressPlaceholder: 'Studio address — to be added',
    hours: row.hours ?? '',
  }
  const socials: Social[] = (row.social_links ?? []).map(s => ({ label: s.label, handle: s.label, url: s.url }))
  const seo: Seo = {
    description: row.default_meta_description ?? row.site_description ?? '',
    ogImage: row.default_og_image_url ?? '',
  }
  return { company, socials, seo }
}

export async function fetchNavigation(location: 'header' | 'footer' = 'header'): Promise<NavLink[] | null> {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('navigation_items')
    .select('label, url')
    .eq('location', location)
    .eq('is_visible', true)
    .order('sort_order', { ascending: true })
  if (error || !data) return null
  return (data as { label: string; url: string }[]).map(row => ({ to: row.url, label: row.label }))
}

/* Hero / homepage section copy and the Trainings "coming soon" copy live as
   page_sections rows. Falls back to the static seed when a page/section
   hasn't been created in the CMS yet, so partial migration is safe. */
export async function fetchPageSections(pageSlug: string): Promise<Record<string, Record<string, unknown>> | null> {
  if (!supabase) return null
  const { data: page } = await supabase.from('pages').select('id').eq('slug', pageSlug).maybeSingle()
  if (!page) return null
  const { data, error } = await supabase
    .from('page_sections')
    .select('section_key, eyebrow, title, subtitle, body, cta_label, cta_url, video_url, extra, is_visible')
    .eq('page_id', (page as { id: string }).id)
  if (error || !data) return null
  const out: Record<string, Record<string, unknown>> = {}
  for (const row of data as Record<string, unknown>[]) out[row.section_key as string] = row
  return out
}

export type { Hero, Homepage, Trainings }
