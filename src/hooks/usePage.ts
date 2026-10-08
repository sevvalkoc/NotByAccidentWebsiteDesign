import { useHead, type HeadData } from '@/seo/head'
import { organization } from '@/seo/schema'
import { usePageMeta, useSite } from '@/content'
import { useLocale } from '@/i18n/locale'
import type { MetaOverride, PageSlug } from '@/content/types'

type Args = Omit<HeadData, 'locale' | 'title' | 'description'> & {
  /** A CMS page whose SEO fields apply (Pages → SEO). */
  page?: PageSlug
  title?: string
  description?: string
  /** Per-record SEO from the CMS (a project, note or capability). */
  seo?: MetaOverride
}

/** Every page: its own head, CMS SEO first, plus the Organization entity. */
export function usePage({ page, seo, ...h }: Args) {
  const locale = useLocale()
  const site = useSite()
  const pm = usePageMeta(page ?? '404')
  const fromPage = page ? pm : undefined
  const title = seo?.title || h.title || fromPage?.title || 'Not by Accident'
  const description = seo?.description || h.description || fromPage?.description || site.seoDefaults.description || ''
  useHead({
    ...h,
    locale,
    title,
    fullTitle: Boolean(seo?.title) || h.fullTitle,
    description,
    ogTitle: seo?.ogTitle || fromPage?.ogTitle,
    ogDescription: seo?.ogDescription || fromPage?.ogDescription,
    image: seo?.ogImage || h.image || fromPage?.ogImage || site.seoDefaults.ogImage,
    canonical: seo?.canonical || fromPage?.canonical,
    noindex: h.noindex || seo?.noindex || fromPage?.noindex,
    favicon: site.brand.faviconUrl,
    jsonLd: [organization(site.company, site.socials), ...(h.jsonLd ?? [])],
  })
}
