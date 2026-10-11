import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminBadge, AdminButton, AdminCard, AdminCheckbox, AdminField, AdminInput, AdminPageHeader, AdminSelect, AdminTextarea, ConfirmButton } from '@/admin/ui'
import { INDUSTRIES, LANGUAGES } from '@/lab/labels'
import { ErrorText, d, db, must, useAdminLoad } from './LabAdmin'

type Market = {
  code: string
  name: string
  status: string
  is_fixture: boolean
  priority: number
  eu_member: boolean | null
  currency: string | null
  languages: string[]
  overview: string | null
  consumer_notes: string | null
  distribution_channels: string[]
  pricing_notes: string | null
  logistics_notes: string | null
  regulatory_notes: string | null
  entry_barriers: string[]
  confidence: string
  last_verified_at: string | null
  outdated: boolean
  updated_at: string
}
type Source = { id: string; market_code: string; field: string; title: string; url: string; publisher: string | null; published_on: string | null; accessed_on: string }
type Note = { id: string; market_code: string; industry: string; note: string; updated_at: string }
const FIELDS = ['general', 'consumer', 'distribution', 'pricing', 'logistics', 'regulatory']

function Sources({ code }: { code: string }) {
  const list = useAdminLoad(() => must(db().from('lab_market_sources').select('*').eq('market_code', code).order('field')) as Promise<Source[]>, [code])
  const [s, setS] = useState({ field: 'general', title: '', url: '', publisher: '', published_on: '', accessed_on: new Date().toISOString().slice(0, 10) })
  const [err, setErr] = useState('')
  async function add() {
    setErr('')
    const { error } = await db().from('lab_market_sources').insert({ market_code: code, field: s.field, title: s.title.trim(), url: s.url.trim(), publisher: s.publisher || null, published_on: s.published_on || null, accessed_on: s.accessed_on })
    if (error) return setErr(error.message)
    setS({ ...s, title: '', url: '', publisher: '', published_on: '' })
    await list.reload()
  }
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Sources</h3>
      <p className="text-xs text-gray-500 mb-3">Every claim in the profile should trace to a source here. Brands see the title, publisher and date.</p>
      <ul className="text-sm space-y-2 mb-3">
        {(list.data ?? []).map(x => (
          <li key={x.id} className="flex justify-between gap-3">
            <span>
              <AdminBadge>{x.field}</AdminBadge>{' '}
              <a href={x.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {x.title}
              </a>
              <span className="text-gray-500">
                {' '}
                · {x.publisher ?? '—'} · accessed {d(x.accessed_on)}
              </span>
            </span>
            <ConfirmButton onConfirm={() => void db().from('lab_market_sources').delete().eq('id', x.id).then(() => list.reload())}>Remove</ConfirmButton>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-2 gap-x-3">
        <AdminField label="About">
          <AdminSelect value={s.field} onChange={e => setS({ ...s, field: e.target.value })}>
            {FIELDS.map(f => (
              <option key={f}>{f}</option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Publisher">
          <AdminInput value={s.publisher} onChange={e => setS({ ...s, publisher: e.target.value })} />
        </AdminField>
        <AdminField label="Title">
          <AdminInput value={s.title} onChange={e => setS({ ...s, title: e.target.value })} />
        </AdminField>
        <AdminField label="URL">
          <AdminInput value={s.url} onChange={e => setS({ ...s, url: e.target.value })} placeholder="https://" />
        </AdminField>
        <AdminField label="Published">
          <AdminInput type="date" value={s.published_on} onChange={e => setS({ ...s, published_on: e.target.value })} />
        </AdminField>
        <AdminField label="Accessed">
          <AdminInput type="date" value={s.accessed_on} onChange={e => setS({ ...s, accessed_on: e.target.value })} />
        </AdminField>
      </div>
      <AdminButton variant="secondary" onClick={() => void add()} disabled={!s.title.trim() || !s.url.trim()}>
        Add source
      </AdminButton>
      <ErrorText>{err || list.error}</ErrorText>
    </div>
  )
}

function CategoryNotes({ code }: { code: string }) {
  const list = useAdminLoad(() => must(db().from('lab_market_category_notes').select('*').eq('market_code', code).order('industry')) as Promise<Note[]>, [code])
  const [industry, setIndustry] = useState('fashion')
  const [note, setNote] = useState('')
  const [err, setErr] = useState('')
  async function add() {
    setErr('')
    const { error } = await db().from('lab_market_category_notes').upsert({ market_code: code, industry, note: note.trim() }, { onConflict: 'market_code,industry' })
    if (error) return setErr(error.message)
    setNote('')
    await list.reload()
  }
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-1">Notes per industry</h3>
      <p className="text-xs text-gray-500 mb-3">Shown to brands in that industry as a verified consideration. Back each with a source above.</p>
      <ul className="text-sm space-y-2 mb-3">
        {(list.data ?? []).map(x => (
          <li key={x.id} className="flex justify-between gap-3">
            <span>
              <AdminBadge>{x.industry}</AdminBadge> {x.note}
            </span>
            <ConfirmButton onConfirm={() => void db().from('lab_market_category_notes').delete().eq('id', x.id).then(() => list.reload())}>Remove</ConfirmButton>
          </li>
        ))}
      </ul>
      <AdminField label="Industry">
        <AdminSelect value={industry} onChange={e => setIndustry(e.target.value)}>
          {INDUSTRIES.map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </AdminSelect>
      </AdminField>
      <AdminField label="Note">
        <AdminTextarea value={note} onChange={e => setNote(e.target.value)} rows={2} />
      </AdminField>
      <AdminButton variant="secondary" onClick={() => void add()} disabled={!note.trim()}>
        Save note
      </AdminButton>
      <ErrorText>{err || list.error}</ErrorText>
    </div>
  )
}

function Editor({ m, onSaved }: { m: Market; onSaved: () => void }) {
  const [v, setV] = useState(m)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  useEffect(() => setV(m), [m])
  const set = <K extends keyof Market>(k: K, x: Market[K]) => setV({ ...v, [k]: x })
  const t = (x: string) => (x.trim() ? x.trim() : null)
  async function save() {
    setErr('')
    setOk('')
    const { error } = await db()
      .from('lab_markets')
      .update({
        name: v.name,
        status: v.status,
        priority: v.priority,
        eu_member: v.eu_member,
        currency: t(v.currency ?? ''),
        languages: v.languages,
        overview: t(v.overview ?? ''),
        consumer_notes: t(v.consumer_notes ?? ''),
        distribution_channels: v.distribution_channels,
        pricing_notes: t(v.pricing_notes ?? ''),
        logistics_notes: t(v.logistics_notes ?? ''),
        regulatory_notes: t(v.regulatory_notes ?? ''),
        entry_barriers: v.entry_barriers,
        confidence: v.confidence,
        last_verified_at: v.last_verified_at || null,
        outdated: v.outdated,
      })
      .eq('code', v.code)
    if (error) return setErr(error.message)
    setOk('Saved.')
    onSaved()
  }
  const list = (k: 'distribution_channels' | 'entry_barriers') => (
    <AdminInput value={v[k].join(', ')} onChange={e => set(k, e.target.value.split(',').map(x => x.trim()).filter(Boolean))} />
  )
  return (
    <AdminCard className="p-5">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">
        {v.name} <span className="text-gray-400">{v.code}</span>
      </h2>
      <p className="text-xs text-gray-500 mb-4">Last changed {d(v.updated_at)}. Only write what you can source; leave the rest empty and brands will see it listed as missing.</p>
      <div className="grid grid-cols-3 gap-x-3">
        <AdminField label="Status">
          <AdminSelect value={v.status} onChange={e => set('status', e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Confidence">
          <AdminSelect value={v.confidence} onChange={e => set('confidence', e.target.value)}>
            <option value="unverified">Basic facts only</option>
            <option value="partial">Partly verified</option>
            <option value="verified">Verified</option>
          </AdminSelect>
        </AdminField>
        <AdminField label="Last verified">
          <AdminInput type="date" value={v.last_verified_at ?? ''} onChange={e => set('last_verified_at', e.target.value || null)} />
        </AdminField>
        <AdminField label="Currency">
          <AdminInput value={v.currency ?? ''} onChange={e => set('currency', e.target.value.toUpperCase().slice(0, 3))} />
        </AdminField>
        <AdminField label="Priority" hint="Lower shows first.">
          <AdminInput type="number" value={v.priority} onChange={e => set('priority', Number(e.target.value))} />
        </AdminField>
        <AdminField label="EU member">
          <AdminSelect value={v.eu_member == null ? '' : String(v.eu_member)} onChange={e => set('eu_member', e.target.value === '' ? null : e.target.value === 'true')}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </AdminSelect>
        </AdminField>
      </div>
      <fieldset className="mb-4">
        <legend className="text-sm font-medium text-gray-700 mb-1">Working languages</legend>
        <div className="flex flex-wrap gap-x-4">
          {LANGUAGES.map(([k, l]) => (
            <label key={k} className="flex items-center gap-1.5 text-sm">
              <input type="checkbox" checked={v.languages.includes(k)} onChange={() => set('languages', v.languages.includes(k) ? v.languages.filter(x => x !== k) : [...v.languages, k])} />
              {l}
            </label>
          ))}
        </div>
      </fieldset>
      <AdminField label="Overview">
        <AdminTextarea value={v.overview ?? ''} onChange={e => set('overview', e.target.value)} rows={3} />
      </AdminField>
      <AdminField label="Consumer behaviour">
        <AdminTextarea value={v.consumer_notes ?? ''} onChange={e => set('consumer_notes', e.target.value)} rows={3} />
      </AdminField>
      <AdminField label="Distribution channels" hint="Comma-separated.">
        {list('distribution_channels')}
      </AdminField>
      <AdminField label="Pricing">
        <AdminTextarea value={v.pricing_notes ?? ''} onChange={e => set('pricing_notes', e.target.value)} rows={2} />
      </AdminField>
      <AdminField label="Logistics">
        <AdminTextarea value={v.logistics_notes ?? ''} onChange={e => set('logistics_notes', e.target.value)} rows={2} />
      </AdminField>
      <AdminField label="Regulation">
        <AdminTextarea value={v.regulatory_notes ?? ''} onChange={e => set('regulatory_notes', e.target.value)} rows={2} />
      </AdminField>
      <AdminField label="Entry barriers" hint="Comma-separated.">
        {list('entry_barriers')}
      </AdminField>
      <AdminCheckbox label="Flag as possibly outdated" checked={v.outdated} onChange={e => set('outdated', e.target.checked)} />
      <AdminButton onClick={() => void save()}>Save market</AdminButton>
      <ErrorText>{err}</ErrorText>
      {ok ? <p className="text-sm text-green-700 mt-2">{ok}</p> : null}
      <Sources code={v.code} />
      <CategoryNotes code={v.code} />
    </AdminCard>
  )
}

export default function MarketsAdmin() {
  const [params, setParams] = useSearchParams()
  const list = useAdminLoad(() => must(db().from('lab_markets').select('*').order('priority')) as Promise<Market[]>, [])
  const open = list.data?.find(m => m.code === params.get('code')) ?? list.data?.[0]
  return (
    <div>
      <AdminPageHeader title="Markets" description="Country profiles used by the market comparison. Verified information carries its sources and dates; nothing is filled in automatically." />
      <ErrorText>{list.error}</ErrorText>
      <div className="grid lg:grid-cols-[14rem_minmax(0,1fr)] gap-6">
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {(list.data ?? []).map(m => (
              <li key={m.code}>
                <button type="button" onClick={() => setParams({ code: m.code })} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${m.code === open?.code ? 'bg-blue-50' : ''}`}>
                  <span className="font-medium">{m.name}</span>
                  <span className="block text-xs text-gray-500">
                    {m.status} · {m.confidence}
                    {m.is_fixture ? ' · fixture' : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>
        {open ? <Editor key={open.code} m={open} onSaved={() => void list.reload()} /> : null}
      </div>
    </div>
  )
}
