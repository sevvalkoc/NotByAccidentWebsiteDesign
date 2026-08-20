import { useRef } from 'react'
import Link from '@/components/LocalizedLink'
import { categories } from '@/data'
import { useCapabilities, useCapabilitiesCopy } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/i18n/ui'
import { usePageSeo, capabilitiesDescription } from '@/i18n/pageSeo'
import { useLocale } from '@/i18n/locale'

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null)
  const capabilities = useCapabilities()
  const copy = useCapabilitiesCopy()
  const t = useT()
  const seo = usePageSeo('/capabilities')
  const locale = useLocale()
  useReveal(ref, { threshold: 0.06 })

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: t.capabilitiesIndex.breadcrumbHome, item: 'https://notbyaccident.com/' },
      { '@type': 'ListItem', position: 2, name: t.capabilitiesIndex.breadcrumbCapabilities, item: 'https://notbyaccident.com/capabilities' },
    ],
  }

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo
        title={seo.title}
        description={capabilitiesDescription(locale, capabilities.length)}
        path="/capabilities"
        jsonLd={schema}
      />

      {/* Header — dark ground */}
      <div style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(64px, 8vw, 128px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
        <div className="page-grid">
          <p className="t-caption mb-6 reveal" style={{ color: 'rgba(240,234,218,.4)' }}>{copy.eyebrow}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="md:grid-cols-[56%_40%]">
            <h1 className="t-headline-lg reveal reveal-delay-1" style={{ color: '#F0EADA', margin: 0, maxWidth: '18ch' }}>
              {capabilities.length} {copy.headingSuffix}
            </h1>
            <p className="t-body reveal reveal-delay-2" style={{ color: 'rgba(240,234,218,.6)', maxWidth: '44ch', alignSelf: 'end' }}>
              {copy.subhead}
            </p>
          </div>

          {/* Category jump-nav — colour-coded */}
          <div className="flex flex-wrap gap-2 reveal reveal-delay-3" style={{ marginTop: '2.5rem' }}>
            {categories.map(cat => (
              <a
                key={cat.key}
                href={`#${cat.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="pill"
                style={{ borderColor: 'rgba(240,234,218,.25)', color: 'rgba(240,234,218,.85)' }}
              >
                <span aria-hidden="true" style={{ width: '7px', height: '7px', borderRadius: '100px', backgroundColor: cat.accent, display: 'inline-block', marginRight: '7px' }} />
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Category blocks */}
      <div className="page-grid" style={{ paddingTop: 'clamp(56px, 7vw, 112px)', paddingBottom: 'clamp(64px, 8vw, 128px)' }}>
        {categories.map((cat, pi) => {
          const items = capabilities.filter(c => c.category === cat.key)
          const anchor = cat.key.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          return (
            <section
              key={cat.key}
              id={anchor}
              style={{ scrollMarginTop: '80px', marginBottom: pi < categories.length - 1 ? 'clamp(48px, 6vw, 88px)' : 0 }}
            >
              <div className="flex items-baseline gap-4 mb-6 reveal" style={{ flexWrap: 'wrap' }}>
                <span aria-hidden="true" style={{ width: '10px', height: '10px', borderRadius: '100px', backgroundColor: cat.accent, flex: 'none' }} />
                <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(26px, 3vw, 40px)', color: '#221E1B', lineHeight: 1 }}>
                  {cat.label}
                </span>
                <span className="t-body hidden md:block" style={{ color: 'rgba(34,30,27,.5)', fontSize: '15px' }}>
                  — {cat.blurb}
                </span>
              </div>

              <div className="reveal">
                {items.map(cap => (
                  <Link
                    key={cap.slug}
                    to={`/capabilities/${cap.slug}`}
                    className="cap-row"
                    style={{ gridTemplateColumns: '1fr auto', padding: 'clamp(18px, 2vw, 26px) 16px', margin: '0 -16px' }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,240px)_1fr] gap-x-8 gap-y-1 items-baseline">
                      <p className="m-0" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(19px, 1.8vw, 24px)', lineHeight: 1.1 }}>
                        {cap.name}
                      </p>
                      <p className="cap-muted m-0" style={{ fontSize: '15px', color: 'rgba(34,30,27,.6)', maxWidth: '58ch' }}>
                        {cap.summary}
                      </p>
                    </div>
                    <span className="cap-arrow t-ui self-center" style={{ paddingLeft: '1rem' }}>→</span>
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid rgba(34,30,27,.14)' }} />
              </div>
            </section>
          )
        })}
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: '#221E1B' }}>
        <div className="page-grid" style={{ paddingTop: 'clamp(56px, 7vw, 96px)', paddingBottom: 'clamp(56px, 7vw, 96px)', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <p className="reveal" style={{ fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em', color: '#F0EADA', margin: 0, maxWidth: '28ch' }}>
            “{t.capabilitiesIndex.notSureText}”
          </p>
          <div>
            <Link to="/contact" className="btn-milk reveal reveal-delay-1" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              {t.capabilitiesIndex.startConversation}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
