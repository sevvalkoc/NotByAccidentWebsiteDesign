import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminBadge, AdminButton, AdminCard, AdminEmptyState, AdminField, AdminPageHeader, AdminSelect, AdminTextarea } from '@/admin/ui'
import { ErrorText, db, dt, must, useAdminLoad } from './LabAdmin'

const STATUSES = ['requested', 'under_review', 'more_info_needed', 'approved', 'declined', 'introduction_sent', 'in_discussion', 'completed', 'closed'] as const
const OPEN = ['requested', 'under_review', 'more_info_needed', 'approved', 'introduction_sent', 'in_discussion']
const tone = (s: string) => (s === 'requested' || s === 'more_info_needed' ? 'yellow' : s === 'declined' || s === 'closed' ? 'gray' : s === 'completed' || s === 'introduction_sent' ? 'green' : 'blue')
const pretty = (s: string) => s.replace(/_/g, ' ')

type Row = {
  id: string
  status: string
  purpose: string
  message: string | null
  market_codes: string[]
  partner_types: string[]
  created_at: string
  updated_at: string
  brand_id: string
  partner_id: string | null
  lab_brands: { name: string; website: string | null; origin_country: string | null; industry: string | null; product_category: string | null; target_markets: string[]; description: string | null } | null
  lab_partners: { name: string; website: string | null; verification_status: string; accepts_introductions: boolean; is_fixture: boolean; country_code: string | null } | null
}

