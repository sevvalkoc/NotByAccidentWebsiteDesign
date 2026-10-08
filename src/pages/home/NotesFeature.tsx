import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection, useSite } from '@/content'
import type { Note } from '@/content/types'

export default function NotesFeature() {
  const s = useSection('home', 'notes')
  const site = useSite()
  if (!s) return null
  const chosen = ((s.extra?.notes as string[] | undefined) ?? []).map(slug => site.notes.find(n => n.slug === slug)).filter((n): n is Note => Boolean(n))
  const notes = (chosen.length ? chosen : site.notes).slice(0, 3)
  if (!notes.length) return null
  return (
    <Zone env="frost" className="nf" labelledBy="notes-title">
      <div className="wrap">
        <header className="sec-head">
          {s.eyebrow ? <p className="label">{s.eyebrow}</p> : null}
          <h2 id="notes-title" className="t-section sec-head__title">
            <Emph text={s.title} />
          </h2>
          {s.ctaLabel ? (
            <Cta url={s.ctaUrl} className="link-q go t-small sec-head__cta">
              {s.ctaLabel}
            </Cta>
          ) : null}
        </header>
        <ol role="list" className="nf__list">
          {notes.map(n => (
            <li key={n.slug}>
              <Link to={`/notes/${n.slug}`} className="nf__row">
                {n.img ? <Slip media={{ url: n.img, alt: '', kind: 'image' }} ratio={4 / 3} sizes="(min-width: 1024px) 160px, 96px" className="nf__thumb" /> : <span className="nf__thumb" />}
                <span className="t-title nf__title">{n.title}</span>
                <span className="t-caption dimmer nf__date">{n.date}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </Zone>
  )
}
