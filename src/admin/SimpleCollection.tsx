import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminCheckbox,
  AdminEmptyState,
  ConfirmButton,
} from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

export type FieldConfig =
  | { key: string; label: string; type: 'text' | 'textarea' | 'url'; required?: boolean }
  | { key: string; label: string; type: 'media' }
  | { key: string; label: string; type: 'checkbox'; default?: boolean }

export interface SimpleCollectionConfig {
  table: string
  title: string
  description?: string
  fields: FieldConfig[]
  activeKey?: string // column that toggles public visibility, e.g. 'is_active'
  orderKey?: string // column used for manual ordering, e.g. 'sort_order'
  titleKey: string // which field to show as the row's headline in the list
  filter?: { column: string; value: string } // e.g. { column: 'location', value: 'header' }
  fixedValues?: Record<string, unknown> // applied to every row created here, e.g. { location: 'header' }
}

type Row = Record<string, unknown> & { id: string }

export default function SimpleCollection({ config }: { config: SimpleCollectionConfig }) {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [editing, setEditing] = useState<Row | null>(null)
  const [error, setError] = useState('')

  async function load() {
    if (!supabase) return
    let query = supabase.from(config.table).select('*')
    if (config.filter) query = query.eq(config.filter.column, config.filter.value)
    const { data, error } = config.orderKey
      ? await query.order(config.orderKey, { ascending: true })
      : await query.order('id', { ascending: true })
    if (error) setError(error.message)
    else setRows((data as Row[]) ?? [])
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.table])

  async function handleSave(values: Record<string, unknown>) {
    if (!supabase) return
    setError('')
    if (editing && editing.id !== 'new') {
      const { error } = await supabase.from(config.table).update(values).eq('id', editing.id)
      if (error) return setError(error.message)
    } else {
      const insertValues = { ...values, ...(config.fixedValues ?? {}) }
      if (config.orderKey) insertValues[config.orderKey] = rows?.length ?? 0
      const { error } = await supabase.from(config.table).insert(insertValues)
      if (error) return setError(error.message)
    }
    setEditing(null)
    await load()
  }

  async function handleDelete(id: string) {
    if (!supabase) return
    const { error } = await supabase.from(config.table).delete().eq('id', id)
    if (error) setError(error.message)
    else await load()
  }

  async function move(row: Row, direction: -1 | 1) {
    if (!supabase || !config.orderKey || !rows) return
    const idx = rows.findIndex(r => r.id === row.id)
    const swapWith = rows[idx + direction]
    if (!swapWith) return
    const a = row[config.orderKey]
    const b = swapWith[config.orderKey]
    await Promise.all([
      supabase.from(config.table).update({ [config.orderKey]: b }).eq('id', row.id),
      supabase.from(config.table).update({ [config.orderKey]: a }).eq('id', swapWith.id),
    ])
    await load()
  }

  return (
    <div>
      <AdminPageHeader
        title={config.title}
        description={config.description}
        actions={<AdminButton onClick={() => setEditing({ id: 'new' })}>+ Add</AdminButton>}
      />

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {editing && (
        <CollectionForm
          config={config}
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="Nothing here yet" body={`Add your first ${config.title.toLowerCase()} entry.`} />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {rows.map((row, i) => (
              <li key={row.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{String(row[config.titleKey] ?? '(untitled)')}</p>
                  {config.activeKey && !row[config.activeKey] && (
                    <span className="text-xs text-gray-400">Hidden from the public site</span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {config.orderKey && (
                    <>
                      <AdminButton variant="ghost" onClick={() => move(row, -1)} disabled={i === 0} aria-label="Move up">↑</AdminButton>
                      <AdminButton variant="ghost" onClick={() => move(row, 1)} disabled={i === rows.length - 1} aria-label="Move down">↓</AdminButton>
                    </>
                  )}
                  <AdminButton variant="secondary" onClick={() => setEditing(row)}>Edit</AdminButton>
                  <ConfirmButton onConfirm={() => handleDelete(row.id)}>Delete</ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  )
}

function CollectionForm({
  config,
  initial,
  onCancel,
  onSave,
}: {
  config: SimpleCollectionConfig
  initial: Row
  onCancel: () => void
  onSave: (values: Record<string, unknown>) => void
}) {
  const [values, setValues] = useState<Record<string, unknown>>(initial)

  function set(key: string, v: unknown) {
    setValues(prev => ({ ...prev, [key]: v }))
  }

  return (
    <AdminCard className="p-5 mb-6">
      <form
        onSubmit={e => {
          e.preventDefault()
          const out: Record<string, unknown> = {}
          for (const f of config.fields) {
            const fallback = f.type === 'media' ? null : f.type === 'checkbox' ? (f.default ?? false) : ''
            out[f.key] = values[f.key] ?? fallback
          }
          if (config.activeKey) out[config.activeKey] = values[config.activeKey] ?? true
          onSave(out)
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          {config.fields.map(f => (
            <div key={f.key} className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">{f.label}</span>
              {f.type === 'media' ? (
                <MediaPicker mediaId={(values[f.key] as string) ?? null} onChange={v => set(f.key, v)} label="" />
              ) : f.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={(values[f.key] as boolean) ?? f.default ?? false}
                  onChange={e => set(f.key, e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              ) : f.type === 'textarea' ? (
                <AdminTextarea
                  value={(values[f.key] as string) ?? ''}
                  required={f.required}
                  onChange={e => set(f.key, e.target.value)}
                />
              ) : (
                <AdminInput
                  type={f.type === 'url' ? 'url' : 'text'}
                  value={(values[f.key] as string) ?? ''}
                  required={f.required}
                  onChange={e => set(f.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        {config.activeKey && (
          <AdminCheckbox
            label="Visible on the public site"
            checked={(values[config.activeKey] as boolean) ?? true}
            onChange={e => set(config.activeKey!, e.target.checked)}
          />
        )}
        <div className="flex items-center gap-2 mt-2">
          <AdminButton type="submit">Save</AdminButton>
          <AdminButton type="button" variant="secondary" onClick={onCancel}>Cancel</AdminButton>
        </div>
      </form>
    </AdminCard>
  )
}
