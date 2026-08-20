import { useRef } from 'react'
import { useParams } from 'react-router-dom'
import Link, { Navigate } from '@/components/LocalizedLink'
import { useCompany, useProjects, useCapabilities } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'

export default function CaseStudy() {
  const { slug } = useParams<{ slug: string }>()
  const company = useCompany()
  const projects = useProjects()
  const capabilities = useCapabilities()
  const project = projects.find(p => p.slug === slug)
  const ref = useRef<HTMLElement>(null)
  useReveal(ref, { threshold: 0.08 })

  if (!project) return <Navigate to="/case-studies" replace />

  const idx = projects.findIndex(p => p.slug === slug)
  const next = projects[(idx + 1) % projects.length]
  const relatedCapabilities = capabilities.filter(c => project.relatedCapabilities.includes(c.slug))

  const caseSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.name,
      headline: `${project.name} — ${project.discipline}`,
      description: project.brief,
      image: project.heroImg,
      dateCreated: project.year,
      locationCreated: project.location,
      url: `https://notbyaccident.com/case-studies/${project.slug}`,
      creator: { '@type': 'Organization', name: company.legalName },
      keywords: project.services.join(', '),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Case Studies', item: 'https://notbyaccident.com/case-studies' },
        { '@type': 'ListItem', position: 2, name: project.name, item: `https://notbyaccident.com/case-studies/${project.slug}` },
      ],
    },
  ]

  return (
    <main
      id="main"
      ref={ref}
      style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}
    >
      <Seo title={`${project.name} — Case Study`} description={project.brief} path={`/case-studies/${project.slug}`} image={project.heroImg} jsonLd={caseSchema} />

      {/* Hero image — full bleed */}
      <div
        className="img-crosshair overflow-hidden bg-carbon"
        style={{ width: '100%', aspectRatio: '16/7' }}
      >
        <img
          src={project.heroImg}
          alt={project.brief}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Case study header */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(40px, 5vw, 64px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '2rem',
          }}
          className="md:grid-cols-[60%_35%]"
        >
          <div>
            <nav className="mb-4" aria-label="Breadcrumb">
              <Link
                to="/case-studies"
                className="t-caption no-underline hover:opacity-70 transition-opacity"
                style={{ color: 'rgba(34,30,27,.45)' }}
              >
                ← Case Studies
              </Link>
            </nav>
            <h1 className="t-headline-lg reveal" style={{ margin: '0 0 12px' }}>
              {project.name}
            </h1>
            <p
              className="reveal reveal-delay-1"
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(18px, 2vw, 24px)',
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: '-0.005em',
                color: 'rgba(34,30,27,.65)',
                maxWidth: '44ch',
                margin: 0,
              }}
            >
              {project.brief}
            </p>
          </div>

          <div
            className="reveal reveal-delay-2"
            style={{ paddingTop: '2rem' }}
          >
            <dl
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                margin: 0,
                padding: 0,
              }}
            >
              {[
                { term: 'Discipline', desc: project.discipline },
                { term: 'Location', desc: project.location },
                { term: 'Year', desc: project.year },
              ].map(item => (
                <div key={item.term}>
                  <dt className="t-caption mb-1" style={{ color: 'rgba(34,30,27,.4)' }}>
                    {item.term}
                  </dt>
                  <dd className="t-body m-0" style={{ color: '#221E1B', fontSize: '15px' }}>
                    {item.desc}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Problem → Insight → Intervention → Outcome */}
      {project.narrative && (
        <div
          className="page-grid"
          style={{
            paddingTop: 'clamp(56px, 7vw, 96px)',
            paddingBottom: 'clamp(56px, 7vw, 96px)',
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
            {([
              ['Problem', project.narrative.problem, '#6E2237'],
              ['Insight', project.narrative.insight, '#7F8B3E'],
              ['Intervention', project.narrative.intervention, '#6A6383'],
              ['Outcome', project.narrative.outcome, '#C08A1E'],
            ] as const).map(([label, text, accent], i) => (
              <div key={label} className="reveal" style={{ transitionDelay: `${i * 60}ms`, borderTop: `2px solid ${accent}`, paddingTop: '18px' }}>
                <p className="t-caption mb-3" style={{ color: accent }}>{label}</p>
                <p
                  style={{
                    fontFamily: label === 'Outcome' ? 'Lora, Georgia, serif' : 'DM Sans, system-ui, sans-serif',
                    fontStyle: label === 'Outcome' ? 'italic' : 'normal',
                    fontSize: label === 'Outcome' ? '20px' : '17px',
                    lineHeight: label === 'Outcome' ? 1.35 : 1.6,
                    color: '#221E1B',
                    maxWidth: '46ch',
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Second image */}
      <div className="page-grid reveal" style={{ paddingBottom: 'clamp(56px, 7vw, 96px)' }}>
        <div
          className="overflow-hidden bg-carbon img-crosshair"
          style={{ width: '100%', aspectRatio: '3/2' }}
        >
          <img
            src={project.img}
            alt={`${project.name} — additional view`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <p className="t-caption mt-3" style={{ color: 'rgba(34,30,27,.35)' }}>
          {project.name}, {project.year}. {project.location}.
        </p>
      </div>

      {/* Capabilities — the work, linked to the discipline pages that did it */}
      <div
        className="page-grid reveal"
        style={{
          paddingBottom: 'clamp(64px, 8vw, 128px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <p className="t-caption mb-6" style={{ color: 'rgba(34,30,27,.45)' }}>
          Capabilities behind this work
        </p>
        <ul
          className="list-none m-0 p-0"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
        >
          {relatedCapabilities.length > 0
            ? relatedCapabilities.map(c => (
                <li key={c.slug}>
                  <Link to={`/capabilities/${c.slug}`} className="pill">{c.name}</Link>
                </li>
              ))
            : project.services.map(s => (
                <li
                  key={s}
                  className="t-caption"
                  style={{
                    display: 'inline-block',
                    padding: '6px 14px',
                    border: '1px solid rgba(34,30,27,.2)',
                    borderRadius: '2px',
                    color: 'rgba(34,30,27,.7)',
                    textTransform: 'none',
                    letterSpacing: '0.02em',
                  }}
                >
                  {s}
                </li>
              ))}
        </ul>
      </div>

      {/* Next project */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(48px, 6vw, 80px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <p className="t-caption mb-6 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>
          Next project
        </p>
        <Link
          to={`/case-studies/${next.slug}`}
          className="block no-underline group reveal"
          aria-label={`Next: ${next.name}`}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }}
            className="md:grid-cols-[auto_1fr]"
          >
            <div
              className="overflow-hidden bg-carbon img-crosshair"
              style={{ width: '280px', maxWidth: '100%', aspectRatio: '3/2' }}
            >
              <img
                src={next.img}
                alt={next.brief}
                className="w-full h-full object-cover img-hover"
                loading="lazy"
              />
            </div>
            <div style={{ alignSelf: 'center' }}>
              <h2
                className="group-hover:underline"
                style={{
                  fontFamily: 'Lora, Georgia, serif',
                  fontSize: 'clamp(22px, 2.5vw, 32px)',
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: '-0.01em',
                  color: '#221E1B',
                  textDecorationColor: '#6E2237',
                  textDecorationThickness: '1px',
                  margin: '0 0 8px',
                }}
              >
                {next.name}
              </h2>
              <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)' }}>
                {next.brief}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </main>
  )
}
