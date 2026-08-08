import { useEffect, useRef, useState } from 'react'
import Seo from '@/components/Seo'
import { useTrainings, submitLead } from '@/content'

export default function Trainings() {
  const t = useTrainings()
  const ref = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target) }
      }),
      { threshold: 0.08 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main
      id="main"
      ref={ref}
      style={{
        paddingTop: '56px',
        backgroundColor: '#6E2237',
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Seo title="Events & Workshops" description="Brand and strategy workshops, events and practical training from Not by Accident — experiences worth gathering people for." path="/trainings" />
      {/* Main content */}
      <div
        className="page-grid flex-1"
        style={{
          paddingTop: 'clamp(64px, 10vw, 160px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 'clamp(64px, 8vw, 128px)',
        }}
      >
        {/* Top: announcement */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(40px, 5vw, 80px)',
          }}
          className="md:grid-cols-[55%_40%]"
        >
          <div>
            <p
              className="t-caption mb-8 reveal flex items-center gap-2.5"
              style={{ color: 'rgba(240,234,218,.55)', letterSpacing: '0.08em' }}
            >
              <span
                aria-hidden="true"
                style={{ width: '7px', height: '7px', borderRadius: '100px', backgroundColor: '#E9C558', display: 'inline-block', flex: 'none' }}
              />
              {t.eyebrow}
            </p>
            <h1
              className="t-display reveal reveal-delay-1"
              style={{ color: '#F0EADA', maxWidth: '14ch', marginBottom: '2rem' }}
            >
              {t.heading}
            </h1>
            <p
              className="t-subhead reveal reveal-delay-2"
              style={{ color: 'rgba(240,234,218,.75)', fontWeight: 400, maxWidth: '38ch' }}
            >
              {t.subhead}
            </p>
          </div>

          <div
            className="reveal reveal-delay-2"
            style={{ alignSelf: 'end' }}
          >
            <p
              className="t-body"
              style={{ color: 'rgba(240,234,218,.7)', marginBottom: '2rem', maxWidth: '42ch' }}
            >
              {t.body1}
            </p>
            <p
              className="t-body"
              style={{ color: 'rgba(240,234,218,.7)', marginBottom: '2.5rem', maxWidth: '42ch' }}
            >
              {t.body2}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: 'rgba(240,234,218,.15)' }} />

        {/* Bottom: waiting list + format details */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(40px, 5vw, 64px)',
          }}
          className="md:grid-cols-[45%_50%]"
        >
          {/* Waiting list */}
          <div>
            <p
              className="t-caption mb-6 reveal"
              style={{ color: 'rgba(240,234,218,.5)', letterSpacing: '0.06em' }}
            >
              Waiting list
            </p>
            <p
              className="t-body reveal reveal-delay-1"
              style={{ color: 'rgba(240,234,218,.75)', marginBottom: '1.5rem', maxWidth: '40ch' }}
            >
              {t.waitingListNote}
            </p>
            {joined ? (
              <p className="t-subhead reveal reveal-delay-2" style={{ color: '#E9C558', margin: 0, maxWidth: '40ch' }}>
                You&rsquo;re on the list — we&rsquo;ll write the moment dates are set.
              </p>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault()
                  if (!email.trim()) return
                  submitLead({ email, source: 'newsletter', message: 'Trainings waiting list' })
                  setJoined(true)
                  setEmail('')
                }}
                className="reveal reveal-delay-2"
                aria-label="Training waiting list"
                style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '440px' }}
              >
                <label
                  htmlFor="trainings-email"
                  className="t-caption"
                  style={{ color: 'rgba(240,234,218,.5)', letterSpacing: '0.06em' }}
                >
                  Email address
                </label>
                <input
                  id="trainings-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field-milk"
                  autoComplete="email"
                />
                <button type="submit" className="btn-milk" style={{ alignSelf: 'flex-start' }}>
                  Join the waiting list
                </button>
              </form>
            )}
          </div>

          {/* Format info */}
          <div className="reveal reveal-delay-2">
            <p
              className="t-caption mb-6"
              style={{ color: 'rgba(240,234,218,.5)', letterSpacing: '0.06em' }}
            >
              Format
            </p>
            <ul className="list-none m-0 p-0" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {t.format.map(item => (
                <div
                  key={item.label}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    gap: '1rem',
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(240,234,218,.1)',
                  }}
                >
                  <span className="t-caption" style={{ color: 'rgba(240,234,218,.45)' }}>
                    {item.label}
                  </span>
                  <span className="t-ui" style={{ color: 'rgba(240,234,218,.8)', fontWeight: 400 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
