import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { capabilities, pillars } from '@/data'
import Seo from '@/components/Seo'

export default function Capabilities() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.06 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://notbyaccident.com/' },
      { '@type': 'ListItem', position: 2, name: 'Capabilities', item: 'https://notbyaccident.com/capabilities' },
    ],
  }

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo
        title="Capabilities"
        description="Brand strategy, positioning, naming, visual identity, website design, UX/UI, digital products, SEO, performance and more — eighteen capabilities across Position, Identity, Product and Demand."
        path="/capabilities"
        jsonLd={schema}
      />

      {/* Header — dark ground */}
      <div style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(64px, 8vw, 128px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
        <div className="page-grid">
          <p className="t-caption mb-6 reveal" style={{ color: 'rgba(240,234,218,.4)' }}>Capabilities</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="md:grid-cols-[56%_40%]">
            <h1 className="t-headline-lg reveal reveal-delay-1" style={{ color: '#F0EADA', margin: 0, maxWidth: '18ch' }}>
              Eighteen capabilities, in the order a company actually needs them.
            </h1>
            <p className="t-body reveal reveal-delay-2" style={{ color: 'rgba(240,234,218,.6)', maxWidth: '44ch', alignSelf: 'end' }}>
              We move a company through four movements — Position, Identity, Product and Demand.
              Take one, or the whole sequence. Each has its own team, method and page.
            </p>
          </div>

          {/* Pillar jump-nav */}
          <div className="flex flex-wrap gap-2 reveal reveal-delay-3" style={{ marginTop: '2.5rem' }}>
            {pillars.map(p => (
              <a
                key={p.key}
                href={`#${p.key.toLowerCase()}`}
                className="pill"
                style={{ borderColor: 'rgba(240,234,218,.25)', color: 'rgba(240,234,218,.85)' }}
              >
                {p.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Pillar blocks */}
      <div className="page-grid" style={{ paddingTop: 'clamp(56px, 7vw, 112px)', paddingBottom: 'clamp(64px, 8vw, 128px)' }}>
        {pillars.map((pillar, pi) => {
          const items = capabilities.filter(c => c.pillar === pillar.key)
          return (
            <section
              key={pillar.key}
              id={pillar.key.toLowerCase()}
              style={{ scrollMarginTop: '80px', marginBottom: pi < pillars.length - 1 ? 'clamp(48px, 6vw, 88px)' : 0 }}
            >
              <div className="flex items-baseline gap-4 mb-6 reveal">
                <span className="t-caption" style={{ color: '#6E2237' }}>Movement 0{pi + 1}</span>
                <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(26px, 3vw, 40px)', color: '#221E1B', lineHeight: 1 }}>
                  {pillar.label}
                </span>
                <span className="t-body hidden md:block" style={{ color: 'rgba(34,30,27,.5)', fontSize: '15px' }}>
                  — {pillar.blurb}
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
            “Not sure which you need? That is the first thing we work out together.”
          </p>
          <div>
            <Link to="/contact" className="btn-milk reveal reveal-delay-1" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Start a conversation
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
