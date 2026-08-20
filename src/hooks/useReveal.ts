import { useEffect } from 'react'

/* Scroll-in animation for anything with the `.reveal` class (see .reveal /
   .in-view in src/index.css). A plain one-shot querySelectorAll would miss
   any element that mounts *after* the initial scan — which matters a lot
   here, because every list page (Work, Case Studies, Blog…) starts from
   src/data.ts's static seed and swaps in live Supabase rows once they load.
   Live rows carry different ids than the seed, so React remounts those DOM
   nodes; without the MutationObserver below, anything that (re)mounts after
   first paint gets stuck at opacity:0 forever — present in the DOM, but
   invisible, indistinguishable from actually-empty content. */
export function useReveal(ref: React.RefObject<HTMLElement | null>, options: IntersectionObserverInit = { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }) {
  useEffect(() => {
    if (!ref.current) return
    const seen = new WeakSet<Element>()
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view')
          io.unobserve(e.target)
        }
      })
    }, options)
    function scan(root: Element) {
      root.querySelectorAll('.reveal').forEach(el => {
        if (!seen.has(el)) {
          seen.add(el)
          io.observe(el)
        }
      })
    }
    scan(ref.current)
    const mo = new MutationObserver(() => ref.current && scan(ref.current))
    mo.observe(ref.current, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref])
}
