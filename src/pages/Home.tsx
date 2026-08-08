import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  projects,
  capabilities,
  pillars,
} from '@/data'
import { useNotes, useHero, useTestimonials, useCompany, useHomepage, useClients, usePartners } from '@/content'
import Seo from '@/components/Seo'
import nbaSymbol from '@/imports/NBA_Symbol_Ink_RGB.png'

function useReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return
    const els = ref.current.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries =>
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view')
            observer.unobserve(e.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [ref])
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  useReveal(mainRef)
  const company = useCompany()

  const homeSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: company.name,
      url: 'https://notbyaccident.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://notbyaccident.com/search?q={query}',
        'query-input': 'required name=query',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Capabilities',
      itemListElement: capabilities.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        url: `https://notbyaccident.com/capabilities/${c.slug}`,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What does Not by Accident do?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Not by Accident is an independent creative company in Amsterdam working across brand strategy, identity, digital products and demand generation. We make companies wanted, so that growth becomes easier to earn.',
          },
        },
        {
          '@type': 'Question',
          name: 'What services does Not by Accident offer?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Our capabilities span four areas — Position (${capabilities
              .filter(c => c.pillar === 'Position')
              .map(c => c.name)
              .join(', ')}), Identity (${capabilities
              .filter(c => c.pillar === 'Identity')
              .map(c => c.name)
              .join(', ')}), Product (${capabilities
              .filter(c => c.pillar === 'Product')
              .map(c => c.name)
              .join(', ')}) and Demand (${capabilities
              .filter(c => c.pillar === 'Demand')
              .map(c => c.name)
              .join(', ')}).`,
          },
        },
      ],
    },
  ]

  return (
    <main id="main" ref={mainRef}>
      <Seo
        title="Independent creative company, Amsterdam"
        path="/"
        jsonLd={homeSchema}
      />
      <Hero />
      <FeaturedWork />
      <ClientsSlider />
      <CapabilitiesIndex />
      <Testimonials />
      <Journal />
      <FinalCta />
    </main>
  )
}

/* ─── Hero ─────────────────────────────────────────────────────────────────
   Commercially clear in 30 seconds: what we are, what we do, and the work —
   without oversized empty type. Statement sits on Milk (compliant), a real
   image anchors it, and a definition line answers the AI-search question. */
function Hero() {
  const hero = useHero()
  const heroWords = hero.words.length ? hero.words : ['wanted']
  const [wordIdx, setWordIdx] = useState(0)
  const word = heroWords[wordIdx % heroWords.length]

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % heroWords.length), 4200)
    return () => clearInterval(id)
  }, [heroWords.length])

  return (
    <section
      aria-label="Not by Accident — independent creative company"
      style={{ backgroundColor: '#F0EADA', paddingTop: '56px' }}
    >
      <div className="page-grid" style={{ paddingTop: 'clamp(32px, 5vw, 72px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center' }}
        >
          {/* The argument */}
          <div>
            <img
              src={nbaSymbol}
              alt="Not by Accident brand symbol"
              width={56}
              height={56}
              style={{ width: '56px', height: 'auto', marginBottom: '1.5rem', display: 'block' }}
            />
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '1.5rem' }}>
              Independent creative company · Amsterdam · Est. 2019
            </p>
            <h1
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(40px, 6vw, 88px)',
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                color: '#221E1B',
                margin: 0,
                maxWidth: '13ch',
              }}
            >
              We make companies{' '}
              <em
                key={word}
                style={{ fontStyle: 'italic', color: '#6E2237', animation: 'testimonial-in 400ms var(--ease-brand)', display: 'inline-block' }}
              >
                {word}
              </em>
              .
            </h1>
            <p
              className="t-subhead"
              style={{ marginTop: '1.25rem', maxWidth: '30ch', color: 'rgba(34,30,27,.75)' }}
            >
              {hero.subhead}
            </p>

            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: '2rem' }}>
              <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none' }}>
                Start a project
              </Link>
              <Link to="/work" className="btn-ghost" style={{ textDecoration: 'none' }}>
                See the work
              </Link>
            </div>

            {/* Definition line — the 30-second answer, also feeds AI search */}
            <p
              className="t-body"
              style={{ marginTop: '2.5rem', color: 'rgba(34,30,27,.62)', maxWidth: '48ch', fontSize: '15px' }}
            >
              {hero.definition}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Clients & partners slider ────────────────────────────────────────────
   Two continuous marquee rows of typographic wordmarks — customers on top,
   partners beneath, drifting in opposite directions. Pauses on hover. */
function wordmark(style: string): React.CSSProperties {
  switch (style) {
    case 'serif': return { fontFamily: 'Lora, Georgia, serif', fontWeight: 400 }
    case 'sans-tight': return { fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 600, letterSpacing: '-0.03em' }
    case 'sans-wide': return { fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 500, letterSpacing: '0.22em' }
    case 'mono': return { fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontWeight: 500, letterSpacing: '0.02em' }
    case 'italic': return { fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontWeight: 400 }
    case 'black': return { fontFamily: 'DM Sans, system-ui, sans-serif', fontWeight: 800, letterSpacing: '-0.01em' }
    default: return {}
  }
}

function ClientsSlider() {
  const clientLogos = useClients()
  const partnerLogos = usePartners()
  const rows = [
    { label: 'Selected clients', items: clientLogos, reverse: false },
    { label: 'Partners & collaborators', items: partnerLogos, reverse: true },
  ]
  return (
    <section
      aria-label="Clients and partners"
      style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(48px, 6vw, 88px)', paddingBottom: 'clamp(48px, 6vw, 88px)', borderTop: '1px solid rgba(34,30,27,.12)' }}
    >
      <div className="page-grid">
        <p className="t-caption reveal" style={{ color: 'rgba(34,30,27,.45)', marginBottom: 'clamp(28px, 3vw, 44px)' }}>
          The companies and studios we work with
        </p>
      </div>
      <div className="flex flex-col" style={{ gap: 'clamp(20px, 2.5vw, 36px)' }}>
        {rows.map(row => (
          <div key={row.label}>
            <div className="page-grid">
              <p className="t-caption" style={{ color: '#6E2237', marginBottom: '14px', textTransform: 'none', letterSpacing: '0.04em' }}>{row.label}</p>
            </div>
            <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)' }}>
              <div className="marquee-track" style={row.reverse ? { animationDirection: 'reverse' } : undefined}>
                {[...row.items, ...row.items].map((l, i) => (
                  <span
                    key={i}
                    aria-hidden={i >= row.items.length}
                    style={{
                      flexShrink: 0,
                      padding: '0 clamp(24px, 3vw, 52px)',
                      fontSize: 'clamp(20px, 2.4vw, 34px)',
                      lineHeight: 1,
                      color: 'rgba(34,30,27,.6)',
                      ...wordmark(l.style),
                    }}
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Featured Work ────────────────────────────────────────────────────────
   Image-led, asymmetric, exploratory. On Ink so the work carries the screen. */
function FeaturedWork() {
  const tiles = projects.slice(0, 3)
  const hp = useHomepage()

  return (
    <section
      aria-label="Featured work"
      style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(56px, 7vw, 96px)', paddingBottom: 'clamp(56px, 7vw, 96px)' }}
    >
      <div className="page-grid">
        <div className="flex items-end justify-between mb-8 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: '#E9C558', marginBottom: '10px' }}>{hp.featuredEyebrow}</p>
            <h2 className="t-headline-lg" style={{ color: '#F0EADA', maxWidth: '16ch' }}>
              {hp.featuredHeading}
            </h2>
          </div>
          <Link to="/work" className="t-ui link-grow" style={{ color: '#F0EADA' }}>
            Explore all work →
          </Link>
        </div>

        {/* Three works — even grid, no empty spot */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {tiles.map((p, i) => (
            <Link
              key={p.id}
              to={`/case-studies/${p.slug}`}
              className="work-tile no-underline bg-carbon reveal"
              style={{ aspectRatio: '4/5', transitionDelay: `${i * 60}ms` }}
              aria-label={`${p.name} — ${p.discipline}. ${p.brief}`}
            >
              <img src={p.img} alt={`${p.name} case study — ${p.brief}`} loading="lazy" />
              <div
                className="work-tile-meta absolute inset-0 flex flex-col justify-end p-4"
                style={{ background: 'linear-gradient(to top, rgba(34,30,27,.72), transparent 58%)' }}
              >
                <h3 className="m-0" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(18px, 1.5vw, 24px)', color: '#F0EADA', lineHeight: 1.05 }}>
                  {p.name}
                </h3>
                <p className="t-caption m-0" style={{ color: 'rgba(240,234,218,.6)', marginTop: '4px', textTransform: 'none', letterSpacing: '0.01em' }}>
                  {p.discipline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Capabilities Index ───────────────────────────────────────────────────
   Four movements, every service shown and linked to its own landing page. */
function CapabilitiesIndex() {
  const hp = useHomepage()
  return (
    <section
      aria-label="Capabilities"
      style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}
    >
      <div className="page-grid">
        <div className="flex items-end justify-between mb-12 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '12px' }}>What we do</p>
            <h2 className="t-headline-lg" style={{ maxWidth: '18ch' }}>
              {hp.capabilitiesHeading}
            </h2>
          </div>
          <p className="t-body" style={{ color: 'rgba(34,30,27,.6)', maxWidth: '34ch', fontSize: '15px' }}>
            We move a company through four stages — Position, Identity, Product and Demand. Each has a dedicated
            team, method and page.
          </p>
        </div>

        {/* Compact: four pillars as cards, each capability a linked chip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, pi) => {
            const items = capabilities.filter(c => c.pillar === pillar.key)
            return (
              <div
                key={pillar.key}
                className="reveal"
                style={{
                  paddingTop: '22px',
                  borderTop: '2px solid #221E1B',
                  transitionDelay: `${(pi % 2) * 70}ms`,
                }}
              >
                <div className="flex items-baseline gap-3" style={{ marginBottom: '4px' }}>
                  <span className="t-caption" style={{ color: '#6E2237' }}>0{pi + 1}</span>
                  <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(22px, 2.4vw, 30px)', color: '#221E1B' }}>
                    {pillar.label}
                  </span>
                </div>
                <p className="t-caption" style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.01em', maxWidth: '30ch', marginBottom: '16px' }}>
                  {pillar.blurb}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map(cap => (
                    <Link key={cap.slug} to={`/capabilities/${cap.slug}`} className="cap-chip">
                      {cap.name}
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <Link
          to="/capabilities"
          className="reveal no-underline group"
          style={{
            marginTop: 'clamp(40px, 4vw, 56px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            borderTop: '2px solid #221E1B',
            paddingTop: '20px',
          }}
        >
          <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(20px, 2.4vw, 32px)', color: '#221E1B', lineHeight: 1 }}>
            See all eighteen capabilities
          </span>
          <span
            aria-hidden="true"
            className="shrink-0 inline-flex items-center justify-center group-hover:translate-x-1"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '100px',
              backgroundColor: '#221E1B',
              color: '#F0EADA',
              fontSize: '18px',
              transition: 'transform 260ms var(--ease-brand)',
            }}
          >
            →
          </span>
        </Link>
      </div>
    </section>
  )
}

/* ─── Testimonials ─────────────────────────────────────────────────────────
   Editorial quotations on Beetroot with a picture. No brand-name list. */
function Testimonials() {
  const testimonials = useTestimonials()
  const [active, setActive] = useState(0)

  // Slow, quiet auto-rotation through the quotes.
  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => setActive(a => (a + 1) % testimonials.length), 8000)
    return () => clearInterval(id)
  }, [testimonials.length])

  const t = testimonials[active % testimonials.length]
  if (!t) return null

  return (
    <section aria-label="Client testimonials" style={{ backgroundColor: '#6E2237', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
      <div className="page-grid">
        <p className="t-caption mb-10 reveal" style={{ color: 'rgba(240,234,218,.5)' }}>In their words</p>
        <div>
          {/* Rotating quote — full width, no picture */}
          <blockquote className="m-0 p-0 reveal reveal-delay-1">
            <p
              key={active}
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(24px, 3.2vw, 44px)',
                fontWeight: 400,
                lineHeight: 1.16,
                letterSpacing: '-0.015em',
                color: '#F0EADA',
                margin: 0,
                maxWidth: '24ch',
                animation: 'testimonial-in 400ms var(--ease-brand)',
              }}
            >
              <span aria-hidden="true" style={{ opacity: 0.4 }}>“</span>
              {t.quote}
              <span aria-hidden="true" style={{ opacity: 0.4 }}>”</span>
            </p>
            <footer className="mt-8 flex items-baseline gap-3">
              <cite className="t-ui" style={{ color: '#F0EADA', fontStyle: 'normal' }}>{t.name}</cite>
              <span className="t-caption" style={{ color: 'rgba(240,234,218,.55)' }}>{t.role}</span>
            </footer>

            {/* Dot navigation — no brand names */}
            {testimonials.length > 1 && (
              <div className="flex gap-2" style={{ marginTop: '2rem' }}>
                {testimonials.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Show quote from ${item.name}`}
                    aria-pressed={i === active}
                    style={{
                      width: i === active ? '28px' : '10px',
                      height: '10px',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: i === active ? '#E9C558' : 'rgba(240,234,218,.35)',
                      transition: 'width 220ms var(--ease-brand), background-color 220ms var(--ease-brand)',
                    }}
                  />
                ))}
              </div>
            )}
          </blockquote>
        </div>
      </div>
    </section>
  )
}

