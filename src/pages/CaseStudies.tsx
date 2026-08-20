import { useRef } from 'react'
import Link from '@/components/LocalizedLink'
import { useProjects, useCaseStudiesCopy, useCustomSections } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'
import { usePageSeo } from '@/i18n/pageSeo'
import CustomSectionBlock from '@/components/CustomSectionBlock'

export default function CaseStudies() {
  const ref = useRef<HTMLElement>(null)
  const projects = useProjects()
  const copy = useCaseStudiesCopy()
  const customSections = useCustomSections('case-studies')
  const seo = usePageSeo('/case-studies')
  useReveal(ref, { threshold: 0.08 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px', backgroundColor: '#F0EADA' }}>
      <Seo title={seo.title} description={seo.description} path="/case-studies" />
      {/* Header */}
      <div
        style={{
          paddingTop: 'clamp(48px, 6vw, 96px)',
          paddingBottom: 'clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <p className="t-caption mb-4 reveal" style={{ color: 'rgba(34,30,27,.45)' }}>{copy.eyebrow}</p>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}
            className="md:grid-cols-[50%_1fr]"
          >
            <h1 className="t-headline-lg reveal reveal-delay-1" style={{ margin: 0 }}>
              {copy.heading}
            </h1>
            <p
              className="t-body reveal reveal-delay-2"
              style={{ color: 'rgba(34,30,27,.6)', maxWidth: '44ch', alignSelf: 'end' }}
            >
              {copy.subhead}
            </p>
          </div>
        </div>
      </div>

      {/* Case study grid: editorial asymmetric */}
      <div
        className="page-grid"
        style={{
          paddingTop: 'clamp(48px, 6vw, 96px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        {/* First item — large, full width */}
        {projects[0] && (
          <div className="reveal" style={{ marginBottom: 'clamp(48px, 6vw, 80px)' }}>
            <Link
              to={`/case-studies/${projects[0].slug}`}
              className="block no-underline group"
            >
              <div
                className="overflow-hidden bg-carbon img-crosshair"
                style={{ width: '100%', aspectRatio: '16/7' }}
              >
                <img
                  src={projects[0].heroImg}
                  alt={projects[0].brief}
                  className="w-full h-full object-cover img-hover"
                  loading="eager"
                />
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'start',
                  marginTop: '20px',
                }}
              >
                <div>
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
                    {projects[0].name}
                  </h2>
                  <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', maxWidth: '52ch' }}>
                    {projects[0].narrative?.problem ?? projects[0].brief}
                  </p>
                </div>
                <div style={{ textAlign: 'right', paddingTop: '4px' }}>
                  <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.4)', marginBottom: '4px' }}>
                    {projects[0].discipline}
                  </p>
                  <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.35)' }}>
                    {projects[0].year}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Remaining — 2 col grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(40px, 5vw, 64px)',
          }}
          className="sm:grid-cols-2"
        >
          {projects.slice(1).map((project, i) => (
            <div key={project.id} className="reveal" style={{ transitionDelay: `${(i % 2) * 80}ms` }}>
              <Link
                to={`/case-studies/${project.slug}`}
                className="block no-underline group"
              >
                <div
                  className="overflow-hidden bg-carbon img-crosshair"
                  style={{ width: '100%', aspectRatio: '3/2' }}
                >
                  <img
                    src={project.img}
                    alt={project.brief}
                    className="w-full h-full object-cover img-hover"
                    loading="lazy"
                  />
                </div>
                <div style={{ marginTop: '16px' }}>
                  <p className="t-caption mb-2" style={{ color: 'rgba(34,30,27,.4)' }}>
                    {project.num} · {project.discipline} · {project.year}
                  </p>
                  <h2
                    className="group-hover:underline"
                    style={{
                      fontFamily: 'Lora, Georgia, serif',
                      fontSize: 'clamp(18px, 2vw, 24px)',
                      fontWeight: 400,
                      lineHeight: 1.15,
                      letterSpacing: '-0.01em',
                      color: '#221E1B',
                      textDecorationColor: '#6E2237',
                      textDecorationThickness: '1px',
                      margin: '0 0 8px',
                    }}
                  >
                    {project.name}
                  </h2>
                  <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)', fontSize: '14px' }}>
                    {project.brief}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {customSections.map(cs => (
        <CustomSectionBlock key={cs.key} section={cs} />
      ))}
    </main>
  )
}
