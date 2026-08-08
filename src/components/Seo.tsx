import { useCompany, useSeo } from '@/content'

/**
 * SEO + structured data. React 19 hoists <title>, <meta> and <script> to
 * <head>, so rendering them anywhere in the tree is enough. We pass
 * JSON-LD for entity-based and AI search (Organization, WebPage, plus any
 * page-specific schema).
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
  const base = 'https://notbyaccident.com'
  const url = base + path
  const fullTitle =
    title === company.name ? title : `${title} — ${company.name}`
  // Fall back to the admin-editable site defaults when a page omits its own.
  const metaDescription = description ?? seo.description
  const ogImage = image ?? seo.ogImage

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    alternateName: company.name,
    url: base,
    email: company.email,
    telephone: company.phone,
    slogan: company.tagline,
    description: company.proposition,
    address: {
      '@type': 'PostalAddress',
      streetAddress: company.address.line1,
      addressLocality: company.address.city,
      postalCode: company.address.postcode,
      addressCountry: 'NL',
    },
  }

  const schemas = [organization, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])]

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
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
