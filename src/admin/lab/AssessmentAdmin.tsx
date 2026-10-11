import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AdminBadge, AdminButton, AdminCard, AdminCheckbox, AdminField, AdminInput, AdminPageHeader, AdminSelect, AdminTextarea, ConfirmButton, statusTone } from '@/admin/ui'
import { CATEGORIES, DISTRIBUTION, INDUSTRIES, OFFERINGS } from '@/lab/labels'
import { ErrorText, d, db, must, useAdminLoad } from './LabAdmin'

type Band = { key: string; label: string; min: number; max: number; summary?: string }
type Version = { id: string; version: number; title: string; status: string; category_weights: Record<string, number>; bands: Band[]; notes: string | null; published_at: string | null; created_at: string }
type Option = { id?: string; key: string; label: string; score: number; is_na: boolean; recommendation_key: string | null; sort: number }
type Question = {
  id: string
  key: string
  category: string
  kind: string
  prompt: string
  help: string | null
  why: string | null
  weight: number
  required: boolean
  in_preview: boolean
  applies_if: unknown
  sort: number
  lab_options: Option[]
}
type Rule = { id: string; key: string; title: string; body: string; category: string | null; condition: unknown; priority: number; partner_types: string[]; active: boolean }

const json = (v: unknown) => (v == null ? '' : JSON.stringify(v, null, 1))
function parseJson(s: string): unknown {
  if (!s.trim()) return null
  return JSON.parse(s)
}

