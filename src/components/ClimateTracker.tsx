import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCopy } from '@/content'
import { useLocale } from '@/i18n/locale'
import carbon from '@/content/carbon.json'

type Reading = { bytes: number; grams: number; grade: string; unmeasured: number }

/* Bytes a resource cost on a first visit: what crossed the network, or its
   compressed size when it came from cache. Cross-origin files that don't
   send Timing-Allow-Origin report 0 for both and are counted separately. */
const sizeOf = (e: PerformanceResourceTiming) => Math.max(e.transferSize || 0, e.encodedBodySize || 0)

const gradeFor = (g: number) => carbon.scale.find(s => s.max === null || g <= s.max)!.grade

/** The live weight and carbon of the page being read. Starts measuring at
 *  load and keeps counting as lazy images and data arrive; a client-side
 *  route change starts a fresh page. Factor and scale come from CO2.js at
 *  build time (scripts/carbon-factor.mjs). */
function useCarbonReading(): Reading | null {
  const { pathname } = useLocation()
  const [reading, setReading] = useState<Reading | null>(null)
  const firstPage = useRef(true)

  useEffect(() => {
    if (typeof PerformanceObserver === 'undefined' || !performance.getEntriesByType) return
    performance.setResourceTimingBufferSize?.(2000)
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    // The first page owns the document request; later pages start from the route change.
    const t0 = firstPage.current ? 0 : performance.now()
    firstPage.current = false
    let raf = 0
    const measure = () => {
      raf = 0
      const entries = (performance.getEntriesByType('resource') as PerformanceResourceTiming[]).filter(e => e.startTime >= t0)
      let bytes = t0 === 0 && nav ? sizeOf(nav) : 0
      let unmeasured = 0
      for (const e of entries) {
        const b = sizeOf(e)
        if (b) bytes += b
        else unmeasured++
      }
      const grams = bytes * carbon.gramsPerByte
      setReading({ bytes, grams, grade: gradeFor(grams), unmeasured })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure)
    }
    const po = new PerformanceObserver(schedule)
    po.observe({ type: 'resource', buffered: true })
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => {
      po.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('load', schedule)
    }
  }, [pathname])

  return reading
}

export default function ClimateTracker() {
  const copy = useCopy()
  const locale = useLocale()
  const r = useCarbonReading()
  const c = copy.climate
  const num = (n: number, d: number) => n.toLocaleString(locale, { minimumFractionDigits: d, maximumFractionDigits: d })

  return (
    <div className="climate">
      <p className="t-caption dimmer climate__label">{c.label}</p>
      {r ? (
        <p className="climate__value">
          <span className="t-num climate__g">{num(r.grams, r.grams < 0.1 ? 3 : 2)}</span> {c.unit}
          <span className="t-caption dim climate__meta">
            {' '}
            {c.perView} · {num(r.bytes / 1000, 0)} kB
          </span>
        </p>
      ) : (
        <p className="t-small dim climate__value">{c.measuring}</p>
      )}
      <ol role="list" className="climate__scale" aria-label={c.scale}>
        {carbon.scale.map(s => (
          <li key={s.grade} className="climate__grade" data-on={r?.grade === s.grade || undefined} aria-current={r?.grade === s.grade ? 'true' : undefined}>
            {s.grade}
          </li>
        ))}
      </ol>
      <details className="climate__how">
        <summary className="t-caption">{c.how}</summary>
        <div className="t-caption dim climate__text">
          <p>{c.method}</p>
          <p>{c.why}</p>
          {r?.unmeasured ? <p>{c.unmeasured(r.unmeasured)}</p> : null}
          <p className="dimmer">
            {carbon.model} · {carbon.library}
          </p>
        </div>
      </details>
    </div>
  )
}
