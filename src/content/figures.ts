import type { Locale } from '@/i18n/locale'
import type { Figure, Project } from './types'

/* One figure per case, lifted verbatim from the outcome each case already
   states on the current site. If a CMS-edited case has no entry here, the
   first percentage in its result line is used; failing that, no figure. */
const FIGURES: Record<Locale, Record<string, Figure>> = {
  en: {
    lavanta: { value: '+34%', label: 'conversion in six months' },
    'studio-marche': { value: '+22%', label: 'footfall' },
    edde: { value: '+41%', label: 'repeat purchase among customers over fifty' },
    hinterland: { value: '12', label: 'venues, three cities, one brand' },
  },
  nl: {
    lavanta: { value: '+34%', label: 'conversie in zes maanden' },
    'studio-marche': { value: '+22%', label: 'bezoekersaantal' },
    edde: { value: '+41%', label: 'herhaalaankopen bij klanten boven de vijftig' },
    hinterland: { value: '12', label: 'locaties, drie steden, één merk' },
  },
  fr: {
    lavanta: { value: '+34 %', label: 'de conversion en six mois' },
    'studio-marche': { value: '+22 %', label: 'de fréquentation' },
    edde: { value: '+41 %', label: 'de réachat chez les clients de plus de cinquante ans' },
    hinterland: { value: '12', label: 'lieux, trois villes, une seule marque' },
  },
}

export function figureFor(p: Project, locale: Locale): Figure | null {
  const known = FIGURES[locale][p.slug]
  if (known) return known
  const m = p.result.match(/[+−-]?\d+(?:[.,]\d+)?\s?%/)
  return m ? { value: m[0], label: p.result.replace(m[0], '').replace(/^[\s,.;:]+/, '').trim() } : null
}
