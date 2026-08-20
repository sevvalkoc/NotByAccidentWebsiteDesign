/* ── Static per-route <title>/<meta description> copy ─────────────────────
   Only for pages whose Seo title/description are hardcoded literals in
   JSX rather than pulled from the content store (dynamic pages — capability
   detail, case study, blog post — already get correct per-locale text once
   their underlying data is translated, via src/content.nl.ts / .fr.ts). */
import { useLocale, type Locale } from '@/i18n/locale'
import { pageSeo as nlPageSeo } from '@/i18n/pageSeo.nl'
import { pageSeo as frPageSeo } from '@/i18n/pageSeo.fr'

export interface RouteSeo {
  title: string
  description?: string
}

/** Keyed by the canonical (unprefixed, English-shaped) route path. */
export type PageSeoMap = Record<string, RouteSeo>

export const en: PageSeoMap = {
  '/': { title: 'Independent creative company, Amsterdam' },
  '/work': { title: 'Work', description: 'Selected work from Not by Accident — brand strategy, identity, digital products and demand for founders and creative teams.' },
  '/case-studies': { title: 'Case Studies', description: 'In-depth case studies from Not by Accident — how brand strategy, identity and demand work translated into measurable commercial results.' },
  '/capabilities': { title: 'Capabilities' }, // description is generated in Capabilities.tsx from the live count — see pageSeoCapabilitiesDescription below
  '/studio': { title: 'Studio', description: 'Not by Accident is an independent creative company in Amsterdam. Small on purpose, senior in the room, commercial by instinct — brand and demand thinking in one team.' },
  '/notes': { title: 'The Journal', description: 'Essays and notes from Not by Accident on brand strategy, positioning, naming, design and commercial growth — an independent point of view, published irregularly.' },
  '/trainings': { title: 'Events & Workshops', description: 'Brand and strategy workshops, events and practical training from Not by Accident — experiences worth gathering people for.' },
  '/reports': { title: 'Reports', description: 'Field notes, benchmarks and original research from Not by Accident — coming soon.' },
  '/contact': { title: 'Contact', description: 'Start a project with Not by Accident. Tell us the company you want to become — first reply within one working day, from a person, not a form.' },
  '/search': { title: 'Search', description: 'Search Not by Accident — work, capabilities and journal.' },
  '/privacy': { title: 'Privacy', description: 'How Not by Accident collects, uses and protects your personal data.' },
  '/cookies': { title: 'Cookies', description: 'How Not by Accident uses cookies and similar technologies on this website.' },
  '/404': { title: 'Page not found', description: "The page you were looking for doesn't exist." },
}

/** The Capabilities index description is built from a live count
 *  ("N capabilities across ...") — this returns the locale-correct template. */
const CAPABILITIES_DESCRIPTION: Record<Locale, (n: number) => string> = {
  en: n =>
    `${n} capabilities across Brand & Identity, Digital & Product, Growth & Demand, Market & Expansion and Experiences — brand strategy, identity, website design, SEO, performance marketing, market research and more.`,
  nl: n =>
    `${n} capabilities verdeeld over Brand & Identity, Digital & Product, Growth & Demand, Market & Expansion en Experiences — merkstrategie, identiteit, websiteontwerp, SEO, performance marketing, marktonderzoek en meer.`,
  fr: n =>
    `${n} expertises réparties en Brand & Identity, Digital & Product, Growth & Demand, Market & Expansion et Experiences — stratégie de marque, identité, conception de sites web, SEO, marketing à la performance, études de marché et plus encore.`,
}

export function capabilitiesDescription(locale: Locale, count: number): string {
  return CAPABILITIES_DESCRIPTION[locale](count)
}

export function usePageSeo(path: string): RouteSeo {
  const locale = useLocale()
  const map = locale === 'nl' ? nlPageSeo : locale === 'fr' ? frPageSeo : en
  return map[path] ?? en[path] ?? { title: 'Not by Accident' }
}