/* ─── Journal / Notes ──────────────────────────────────────────────────────
   Magazine layout: one feature, a text-led list, and editorial cards. */
function Journal() {
  const notes = useNotes()
  const hp = useHomepage()
  const [feature, second, third, fourth, fifth] = notes

  if (!feature) return null

  return (
    <section aria-label="Journal" style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)', borderTop: '1px solid rgba(34,30,27,.12)' }}>
      <div className="page-grid">
        <div className="flex items-end justify-between mb-10 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '10px' }}>The Journal — essays & notes</p>
            <h2 className="t-headline-lg" style={{ maxWidth: '16ch' }}>{hp.journalHeading}</h2>
          </div>
          <Link to="/notes" className="t-ui link-grow" style={{ color: '#221E1B' }}>Read the Journal →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16">
          {/* Feature */}
          <article className="reveal">
            <Link to={`/notes/${feature.slug}`} className="work-tile no-underline bg-carbon img-crosshair block" style={{ aspectRatio: '3/2' }}>
              {feature.img && <img src={feature.img} alt={feature.title} loading="lazy" />}
            </Link>
            <p className="t-caption" style={{ color: '#6E2237', marginTop: '16px' }}>
              {feature.category} · {feature.readTime} read · {feature.date}
            </p>
            <h3 className="m-0" style={{ marginTop: '10px' }}>
              <Link to={`/notes/${feature.slug}`} className="link-grow" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(26px, 2.8vw, 40px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.015em', color: '#221E1B' }}>
                {feature.title}
              </Link>
            </h3>
            <p className="t-body" style={{ color: 'rgba(34,30,27,.65)', marginTop: '12px', maxWidth: '52ch' }}>{feature.subtitle}</p>
          </article>

          {/* Right column: text-led list + card */}
          <div className="flex flex-col">
            <ul className="list-none m-0 p-0">
              {[second, third, fifth].filter(Boolean).map((n, i) => (
                <li key={n.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <Link to={`/notes/${n.slug}`} className="no-underline block group" style={{ padding: '20px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
                    <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '8px' }}>{n.category} · {n.date}</p>
                    <p className="m-0 group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(19px, 1.8vw, 24px)', lineHeight: 1.12, color: '#221E1B', textDecorationColor: '#6E2237', textDecorationThickness: '1px' }}>
                      {n.title}
                    </p>
                    <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.55)', fontSize: '14px', marginTop: '6px', maxWidth: '46ch' }}>{n.subtitle}</p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Editorial card with small image — different ratio */}
            {fourth && (
              <Link to={`/notes/${fourth.slug}`} className="no-underline group reveal flex gap-4 items-center" style={{ padding: '20px 0', borderTop: '1px solid rgba(34,30,27,.14)', borderBottom: '1px solid rgba(34,30,27,.14)', marginTop: 'auto' }}>
                <div className="work-tile bg-carbon shrink-0" style={{ width: '96px', aspectRatio: '1/1' }}>
                  {fourth.img && <img src={fourth.img} alt={fourth.title} loading="lazy" />}
                </div>
                <div>
                  <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '6px' }}>{fourth.category}</p>
                  <p className="m-0 group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '19px', lineHeight: 1.1, color: '#221E1B', textDecorationColor: '#6E2237', textDecorationThickness: '1px' }}>
                    {fourth.title}
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ────────────────────────────────────────────────────────────
   Confident, human close on Ink with a clear commercial next step. */
function FinalCta() {
  const company = useCompany()
  const hp = useHomepage()
  return (
    <section aria-label="Work with us" style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(72px, 9vw, 140px)', paddingBottom: 'clamp(72px, 9vw, 140px)' }}>
      <div className="page-grid">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div className="reveal md:order-2">
            <p className="t-caption" style={{ color: '#E9C558', marginBottom: '1.5rem' }}>Start something</p>
            <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(32px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em', color: '#F0EADA', margin: 0, maxWidth: '15ch' }}>
              {hp.ctaHeading}
            </h2>
          </div>
          <div className="reveal reveal-delay-1 md:order-1">
            <p className="t-body" style={{ color: 'rgba(240,234,218,.72)', maxWidth: '40ch' }}>
              {hp.ctaBody}
            </p>
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: '1.75rem' }}>
              <Link to="/contact" className="btn-milk" style={{ textDecoration: 'none' }}>Start a project</Link>
              <a href={`mailto:${company.newBusinessEmail}`} className="t-ui link-grow" style={{ color: '#F0EADA' }}>
                {company.newBusinessEmail} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
