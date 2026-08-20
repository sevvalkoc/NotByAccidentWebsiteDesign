import { useState } from 'react'
import Link from '@/components/LocalizedLink'
import { useCompany, useSocials, useCapabilities, useFooterNav, submitLead } from '@/content'
import { useT } from '@/i18n/ui'

export default function Footer() {
  const company = useCompany()
  const socials = useSocials()
  const capabilities = useCapabilities()
  const footerNav = useFooterNav()
  const t = useT()
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const featured = capabilities.slice(0, 6)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    const res = await submitLead({ email, source: 'footer' })
    if (!res.ok) {
      setError(res.error ?? t.newsletterPopup.formError)
      return
    }
    setSent(true)
    setEmail('')
  }

  const dim = 'rgba(240,234,218,'

  return (
    <footer style={{ backgroundColor: '#221E1B', color: '#F0EADA' }} aria-label="Footer">
      <div className="page-grid">
        <div style={{ paddingTop: 'clamp(56px, 7vw, 104px)', paddingBottom: 'clamp(28px, 3vw, 44px)' }}>

          {/* Top: statement + newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-20" style={{ paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
            <div>
              <p style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(30px, 4vw, 56px)', fontWeight: 400, lineHeight: 0.98, letterSpacing: '-0.015em', color: '#F0EADA', margin: 0, maxWidth: '15ch' }}>
                Not by Accident
              </p>
              <p className="t-body" style={{ color: `${dim}.6)`, marginTop: '1rem', maxWidth: '38ch' }}>
                {company.proposition} {t.footer.companyDescriptor}
              </p>
            </div>

            {/* Newsletter */}
            <div>
              <p className="t-caption" style={{ color: `${dim}.5)`, marginBottom: '1rem' }}>{t.footer.newsletterEyebrow}</p>
              {sent ? (
                <p className="t-subhead" style={{ color: '#E9C558', margin: 0 }}>
                  {t.footer.thankYou}
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3" style={{ maxWidth: '420px' }}>
                  <label htmlFor="footer-email" className="sr-only">{t.footer.emailLabel}</label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.footer.emailPlaceholder}
                    className="input-field-milk"
                    autoComplete="email"
                  />
                  <button type="submit" className="btn-milk shrink-0">{t.footer.subscribe}</button>
                </form>
              )}
              {error && (
                <p className="t-caption" style={{ color: '#E9C558', marginTop: '0.75rem', textTransform: 'none' }}>{error}</p>
              )}
              <p className="t-caption" style={{ color: `${dim}.3)`, marginTop: '0.75rem', letterSpacing: '0.02em', textTransform: 'none' }}>
                {t.footer.newsletterDisclaimer}
              </p>
            </div>
          </div>

          <hr className="brand-light" />

          {/* Middle: navigation columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10" style={{ paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
            {/* Explore */}
            <nav aria-label="Explore">
              <p className="t-caption" style={{ color: `${dim}.4)`, marginBottom: '1rem' }}>{t.footer.explore}</p>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {footerNav.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Capabilities */}
            <nav aria-label="Capabilities">
              <p className="t-caption" style={{ color: `${dim}.4)`, marginBottom: '1rem' }}>{t.footer.capabilities}</p>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {featured.map(c => (
                  <li key={c.slug}>
                    <Link to={`/capabilities/${c.slug}`} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{c.name}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/capabilities" className="t-ui link-grow" style={{ color: '#E9C558' }}>{t.footer.allCapabilities}</Link>
                </li>
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <p className="t-caption" style={{ color: `${dim}.4)`, marginBottom: '1rem' }}>{t.footer.contact}</p>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                <li><a href={`mailto:${company.newBusinessEmail}`} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{t.footer.newBusiness}</a></li>
                <li><a href={`mailto:${company.email}`} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{t.footer.general}</a></li>
                <li><a href={`mailto:${company.pressEmail}`} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{t.footer.press}</a></li>
                <li>
                  {company.phone ? (
                    <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`} className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{company.phone}</a>
                  ) : (
                    <span className="t-ui" style={{ color: `${dim}.4)`, fontStyle: 'italic' }}>{company.phonePlaceholder}</span>
                  )}
                </li>
              </ul>
              <p className="t-caption" style={{ color: `${dim}.35)`, marginTop: '1rem', textTransform: 'none', letterSpacing: '0.02em' }}>
                {company.hours}
              </p>
            </div>

            {/* Social + Studio address */}
            <div>
              <p className="t-caption" style={{ color: `${dim}.4)`, marginBottom: '1rem' }}>{t.footer.elsewhere}</p>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {socials.map(s => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="t-ui link-grow" style={{ color: `${dim}.7)` }}>{s.label}</a>
                  </li>
                ))}
              </ul>
              <address className="not-italic t-caption" style={{ color: `${dim}.4)`, marginTop: '1.25rem', textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.7, fontStyle: company.address.line1 ? 'normal' : 'italic' }}>
                {company.address.line1 ? (
                  <>
                    {company.address.line1}<br />
                    {company.address.line2 && <>{company.address.line2}<br /></>}
                    {company.address.city} {company.address.postcode}<br />
                    {company.address.country}
                  </>
                ) : (
                  company.addressPlaceholder
                )}
              </address>
            </div>
          </div>

          <hr className="brand-light" />

          {/* Bottom: legal + registration */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4" style={{ marginTop: '1.5rem' }}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <p className="t-caption m-0" style={{ color: `${dim}.35)` }}>© {year} {company.legalName}</p>
              <span className="t-caption" style={{ color: `${dim}.3)`, textTransform: 'none', letterSpacing: '0.02em', fontStyle: 'italic' }}>{company.registrationNote}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <Link to="/trainings" className="t-caption link-grow" style={{ color: `${dim}.45)` }}>{t.footer.trainings}</Link>
              <Link to="/privacy" className="t-caption link-grow" style={{ color: `${dim}.45)` }}>{t.footer.privacy}</Link>
              <Link to="/cookies" className="t-caption link-grow" style={{ color: `${dim}.45)` }}>{t.footer.cookies}</Link>
              <Link to="/search" className="t-caption link-grow" style={{ color: `${dim}.45)` }}>{t.footer.search}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
