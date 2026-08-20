import { useRef, useState } from 'react'
import Seo from '@/components/Seo'
import { submitLead, useCompany, useContactCopy, useCustomSections } from '@/content'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'
import CustomSectionBlock from '@/components/CustomSectionBlock'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const company = useCompany()
  const copy = useContactCopy()
  const customSections = useCustomSections('contact')
  const t = useT()
  const seo = usePageSeo('/contact')
  useReveal(ref, { threshold: 0.08 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={seo.title} description={seo.description} path="/contact" />

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
          <h1 className="t-display reveal reveal-delay-1" style={{ maxWidth: '14ch', marginBottom: '1.5rem' }}>
            {copy.heading}
          </h1>
          <p
            className="t-subhead reveal reveal-delay-2"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '40ch' }}
          >
            {copy.subhead}
          </p>
        </div>
      </div>

      {/* Main content */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(56px, 7vw, 96px)',
          paddingBottom: 'clamp(80px, 10vw, 160px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(48px, 6vw, 96px)',
          }}
          className="md:grid-cols-[38%_55%]"
        >
          {/* Left: context */}
          <div>
            <div className="reveal" style={{ marginBottom: '3rem' }}>
              <p
                className="t-body"
                style={{ color: 'rgba(34,30,27,.7)', marginBottom: '1.5rem' }}
              >
                {copy.intro1}
              </p>
              <p className="t-body" style={{ color: 'rgba(34,30,27,.7)' }}>
                {copy.intro2}
              </p>
            </div>

            <div className="reveal reveal-delay-1">
              <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.4)' }}>
                {t.contact.email}
              </p>
              <a
                href={`mailto:${company.email}`}
                className="link-beetroot t-ui block mb-4"
              >
                {company.email}
              </a>

              <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.4)' }}>
                {t.contact.responseTime}
              </p>
              <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', fontSize: '15px' }}>
                {t.contact.responseBody}
              </p>
            </div>

            {/* Pickle rule */}
            <div
              style={{
                marginTop: '3rem',
                height: '2px',
                width: '48px',
                backgroundColor: '#7F8B3E',
              }}
            />
          </div>

          {/* Right: form */}
          {submitted ? (
            <div
              className="reveal"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'clamp(32px, 4vw, 48px)',
                border: '1px solid rgba(34,30,27,.1)',
                borderRadius: '2px',
                minHeight: '320px',
              }}
            >
              <p
                style={{
                  fontFamily: 'Lora, Georgia, serif',
                  fontStyle: 'italic',
                  fontSize: 'clamp(20px, 2.5vw, 28px)',
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: '#221E1B',
                  margin: '0 0 1rem',
                  maxWidth: '24ch',
                }}
              >
                {t.contact.thankYouHeading}
              </p>
              <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)' }}>
                {t.contact.thankYouBody}
              </p>
            </div>
          ) : (
            <form
              onSubmit={async e => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem('c-email') as HTMLInputElement)?.value ?? ''
                const name = (form.elements.namedItem('c-name') as HTMLInputElement)?.value ?? ''
                const message = (form.elements.namedItem('c-message') as HTMLTextAreaElement)?.value ?? ''
                if (!email.trim()) return
                setFormError('')
                const res = await submitLead({ email, name, message, source: 'contact' })
                if (!res.ok) {
                  setFormError(res.error ?? t.contact.formError)
                  return
                }
                setSubmitted(true)
              }}
              className="reveal"
              aria-label={t.contact.formAriaLabel}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="c-name"
                    className="t-caption"
                    style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                  >
                    {t.contact.name}
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    className="input-field"
                    placeholder={t.contact.namePlaceholder}
                    autoComplete="name"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="c-company"
                    className="t-caption"
                    style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                  >
                    {t.contact.company}
                  </label>
                  <input
                    id="c-company"
                    type="text"
                    className="input-field"
                    placeholder={t.contact.companyPlaceholder}
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="c-email"
                  className="t-caption"
                  style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                >
                  {t.contact.emailLabel}
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  className="input-field"
                  placeholder={t.contact.emailPlaceholder}
                  autoComplete="email"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="c-budget"
                  className="t-caption"
                  style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                >
                  {t.contact.budget}
                </label>
                <select
                  id="c-budget"
                  className="input-field"
                  defaultValue=""
                  style={{ cursor: 'pointer' }}
                >
                  <option value="" disabled>{t.contact.selectRange}</option>
                  {t.contact.budgetOptions.map(opt => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="c-message"
                  className="t-caption"
                  style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                >
                  {t.contact.whatWorking}
                </label>
                <textarea
                  id="c-message"
                  required
                  className="textarea-field"
                  placeholder={t.contact.whatWorkingPlaceholder}
                />
              </div>

              <div>
                <button type="submit" className="btn-primary">
                  {t.contact.send}
                </button>
                {formError && (
                  <p className="t-caption" style={{ color: '#6E2237', marginTop: '0.75rem' }}>{formError}</p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
      {customSections.map(cs => (
        <CustomSectionBlock key={cs.key} section={cs} />
      ))}
    </main>
  )
}
