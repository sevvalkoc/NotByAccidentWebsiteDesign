/* Locale routing. English lives unprefixed; Dutch and French mirror every
   route under /nl and /fr with identical slugs, exactly as the previous
   site did, so no URL changes. */
import { createContext, useContext } from 'react'

export const LOCALES = ['en', 'nl', 'fr'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_LABEL: Record<Locale, string> = { en: 'EN', nl: 'NL', fr: 'FR' }
export const LOCALE_NAME: Record<Locale, string> = { en: 'English', nl: 'Nederlands', fr: 'Français' }
export const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', nl: 'nl_NL', fr: 'fr_FR' }
export const DATE_LOCALE: Record<Locale, string> = { en: 'en-GB', nl: 'nl-NL', fr: 'fr-FR' }

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)
export const LocaleProvider = LocaleContext.Provider
export const useLocale = () => useContext(LocaleContext)

const external = (p: string) => /^[a-z][a-z0-9+.-]*:/i.test(p) || p.startsWith('//') || p.startsWith('#') || p.startsWith('/admin')

export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || external(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

export function stripLocale(pathname: string): { locale: Locale; path: string } {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue
    if (pathname === `/${l}` || pathname === `/${l}/`) return { locale: l, path: '/' }
    if (pathname.startsWith(`/${l}/`)) return { locale: l, path: pathname.slice(l.length + 1) || '/' }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || '/' }
}
