import { useEffect, useRef, useState } from 'react'
import Seo from '@/components/Seo'
import { submitLead, useTeam } from '@/content'

function AboutSignup() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (sent) {
    return (
      <p className="t-subhead reveal" style={{ color: '#6E2237', margin: 0 }}>
        Thank you — we’ll be in touch.
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
          setError(res.error ?? 'Something went wrong — please try again.')
          return
        }
        setSent(true)
      }}
      className="flex flex-col sm:flex-row gap-3 reveal reveal-delay-1"
      style={{ maxWidth: '440px', width: '100%' }}
    >
      <label htmlFor="about-email" className="sr-only">Email address</label>
      <input
        id="about-email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Leave your email"
        className="input-field"
        autoComplete="email"
      />
      <button type="submit" className="btn-primary shrink-0">Send</button>
      {error && (
        <p className="t-caption" style={{ color: '#6E2237', width: '100%' }}>{error}</p>
      )}
    </form>
  )
}

export default function About() {
  const ref = useRef<HTMLElement>(null)
  const team = useTeam()

  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); observer.unobserve(e.target) }
      }),
      { threshold: 0.06 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title="Studio" description="Not by Accident is an independent creative company in Amsterdam. Small on purpose, senior in the room, commercial by instinct — brand and demand thinking in one team." path="/studio" />

      {/* Opening — large statement */}
      <div
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-8 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>Studio</p>
          <h1
            className="t-display reveal reveal-delay-1"
            style={{
              maxWidth: '16ch',
              marginBottom: 'clamp(32px, 4vw, 64px)',
            }}
          >
            We make companies wanted.
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
              Growth is what happens next. Wanted, on purpose.
            </p>
            <p
              className="t-body reveal reveal-delay-3"
              style={{ color: 'rgba(34,30,27,.65)' }}
            >
              Not by Accident is an independent creative company working across brand, product and demand. Brand thinking and commercial thinking do not sit in separate rooms.
            </p>
          </div>
        </div>
      </div>

      {/* Small editorial image, left-aligned */}
      <div className="page-grid" style={{ paddingTop: 'clamp(40px, 5vw, 72px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        <figure className="reveal m-0" style={{ maxWidth: '360px' }}>
          <div className="work-tile img-crosshair" style={{ overflow: 'hidden', width: '100%', aspectRatio: '4/5', backgroundColor: '#3a3530' }}>
            <img
              src="https://images.unsplash.com/photo-1649414744605-3bfa4f1870fc?w=720&h=900&fit=crop&auto=format"
              alt="A crowd gathered at a technology conference in Amsterdam"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <figcaption className="t-caption" style={{ color: 'rgba(34,30,27,.35)', marginTop: '12px' }}>
            Amsterdam, August 2026. A few minutes from TNW.
          </figcaption>
        </figure>
      </div>

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
            How we think
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'clamp(32px, 4vw, 48px)',
            }}
            className="sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                name: 'Specific',
                body: 'Name the material, the month, the number, the street. A range of possibilities is not a description. It is an avoidance of one.',
              },
              {
                name: 'Decided',
                body: 'Present decisions as decisions. Two routes, never three. The recommendation comes first, not last. We are paid to have a view.',
              },
              {
                name: 'Warm, not soft',
                body: 'People, hands, imperfection and humour. The work stays sharp. Warmth and rigour are not in tension. Softness is just politeness at the cost of truth.',
              },
              {
                name: 'Culturally awake',
                body: 'References from outside design, credited always and never explained. We do not borrow from culture without knowing where we borrowed from.',
              },
              {
                name: 'Quietly funny',
                body: 'One human moment per communication. In the last line, never the headline. Funny because it is true, not because it is trying.',
              },
              {
                name: 'Commercially literate',
                body: 'Every soft attribute shows up one step downstream as a hard number. We do not separate aesthetic decisions from commercial ones.',
              },
            ].map((p, i) => (
              <div
                key={p.name}
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
                  {p.name}
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
              The people
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
            The culture
          </p>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-16 gap-y-10">
            <p className="t-headline reveal" style={{ color: '#F0EADA', maxWidth: '18ch' }}>
              Small on purpose. Senior in the room. Commercial by instinct.
            </p>
            <div className="reveal reveal-delay-1">
              {[
                { h: 'One room', b: 'Strategy, design and demand sit together from day one — no relay races, no telephone game between departments.' },
                { h: 'Senior hands', b: 'The people who win the work do the work. We stay small so the standard never gets diluted downstream.' },
                { h: 'Commercial first', b: 'Every decision traces back to a number a client can actually move. Beauty is the method, not the goal.' },
              ].map((c, i) => (
                <div key={c.h} style={{ padding: '18px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(240,234,218,.16)' }}>
                  <h3 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '21px', fontWeight: 400, color: '#F0EADA', margin: '0 0 6px' }}>{c.h}</h3>
                  <p className="t-body m-0" style={{ color: 'rgba(240,234,218,.6)', fontSize: '15px', maxWidth: '46ch' }}>{c.b}</p>
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
            If you would like to work with us, leave your email.
          </h2>
          <AboutSignup />
        </div>
      </div>
    </main>
  )
}
