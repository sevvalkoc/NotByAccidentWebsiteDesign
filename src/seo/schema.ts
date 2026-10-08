/* Structured data. Only types the page can honestly support: no
   ProfessionalService/LocalBusiness until a real address exists, no
   ratings, no review markup for testimonials. */
import { localizePath, type Locale } from '@/i18n/locale'
import type { Capability, Company, Note, Project, Social } from '@/content/types'
import { SITE_URL, absolute } from './head'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`
const url = (path: string, locale: Locale) => SITE_URL + localizePath(path, locale)

export function organization(company: Company, socials: Social[]) {
  const org: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: company.name,
    legalName: company.legalName,
    url: SITE_URL,
    logo: absolute('/icon-512.png'),
    image: absolute('/og-default.jpg'),
    email: company.email,
    slogan: company.tagline,
    description: company.proposition,
    foundingDate: '2019',
    foundingLocation: { '@type': 'Place', name: 'Amsterdam' },
    sameAs: socials.map(s => s.url),
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'new business', email: company.newBusinessEmail },
      { '@type': 'ContactPoint', contactType: 'press', email: company.pressEmail },
      { '@type': 'ContactPoint', contactType: 'customer support', email: company.email },
    ],
  }
  if (company.phone) org.telephone = company.phone
  if (company.address.line1 && company.address.city) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: [company.address.line1, company.address.line2].filter(Boolean).join(', '),
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: company.address.country,
    }
  }
  return org
}

export function website(locale: Locale, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: SITE_URL,
    name: 'Not by Accident',
    description,
    inLanguage: locale,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={query}` },
      'query-input': 'required name=query',
    },
  }
}

export function breadcrumbs(items: { name: string; path: string }[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: url(it.path, locale) })),
  }
}

export function collection(name: string, description: string, path: string, locale: Locale, items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: url(path, locale),
    inLanguage: locale,
    isPartOf: { '@id': SITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, url: url(it.path, locale) })),
    },
  }
}

export function caseStudy(p: Project, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: p.name,
    headline: `${p.name}: ${p.brief}`,
    description: p.narrative ? `${p.brief} ${p.narrative.outcome}` : p.brief,
    url: url(`/case-studies/${p.slug}`, locale),
    image: p.heroImg ? absolute(p.heroImg) : undefined,
    dateCreated: p.year || undefined,
    locationCreated: p.location && p.location !== 'Undisclosed' ? { '@type': 'Place', name: p.location } : undefined,
    keywords: p.services.join(', '),
    inLanguage: locale,
    creator: { '@id': ORG_ID },
    about: p.services.map(s => ({ '@type': 'Thing', name: s })),
  }
}

export function service(c: Capability, categoryLabel: string, locale: Locale, includedName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: c.name,
    serviceType: c.name,
    category: categoryLabel,
    description: c.summary,
    url: url(`/capabilities/${c.slug}`, locale),
    provider: { '@id': ORG_ID },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: includedName,
      itemListElement: c.includes.map(i => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: i } })),
    },
  }
}

/** Questions that are visibly printed on the capability page. */
export function faq(qas: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: qas.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }
}

/** "3 July 2026" → "2026-07-03". Seed dates are written in English. */
export function isoDate(d: string): string | undefined {
  const t = Date.parse(`${d} 12:00 UTC`)
  return Number.isNaN(t) ? undefined : new Date(t).toISOString().slice(0, 10)
}

export function article(n: Note, locale: Locale, isoPublished?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: n.title,
    description: n.subtitle,
    image: n.img ? [absolute(n.img)] : undefined,
    datePublished: isoPublished,
    dateModified: isoPublished,
    articleSection: n.category,
    inLanguage: locale,
    url: url(`/notes/${n.slug}`, locale),
    mainEntityOfPage: url(`/notes/${n.slug}`, locale),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@type': 'Blog', name: 'The Journal', url: url('/notes', locale) },
  }
}
