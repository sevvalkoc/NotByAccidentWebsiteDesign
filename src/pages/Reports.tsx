import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import { useCompany, submitLead } from '@/content'

export default function Reports() {
  const company = useCompany()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    submitLead({ email, source: 'newsletter' })
    setSent(true)
    setEmail('')
  }

  return (
    <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title="Reports" description="Field notes, benchmarks and original research from Not by Accident — coming soon." path="/reports" />

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
            Reports · Coming soon
          </p>

          <h1
            className="t-display"
            style={{ maxWidth: '18ch', marginBottom: '1.75rem' }}
          >
            The research, in the open.
          </h1>

          <p
            className="t-subhead"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '52ch', marginBottom: '2.5rem' }}
          >
            We are putting together a small library of original reports — benchmarks, field notes
            and the working we usually keep to ourselves. Honest numbers, plainly argued. It is not
            ready yet, but it is close.
          </p>

          {sent ? (
            <p className="t-subhead" style={{ color: '#6E2237', margin: 0 }}>
              Thank you — we&rsquo;ll write the moment the first report is live.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: '440px' }}>
              <label htmlFor="reports-email" className="sr-only">Email address</label>
              <input
                id="reports-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field"
                autoComplete="email"
              />
              <button type="submit" className="btn-primary shrink-0">Notify me</button>
            </form>
          )}

          <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '1rem', textTransform: 'none', letterSpacing: '0.02em' }}>
            One email when it launches. Nothing else. Or write to{' '}
            <a href={`mailto:${company.email}`} className="link-beetroot">{company.email}</a>.
          </p>

          <p className="t-body" style={{ marginTop: '3rem' }}>
            <Link to="/notes" className="t-ui link-grow" style={{ color: '#221E1B' }}>
              In the meantime, read the Journal →
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
