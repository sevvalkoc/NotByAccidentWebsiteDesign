import { useRef } from 'react'
import Link from '@/components/LocalizedLink'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'
import { usePrivacyCopy, useCompany, useCustomSections } from '@/content'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'
import CustomSectionBlock from '@/components/CustomSectionBlock'

/* Fixed anchor ids for the "On this page" nav — kept independent of the
   (editable, via Admin → Pages) section heading text, positional so they
   stay stable even if an editor reorders the sections. */
const SECTION_IDS = ['who-we-are', 'what-we-collect', 'why-we-hold-it', 'who-sees-it', 'your-rights']

export default function Privacy() {
  const ref = useRef<HTMLElement>(null)
  const copy = usePrivacyCopy()
  const company = useCompany()
  const customSections = useCustomSections('privacy')
  const t = useT()
  const seo = usePageSeo('/privacy')
  const sections = copy.sections.map((s, i) => ({ id: SECTION_IDS[i] ?? `section-${i}`, heading: s.title, body: s.body.split('\n\n') }))
  useReveal(ref, { threshold: 0.08 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={seo.title} description={seo.description} path="/privacy" />
      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>{copy.eyebrow}</p>
          <h1 className="t-display reveal reveal-delay-1" style={{ maxWidth: '16ch', marginBottom: '1.5rem' }}>
            {copy.heading}
          </h1>
          <p
            className="t-subhead reveal reveal-delay-2"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '46ch' }}
          >
            {copy.subhead}
          </p>
          <p className="t-caption mt-8 reveal reveal-delay-3" style={{ color: 'rgba(34,30,27,.4)' }}>
            {t.privacy.lastUpdatedPrefix}{copy.lastUpdated}
          </p>
        </div>
      </div>

      {/* Body */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(80px, 10vw, 160px)',
        }}
      >
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(40px, 5vw, 80px)' }}
          className="md:grid-cols-[26%_1fr]"
        >
          {/* Contents */}
          <nav aria-label={t.privacy.onThisPage} className="reveal" style={{ alignSelf: 'start', position: 'sticky', top: '96px' }}>
            {copy.headerImage && (
              <img
                src={copy.headerImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                style={{
                  width: '100%',
                  maxWidth: '132px',
                  aspectRatio: '4 / 5',
                  objectFit: 'cover',
                  display: 'block',
                  marginBottom: '1.5rem',
                  filter: 'grayscale(0.15)',
                }}
              />
            )}
            <p className="t-caption mb-4" style={{ color: 'rgba(34,30,27,.4)' }}>{t.privacy.onThisPage}</p>
            <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
              {sections.map(s => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="t-ui no-underline"
                    style={{ color: 'rgba(34,30,27,.6)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#6E2237')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(34,30,27,.6)')}
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sections */}
          <div style={{ maxWidth: '62ch' }}>
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className="reveal"
                style={{
                  scrollMarginTop: '96px',
                  paddingBottom: 'clamp(40px, 5vw, 64px)',
                  marginBottom: 'clamp(40px, 5vw, 64px)',
                  borderBottom: i < sections.length - 1 ? '1px solid rgba(34,30,27,.1)' : 'none',
                }}
              >
                <div
                  style={{ height: '2px', width: '40px', backgroundColor: '#7F8B3E', marginBottom: '1.5rem' }}
                  aria-hidden="true"
                />
                <h2 className="t-headline" style={{ marginBottom: '1.25rem' }}>{s.heading}</h2>
                {s.body.map((p, j) => (
                  <p key={j} className="t-body" style={{ color: 'rgba(34,30,27,.72)', marginBottom: j < s.body.length - 1 ? '1.25rem' : 0 }}>
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <p className="t-body reveal" style={{ color: 'rgba(34,30,27,.6)' }}>
              {t.privacy.questionsPrefix}{' '}
              <a href={`mailto:${company.email}`} className="link-beetroot">{company.email}</a>, or read our{' '}
              <Link to="/cookies" className="link-beetroot">{t.privacy.cookieNoticeLink}</Link>.
            </p>
          </div>
        </div>
      </div>
      {customSections.map(cs => (
        <CustomSectionBlock key={cs.key} section={cs} />
      ))}
    </main>
  )
}
