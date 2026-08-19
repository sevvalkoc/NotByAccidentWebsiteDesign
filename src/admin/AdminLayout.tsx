import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { signOut } from '@/lib/auth'
import type { Profile } from '@/lib/database.types'

const NAV: { to: string; label: string }[] = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/pages', label: 'Pages' },
  { to: '/admin/work', label: 'Work' },
  { to: '/admin/notes', label: 'Blog / Notes' },
  { to: '/admin/trainings', label: 'Trainings' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/studio', label: 'Studio' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/clients', label: 'Clients' },
  { to: '/admin/partners', label: 'Partners' },
  { to: '/admin/media', label: 'Media Library' },
  { to: '/admin/seo', label: 'SEO' },
  { to: '/admin/navigation', label: 'Navigation' },
  { to: '/admin/contact', label: 'Footer / Contact' },
  { to: '/admin/submissions', label: 'Submissions' },
  { to: '/admin/brand', label: 'Brand Settings' },
  { to: '/admin/site', label: 'Site Settings' },
  { to: '/admin/users', label: 'Users' },
]

export default function AdminLayout({ profile, children }: { profile: Profile | null; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
        <div className="px-4 py-4 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">Not by Accident</p>
          <p className="text-xs text-gray-400">Admin</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-2 text-sm ${isActive ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
          <p className="text-xs text-gray-400 mb-2">{profile?.role === 'admin' ? 'Admin' : 'Editor'}</p>
          <button onClick={() => signOut()} className="text-xs text-gray-500 hover:text-gray-800 underline">
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-8">{children}</main>
    </div>
  )
}
