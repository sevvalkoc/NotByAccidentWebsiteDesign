import { useEffect, useRef, useState } from 'react'
import Link from '@/components/LocalizedLink'
import {
  useNotes,
  useHero,
  useTestimonials,
  useCompany,
  useHomepage,
  useHomeSections,
  useClients,
  usePartners,
  useProjects,
  useCapabilities,
  useCategories,
  useCustomSections,
} from '@/content'
import Seo from '@/components/Seo'
import LogoMarquee from '@/components/LogoMarquee'
import CustomSectionBlock from '@/components/CustomSectionBlock'
import nbaSymbol from '@/imports/NBA_Symbol_Ink_RGB.png'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'

/* Default section order: Hero → Capabilities → Testimonials → Clients →
   Partners → Notes → Case Studies → Final CTA (+ Footer, rendered by
   App.tsx). Reorderable/hideable from Admin → Pages — see useHomeSections()
   and SECTION_COMPONENTS below; no project index sits before or between
   these regardless of order. */
const SECTION_COMPONENTS: Record<string, () => React.JSX.Element | null> = {
  hero: Hero,
  capabilities: CapabilitiesIndex,
  testimonials: Testimonials,
  clients: ClientsSlider,
  partners: PartnersSlider,
  notes: Notes,
  case_studies: CaseStudiesTeaser,
  final_cta: FinalCta,
}

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  useReveal(mainRef)
  const company = useCompany()
  const capabilities = useCapabilities()
  const categories = useCategories()
  const customSections = useCustomSections('home')
  const sectionOrder = useHomeSections()
  const t = useT()
  const seo = usePageSeo('/')

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
      name: t.home.itemListName,
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
          name: t.home.faqQuestion,
          acceptedAnswer: {
            '@type': 'Answer',
            text: t.home.faqAnswer,
          },
        },
        {
          '@type': 'Question',
          name: t.home.faqServicesQuestion,
          acceptedAnswer: {
            '@type': 'Answer',
            text: t.home.faqServicesAnswer(
              categories
                .map(cat => `${cat.label} (${capabilities.filter(c => c.category === cat.key).map(c => c.name).join(', ')})`)
                .join('; ')
            ),
          },
        },
      ],
    },
  ]

  return (
    <main id="main" ref={mainRef}>
      <Seo
        title={seo.title}
        path="/"
        jsonLd={homeSchema}
      />
      {sectionOrder.map(key => {
        const Section = SECTION_COMPONENTS[key]
        if (Section) return <Section key={key} />
        const custom = customSections.find(c => c.key === key)
        return custom ? <CustomSectionBlock key={key} section={custom} /> : null
      })}
    </main>
  )
}

/* ─── 01 · Hero ────────────────────────────────────────────────────────────
   The commercial argument and a real photograph in the same breath — a
   colour tab stands in for decoration, not a giant block of it. */
