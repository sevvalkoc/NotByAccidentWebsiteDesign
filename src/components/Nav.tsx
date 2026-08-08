import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useNav } from '@/content'
import nickSymbol from '@/imports/NBA_Symbol_Ink_RGB.png'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const navLinks = useNav()

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: '#F0EADA',
        borderBottom: scrolled ? '1px solid rgba(34,30,27,.1)' : '1px solid transparent',
      }}
    >
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="page-grid">
        <nav className="flex items-center justify-between h-14" aria-label="Main navigation">
          <Link
            to="/"
            className="flex items-center gap-2.5 no-underline"
            aria-label="Not by Accident — Home"
          >
            <img
              src={nickSymbol}
              alt=""
              aria-hidden="true"
              style={{ height: '22px', width: 'auto', display: 'block' }}
            />
            <span
              className="hidden sm:block"
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: '17px',
                fontWeight: 400,
                color: '#221E1B',
                letterSpacing: '-0.01em',
                lineHeight: 1,
              }}
            >
              Not by Accident
            </span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="t-ui no-underline transition-opacity duration-120"
                  style={{
                    color: '#221E1B',
                    opacity: location.pathname.startsWith(link.to) ? 1 : 0.6,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => {
                    e.currentTarget.style.opacity = location.pathname.startsWith(link.to) ? '1' : '0.6'
                  }}
                >
                  {link.label}
                  {link.soon && (
                    <sup style={{ marginLeft: '5px', fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6E2237', fontWeight: 600, verticalAlign: 'super' }}>
                      Soon
                    </sup>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 bg-transparent border-none cursor-pointer p-0"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-px bg-ink transition-all duration-300"
              style={{
                transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
                backgroundColor: '#221E1B',
              }}
            />
            <span
              className="block w-5 h-px transition-all duration-300"
              style={{
                opacity: menuOpen ? 0 : 1,
                backgroundColor: '#221E1B',
              }}
            />
            <span
              className="block w-5 h-px bg-ink transition-all duration-300"
              style={{
                transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
                backgroundColor: '#221E1B',
              }}
            />
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-400"
        style={{
          maxHeight: menuOpen ? '280px' : '0',
          borderTop: menuOpen ? '1px solid rgba(34,30,27,.1)' : '1px solid transparent',
        }}
      >
        <div className="page-grid pb-6 pt-4">
          <ul className="list-none m-0 p-0 flex flex-col gap-1">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="block py-2.5 t-headline no-underline"
                  style={{ color: '#221E1B', fontFamily: 'Lora, Georgia, serif', fontSize: '22px', fontWeight: 400 }}
                >
                  {link.label}
                  {link.soon && (
                    <sup style={{ marginLeft: '6px', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6E2237', fontWeight: 600, fontFamily: 'DM Sans, sans-serif' }}>
                      Soon
                    </sup>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
