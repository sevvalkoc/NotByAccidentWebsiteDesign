import { Fragment, type ReactNode } from 'react'
import Link from './Link'

/** Renders CMS text where *a word* in asterisks becomes the serif accent. */
export function Emph({ text }: { text?: string }) {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('*') && p.endsWith('*') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  )
}

/** Plain text for places that can't hold markup (meta tags, aria). */
export const plain = (text?: string) => (text ?? '').replace(/\*([^*]+)\*/g, '$1')

/** A CMS-provided link: internal paths get the sheet transition and the
 *  locale prefix; anchors and external URLs behave natively. */
export function Cta({ url, className, children }: { url?: string; className?: string; children: ReactNode }) {
  if (!url) return null
  if (url.startsWith('#')) return <a href={url} className={className}>{children}</a>
  if (/^(https?:|mailto:|tel:)/.test(url))
    return (
      <a href={url} className={className} {...(url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  return <Link to={url} className={className}>{children}</Link>
}
