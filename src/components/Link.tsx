import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { localizePath, useLocale } from '@/i18n/locale'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string; raw?: boolean }

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Internal link. Localises the path and, where the browser supports View
 *  Transitions, pushes the next page in as a sheet (see base.css). */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ to, raw, onClick, ...rest }, ref) {
  const locale = useLocale()
  const navigate = useNavigate()
  const href = raw ? to : localizePath(to, locale)

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== '_self') return
    if (/^[a-z]+:/i.test(href) || href.startsWith('#')) return
    e.preventDefault()
    const [path, hash] = href.split('#')
    if (path === window.location.pathname && hash) {
      document.getElementById(hash)?.scrollIntoView()
      history.replaceState(null, '', href)
      return
    }
    const go = () => {
      flushSync(() => navigate(href))
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
      else window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
    if (doc.startViewTransition && !reduced()) doc.startViewTransition(go)
    else go()
  }

  return <a ref={ref} href={href} onClick={handle} {...rest} />
})

export default Link
