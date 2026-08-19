import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile, ProfileStatus } from '@/lib/database.types'
import { AdminPageHeader, AdminCard, AdminBadge, AdminSelect, AdminButton } from '@/admin/ui'

const statusTone: Record<ProfileStatus, 'green' | 'yellow' | 'red'> = {
  approved: 'green',
  pending: 'yellow',
  suspended: 'red',
}

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

  async function setStatus(id: string, status: ProfileStatus) {
    if (!supabase) return
    await supabase.from('profiles').update({ status }).eq('id', id)
    await load()
  }

  const pendingCount = rows?.filter(u => u.status === 'pending').length ?? 0

  return (
    <div>
      <AdminPageHeader
        title="Users"
        description={
          pendingCount > 0
            ? `Admin accounts and their roles. ${pendingCount} account${pendingCount === 1 ? '' : 's'} waiting on approval below.`
            : 'Admin accounts and their roles. New people can request access from the sign-up link on the sign-in page — approve them here once their email is verified.'
        }
      />
      {!isAdmin && <p className="text-sm text-yellow-700 mb-4">Only Admins can change roles or approve accounts — you can view this list as an Editor.</p>}
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <AdminCard>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Role</th>
                <th className="px-4 py-2 font-medium">Status</th>
                <th className="px-4 py-2 font-medium">Joined</th>
                {isAdmin && <th className="px-4 py-2 font-medium">Actions</th>}
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
                  <td className="px-4 py-3">
                    <AdminBadge tone={statusTone[u.status]}>{u.status}</AdminBadge>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString('en-GB')}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {u.status === 'pending' && (
                          <AdminButton variant="secondary" className="text-xs py-1" onClick={() => setStatus(u.id, 'approved')}>
                            Approve
                          </AdminButton>
                        )}
                        {u.status === 'approved' && (
                          <AdminButton variant="ghost" className="text-xs py-1" onClick={() => setStatus(u.id, 'suspended')}>
                            Suspend
                          </AdminButton>
                        )}
                        {u.status === 'suspended' && (
                          <AdminButton variant="secondary" className="text-xs py-1" onClick={() => setStatus(u.id, 'approved')}>
                            Reinstate
                          </AdminButton>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      )}
    </div>
  )
}
