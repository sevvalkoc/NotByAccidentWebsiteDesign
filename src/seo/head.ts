/* ── Head ─────────────────────────────────────────────────────────────────
   One description of a page's <head>, produced by the page itself. At build
   time scripts/prerender.mjs serialises it into static HTML, so crawlers and
   social bots that never run JavaScript still get the right title, meta,
   canonical, hreflang and JSON-LD. In the browser the same description is
   applied to document.head on every client-side navigation. Every managed
   tag carries data-h, so the two never duplicate. */
import { createContext, useContext, useEffect } from 'react'
import { LOCALES, OG_LOCALE, localizePath, type Locale } from '@/i18n/locale'

export const SITE_URL = 'https://notbyaccident.com'
export const SITE_NAME = 'Not by Accident'

export interface HeadData {
  /** Page title without the brand suffix, or the full title when `fullTitle`. */
  title: string
  fullTitle?: boolean
  description: string
  /** Canonical, unprefixed route, e.g. "/work". */
  path: string
  locale: Locale
  image?: string
  imageAlt?: string
  type?: 'website' | 'article'
  noindex?: boolean
  /** False for pages that exist in one language only. */
  alternates?: boolean
  publishedTime?: string
  jsonLd?: object[]
  ogTitle?: string
  ogDescription?: string
  /** Absolute canonical override from the CMS. */
  canonical?: string
  favicon?: string
}

type Tag =
  | { tag: 'title'; text: string }
  | { tag: 'meta' | 'link'; attrs: Record<string, string> }
  | { tag: 'script'; text: string }

export const absolute = (url: string) => (url.startsWith('http') ? url : SITE_URL + url)

export function headTags(h: HeadData): Tag[] {
  const title = h.fullTitle ? h.title : `${h.title} · ${SITE_NAME}`
  const url = h.canonical || SITE_URL + localizePath(h.path, h.locale)
  const image = absolute(h.image || '/og-default.jpg')
  const tags: Tag[] = [
    { tag: 'title', text: title },
    { tag: 'meta', attrs: { name: 'description', content: h.description } },
    { tag: 'meta', attrs: { name: 'robots', content: h.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' } },
  ]
  if (!h.noindex) {
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } })
    if (h.alternates !== false) {
      for (const l of LOCALES) tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: l, href: SITE_URL + localizePath(h.path, l) } })
      tags.push({ tag: 'link', attrs: { rel: 'alternate', hreflang: 'x-default', href: SITE_URL + h.path } })
    }
  }
  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: h.type ?? 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE_NAME } },
    { tag: 'meta', attrs: { property: 'og:locale', content: OG_LOCALE[h.locale] } },
    { tag: 'meta', attrs: { property: 'og:title', content: h.ogTitle || title } },
    { tag: 'meta', attrs: { property: 'og:description', content: h.ogDescription || h.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: h.imageAlt || title } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: h.ogTitle || title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: h.ogDescription || h.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
  )
  if (h.favicon) tags.push({ tag: 'link', attrs: { rel: 'icon', href: h.favicon } })
  if (h.publishedTime) tags.push({ tag: 'meta', attrs: { property: 'article:published_time', content: h.publishedTime } })
  for (const s of h.jsonLd ?? []) tags.push({ tag: 'script', text: JSON.stringify(s).replace(/</g, '\\u003c') })
  return tags
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Static HTML for the prerenderer. */
export function headToHtml(h: HeadData): string {
  return headTags(h)
    .map(t => {
      if (t.tag === 'title') return `<title data-h>${esc(t.text)}</title>`
      if (t.tag === 'script') return `<script type="application/ld+json" data-h>${t.text}</script>`
      const attrs = Object.entries(t.attrs)
        .map(([k, v]) => `${k}="${esc(v)}"`)
        .join(' ')
      return `<${t.tag} ${attrs} data-h>`
    })
    .join('\n    ')
}

/** Browser: replace every managed tag. Cheap: ~30 nodes per navigation. */
export function applyHead(h: HeadData) {
  const head = document.head
  head.querySelectorAll('[data-h]').forEach(n => n.remove())
  const frag = document.createDocumentFragment()
  for (const t of headTags(h)) {
    let el: HTMLElement
    if (t.tag === 'title') {
      el = document.createElement('title')
      el.textContent = t.text
    } else if (t.tag === 'script') {
      el = document.createElement('script')
      el.setAttribute('type', 'application/ld+json')
      el.textContent = t.text
    } else {
      el = document.createElement(t.tag)
      for (const [k, v] of Object.entries(t.attrs)) el.setAttribute(k, v)
    }
    el.setAttribute('data-h', '')
    frag.appendChild(el)
  }
  head.appendChild(frag)
  document.documentElement.lang = h.locale
}

/* Server: pages hand their head to a collector. Browser: applied on change. */
export const HeadCollector = createContext<{ head?: HeadData } | null>(null)

export function useHead(h: HeadData) {
  const collector = useContext(HeadCollector)
  if (collector) collector.head = h
  const key = JSON.stringify(h)
  useEffect(() => {
    applyHead(h)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
}
