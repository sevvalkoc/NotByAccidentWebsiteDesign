import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useNotes } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'

export default function Blog() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { threshold: 0.08 })

  const notes = useNotes()
  const [lead, second, third, fourth] = notes
  const categories = Array.from(new Set(notes.map(n => n.category)))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'The Journal — Not by Accident',
    description: 'Essays and notes on brand strategy, positioning, design and commercial growth.',
    url: 'https://notbyaccident.com/notes',
    blogPost: notes.map(n => ({
      '@type': 'BlogPosting',
      headline: n.title,
      description: n.subtitle,
      url: `https://notbyaccident.com/notes/${n.slug}`,
      articleSection: n.category,
    })),
  }

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo
        title="The Journal"
        description="Essays and notes from Not by Accident on brand strategy, positioning, naming, design and commercial growth — an independent point of view, published irregularly."
        path="/notes"
        jsonLd={schema}
      />

      {/* Masthead — magazine nameplate */}
      <div style={{ paddingTop: 'clamp(40px, 5vw, 72px)', paddingBottom: 'clamp(28px, 3vw, 44px)' }}>
        <div className="page-grid">
          <div className="flex items-end justify-between reveal" style={{ borderBottom: '2px solid #221E1B', paddingBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div className="flex items-baseline gap-4">
              <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(40px, 6vw, 96px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.9, margin: 0 }}>
                The Journal
              </h1>
              <span className="t-caption hidden md:block" style={{ color: 'rgba(34,30,27,.5)' }}>Vol. 01</span>
            </div>
            <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)', maxWidth: '32ch', fontSize: '15px' }}>
              An independent point of view on brand, strategy and the businesses we find interesting. Published irregularly, never automated.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 reveal reveal-delay-1" style={{ marginTop: '1.25rem' }}>
            {categories.map(c => (
              <span key={c} className="pill">{c}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Feature — full-bleed-ish lead */}
      {lead && (
      <div className="page-grid" style={{ paddingTop: 'clamp(24px, 3vw, 40px)', paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <Link to={`/notes/${lead.slug}`} className="block no-underline group reveal" aria-label={lead.title}>
          <div className="work-tile bg-carbon img-crosshair" style={{ aspectRatio: '21/9' }}>
            {lead.img && <img src={lead.img} alt={lead.title} loading="eager" />}
            <div className="absolute left-0 right-0 bottom-0 p-5 md:p-10" style={{ background: 'linear-gradient(to top, rgba(34,30,27,.82), transparent)' }}>
              <p className="t-caption" style={{ color: '#E9C558', marginBottom: '10px' }}>
                Feature · {lead.category} · {lead.readTime} read
              </p>
              <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(26px, 4vw, 60px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em', color: '#F0EADA', margin: 0, maxWidth: '20ch' }}>
                {lead.title}
              </h2>
              <p className="t-body" style={{ color: 'rgba(240,234,218,.82)', marginTop: '12px', maxWidth: '52ch' }}>{lead.subtitle}</p>
            </div>
          </div>
        </Link>
      </div>
      )}

      {/* Two-up — different ratios, editorial rhythm */}
      <div className="page-grid" style={{ paddingBottom: 'clamp(48px, 6vw, 80px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-10 md:gap-16" style={{ borderTop: '1px solid rgba(34,30,27,.14)', paddingTop: 'clamp(32px, 4vw, 56px)' }}>
          {/* Left: image-led */}
          {second && (
            <article className="reveal">
              <Link to={`/notes/${second.slug}`} className="work-tile bg-carbon img-crosshair block no-underline" style={{ aspectRatio: '4/3' }}>
                {second.img && <img src={second.img} alt={second.title} loading="lazy" />}
              </Link>
              <p className="t-caption" style={{ color: '#6E2237', marginTop: '14px' }}>{second.category} · {second.date}</p>
              <h3 className="m-0" style={{ marginTop: '8px' }}>
                <Link to={`/notes/${second.slug}`} className="link-grow" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, lineHeight: 1.08, color: '#221E1B' }}>
                  {second.title}
                </Link>
              </h3>
              <p className="t-body" style={{ color: 'rgba(34,30,27,.65)', marginTop: '10px', maxWidth: '48ch' }}>{second.subtitle}</p>
            </article>
          )}

          {/* Right: text-led, no image — pure editorial */}
          {third && (
            <article className="reveal reveal-delay-1 flex flex-col justify-center" style={{ backgroundColor: '#221E1B', color: '#F0EADA', padding: 'clamp(28px, 3vw, 44px)' }}>
              <p className="t-caption" style={{ color: '#E9C558', marginBottom: '1rem' }}>{third.category} · {third.readTime} read</p>
              <h3 className="m-0">
                <Link to={`/notes/${third.slug}`} className="link-grow" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 400, lineHeight: 1.06, color: '#F0EADA', backgroundImage: 'linear-gradient(#E9C558,#E9C558)' }}>
                  {third.title}
                </Link>
              </h3>
              <p className="t-body" style={{ color: 'rgba(240,234,218,.75)', marginTop: '14px', maxWidth: '40ch' }}>{third.subtitle}</p>
              <p className="t-caption" style={{ color: 'rgba(240,234,218,.5)', marginTop: '2rem' }}>Read the essay →</p>
            </article>
          )}
        </div>
      </div>

      {/* Text-led index — the rest */}
      {fourth && (
        <div className="page-grid" style={{ paddingBottom: 'clamp(64px, 8vw, 128px)' }}>
          <p className="t-caption mb-2 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>More from the Journal</p>
          {[fourth].concat(notes.slice(4)).map((note, i) => (
            <Link
              key={note.id}
              to={`/notes/${note.slug}`}
              className="no-underline group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-8 reveal"
              style={{ padding: 'clamp(14px, 1.4vw, 20px) 0', borderTop: '1px solid rgba(34,30,27,.14)', transitionDelay: `${i * 60}ms` }}
            >
              <span className="t-caption" style={{ color: 'rgba(34,30,27,.4)' }}>{note.category}</span>
              <span className="group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(20px, 2.2vw, 30px)', fontWeight: 400, lineHeight: 1.1, color: '#221E1B', textDecorationColor: '#6E2237', textDecorationThickness: '1px' }}>
                {note.title}
              </span>
              <span className="t-caption hidden md:block self-center" style={{ color: 'rgba(34,30,27,.4)' }}>{note.readTime}</span>
            </Link>
          ))}
          <div style={{ borderTop: '1px solid rgba(34,30,27,.14)' }} />
        </div>
      )}
    </main>
  )
}
