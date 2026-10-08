import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Img from './Img'
import type { MediaRef } from '@/content/types'

/* The slip, the site's signature interaction. Media is built from a few
   horizontal bands of the same image. On hover, focus or arrival, the bands
   jump out of register by a few percent and settle back, one after another:
   order → interruption → order. Never random: the offsets are fixed, so
   the accident is designed.

   Video plays as a single layer (five decoders for a flourish would be
   waste); it gets the arrival wipe instead. */

const BANDS = [
  { top: 0, bottom: 72, dx: '-3.2%' },
  { top: 28, bottom: 55, dx: '2.4%' },
  { top: 45, bottom: 38, dx: '-1.2%' },
  { top: 62, bottom: 17, dx: '4.1%' },
  { top: 83, bottom: 0, dx: '-2.2%' },
]

type Props = {
  media: MediaRef | null | undefined
  ratio?: number
  sizes?: string
  priority?: boolean
  className?: string
  /** 'hover' (default): slips on pointer/focus within the nearest link.
   *  'arrive': slips once when scrolled into view.
   *  'loop': slips on arrival, then every few seconds while visible. */
  trigger?: 'hover' | 'arrive' | 'loop'
  alt?: string
}

export default function Slip({ media, ratio, sizes, priority, className = '', trigger = 'hover', alt }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'still' | 'out'>('still')

  useEffect(() => {
    const el = ref.current
    if (!el || !media || media.kind === 'video') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t1 = 0
    const slip = () => {
      setState('out')
      window.clearTimeout(t1)
      t1 = window.setTimeout(() => setState('still'), 170)
    }
    const host = (el.closest('a, button') as HTMLElement | null) ?? el
    const cleanups: (() => void)[] = []
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

    if (trigger === 'hover' && canHover) {
      host.addEventListener('pointerenter', slip)
      host.addEventListener('focus', slip)
      cleanups.push(() => {
        host.removeEventListener('pointerenter', slip)
        host.removeEventListener('focus', slip)
      })
    } else {
      // Touch devices, 'arrive' and 'loop': slip as it comes into view.
      let visible = false
      let loop = 0
      const io = new IntersectionObserver(
        ([e]) => {
          visible = e.isIntersecting
          if (visible) window.setTimeout(slip, 250)
          if (trigger !== 'loop') {
            if (visible) io.disconnect()
            return
          }
          window.clearInterval(loop)
          if (visible) loop = window.setInterval(() => document.visibilityState === 'visible' && slip(), 6500)
        },
        { threshold: 0.4 },
      )
      io.observe(el)
      cleanups.push(() => {
        io.disconnect()
        window.clearInterval(loop)
      })
    }
    return () => {
      window.clearTimeout(t1)
      cleanups.forEach(c => c())
    }
  }, [media, trigger])

  if (!media) return <div ref={ref} className={`slip slip--empty ${className}`} style={ratio ? { aspectRatio: String(ratio) } : undefined} />

  const style = { ...(ratio ? { aspectRatio: String(ratio) } : {}), ...focal(media) } as CSSProperties
  const label = alt ?? media.alt

  if (media.kind === 'video') {
    return (
      <div ref={ref} className={`slip ${className}`} style={style}>
        <video src={media.url} poster={media.poster} muted loop playsInline autoPlay aria-label={label || undefined} preload="metadata" />
      </div>
    )
  }

  return (
    <div ref={ref} className={`slip ${className}`} style={style} data-slip={state === 'out' ? 'out' : undefined} role={label ? 'img' : undefined} aria-label={label || undefined}>
      {BANDS.map((b, i) => (
        <div
          key={i}
          className="slip__band"
          aria-hidden="true"
          style={{ '--top': `${b.top}%`, '--bottom': `${b.bottom}%`, '--dx': b.dx, '--i': i } as CSSProperties}
        >
          <Img src={media.url} alt="" ratio={ratio} sizes={sizes} priority={priority && i === 0} />
        </div>
      ))}
    </div>
  )
}

function focal(m: MediaRef): CSSProperties {
  if (m.focalX === undefined || m.focalY === undefined) return {}
  return { ['--fx' as string]: `${m.focalX * 100}%`, ['--fy' as string]: `${m.focalY * 100}%` }
}
