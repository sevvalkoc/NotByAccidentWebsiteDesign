/* ── Content store ────────────────────────────────────────────────────────
   Two kinds of content, one rule: the CMS wins.

   • Records (projects, capabilities, notes, team, testimonials, settings)
     start from the static seed, are overlaid with the CMS snapshot taken at
     build time, then refreshed live in the browser after hydration.
   • Page content (every headline, line, CTA, image and video on every page)
     comes from `page_sections` rows of the new site's pages (`next/*`), field
     by field over the defaults in sections.<locale>.ts.

   Only English is CMS-edited, exactly as on the previous site; Dutch and
   French are static translations. UI microcopy (form labels, aria labels)
   lives in copy.<locale>.ts. */
import { useSyncExternalStore } from 'react'
import { useLocale, type Locale } from '@/i18n/locale'
import * as en from './seed/data.en'
import snapshot from './cms-snapshot.json'
import type { LiveContent, MetaOverride, PageMeta, PageSections, PageSlug, SectionContent, SiteData, NavItem } from './types'
import { en as copyEn, type Copy } from './copy.en'
import { sectionsEn, pageMetaEn } from './sections.en'

type Seed = Pick<typeof en, 'company' | 'socials' | 'projects' | 'capabilities' | 'categories' | 'notes' | 'testimonials' | 'team'>
const fromSeed = (s: Seed): SiteData => ({
  company: s.company,
  socials: s.socials,
  projects: s.projects,
  capabilities: s.capabilities,
  categories: s.categories.map(({ key, label, blurb }) => ({ key, label, blurb })),
  notes: s.notes,
  testimonials: s.testimonials,
  team: s.team,
  pages: {},
  pageMeta: {},
  seoDefaults: {},
  brand: {},
})

type Defaults = { sections: Record<PageSlug, PageSections>; meta: Record<PageSlug, PageMeta> }

/* English ships in the main bundle. Dutch and French load on demand: the
   browser awaits its own language before hydrating, the prerenderer loads
   both. */
const STATIC: Partial<Record<Locale, SiteData>> = { en: { ...fromSeed(en), ...(snapshot as LiveContent) } }
const COPY: Partial<Record<Locale, Copy>> = { en: copyEn }
const DEFAULTS: Partial<Record<Locale, Defaults>> = { en: { sections: sectionsEn, meta: pageMetaEn } }

export async function loadLocale(locale: Locale): Promise<void> {
  if (STATIC[locale]) return
  if (locale === 'nl') {
    const [d, c, s] = await Promise.all([import('./seed/data.nl'), import('./copy.nl'), import('./sections.nl')])
    STATIC.nl = fromSeed(d)
    COPY.nl = c.nl
    DEFAULTS.nl = { sections: s.sectionsNl, meta: s.pageMetaNl }
  } else if (locale === 'fr') {
    const [d, c, s] = await Promise.all([import('./seed/data.fr'), import('./copy.fr'), import('./sections.fr')])
    STATIC.fr = fromSeed(d)
    COPY.fr = c.fr
    DEFAULTS.fr = { sections: s.sectionsFr, meta: s.pageMetaFr }
  }
}

/* Live English overlay (browser only). */
let live: SiteData = STATIC.en!
const listeners = new Set<() => void>()
const subscribe = (cb: () => void) => (listeners.add(cb), () => void listeners.delete(cb))

export function getSite(locale: Locale): SiteData {
  return locale === 'en' ? live : (STATIC[locale] ?? live)
}
export function getCopy(locale: Locale): Copy {
  return COPY[locale] ?? copyEn
}

export function useSite(): SiteData {
  const locale = useLocale()
  const enLive = useSyncExternalStore(subscribe, () => live, () => STATIC.en!)
  return locale === 'en' ? enLive : (STATIC[locale] ?? enLive)
}
export function useCopy(): Copy {
  return getCopy(useLocale())
}

