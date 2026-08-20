/* Drop-in replacements for react-router-dom's Link/Navigate/useNavigate that
   automatically prefix internal paths with the current locale (/nl, /fr).
   Public pages import Link/Navigate from here instead of react-router-dom
   directly; everything else about their usage is identical. */
import { forwardRef } from 'react'
import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  useNavigate as useRouterNavigate,
  type LinkProps,
  type NavigateProps,
} from 'react-router-dom'
import { localizePath, useLocale } from '@/i18n/locale'

const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ to, ...rest }, ref) {
  const locale = useLocale()
  const href = typeof to === 'string' ? localizePath(to, locale) : to
  return <RouterLink ref={ref} to={href} {...rest} />
})
export default Link

export function Navigate({ to, ...rest }: NavigateProps) {
  const locale = useLocale()
  const href = typeof to === 'string' ? localizePath(to, locale) : to
  return <RouterNavigate to={href} {...rest} />
}

export function useLocalizedNavigate() {
  const locale = useLocale()
  const navigate = useRouterNavigate()
  return (to: string, opts?: { replace?: boolean; state?: unknown }) => navigate(localizePath(to, locale), opts)
}
