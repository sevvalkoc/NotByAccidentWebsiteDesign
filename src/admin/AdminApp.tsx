import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth, isStaff, isAdmin, isPending, signOut } from '@/lib/auth'
import { supabaseReady } from '@/lib/supabase'
import type { Profile } from '@/lib/database.types'
import AdminLayout from '@/admin/AdminLayout'
import Login from '@/admin/Login'
import SignUp from '@/admin/SignUp'
import ForgotPassword from '@/admin/ForgotPassword'
import ResetPassword from '@/admin/ResetPassword'
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

/** Shown to a signed-in user whose profile isn't an approved admin/editor yet
 *  — either freshly signed up and waiting on an admin, or suspended. */
function AccountStatusScreen({ profile }: { profile: Profile | null }) {
  const pending = isPending(profile)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8 text-center">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">{pending ? 'Waiting on approval' : 'Access suspended'}</h1>
        <p className="text-sm text-gray-600 mb-6">
          {pending
            ? `Your account (${profile?.email}) is verified but hasn't been approved by an admin yet. You'll get access as soon as they approve it.`
            : `Your account (${profile?.email}) has been suspended. Contact an admin if you think this is a mistake.`}
        </p>
        <button onClick={() => signOut()} className="text-sm text-gray-500 hover:text-gray-800 underline">
          Sign out
        </button>
      </div>
    </div>
  )
}

function AdminShell({ profile }: { profile: Profile | null }) {
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

export default function AdminApp() {
  const { loading, session, profile } = useAuth()

  if (!supabaseReady) return <Login />
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    )
  }

  const approved = isStaff(profile)

  return (
    <Routes>
      <Route path="login" element={approved ? <Navigate to="/admin/dashboard" replace /> : <Login />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
      <Route
        path="*"
        element={approved ? <AdminShell profile={profile} /> : session ? <AccountStatusScreen profile={profile} /> : <Login />}
      />
    </Routes>
  )
}
