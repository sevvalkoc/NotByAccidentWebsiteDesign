/* Admin → The Lab. Every write here goes through RLS (staff policies) or a
   lab_admin_* function that checks lab_is_admin() itself; hiding a button
   is never the only guard. */
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { NavLink, Navigate, Route, Routes, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import SiteEditor from '@/admin/SiteEditor'
import { AdminBadge, AdminButton, AdminCard, AdminCheckbox, AdminEmptyState, AdminField, AdminInput, AdminPageHeader, AdminTextarea } from '@/admin/ui'
import AssessmentAdmin from './AssessmentAdmin'
import MarketsAdmin from './MarketsAdmin'
import PartnersAdmin from './PartnersAdmin'
import IntroductionsAdmin from './IntroductionsAdmin'

export const db = () => {
  if (!supabase) throw new Error('Supabase is not configured.')
  return supabase
}

/** Load once, reload on demand; errors as text. */
export function useAdminLoad<T>(fn: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    setLoading(true)
    try {
      setData(await fn())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => {
    void run()
  }, [run])
  return { data, error, loading, reload: run, setData }
}
/** Unwraps a Supabase response or throws its message. */
export async function must<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<NonNullable<T>> {
  const { data, error } = await p
  if (error) throw new Error(error.message)
  return data as NonNullable<T>
}
export function ErrorText({ children }: { children?: string }) {
  return children ? (
    <p role="alert" className="text-sm text-red-600 my-3">
      {children}
    </p>
  ) : null
}
export const dt = (iso?: string | null) => (iso ? new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—')
export const d = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString('en-GB', { dateStyle: 'medium' }) : '—')

const TABS = [
  ['overview', 'Overview'],
  ['introductions', 'Introductions'],
  ['users', 'Users & brands'],
  ['assessment', 'Assessment'],
  ['markets', 'Markets'],
  ['partners', 'Partner database'],
  ['matching', 'Matching'],
  ['opportunities', 'Opportunities'],
  ['content', 'Content'],
  ['settings', 'Settings'],
] as const

function Overview() {
  const [days, setDays] = useState(30)
  const stats = useAdminLoad(async () => (await must(db().rpc('lab_admin_stats', { p_days: days }))) as Record<string, number | null | string | unknown[]>, [days])
  const inbox = useAdminLoad(
    () => must(db().from('lab_notifications').select('id, title, body, link, created_at, read_at').is('user_id', null).order('created_at', { ascending: false }).limit(20)),
    [],
  )
  const s = stats.data ?? {}
  const cells: [string, string][] = [
    ['registrations', 'Registrations'],
    ['brands', 'Brands created'],
    ['preview_completions', 'Previews completed'],
    ['assessment_starts', 'Assessments started'],
    ['assessment_completions', 'Assessments completed'],
    ['completion_rate', 'Completion rate %'],
    ['market_comparisons', 'Market comparisons'],
    ['match_views', 'Matching runs'],
    ['saved_matches', 'Partners shortlisted'],
    ['introduction_requests', 'Introduction requests'],
    ['research_requests', 'Research requests'],
    ['reports_generated', 'Reports generated'],
    ['report_downloads', 'PDF downloads'],
    ['open_requests', 'Open requests now'],
  ]
  async function markRead() {
    const ids = (inbox.data ?? []).filter(n => !n.read_at).map(n => n.id)
    if (ids.length) await db().from('lab_notifications').update({ read_at: new Date().toISOString() }).in('id', ids)
    await inbox.reload()
  }
  return (
    <div>
      <AdminPageHeader
        title="The Lab · Overview"
        description="Counts only: no personal data, no tracking cookies. Previews and PDF downloads are anonymous events."
        actions={
          <select className="rounded-md border border-gray-300 px-2 py-1.5 text-sm" value={days} onChange={e => setDays(Number(e.target.value))} aria-label="Period">
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        }
      />
      <ErrorText>{stats.error}</ErrorText>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {cells.map(([k, l]) => (
          <AdminCard key={k} className="p-3">
            <p className="text-xs text-gray-500">{l}</p>
            <p className="text-2xl font-semibold text-gray-900 tabular-nums">{s[k] == null ? '—' : String(s[k])}</p>
          </AdminCard>
        ))}
      </div>
      <p className="text-xs text-gray-500 mb-8">
        All time: {String(s.registrations_total ?? '—')} registrations, {String(s.brands_total ?? '—')} brands.
        {Array.isArray(s.top_markets) && s.top_markets.length ? ` Most considered markets: ${(s.top_markets as { code: string; n: number }[]).map(m => `${m.code} (${m.n})`).join(', ')}.` : ''}
      </p>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-900">Staff inbox</h2>
        <AdminButton variant="ghost" onClick={() => void markRead()}>
          Mark all as read
        </AdminButton>
      </div>
      {inbox.data?.length ? (
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {inbox.data.map(n => (
              <li key={n.id} className={`px-4 py-3 text-sm ${n.read_at ? 'text-gray-500' : 'text-gray-900'}`}>
                {n.link ? (
                  <a href={n.link} className="font-medium hover:underline">
                    {n.title}
                  </a>
                ) : (
                  <span className="font-medium">{n.title}</span>
                )}
                {n.body ? <span className="block text-gray-500">{n.body}</span> : null}
                <span className="block text-xs text-gray-400">{dt(n.created_at)}</span>
              </li>
            ))}
          </ul>
        </AdminCard>
      ) : (
        <AdminEmptyState title="Nothing in the inbox." body="Introduction and research requests land here." />
      )}
    </div>
  )
}

type LabUser = {
  user_id: string
  email: string
  full_name: string | null
  created_at: string
  last_seen_at: string | null
  confirmed: boolean
  brands: { id: string; name: string; latest: { overall: number; band: string } | null; open_assessment: boolean }[]
}
function Users() {
  const users = useAdminLoad(async () => (await must(db().rpc('lab_admin_users'))) as LabUser[], [])
  const [q, setQ] = useState('')
  const list = (users.data ?? []).filter(u => !q || `${u.email} ${u.full_name} ${u.brands.map(b => b.name).join(' ')}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <AdminPageHeader title="Users & brands" description="Lab accounts and their brands. Lab users never get access to this admin; CMS staff are managed under Users." />
      <AdminInput placeholder="Search email, name or brand" value={q} onChange={e => setQ(e.target.value)} className="mb-4 max-w-sm" aria-label="Search" />
      <ErrorText>{users.error}</ErrorText>
      {list.length ? (
        <AdminCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2">Account</th>
                <th className="px-4 py-2">Brands</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.map(u => (
                <tr key={u.user_id}>
                  <td className="px-4 py-2">
                    <span className="block font-medium text-gray-900">{u.full_name || '—'}</span>
                    <span className="text-gray-500">{u.email}</span> {u.confirmed ? null : <AdminBadge tone="yellow">unconfirmed</AdminBadge>}
                  </td>
                  <td className="px-4 py-2">
                    {u.brands.length
                      ? u.brands.map(b => (
                          <span key={b.id} className="block">
                            {b.name}{' '}
                            <span className="text-gray-500">
                              {b.latest ? `· ${b.latest.overall} ${b.latest.band}` : '· no result'}
                              {b.open_assessment ? ' · assessment in progress' : ''}
                            </span>
                          </span>
                        ))
                      : '—'}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{d(u.created_at)}</td>
                  <td className="px-4 py-2 text-gray-500">{d(u.last_seen_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      ) : (
        <AdminEmptyState title={users.loading ? 'Loading…' : 'No Lab users yet.'} />
      )}
    </div>
  )
}

const CRITERIA: [string, string][] = [
  ['category', 'Product category'],
  ['geography', 'Target geography'],
  ['price', 'Price positioning'],
  ['segment', 'Customer segment'],
  ['distribution', 'Distribution model'],
  ['readiness', 'Commercial readiness'],
]
function Matching() {
  const cfgs = useAdminLoad(() => must(db().from('lab_matching_configs').select('*').order('version', { ascending: false })), [])
  const active = cfgs.data?.find(c => c.active)
  const [w, setW] = useState<Record<string, number>>({})
  const [min, setMin] = useState(40)
  const [notes, setNotes] = useState('')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  useEffect(() => {
    if (active) {
      setW(active.weights)
      setMin(active.min_score)
    }
  }, [active])
  const total = Object.values(w).reduce((a, b) => a + (Number(b) || 0), 0)
  async function save() {
    setErr('')
    setOk('')
    const r = await db().rpc('lab_admin_set_matching', { p_weights: w, p_min_score: min, p_notes: notes })
    if (r.error) return setErr(r.error.message)
    setOk('Saved as a new version. New matching runs use it; earlier runs keep the version they used.')
    setNotes('')
    await cfgs.reload()
  }
  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Matching weights" description="Every save creates a new version; each matching run records the version it used." />
      <AdminCard className="p-5">
        {CRITERIA.map(([k, l]) => (
          <AdminField key={k} label={`${l} (%)`}>
            <AdminInput type="number" min={0} max={100} value={w[k] ?? 0} onChange={e => setW({ ...w, [k]: Number(e.target.value) })} />
          </AdminField>
        ))}
        <p className={`text-sm mb-4 ${total === 100 ? 'text-gray-500' : 'text-red-600'}`}>Total: {total}% (must be 100)</p>
        <AdminField label="Minimum score shown to brands" hint="Matches below this are not shown.">
          <AdminInput type="number" min={0} max={100} value={min} onChange={e => setMin(Number(e.target.value))} />
        </AdminField>
        <AdminField label="Why the change">
          <AdminInput value={notes} onChange={e => setNotes(e.target.value)} />
        </AdminField>
        <AdminButton onClick={() => void save()} disabled={total !== 100}>
          Save as new version
        </AdminButton>
        <ErrorText>{err}</ErrorText>
        {ok ? <p className="text-sm text-green-700 mt-3">{ok}</p> : null}
      </AdminCard>
      <h2 className="text-sm font-semibold text-gray-900 mt-8 mb-2">History</h2>
      <ul className="text-sm text-gray-600 space-y-1">
        {(cfgs.data ?? []).map(c => (
          <li key={c.id}>
            v{c.version} {c.active ? <AdminBadge tone="green">active</AdminBadge> : null} · {d(c.created_at)} · {CRITERIA.map(([k]) => `${k} ${c.weights[k]}`).join(', ')} · min {c.min_score}
            {c.notes ? ` · ${c.notes}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Opportunities() {
  const list = useAdminLoad(
    () => must(db().from('lab_opportunities').select('id, title, kind, status, next_action, next_action_on, last_activity_at, lab_brands(name)').order('last_activity_at', { ascending: false }).limit(200)),
    [],
  )
  return (
    <div>
      <AdminPageHeader title="Opportunities" description="Every brand’s pipeline, read-only. Brands manage their own; introductions you mark as sent create one automatically." />
      <ErrorText>{list.error}</ErrorText>
      {list.data?.length ? (
        <AdminCard className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2">Brand</th>
                <th className="px-4 py-2">Opportunity</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Next action</th>
                <th className="px-4 py-2">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {list.data.map(o => (
                <tr key={o.id}>
                  <td className="px-4 py-2">{(o.lab_brands as unknown as { name: string } | null)?.name}</td>
                  <td className="px-4 py-2">
                    {o.title} <span className="text-gray-400">· {o.kind}</span>
                  </td>
                  <td className="px-4 py-2">{o.status.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-2 text-gray-500">
                    {o.next_action ?? '—'}
                    {o.next_action_on ? ` (${d(o.next_action_on)})` : ''}
                  </td>
                  <td className="px-4 py-2 text-gray-500">{d(o.last_activity_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      ) : (
        <AdminEmptyState title={list.loading ? 'Loading…' : 'No opportunities yet.'} />
      )}
    </div>
  )
}

const CONTENT = [
  ['lab', 'Landing (/lab)'],
  ['lab-how', 'How it works'],
  ['lab-readiness', 'Readiness preview'],
  ['lab-app', 'App microcopy'],
] as const
function Content() {
  const [params, setParams] = useSearchParams()
  const active = CONTENT.find(([k]) => k === params.get('page'))?.[0] ?? 'lab'
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {CONTENT.map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setParams({ page: k })}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${active === k ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            {l}
          </button>
        ))}
      </div>
      <SiteEditor
        key={active}
        slug={active}
        title={`The Lab · ${CONTENT.find(([k]) => k === active)![1]}`}
        description="Copy for The Lab’s pages and screens. The homepage’s “The Lab” band is under Homepage. Save writes straight to the live site."
      />
    </div>
  )
}

function Settings() {
  const s = useAdminLoad(() => must(db().from('lab_settings').select('*').eq('id', 1).single()), [])
  const [v, setV] = useState<Record<string, number | boolean>>({})
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  useEffect(() => {
    if (s.data) setV(s.data)
  }, [s.data])
  async function save() {
    setErr('')
    setOk('')
    const { error } = await db()
      .from('lab_settings')
      .update({ fixtures_enabled: v.fixtures_enabled, intro_daily_limit: v.intro_daily_limit, match_runs_per_hour: v.match_runs_per_hour, reports_per_day: v.reports_per_day })
      .eq('id', 1)
    if (error) setErr(error.message)
    else setOk('Saved.')
  }
  return (
    <div className="max-w-xl">
      <AdminPageHeader title="Lab settings" description="Abuse limits and staging fixtures." />
      <AdminCard className="p-5">
        <AdminField label="Introduction requests per brand per day">
          <AdminInput type="number" min={1} max={100} value={Number(v.intro_daily_limit ?? 10)} onChange={e => setV({ ...v, intro_daily_limit: Number(e.target.value) })} />
        </AdminField>
        <AdminField label="Matching runs per brand per hour">
          <AdminInput type="number" min={1} max={500} value={Number(v.match_runs_per_hour ?? 30)} onChange={e => setV({ ...v, match_runs_per_hour: Number(e.target.value) })} />
        </AdminField>
        <AdminField label="Reports per brand per day">
          <AdminInput type="number" min={1} max={200} value={Number(v.reports_per_day ?? 20)} onChange={e => setV({ ...v, reports_per_day: Number(e.target.value) })} />
        </AdminField>
        <AdminCheckbox label="Show fictional demo partners and markets (staging only)" checked={Boolean(v.fixtures_enabled)} onChange={e => setV({ ...v, fixtures_enabled: e.target.checked })} />
        <p className="text-xs text-gray-500 mb-4">Keep this off in production. Fixture records are labelled “Fictional” wherever they appear.</p>
        <AdminButton onClick={() => void save()}>Save</AdminButton>
        <ErrorText>{err || s.error}</ErrorText>
        {ok ? <p className="text-sm text-green-700 mt-3">{ok}</p> : null}
      </AdminCard>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-gray-900 mb-3">{title}</h2>
      {children}
    </section>
  )
}
export { AdminTextarea }

export default function LabAdmin() {
  return (
    <div>
      <nav className="flex flex-wrap gap-1 mb-6 border-b border-gray-200" aria-label="The Lab">
        {TABS.map(([k, l]) => (
          <NavLink
            key={k}
            to={`/admin/lab/${k}`}
            className={({ isActive }) => `px-3 py-2 text-sm font-medium border-b-2 -mb-px ${isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            {l}
          </NavLink>
        ))}
      </nav>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="introductions" element={<IntroductionsAdmin />} />
        <Route path="users" element={<Users />} />
        <Route path="assessment" element={<AssessmentAdmin />} />
        <Route path="markets" element={<MarketsAdmin />} />
        <Route path="partners" element={<PartnersAdmin />} />
        <Route path="matching" element={<Matching />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="content" element={<Content />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </div>
  )
}
