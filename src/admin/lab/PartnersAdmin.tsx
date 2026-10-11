import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminBadge, AdminButton, AdminCard, AdminCheckbox, AdminEmptyState, AdminField, AdminInput, AdminPageHeader, AdminSelect, AdminTextarea, ConfirmButton } from '@/admin/ui'
import { BUSINESS_SIZES, INDUSTRIES, MARKETS, OFFERINGS, PARTNER_TYPES, PRICE_TIERS, SEGMENTS, VERIFICATION } from '@/lab/labels'
import { ErrorText, d, db, must, useAdminLoad } from './LabAdmin'

type Partner = {
  id?: string
  name: string
  website: string | null
  country_code: string | null
  city: string | null
  type_key: string
  description: string | null
  industries: string[]
  product_categories: string[]
  customer_segments: string[]
  price_tiers: string[]
  distribution_models: string[]
  accepts_offering: string[]
  brand_requirements: string | null
  business_size: string | null
  excluded_industries: string[]
  min_readiness: number | null
  source_url: string | null
  last_verified_at: string | null
  verification_status: string
  accepts_introductions: boolean
  listed: boolean
  archived: boolean
  is_fixture?: boolean
  internal_notes: string | null
  updated_at?: string
  lab_partner_markets?: { market_code: string }[]
}
const BLANK: Partner = {
  name: '',
  website: null,
  country_code: null,
  city: null,
  type_key: 'retailer',
  description: null,
  industries: [],
  product_categories: [],
  customer_segments: [],
  price_tiers: [],
  distribution_models: [],
  accepts_offering: ['physical'],
  brand_requirements: null,
  business_size: null,
  excluded_industries: [],
  min_readiness: null,
  source_url: null,
  last_verified_at: null,
  verification_status: 'research_prospect',
  accepts_introductions: false,
  listed: false,
  archived: false,
  internal_notes: null,
}
const DIST: [string, string][] = [
  ['retail', 'Retail'],
  ['wholesale', 'Wholesale'],
  ['distributor', 'Distributor'],
  ['dtc', 'Direct to consumer'],
  ['marketplace', 'Marketplace'],
  ['hybrid', 'Hybrid'],
]
type Opt = readonly (readonly [string, string])[]

