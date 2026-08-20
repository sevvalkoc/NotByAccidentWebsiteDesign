/* ── Locale routing ────────────────────────────────────────────────────────
   English lives unprefixed at the site root (/work, /studio, ...). Dutch and
   French live under /nl and /fr, mirroring the same route shapes. Locale is
   never admin-editable — see src/data.nl.ts / src/data.fr.ts and
   src/content.nl.ts / src/content.fr.ts for the static translated content
   this module switches between. */
import { createContext, useContext } from 'react'

export const LOCALES = ['en', 'nl', 'fr'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', nl: 'NL', fr: 'FR' }
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', nl: 'Nederlands', fr: 'Français' }

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)
export const LocaleProvider = LocaleContext.Provider

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

function isUnprefixable(path: string): boolean {
  return (
    /^[a-z][a-z0-9+.-]*:/i.test(path) || // absolute URL / protocol (http:, mailto:, tel:)
    path.startsWith('//') ||
    path.startsWith('#') ||
    path.startsWith('/admin')
  )
}

/** Prefixes an internal path with the current locale (/nl, /fr). English,
 *  external links, anchors and admin routes pass through unchanged. */
export function localizePath(path: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE || isUnprefixable(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `/${locale}${clean}`
}

/** Strips a leading /nl or /fr prefix, returning the underlying (English-shaped)
 *  path and the locale it was prefixed with. Used for hreflang/canonical math. */
export function stripLocalePrefix(pathname: string): { locale: Locale; path: string } {
  for (const l of LOCALES) {
    if (l === DEFAULT_LOCALE) continue
    if (pathname === `/${l}`) return { locale: l, path: '/' }
    if (pathname.startsWith(`/${l}/`)) return { locale: l, path: pathname.slice(l.length + 1) || '/' }
  }
  return { locale: DEFAULT_LOCALE, path: pathname }
}
