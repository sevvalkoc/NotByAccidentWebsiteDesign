import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { HeadCollector, headToHtml, type HeadData } from '@/seo/head'
import { getSite, loadLocale } from '@/content'
import { LOCALES, localizePath } from '@/i18n/locale'

/** Await before rendering: loads every language. */
export const ready = Promise.all([loadLocale('nl'), loadLocale('fr')])

export function render(url: string): { html: string; head: string; data?: HeadData } {
  const collector: { head?: HeadData } = {}
  const html = renderToString(
    <StrictMode>
      <HeadCollector.Provider value={collector}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HeadCollector.Provider>
    </StrictMode>,
  )
  return { html, head: collector.head ? headToHtml(collector.head) : '', data: collector.head }
}

/** Every indexable URL, in every language. */
export function paths(): { path: string; priority: string; changefreq: string; alternates: string[] }[] {
  const site = getSite('en')
  const base: [string, string, string][] = [
    ['/', '1.0', 'weekly'],
    ['/work', '0.8', 'weekly'],
    ['/case-studies', '0.8', 'weekly'],
    ['/capabilities', '0.9', 'monthly'],
    ['/studio', '0.6', 'monthly'],
    ['/notes', '0.8', 'weekly'],
    ['/trainings', '0.5', 'monthly'],
    ['/reports', '0.4', 'monthly'],
    ['/contact', '0.7', 'monthly'],
    ['/privacy', '0.2', 'yearly'],
    ['/cookies', '0.2', 'yearly'],
  ]
  const all: [string, string, string][] = [
    ...base,
    ...site.capabilities.map(c => [`/capabilities/${c.slug}`, '0.7', 'monthly'] as [string, string, string]),
    ...site.projects.map(p => [`/case-studies/${p.slug}`, '0.7', 'monthly'] as [string, string, string]),
    ...site.notes.map(n => [`/notes/${n.slug}`, '0.6', 'yearly'] as [string, string, string]),
  ]
  return all.flatMap(([p, priority, changefreq]) =>
    LOCALES.map(l => ({ path: localizePath(p, l), priority, changefreq, alternates: LOCALES.map(x => localizePath(p, x)) })),
  )
}

/** Not indexable, but prerendered so they load instantly. */
export const extraPaths = ['/search', '/nl/search', '/fr/search']
