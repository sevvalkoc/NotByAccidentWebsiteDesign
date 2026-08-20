import { useRef, useState } from 'react'
import Seo from '@/components/Seo'
import { submitLead, useTeam, useStudio } from '@/content'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'

function AboutSignup() {
  const t = useT()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (sent) {
    return (
      <p className="t-subhead reveal" style={{ color: '#6E2237', margin: 0 }}>
        {t.studio.thankYou}
      </p>
    )
  }

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!email.trim()) return
        setError('')
        const res = await submitLead({ email, source: 'footer' })
        if (!res.ok) {
          setError(res.error ?? t.studio.formError)
          return
        }
        setSent(true)
      }}
      className="flex flex-col sm:flex-row gap-3 reveal reveal-delay-1"
      style={{ maxWidth: '440px', width: '100%' }}
    >
      <label htmlFor="about-email" className="sr-only">{t.studio.emailLabel}</label>
      <input
        id="about-email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={t.studio.emailPlaceholder}
        className="input-field"
        autoComplete="email"
      />
      <button type="submit" className="btn-primary shrink-0">{t.studio.send}</button>
      {error && (
        <p className="t-caption" style={{ color: '#6E2237', width: '100%' }}>{error}</p>
      )}
    </form>
  )
}

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const team = useTeam()
  const studio = useStudio()
  const t = useT()
  const seo = usePageSeo('/studio')
  useReveal(ref, { threshold: 0.06 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={seo.title} description={seo.description} path="/studio" />

      {/* Opening — large statement */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-8 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>{studio.eyebrow}</p>
          <h1
            className="t-display reveal reveal-delay-1"
            style={{
              maxWidth: '16ch',
              marginBottom: 'clamp(32px, 4vw, 64px)',
            }}
          >
            {studio.heading}
          </h1>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }}
            className="md:grid-cols-[45%_50%]"
          >
            <p
              className="t-subhead reveal reveal-delay-2"
              style={{ color: 'rgba(34,30,27,.75)', fontWeight: 400 }}
            >
              {studio.subhead}
            </p>
            <p
              className="t-body reveal reveal-delay-3"
              style={{ color: 'rgba(34,30,27,.65)' }}
            >
              {studio.body}
            </p>
          </div>
        </div>
      </div>

      {/* Small editorial image, left-aligned */}
      {studio.openingImage && (
        <div className="page-grid" style={{ paddingTop: 'clamp(40px, 5vw, 72px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
          <figure className="reveal m-0" style={{ maxWidth: '360px' }}>
            <div className="work-tile img-crosshair" style={{ overflow: 'hidden', width: '100%', aspectRatio: '4/5', backgroundColor: '#3a3530' }}>
              <img
                src={studio.openingImage}
                alt={t.studio.crowdAlt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <figcaption className="t-caption" style={{ color: 'rgba(34,30,27,.35)', marginTop: '12px' }}>
              {t.studio.caption}
            </figcaption>
          </figure>
        </div>
      )}

      {/* Principles */}
      <div
        style={{
          backgroundColor: '#F0EADA',
          borderTop: '1px solid rgba(34,30,27,.1)',
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-8 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>
            {studio.principlesEyebrow}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'clamp(32px, 4vw, 48px)',
            }}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {studio.principles.map((p, i) => (
              <div
                key={p.title}
                className="reveal"
                style={{ transitionDelay: `${(i % 3) * 60}ms` }}
              >
                <h3
                  style={{
                    fontFamily: 'Lora, Georgia, serif',
                    fontSize: 'clamp(18px, 1.8vw, 22px)',
                    fontWeight: 400,
                    letterSpacing: '-0.005em',
                    color: '#221E1B',
                    margin: '0 0 10px',
                  }}
                >
                  {p.title}
                </h3>
                <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', fontSize: '15px' }}>
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* People */}
      {team.length > 0 && (
        <div
          style={{
            backgroundColor: '#F0EADA',
            borderTop: '1px solid rgba(34,30,27,.1)',
            paddingTop: 'clamp(56px, 7vw, 104px)',
            paddingBottom: 'clamp(56px, 7vw, 104px)',
          }}
        >
          <div className="page-grid">
            <p className="t-caption mb-8 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>
              {t.studio.peopleHeading}
            </p>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(32px, 4vw, 56px)' }}
              className="sm:grid-cols-2 lg:grid-cols-3"
            >
              {team.map((person, i) => (
                <div key={person.id} className="reveal" style={{ transitionDelay: `${(i % 3) * 60}ms` }}>
                  {person.img && (
                    <div className="work-tile img-crosshair" style={{ overflow: 'hidden', width: '100%', aspectRatio: '4/5', backgroundColor: '#3a3530', marginBottom: '16px' }}>
                      <img src={person.img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(19px, 1.9vw, 23px)', fontWeight: 400, color: '#221E1B', margin: '0 0 4px' }}>
                    {person.name}
                  </h3>
                  <p className="t-caption" style={{ color: '#6E2237', marginBottom: '10px' }}>{person.role}</p>
                  <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', fontSize: '15px' }}>{person.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Culture */}
      <div
        style={{
          backgroundColor: '#221E1B',
          paddingTop: 'clamp(56px, 7vw, 104px)',
          paddingBottom: 'clamp(56px, 7vw, 104px)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-8 reveal" style={{ color: 'rgba(240,234,218,.4)' }}>
            {studio.cultureEyebrow}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-16 gap-y-10">
            <p className="t-headline reveal" style={{ color: '#F0EADA', maxWidth: '18ch' }}>
              {studio.cultureHeading}
            </p>
            <div className="reveal reveal-delay-1">
              {studio.cultureItems.map((c, i) => (
                <div key={c.title} style={{ padding: '18px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(240,234,218,.16)' }}>
                  <h3 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '21px', fontWeight: 400, color: '#F0EADA', margin: '0 0 6px' }}>{c.title}</h3>
                  <p className="t-body m-0" style={{ color: 'rgba(240,234,218,.6)', fontSize: '15px', maxWidth: '46ch' }}>{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA + email capture */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(64px, 8vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 96px)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.75rem' }}>
          <h2 className="t-headline reveal" style={{ margin: 0, maxWidth: '22ch' }}>
            {studio.ctaHeading}
          </h2>
          <AboutSignup />
        </div>
      </div>
    </main>
  )
}
