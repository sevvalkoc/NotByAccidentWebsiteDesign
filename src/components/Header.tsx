import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from './Link'
import { Lockup } from './Logo'
import IndexSheet from './IndexSheet'
import { useCopy, useMenu, useSection, useSite } from '@/content'
import { Cta } from './Rich'
import { localizePath, stripLocale, useLocale } from '@/i18n/locale'
import './header.css'

/** Small, quiet, out of the way: it slides away while you read down the
 *  page and returns the moment you scroll back up. */
export default function Header() {
  const copy = useCopy()
  const locale = useLocale()
  const site = useSite()
  const menu = useMenu('header_nav')
  const announce = useSection('global', 'announcement')
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)
  const current = stripLocale(pathname).path

  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const read = () => {
      raf = 0
      const y = window.scrollY
      setSolid(y > 24)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160)
        last = y
      }
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    setOpen(false)
    setHidden(false)
  }, [pathname])

  return (
    <>
      <a className="skip" href="#main">
        {copy.nav.skip}
      </a>
      <header className="hdr" data-hidden={hidden || undefined} data-solid={solid || undefined} style={{ viewTransitionName: 'header' }}>
        {announce?.title ? (
          <p className="announce t-caption">
            <span>{announce.title}</span>
            {announce.ctaLabel && announce.ctaUrl ? (
              <Cta url={announce.ctaUrl} className="link go">
                {announce.ctaLabel}
              </Cta>
            ) : null}
          </p>
        ) : null}
        <div className="wrap hdr__in">
          <Link to="/" className="hdr__home" aria-label={copy.nav.home} aria-current={current === '/' ? 'page' : undefined}>
            {site.brand.logoUrl ? <img src={site.brand.logoUrl} alt="" className="hdr__logo" /> : <Lockup label="" className="hdr__mark" />}
          </Link>
          <nav className="hdr__nav" aria-label={copy.nav.main}>
            <ul role="list">
              {menu.map(m => {
                const active = !m.newTab && (current === m.url || current.startsWith(m.url + '/') || (m.url === '/work' && current.startsWith('/case-studies')))
                return (
                  <li key={m.url}>
                    {m.newTab ? (
                      <a href={m.url} target="_blank" rel="noopener noreferrer" className="link-q">
                        {m.label}
                      </a>
                    ) : (
                      <Link to={m.url} className="link-q" aria-current={active ? 'page' : undefined}>
                        {m.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>
          <Link to="/contact" className="hdr__contact" aria-current={current === '/contact' ? 'page' : undefined}>
            {copy.nav.contact}
          </Link>
          <button ref={button} type="button" className="hdr__menu" aria-expanded={open} aria-controls="index-sheet" onClick={() => setOpen(true)}>
            <span>{copy.nav.menu}</span>
            <span className="hdr__glyph" aria-hidden="true" />
          </button>
        </div>
      </header>
      <IndexSheet
        open={open}
        onClose={() => {
          setOpen(false)
          button.current?.focus()
        }}
        langHref={l => localizePath(current, l)}
        locale={locale}
      />
    </>
  )
}
