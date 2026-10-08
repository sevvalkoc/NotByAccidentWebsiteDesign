import { useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Link from '@/components/Link'
import Slip from '@/components/Slip'
import Zone from '@/components/Zone'
import NotFound from './NotFound'
import { getSite, useCopy, useSite } from '@/content'
import type { Note as NoteT } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { article, isoDate } from '@/seo/schema'
import './misc.css'

export default function Note() {
  const { slug } = useParams()
  const site = useSite()
  const n = site.notes.find(x => x.slug === slug)
  if (!n) return <NotFound />
  return <NoteView key={n.slug} slug={n.slug} />
}

function Body({ note, videoLabel }: { note: NoteT; videoLabel: string }) {
  if (note.blocks?.length) {
    return (
      <>
        {note.blocks.map((b, i) => {
          switch (b.type) {
            case 'h2':
              return <h2 key={i}>{b.text}</h2>
            case 'h3':
              return <h3 key={i}>{b.text}</h3>
            case 'quote':
              return <blockquote key={i}>{b.text}</blockquote>
            case 'callout':
              return (
                <p key={i} className="callout">
                  {b.text}
                </p>
              )
            case 'list':
              return b.ordered ? <ol key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ol> : <ul key={i}>{b.items.map((x, j) => <li key={j}>{x}</li>)}</ul>
            case 'image':
              return (
                <figure key={i}>
                  <img src={b.url} alt={b.caption ?? ''} loading="lazy" />
                  {b.caption ? <figcaption className="t-caption dimmer">{b.caption}</figcaption> : null}
                </figure>
              )
            case 'divider':
              return <hr key={i} />
            case 'embed':
              return (
                <div key={i} className="note__embed">
                  <iframe src={b.url} title={videoLabel} loading="lazy" allowFullScreen />
                </div>
              )
            default:
              return <p key={i}>{(b as { text: string }).text}</p>
          }
        })}
      </>
    )
  }
  return (
    <>
      {note.body.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </>
  )
}

function NoteView({ slug }: { slug: string }) {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const c = copy.note
  const idx = site.notes.findIndex(x => x.slug === slug)
  const n = site.notes[idx]
  const next = site.notes[(idx + 1) % site.notes.length]
  const bar = useRef<HTMLDivElement>(null)
  const iso = isoDate(getSite('en').notes.find(x => x.slug === slug)?.date ?? n.date)
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.notes, path: '/notes' },
    { name: n.title, path: `/notes/${n.slug}` },
  ]
  usePage({
    path: `/notes/${n.slug}`,
    title: n.title,
    description: n.subtitle,
    seo: n.seo,
    image: n.img,
    imageAlt: n.title,
    type: 'article',
    publishedTime: iso,
    jsonLd: [article(n, locale, iso), crumbSchema(crumbs, locale)],
  })

  useEffect(() => {
    const el = bar.current
    const body = document.getElementById('note-body')
    if (!el || !body) return
    let raf = 0
    const draw = () => {
      raf = 0
      const r = body.getBoundingClientRect()
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height))})`
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', on, { passive: true })
    return () => {
      window.removeEventListener('scroll', on)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <main id="main" tabIndex={-1} className="note">
      <div ref={bar} className="note__progress" aria-hidden="true" />
      <article aria-labelledby="note-title">
        <PageHead
          title={n.title}
          crumbs={crumbs}
          sub={n.subtitle}
          aside={
            <>
              {n.category}
              {n.readTime ? ` · ${n.readTime} ${copy.notes.read}` : ''}
            </>
          }
        >
          <p className="t-caption dimmer note__date">
            {c.published} <time dateTime={iso}>{n.date}</time>
          </p>
        </PageHead>
        {n.img ? (
          <Zone env="frost" className="wrap">
            <Slip media={{ url: n.img, alt: '', kind: 'image' }} ratio={16 / 9} trigger="arrive" priority sizes="(min-width: 1440px) 1100px, 92vw" className="note__hero" />
          </Zone>
        ) : null}
        <Zone env="frost" className="wrap note__wrap">
          <div id="note-body" className="prose note__body">
            <Body note={n} videoLabel={c.video} />
          </div>
          {n.tags?.length ? (
            <p className="t-caption dimmer note__tags">{n.tags.map(t => `#${t}`).join('  ')}</p>
          ) : null}
        </Zone>
      </article>
      {next && next.slug !== n.slug ? (
        <Zone as="nav" env="frost" className="note__next" label={c.next}>
          <Link to={`/notes/${next.slug}`} className="wrap note__next-link">
            <span className="label">{c.next}</span>
            <span className="t-section">{next.title}</span>
          </Link>
        </Zone>
      ) : null}
    </main>
  )
}
