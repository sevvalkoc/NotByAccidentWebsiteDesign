import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminBadge, AdminSelect, ConfirmButton } from '@/admin/ui'

interface Submission {
  id: string
  name: string | null
  email: string
  company: string | null
  message: string | null
  budget: string | null
  timeline: string | null
  source: string
  status: string
  created_at: string
}

const STATUSES = ['new', 'read', 'replied', 'archived']

export default function Submissions() {
  const [rows, setRows] = useState<Submission[] | null>(null)

  async function load() {
    if (!supabase) return
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false })
    setRows((data as Submission[]) ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function setStatus(id: string, status: string) {
    if (!supabase) return
    await supabase.from('contact_submissions').update({ status }).eq('id', id)
    setRows(prev => prev?.map(r => (r.id === id ? { ...r, status } : r)) ?? null)
  }

  async function remove(id: string) {
    if (!supabase) return
    await supabase.from('contact_submissions').delete().eq('id', id)
    await load()
  }

  return (
    <div>
      <AdminPageHeader title="Submissions" description="Contact form, newsletter and waiting-list signups — all in one inbox, distinguished by source." />
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing yet.</p>
      ) : (
        <div className="space-y-3">
          {rows.map(r => (
            <AdminCard key={r.id} className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium text-gray-900">{r.name || r.email}</p>
                    <AdminBadge tone="blue">{r.source}</AdminBadge>
                    <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString('en-GB')}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.email}{r.company ? ` · ${r.company}` : ''}</p>
                  {r.message && <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{r.message}</p>}
                  {(r.budget || r.timeline) && (
                    <p className="text-xs text-gray-400 mt-1">{[r.budget, r.timeline].filter(Boolean).join(' · ')}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <AdminSelect value={r.status} onChange={e => setStatus(r.id, e.target.value)} className="w-auto text-xs py-1">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </AdminSelect>
                  <ConfirmButton onConfirm={() => remove(r.id)}>Delete</ConfirmButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
