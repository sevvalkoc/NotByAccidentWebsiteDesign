import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProjects } from '@/content'
import Seo from '@/components/Seo'

export default function Work() {
  const ref = useRef<HTMLElement>(null)
  const projects = useProjects()

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
    <main id="main" ref={ref} style={{ paddingTop: '56px' }}>
      <Seo title="Work" description="Selected work from Not by Accident — brand strategy, identity, digital products and demand for founders and creative teams." path="/work" />
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
              <p className="t-caption mb-4" style={{ color: 'rgba(34,30,27,.45)' }}>Work</p>
              <h1 className="t-headline-lg reveal" style={{ margin: 0 }}>
                An independent record of what we have made.
              </h1>
            </div>
            <p
              className="t-body reveal reveal-delay-1"
              style={{ color: 'rgba(34,30,27,.6)', maxWidth: '42ch' }}
            >
              We work on fewer projects than most. Each one receives the attention it requires. This is the archive.
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
                        <p className="t-caption mb-1" style={{ color: 'rgba(34,30,27,.35)' }}>Discipline</p>
                        <p className="t-ui m-0" style={{ color: 'rgba(34,30,27,.7)', fontWeight: 400 }}>
                          {project.discipline}
                        </p>
                      </div>
                      <div>
                        <p className="t-caption mb-1" style={{ color: 'rgba(34,30,27,.35)' }}>Year</p>
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
                      View case study
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
