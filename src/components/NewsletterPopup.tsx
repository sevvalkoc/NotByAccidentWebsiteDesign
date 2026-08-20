import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { submitLead } from '@/content'
import { useT } from '@/i18n/ui'

const DISMISS_KEY = 'nba.newsletter.popup.v1'
const SHOW_DELAY_MS = 18000 // ~18s of genuine interest before we interrupt

/* A quiet, one-time newsletter invitation. Appears once per visitor (until they
   subscribe or dismiss), never on the admin screens, and respects the Escape
   key and reduced-motion. Submissions are captured via submitLead(). */
export default function NewsletterPopup() {
  const { pathname } = useLocation()
  const t = useT()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDivElement>(null)

  const suppressed = pathname.startsWith('/admin')

  useEffect(() => {
    if (suppressed) return
    let dismissed = false
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === '1'
    } catch {
      /* ignore */
    }
    if (dismissed) return

    let fired = false
    const reveal = () => {
      if (fired) return
      fired = true
      setOpen(true)
    }
    const timer = window.setTimeout(reveal, SHOW_DELAY_MS)
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      if (scrolled > document.body.scrollHeight * 0.55) reveal()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [suppressed])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.querySelector<HTMLElement>('input, button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function remember() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  function close() {
    remember()
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setError('')
    const res = await submitLead({ email, source: 'newsletter-popup' })
    if (!res.ok) {
      setError(res.error ?? t.newsletterPopup.formError)
      return
    }
    setDone(true)
    remember()
    window.setTimeout(() => setOpen(false), 2600)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nl-popup-title"
      onMouseDown={e => {
        if (e.target === e.currentTarget) close()
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: 'rgba(34,30,27,.55)',
        backdropFilter: 'blur(3px)',
        animation: 'nl-fade 240ms var(--ease-brand, ease)',
      }}
    >
      <div
        ref={dialogRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#F0EADA',
          color: '#221E1B',
          padding: 'clamp(28px, 5vw, 48px)',
          boxShadow: '0 24px 80px rgba(34,30,27,.35)',
          animation: 'nl-rise 320ms var(--ease-brand, ease)',
        }}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.newsletterPopup.close}
          style={{
            position: 'absolute',
            top: '14px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '22px',
            lineHeight: 1,
            color: 'rgba(34,30,27,.45)',
            padding: '4px',
          }}
        >
          ×
        </button>

        {done ? (
          <div>
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '1rem' }}>{t.newsletterPopup.doneEyebrow}</p>
            <p
              style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 400, lineHeight: 1.08, letterSpacing: '-0.015em', margin: 0 }}
            >
              {t.newsletterPopup.doneBody}
            </p>
          </div>
        ) : (
          <>
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '1rem' }}>{t.newsletterPopup.eyebrow}</p>
            <h2
              id="nl-popup-title"
              style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 400, lineHeight: 1.04, letterSpacing: '-0.02em', margin: '0 0 0.85rem', maxWidth: '16ch' }}
            >
              {t.newsletterPopup.heading}
            </h2>
            <p className="t-body" style={{ color: 'rgba(34,30,27,.7)', margin: '0 0 1.75rem', maxWidth: '42ch' }}>
              {t.newsletterPopup.body}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="nl-popup-email" className="sr-only">{t.footer.emailLabel}</label>
              <input
                id="nl-popup-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.newsletterPopup.emailPlaceholder}
                className="input-field"
                autoComplete="email"
              />
              <button type="submit" className="btn-primary shrink-0">{t.newsletterPopup.subscribe}</button>
            </form>
            {error && <p className="t-caption" style={{ color: '#6E2237', marginTop: '0.75rem' }}>{error}</p>}
            <button
              type="button"
              onClick={close}
              className="t-caption"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', marginTop: '1rem', padding: 0, textTransform: 'none', letterSpacing: '0.02em' }}
            >
              {t.newsletterPopup.dismiss}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