function Detail({ row, onChanged }: { row: Row; onChanged: () => void }) {
  const events = useAdminLoad(() => must(db().from('lab_introduction_events').select('*').eq('introduction_id', row.id).order('created_at')), [row.id, row.updated_at])
  const notes = useAdminLoad(() => must(db().from('lab_introduction_notes').select('*').eq('introduction_id', row.id).order('created_at')), [row.id, row.updated_at])
  const consent = useAdminLoad(
    async () => {
      const req = (await must(db().from('lab_introductions').select('requested_by').eq('id', row.id).single())) as { requested_by: string | null }
      if (!req.requested_by) return null
      const c = (await must(db().from('lab_consents').select('granted, created_at').eq('user_id', req.requested_by).eq('kind', 'partner_sharing').order('created_at', { ascending: false }).limit(1))) as { granted: boolean; created_at: string }[]
      return c[0] ?? null
    },
    [row.id],
  )
  const [status, setStatus] = useState(row.status)
  const [note, setNote] = useState('')
  const [internal, setInternal] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function save() {
    setBusy(true)
    setErr('')
    const r = await db().rpc('lab_admin_update_introduction', { p_id: row.id, p_status: status, p_note: note || null, p_internal: internal || null })
    setBusy(false)
    if (r.error) return setErr(r.error.message)
    setNote('')
    setInternal('')
    onChanged()
  }
  const b = row.lab_brands
  const p = row.lab_partners
  return (
    <AdminCard className="p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {b?.name} → {p ? p.name : `research: ${row.market_codes.join(', ')}`}
          </h2>
          <p className="text-sm text-gray-500">
            {pretty(row.purpose)} · requested {dt(row.created_at)}
          </p>
        </div>
        <AdminBadge tone={tone(row.status)}>{pretty(row.status)}</AdminBadge>
      </div>
      {p?.is_fixture ? <p className="text-sm text-yellow-800 bg-yellow-50 rounded p-2 mb-3">Fictional demo partner: do not contact anyone.</p> : null}
      {p && !p.accepts_introductions ? (
        <p className="text-sm text-yellow-800 bg-yellow-50 rounded p-2 mb-3">This partner hasn’t confirmed it takes introductions ({pretty(p.verification_status)}). Get authorisation through a configured outreach process before contacting anyone.</p>
      ) : null}
      <p className="text-sm mb-3">
        Brand may share its profile with partners: {consent.data ? (consent.data.granted ? `yes (since ${dt(consent.data.created_at)})` : 'no') : 'not recorded'}
      </p>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm mb-4">
        <dt className="text-gray-500">Brand</dt>
        <dd>
          {b?.name} · {b?.industry} · {b?.product_category} · from {b?.origin_country ?? '—'}
          {b?.website ? (
            <a href={b.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-1">
              site
            </a>
          ) : null}
        </dd>
        <dt className="text-gray-500">Considering</dt>
        <dd>{b?.target_markets.join(', ') || '—'}</dd>
        {p ? (
          <>
            <dt className="text-gray-500">Partner</dt>
            <dd>
              {p.name} · {p.country_code} · {pretty(p.verification_status)}
            </dd>
          </>
        ) : (
          <>
            <dt className="text-gray-500">Research for</dt>
            <dd>
              {row.market_codes.join(', ')} · {row.partner_types.map(pretty).join(', ') || 'any type'}
            </dd>
          </>
        )}
      </dl>
      {row.message ? <p className="text-sm bg-gray-50 rounded p-3 mb-4 whitespace-pre-line">{row.message}</p> : null}

      <h3 className="text-sm font-semibold text-gray-900 mb-2">History (visible to the brand)</h3>
      <ul className="text-sm space-y-2 mb-4">
        {(events.data ?? []).map(e => (
          <li key={e.id}>
            <span className="text-gray-400">{dt(e.created_at)}</span> · {e.actor_role === 'user' ? 'Brand' : e.actor_role === 'staff' ? 'Team' : 'System'} · {pretty(e.status)}
            {e.note ? <span className="block text-gray-700 whitespace-pre-line">{e.note}</span> : null}
          </li>
        ))}
      </ul>
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Internal notes (never shown to the brand)</h3>
      <ul className="text-sm space-y-2 mb-4">
        {(notes.data ?? []).length ? (
          notes.data!.map(n => (
            <li key={n.id} className="bg-amber-50 rounded p-2">
              <span className="text-gray-400">{dt(n.created_at)}</span>
              <span className="block whitespace-pre-line">{n.body}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-400">None.</li>
        )}
      </ul>

      <div className="border-t border-gray-200 pt-4">
        <AdminField label="Status">
          <AdminSelect value={status} onChange={e => setStatus(e.target.value)}>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {pretty(s)}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Message to the brand" hint="Shown on their request and sent as a notification.">
          <AdminTextarea value={note} onChange={e => setNote(e.target.value)} rows={3} />
        </AdminField>
        <AdminField label="Internal note" hint="Staff only.">
          <AdminTextarea value={internal} onChange={e => setInternal(e.target.value)} rows={3} />
        </AdminField>
        <AdminButton onClick={() => void save()} disabled={busy || (status === row.status && !note.trim() && !internal.trim())}>
          {busy ? 'Saving…' : 'Save'}
        </AdminButton>
        <p className="text-xs text-gray-500 mt-2">Marking “introduction sent” or “in discussion” adds an opportunity to the brand’s pipeline. Nothing is emailed to the partner by the system.</p>
        <ErrorText>{err}</ErrorText>
      </div>
    </AdminCard>
  )
}

export default function IntroductionsAdmin() {
  const [params, setParams] = useSearchParams()
  const [filter, setFilter] = useState<'open' | 'all' | string>('open')
  const list = useAdminLoad(
    () =>
      must(
        db()
          .from('lab_introductions')
          .select('*, lab_brands(name, website, origin_country, industry, product_category, target_markets, description), lab_partners(name, website, verification_status, accepts_introductions, is_fixture, country_code)')
          .order('created_at', { ascending: false })
          .limit(300),
      ) as Promise<Row[]>,
    [],
  )
  const rows = (list.data ?? []).filter(r => (filter === 'open' ? OPEN.includes(r.status) : filter === 'all' ? true : r.status === filter))
  const open = list.data?.find(r => r.id === params.get('id'))
  return (
    <div>
      <AdminPageHeader
        title="Introductions & research requests"
        description="Review every request before anyone is contacted. The brand sees the status and your messages, never the internal notes."
        actions={
          <AdminSelect value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter">
            <option value="open">Open</option>
            <option value="all">All</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>
                {pretty(s)}
              </option>
            ))}
          </AdminSelect>
        }
      />
      <ErrorText>{list.error}</ErrorText>
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div>
          {rows.length ? (
            <AdminCard>
              <ul className="divide-y divide-gray-100">
                {rows.map(r => (
                  <li key={r.id}>
                    <button type="button" onClick={() => setParams({ id: r.id })} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${r.id === open?.id ? 'bg-blue-50' : ''}`}>
                      <span className="flex justify-between gap-2">
                        <span className="font-medium text-gray-900">
                          {r.lab_brands?.name} → {r.lab_partners?.name ?? `research (${r.market_codes.join(', ')})`}
                        </span>
                        <AdminBadge tone={tone(r.status)}>{pretty(r.status)}</AdminBadge>
                      </span>
                      <span className="text-gray-500">
                        {pretty(r.purpose)} · {dt(r.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </AdminCard>
          ) : (
            <AdminEmptyState title={list.loading ? 'Loading…' : 'No requests here.'} />
          )}
        </div>
        <div>{open ? <Detail key={open.id} row={open} onChanged={() => void list.reload()} /> : <p className="text-sm text-gray-500">Choose a request.</p>}</div>
      </div>
    </div>
  )
}
