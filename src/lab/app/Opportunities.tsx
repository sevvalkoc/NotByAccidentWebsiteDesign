import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useSection } from '@/content'
import { q, useBrandId, type Activity, type Opportunity } from '../api'
import { OPP_KINDS, OPP_STATUS, fmtDate, label } from '../labels'
import { Empty, Loading, Notice, SelectField, Tag, TextField, useAction, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

type Edit = { title: string; kind: string; status: string; next_action: string; next_action_on: string; notes: string }
const toEdit = (o?: Opportunity): Edit => ({
  title: o?.title ?? '',
  kind: o?.kind ?? 'retail',
  status: o?.status ?? 'exploring',
  next_action: o?.next_action ?? '',
  next_action_on: o?.next_action_on ?? '',
  notes: o?.notes ?? '',
})
const row = (e: Edit) => ({
  title: e.title.trim(),
  kind: e.kind,
  status: e.status,
  next_action: e.next_action.trim() || null,
  next_action_on: e.next_action_on || null,
  notes: e.notes.trim() || null,
})

function Form({ value, onChange }: { value: Edit; onChange: (e: Edit) => void }) {
  const set = (k: keyof Edit) => (v: string) => onChange({ ...value, [k]: v })
  return (
    <>
      <TextField label="Title" value={value.title} onChange={set('title')} required maxLength={160} />
      <div className="form__row">
        <SelectField label="Kind" value={value.kind} onChange={set('kind')} options={OPP_KINDS} />
        <SelectField label="Status" value={value.status} onChange={set('status')} options={OPP_STATUS} />
      </div>
      <div className="form__row">
        <TextField label="Next action" value={value.next_action} onChange={set('next_action')} maxLength={300} />
        <TextField label="By" type="date" value={value.next_action_on} onChange={set('next_action_on')} />
      </div>
      <TextField label="Notes" value={value.notes} onChange={set('notes')} multiline maxLength={4000} />
    </>
  )
}

export default function Opportunities() {
  const brandId = useBrandId()!
  const [params, setParams] = useSearchParams()
  const empty = useSection('lab-app', 'opportunities_empty')
  useAppPage('Opportunities', '/lab/opportunities')
  const list = useLoad(() => q<Opportunity[]>(c => c.from('lab_opportunities').select('*').eq('brand_id', brandId).order('last_activity_at', { ascending: false })), [brandId])
  const openId = params.get('id')
  const open = list.data?.find(o => o.id === openId)
  const acts = useLoad(
    () => (openId ? q<Activity[]>(c => c.from('lab_opportunity_activities').select('id, opportunity_id, kind, body, created_at').eq('opportunity_id', openId).order('created_at', { ascending: false })) : Promise.resolve([])),
    [openId],
  )
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState<Edit>(toEdit())
  const [edit, setEdit] = useState<Edit | null>(null)
  const [note, setNote] = useState('')
  const a = useAction()

  async function create() {
    if (!draft.title.trim()) return a.setError('Give it a title.')
    await a.run(async () => {
      const o = await q<Opportunity>(c => c.from('lab_opportunities').insert({ brand_id: brandId, ...row(draft) }).select().single())
      setAdding(false)
      setDraft(toEdit())
      await list.reload()
      setParams({ id: o.id })
    })
  }
  async function saveEdit() {
    if (!open || !edit) return
    if (!edit.title.trim()) return a.setError('Give it a title.')
    await a.run(async () => {
      await q(c => c.from('lab_opportunities').update(row(edit)).eq('id', open.id))
      setEdit(null)
      await Promise.all([list.reload(), acts.reload()])
    })
  }
  async function addNote() {
    if (!open || !note.trim()) return
    await a.run(async () => {
      await q(c => c.from('lab_opportunity_activities').insert({ opportunity_id: open.id, kind: 'note', body: note.trim() }))
      setNote('')
      await Promise.all([list.reload(), acts.reload()])
    })
  }
  async function remove() {
    if (!open || !window.confirm(`Delete “${open.title}” and its timeline?`)) return
    await a.run(async () => {
      await q(c => c.from('lab_opportunities').delete().eq('id', open.id))
      setParams({})
      await list.reload()
    })
  }

  if (list.loading && !list.data) return <Loading />
  return (
    <div className="lab-screen">
      <AppHead eyebrow="Track" title="Opportunities">
        <button type="button" className="btn btn--ghost" onClick={() => setAdding(true)}>
          Add an opportunity
        </button>
      </AppHead>
      <Notice tone="error">{a.error || list.error}</Notice>

      {adding ? (
        <form
          className="form lab-form lab-panel"
          onSubmit={e => {
            e.preventDefault()
            void create()
          }}
        >
          <h2 className="label">New opportunity</h2>
          <Form value={draft} onChange={setDraft} />
          <div className="actions">
            <button type="submit" className="btn" disabled={a.busy}>
              Add
            </button>
            <button type="button" className="link-q" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {list.data?.length ? (
        <div className="lab-opps lab-gap">
          <ul role="list" className="lab-opps__list">
            {list.data.map(o => (
              <li key={o.id}>
                <button type="button" className="lab-opps__item" aria-current={o.id === openId || undefined} onClick={() => (setEdit(null), setParams({ id: o.id }))}>
                  <span className="t-title">{o.title}</span>
                  <span className="t-caption dimmer">
                    {label(OPP_STATUS, o.status)} · {label(OPP_KINDS, o.kind)}
                    {o.next_action_on ? ` · next by ${fmtDate(o.next_action_on)}` : ''}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="lab-opps__detail">
            {open ? (
              <article aria-labelledby="opp-title">
                <header className="lab-panel__head">
                  <div>
                    <h2 id="opp-title" className="t-section">
                      {open.title}
                    </h2>
                    <div className="lab-tags">
                      <Tag tone={open.status === 'won' ? 'accent' : open.status === 'lost' ? 'warn' : 'quiet'}>{label(OPP_STATUS, open.status)}</Tag>
                      <Tag tone="quiet">{label(OPP_KINDS, open.kind)}</Tag>
                      {open.introduction_id ? <Tag tone="quiet">From an introduction</Tag> : null}
                    </div>
                  </div>
                  {!edit ? (
                    <button type="button" className="link-q t-small" onClick={() => setEdit(toEdit(open))}>
                      Edit
                    </button>
                  ) : null}
                </header>
                {edit ? (
                  <form
                    className="form lab-form lab-gap"
                    onSubmit={e => {
                      e.preventDefault()
                      void saveEdit()
                    }}
                  >
                    <Form value={edit} onChange={setEdit} />
                    <div className="actions">
                      <button type="submit" className="btn" disabled={a.busy}>
                        Save
                      </button>
                      <button type="button" className="link-q" onClick={() => setEdit(null)}>
                        Cancel
                      </button>
                      <button type="button" className="link-q dimmer" onClick={() => void remove()}>
                        Delete
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {open.next_action ? (
                      <p className="lab-gap-s">
                        <span className="label">Next action</span> {open.next_action}
                        {open.next_action_on ? <span className="dimmer"> · by {fmtDate(open.next_action_on)}</span> : null}
                      </p>
                    ) : null}
                    {open.notes ? <p className="dim lab-gap-s lab-pre">{open.notes}</p> : null}
                  </>
                )}
                <h3 className="label lab-gap">Timeline</h3>
                <form
                  className="lab-note lab-gap-s"
                  onSubmit={e => {
                    e.preventDefault()
                    void addNote()
                  }}
                >
                  <label className="sr-only" htmlFor="opp-note">
                    Add to the timeline
                  </label>
                  <input id="opp-note" className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Add what happened" maxLength={2000} />
                  <button type="submit" className="link-q t-caption" disabled={!note.trim() || a.busy}>
                    Add
                  </button>
                </form>
                <ol role="list" className="lab-timeline lab-gap-s">
                  {(acts.data ?? []).map(x => (
                    <li key={x.id}>
                      <span className="t-caption dimmer">{fmtDate(x.created_at)}</span>
                      <span className={x.kind === 'note' ? 't-small' : 't-small dim'}>{x.body}</span>
                    </li>
                  ))}
                  <li>
                    <span className="t-caption dimmer">{fmtDate(open.created_at)}</span>
                    <span className="t-small dim">Opened</span>
                  </li>
                </ol>
              </article>
            ) : (
              <p className="dim">Choose an opportunity to see its timeline.</p>
            )}
          </div>
        </div>
      ) : !adding ? (
        <Empty title={empty?.title ?? 'No opportunities yet.'} body={empty?.body}>
          <button type="button" className="btn btn--ghost" onClick={() => setAdding(true)}>
            Add an opportunity
          </button>
        </Empty>
      ) : null}
    </div>
  )
}
