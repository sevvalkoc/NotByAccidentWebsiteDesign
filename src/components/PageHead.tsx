import type { ReactNode } from 'react'
import Link from './Link'
import Zone, { type Env } from './Zone'
import { Emph } from './Rich'
import { useCopy, useSection } from '@/content'
import { breadcrumbs } from '@/seo/schema'
import type { Locale } from '@/i18n/locale'
import type { PageSlug } from '@/content/types'

export type Crumb = { name: string; path: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const copy = useCopy()
  return (
    <nav aria-label={copy.nav.breadcrumb} className="crumbs t-caption">
      <ol role="list">
        {items.map((c, i) => (
          <li key={c.path}>
            {i < items.length - 1 ? (
              <Link to={c.path} className="link-q">
                {c.name}
              </Link>
            ) : (
              <span aria-current="page">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const crumbSchema = (items: Crumb[], locale: Locale) => breadcrumbs(items, locale)

/** The opening of an inner page. Reads the page's `header` section from the
 *  CMS unless a title is passed in (records: a case, a note). */
export default function PageHead({
  page,
  title,
  eyebrow,
  sub,
  env = 'frost',
  crumbs,
  aside,
  children,
}: {
  page?: PageSlug
  title?: string
  eyebrow?: string
  sub?: ReactNode
  env?: Env
  crumbs?: Crumb[]
  aside?: ReactNode
  children?: ReactNode
}) {
  const s = useSection(page ?? '404', 'header')
  const h = page ? s : null
  const t = title ?? h?.title
  const e = eyebrow ?? h?.eyebrow
  const subline = sub ?? h?.subtitle
  return (
    <Zone as="header" env={env} className="phead">
      <div className="wrap">
        <div className="phead__top">
          {crumbs ? <Breadcrumbs items={crumbs} /> : e ? <span className="label">{e}</span> : <span />}
          {aside ? <span className="t-caption dimmer">{aside}</span> : null}
        </div>
        <h1 className="phead__title">
          <span className="rise">
            <span>
              <Emph text={t} />
            </span>
          </span>
        </h1>
        {subline ? <div className="phead__sub t-lead dim">{subline}</div> : null}
        {children}
      </div>
    </Zone>
  )
}
