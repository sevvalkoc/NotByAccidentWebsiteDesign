import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { refreshSite } from '@/content'
import { AdminPageHeader, AdminCard, AdminField, AdminInput, AdminTextarea, AdminButton } from '@/admin/ui'

/* The five capability categories are a fixed taxonomy — every capability's
   `category` field and a fair amount of code (grouping, colour-coding,
   the admin's own category <select>) depends on exactly these five keys
   existing, so this screen deliberately has no add/remove, only edit. */

interface CategoryRow {
  key: string
  label: string
  blurb: string
  accent: string
  sort_order: number
}

export default function Categories() {
  const [rows, setRows] = useState<CategoryRow[] | null>(null)
  const [error, setError] = useState('')
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [savedKey, setSavedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return
    void load()
  }, [])

  async function load() {
    if (!supabase) return
    const { data, error } = await supabase.from('category_meta').select('*').order('sort_order', { ascending: true })
    if (error) {
      setError(error.message)
      return
    }
    setRows((data ?? []) as CategoryRow[])
  }

  function update(key: string, patch: Partial<CategoryRow>) {
    setRows(prev => prev && prev.map(r => (r.key === key ? { ...r, ...patch } : r)))
  }

  async function save(row: CategoryRow) {
    if (!supabase) return
    setSavingKey(row.key)
    setSavedKey(null)
    const { error } = await supabase
      .from('category_meta')
      .update({ label: row.label, blurb: row.blurb })
      .eq('key', row.key)
    setSavingKey(null)
    if (error) {
      setError(error.message)
      return
    }
    setSavedKey(row.key)
    refreshSite()
    setTimeout(() => setSavedKey(null), 2000)
  }

  if (!supabase) {
    return (
      <div>
        <AdminPageHeader title="Categories" description="The five capability categories shown on Home and Capabilities." />
        <p className="text-sm text-gray-500">Not connected to Supabase yet.</p>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="The five capability categories shown on the homepage and /capabilities — label and description only. The categories themselves are fixed, since every capability is tagged with one of these five."
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {!rows ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map(row => (
            <AdminCard key={row.key} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: row.accent }} aria-hidden="true" />
                <h2 className="text-sm font-semibold text-gray-900">{row.key}</h2>
              </div>
              <AdminField label="Label">
                <AdminInput value={row.label} onChange={e => update(row.key, { label: e.target.value })} />
              </AdminField>
              <AdminField label="Blurb">
                <AdminTextarea value={row.blurb} onChange={e => update(row.key, { blurb: e.target.value })} rows={2} />
              </AdminField>
              <div className="flex items-center gap-3">
                <AdminButton onClick={() => save(row)} disabled={savingKey === row.key}>
                  {savingKey === row.key ? 'Saving…' : `Save ${row.key}`}
                </AdminButton>
                {savedKey === row.key && <span className="text-sm text-green-600">Saved</span>}
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
