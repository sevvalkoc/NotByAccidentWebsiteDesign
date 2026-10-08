import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import Zone from '@/components/Zone'
import Link from '@/components/Link'
import { figureFor, useCopy, useSection, useSite } from '@/content'
import { useLocale } from '@/i18n/locale'
import type { Project } from '@/content/types'

/** Every client voice, one at a time with arrows, beside three results.
 *  Starts on the testimonial picked in Admin → Homepage. */
export default function Evidence() {
  const s = useSection('home', 'evidence')
  const work = useSection('home', 'work')
  const site = useSite()
  const copy = useCopy()
  const locale = useLocale()
  const voices = site.testimonials
  const startAt = Math.max(0, voices.findIndex(x => x.name === (s?.extra?.testimonial as string | undefined)))
  const [i, setI] = useState(startAt)
  const swipeX = useRef<number | null>(null)
  if (!s) return null
  const n = voices.length
  const go = (d: number) => setI(k => (k + d + n) % n)
  const t = voices[i % Math.max(n, 1)]
  const chosen = ((work?.extra?.projects as string[] | undefined) ?? []).map(slug => site.projects.find(p => p.slug === slug)).filter((p): p is Project => Boolean(p))
  const figures = (chosen.length ? chosen : site.projects)
    .map(p => ({ p, f: figureFor(p, locale) }))
    .filter(x => x.f)
    .slice(0, 3)

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const onDown = (e: PointerEvent) => (swipeX.current = e.clientX)
  const onUp = (e: PointerEvent) => {
    if (swipeX.current === null) return
    const dx = e.clientX - swipeX.current
    swipeX.current = null
    if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1)
  }

  return (
    <Zone env="void" className="ev" label={s.eyebrow || undefined}>
      <div className="wrap ev__grid">
        {s.eyebrow ? <p className="label ev__label">{s.eyebrow}</p> : null}
        {t ? (
          <section className="ev__voices" aria-roledescription="carousel" aria-label={copy.home.voices} onKeyDown={onKey} onPointerDown={onDown} onPointerUp={onUp}>
            <figure key={i} className="ev__voice" aria-live="polite" aria-atomic="true">
              <blockquote className="ev__quote serif">
                <p>“{t.quote}”</p>
              </blockquote>
              <figcaption className="t-small dim">
                <span className="ev__who">{t.name}</span>
                {t.role ? `, ${t.role}` : ''}
                {t.company ? `, ${t.company}` : ''}
              </figcaption>
            </figure>
            {n > 1 ? (
              <div className="ev__nav">
                <button type="button" className="ev__arrow" onClick={() => go(-1)} aria-label={copy.home.prevVoice}>
                  <span aria-hidden="true">←</span>
                </button>
                <span className="t-caption dim ev__count" aria-hidden="true">
                  {copy.home.of(i + 1, n)}
                </span>
                <button type="button" className="ev__arrow" onClick={() => go(1)} aria-label={copy.home.nextVoiceLabel}>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : null}
          </section>
        ) : null}
        <ul role="list" className="ev__figs">
          {figures.map(({ p, f }) => (
            <li key={p.slug}>
              <Link to={`/case-studies/${p.slug}`} className="ev__fig">
                <span className="ev__v t-num">{f!.value}</span>
                <span className="t-small dim">{f!.label}</span>
                <span className="t-caption dimmer">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Zone>
  )
}
