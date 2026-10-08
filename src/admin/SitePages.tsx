import { useSearchParams } from 'react-router-dom'
import SiteEditor from '@/admin/SiteEditor'

/* Every new-site page except Home (which has its own screen) as tabs over
   the same editor. The tab lives in the URL (?page=studio) so a link can
   point straight at one page. */
const TABS = [
  { slug: 'work', label: 'Work' },
  { slug: 'case-studies', label: 'Case studies' },
  { slug: 'capabilities', label: 'Capabilities' },
  { slug: 'studio', label: 'Studio' },
  { slug: 'notes', label: 'Notes' },
  { slug: 'trainings', label: 'Trainings' },
  { slug: 'reports', label: 'Reports' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'cookies', label: 'Cookies' },
  { slug: '404', label: '404' },
]

export default function SitePages() {
  const [params, setParams] = useSearchParams()
  const active = TABS.find(t => t.slug === params.get('page'))?.slug ?? TABS[0]!.slug
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {TABS.map(t => (
          <button
            key={t.slug}
            type="button"
            onClick={() => setParams({ page: t.slug })}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${active === t.slug ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <SiteEditor key={active} slug={active} title={`Pages · ${TABS.find(t => t.slug === active)!.label}`} description="Headings, copy, images and SEO for this page. Save writes straight to the live site." />
    </div>
  )
}
