import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'
import { useCookiesCopy } from '@/content'

export default function Cookies() {
  const ref = useRef<HTMLElement>(null)
  const copy = useCookiesCopy()
  const rows = copy.rows.map(r => ({ name: r.title, purpose: r.body, life: r.meta ?? '' }))
  useReveal(ref, { threshold: 0.08 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title="Cookies" description="How Not by Accident uses cookies and similar technologies on this website." path="/cookies" />
      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>{copy.eyebrow}</p>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
            className="md:grid-cols-[52%_1fr]"
          >
            <h1 className="t-display reveal reveal-delay-1" style={{ margin: 0, maxWidth: '13ch' }}>
              {copy.heading}
            </h1>
            <p
              className="t-body reveal reveal-delay-2"
              style={{ color: 'rgba(34,30,27,.65)', maxWidth: '42ch', alignSelf: 'end' }}
            >
              {copy.subhead}
            </p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '960px' }}>
          {/* Header row */}
          <div
            className="reveal"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '0.5rem',
              paddingBottom: '1rem',
            }}
          >
            <div className="hidden md:grid" style={{ gridTemplateColumns: '160px 1fr 160px', gap: '2rem', paddingBottom: '1rem' }}>
              <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.4)' }}>Category</p>
              <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.4)' }}>What it does</p>
              <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.4)' }}>Lifespan</p>
            </div>
          </div>

          {rows.map((r, i) => (
            <div
              key={r.name}
              className="reveal"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.75rem',
                padding: '1.75rem 0',
                borderTop: '1px solid rgba(34,30,27,.12)',
                transitionDelay: `${i * 60}ms`,
              }}
            >
              <div className="md:grid" style={{ gridTemplateColumns: '160px 1fr 160px', gap: '2rem', alignItems: 'baseline' }}>
                <h2
                  style={{
                    fontFamily: 'Lora, Georgia, serif',
                    fontSize: 'clamp(20px, 2vw, 26px)',
                    fontWeight: 400,
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    color: '#221E1B',
                    margin: '0 0 0.75rem',
                  }}
                >
                  {r.name}
                </h2>
                <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.7)', marginBottom: '0.75rem' }}>
                  {r.purpose}
                </p>
                <p className="t-ui m-0" style={{ color: 'rgba(34,30,27,.5)' }}>
                  {r.life}
                </p>
              </div>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(34,30,27,.12)' }} />
        </div>
      </div>

      {/* Managing */}
      <div
        className="page-grid"
        style={{ paddingBottom: 'clamp(80px, 10vw, 160px)' }}
      >
        <div className="reveal" style={{ maxWidth: '56ch' }}>
          <div style={{ height: '2px', width: '40px', backgroundColor: '#7F8B3E', marginBottom: '1.5rem' }} aria-hidden="true" />
          <h2 className="t-headline" style={{ marginBottom: '1.25rem' }}>{copy.managingHeading}</h2>
          <p className="t-body" style={{ color: 'rgba(34,30,27,.72)', marginBottom: '1.25rem' }}>
            {copy.managingBody}
          </p>
          <p className="t-body" style={{ color: 'rgba(34,30,27,.72)' }}>
            For the fuller picture of what we hold and why, see our{' '}
            <Link to="/privacy" className="link-beetroot">privacy notice</Link>. Anything unclear — write to{' '}
            <a href="mailto:hello@notbyaccident.com" className="link-beetroot">hello@notbyaccident.com</a>.
          </p>
        </div>
      </div>
    </main>
  )
}
