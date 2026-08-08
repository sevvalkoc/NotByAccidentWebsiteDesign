import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'

const sections = [
  {
    id: 'who-we-are',
    heading: 'Who we are',
    body: [
      'Not by Accident Ltd is an independent creative company registered in England and Wales. When we refer to “we”, “us” or “our” in this notice, we mean Not by Accident Ltd. When we refer to “you”, we mean anyone who visits this website or corresponds with us.',
      'This notice explains what we collect, why we collect it, and what you can ask us to do about it. It is written to be read, not to be survived.',
    ],
  },
  {
    id: 'what-we-collect',
    heading: 'What we collect',
    body: [
      'We collect only what a conversation requires. When you write to us through the contact form or by email, we hold your name, your company, your email address and whatever you choose to tell us about your project. We keep it for as long as the conversation is live and for a reasonable period afterwards.',
      'When you browse the site, our hosting provider records standard technical information — the pages requested, the approximate region, the browser used. This is ordinary server activity, not surveillance.',
    ],
  },
  {
    id: 'why-we-hold-it',
    heading: 'Why we hold it',
    body: [
      'We use your information for one purpose: to respond to you and, where it becomes relevant, to carry out work you have asked us to do. We do not sell it. We do not build advertising profiles. We do not enrich it with data bought from elsewhere.',
      'Our lawful basis is either your consent, given when you write to us, or our legitimate interest in running a small business well.',
    ],
  },
  {
    id: 'who-sees-it',
    heading: 'Who sees it',
    body: [
      'Your information is seen by the people at Not by Accident who need to see it, and by a short list of service providers who help us operate — email, hosting and analytics. Each is bound by its own obligations. We choose them carefully and review them.',
    ],
  },
  {
    id: 'your-rights',
    heading: 'Your rights',
    body: [
      'You may ask to see the information we hold about you, to correct it, or to have it deleted. You may withdraw consent at any time. You may also complain to the Information Commissioner’s Office, though we would rather you told us first, so we can put it right.',
      'To exercise any of these rights, write to hello@notbyaccident.com. We will respond within one month, usually sooner.',
    ],
  },
]

export default function Privacy() {
  const ref = useRef<HTMLElement>(null)

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
      <Seo title="Privacy" description="How Not by Accident collects, uses and protects your personal data." path="/privacy" />
      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>Privacy</p>
          <h1 className="t-display reveal reveal-delay-1" style={{ maxWidth: '16ch', marginBottom: '1.5rem' }}>
            What we hold, and why.
          </h1>
          <p
            className="t-subhead reveal reveal-delay-2"
            style={{ color: 'rgba(34,30,27,.65)', fontWeight: 400, maxWidth: '46ch' }}
          >
            We collect very little and we treat it plainly. This notice explains exactly how, in language you should not need a lawyer to follow.
          </p>
          <p className="t-caption mt-8 reveal reveal-delay-3" style={{ color: 'rgba(34,30,27,.4)' }}>
            Last updated · 8 August 2026
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
          <nav aria-label="On this page" className="reveal" style={{ alignSelf: 'start', position: 'sticky', top: '96px' }}>
            <img
              src="https://images.unsplash.com/photo-1755375551130-cf278d391d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=640"
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
            <p className="t-caption mb-4" style={{ color: 'rgba(34,30,27,.4)' }}>On this page</p>
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
              Questions about any of this? Write to{' '}
              <a href="mailto:hello@notbyaccident.com" className="link-beetroot">hello@notbyaccident.com</a>, or read our{' '}
              <Link to="/cookies" className="link-beetroot">cookie notice</Link>.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
