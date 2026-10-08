import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { useCopy, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { stripLocale } from '@/i18n/locale'
import './misc.css'

const PHRASE = 'Not by Accident'

/* Deterministic scatter, so the server and the browser agree. */
function scatter(i: number, len: number) {
  const r = (n: number) => {
    const x = Math.sin((i + 1) * 9301 + n * 49297) * 233280
    return x - Math.floor(x)
  }
  // Pull the outermost letters inwards so nothing leaves the screen.
  const edge = i < 2 ? 6 : i > len - 3 ? -6 : 0
  return { x: (r(1) - 0.5) * 18 + edge, y: (r(2) - 0.5) * 110 } // vw, % of line height
}

/** The site's one licensed accident. The letters arrive out of order; drag
 *  them, or put them back. Everything else here was made on purpose. */
export default function NotFound() {
  const copy = useCopy()
  const c = copy.notFound
  const h = useSection('404', 'header')
  const { pathname } = useLocation()
  usePage({ page: '404', path: stripLocale(pathname).path, noindex: true })

  const letters = [...PHRASE]
  const [tidy, setTidy] = useState(false)
  const [moved, setMoved] = useState<Record<number, { x: number; y: number }>>({})
  const drag = useRef<{ i: number; sx: number; sy: number; ox: number; oy: number } | null>(null)

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      setMoved(m => ({ ...m, [d.i]: { x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) } }))
    }
    const up = () => (drag.current = null)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <Zone as="div" env="beet" className="lost">
      <main id="main" tabIndex={-1} className="wrap lost__in">
        {h?.eyebrow ? <p className="label">{h.eyebrow}</p> : null}
        <h1 className="phead__title lost__title">{h?.title}</h1>
        {h?.body ? <p className="t-lead dim lost__body">{h.body}</p> : null}

        <div className="lost__stage" aria-hidden="true" data-tidy={tidy || undefined}>
          {letters.map((ch, i) => {
            const s = scatter(i, letters.length)
            const m = moved[i]
            const style = tidy
              ? undefined
              : ({ transform: `translate(calc(${s.x}vw + ${m?.x ?? 0}px), calc(${s.y}% + ${m?.y ?? 0}px))` } as React.CSSProperties)
            return (
              <span
                key={i}
                className="lost__ch"
                data-space={ch === ' ' || undefined}
                style={style}
                onPointerDown={e => {
                  if (tidy) return
                  ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
                  drag.current = { i, sx: e.clientX, sy: e.clientY, ox: m?.x ?? 0, oy: m?.y ?? 0 }
                }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            )
          })}
        </div>

        <p className="t-caption dimmer lost__hint">{c.hint}</p>
        <div className="actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTidy(t => !t)
              setMoved({})
            }}
          >
            {tidy ? c.untidy : c.tidy}
          </button>
          <Link to="/" className="link-q go">
            {c.home}
          </Link>
          <Link to="/work" className="link-q go">
            {c.work}
          </Link>
        </div>
      </main>
    </Zone>
  )
}
