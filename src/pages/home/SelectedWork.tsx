import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useCopy, useSection, useSite } from '@/content'
import type { MediaRef, Project } from '@/content/types'

/* Four compositions, never the same twice: wide, tall and offset, tall and
   pulled up, wide and late. Ratios follow the guidelines (3:2, 4:5) plus one
   cinematic 16:10. */
const LAYOUT = [
  { ratio: 3 / 2, cls: 'sw--a' },
  { ratio: 4 / 5, cls: 'sw--b' },
  { ratio: 4 / 5, cls: 'sw--c' },
  { ratio: 16 / 10, cls: 'sw--d' },
  { ratio: 3 / 2, cls: 'sw--e' },
]

export const projectMedia = (p: Project): MediaRef => (p.heroVideo ? { url: p.heroVideo, alt: p.name, kind: 'video', poster: p.heroImg } : { url: p.heroImg || p.img, alt: `${p.name}: ${p.brief}`, kind: 'image' })

/** Selected work: chosen and ordered in Admin → Homepage. The work does
 *  the selling, so it gets the most room on the page. */
export default function SelectedWork() {
  const s = useSection('home', 'work')
  const site = useSite()
  const copy = useCopy()
  if (!s) return null
  const chosen = ((s.extra?.projects as string[] | undefined) ?? []).map(slug => site.projects.find(p => p.slug === slug)).filter((p): p is Project => Boolean(p))
  const projects = (chosen.length ? chosen : site.projects.filter(p => p.narrative)).slice(0, 5)

  return (
    <Zone env="mineral" id="work" className="sw" labelledBy="work-title">
      <div className="wrap">
        <header className="sec-head">
          {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
          <h2 id="work-title" className="t-section sec-head__title">
            <Emph text={s.title} />
          </h2>
          {s.ctaLabel ? (
            <Cta url={s.ctaUrl} className="link-q go t-small sec-head__cta">
              {s.ctaLabel}
            </Cta>
          ) : null}
        </header>
        <div className="sw__grid">
          {projects.map((p, i) => {
            const l = LAYOUT[i % LAYOUT.length]
            return (
              <article key={p.slug} className={`sw__item ${l.cls}`}>
                <Link to={`/case-studies/${p.slug}`} className="sw__link">
                  <div className="sw__frame">
                    <Slip media={projectMedia(p)} ratio={l.ratio} sizes="(min-width: 1024px) 60vw, 92vw" alt="" />
                    <span className="sw__view t-caption" aria-hidden="true">
                      {copy.home.viewCase}
                    </span>
                  </div>
                  <div className="sw__cap">
                    <h3 className="t-title">{p.name}</h3>
                    <p className="t-small dim">{p.brief}</p>
                    <p className="t-caption dimmer">
                      {p.discipline}
                      {p.year ? ` · ${p.year}` : ''}
                    </p>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </Zone>
  )
}
