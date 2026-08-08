import { useEffect, useRef } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { useNotes, useCompany } from '@/content'
import Seo from '@/components/Seo'

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const notes = useNotes()
  const company = useCompany()
  const note = notes.find(n => n.slug === slug)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target) }
      }),
      { threshold: 0.06 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (!note) return <Navigate to="/notes" replace />

  const idx = notes.findIndex(n => n.slug === slug)
  const next = notes[(idx + 1) % notes.length]

  const paragraphs = note.body.split('\n\n').filter(Boolean)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: note.title,
    description: note.subtitle,
    articleSection: note.category,
    datePublished: note.date,
    image: note.img,
    url: `https://notbyaccident.com/notes/${note.slug}`,
    author: { '@type': 'Organization', name: company.legalName },
    publisher: { '@type': 'Organization', name: company.legalName },
  }

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={note.title} description={note.subtitle} path={`/notes/${note.slug}`} image={note.img} jsonLd={articleSchema} />

      {/* Article header */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <nav className="mb-6 reveal" aria-label="Breadcrumb">
          <Link
            to="/notes"
            className="t-caption no-underline hover:opacity-70 transition-opacity"
            style={{ color: 'rgba(34,30,27,.45)' }}
          >
            ← Notes
          </Link>
        </nav>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(32px, 4vw, 56px)',
          }}
          className="md:grid-cols-[60%_35%]"
        >
          <div>
            <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>
              {note.category}
            </p>
            <h1
              className="reveal reveal-delay-1"
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(26px, 3.5vw, 48px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
                color: '#221E1B',
                margin: 0,
                maxWidth: '20ch',
              }}
            >
              {note.title}
            </h1>
          </div>
          <div
            className="reveal reveal-delay-2"
            style={{ alignSelf: 'end' }}
          >
            <p
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(16px, 1.5vw, 19px)',
                lineHeight: 1.5,
                color: 'rgba(34,30,27,.6)',
                margin: '0 0 16px',
              }}
            >
              {note.subtitle}
            </p>
            <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.4)' }}>
              {note.date} · {note.readTime} read
            </p>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {note.img && (
        <div
          className="reveal overflow-hidden bg-carbon img-crosshair"
          style={{ width: '100%', aspectRatio: '16/7' }}
        >
          <img
            src={note.img}
            alt={note.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Article body */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(56px, 7vw, 96px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
          }}
          className="md:grid-cols-[60%_1fr]"
        >
          <article className="reveal">
            {paragraphs.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'DM Sans, system-ui, sans-serif',
                  fontSize: '17px',
                  lineHeight: 1.7,
                  color: '#221E1B',
                  maxWidth: '64ch',
                  margin: i < paragraphs.length - 1 ? '0 0 1.6em' : 0,
                }}
              >
                {para}
              </p>
            ))}
          </article>
        </div>
      </div>

      {/* Next note */}
      <div
        style={{
          borderTop: '1px solid rgba(34,30,27,.1)',
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-6 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>
            Next
          </p>
          <Link
            to={`/notes/${next.slug}`}
            className="block no-underline group reveal"
            aria-label={`Next: ${next.title}`}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem',
              }}
              className="sm:grid-cols-[auto_1fr]"
            >
              {next.img && (
                <div
                  className="overflow-hidden bg-carbon img-crosshair hidden sm:block"
                  style={{ width: '200px', aspectRatio: '3/2' }}
                >
                  <img
                    src={next.img}
                    alt={next.title}
                    className="w-full h-full object-cover img-hover"
                    loading="lazy"
                  />
                </div>
              )}
              <div style={{ alignSelf: 'center' }}>
                <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.45)' }}>
                  {next.category} · {next.date}
                </p>
                <h2
                  className="group-hover:underline"
                  style={{
                    fontFamily: 'Lora, Georgia, serif',
                    fontSize: 'clamp(18px, 2vw, 26px)',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                    color: '#221E1B',
                    textDecorationColor: '#6E2237',
                    textDecorationThickness: '1px',
                    margin: 0,
                  }}
                >
                  {next.title}
                </h2>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