function QuestionEditor({ q, editable, onSaved }: { q: Question; editable: boolean; onSaved: () => void }) {
  const [v, setV] = useState(q)
  const [cond, setCond] = useState(json(q.applies_if))
  const [opts, setOpts] = useState<Option[]>([...q.lab_options].sort((a, b) => a.sort - b.sort))
  const [err, setErr] = useState('')
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setV(q)
    setCond(json(q.applies_if))
    setOpts([...q.lab_options].sort((a, b) => a.sort - b.sort))
  }, [q])
  async function save() {
    setErr('')
    try {
      const applies_if = parseJson(cond)
      await must(
        db()
          .from('lab_questions')
          .update({ key: v.key, category: v.category, kind: v.kind, prompt: v.prompt, help: v.help || null, why: v.why || null, weight: v.weight, required: v.required, in_preview: v.in_preview, applies_if, sort: v.sort })
          .eq('id', q.id)
          .select(),
      )
      const keep = opts.filter(o => o.id).map(o => o.id!)
      const gone = q.lab_options.filter(o => !keep.includes(o.id!)).map(o => o.id!)
      if (gone.length) await must(db().from('lab_options').delete().in('id', gone).select())
      for (const [i, o] of opts.entries()) {
        const row = { question_id: q.id, key: o.key, label: o.label, score: o.score, is_na: o.is_na, recommendation_key: o.recommendation_key || null, sort: i + 1 }
        if (o.id) await must(db().from('lab_options').update(row).eq('id', o.id).select())
        else await must(db().from('lab_options').insert(row).select())
      }
      onSaved()
    } catch (e) {
      setErr(e instanceof SyntaxError ? `Condition is not valid JSON: ${e.message}` : (e as Error).message)
    }
  }
  const setO = (i: number, patch: Partial<Option>) => setOpts(opts.map((o, j) => (j === i ? { ...o, ...patch } : o)))
  return (
    <li className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen(!open)} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50" aria-expanded={open}>
        <span className="text-gray-400 tabular-nums mr-2">{q.sort}</span>
        <AdminBadge>{q.category}</AdminBadge> <span className="font-medium text-gray-900">{q.prompt}</span>
        <span className="block text-xs text-gray-500 mt-0.5">
          {q.key} · {q.kind} · weight {q.weight}
          {q.in_preview ? ' · in preview' : ''}
          {q.applies_if ? ' · conditional' : ''} · {q.lab_options.length} options
        </span>
      </button>
      {open ? (
        <div className="px-4 pb-4">
          <fieldset disabled={!editable}>
            <div className="grid grid-cols-4 gap-x-3">
              <AdminField label="Key">
                <AdminInput value={v.key} onChange={e => setV({ ...v, key: e.target.value })} />
              </AdminField>
              <AdminField label="Area">
                <AdminSelect value={v.category} onChange={e => setV({ ...v, category: e.target.value })}>
                  {CATEGORIES.map(([k, l]) => (
                    <option key={k} value={k}>
                      {l}
                    </option>
                  ))}
                </AdminSelect>
              </AdminField>
              <AdminField label="Kind">
                <AdminSelect value={v.kind} onChange={e => setV({ ...v, kind: e.target.value })}>
                  <option value="single">Single choice</option>
                  <option value="multi">Multiple choice (scores add up, max 100)</option>
                  <option value="scale">Scale</option>
                </AdminSelect>
              </AdminField>
              <AdminField label="Weight in its area">
                <AdminInput type="number" step="0.1" min={0.1} max={10} value={v.weight} onChange={e => setV({ ...v, weight: Number(e.target.value) })} />
              </AdminField>
            </div>
            <AdminField label="Question">
              <AdminInput value={v.prompt} onChange={e => setV({ ...v, prompt: e.target.value })} />
            </AdminField>
            <AdminField label="Help">
              <AdminInput value={v.help ?? ''} onChange={e => setV({ ...v, help: e.target.value })} />
            </AdminField>
            <AdminField label="Why we ask">
              <AdminTextarea value={v.why ?? ''} onChange={e => setV({ ...v, why: e.target.value })} rows={2} />
            </AdminField>
            <div className="flex gap-6">
              <AdminCheckbox label="Required" checked={v.required} onChange={e => setV({ ...v, required: e.target.checked })} />
              <AdminCheckbox label="Part of the public 6-question preview" checked={v.in_preview} onChange={e => setV({ ...v, in_preview: e.target.checked })} />
              <AdminField label="Order">
                <AdminInput type="number" value={v.sort} onChange={e => setV({ ...v, sort: Number(e.target.value) })} />
              </AdminField>
            </div>
            <AdminField
              label="Show only if (JSON, optional)"
              hint={`A list; every condition must hold. e.g. [{"source":"answer","question":"channels","not_in":["not_selling"]}] or [{"source":"brand","field":"offering","in":["physical","mixed"]}]`}
            >
              <AdminTextarea value={cond} onChange={e => setCond(e.target.value)} rows={2} className="font-mono text-xs" />
            </AdminField>
            <table className="w-full text-sm mb-3">
              <thead className="text-xs text-gray-500 text-left">
                <tr>
                  <th className="py-1">Key</th>
                  <th>Answer</th>
                  <th>Score 0–100</th>
                  <th>N/A</th>
                  <th>Triggers rule</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {opts.map((o, i) => (
                  <tr key={o.id ?? `new-${i}`}>
                    <td className="pr-2 py-1 w-28">
                      <AdminInput value={o.key} onChange={e => setO(i, { key: e.target.value })} aria-label="Option key" />
                    </td>
                    <td className="pr-2">
                      <AdminInput value={o.label} onChange={e => setO(i, { label: e.target.value })} aria-label="Answer" />
                    </td>
                    <td className="pr-2 w-24">
                      <AdminInput type="number" min={0} max={100} value={o.score} onChange={e => setO(i, { score: Number(e.target.value) })} aria-label="Score" />
                    </td>
                    <td className="pr-2 w-12 text-center">
                      <input type="checkbox" checked={o.is_na} onChange={e => setO(i, { is_na: e.target.checked })} aria-label="Not applicable" />
                    </td>
                    <td className="pr-2 w-40">
                      <AdminInput value={o.recommendation_key ?? ''} onChange={e => setO(i, { recommendation_key: e.target.value })} aria-label="Recommendation key" />
                    </td>
                    <td>
                      <AdminButton variant="ghost" onClick={() => setOpts(opts.filter((_, j) => j !== i))}>
                        ×
                      </AdminButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editable ? (
              <div className="flex gap-2">
                <AdminButton variant="secondary" onClick={() => setOpts([...opts, { key: `option_${opts.length + 1}`, label: '', score: 0, is_na: false, recommendation_key: null, sort: opts.length + 1 }])}>
                  Add answer
                </AdminButton>
                <AdminButton onClick={() => void save()}>Save question</AdminButton>
                <ConfirmButton onConfirm={() => void db().from('lab_questions').delete().eq('id', q.id).then(onSaved)}>Delete question</ConfirmButton>
              </div>
            ) : null}
          </fieldset>
          <ErrorText>{err}</ErrorText>
        </div>
      ) : null}
    </li>
  )
}

