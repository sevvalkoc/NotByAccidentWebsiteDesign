import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Link from '@/components/LocalizedLink'
import { categories } from '@/data'
import { useCompany, useCapabilities, useProjects } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'

export default function CapabilityDetail() {
  const { slug } = useParams()
  const ref = useRef<HTMLElement>(null)
  const company = useCompany()
  const capabilities = useCapabilities()
  const projects = useProjects()
  const cap = capabilities.find(c => c.slug === slug)
  useReveal(ref, { threshold: 0.06 })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!cap) {
    return (
      <main id="main" style={{ paddingTop: '160px', paddingBottom: '160px', backgroundColor: '#F0EADA' }}>
        <div className="page-grid">
          <p className="t-caption" style={{ color: '#6E2237' }}>404</p>
          <h1 className="t-headline-lg" style={{ margin: '12px 0 24px' }}>That capability moved.</h1>
          <Link to="/capabilities" className="btn-primary" style={{ textDecoration: 'none' }}>All capabilities</Link>
        </div>
      </main>
    )
  }

  const category = categories.find(c => c.key === cap.category)!
  const siblings = capabilities.filter(c => c.category === cap.category && c.slug !== cap.slug)
  const related = capabilities.filter(c => c.category !== cap.category).slice(0, 4)
  const linkedProjects = projects.filter(p => p.relatedCapabilities.includes(cap.slug))
  const proof = (linkedProjects.length ? linkedProjects : projects.filter(p => p.featured)).slice(0, 3)

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: cap.name,
      serviceType: cap.name,
      description: cap.summary,
      provider: { '@type': 'Organization', name: company.legalName, url: 'https://notbyaccident.com' },
      areaServed: 'Worldwide',
      url: `https://notbyaccident.com/capabilities/${cap.slug}`,
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${cap.name} — what's included`,
        itemListElement: cap.includes.map(i => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: i } })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is ${cap.name.toLowerCase()}?`,
          acceptedAnswer: { '@type': 'Answer', text: cap.lede },
        },
        {
          '@type': 'Question',
          name: `What does ${cap.name.toLowerCase()} deliver?`,
          acceptedAnswer: { '@type': 'Answer', text: cap.outcome },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Capabilities', item: 'https://notbyaccident.com/capabilities' },
        { '@type': 'ListItem', position: 2, name: cap.name, item: `https://notbyaccident.com/capabilities/${cap.slug}` },
      ],
    },
  ]

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo
        title={`${cap.name} — ${category.label}`}
        description={cap.summary}
        path={`/capabilities/${cap.slug}`}
        jsonLd={schema}
      />

      {/* Hero */}
      <div style={{ paddingTop: 'clamp(48px, 6vw, 96px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <div className="page-grid">
          <nav aria-label="Breadcrumb" className="reveal mb-8">
            <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.45)' }}>
              <Link to="/capabilities" className="link-grow" style={{ color: 'rgba(34,30,27,.55)' }}>Capabilities</Link>
              <span style={{ padding: '0 8px' }}>/</span>
              <span style={{ color: category.accent }}>{category.label}</span>
            </p>
          </nav>
          <h1 className="reveal reveal-delay-1" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(38px, 6vw, 84px)', fontWeight: 400, lineHeight: 0.98, letterSpacing: '-0.02em', color: '#221E1B', margin: 0, maxWidth: '14ch' }}>
            {cap.name}
          </h1>
          <p className="t-subhead reveal reveal-delay-2" style={{ marginTop: '1.5rem', maxWidth: '54ch', color: 'rgba(34,30,27,.75)' }}>
            {cap.lede}
          </p>
        </div>
      </div>

      {/* The question — Beetroot band */}
      <div style={{ backgroundColor: '#6E2237', paddingTop: 'clamp(40px, 5vw, 72px)', paddingBottom: 'clamp(40px, 5vw, 72px)' }}>
        <div className="page-grid">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-16">
            <div className="reveal">
              <p className="t-caption" style={{ color: 'rgba(240,234,218,.5)', marginBottom: '1rem' }}>The question this answers</p>
              <p style={{ fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontSize: 'clamp(22px, 2.6vw, 34px)', lineHeight: 1.14, color: '#F0EADA', margin: 0, maxWidth: '22ch' }}>
                {cap.question}
              </p>
            </div>
            <div className="reveal reveal-delay-1 self-end">
              <p className="t-caption" style={{ color: 'rgba(240,234,218,.5)', marginBottom: '1rem' }}>What you leave with</p>
              <p className="t-body m-0" style={{ color: '#F0EADA', maxWidth: '40ch' }}>{cap.outcome}</p>
            </div>
          </div>
        </div>
      </div>

      {/* What's included + proof */}
      <div className="page-grid" style={{ paddingTop: 'clamp(56px, 7vw, 112px)', paddingBottom: 'clamp(56px, 7vw, 112px)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20">
          <div className="reveal">
            <p className="t-caption mb-6" style={{ color: 'rgba(34,30,27,.45)' }}>What the engagement includes</p>
            <ul className="list-none m-0 p-0">
              {cap.includes.map((item, i) => (
                <li key={item} className="flex items-baseline gap-4" style={{ padding: '16px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(34,30,27,.14)' }}>
                  <span className="t-caption" style={{ color: '#6E2237' }}>0{i + 1}</span>
                  <span style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(18px, 1.8vw, 23px)', lineHeight: 1.2, color: '#221E1B' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal reveal-delay-1">
            <p className="t-caption mb-6" style={{ color: 'rgba(34,30,27,.45)' }}>Seen in the work</p>
            <div className="flex flex-col gap-4">
              {proof.map(p => (
                <Link key={p.id} to={`/case-studies/${p.slug}`} className="work-tile no-underline bg-carbon block" style={{ aspectRatio: '16/8' }} aria-label={p.name}>
                  <img src={p.img} alt={`${p.name} — ${p.brief}`} loading="lazy" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4" style={{ background: 'linear-gradient(to top, rgba(34,30,27,.75), transparent 60%)' }}>
                    <p className="m-0" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '20px', color: '#F0EADA', lineHeight: 1.05 }}>{p.name}</p>
                    <p className="t-caption m-0" style={{ color: 'rgba(240,234,218,.7)', textTransform: 'none', letterSpacing: '0.01em', marginTop: '3px' }}>{p.result.split(',')[0]}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sibling capabilities within category */}
      {siblings.length > 0 && (
        <div style={{ backgroundColor: '#221E1B', paddingTop: 'clamp(48px, 6vw, 88px)', paddingBottom: 'clamp(48px, 6vw, 88px)' }}>
          <div className="page-grid">
            <p className="t-caption mb-6 reveal" style={{ color: 'rgba(240,234,218,.4)' }}>
              More from {category.label}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 reveal">
              {siblings.map(s => (
                <Link key={s.slug} to={`/capabilities/${s.slug}`} className="no-underline group" style={{ padding: '18px 0', borderTop: '1px solid rgba(240,234,218,.16)' }}>
                  <p className="m-0 group-hover:underline" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '21px', color: '#F0EADA', textDecorationColor: '#E9C558', textDecorationThickness: '1px' }}>{s.name}</p>
                  <p className="t-body m-0" style={{ color: 'rgba(240,234,218,.55)', fontSize: '14px', marginTop: '4px' }}>{s.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related across pillars + CTA */}
      <div className="page-grid" style={{ paddingTop: 'clamp(56px, 7vw, 96px)', paddingBottom: 'clamp(56px, 7vw, 112px)' }}>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 items-start">
          <div className="reveal">
            <h2 className="t-headline" style={{ maxWidth: '16ch' }}>Rarely one thing on its own.</h2>
            <p className="t-body" style={{ color: 'rgba(34,30,27,.65)', marginTop: '1rem', maxWidth: '42ch' }}>
              {cap.name} usually travels with a few of these. We assemble the team the project needs.
            </p>
            <Link to="/contact" className="btn-primary" style={{ textDecoration: 'none', marginTop: '1.5rem' }}>
              Talk to us about {cap.name.toLowerCase()}
            </Link>
          </div>
          <div className="reveal reveal-delay-1 flex flex-wrap gap-2 content-start">
            {related.map(r => (
              <Link key={r.slug} to={`/capabilities/${r.slug}`} className="pill">{r.name}</Link>
            ))}
            <Link to="/capabilities" className="pill" style={{ borderColor: '#221E1B', backgroundColor: '#221E1B', color: '#F0EADA' }}>All capabilities →</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
