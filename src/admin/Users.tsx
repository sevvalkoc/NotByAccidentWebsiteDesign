import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/database.types'
import { AdminPageHeader, AdminCard, AdminBadge, AdminSelect } from '@/admin/ui'

export default function Users({ isAdmin }: { isAdmin: boolean }) {
  const [rows, setRows] = useState<Profile[] | null>(null)

  async function load() {
    if (!supabase) return
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: true })
    setRows((data as Profile[]) ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function setRole(id: string, role: 'admin' | 'editor') {
    if (!supabase) return
    await supabase.from('profiles').update({ role }).eq('id', id)
    await load()
  }

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description="Admin accounts and their roles. There is no self-service sign-up — invite new people from the Supabase Dashboard (Authentication → Users → Invite), then give them a role here. See docs/CMS.md."
      />
      {!isAdmin && <p className="text-sm text-yellow-700 mb-4">Only Admins can change roles — you can view this list as an Editor.</p>}
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <AdminCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(u => (
                <tr key={u.id}>
                  <td className="px-4 py-3 text-gray-900">{u.email}</td>
                  <td className="px-4 py-3">
                    {isAdmin ? (
                      <AdminSelect value={u.role} onChange={e => setRole(u.id, e.target.value as 'admin' | 'editor')} className="w-auto text-xs py-1">
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                      </AdminSelect>
                    ) : (
                      <AdminBadge tone={u.role === 'admin' ? 'blue' : 'gray'}>{u.role}</AdminBadge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  )
}
