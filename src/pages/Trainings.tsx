import PageHead, { crumbSchema } from '@/components/PageHead'
import EmailCapture from '@/components/EmailCapture'
import Zone from '@/components/Zone'
import { plain } from '@/components/Rich'
import { useCopy, usePageMeta, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import './misc.css'

export default function Trainings() {
  const copy = useCopy()
  const locale = useLocale()
  const meta = usePageMeta('trainings')
  const body = useSection('trainings', 'body')
  const format = useSection('trainings', 'format')
  const waiting = useSection('trainings', 'waiting')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.trainings, path: '/trainings' },
  ]
  usePage({
    page: 'trainings',
    path: '/trainings',
    jsonLd: [
      crumbSchema(crumbs, locale),
      { '@context': 'https://schema.org', '@type': 'Course', name: plain(meta.title), description: meta.description, provider: { '@id': 'https://notbyaccident.com/#organization' }, inLanguage: locale },
    ],
  })
  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="trainings" />
      <Zone env="frost" className="wrap band">
        <div className="split">
          <div className="soon__body">
            {(body?.items ?? []).map((p, i) => (
              <p key={i} className="t-lead">
                {p.body}
              </p>
            ))}
          </div>
          {format?.items?.length ? (
            <div>
              <h2 className="label">{format.title}</h2>
              <dl className="facts">
                {format.items.map(r => (
                  <div key={r.title}>
                    <dt className="t-caption dimmer">{r.title}</dt>
                    <dd className="t-title">{r.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>
      </Zone>
      {waiting ? (
        <Zone env="signal" className="soon__cta" labelledBy="waiting">
          <div className="wrap split">
            <h2 id="waiting" className="t-section">
              {waiting.title}
            </h2>
            <div className="soon__form">
              {waiting.body ? <p className="t-lead">{waiting.body}</p> : null}
              <EmailCapture source="newsletter" message="Trainings waiting list" button={waiting.ctaLabel || undefined} thanks={copy.trainings.thanks} />
            </div>
          </div>
        </Zone>
      ) : null}
    </main>
  )
}
