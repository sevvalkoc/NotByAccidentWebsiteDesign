import { useParams } from 'react-router-dom'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import NotFound from './NotFound'
import { useCopy, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { faq, service } from '@/seo/schema'
import { groupAnchor } from '@/routes'
import { projectMedia } from './home/SelectedWork'
import './capabilities.css'

export default function Capability() {
  const { slug } = useParams()
  const site = useSite()
  const cap = site.capabilities.find(x => x.slug === slug)
  if (!cap) return <NotFound />
  return <CapabilityView key={cap.slug} slug={cap.slug} />
}

/** One discipline. The semantic depth of the site lives here. */
function CapabilityView({ slug }: { slug: string }) {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const c = copy.capability
  const cap = site.capabilities.find(x => x.slug === slug)!
  const group = site.categories.find(g => g.key === cap.category)
  const siblings = site.capabilities.filter(x => x.category === cap.category && x.slug !== cap.slug)
  const work = site.projects.filter(p => p.relatedCapabilities.includes(cap.slug)).slice(0, 3)
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.capabilities, path: '/capabilities' },
    { name: cap.name, path: `/capabilities/${cap.slug}` },
  ]
  usePage({
    path: `/capabilities/${cap.slug}`,
    title: `${cap.name} · ${group?.label ?? cap.category}`,
    description: cap.summary,
    seo: cap.seo,
    jsonLd: [
      service(cap, group?.label ?? cap.category, locale, c.included(cap.name)),
      faq([
        { q: c.whatIs(cap.name), a: cap.lede },
        { q: c.whatDelivers(cap.name), a: cap.outcome },
      ]),
      crumbSchema(crumbs, locale),
    ],
  })

  return (
    <main id="main" tabIndex={-1}>
      <PageHead title={cap.name} crumbs={crumbs} sub={cap.summary} aside={<Link to={`/capabilities#${groupAnchor(cap.category)}`} className="link-q">{group?.label}</Link>} />

      <Zone env="frost" className="wrap band">
        <div className="split">
          <h2 className="label sticky-label">{c.whatIs(cap.name)}</h2>
          <p className="t-title cap__lede">{cap.lede}</p>
        </div>
      </Zone>

      <Zone env="void" className="cap__qa">
        <div className="wrap split">
          <h2 className="label">{c.question}</h2>
          <div className="cap__qa-body">
            <p className="t-section serif">{cap.question}</p>
            <div>
              <h3 className="label">{c.whatDelivers(cap.name)}</h3>
              <p className="t-title dim cap__a">{cap.outcome}</p>
            </div>
          </div>
        </div>
      </Zone>

      <Zone env="frost" className="wrap band">
        <div className="split">
          <h2 className="label sticky-label">{c.includes}</h2>
          <ol role="list" className="numbered">
            {cap.includes.map((x, i) => (
              <li key={x}>
                <span className="t-caption dimmer t-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="t-title">{x}</span>
              </li>
            ))}
          </ol>
        </div>
      </Zone>

      {work.length ? (
        <Zone env="mineral" className="band cap__work-zone">
          <div className="wrap split">
            <h2 className="label sticky-label">{c.seen}</h2>
            <ul role="list" className="cap__work">
              {work.map(p => (
                <li key={p.slug}>
                  <Link to={`/case-studies/${p.slug}`} className="cap__work-link">
                    <Slip media={projectMedia(p)} ratio={3 / 2} sizes="(min-width: 1024px) 30vw, 92vw" alt="" />
                    <span className="t-title">{p.name}</span>
                    <span className="t-small dim">{p.brief}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Zone>
      ) : null}

      <Zone env="frost" className="wrap band">
        <div className="split">
          <h2 className="label sticky-label">{c.alsoIn(group?.label ?? '')}</h2>
          <div>
            <ul role="list" className="caps__list caps__list--open">
              {siblings.map(x => (
                <li key={x.slug}>
                  <Link to={`/capabilities/${x.slug}`} className="caps__row">
                    <span className="caps__cap">{x.name}</span>
                    <span className="t-small dim">{x.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="actions cap__cta">
              <Link to="/contact" className="btn">
                {c.talk(cap.name)}
              </Link>
              <Link to="/capabilities" className="link-q go">
                {c.all}
              </Link>
            </p>
          </div>
        </div>
      </Zone>
    </main>
  )
}