function Preview({ version, questions }: { version: Version; questions: Question[] }) {
  const [brand, setBrand] = useState({ offering: 'physical', industry: 'fashion', distribution_model: 'retail' })
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [res, setRes] = useState<{ overall: number | null; band: Band | null; categories: Record<string, { score: number | null }>; applicable_keys: string[]; missing_required: string[] } | null>(null)
  const [err, setErr] = useState('')
  async function run() {
    setErr('')
    const r = await db().rpc('lab_admin_preview_score', { p_version: version.id, p_brand: brand, p_answers: answers })
    if (r.error) setErr(r.error.message)
    else setRes(r.data)
  }
  return (
    <AdminCard className="p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-1">Preview scoring (writes nothing)</h2>
      <p className="text-xs text-gray-500 mb-3">Pick answers for a test brand and see the score this version would give.</p>
      <div className="grid grid-cols-3 gap-x-3">
        <AdminField label="Offering">
          <AdminSelect value={brand.offering} onChange={e => setBrand({ ...brand, offering: e.target.value })}>
            {OFFERINGS.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Industry">
          <AdminSelect value={brand.industry} onChange={e => setBrand({ ...brand, industry: e.target.value })}>
            {INDUSTRIES.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
        <AdminField label="Distribution">
          <AdminSelect value={brand.distribution_model} onChange={e => setBrand({ ...brand, distribution_model: e.target.value })}>
            {DISTRIBUTION.map(([k, l]) => (
              <option key={k} value={k}>
                {l}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      </div>
      <div className="max-h-96 overflow-auto border border-gray-100 rounded p-2 mb-3">
        {questions.map(q => (
          <label key={q.id} className="block text-sm mb-2">
            <span className="text-gray-700">{q.prompt}</span>
            <AdminSelect value={answers[q.key]?.[0] ?? ''} onChange={e => setAnswers({ ...answers, [q.key]: e.target.value ? [e.target.value] : [] })}>
              <option value="">(no answer)</option>
              {q.lab_options.map(o => (
                <option key={o.key} value={o.key}>
                  {o.label} ({o.is_na ? 'N/A' : o.score})
                </option>
              ))}
            </AdminSelect>
          </label>
        ))}
      </div>
      <AdminButton onClick={() => void run()}>Score</AdminButton>
      <ErrorText>{err}</ErrorText>
      {res ? (
        <div className="text-sm mt-3">
          <p className="text-lg font-semibold">
            {res.overall ?? '—'} · {res.band?.label ?? 'no band'}
          </p>
          <p className="text-gray-600">{CATEGORIES.map(([k, l]) => `${l}: ${res.categories[k]?.score ?? '—'}`).join(' · ')}</p>
          <p className="text-xs text-gray-500">
            {res.applicable_keys.length} questions apply; {res.missing_required.length} required still unanswered.
          </p>
        </div>
      ) : null}
    </AdminCard>
  )
}

function VersionEditor({ v, onChanged }: { v: Version; onChanged: () => void }) {
  const qs = useAdminLoad(() => must(db().from('lab_questions').select('*, lab_options(*)').eq('version_id', v.id).order('sort')) as Promise<Question[]>, [v.id])
  const editable = v.status === 'draft'
  const [w, setW] = useState(v.category_weights)
  const [bands, setBands] = useState(v.bands)
  const [title, setTitle] = useState(v.title)
  const [notes, setNotes] = useState(v.notes ?? '')
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')
  useEffect(() => {
    setW(v.category_weights)
    setBands(v.bands)
    setTitle(v.title)
    setNotes(v.notes ?? '')
  }, [v])
  const total = Object.values(w).reduce((a, b) => a + (Number(b) || 0), 0)
  async function saveMeta() {
    setErr('')
    setOk('')
    const { error } = await db().from('lab_assessment_versions').update({ title, notes: notes || null, category_weights: w, bands }).eq('id', v.id)
    if (error) return setErr(error.message)
    setOk('Saved.')
    onChanged()
  }
  async function publish() {
    setErr('')
    const r = await db().rpc('lab_admin_publish_version', { p_version: v.id })
    if (r.error) return setErr(r.error.message)
    onChanged()
  }
  async function addQuestion() {
    const sort = Math.max(0, ...(qs.data ?? []).map(q => q.sort)) + 1
    const { data, error } = await db()
      .from('lab_questions')
      .insert({ version_id: v.id, key: `question_${sort}`, category: 'brand', kind: 'single', prompt: 'New question', weight: 1, required: true, sort })
      .select('id')
      .single()
    if (error) return setErr(error.message)
    await db().from('lab_options').insert([
      { question_id: data.id, key: 'yes', label: 'Yes', score: 100, sort: 1 },
      { question_id: data.id, key: 'no', label: 'No', score: 0, sort: 2 },
    ])
    await qs.reload()
  }
  return (
    <div className="space-y-6">
      <AdminCard className="p-5">
        <div className="flex justify-between items-start mb-4 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Version {v.version} <AdminBadge tone={statusTone(v.status)}>{v.status}</AdminBadge>
            </h2>
            <p className="text-xs text-gray-500">
              Created {d(v.created_at)}
              {v.published_at ? ` · published ${d(v.published_at)}` : ''}. {editable ? 'Draft: edit freely, preview, then publish.' : 'Published and archived versions are frozen so earlier results stay reproducible. Copy it to a new draft to change anything.'}
            </p>
          </div>
          {editable ? <AdminButton onClick={() => void publish()}>Publish this version</AdminButton> : null}
        </div>
        <fieldset disabled={!editable}>
          <div className="grid grid-cols-2 gap-x-3">
            <AdminField label="Title">
              <AdminInput value={title} onChange={e => setTitle(e.target.value)} />
            </AdminField>
            <AdminField label="Notes">
              <AdminInput value={notes} onChange={e => setNotes(e.target.value)} />
            </AdminField>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Area weights</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-x-3">
            {CATEGORIES.map(([k, l]) => (
              <AdminField key={k} label={`${l} %`}>
                <AdminInput type="number" min={0} max={100} value={w[k] ?? 0} onChange={e => setW({ ...w, [k]: Number(e.target.value) })} />
              </AdminField>
            ))}
          </div>
          <p className={`text-sm mb-4 ${total === 100 ? 'text-gray-500' : 'text-red-600'}`}>Total {total}% (must be 100 to publish)</p>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Bands</h3>
          <p className="text-xs text-gray-500 mb-2">Contiguous from 0 to 100. Describe preparation, never the chance of success.</p>
          {bands.map((b, i) => (
            <div key={i} className="grid grid-cols-[5rem_5rem_minmax(0,1fr)] gap-2 mb-2">
              <AdminInput type="number" value={b.min} onChange={e => setBands(bands.map((x, j) => (j === i ? { ...x, min: Number(e.target.value) } : x)))} aria-label="From" />
              <AdminInput type="number" value={b.max} onChange={e => setBands(bands.map((x, j) => (j === i ? { ...x, max: Number(e.target.value) } : x)))} aria-label="To" />
              <AdminInput value={b.label} onChange={e => setBands(bands.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} aria-label="Label" />
              <span />
              <span />
              <AdminTextarea value={b.summary ?? ''} onChange={e => setBands(bands.map((x, j) => (j === i ? { ...x, summary: e.target.value } : x)))} rows={2} aria-label="Summary" />
            </div>
          ))}
          {editable ? (
            <AdminButton onClick={() => void saveMeta()} className="mt-2">
              Save weights & bands
            </AdminButton>
          ) : null}
        </fieldset>
        <ErrorText>{err}</ErrorText>
        {ok ? <p className="text-sm text-green-700 mt-2">{ok}</p> : null}
      </AdminCard>

      <AdminCard>
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900">Questions ({qs.data?.length ?? 0})</h2>
          {editable ? (
            <AdminButton variant="secondary" onClick={() => void addQuestion()}>
              Add question
            </AdminButton>
          ) : null}
        </div>
        <ErrorText>{qs.error}</ErrorText>
        <ul>
          {(qs.data ?? []).map(q => (
            <QuestionEditor key={q.id} q={q} editable={editable} onSaved={() => void qs.reload()} />
          ))}
        </ul>
      </AdminCard>

      {qs.data ? <Preview version={v} questions={qs.data} /> : null}
    </div>
  )
}

function Rules() {
  const list = useAdminLoad(() => must(db().from('lab_recommendation_rules').select('*').order('priority', { ascending: false })) as Promise<Rule[]>, [])
  const [open, setOpen] = useState<string | null>(null)
  const [draft, setDraft] = useState<Rule | null>(null)
  const [cond, setCond] = useState('')
  const [err, setErr] = useState('')
  function edit(r: Rule) {
    setOpen(r.id)
    setDraft(r)
    setCond(json(r.condition))
  }
  async function save() {
    if (!draft) return
    setErr('')
    try {
      const condition = parseJson(cond) ?? {}
      await must(db().from('lab_recommendation_rules').update({ title: draft.title, body: draft.body, category: draft.category || null, condition, priority: draft.priority, active: draft.active }).eq('id', draft.id).select())
      setOpen(null)
      await list.reload()
    } catch (e) {
      setErr(e instanceof SyntaxError ? `Condition is not valid JSON: ${e.message}` : (e as Error).message)
    }
  }
  return (
    <AdminCard>
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Recommendation rules</h2>
        <p className="text-xs text-gray-500">
          Deterministic: a rule fires when its condition holds for a result, or when an answer names its key. Condition types: category_below, category_at_least, overall_below, overall_at_least, option_selected, brand_field, or manual (fires only when an answer names the rule). Changes apply to new results.
        </p>
      </div>
      <ul>
        {(list.data ?? []).map(r => (
          <li key={r.id} className="border-b border-gray-100 last:border-0">
            <button type="button" onClick={() => (open === r.id ? setOpen(null) : edit(r))} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50">
              <span className="font-medium">{r.title}</span> {r.active ? null : <AdminBadge>inactive</AdminBadge>}
              <span className="block text-xs text-gray-500">
                {r.key} · priority {r.priority} · {JSON.stringify(r.condition)}
              </span>
            </button>
            {open === r.id && draft ? (
              <div className="px-4 pb-4">
                <AdminField label="Title">
                  <AdminInput value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} />
                </AdminField>
                <AdminField label="Advice">
                  <AdminTextarea value={draft.body} onChange={e => setDraft({ ...draft, body: e.target.value })} rows={3} />
                </AdminField>
                <div className="grid grid-cols-2 gap-x-3">
                  <AdminField label="Area">
                    <AdminSelect value={draft.category ?? ''} onChange={e => setDraft({ ...draft, category: e.target.value || null })}>
                      <option value="">—</option>
                      {CATEGORIES.map(([k, l]) => (
                        <option key={k} value={k}>
                          {l}
                        </option>
                      ))}
                    </AdminSelect>
                  </AdminField>
                  <AdminField label="Priority (higher shows first)">
                    <AdminInput type="number" min={0} max={100} value={draft.priority} onChange={e => setDraft({ ...draft, priority: Number(e.target.value) })} />
                  </AdminField>
                </div>
                <AdminField label="Condition (JSON)" hint='e.g. {"type":"category_below","category":"pmf","value":50}'>
                  <AdminTextarea value={cond} onChange={e => setCond(e.target.value)} rows={2} className="font-mono text-xs" />
                </AdminField>
                <AdminCheckbox label="Active" checked={draft.active} onChange={e => setDraft({ ...draft, active: e.target.checked })} />
                <AdminButton onClick={() => void save()}>Save rule</AdminButton>
                <ErrorText>{err}</ErrorText>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </AdminCard>
  )
}

export default function AssessmentAdmin() {
  const [params, setParams] = useSearchParams()
  const versions = useAdminLoad(() => must(db().from('lab_assessment_versions').select('*').order('version', { ascending: false })) as Promise<Version[]>, [])
  const tab = params.get('tab') === 'rules' ? 'rules' : 'versions'
  const selected = versions.data?.find(v => v.id === params.get('v')) ?? versions.data?.find(v => v.status === 'draft') ?? versions.data?.find(v => v.status === 'published')
  const [err, setErr] = useState('')
  async function clone(id: string) {
    setErr('')
    const r = await db().rpc('lab_admin_clone_version', { p_version: id })
    if (r.error) return setErr(r.error.message)
    await versions.reload()
    setParams({ v: r.data as string })
  }
  async function remove(v: Version) {
    setErr('')
    const { error } = await db().from('lab_assessment_versions').delete().eq('id', v.id)
    if (error) return setErr(error.message)
    setParams({})
    await versions.reload()
  }
  return (
    <div>
      <AdminPageHeader
        title="Assessment builder"
        description="Questions, answers, scores, weights and bands are versioned. Results record the version they used, so publishing never changes an earlier result."
        actions={
          <>
            <AdminButton variant={tab === 'versions' ? 'primary' : 'secondary'} onClick={() => setParams({})}>
              Versions
            </AdminButton>
            <AdminButton variant={tab === 'rules' ? 'primary' : 'secondary'} onClick={() => setParams({ tab: 'rules' })}>
              Recommendation rules
            </AdminButton>
          </>
        }
      />
      <ErrorText>{err || versions.error}</ErrorText>
      {tab === 'rules' ? (
        <Rules />
      ) : (
        <div className="grid xl:grid-cols-[16rem_minmax(0,1fr)] gap-6">
          <AdminCard>
            <ul className="divide-y divide-gray-100">
              {(versions.data ?? []).map(v => (
                <li key={v.id} className={`px-4 py-3 text-sm ${v.id === selected?.id ? 'bg-blue-50' : ''}`}>
                  <button type="button" className="text-left w-full" onClick={() => setParams({ v: v.id })}>
                    <span className="font-medium">Version {v.version}</span> <AdminBadge tone={statusTone(v.status)}>{v.status}</AdminBadge>
                    <span className="block text-xs text-gray-500">{v.notes ?? v.title}</span>
                  </button>
                  <div className="flex gap-2 mt-1">
                    <AdminButton variant="ghost" onClick={() => void clone(v.id)}>
                      Copy to new draft
                    </AdminButton>
                    {v.status === 'draft' ? <ConfirmButton onConfirm={() => void remove(v)}>Delete</ConfirmButton> : null}
                  </div>
                </li>
              ))}
            </ul>
          </AdminCard>
          {selected ? <VersionEditor key={selected.id} v={selected} onChanged={() => void versions.reload()} /> : null}
        </div>
      )}
    </div>
  )
}
