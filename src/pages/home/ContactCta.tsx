import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection, useSite } from '@/content'

export default function ContactCta() {
  const s = useSection('home', 'contact')
  const site = useSite()
  if (!s) return null
  return (
    <Zone env="signal" className="cc" labelledBy="contact-title">
      <div className="wrap cc__grid">
        {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
        <h2 id="contact-title" className="t-display cc__title">
          <Emph text={s.title} />
        </h2>
        <div className="cc__foot">
          <a href={`mailto:${site.company.newBusinessEmail}`} className="cc__mail link">
            {site.company.newBusinessEmail}
          </a>
          {s.body ? <p className="t-small dim">{s.body}</p> : null}
          {s.ctaLabel ? (
            <Cta url={s.ctaUrl} className="btn">
              {s.ctaLabel}
            </Cta>
          ) : null}
        </div>
      </div>
    </Zone>
  )
}