function Hero() {
  const hero = useHero()
  const t = useT()
  const heroWords = hero.words.length ? hero.words : ['wanted']
  const [wordIdx, setWordIdx] = useState(0)
  const word = heroWords[wordIdx % heroWords.length]

  useEffect(() => {
    const id = setInterval(() => setWordIdx(i => (i + 1) % heroWords.length), 4200)
    return () => clearInterval(id)
  }, [heroWords.length])

  return (
    <section
      aria-label={t.home.heroAriaLabel}
      style={{ backgroundColor: '#F0EADA', paddingTop: '56px' }}
    >
      <div className="page-grid" style={{ paddingTop: 'clamp(28px, 4vw, 56px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <div
          style={{ gap: 'clamp(40px, 5vw, 64px)', alignItems: 'start' }}
          className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]"
        >
          {/* The argument */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <img
              src={nbaSymbol}
              alt={t.home.heroSymbolAlt}
              width={44}
              height={44}
              style={{ width: '40px', height: 'auto', marginBottom: '1.5rem', display: 'block' }}
            />
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '1.25rem' }}>
              {t.home.heroEyebrow}
            </p>
            <h1
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(42px, 6.4vw, 92px)',
                fontWeight: 400,
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                color: '#221E1B',
                margin: 0,
                maxWidth: '13ch',
              }}
            >
              {t.home.heroPrefix}
              <em
                key={word}
                style={{ fontStyle: 'italic', color: '#6E2237', animation: 'testimonial-in 400ms var(--ease-brand)', display: 'inline-block' }}
              >
                {word}
              </em>
              .
            </h1>
            <p className="t-subhead" style={{ marginTop: '1.25rem', maxWidth: '32ch', color: 'rgba(34,30,27,.75)' }}>
              {hero.subhead}
            </p>

            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: '2rem' }}>
              {hero.buttons.map((b, i) => (
                <Link key={b.label} to={b.url} className={i === 0 ? 'btn-primary' : 'btn-ghost'} style={{ textDecoration: 'none' }}>
                  {b.label}
                </Link>
              ))}
            </div>

            {/* Definition line — the 30-second answer, also feeds AI search */}
            <p className="t-body" style={{ marginTop: 'auto', paddingTop: '2.5rem', color: 'rgba(34,30,27,.62)', maxWidth: '48ch', fontSize: '15px' }}>
              {hero.definition}
            </p>
          </div>

          {/* A real photograph — colour behaves like a tab, not a block */}
          <div
            className="reveal"
            style={{
              position: 'relative',
              transform: `translate(${hero.imageOffsetX}px, ${hero.imageOffsetY}px)`,
            }}
          >
            <div
              aria-hidden="true"
              style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '6px', backgroundColor: '#7F8B3E', zIndex: 1 }}
            />
            <div
              className="work-tile img-crosshair"
              style={{ width: '100%', aspectRatio: '4 / 5', maxHeight: 'clamp(360px, 44vw, 560px)', overflow: 'hidden', backgroundColor: '#3a3530' }}
            >
              <img
                src={hero.image}
                alt={t.home.heroPhotoAlt}
                loading="eager"
                fetchPriority="high"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <p
              className="t-caption"
              style={{
                position: 'absolute', bottom: '16px', left: '22px', right: '16px',
                color: '#F0EADA', textTransform: 'none', letterSpacing: '0.01em',
                textShadow: '0 1px 6px rgba(34,30,27,.6)',
              }}
            >
              {t.home.heroCaption}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 02 · Capabilities ────────────────────────────────────────────────────
   Five groups, colour-coded by a tab rather than an icon, with every
   capability linked to its own SEO landing page. Editorial index, not a
   grid of cards. */
