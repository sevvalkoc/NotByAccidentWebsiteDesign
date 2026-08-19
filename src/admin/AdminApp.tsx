import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth, isStaff, isAdmin } from '@/lib/auth'
import { supabaseReady } from '@/lib/supabase'
import AdminLayout from '@/admin/AdminLayout'
import Login from '@/admin/Login'
import Dashboard from '@/admin/Dashboard'
import Pages from '@/admin/Pages'
import WorkList from '@/admin/WorkList'
import WorkEditor from '@/admin/WorkEditor'
import NotesList from '@/admin/NotesList'
import NotesEditor from '@/admin/NotesEditor'
import { TrainingsList, TrainingEditor } from '@/admin/Trainings'
import { ReportsList, ReportEditor } from '@/admin/Reports'
import Studio from '@/admin/Studio'
import Testimonials from '@/admin/Testimonials'
import Clients from '@/admin/Clients'
import Partners from '@/admin/Partners'
import MediaLibrary from '@/admin/MediaLibrary'
import Seo from '@/admin/Seo'
import Navigation from '@/admin/Navigation'
import ContactSettings from '@/admin/ContactSettings'
import Submissions from '@/admin/Submissions'
import BrandSettings from '@/admin/BrandSettings'
import SiteSettings from '@/admin/SiteSettings'
import Users from '@/admin/Users'

export default function AdminApp() {
  const { loading, profile } = useAuth()

  if (!supabaseReady) return <Login />
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }
  if (!isStaff(profile)) return <Login />

  return (
    <AdminLayout profile={profile}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pages" element={<Pages />} />
        <Route path="work" element={<WorkList />} />
        <Route path="work/:id" element={<WorkEditor />} />
        <Route path="notes" element={<NotesList />} />
        <Route path="notes/:id" element={<NotesEditor />} />
        <Route path="trainings" element={<TrainingsList />} />
        <Route path="trainings/:id" element={<TrainingEditor />} />
        <Route path="reports" element={<ReportsList />} />
        <Route path="reports/:id" element={<ReportEditor />} />
        <Route path="studio" element={<Studio />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="clients" element={<Clients />} />
        <Route path="partners" element={<Partners />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="seo" element={<Seo />} />
        <Route path="navigation" element={<Navigation />} />
        <Route path="contact" element={<ContactSettings />} />
        <Route path="submissions" element={<Submissions />} />
        <Route path="brand" element={<BrandSettings />} />
        <Route path="site" element={<SiteSettings />} />
        <Route path="users" element={<Users isAdmin={isAdmin(profile)} />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}
