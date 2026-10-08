import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection } from '@/content'
import type { MediaRef } from '@/content/types'

export default function StudioStatement() {
  const s = useSection('home', 'studio')
  if (!s) return null
  const media: MediaRef | null = s.videoUrl ? { url: s.videoUrl, alt: '', kind: 'video', poster: s.image?.url } : (s.image ?? null)
  return (
    <Zone env="cool" className="st" labelledBy="studio-title">
      <div className="wrap st__grid">
        {media ? (
          <div className="st__media">
            <Slip media={media} ratio={4 / 5} trigger="arrive" sizes="(min-width: 1024px) 34vw, 80vw" />
          </div>
        ) : null}
        <div className="st__text">
          {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
          <h2 id="studio-title" className="t-section">
            <Emph text={s.title} />
          </h2>
          {s.body ? <p className="t-lead dim">{s.body}</p> : null}
          {s.ctaLabel ? (
            <Cta url={s.ctaUrl} className="link-q go t-small">
              {s.ctaLabel}
            </Cta>
          ) : null}
        </div>
      </div>
    </Zone>
  )
}
