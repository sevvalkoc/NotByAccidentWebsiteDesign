import PageHead, { crumbSchema } from '@/components/PageHead'
import EmailCapture from '@/components/EmailCapture'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { useCopy, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import './misc.css'

export default function Reports() {
  const copy = useCopy()
  const locale = useLocale()
  const notify = useSection('reports', 'notify')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.reports, path: '/reports' },
  ]
  usePage({ page: 'reports', path: '/reports', jsonLd: [crumbSchema(crumbs, locale)] })
  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="reports" />
      {notify ? (
        <Zone env="frost" className="wrap band">
          <div className="split">
            <h2 className="label">{notify.title}</h2>
            <div className="soon__form">
              {notify.body ? <p className="t-lead">{notify.body}</p> : null}
              <EmailCapture source="newsletter" button={notify.ctaLabel || undefined} thanks={copy.reports.thanks} />
              <Link to="/notes" className="link-q go t-small">
                {copy.reports.meanwhile}
              </Link>
            </div>
          </div>
        </Zone>
      ) : null}
    </main>
  )
}
