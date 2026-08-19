import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProjects, useNotes, useCapabilities } from '@/content'
import Seo from '@/components/Seo'

type Entry = {
  title: string
  kind: string
  to: string
  blurb: string
  terms: string
}

const staticPages: Entry[] = [
  { title: 'Studio', kind: 'Page', to: '/studio', blurb: 'Who we are, how we think and the people behind the work.', terms: 'about studio team people founders history approach philosophy' },
  { title: 'Work', kind: 'Page', to: '/work', blurb: 'A running index of projects, listed plainly.', terms: 'work projects portfolio index clients' },
  { title: 'Capabilities', kind: 'Page', to: '/capabilities', blurb: 'The disciplines we practise and how they fit together.', terms: 'capabilities services disciplines offer expertise' },
  { title: 'Contact', kind: 'Page', to: '/contact', blurb: 'Write to us about a project or a conversation.', terms: 'contact email enquiry get in touch brief' },
  { title: 'Trainings', kind: 'Page', to: '/trainings', blurb: 'Workshops and training, coming soon.', terms: 'training workshops teaching learning courses education' },
]

function buildIndex(
  capabilities: ReturnType<typeof useCapabilities>,
  projects: ReturnType<typeof useProjects>,
  notes: ReturnType<typeof useNotes>
): Entry[] {
  return [
    ...staticPages,
    ...capabilities.map(c => ({
      title: c.name,
      kind: 'Capability',
      to: `/capabilities/${c.slug}`,
      blurb: c.summary,
      terms: `${c.name} ${c.summary} ${c.category} ${c.queries.join(' ')} capability discipline service`,
    })),
    ...projects.map(p => ({
      title: p.name,
      kind: 'Case Study',
      to: `/case-studies/${p.slug}`,
      blurb: p.brief,
      terms: `${p.name} ${p.brief} ${p.narrative ? Object.values(p.narrative).join(' ') : ''} ${p.discipline} ${p.services.join(' ')} ${p.location} ${p.year}`,
    })),
    ...notes.map(n => ({
      title: n.title,
      kind: 'Note',
      to: `/notes/${n.slug}`,
      blurb: n.subtitle,
      terms: `${n.title} ${n.subtitle} ${n.body} ${n.category}`,
    })),
  ]
}

export default function Search() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [query, setQuery] = useState(initial)
  const inputRef = useRef<HTMLInputElement>(null)
  const capabilities = useCapabilities()
  const projects = useProjects()
  const notes = useNotes()

  const index = useMemo(
    () => buildIndex(capabilities, projects, notes),
    [capabilities, projects, notes]
  )

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keep the URL in step with the query, without stacking history entries.
  useEffect(() => {
    const trimmed = query.trim()
    const next: Record<string, string> = trimmed ? { q: trimmed } : {}
    setParams(next, { replace: true })
  }, [query, setParams])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const words = q.split(/\s+/)
    return index
      .map(e => {
        const hay = `${e.title} ${e.terms}`.toLowerCase()
        const title = e.title.toLowerCase()
        let score = 0
        for (const w of words) {
          if (!hay.includes(w)) return { e, score: -1 }
          score += title.includes(w) ? 3 : 1
        }
        return { e, score }
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(r => r.e)
  }, [query, index])

  const trimmed = query.trim()

  return (
    <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA', minHeight: '100svh' }}>
      <Seo title="Search" description="Search Not by Accident — work, capabilities and journal." path="/search" noindex />
      {/* Header + field */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: 'clamp(32px, 4vw, 48px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-6" style={{ color: 'rgba(34,30,27,.45)' }}>Search</p>
          <div style={{ position: 'relative', maxWidth: '860px' }}>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search the site"
              placeholder="Look for work, notes, a capability…"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(34,30,27,.25)',
                outline: 'none',
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(28px, 5vw, 56px)',
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: '-0.015em',
                color: '#221E1B',
                padding: '0 0 0.5rem',
              }}
              onFocus={e => (e.currentTarget.style.borderBottomColor = '#6E2237')}
              onBlur={e => (e.currentTarget.style.borderBottomColor = 'rgba(34,30,27,.25)')}
            />
          </div>
          <p className="t-ui mt-6" style={{ color: 'rgba(34,30,27,.45)' }}>
            {trimmed
              ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${trimmed}”`
              : 'Type to search across case studies, notes and capabilities.'}
          </p>
        </div>
      </div>

      {/* Results */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(40px, 5vw, 64px)',
          paddingBottom: 'clamp(80px, 10vw, 160px)',
        }}
      >
        {trimmed && results.length === 0 ? (
          <div style={{ maxWidth: '48ch' }}>
            <p
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                lineHeight: 1.3,
                color: '#221E1B',
                margin: '0 0 1.25rem',
              }}
            >
              Nothing here matches that — yet.
            </p>
            <p className="t-body" style={{ color: 'rgba(34,30,27,.6)' }}>
              Try a broader word, or start from the{' '}
              <Link to="/work" className="link-beetroot">work</Link> or{' '}
              <Link to="/notes" className="link-beetroot">notes</Link>.
            </p>
          </div>
        ) : (
          <div style={{ maxWidth: '960px' }}>
            {results.map((r, i) => (
              <Link
                key={`${r.to}-${r.title}-${i}`}
                to={r.to}
                className="block no-underline group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1.5rem',
                  alignItems: 'baseline',
                  padding: '1.5rem 0',
                  borderTop: '1px solid rgba(34,30,27,.12)',
                  borderBottom: i === results.length - 1 ? '1px solid rgba(34,30,27,.12)' : 'none',
                }}
              >
                <div>
                  <h2
                    className="group-hover:underline"
                    style={{
                      fontFamily: 'Lora, Georgia, serif',
                      fontSize: 'clamp(20px, 2.2vw, 28px)',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      letterSpacing: '-0.01em',
                      color: '#221E1B',
                      textDecorationColor: '#6E2237',
                      textDecorationThickness: '1px',
                      margin: '0 0 0.5rem',
                    }}
                  >
                    {r.title}
                  </h2>
                  <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)', fontSize: '15px', maxWidth: '58ch' }}>
                    {r.blurb}
                  </p>
                </div>
                <p className="t-caption m-0 whitespace-nowrap" style={{ color: 'rgba(34,30,27,.4)' }}>
                  {r.kind}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
