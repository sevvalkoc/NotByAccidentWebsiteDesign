import type { ReactNode } from 'react'

export type Env = 'void' | 'frost' | 'mineral' | 'cool' | 'signal' | 'beet'

/** A zone of the page. While it holds the middle of the viewport, the whole
 *  page takes on its environment (see useEnvironment). Zones paint no
 *  background of their own, so the change reads as one world shifting. */
export default function Zone({
  as: Tag = 'section',
  env,
  id,
  label,
  labelledBy,
  className = '',
  children,
}: {
  as?: 'section' | 'header' | 'div' | 'footer' | 'nav' | 'article'
  env: Env
  id?: string
  label?: string
  labelledBy?: string
  className?: string
  children: ReactNode
}) {
  return (
    <Tag id={id} data-zone={env} aria-label={label} aria-labelledby={labelledBy} className={className}>
      {children}
    </Tag>
  )
}
