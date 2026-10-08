import { useEffect, useRef } from 'react'
import Link from './Link'
import { useCopy, useSite } from '@/content'
import { PAGES } from '@/routes'
import { LOCALES, LOCALE_LABEL, LOCALE_NAME, type Locale } from '@/i18n/locale'
import './index-sheet.css'

/** The menu: every page on one dark sheet. A dialog, so it traps focus,
 *  closes on Escape and hands focus back. */
export default function IndexSheet({ open, onClose, langHref, locale }: { open: boolean; onClose: () => void; langHref: (l: Locale) => string; locale: Locale }) {
  const copy = useCopy()
  const site = useSite()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const el = ref.current!
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    el.querySelector<HTMLElement>('button')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose()
      if (e.key !== 'Tab') return
      const f = [...el.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
      const a = f[0]
      const z = f[f.length - 1]
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault()
        z.focus()
      } else if (!e.shiftKey && document.activeElement === z) {
        e.preventDefault()
        a.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <div id="index-sheet" ref={ref} role="dialog" aria-modal="true" aria-label={copy.nav.menu} className="sheet" data-env="void" data-open={open || undefined} hidden={!open}>
      <div className="wrap sheet__top">
        <span className="label">{copy.nav.menu}</span>
        <button type="button" className="sheet__close" onClick={onClose}>
          {copy.nav.close}
        </button>
      </div>
      <div className="wrap sheet__body">
        <nav aria-label={copy.nav.main}>
          <ul role="list" className="sheet__pages">
            {PAGES.map((p, i) => (
              <li key={p.key} style={{ '--i': i } as React.CSSProperties}>
                <Link to={p.path} onClick={onClose} className="sheet__page">
                  {copy.pages[p.key]}
                  {p.soon ? <span className="sheet__soon">{copy.nav.soon}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sheet__side t-small">
          <div>
            <p className="label">{copy.index.write}</p>
            <a className="link-q" href={`mailto:${site.company.newBusinessEmail}`}>
              {site.company.newBusinessEmail}
            </a>
          </div>
          <div>
            <p className="label">{copy.index.elsewhere}</p>
            <ul role="list" className="sheet__inline">
              {site.socials.map(s => (
                <li key={s.label}>
                  <a className="link-q" href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">{copy.index.languages}</p>
            <ul role="list" className="sheet__inline">
              {LOCALES.map(l => (
                <li key={l}>
                  <a className="link-q" href={langHref(l)} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined} title={LOCALE_NAME[l]}>
                    {LOCALE_LABEL[l]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
