import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Link, { Navigate } from '@/components/LocalizedLink'
import { useNotes, useCompany } from '@/content'
import type { NoteBlock } from '@/data'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'

const bodyText: React.CSSProperties = {
  fontFamily: 'DM Sans, system-ui, sans-serif',
  fontSize: '17px',
  lineHeight: 1.7,
  color: '#221E1B',
  maxWidth: '64ch',
  margin: '0 0 1.6em',
}

/* Renders the CMS's structured block content with the article's own
   typography — the block editor deliberately never stores raw font/colour
   choices, so this is the one place that decides what each block type
   looks like. */
function ArticleBody({ blocks }: { blocks: NoteBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={i} style={bodyText}>{block.text}</p>
          case 'h2':
            return (
              <h2 key={i} style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(24px, 2.6vw, 32px)', fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.01em', color: '#221E1B', margin: '1.4em 0 0.6em' }}>
                {block.text}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={i} style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(20px, 2vw, 25px)', fontWeight: 400, lineHeight: 1.2, color: '#221E1B', margin: '1.2em 0 0.5em' }}>
                {block.text}
              </h3>
            )
          case 'quote':
            return (
              <blockquote key={i} style={{ fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(20px, 2.2vw, 27px)', lineHeight: 1.35, color: '#6E2237', maxWidth: '52ch', margin: '1.4em 0', paddingLeft: '1.25rem', borderLeft: '2px solid #6E2237' }}>
                {block.text}
              </blockquote>
            )
          case 'callout':
            return (
              <p key={i} style={{ ...bodyText, backgroundColor: 'rgba(233,197,88,.18)', padding: '1rem 1.25rem', borderRadius: '2px' }}>
                {block.text}
              </p>
            )
          case 'list':
            return block.ordered ? (
              <ol key={i} style={{ ...bodyText, paddingLeft: '1.25em' }}>
                {block.items.map((item, j) => <li key={j} style={{ marginBottom: '0.4em' }}>{item}</li>)}
              </ol>
            ) : (
              <ul key={i} style={{ ...bodyText, paddingLeft: '1.25em' }}>
                {block.items.map((item, j) => <li key={j} style={{ marginBottom: '0.4em' }}>{item}</li>)}
              </ul>
            )
          case 'image':
            return (
              <figure key={i} className="work-tile bg-carbon" style={{ margin: '1.6em 0', overflow: 'hidden', aspectRatio: '3/2' }}>
                <img src={block.url} alt={block.caption ?? ''} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {block.caption && (
                  <figcaption className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginTop: '10px' }}>{block.caption}</figcaption>
                )}
              </figure>
            )
          case 'embed':
            return (
              <div key={i} style={{ margin: '1.6em 0', aspectRatio: '16/9', backgroundColor: '#221E1B' }}>
                <iframe src={block.url} title="Embedded video" loading="lazy" style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen />
              </div>
            )
          case 'divider':
            return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(34,30,27,.14)', margin: '2em 0' }} />
          default:
            return null
        }
      })}
    </>
  )
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const notes = useNotes()
  const company = useCompany()
  const note = notes.find(n => n.slug === slug)
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { threshold: 0.06 })

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
            {note.blocks && note.blocks.length > 0 ? (
              <ArticleBody blocks={note.blocks} />
            ) : (
              paragraphs.map((para, i) => (
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
              ))
            )}
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
