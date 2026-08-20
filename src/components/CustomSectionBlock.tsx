import Link from '@/components/LocalizedLink'
import type { CustomSection } from '@/content'

/* Renders a section an editor added from Admin → Pages beyond a page's
   built-in ones — same generic shape every built-in section already
   stores (eyebrow/heading/subhead/body/image/CTA), just with no bespoke
   layout of its own. Used identically wherever a page appends its
   customSections. */
export default function CustomSectionBlock({ section }: { section: CustomSection }) {
  const { eyebrow, heading, subhead, body, image, ctaLabel, ctaUrl } = section
  return (
    <section
      style={{
        backgroundColor: '#F0EADA',
        paddingTop: 'clamp(56px, 7vw, 104px)',
        paddingBottom: 'clamp(56px, 7vw, 104px)',
        borderTop: '1px solid rgba(34,30,27,.12)',
      }}
    >
      <div className="page-grid">
        <div
          className={image ? 'grid grid-cols-1 gap-10 md:grid-cols-[40%_1fr] md:gap-16' : ''}
          style={{ alignItems: 'start' }}
        >
          {image && (
            <div className="reveal work-tile img-crosshair" style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', backgroundColor: '#3a3530' }}>
              <img src={image} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ maxWidth: image ? undefined : '64ch' }}>
            {eyebrow && (
              <p className="t-caption reveal" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1rem' }}>
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                className="reveal reveal-delay-1"
                style={{
                  fontFamily: 'Lora, Georgia, serif',
                  fontSize: 'clamp(28px, 3.5vw, 48px)',
                  fontWeight: 400,
                  lineHeight: 1.05,
                  letterSpacing: '-0.015em',
                  color: '#221E1B',
                  margin: 0,
                  maxWidth: '18ch',
                }}
              >
                {heading}
              </h2>
            )}
            {subhead && (
              <p className="t-subhead reveal reveal-delay-2" style={{ color: 'rgba(34,30,27,.7)', fontWeight: 400, marginTop: '1.25rem', maxWidth: '48ch' }}>
                {subhead}
              </p>
            )}
            {body && (
              <p className="t-body reveal reveal-delay-2" style={{ color: 'rgba(34,30,27,.65)', marginTop: '1.25rem', maxWidth: '52ch' }}>
                {body}
              </p>
            )}
            {ctaLabel && ctaUrl && (
              <div className="reveal reveal-delay-3" style={{ marginTop: '1.75rem' }}>
                <Link to={ctaUrl} className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
                  {ctaLabel}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
