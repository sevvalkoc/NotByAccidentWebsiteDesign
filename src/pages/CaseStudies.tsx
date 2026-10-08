import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { plain } from '@/components/Rich'
import { figureFor, useCopy, usePageMeta, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { collection } from '@/seo/schema'
import { projectMedia } from './home/SelectedWork'
import './work.css'

/** The long reads: each case leads with its problem and ends with its figure. */
export default function CaseStudies() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const meta = usePageMeta('case-studies')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.caseStudies, path: '/case-studies' },
  ]
  usePage({
    page: 'case-studies',
    path: '/case-studies',
    jsonLd: [collection(plain(meta.title), meta.description, '/case-studies', locale, site.projects.map(p => ({ name: p.name, path: `/case-studies/${p.slug}` }))), crumbSchema(crumbs, locale)],
  })

  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="case-studies" />
      <Zone env="frost" className="wrap reads">
        {site.projects.map(p => {
          const f = figureFor(p, locale)
          return (
            <article key={p.slug} className="read" aria-labelledby={`r-${p.slug}`}>
              <Link to={`/case-studies/${p.slug}`} className="read__media" tabIndex={-1} aria-hidden="true">
                <Slip media={projectMedia(p)} ratio={3 / 2} sizes="(min-width: 1024px) 50vw, 92vw" alt="" />
              </Link>
              <div className="read__text">
                <p className="t-caption dimmer">
                  {p.discipline} · {p.year}
                </p>
                <h2 id={`r-${p.slug}`} className="t-section">
                  <Link to={`/case-studies/${p.slug}`}>{p.name}</Link>
                </h2>
                <p className="dim">{p.narrative ? p.narrative.problem : p.brief}</p>
                {f ? (
                  <p className="t-small">
                    <span className="read__v t-num">{f.value}</span> <span className="dim">{f.label}</span>
                  </p>
                ) : null}
                <Link to={`/case-studies/${p.slug}`} className="link-q go t-small" aria-label={`${copy.caseStudies.read}: ${p.name}`}>
                  {copy.caseStudies.read}
                </Link>
              </div>
            </article>
          )
        })}
      </Zone>
    </main>
  )
}
