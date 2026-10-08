import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { slugify, useCopy, useSection, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import './misc.css'

/** Legal copy is kept verbatim from the previous site, and is CMS-editable. */
export default function Privacy() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const header = useSection('privacy', 'header')
  const legal = useSection('privacy', 'legal')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.privacy, path: '/privacy' },
  ]
  usePage({ page: 'privacy', path: '/privacy', jsonLd: [crumbSchema(crumbs, locale)] })
  const updated = header?.extra?.lastUpdated as string | undefined
  const sections = legal?.items ?? []
  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="privacy" aside={updated ? `${copy.privacy.updated} · ${updated}` : undefined} />
      <Zone env="frost" className="wrap band">
        <div className="split">
          <nav aria-labelledby="otp" className="sticky-label legal__toc t-small">
            <h2 id="otp" className="label">
              {copy.privacy.onThisPage}
            </h2>
            <ol role="list">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a className="link-q" href={`#${slugify(s.title) || `s${i}`}`}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="prose legal">
            {sections.map((s, i) => (
              <section key={s.title} id={slugify(s.title) || `s${i}`}>
                <h2>{s.title}</h2>
                {s.body.split('\n\n').map(p => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
            <p>
              {copy.privacy.questions} <a href={`mailto:${site.company.email}`}>{site.company.email}</a>. <Link to="/cookies">{copy.pages.cookies}</Link>
            </p>
          </div>
        </div>
      </Zone>
    </main>
  )
}