function CapabilitiesIndex() {
  const hp = useHomepage()
  const capabilities = useCapabilities()
  const categories = useCategories()
  const t = useT()
  const [openCat, setOpenCat] = useState<string>(categories[0].key)

  return (
    <section
      aria-label={t.home.capabilitiesAriaLabel}
      style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)', borderTop: '1px solid rgba(34,30,27,.12)' }}
    >
      <div className="page-grid">
        <div className="flex items-end justify-between mb-10 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '12px' }}>{hp.capabilitiesEyebrow}</p>
            <h2 className="t-headline-lg" style={{ maxWidth: '18ch' }}>
              {hp.capabilitiesHeading}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {hp.capabilitiesImage && (
              <div
                className="work-tile img-crosshair shrink-0"
                style={{ width: '64px', height: '64px', overflow: 'hidden', backgroundColor: '#3a3530' }}
              >
                <img src={hp.capabilitiesImage} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p className="t-body" style={{ color: 'rgba(34,30,27,.6)', maxWidth: '34ch', fontSize: '15px' }}>
              {t.home.capabilitiesIntro(capabilities.length)}
            </p>
          </div>
        </div>

        {/* Category tabs — colour-coded, not iconography */}
        <div className="flex flex-wrap gap-2 reveal" style={{ marginBottom: 'clamp(24px, 3vw, 40px)' }}>
          {categories.map(cat => {
            const active = openCat === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setOpenCat(cat.key)}
                aria-pressed={active}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '9px',
                  padding: '9px 16px 9px 12px',
                  border: `1px solid ${active ? cat.accent : 'rgba(34,30,27,.18)'}`,
                  borderRadius: '100px',
                  backgroundColor: active ? cat.accent : 'transparent',
                  color: active ? '#F0EADA' : '#221E1B',
                  fontFamily: 'DM Sans, sans-serif', fontSize: '14px', fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 180ms var(--ease-brand), color 180ms var(--ease-brand), border-color 180ms var(--ease-brand)',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ width: '8px', height: '8px', borderRadius: '100px', backgroundColor: active ? '#F0EADA' : cat.accent, flex: 'none' }}
                />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Active category: blurb + full index of its capabilities */}
        {categories.map(cat => {
          if (cat.key !== openCat) return null
          const items = capabilities.filter(c => c.category === cat.key)
          return (
            <div key={cat.key} style={{ borderTop: `2px solid ${cat.accent}`, paddingTop: '20px' }}>
              <p className="t-body" style={{ color: 'rgba(34,30,27,.55)', maxWidth: '46ch', marginBottom: '4px' }}>{cat.blurb}</p>
              <div>
                {items.map(c => (
                  <Link key={c.slug} to={`/capabilities/${c.slug}`} className="cap-row" style={{ gridTemplateColumns: '1fr auto', padding: '18px 12px', margin: '0 -12px' }}>
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,260px)_1fr] gap-x-8 gap-y-1 items-baseline">
                      <p className="m-0" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(19px, 1.8vw, 24px)', lineHeight: 1.1 }}>
                        {c.name}
                      </p>
                      <p className="cap-muted m-0" style={{ fontSize: '15px', color: 'rgba(34,30,27,.6)', maxWidth: '58ch' }}>
                        {c.summary}
                      </p>
                    </div>
                    <span className="cap-arrow t-ui self-center" style={{ paddingLeft: '1rem' }}>→</span>
                  </Link>
                ))}
                <div style={{ borderTop: '1px solid rgba(34,30,27,.14)' }} />
              </div>
            </div>
          )
        })}

        <Link
          to="/capabilities"
          className="reveal no-underline group"
          style={{
            marginTop: 'clamp(32px, 4vw, 48px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(20px, 2.4vw, 32px)', color: '#221E1B', lineHeight: 1 }}>
            {t.home.seeAllCapabilities(capabilities.length)}
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

/* ─── 03 · Testimonials ────────────────────────────────────────────────────
   Editorial quotations on Beetroot. Quote, name, role, company — nothing
   else. No logo wall underneath. */
function Testimonials() {
  const testimonials = useTestimonials()
  const ui = useT()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => setActive(a => (a + 1) % testimonials.length), 8000)
    return () => clearInterval(id)
  }, [testimonials.length])

  const t = testimonials[active % testimonials.length]
  if (!t) return null

  return (
    <section aria-label={ui.home.testimonialsAriaLabel} style={{ backgroundColor: '#6E2237', paddingTop: 'clamp(32px, 4vw, 56px)', paddingBottom: 'clamp(32px, 4vw, 56px)' }}>
      <div className="page-grid">
        <p className="t-caption mb-10 reveal" style={{ color: 'rgba(240,234,218,.5)' }}>{ui.home.testimonialsEyebrow}</p>
        <div>
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
                maxWidth: '100%',
                animation: 'testimonial-in 400ms var(--ease-brand)',
              }}
            >
              <span aria-hidden="true" style={{ opacity: 0.4 }}>“</span>
              {t.quote}
              <span aria-hidden="true" style={{ opacity: 0.4 }}>”</span>
            </p>
            <footer className="mt-8 flex items-baseline gap-3 flex-wrap">
              <cite className="t-ui" style={{ color: '#F0EADA', fontStyle: 'normal' }}>{t.name}</cite>
              <span className="t-caption" style={{ color: 'rgba(240,234,218,.55)' }}>{t.role}, {t.company}</span>
            </footer>

            {testimonials.length > 1 && (
              <div className="flex gap-2" style={{ marginTop: '2rem' }}>
                {testimonials.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={ui.home.showQuoteFrom(item.name)}
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

/* ─── 04 · Partners ────────────────────────────────────────────────────────
   Dedicated, visual-only, slow continuous slider. No cards, no arrows. */
function PartnersSlider() {
  const partnerLogos = usePartners()
  const t = useT()
  return (
    <section aria-label={t.home.partnersAriaLabel} style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
      <div className="page-grid">
        <p className="t-caption reveal" style={{ color: 'rgba(34,30,27,.4)', marginBottom: '20px' }}>{t.home.partnersEyebrow}</p>
      </div>
      <LogoMarquee items={partnerLogos} label={t.home.partnersLabel} speed={64} />
    </section>
  )
}

/* ─── 05 · Notes ───────────────────────────────────────────────────────────
   Magazine layout: one feature, a text-led card on Carbon, and a compact
   list — deliberately smaller than the case studies below it. */
function Notes() {
  const notes = useNotes()
  const hp = useHomepage()
  const t = useT()
  const [feature, second, third, fourth] = notes

  if (!feature) return null

  return (
    <section aria-label={t.home.notesAriaLabel} style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)', borderTop: '1px solid rgba(34,30,27,.12)' }}>
      <div className="page-grid">
        <div className="flex items-end justify-between mb-10 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '10px' }}>{hp.notesEyebrow}</p>
            <h2 className="t-headline-lg" style={{ maxWidth: '16ch' }}>{hp.journalHeading}</h2>
          </div>
          <Link to="/notes" className="t-ui link-grow" style={{ color: '#221E1B' }}>{t.home.readNotes}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16">
          {/* Feature — image-led */}
          <article className="reveal">
            <Link to={`/notes/${feature.slug}`} className="work-tile no-underline bg-carbon img-crosshair block" style={{ aspectRatio: '3/2' }}>
              {feature.img && <img src={feature.img} alt={feature.title} loading="lazy" />}
            </Link>
            <p className="t-caption" style={{ color: '#6E2237', marginTop: '16px' }}>
              {feature.category} · {feature.readTime}{t.home.readSuffix} · {feature.date}
            </p>
            <h3 className="m-0" style={{ marginTop: '10px' }}>
              <Link to={`/notes/${feature.slug}`} className="link-grow" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, lineHeight: 1.06, letterSpacing: '-0.015em', color: '#221E1B' }}>
                {feature.title}
              </Link>
            </h3>
            <p className="t-body" style={{ color: 'rgba(34,30,27,.65)', marginTop: '12px', maxWidth: '52ch' }}>{feature.subtitle}</p>
          </article>

          {/* Right column: text-led card on Carbon + compact index */}
          <div className="flex flex-col gap-6">
            {second && (
              <Link to={`/notes/${second.slug}`} className="no-underline reveal reveal-delay-1 block" style={{ backgroundColor: '#6A6383', color: '#F0EADA', padding: 'clamp(22px, 2.6vw, 32px)' }}>
                <p className="t-caption" style={{ color: 'rgba(240,234,218,.7)', marginBottom: '0.75rem' }}>{second.category} · {second.readTime}{t.home.readSuffix}</p>
                <p className="m-0" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(20px, 2.2vw, 27px)', fontWeight: 400, lineHeight: 1.1, color: '#F0EADA' }}>
                  {second.title}
                </p>
                <p className="t-caption" style={{ color: 'rgba(240,234,218,.55)', marginTop: '1rem' }}>{t.home.readEssay}</p>
              </Link>
            )}

            <ul className="list-none m-0 p-0">
              {[third, fourth].filter(Boolean).map((n, i) => (
                <li key={n.id} className="reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                  <Link to={`/notes/${n.slug}`} className="no-underline block group" style={{ padding: '18px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
                    <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '8px' }}>{n.category} · {n.date}</p>
                    <p className="m-0 group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(18px, 1.7vw, 22px)', lineHeight: 1.14, color: '#221E1B', textDecorationColor: '#6E2237', textDecorationThickness: '1px' }}>
                      {n.title}
                    </p>
                  </Link>
                </li>
              ))}
              <div style={{ borderTop: '1px solid rgba(34,30,27,.14)' }} />
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 06 · Clients ─────────────────────────────────────────────────────────
   A second, separate slider — understated, real logos only. */
