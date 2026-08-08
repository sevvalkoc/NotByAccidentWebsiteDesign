import { useEffect, useRef, useState } from 'react'
import Seo from '@/components/Seo'
import { submitLead } from '@/content'

export default function Contact() {
  const ref = useRef<HTMLElement>(null)
  const [submitted, setSubmitted] = useState(false)

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
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title="Contact" description="Start a project with Not by Accident. Tell us the company you want to become — first reply within one working day, from a person, not a form." path="/contact" />

      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>Contact</p>
          <h1 className="t-display reveal reveal-delay-1" style={{ maxWidth: '14ch', marginBottom: '1.5rem' }}>
            Write to us.
          </h1>
          <p
            className="t-subhead reveal reveal-delay-2"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '40ch' }}
          >
            We work with founders and creative leads who suspect their company is better than its reputation.
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
                We do not work with everyone. We work on fewer projects than most, and each one receives the attention it requires.
              </p>
              <p className="t-body" style={{ color: 'rgba(34,30,27,.7)' }}>
                Before writing, it is worth knowing that we typically begin with a strategy engagement. If you are looking for a production company or an execution partner, we are probably not the right fit.
              </p>
            </div>

            <div className="reveal reveal-delay-1">
              <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.4)' }}>
                Email
              </p>
              <a
                href="mailto:hello@notbyaccident.com"
                className="link-beetroot t-ui block mb-4"
              >
                hello@notbyaccident.com
              </a>

              <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.4)' }}>
                Response time
              </p>
              <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', fontSize: '15px' }}>
                Usually within one working day.
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
                Thank you. We will be in touch shortly.
              </p>
              <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)' }}>
                We typically respond within one working day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault()
                const form = e.currentTarget
                const email = (form.elements.namedItem('c-email') as HTMLInputElement)?.value ?? ''
                const name = (form.elements.namedItem('c-name') as HTMLInputElement)?.value ?? ''
                const message = (form.elements.namedItem('c-message') as HTMLTextAreaElement)?.value ?? ''
                if (email.trim()) submitLead({ email, name, message, source: 'contact' })
                setSubmitted(true)
              }}
              className="reveal"
              aria-label="Contact form"
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="c-name"
                    className="t-caption"
                    style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                  >
                    Name
                  </label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label
                    htmlFor="c-company"
                    className="t-caption"
                    style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                  >
                    Company
                  </label>
                  <input
                    id="c-company"
                    type="text"
                    className="input-field"
                    placeholder="Company name"
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
                  Email
                </label>
                <input
                  id="c-email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="c-budget"
                  className="t-caption"
                  style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                >
                  Approximate budget
                </label>
                <select
                  id="c-budget"
                  className="input-field"
                  defaultValue=""
                  style={{ cursor: 'pointer' }}
                >
                  <option value="" disabled>Select a range</option>
                  <option>Under £25,000</option>
                  <option>£25,000–£75,000</option>
                  <option>£75,000–£150,000</option>
                  <option>£150,000–£300,000</option>
                  <option>Over £300,000</option>
                  <option>Not sure yet</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label
                  htmlFor="c-message"
                  className="t-caption"
                  style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', fontSize: '13px' }}
                >
                  What are you working on?
                </label>
                <textarea
                  id="c-message"
                  required
                  className="textarea-field"
                  placeholder="Tell us about your company and what you are trying to achieve. The more specific you are, the better."
                />
              </div>

              <div>
                <button type="submit" className="btn-primary">
                  Send message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
