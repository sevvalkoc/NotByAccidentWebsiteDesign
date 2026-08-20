import { useEffect } from 'react'
import { useCompany, useSeo } from '@/content'
import { LOCALES, localizePath, useLocale } from '@/i18n/locale'

/**
 * SEO + structured data. React 19 hoists <title>, <meta> and <script> to
 * <head>, so rendering them anywhere in the tree is enough. We pass
 * JSON-LD for entity-based and AI search (Organization, WebPage, plus any
 * page-specific schema).
 *
 * `path` is always the canonical, unprefixed (English-shaped) route, e.g.
 * "/work" — never "/nl/work". This component adds the current locale's
 * prefix itself, and emits hreflang alternates for every language so
 * search engines know the /nl and /fr versions are translations of the
 * same page rather than duplicate content.
 */
export default function Seo({
  title,
  description,
  path = '/',
  jsonLd,
  noindex = false,
  image,
}: {
  title: string
  description?: string
  path?: string
  jsonLd?: object | object[]
  noindex?: boolean
  image?: string
}) {
  const company = useCompany()
  const seo = useSeo()
  const locale = useLocale()
  const base = 'https://notbyaccident.com'
  const url = base + localizePath(path, locale)
  const fullTitle =
    title === company.name ? title : `${title} — ${company.name}`
  // Fall back to the admin-editable site defaults when a page omits its own.
  const metaDescription = description ?? seo.description
  const ogImage = image ?? seo.ogImage

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  // Phone and postal address are optional until the real studio details are
  // supplied — we never emit placeholder text as if it were structured data.
  const organization: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    alternateName: company.name,
    url: base,
    email: company.email,
    slogan: company.tagline,
    description: company.proposition,
  }
  if (company.phone) organization.telephone = company.phone
  if (company.address.line1 && company.address.city && company.address.country) {
    organization.address = {
      '@type': 'PostalAddress',
      streetAddress: company.address.line1,
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: company.address.country,
    }
  }

  const schemas = [organization, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])]

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      {LOCALES.map(l => (
        <link key={l} rel="alternate" hrefLang={l} href={base + localizePath(path, l)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={base + path} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={locale === 'en' ? 'en_US' : locale === 'nl' ? 'nl_NL' : 'fr_FR'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={company.name} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </>
  )
}
