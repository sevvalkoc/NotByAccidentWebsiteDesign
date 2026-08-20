import { useState } from 'react'
import Link from '@/components/LocalizedLink'
import Seo from '@/components/Seo'
import { useCompany, useReportsCopy, submitLead } from '@/content'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'

export default function Reports() {
  const company = useCompany()
  const copy = useReportsCopy()
  const t = useT()
  const seo = usePageSeo('/reports')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    const res = await submitLead({ email, source: 'newsletter' })
    if (!res.ok) {
      setError(res.error ?? t.reports.formError)
      return
    }
    setSent(true)
    setEmail('')
  }

  return (
    <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={seo.title} description={seo.description} path="/reports" />

      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(80px, 12vw, 180px)',
          paddingBottom: 'clamp(80px, 12vw, 180px)',
          minHeight: 'calc(100vh - 56px)',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '760px' }}>
          <p
            className="t-caption"
            style={{
              color: '#6E2237',
              marginBottom: '1.5rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#7F8B3E', display: 'inline-block' }}
              aria-hidden="true"
            />
            {copy.eyebrow}
          </p>

          <h1
            className="t-display"
            style={{ maxWidth: '18ch', marginBottom: '1.75rem' }}
          >
            {copy.heading}
          </h1>

          <p
            className="t-subhead"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '52ch', marginBottom: '2.5rem' }}
          >
            {copy.subhead}
          </p>

          {sent ? (
            <p className="t-subhead" style={{ color: '#6E2237', margin: 0 }}>
              {t.reports.thankYou}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: '440px' }}>
              <label htmlFor="reports-email" className="sr-only">{t.reports.emailLabel}</label>
              <input
                id="reports-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.reports.emailPlaceholder}
                className="input-field"
                autoComplete="email"
              />
              <button type="submit" className="btn-primary shrink-0">{t.reports.notifyMe}</button>
            </form>
          )}
          {error && <p className="t-caption" style={{ color: '#6E2237', marginTop: '0.75rem' }}>{error}</p>}

          <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '1rem', textTransform: 'none', letterSpacing: '0.02em' }}>
            {t.reports.oneEmailPrefix}{' '}
            <a href={`mailto:${company.email}`} className="link-beetroot">{company.email}</a>.
          </p>

          <p className="t-body" style={{ marginTop: '3rem' }}>
            <Link to="/notes" className="t-ui link-grow" style={{ color: '#221E1B' }}>
              {t.reports.readJournal}
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
