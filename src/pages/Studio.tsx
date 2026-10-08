import PageHead, { crumbSchema } from '@/components/PageHead'
import EmailCapture from '@/components/EmailCapture'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { plain } from '@/components/Rich'
import { useCopy, usePageMeta, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import './misc.css'

/** Studio. Every block below is a section in Admin → Pages → Studio. */
export default function Studio() {
  const copy = useCopy()
  const locale = useLocale()
  const meta = usePageMeta('studio')
  const header = useSection('studio', 'header')
  const principles = useSection('studio', 'principles')
  const culture = useSection('studio', 'culture')
  const locations = useSection('studio', 'locations')
  const signup = useSection('studio', 'signup')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.studio, path: '/studio' },
  ]
  usePage({
    page: 'studio',
    path: '/studio',
    jsonLd: [
      crumbSchema(crumbs, locale),
      { '@context': 'https://schema.org', '@type': 'AboutPage', name: plain(meta.title), description: meta.description, about: { '@id': 'https://notbyaccident.com/#organization' } },
    ],
  })

  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="studio" env="cool" sub={header?.body} />
      {header?.image ? (
        <Zone env="cool" className="wrap studio__media">
          <Slip media={header.image} ratio={16 / 9} trigger="arrive" sizes="(min-width: 1024px) 66vw, 92vw" />
        </Zone>
      ) : null}

      {principles?.items?.length ? (
        <Zone env="frost" className="wrap band" labelledBy="principles">
          <div className="split">
            <h2 id="principles" className="label sticky-label">
              {principles.title}
            </h2>
            <ol role="list" className="principles">
              {principles.items.map(p => (
                <li key={p.title}>
                  <h3 className="t-title">{p.title}</h3>
                  <p className="dim">{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </Zone>
      ) : null}

      {culture?.items?.length ? (
        <Zone env="void" className="studio__culture" labelledBy="culture">
          <div className="wrap split">
            <h2 id="culture" className="label">
              {culture.title}
            </h2>
            <ul role="list" className="culture">
              {culture.items.map(x => (
                <li key={x.title}>
                  <h3 className="t-section">{x.title}</h3>
                  <p className="dim">{x.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </Zone>
      ) : null}

      {locations?.items?.length ? (
        <Zone env="frost" className="wrap band" labelledBy="where">
          <div className="split">
            <h2 id="where" className="label">
              {locations.title}
            </h2>
            <ul role="list" className="locations">
              {locations.items.map(l => (
                <li key={l.title}>
                  <span className="t-title">{l.title}</span>
                  <span className="t-small dim">{l.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </Zone>
      ) : null}

      {signup ? (
        <Zone env="frost" className="wrap band" labelledBy="signup">
          <div className="split">
            <span />
            <div className="studio__signup">
              <h2 id="signup" className="t-title">
                {signup.title}
              </h2>
              <EmailCapture source="footer" />
            </div>
          </div>
        </Zone>
      ) : null}
    </main>
  )
}
