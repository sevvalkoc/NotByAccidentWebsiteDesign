import { useRef } from 'react'
import Link from '@/components/LocalizedLink'
import { useProjects, useWorkCopy, useCustomSections } from '@/content'
import Seo from '@/components/Seo'
import { useReveal } from '@/hooks/useReveal'
import { useT } from '@/i18n/ui'
import { usePageSeo } from '@/i18n/pageSeo'
import CustomSectionBlock from '@/components/CustomSectionBlock'

export default function Work() {
  const ref = useRef<HTMLElement>(null)
  const projects = useProjects()
  const copy = useWorkCopy()
  const customSections = useCustomSections('work')
  const t = useT()
  const seo = usePageSeo('/work')
  useReveal(ref, { threshold: 0.08 })

  return (
    <main id="main" ref={ref} style={{ paddingTop: '56px' }}>
      <Seo title={seo.title} description={seo.description} path="/work" />
      {/* Page header */}
      <div
        style={{
          backgroundColor: '#F0EADA',
          paddingTop: 'clamp(48px, 6vw, 96px)',
          paddingBottom: 'clamp(48px, 6vw, 96px)',
          borderBottom: '1px solid rgba(34,30,27,.1)',
        }}
      >
        <div className="page-grid">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
              alignItems: 'end',
            }}
            className="md:grid-cols-[55%_45%]"
          >
            <div>
              <p className="t-caption mb-4" style={{ color: 'rgba(34,30,27,.45)' }}>{copy.eyebrow}</p>
              <h1 className="t-headline-lg reveal" style={{ margin: 0 }}>
                {copy.heading}
              </h1>
            </div>
            <p
              className="t-body reveal reveal-delay-1"
              style={{ color: 'rgba(34,30,27,.6)', maxWidth: '42ch' }}
            >
              {copy.subhead}
            </p>
          </div>
        </div>
      </div>

      {/* Projects — image + text rows alternating */}
      <section style={{ backgroundColor: '#F0EADA', paddingBottom: 'clamp(64px, 8vw, 128px)' }}>
        <div className="page-grid">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="reveal"
              style={{
                paddingTop: 'clamp(56px, 6vw, 96px)',
                paddingBottom: 'clamp(56px, 6vw, 96px)',
                borderBottom: i < projects.length - 1 ? '1px solid rgba(34,30,27,.1)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: 'clamp(32px, 4vw, 64px)',
                  alignItems: 'start',
                }}
                className={i % 2 === 0 ? 'md:grid-cols-[55%_40%]' : 'md:grid-cols-[40%_55%]'}
              >
                {/* Image */}
                <div
                  className={`overflow-hidden bg-carbon img-crosshair ${i % 2 !== 0 ? 'md:order-2' : ''}`}
                  style={{ width: '100%', aspectRatio: '3/2' }}
                >
                  <Link to={`/case-studies/${project.slug}`} className="block w-full h-full">
                    <img
                      src={project.img}
                      alt={project.brief}
                      className="w-full h-full object-cover img-hover"
                      loading="lazy"
                    />
                  </Link>
                </div>

                {/* Text */}
                <div
                  className={`flex flex-col justify-between ${i % 2 !== 0 ? 'md:order-1' : ''}`}
                  style={{ minHeight: '240px' }}
                >
                  <div>
                    <p className="t-caption mb-3" style={{ color: 'rgba(34,30,27,.4)' }}>
                      {project.num}
                    </p>
                    <h2
                      style={{
                        fontFamily: 'Lora, Georgia, serif',
                        fontSize: 'clamp(24px, 2.8vw, 36px)',
                        fontWeight: 400,
                        lineHeight: 1.1,
                        letterSpacing: '-0.01em',
                        color: '#221E1B',
                        margin: '0 0 12px',
                      }}
                    >
                      {project.name}
                    </h2>
                    <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.65)', maxWidth: '40ch' }}>
                      {project.brief}
                    </p>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '2rem',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <div>
                        <p className="t-caption mb-1" style={{ color: 'rgba(34,30,27,.35)' }}>{t.work.discipline}</p>
                        <p className="t-ui m-0" style={{ color: 'rgba(34,30,27,.7)', fontWeight: 400 }}>
                          {project.discipline}
                        </p>
                      </div>
                      <div>
                        <p className="t-caption mb-1" style={{ color: 'rgba(34,30,27,.35)' }}>{t.work.year}</p>
                        <p className="t-ui m-0" style={{ color: 'rgba(34,30,27,.7)', fontWeight: 400 }}>
                          {project.year}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/case-studies/${project.slug}`}
                      className="btn-ghost"
                      style={{ textDecoration: 'none', display: 'inline-flex' }}
                    >
                      {t.work.viewCaseStudy}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      {customSections.map(cs => (
        <CustomSectionBlock key={cs.key} section={cs} />
      ))}
    </main>
  )
}
