import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { useCopy, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import './misc.css'

export default function Cookies() {
  const copy = useCopy()
  const locale = useLocale()
  const table = useSection('cookies', 'table')
  const managing = useSection('cookies', 'managing')
  const c = copy.cookies
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.cookies, path: '/cookies' },
  ]
  usePage({ page: 'cookies', path: '/cookies', jsonLd: [crumbSchema(crumbs, locale)] })
  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="cookies" />
      <Zone env="frost" className="wrap band">
        <table className="legal__table">
          <thead className="t-caption dimmer">
            <tr>
              <th scope="col">{c.category}</th>
              <th scope="col">{c.does}</th>
              <th scope="col">{c.lifespan}</th>
            </tr>
          </thead>
          <tbody>
            {(table?.items ?? []).map(r => (
              <tr key={r.title}>
                <th scope="row" className="t-title">
                  {r.title}
                </th>
                <td className="dim">{r.body}</td>
                <td className="t-caption t-num">{r.meta}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="prose legal legal--after">
          {managing ? (
            <>
              <h2>{managing.title}</h2>
              <p>{managing.body}</p>
            </>
          ) : null}
          <p>
            {c.fuller} <Link to="/privacy">{c.privacyLink}</Link>.
          </p>
        </div>
      </Zone>
    </main>
  )
}
