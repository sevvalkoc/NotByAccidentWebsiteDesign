import { useMemo, useState } from 'react'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { useCopy, usePageMeta, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { collection } from '@/seo/schema'
import './misc.css'

/** The Journal. Every note is in the HTML; filtering only hides. */
export default function Notes() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const meta = usePageMeta('notes')
  const c = copy.notes
  const [kind, setKind] = useState<string | null>(null)
  const kinds = useMemo(() => [...new Set(site.notes.map(n => n.category))], [site.notes])
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.notes, path: '/notes' },
  ]
  usePage({
    page: 'notes',
    path: '/notes',
    jsonLd: [collection(c.schemaName, meta.description, '/notes', locale, site.notes.map(n => ({ name: n.title, path: `/notes/${n.slug}` }))), crumbSchema(crumbs, locale)],
  })
  const [feature, ...rest] = site.notes

  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="notes" />
      <Zone env="frost" className="wrap journal" label={copy.pages.notes}>
        <div role="group" aria-label={c.filter} className="journal__filter t-small">
          <button type="button" aria-pressed={kind === null} onClick={() => setKind(null)}>
            {c.all}
          </button>
          {kinds.map(k => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
              {k}
            </button>
          ))}
        </div>
        {feature ? (
          <article className="journal__feature" hidden={!!kind && feature.category !== kind}>
            <Link to={`/notes/${feature.slug}`} className="journal__feature-link">
              {feature.img ? <Slip media={{ url: feature.img, alt: '', kind: 'image' }} ratio={3 / 2} sizes="(min-width: 1024px) 50vw, 92vw" priority /> : null}
              <div className="journal__feature-text">
                <p className="t-caption dimmer">
                  {feature.category} · {feature.date}
                </p>
                <h2 className="t-section">{feature.title}</h2>
                <p className="dim">{feature.subtitle}</p>
              </div>
            </Link>
          </article>
        ) : null}
        <ol role="list" className="journal__list">
          {rest.map(n => (
            <li key={n.slug} hidden={!!kind && n.category !== kind}>
              <Link to={`/notes/${n.slug}`} className="journal__row">
                <span className="t-caption dimmer">{n.date}</span>
                <span className="t-title journal__title">{n.title}</span>
                <span className="t-caption dimmer journal__kind">
                  {n.category}
                  {n.readTime ? ` · ${n.readTime} ${c.read}` : ''}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Zone>
    </main>
  )
}
