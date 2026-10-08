import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageHead from '@/components/PageHead'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { useCopy, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { PAGES } from '@/routes'
import './misc.css'

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')

export default function Search() {
  const copy = useCopy()
  const site = useSite()
  const c = copy.search
  const { search, pathname } = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  useEffect(() => setQ(new URLSearchParams(search).get('q') ?? ''), [search])
  usePage({ path: '/search', title: c.seoTitle, description: c.seoDescription, noindex: true })

  const index = useMemo(
    () => [
      ...PAGES.filter(p => p.key !== 'search').map(p => ({ kind: c.kinds.page, title: copy.pages[p.key], blurb: '', to: p.path, text: '' })),
      ...site.capabilities.map(x => ({ kind: c.kinds.capability, title: x.name, blurb: x.summary, to: `/capabilities/${x.slug}`, text: `${x.lede} ${x.includes.join(' ')} ${x.queries.join(' ')}` })),
      ...site.projects.map(p => ({ kind: c.kinds.case, title: p.name, blurb: p.brief, to: `/case-studies/${p.slug}`, text: `${p.discipline} ${p.services.join(' ')} ${p.location} ${p.narrative ? Object.values(p.narrative).join(' ') : ''}` })),
      ...site.notes.map(n => ({ kind: c.kinds.note, title: n.title, blurb: n.subtitle, to: `/notes/${n.slug}`, text: `${n.category} ${n.body}` })),
    ],
    [site, copy, c],
  )
  const terms = norm(q).split(/\s+/).filter(Boolean)
  const results = terms.length
    ? index
        .map(r => {
          const t = norm(r.title)
          const b = norm(`${r.blurb} ${r.text}`)
          let score = 0
          for (const term of terms) {
            if (t.includes(term)) score += 5
            else if (b.includes(term)) score += 1
            else return null
          }
          return { r, score }
        })
        .filter((x): x is { r: (typeof index)[number]; score: number } => x !== null)
        .sort((a, b) => b.score - a.score)
        .map(x => x.r)
    : []

  return (
    <main id="main" tabIndex={-1}>
      <PageHead title={c.h1} />
      <Zone env="frost" className="wrap band search">
        <form
          role="search"
          onSubmit={e => {
            e.preventDefault()
            navigate(`${pathname}?q=${encodeURIComponent(q)}`, { replace: true })
          }}
        >
          <label htmlFor="q" className="sr-only">
            {c.label}
          </label>
          <input
            id="q"
            name="q"
            type="search"
            value={q}
            autoComplete="off"
            placeholder={c.placeholder}
            className="search__input"
            onChange={e => {
              setQ(e.target.value)
              navigate(`${pathname}?q=${encodeURIComponent(e.target.value)}`, { replace: true })
            }}
          />
        </form>
        <p className="t-caption dimmer search__count" aria-live="polite">
          {terms.length ? c.results(results.length, q) : c.idle}
        </p>
        {terms.length && !results.length ? (
          <p className="t-lead">
            {c.empty}{' '}
            <Link to="/work" className="link">
              {copy.pages.work}
            </Link>{' '}
            ·{' '}
            <Link to="/notes" className="link">
              {copy.pages.notes}
            </Link>
            .
          </p>
        ) : null}
        <ol role="list" className="journal__list">
          {results.map(r => (
            <li key={r.to}>
              <Link to={r.to} className="journal__row">
                <span className="t-caption dimmer">{r.kind}</span>
                <span className="t-title journal__title">{r.title}</span>
                <span className="t-caption dimmer journal__kind">{r.blurb}</span>
              </Link>
            </li>
          ))}
        </ol>
      </Zone>
    </main>
  )
}
