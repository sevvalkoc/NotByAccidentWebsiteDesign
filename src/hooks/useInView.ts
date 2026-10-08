import { useEffect, useRef, useState } from 'react'

/** True once the element has entered the viewport (or immediately when
 *  IntersectionObserver is unavailable). Server renders false-safe content:
 *  callers must render everything visible without JS (see .cut in motion.css). */
export function useInView<T extends Element>(options: IntersectionObserverInit = { rootMargin: '0px 0px -12% 0px' }, once = true) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return setInView(true)
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        if (once) io.disconnect()
      } else if (!once) setInView(false)
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView] as const
}

/** Global: marks [data-cut] elements as they arrive, so CSS can cross-cut
 *  them in. One observer for the whole page instead of one per element. */
export function useCuts(dep: unknown) {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js-cuts')
    const els = document.querySelectorAll<HTMLElement>('[data-cut]:not([data-cut="in"])')
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => (el.dataset.cut = 'in'))
      return
    }
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const el = e.target as HTMLElement
          el.dataset.cut = 'in'
          io.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}
