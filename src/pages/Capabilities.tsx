import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { Cta, plain } from '@/components/Rich'
import { useCopy, usePageMeta, useSection, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { collection } from '@/seo/schema'
import { groupAnchor } from '@/routes'
import './capabilities.css'

/** A map, not a maze: the five practices up top, then each practice with
 *  every discipline it covers listed beside it, one link per discipline. */
export default function Capabilities() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const meta = usePageMeta('capabilities')
  const cta = useSection('capabilities', 'cta')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.capabilities, path: '/capabilities' },
  ]
  usePage({
    page: 'capabilities',
    path: '/capabilities',
    jsonLd: [
      collection(plain(meta.title), meta.description, '/capabilities', locale, site.capabilities.map(x => ({ name: x.name, path: `/capabilities/${x.slug}` }))),
      crumbSchema(crumbs, locale),
    ],
  })

  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="capabilities" />
      <Zone env="frost" className="wrap caps">
        <nav className="caps__index" aria-label={copy.pages.capabilities}>
          <ol role="list">
            {site.categories.map((g, n) => (
              <li key={g.key}>
                <a href={`#${groupAnchor(g.key)}`} className="caps__jump">
                  <span className="t-caption dimmer">{String(n + 1).padStart(2, '0')}</span>
                  <span>{g.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {site.categories.map((g, n) => {
          const items = site.capabilities.filter(x => x.category === g.key)
          return (
            <section key={g.key} id={groupAnchor(g.key)} className="caps__area" aria-labelledby={`${groupAnchor(g.key)}-t`}>
              <header className="caps__head">
                <span className="t-caption dimmer">{String(n + 1).padStart(2, '0')}</span>
                <h2 id={`${groupAnchor(g.key)}-t`} className="caps__name">
                  {g.label}
                </h2>
                <p className="caps__blurb dim">{g.blurb}</p>
                <p className="t-caption dimmer">{copy.capabilities.count(items.length)}</p>
              </header>
              <ul role="list" className="caps__list">
                {items.map(x => (
                  <li key={x.slug}>
                    <Link to={`/capabilities/${x.slug}`} className="caps__row">
                      <span className="caps__cap">{x.name}</span>
                      <span className="caps__go" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
        {cta ? (
          <div className="caps__cta">
            <p className="t-title">{cta.title}</p>
            {cta.ctaLabel ? (
              <Cta url={cta.ctaUrl} className="btn">
                {cta.ctaLabel}
              </Cta>
            ) : null}
          </div>
        ) : null}
      </Zone>
    </main>
  )
}
