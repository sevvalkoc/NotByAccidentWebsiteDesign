import { useEffect } from 'react'

/** Sets <body data-env> to the zone holding the reading line (40% down the
 *  viewport). Colours are registered custom properties, so the change
 *  transitions instead of cutting. */
export function useEnvironment(dep: unknown) {
  useEffect(() => {
    let raf = 0
    const pick = () => {
      raf = 0
      const line = window.innerHeight * 0.4
      let env: string | undefined
      for (const z of document.querySelectorAll<HTMLElement>('[data-zone]')) {
        const r = z.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) env = z.dataset.zone
      }
      if (!env) env = document.querySelector<HTMLElement>('[data-zone]')?.dataset.zone
      if (env && document.body.dataset.env !== env) document.body.dataset.env = env
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(pick)
    }
    pick()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
      cancelAnimationFrame(raf)
    }
  }, [dep])
}