/* ── Page content ──────────────────────────────────────────────────────── */
const set = (v: unknown) => v !== undefined && v !== null
const has = (v: unknown) => set(v) && v !== ''

/** Merge one CMS section over its default. The CMS is authoritative: migration
 *  0010 seeds every default into the database, so an empty string or a removed
 *  image is an editor's decision, not a gap. Only a field the database has no
 *  value for at all (NULL) falls back to the built-in default. */
function merge(def: SectionContent | undefined, cms: SectionContent | undefined): SectionContent {
  if (!cms) return def ?? {}
  const d = def ?? {}
  const pick = <K extends keyof SectionContent>(k: K) => (set(cms[k]) ? cms[k] : d[k])
  return {
    eyebrow: pick('eyebrow'),
    title: pick('title'),
    subtitle: pick('subtitle'),
    body: pick('body'),
    ctaLabel: pick('ctaLabel'),
    ctaUrl: pick('ctaUrl'),
    image: cms.image === undefined ? (d.image ?? null) : cms.image,
    videoUrl: pick('videoUrl'),
    items: cms.items ?? d.items,
    extra: { ...(d.extra ?? {}), ...Object.fromEntries(Object.entries(cms.extra ?? {}).filter(([, v]) => set(v))) },
    visible: true,
  }
}

/** A page section, CMS over default. Returns null when an editor has hidden
 *  it (public reads only see visible sections, so a CMS page without the
 *  key means hidden). */
export function sectionOf(site: SiteData, locale: Locale, page: PageSlug, key: string): SectionContent | null {
  const def = (DEFAULTS[locale] ?? DEFAULTS.en!).sections[page]?.[key]
  if (locale !== 'en') return def ?? null
  const cmsPage = site.pages[page]
  if (!cmsPage) return def ?? null
  const cms = cmsPage[key]
  if (!cms) return null
  return merge(def, cms)
}

export function useSection(page: PageSlug, key: string): SectionContent | null {
  return sectionOf(useSite(), useLocale(), page, key)
}

/** Page SEO: CMS per-page override → static default → site-wide default. */
export function usePageMeta(page: PageSlug): PageMeta & MetaOverride {
  const site = useSite()
  const locale = useLocale()
  const def = (DEFAULTS[locale] ?? DEFAULTS.en!).meta[page]
  const cms = locale === 'en' ? (site.pageMeta[page] ?? {}) : {}
  const pick = (k: keyof PageMeta) => (has(cms[k]) ? cms[k] : def?.[k])
  return {
    title: (pick('title') as string) || site.seoDefaults.title || 'Not by Accident',
    description: (pick('description') as string) || site.seoDefaults.description || '',
    ogTitle: pick('ogTitle') as string | undefined,
    ogDescription: pick('ogDescription') as string | undefined,
    ogImage: (pick('ogImage') as string | undefined) || site.seoDefaults.ogImage,
    canonical: pick('canonical') as string | undefined,
    noindex: Boolean(pick('noindex')),
  }
}

/** A menu from the global page (header_nav / footer_nav). Items are
 *  { title: label, body: url }. */
export function useMenu(which: 'header_nav' | 'footer_nav'): NavItem[] {
  const s = useSection('global', which)
  return (s?.items ?? []).filter(i => i.title && i.body).map(i => ({ label: i.title, url: i.body, newTab: /^https?:/.test(i.body) || undefined }))
}

/* ── Live refresh ──────────────────────────────────────────────────────── */
let started = false
/** Called once after hydration (and by the admin after a save). */
export async function refreshSite(): Promise<void> {
  const { supabase } = await import('@/lib/supabase')
  if (!supabase) return
  const { fetchLiveContent } = await import('@/lib/cms')
  const next = await fetchLiveContent(supabase, en.company)
  if (Object.keys(next).length === 0) return
  live = { ...live, ...next }
  listeners.forEach(l => l())
}
export function startLiveContent() {
  if (started) return
  started = true
  void refreshSite()
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export { figureFor } from './figures'
export type * from './types'