function Multi({ label, options, value, onChange }: { label: string; options: Opt; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="mb-4">
      <legend className="text-sm font-medium text-gray-700 mb-1">{label}</legend>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {options.map(([k, l]) => (
          <label key={k} className="flex items-center gap-1.5 text-sm text-gray-700">
            <input type="checkbox" checked={value.includes(k)} onChange={() => onChange(value.includes(k) ? value.filter(x => x !== k) : [...value, k])} />
            {l}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/* ── CSV ─────────────────────────────────────────────────────────────── */
const CSV_COLS = [
  'name', 'website', 'country_code', 'city', 'type_key', 'description', 'industries', 'product_categories', 'customer_segments', 'price_tiers',
  'distribution_models', 'accepts_offering', 'brand_requirements', 'business_size', 'min_readiness', 'source_url', 'last_verified_at', 'verification_status', 'markets', 'listed',
] as const
const ARRAY_COLS = new Set(['industries', 'product_categories', 'customer_segments', 'price_tiers', 'distribution_models', 'accepts_offering', 'markets'])

/** RFC 4180: quoted fields, doubled quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') (field += '"'), i++
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') row.push(field), (field = '')
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++
      row.push(field)
      if (row.some(f => f.trim() !== '')) rows.push(row)
      row = []
      field = ''
    } else field += c
  }
  row.push(field)
  if (row.some(f => f.trim() !== '')) rows.push(row)
  return rows
}
const csvCell = (v: unknown) => {
  const s = Array.isArray(v) ? v.join('|') : v == null ? '' : String(v)
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}
function download(name: string, body: string, type: string) {
  const url = URL.createObjectURL(new Blob([body], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

function Importer({ onDone }: { onDone: () => void }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  const [report, setReport] = useState<{ inserted: number; updated: number; skipped: number; errors: { row: number; error: string }[] } | null>(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function read(file: File | undefined) {
    setErr('')
    setReport(null)
    if (!file) return
    const table = parseCsv(await file.text())
    const head = (table.shift() ?? []).map(h => h.trim().toLowerCase())
    if (!head.includes('name') || !head.includes('type_key')) return setErr('The first row must be a header with at least “name” and “type_key”.')
    const unknown = head.filter(h => !(CSV_COLS as readonly string[]).includes(h))
    if (unknown.length) return setErr(`Unknown columns: ${unknown.join(', ')}`)
    const parsed = table.map(r =>
      Object.fromEntries(
        head.map((h, i) => {
          const v = (r[i] ?? '').trim()
          if (ARRAY_COLS.has(h)) return [h, v ? v.split(/[|;]/).map(x => x.trim()).filter(Boolean) : []]
          if (h === 'listed') return [h, /^(true|yes|1)$/i.test(v)]
          return [h, v]
        }),
      ),
    )
    setRows(parsed)
    setBusy(true)
    const r = await db().rpc('lab_admin_import_partners', { p_rows: parsed, p_dry_run: true })
    setBusy(false)
    if (r.error) setErr(r.error.message)
    else setReport(r.data)
  }
  async function commit() {
    if (!rows) return
    setBusy(true)
    const r = await db().rpc('lab_admin_import_partners', { p_rows: rows, p_dry_run: false })
    setBusy(false)
    if (r.error) return setErr(r.error.message)
    setReport(r.data)
    setRows(null)
    onDone()
  }
  return (
    <AdminCard className="p-5 mb-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Import from CSV</h2>
      <p className="text-xs text-gray-500 mb-3">
        Columns: {CSV_COLS.join(', ')}. Lists use “|” between values (e.g. NL|BE). Rows are matched to existing records by website domain, then by name + country; matches are updated, the rest added as unlisted research prospects unless the file says otherwise. Only import organisation data you may lawfully hold; personal contacts are added by hand with their lawful basis.
      </p>
      <input type="file" accept=".csv,text/csv" onChange={e => void read(e.target.files?.[0])} aria-label="CSV file" className="text-sm" />
      <ErrorText>{err}</ErrorText>
      {report ? (
        <div className="text-sm mt-3">
          <p>
            {rows ? 'Dry run: ' : 'Imported: '}
            {report.inserted} new, {report.updated} updated, {report.skipped} skipped.
          </p>
          {report.errors.length ? (
            <ul className="text-red-600 text-xs mt-1 max-h-40 overflow-auto">
              {report.errors.map(e => (
                <li key={e.row}>
                  Row {e.row + 1}: {e.error}
                </li>
              ))}
            </ul>
          ) : null}
          {rows ? (
            <AdminButton className="mt-3" onClick={() => void commit()} disabled={busy || report.inserted + report.updated === 0}>
              Import {report.inserted + report.updated} rows
            </AdminButton>
          ) : null}
        </div>
      ) : busy ? (
        <p className="text-sm text-gray-500 mt-2">Checking…</p>
      ) : null}
    </AdminCard>
  )
}

type Contact = { id: string; name: string; role: string | null; email: string | null; phone: string | null; lawful_basis: string; notes: string | null }
function Contacts({ partnerId }: { partnerId: string }) {
  const list = useAdminLoad(() => must(db().from('lab_partner_contacts').select('*').eq('partner_id', partnerId).order('created_at')) as Promise<Contact[]>, [partnerId])
  const [c, setC] = useState({ name: '', role: '', email: '', phone: '', lawful_basis: 'legitimate_interest', notes: '' })
  const [err, setErr] = useState('')
  async function add() {
    setErr('')
    const { error } = await db()
      .from('lab_partner_contacts')
      .insert({ partner_id: partnerId, name: c.name.trim(), role: c.role || null, email: c.email || null, phone: c.phone || null, lawful_basis: c.lawful_basis, notes: c.notes || null })
    if (error) return setErr(error.message)
    setC({ name: '', role: '', email: '', phone: '', lawful_basis: 'legitimate_interest', notes: '' })
    await list.reload()
  }
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Contacts (staff only)</h3>
      <p className="text-xs text-gray-500 mb-3">Never shown to brands and never emailed by the system. Record why you may hold each person’s details.</p>
      <ul className="text-sm space-y-2 mb-3">
        {(list.data ?? []).map(x => (
          <li key={x.id} className="flex justify-between gap-3">
            <span>
              <span className="font-medium">{x.name}</span> {x.role ? `· ${x.role}` : ''} {x.email ? `· ${x.email}` : ''} {x.phone ? `· ${x.phone}` : ''}
              <span className="block text-xs text-gray-500">
                basis: {x.lawful_basis.replace(/_/g, ' ')}
                {x.notes ? ` · ${x.notes}` : ''}
              </span>
            </span>
            <ConfirmButton onConfirm={() => void db().from('lab_partner_contacts').delete().eq('id', x.id).then(() => list.reload())}>Remove</ConfirmButton>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-x-3">
        <AdminField label="Name">
          <AdminInput value={c.name} onChange={e => setC({ ...c, name: e.target.value })} />
        </AdminField>
        <AdminField label="Role">
          <AdminInput value={c.role} onChange={e => setC({ ...c, role: e.target.value })} />
        </AdminField>
        <AdminField label="Email">
          <AdminInput type="email" value={c.email} onChange={e => setC({ ...c, email: e.target.value })} />
        </AdminField>
        <AdminField label="Phone">
          <AdminInput value={c.phone} onChange={e => setC({ ...c, phone: e.target.value })} />
        </AdminField>
        <AdminField label="Lawful basis">
          <AdminSelect value={c.lawful_basis} onChange={e => setC({ ...c, lawful_basis: e.target.value })}>
            <option value="legitimate_interest">Legitimate interest</option>
            <option value="consent">Consent</option>
            <option value="public_business_contact">Published business contact</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Notes">
          <AdminInput value={c.notes} onChange={e => setC({ ...c, notes: e.target.value })} />
        </AdminField>
      </div>
      <AdminButton variant="secondary" onClick={() => void add()} disabled={!c.name.trim()}>
        Add contact
      </AdminButton>
      <ErrorText>{err || list.error}</ErrorText>
    </div>
  )
}

function Editor({ initial, onSaved, onClose }: { initial: Partner; onSaved: (id: string) => void; onClose: () => void }) {
  const [p, setP] = useState<Partner>(initial)
  const [markets, setMarkets] = useState<string[]>((initial.lab_partner_markets ?? []).map(m => m.market_code))
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    setP(initial)
    setMarkets((initial.lab_partner_markets ?? []).map(m => m.market_code))
  }, [initial])
  const set = <K extends keyof Partner>(k: K, v: Partner[K]) => setP({ ...p, [k]: v })
  const s = (v: string) => (v.trim() === '' ? null : v.trim())
  async function save() {
    setBusy(true)
    setErr('')
    try {
      const { id, lab_partner_markets: _m, updated_at: _u, is_fixture: _f, ...row } = p
      const clean = { ...row, website: s(p.website ?? ''), city: s(p.city ?? ''), description: s(p.description ?? ''), brand_requirements: s(p.brand_requirements ?? ''), source_url: s(p.source_url ?? ''), internal_notes: s(p.internal_notes ?? '') }
      const saved = (id
        ? await must(db().from('lab_partners').update(clean).eq('id', id).select('id').single())
        : await must(db().from('lab_partners').insert(clean).select('id').single())) as { id: string }
      await must(db().from('lab_partner_markets').delete().eq('partner_id', saved.id).select())
      if (markets.length) await must(db().from('lab_partner_markets').insert(markets.map(m => ({ partner_id: saved.id, market_code: m }))).select())
      onSaved(saved.id)
    } catch (e) {
      setErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <AdminCard className="p-5">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{p.id ? p.name : 'New partner'}</h2>
        <AdminButton variant="ghost" onClick={onClose}>
          Close
        </AdminButton>
      </div>
      {p.is_fixture ? <p className="text-sm text-yellow-800 bg-yellow-50 rounded p-2 mb-3">Fictional staging fixture.</p> : null}
      <div className="grid grid-cols-2 gap-x-4">
        <AdminField label="Organisation name">
          <AdminInput value={p.name} onChange={e => set('name', e.target.value)} />
        </AdminField>
        <AdminField label="Type">
          <AdminSelect value={p.type_key} onChange={e => set('type_key', e.target.value)}>
            {PARTNER_TYPES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Website">
          <AdminInput value={p.website ?? ''} onChange={e => set('website', e.target.value)} placeholder="https://" />
        </AdminField>
        <AdminField label="Source (where this information comes from)">
          <AdminInput value={p.source_url ?? ''} onChange={e => set('source_url', e.target.value)} placeholder="https://" />
        </AdminField>
        <AdminField label="Country (ISO code)">
          <AdminInput value={p.country_code ?? ''} onChange={e => set('country_code', e.target.value.toUpperCase().slice(0, 2) || null)} maxLength={2} />
        </AdminField>
        <AdminField label="City">
          <AdminInput value={p.city ?? ''} onChange={e => set('city', e.target.value)} />
        </AdminField>
        <AdminField label="Verification status">
          <AdminSelect value={p.verification_status} onChange={e => set('verification_status', e.target.value)}>
            {VERIFICATION.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Last verified">
          <AdminInput type="date" value={p.last_verified_at ?? ''} onChange={e => set('last_verified_at', e.target.value || null)} />
        </AdminField>
        <AdminField label="Business size">
          <AdminSelect value={p.business_size ?? ''} onChange={e => set('business_size', e.target.value || null)}>
            <option value="">—</option>
            {BUSINESS_SIZES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Minimum readiness they expect" hint="Leave empty to use the type’s default.">
          <AdminInput type="number" min={0} max={100} value={p.min_readiness ?? ''} onChange={e => set('min_readiness', e.target.value === '' ? null : Number(e.target.value))} />
        </AdminField>
      </div>
      <AdminField label="Description (shown to brands)">
        <AdminTextarea value={p.description ?? ''} onChange={e => set('description', e.target.value)} rows={3} />
      </AdminField>
      <AdminField label="What they look for (shown to brands)">
        <AdminTextarea value={p.brand_requirements ?? ''} onChange={e => set('brand_requirements', e.target.value)} rows={2} />
      </AdminField>
      <AdminField label="Product categories" hint="Comma-separated, matched against brands’ own descriptions.">
        <AdminInput value={p.product_categories.join(', ')} onChange={e => set('product_categories', e.target.value.split(',').map(x => x.trim()).filter(Boolean))} />
      </AdminField>
      <Multi label="Industries" options={INDUSTRIES} value={p.industries} onChange={v => set('industries', v)} />
      <Multi label="Excluded industries (hard filter)" options={INDUSTRIES} value={p.excluded_industries} onChange={v => set('excluded_industries', v)} />
      <Multi label="Customer segments" options={SEGMENTS} value={p.customer_segments} onChange={v => set('customer_segments', v)} />
      <Multi label="Price tiers" options={PRICE_TIERS} value={p.price_tiers} onChange={v => set('price_tiers', v)} />
      <Multi label="How they work" options={DIST} value={p.distribution_models} onChange={v => set('distribution_models', v)} />
      <Multi label="Offerings they take (hard filter)" options={OFFERINGS} value={p.accepts_offering} onChange={v => set('accepts_offering', v)} />
      <Multi label="Markets they cover (hard filter)" options={MARKETS} value={markets} onChange={setMarkets} />
      <AdminCheckbox label="Listed: visible to brands in matching" checked={p.listed} onChange={e => set('listed', e.target.checked)} />
      <AdminCheckbox label="Takes introductions (only after they’ve confirmed it)" checked={p.accepts_introductions} onChange={e => set('accepts_introductions', e.target.checked)} />
      <AdminCheckbox label="Archived" checked={p.archived} onChange={e => set('archived', e.target.checked)} />
      <AdminField label="Internal notes (staff only)">
        <AdminTextarea value={p.internal_notes ?? ''} onChange={e => set('internal_notes', e.target.value)} rows={3} />
      </AdminField>
      <AdminButton onClick={() => void save()} disabled={busy || !p.name.trim()}>
        {busy ? 'Saving…' : 'Save partner'}
      </AdminButton>
      <ErrorText>{err}</ErrorText>
      {p.id ? <Contacts partnerId={p.id} /> : null}
    </AdminCard>
  )
}

export default function PartnersAdmin() {
  const [params, setParams] = useSearchParams()
  const [f, setF] = useState({ q: '', status: '', type: '', country: '', show: 'active' })
  const [importing, setImporting] = useState(false)
  const list = useAdminLoad(() => must(db().from('lab_partners').select('*, lab_partner_markets(market_code)').order('name')) as Promise<Partner[]>, [])
  const rows = (list.data ?? []).filter(
    p =>
      (f.show === 'all' || (f.show === 'active' ? !p.archived : f.show === 'archived' ? p.archived : f.show === 'fixtures' ? p.is_fixture : true)) &&
      (!f.status || p.verification_status === f.status) &&
      (!f.type || p.type_key === f.type) &&
      (!f.country || p.country_code === f.country || p.lab_partner_markets?.some(m => m.market_code === f.country)) &&
      (!f.q || `${p.name} ${p.website} ${p.city}`.toLowerCase().includes(f.q.toLowerCase())),
  )
  const editId = params.get('id')
  const editing = editId === 'new' ? BLANK : list.data?.find(p => p.id === editId)
  function exportCsv() {
    const lines = [CSV_COLS.join(',')]
    for (const p of rows) lines.push(CSV_COLS.map(c => csvCell(c === 'markets' ? (p.lab_partner_markets ?? []).map(m => m.market_code) : (p as unknown as Record<string, unknown>)[c])).join(','))
    download(`lab-partners-${new Date().toISOString().slice(0, 10)}.csv`, lines.join('\n') + '\n', 'text/csv')
  }
  return (
    <div>
      <AdminPageHeader
        title="Partners"
        description="The partner database. Only listed, non-archived records reach brands, and only through the matching functions (never contacts or internal notes)."
        actions={
          <>
            <AdminButton variant="secondary" onClick={() => setImporting(!importing)}>
              Import CSV
            </AdminButton>
            <AdminButton variant="secondary" onClick={exportCsv}>
              Export CSV
            </AdminButton>
            <AdminButton onClick={() => setParams({ id: 'new' })}>New partner</AdminButton>
          </>
        }
      />
      {importing ? <Importer onDone={() => void list.reload()} /> : null}
      <div className="flex flex-wrap gap-2 mb-4">
        <AdminInput placeholder="Search" value={f.q} onChange={e => setF({ ...f, q: e.target.value })} className="max-w-xs" aria-label="Search" />
        <AdminSelect value={f.status} onChange={e => setF({ ...f, status: e.target.value })} aria-label="Status" className="max-w-[14rem]">
          <option value="">Any status</option>
          {VERIFICATION.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect value={f.type} onChange={e => setF({ ...f, type: e.target.value })} aria-label="Type" className="max-w-[12rem]">
          <option value="">Any type</option>
          {PARTNER_TYPES.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect value={f.country} onChange={e => setF({ ...f, country: e.target.value })} aria-label="Market" className="max-w-[12rem]">
          <option value="">Any market</option>
          {MARKETS.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </AdminSelect>
        <AdminSelect value={f.show} onChange={e => setF({ ...f, show: e.target.value })} aria-label="Show" className="max-w-[10rem]">
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="fixtures">Fixtures</option>
          <option value="all">All</option>
        </AdminSelect>
      </div>
      <ErrorText>{list.error}</ErrorText>
      <div className="grid xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div>
          {rows.length ? (
            <AdminCard>
              <ul className="divide-y divide-gray-100">
                {rows.map(p => (
                  <li key={p.id}>
                    <button type="button" onClick={() => setParams({ id: p.id! })} className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${p.id === editId ? 'bg-blue-50' : ''}`}>
                      <span className="font-medium text-gray-900">{p.name}</span>{' '}
                      {p.listed ? <AdminBadge tone="green">listed</AdminBadge> : <AdminBadge>unlisted</AdminBadge>} {p.is_fixture ? <AdminBadge tone="yellow">fixture</AdminBadge> : null}{' '}
                      {p.archived ? <AdminBadge tone="red">archived</AdminBadge> : null}
                      <span className="block text-gray-500">
                        {p.type_key.replace(/_/g, ' ')} · {p.country_code ?? '—'} · {p.verification_status.replace(/_/g, ' ')} · checked {d(p.last_verified_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </AdminCard>
          ) : (
            <AdminEmptyState title={list.loading ? 'Loading…' : 'No partners match.'} body="Add verified organisations by hand or import a CSV." />
          )}
        </div>
        <div>
          {editing ? (
            <Editor
              initial={editing}
              onClose={() => setParams({})}
              onSaved={id => {
                void list.reload()
                setParams({ id })
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
