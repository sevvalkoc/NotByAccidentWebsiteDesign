/* The signed-in Lab. Loaded on demand (its own chunk) under /lab/*; the
   host serves the prerendered /lab/app shell for every such URL. Pages use
   query parameters (?id=…) rather than path segments so one shell serves
   them all. Nothing here is indexed. */
import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Link from '@/components/Link'
import Zone from '@/components/Zone'
import { usePage } from '@/hooks/usePage'
import { CONSENT_VERSION, labSignOut, q, reloadBoot, selectBrand, useBrandId, useLabSession, NOT_CONFIGURED } from '../api'
import { Loading, Notice, useAction } from '../ui'
import Dashboard from './Dashboard'
import BrandScreen from './Brand'
import Assessment from './Assessment'
import Results from './Results'
import Markets from './Markets'
import Matches from './Matches'
import Opportunities from './Opportunities'
import Reports from './Reports'
import Settings from './Settings'
import '../lab.css'

const NAV = [
  { to: '/lab/dashboard', label: 'Overview' },
  { to: '/lab/brand', label: 'Brand' },
  { to: '/lab/assessment', label: 'Readiness' },
  { to: '/lab/markets', label: 'Markets' },
  { to: '/lab/matches', label: 'Matches' },
  { to: '/lab/opportunities', label: 'Opportunities' },
  { to: '/lab/reports', label: 'Reports' },
  { to: '/lab/settings', label: 'Settings' },
]

/** Head for a private Lab screen: always noindex. */
export function useAppPage(title: string, path: string) {
  usePage({ title: `${title} · The Lab`, description: 'Your workspace in The Lab by Not by Accident.', path, noindex: true, alternates: false })
}

export function AppHead({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <header className="lab-apphead">
      {eyebrow ? <p className="label">{eyebrow}</p> : null}
      <h1 className="t-section lab-apphead__title">{title}</h1>
      {children ? <div className="lab-apphead__more">{children}</div> : null}
    </header>
  )
}

function SubNav() {
  const { pathname } = useLocation()
  const s = useLabSession()
  const brandId = useBrandId()
  const brands = s.boot?.brands ?? []
  const active = (to: string) => pathname === to || (to === '/lab/assessment' && pathname === '/lab/results')
  return (
    <nav className="lab-subnav" aria-label="The Lab">
      <div className="wrap lab-subnav__row">
        <ul role="list" className="lab-subnav__list">
          {NAV.map(n => (
            <li key={n.to}>
              <Link to={n.to} className="link-q" aria-current={active(n.to) ? 'page' : undefined}>
                {n.label}
                {n.to === '/lab/dashboard' && s.boot?.unread ? (
                  <span className="lab-count" aria-label={`${s.boot.unread} unread updates`}>
                    {s.boot.unread}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
        <div className="lab-subnav__side t-caption">
          {brands.length > 1 ? (
            <label className="lab-brandpick">
              <span className="sr-only">Brand</span>
              <select className="input" value={brandId ?? ''} onChange={e => selectBrand(e.target.value)}>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>
          ) : brands[0] ? (
            <span className="dimmer">{brands[0].name}</span>
          ) : null}
          {s.boot?.is_admin ? (
            <a href="/admin/lab" className="link-q dimmer">
              Admin
            </a>
          ) : null}
          <button type="button" className="link-q dimmer" onClick={() => void labSignOut()}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  )
}

/** Accounts created outside the Lab sign-up (for example CMS staff) haven't
 *  accepted the Lab's data use yet: ask once, record it, carry on. */
function JoinLab() {
  const s = useLabSession()
  const [marketing, setMarketing] = useState(false)
  const [sharing, setSharing] = useState(false)
  const a = useAction()
  useAppPage('Welcome', '/lab/dashboard')
  async function join() {
    const uid = s.session!.user.id
    await a.run(async () => {
      await q(c =>
        c.from('lab_consents').insert(
          (
            [
              ['terms', true],
              ['privacy', true],
              ['partner_sharing', sharing],
              ['marketing', marketing],
            ] as const
          ).map(([kind, granted]) => ({ user_id: uid, kind, granted, version: CONSENT_VERSION })),
        ),
      )
      await reloadBoot()
    })
  }
  return (
    <div className="wrap band lab-auth">
      <div className="lab-auth__form">
        <AppHead eyebrow="The Lab" title="Before you start" />
        <p className="t-lead dim lab-measure">
          You’re signed in as {s.session?.user.email}. The Lab stores your brand profile and answers to calculate your scores and matches; nothing goes to a partner unless you request an introduction and our team approves it. You can export or delete everything from Settings.
        </p>
        <div className="lab-consents lab-gap">
          <label className="lab-check">
            <input type="checkbox" checked={sharing} onChange={e => setSharing(e.target.checked)} />
            <span>When an introduction I request is approved, Not by Accident may share my brand profile with that partner.</span>
          </label>
          <label className="lab-check">
            <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
            <span>Send me occasional notes from the studio.</span>
          </label>
        </div>
        <div className="actions lab-gap">
          <button type="button" className="btn" onClick={join} disabled={a.busy}>
            I agree, continue
          </button>
          <Link to="/privacy" className="link-q">
            Privacy policy
          </Link>
        </div>
        <Notice tone="error">{a.error}</Notice>
      </div>
    </div>
  )
}

function Guarded() {
  const s = useLabSession()
  const { pathname, search } = useLocation()
  useEffect(() => {
    document.body.dataset.lab = 'app'
    return () => void delete document.body.dataset.lab
  }, [])
  if (s.status === 'loading') return <Loading label="Opening The Lab" />
  if (s.status === 'offline') return <Notice tone="error">{NOT_CONFIGURED}</Notice>
  if (s.status === 'out') return <Navigate to={`/lab/login?next=${encodeURIComponent(pathname + search)}`} replace />
  if (!s.boot)
    return (
      <div className="wrap band">
        <Notice tone="error">{s.error ?? 'We couldn’t load your account.'}</Notice>
        <button type="button" className="btn lab-gap" onClick={() => void reloadBoot()}>
          Try again
        </button>
      </div>
    )
  if (!s.boot.consents.terms?.granted || !s.boot.consents.privacy?.granted) return <JoinLab />
  const noBrand = s.boot.brands.length === 0
  return (
    <>
      <SubNav />
      <div className="wrap lab-app__body">
        <Routes>
          <Route path="dashboard" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Dashboard />} />
          <Route path="brand" element={<BrandScreen />} />
          <Route path="assessment" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Assessment />} />
          <Route path="results" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Results />} />
          <Route path="markets" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Markets />} />
          <Route path="matches" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Matches />} />
          <Route path="opportunities" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Opportunities />} />
          <Route path="reports" element={noBrand ? <Navigate to="/lab/brand?new=1" replace /> : <Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/lab/dashboard" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default function LabApp() {
  return (
    <main id="main" tabIndex={-1} className="lab lab-app">
      <Zone env="frost" className="lab-app__zone">
        <Guarded />
      </Zone>
    </main>
  )
}
