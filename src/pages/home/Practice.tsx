import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection, useSite } from '@/content'
import { groupAnchor } from '@/routes'

type Area = { key: string; label?: string; text?: string }

/** The practice, in five lines. Detail lives on /capabilities. */
export default function Practice() {
  const s = useSection('home', 'practice')
  const site = useSite()
  if (!s) return null
  const configured = (s.extra?.areas as Area[] | undefined) ?? []
  const areas = (configured.length ? configured : site.categories.map((c): Area => ({ key: c.key }))).map(a => {
    const cat = site.categories.find(c => c.key === a.key)
    return { key: a.key, label: a.label || cat?.label || a.key, text: a.text || cat?.blurb || '' }
  })

  return (
    <Zone env="frost" className="pr" labelledBy="practice-title">
      <div className="wrap">
        <header className="sec-head">
          {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
          <h2 id="practice-title" className="t-section sec-head__title">
            <Emph text={s.title} />
          </h2>
          {s.ctaLabel ? (
            <Cta url={s.ctaUrl} className="link-q go t-small sec-head__cta">
              {s.ctaLabel}
            </Cta>
          ) : null}
        </header>
        <ul role="list" className="pr__list">
          {areas.map(a => (
            <li key={a.key}>
              <Link to={`/capabilities#${groupAnchor(a.key)}`} className="pr__row">
                <span className="pr__name">{a.label}</span>
                <span className="pr__text dim">{a.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Zone>
  )
}
