import type { Project as SeedProject, Note as SeedNote, Capability as SeedCapability, Category, TeamMember } from './seed/data.en.ts'
import type { company } from './seed/data.en.ts'

export type { Category, TeamMember }
export type { NoteBlock, ProjectNarrative } from './seed/data.en.ts'

/* ── Media ─────────────────────────────────────────────────────────────── */
export interface MediaRef {
  url: string
  alt: string
  kind: 'image' | 'video'
  caption?: string
  focalX?: number // 0–1, from the media library
  focalY?: number
  poster?: string
}

/* ── SEO, per page or per record ───────────────────────────────────────── */
export interface PageMeta {
  title: string
  description: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  noindex?: boolean
}
export type MetaOverride = Partial<PageMeta>

/* ── Records (seed shape + optional CMS-only fields) ───────────────────── */
export interface Project extends SeedProject {
  client?: string
  industry?: string
  introduction?: string
  heroVideo?: string
  gallery?: MediaRef[]
  credits?: string
  externalUrl?: string
  seo?: MetaOverride
}
export interface Note extends SeedNote {
  tags?: string[]
  author?: string
  seo?: MetaOverride
}
export interface Capability extends SeedCapability {
  seo?: MetaOverride
}

export type Company = typeof company

export interface Social {
  label: string
  handle: string
  url: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

export interface CategoryMeta {
  key: Category
  label: string
  blurb: string
}

/** One figure a case can be summarised by, lifted from its own outcome. */
export interface Figure {
  value: string
  label: string
}

/* ── Page content (mirrors a `page_sections` row) ──────────────────────── */
export interface SectionItem {
  title: string
  body: string
  meta?: string
}
export interface SectionContent {
  eyebrow?: string
  title?: string
  subtitle?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  image?: MediaRef | null
  videoUrl?: string
  items?: SectionItem[]
  extra?: Record<string, unknown>
  visible?: boolean
}
export type PageSections = Record<string, SectionContent>

export const PAGE_SLUGS = ['home', 'global', 'work', 'case-studies', 'capabilities', 'studio', 'notes', 'trainings', 'reports', 'contact', 'privacy', 'cookies', '404', 'lab', 'lab-how', 'lab-readiness', 'lab-app'] as const
export type PageSlug = (typeof PAGE_SLUGS)[number]

export interface NavItem {
  label: string
  url: string
  newTab?: boolean
}

export interface Brand {
  logoUrl?: string
  faviconUrl?: string
}

export interface SiteData {
  company: Company
  socials: Social[]
  projects: Project[]
  capabilities: Capability[]
  categories: CategoryMeta[]
  notes: Note[]
  testimonials: Testimonial[]
  team: TeamMember[]
  /** CMS page content, keyed by page slug (without the `next/` prefix). */
  pages: Partial<Record<PageSlug, PageSections>>
  /** CMS SEO per page. */
  pageMeta: Partial<Record<PageSlug, MetaOverride>>
  /** Global SEO defaults from Site Settings. */
  seoDefaults: MetaOverride
  brand: Brand
}

export type LiveContent = Partial<SiteData>
