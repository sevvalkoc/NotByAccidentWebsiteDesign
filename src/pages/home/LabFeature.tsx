import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection } from '@/content'

const STEPS = ['Validate', 'Understand', 'Match', 'Act']

/** The Lab, in one compact band. Admin → Homepage → The Lab. */
export default function LabFeature() {
  const s = useSection('home', 'lab')
  if (!s) return null
  const extra = (s.extra ?? {}) as { cta2Label?: string; cta2Url?: string }
  return (
    <Zone env="mineral" className="lf" labelledBy="lab-feature-title">
      <div className="wrap lf__grid">
        <div className="lf__text">
          {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
          <h2 id="lab-feature-title" className="t-section lf__title">
            <Emph text={s.title} />
          </h2>
          {s.body ? <p className="t-lead dim lf__body">{s.body}</p> : null}
          <div className="actions lf__actions">
            {s.ctaLabel ? (
              <Cta url={s.ctaUrl} className="btn">
                {s.ctaLabel}
              </Cta>
            ) : null}
            {extra.cta2Label ? (
              <Cta url={extra.cta2Url} className="link-q">
                {extra.cta2Label}
              </Cta>
            ) : null}
          </div>
        </div>
        <ol role="list" className="lf__steps" aria-label="What The Lab does">
          {STEPS.map((x, i) => (
            <li key={x}>
              <span className="t-num dimmer">{String(i + 1).padStart(2, '0')}</span>
              <span className="t-title">{x}</span>
            </li>
          ))}
        </ol>
      </div>
    </Zone>
  )
}
