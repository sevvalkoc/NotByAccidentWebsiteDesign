import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminButton, AdminBadge, statusTone, AdminEmptyState, ConfirmButton } from '@/admin/ui'

interface Row {
  id: string
  title: string
  status: string
  featured: boolean
  updated_at: string
}

export default function NotesList() {
  const [rows, setRows] = useState<Row[] | null>(null)

  async function load() {
    if (!supabase) return
    const { data } = await supabase.from('articles').select('id, title, status, featured, updated_at').order('updated_at', { ascending: false })
    setRows((data as Row[]) ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function archive(id: string) {
    if (!supabase) return
    await supabase.from('articles').update({ status: 'archived' }).eq('id', id)
    await load()
  }

  return (
    <div>
      <AdminPageHeader
        title="Blog / Notes"
        description="Articles shown on /notes. Archiving hides an article without deleting it."
        actions={<Link to="/admin/notes/new"><AdminButton>+ New Article</AdminButton></Link>}
      />
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No articles yet" action={<Link to="/admin/notes/new"><AdminButton>+ New Article</AdminButton></Link>} />
      ) : (
        <AdminCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="px-4 py-2 font-medium">Title</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Featured</th>
                <th className="px-4 py-2 font-medium">Updated</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-3"><AdminBadge tone={statusTone(r.status)}>{r.status}</AdminBadge></td>
                  <td className="px-4 py-3 text-gray-500">{r.featured ? 'Yes' : ''}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(r.updated_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Link to={`/admin/notes/${r.id}`} className="text-sm text-blue-600 hover:underline mr-3">Edit</Link>
                    {r.status !== 'archived' && <ConfirmButton onConfirm={() => archive(r.id)} confirmLabel="Archive?">Archive</ConfirmButton>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  )
}