function ClientsSlider() {
  const clientLogos = useClients()
  const t = useT()
  return (
    <section aria-label={t.home.clientsAriaLabel} style={{ backgroundColor: '#F0EADA', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)', borderTop: '1px solid rgba(34,30,27,.12)' }}>
      <div className="page-grid">
        <p className="t-caption reveal" style={{ color: 'rgba(34,30,27,.4)', marginBottom: '20px' }}>{t.home.clientsEyebrow}</p>
      </div>
      <LogoMarquee items={clientLogos} label={t.home.clientsLabel} reverse speed={70} />
    </section>
  )
}

/* ─── 07 · Case Studies ────────────────────────────────────────────────────
   Image-led, dynamic — the commercial thinking, not just the finish. Each
   tile states the problem the work solved, not just its name. */
function CaseStudiesTeaser() {
  const hp = useHomepage()
  const projects = useProjects()
  const t = useT()
  const tiles = projects.filter(p => p.narrative).slice(0, 3)

  return (
    <section aria-label={t.home.caseStudiesAriaLabel} style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(56px, 7vw, 104px)' }}>
      <div className="page-grid">
        <div className="flex items-end justify-between mb-10 reveal" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: '#E9C558', marginBottom: '10px' }}>{hp.featuredEyebrow}</p>
            <h2 className="t-headline-lg" style={{ color: '#F0EADA', maxWidth: '18ch' }}>
              {hp.featuredHeading}
            </h2>
          </div>
          <Link to="/case-studies" className="t-ui link-grow" style={{ color: '#F0EADA' }}>
            {t.home.allCaseStudies}
          </Link>
        </div>

        <div className="flex flex-col" style={{ gap: 'clamp(40px, 5vw, 64px)' }}>
          {tiles.map((p, i) => (
            <Link
              key={p.id}
              to={`/case-studies/${p.slug}`}
              className="no-underline group reveal block"
              style={{ transitionDelay: `${i * 70}ms` }}
              aria-label={`${p.name} — ${p.brief}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-6 md:gap-10 items-center">
                <div className="work-tile bg-carbon img-crosshair" style={{ aspectRatio: '16/10', order: i % 2 === 1 ? 2 : 1 }}>
                  <img src={p.img} alt={`${p.name} — ${p.brief}`} loading="lazy" className="img-hover" />
                </div>
                <div style={{ order: i % 2 === 1 ? 1 : 2 }}>
                  <p className="t-caption" style={{ color: 'rgba(240,234,218,.5)', marginBottom: '10px' }}>
                    {p.num} · {p.discipline} · {p.year}
                  </p>
                  <h3 className="m-0 group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 400, lineHeight: 1.05, color: '#F0EADA', textDecorationColor: '#E9C558', textDecorationThickness: '1px', marginBottom: '14px' }}>
                    {p.name}
                  </h3>
                  {p.narrative && (
                    <dl className="m-0" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <dt className="t-caption m-0" style={{ color: 'rgba(240,234,218,.45)' }}>{t.home.problem}</dt>
                        <dd className="t-body m-0" style={{ color: 'rgba(240,234,218,.75)', fontSize: '15px', maxWidth: '46ch' }}>{p.narrative.problem}</dd>
                      </div>
                      <div>
                        <dt className="t-caption m-0" style={{ color: 'rgba(240,234,218,.45)' }}>{t.home.outcome}</dt>
                        <dd className="t-body m-0" style={{ color: '#E9C558', fontSize: '15px', maxWidth: '46ch' }}>{p.narrative.outcome}</dd>
                      </div>
                    </dl>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── 08 · Final CTA ───────────────────────────────────────────────────────
   Confident, human close on Ink with a clear commercial next step. Footer
   renders immediately below, in App.tsx. */
function FinalCta() {
  const company = useCompany()
  const hp = useHomepage()
  const t = useT()
  return (
    <section aria-label={t.home.workWithUsAriaLabel} style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(72px, 9vw, 140px)', paddingBottom: 'clamp(72px, 9vw, 140px)', borderTop: '1px solid rgba(240,234,218,.1)' }}>
      <div className="page-grid">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16 items-center">
          <div className="reveal md:order-2">
            <p className="t-caption" style={{ color: '#E9C558', marginBottom: '1.5rem' }}>{hp.ctaEyebrow}</p>
            <h2 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(32px, 4.5vw, 68px)', fontWeight: 400, lineHeight: 1.0, letterSpacing: '-0.02em', color: '#F0EADA', margin: 0, maxWidth: '15ch' }}>
              {hp.ctaHeading}
            </h2>
          </div>
          <div className="reveal reveal-delay-1 md:order-1">
            {hp.finalCtaImage && (
              <div
                className="work-tile img-crosshair"
                style={{ width: '160px', height: '100px', overflow: 'hidden', backgroundColor: '#3a3530', marginBottom: '1.5rem' }}
              >
                <img src={hp.finalCtaImage} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <p className="t-body" style={{ color: 'rgba(240,234,218,.72)', maxWidth: '40ch' }}>
              {hp.ctaBody}
            </p>
            <div className="flex flex-wrap items-center gap-3" style={{ marginTop: '1.75rem' }}>
              <Link to={hp.ctaButtonUrl} className="btn-milk" style={{ textDecoration: 'none' }}>{hp.ctaButtonLabel}</Link>
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
