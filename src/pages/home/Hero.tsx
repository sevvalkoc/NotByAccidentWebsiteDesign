import { useEffect, useState } from 'react'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import StudioClock from '@/components/StudioClock'
import { Cta, plain } from '@/components/Rich'
import { useCopy, useSection, useSite } from '@/content'
import type { MediaRef } from '@/content/types'

/** The previous site's line, kept: "We make companies wanted.", with the
 *  last word turning over (chosen, remembered, recommended). The word is
 *  the *emphasised* one in the CMS title; the others come from extra.words. */
export default function Hero() {
  const s = useSection('home', 'hero')
  const site = useSite()
  const copy = useCopy()
  const title = s?.title ?? ''
  const m = /^(.*?)\*([^*]+)\*(.*)$/.exec(title)
  const before = m ? m[1] : title
  const first = m ? m[2] : ''
  const after = m ? m[3] : ''
  const extra = (s?.extra?.words as string[] | undefined) ?? []
  const words = first ? [first, ...extra.filter(w => w && w !== first)] : []
  const [i, setI] = useState(0)

  useEffect(() => {
    if (words.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => document.visibilityState === 'visible' && setI(n => (n + 1) % words.length), 3200)
    return () => window.clearInterval(id)
  }, [words.length])

  if (!s) return null
  const video: MediaRef | null = s.videoUrl ? { url: s.videoUrl, alt: s.image?.alt ?? '', kind: 'video', poster: s.image?.url } : null
  const media = video ?? s.image ?? (site.projects[0] ? { url: site.projects[0].heroImg, alt: site.projects[0].name, kind: 'image' as const } : null)
  const cta2Label = s.extra?.cta2Label as string | undefined
  const cta2Url = s.extra?.cta2Url as string | undefined

  return (
    <Zone env="void" className="hero" labelledBy="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__text">
          {s.eyebrow ? <p className="label hero__eyebrow">{s.eyebrow}</p> : null}
          <h1 id="hero-title" className="hero__title serif">
            {/* Screen readers get the sentence once, not every turn of the word. */}
            <span className="sr-only">{plain(title)}</span>
            <span aria-hidden="true">
              {before}
              {words.length ? (
                <em key={words[i]} className="hero__word">
                  {words[i]}
                </em>
              ) : null}
              {after}
            </span>
          </h1>
          {s.subtitle ? <p className="t-lead dim hero__lead">{s.subtitle}</p> : null}
          <p className="hero__ctas">
            {s.ctaLabel ? (
              <Cta url={s.ctaUrl} className="btn">
                {s.ctaLabel}
              </Cta>
            ) : null}
            {cta2Label ? (
              <Cta url={cta2Url} className="link-q go">
                {cta2Label}
              </Cta>
            ) : null}
          </p>
        </div>
        <figure className="hero__media">
          <Slip media={media} trigger="loop" priority sizes="(min-width: 1024px) 40vw, 92vw" />
          <figcaption className="hero__cap t-caption">
            <StudioClock className="dimmer hero__clock" />
          </figcaption>
        </figure>
        <span className="hero__scroll t-micro dimmer" aria-hidden="true">
          {copy.home.scroll}
        </span>
      </div>
    </Zone>
  )
}
