import { useEffect, useState } from 'react'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { plain } from '@/components/Rich'
import { useCopy, usePageMeta, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { collection } from '@/seo/schema'
import { projectMedia } from './home/SelectedWork'
import './work.css'

type View = 'index' | 'sheet'
const KEY = 'nba.work.view'

/** The archive. One dataset, two views: an index you read, a sheet you scan. */
export default function Work() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const meta = usePageMeta('work')
  const c = copy.work
  const [view, setView] = useState<View>('index')
  const [hover, setHover] = useState<string | null>(null)

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY)
      if (v === 'sheet' || v === 'index') setView(v)
    } catch {
      /* private mode: default view */
    }
  }, [])
  const choose = (v: View) => {
    setView(v)
    try {
      localStorage.setItem(KEY, v)
    } catch {
      /* ignore */
    }
  }

  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.work, path: '/work' },
  ]
  usePage({
    page: 'work',
    path: '/work',
    jsonLd: [collection(plain(meta.title), meta.description, '/work', locale, site.projects.map(p => ({ name: p.name, path: `/case-studies/${p.slug}` }))), crumbSchema(crumbs, locale)],
  })
  const active = site.projects.find(p => p.slug === hover)

  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="work" env="mineral" />
      <Zone env="mineral" className="wrap archive" label={copy.pages.work}>
        <div className="archive__bar">
          <span className="label">{c.viewLabel}</span>
          <div role="group" aria-label={c.viewLabel} className="archive__toggle t-small">
            {(['index', 'sheet'] as View[]).map(v => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => choose(v)}>
                {v === 'index' ? c.viewIndex : c.viewSheet}
              </button>
            ))}
          </div>
        </div>

        {view === 'index' ? (
          <div className="archive__index" onPointerLeave={() => setHover(null)}>
            <ol role="list" className="archive__list">
              {site.projects.map(p => (
                <li key={p.slug}>
                  <Link to={`/case-studies/${p.slug}`} className="archive__row" onPointerEnter={() => setHover(p.slug)} onFocus={() => setHover(p.slug)}>
                    <span className="archive__name">{p.name}</span>
                    <span className="archive__brief dim t-small">{p.brief}</span>
                    <span className="archive__meta t-caption dimmer">
                      {p.discipline}
                      {p.year ? ` · ${p.year}` : ''}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <div className="archive__peek" aria-hidden="true">
              {active ? <Slip key={active.slug} media={projectMedia(active)} ratio={4 / 5} trigger="arrive" sizes="30vw" alt="" /> : null}
            </div>
          </div>
        ) : (
          <ol role="list" className="sheetview">
            {site.projects.map((p, i) => (
              <li key={p.slug} className={`sheetview__i sheetview__i--${i % 5}`}>
                <Link to={`/case-studies/${p.slug}`} className="sheetview__link">
                  <Slip media={projectMedia(p)} ratio={i % 2 ? 4 / 5 : 3 / 2} sizes="(min-width: 1024px) 40vw, 92vw" alt="" />
                  <p className="t-small">
                    {p.name}
                    <span className="dimmer"> · {p.year}</span>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </Zone>
    </main>
  )
}
