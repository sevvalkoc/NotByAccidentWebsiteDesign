import { useParams } from 'react-router-dom'
import { Breadcrumbs, crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import NotFound from './NotFound'
import { figureFor, useCopy, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { caseStudy } from '@/seo/schema'
import { projectMedia } from './home/SelectedWork'
import './work.css'

export default function CaseStudy() {
  const { slug } = useParams()
  const site = useSite()
  const i = site.projects.findIndex(p => p.slug === slug)
  if (i < 0) return <NotFound />
  return <Case key={site.projects[i].slug} index={i} />
}

/** A case: one image and one line to open, the thinking in the middle, one
 *  figure for what happened, then the work itself. Every field is edited in
 *  Admin → Work. */
function Case({ index }: { index: number }) {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const c = copy.caseStudy
  const p = site.projects[index]
  const next = site.projects[(index + 1) % site.projects.length]
  const f = figureFor(p, locale)
  const caps = site.capabilities.filter(x => p.relatedCapabilities.includes(x.slug))
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.caseStudies, path: '/case-studies' },
    { name: p.name, path: `/case-studies/${p.slug}` },
  ]
  usePage({
    path: `/case-studies/${p.slug}`,
    title: `${p.name} · ${c.titleSuffix}`,
    description: p.narrative ? `${p.brief} ${p.narrative.outcome}` : `${p.name}: ${p.brief} ${p.services.join(', ')}, ${p.year}.`,
    seo: p.seo,
    image: p.heroImg || p.img,
    imageAlt: `${p.name}: ${p.brief}`,
    type: 'article',
    jsonLd: [caseStudy(p, locale), crumbSchema(crumbs, locale)],
  })

  const meta = [
    [c.client, p.client || p.name],
    [c.discipline, p.discipline],
    [c.location, p.location],
    [c.year, p.year],
  ].filter(([, v]) => v)

  return (
    <main id="main" tabIndex={-1} className="case">
      <Zone as="header" env="frost" className="case__open">
        <div className="wrap">
          <div className="phead__top">
            <Breadcrumbs items={crumbs} />
          </div>
          <h1 className="phead__title">
            <span className="rise">
              <span>{p.name}</span>
            </span>
          </h1>
          <p className="t-lead dim case__brief">{p.brief}</p>
        </div>
        <div className="wrap">
          <Slip media={projectMedia(p)} ratio={16 / 9} trigger="arrive" priority sizes="(min-width: 1440px) 1440px, 100vw" className="case__hero" />
          <dl className="case__meta t-caption">
            {meta.map(([k, v]) => (
              <div key={k}>
                <dt className="dimmer">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Zone>

      <Zone env="frost" className="case__body">
        {p.introduction ? (
          <section className="wrap band">
            <div className="split">
              <span />
              <p className="t-lead">{p.introduction}</p>
            </div>
          </section>
        ) : null}
        {p.narrative ? (
          <>
            <section className="wrap band" aria-labelledby="c-problem">
              <div className="split">
                <h2 id="c-problem" className="label sticky-label">
                  {c.problem}
                </h2>
                <p className="t-title case__text">{p.narrative.problem}</p>
              </div>
            </section>
            <section className="wrap band" aria-labelledby="c-insight">
              <div className="split">
                <h2 id="c-insight" className="label sticky-label">
                  {c.insight}
                </h2>
                <p className="t-section serif case__insight">{p.narrative.insight}</p>
              </div>
            </section>
            <section className="wrap band" aria-labelledby="c-decided">
              <div className="split">
                <h2 id="c-decided" className="label sticky-label">
                  {c.intervention}
                </h2>
                <p className="t-title case__text">{p.narrative.intervention}</p>
              </div>
            </section>
          </>
        ) : (
          <section className="wrap band">
            <p className="t-title">{c.inProgress}</p>
          </section>
        )}
      </Zone>

      {p.narrative ? (
        <Zone env="void" className="case__result" labelledBy="c-outcome">
          <div className="wrap split">
            <h2 id="c-outcome" className="label">
              {c.outcome}
            </h2>
            <div>
              {f ? (
                <p className="case__fig">
                  <span className="t-display t-num">{f.value}</span>
                  <span className="t-small dim">{f.label}</span>
                </p>
              ) : null}
              <p className="t-title case__outcome">{p.narrative.outcome}</p>
            </div>
          </div>
        </Zone>
      ) : null}

      {p.gallery?.length ? (
        <Zone env="mineral" className="case__gallery" label={c.gallery}>
          <div className="wrap gallery">
            {p.gallery.map((m, i) => (
              <figure key={m.url + i} className={`gallery__i gallery__i--${i % 4}`}>
                <Slip media={m} ratio={i % 4 === 1 ? 4 / 5 : 3 / 2} trigger="arrive" sizes="(min-width: 1024px) 60vw, 92vw" />
                {m.caption ? <figcaption className="t-caption dimmer">{m.caption}</figcaption> : null}
              </figure>
            ))}
          </div>
        </Zone>
      ) : null}

      <Zone env="frost" className="wrap band case__end">
        <div className="split">
          <h2 className="label">{c.capabilities}</h2>
          <div className="case__end-body">
            <ul role="list" className="case__caps">
              {(caps.length ? caps.map(x => ({ key: x.slug, name: x.name, to: `/capabilities/${x.slug}` })) : p.services.map(s => ({ key: s, name: s, to: '' }))).map(x => (
                <li key={x.key}>{x.to ? <Link to={x.to} className="link-q">{x.name}</Link> : x.name}</li>
              ))}
            </ul>
            {p.credits ? (
              <div className="t-small">
                <p className="label">{c.credits}</p>
                <p className="dim case__credits">{p.credits}</p>
              </div>
            ) : null}
            {p.externalUrl ? (
              <a href={p.externalUrl} target="_blank" rel="noopener noreferrer" className="link-q go t-small">
                {c.visit}
              </a>
            ) : null}
          </div>
        </div>
      </Zone>

      {next && next.slug !== p.slug ? (
        <Zone as="nav" env="frost" className="case__next" label={c.next}>
          <Link to={`/case-studies/${next.slug}`} className="wrap case__next-link">
            <span className="label">{c.next}</span>
            <span className="t-section">{next.name}</span>
            <span className="t-small dim">{next.brief}</span>
          </Link>
        </Zone>
      ) : null}
    </main>
  )
}
