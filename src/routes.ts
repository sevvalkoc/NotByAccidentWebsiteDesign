/* The page map. Order here is the order of the menu sheet. */
export type PageKey = 'work' | 'caseStudies' | 'capabilities' | 'studio' | 'notes' | 'trainings' | 'reports' | 'contact' | 'search'

export const PAGES: { key: PageKey; path: string; soon?: boolean }[] = [
  { key: 'work', path: '/work' },
  { key: 'caseStudies', path: '/case-studies' },
  { key: 'capabilities', path: '/capabilities' },
  { key: 'studio', path: '/studio' },
  { key: 'notes', path: '/notes' },
  { key: 'trainings', path: '/trainings', soon: true },
  { key: 'reports', path: '/reports', soon: true },
  { key: 'contact', path: '/contact' },
  { key: 'search', path: '/search' },
]

export const groupAnchor = (category: string) =>
  category
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
