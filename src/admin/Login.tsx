import { useState } from 'react'
import { signIn } from '@/lib/auth'
import { supabaseReady } from '@/lib/supabase'
import { AdminButton, AdminInput } from '@/admin/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!supabaseReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Not connected yet</h1>
          <p className="text-sm text-gray-600 mb-4">
            This site isn't connected to its Supabase backend yet, so there's no admin to sign into. Set{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>, run the migrations in{' '}
            <code className="bg-gray-100 px-1 rounded">supabase/migrations/</code>, and create your first admin
            user — full steps in <code className="bg-gray-100 px-1 rounded">docs/CMS.md</code>.
          </p>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn(email, password)
    setLoading(false)
    if (res.error) setError(res.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Not by Accident</h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to the admin dashboard.</p>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
          <AdminInput type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
          <AdminInput
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <AdminButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Signing in…' : 'Sign in'}
        </AdminButton>

        <p className="text-xs text-gray-400 mt-6">
          No public sign-up — admin accounts are created in the Supabase Dashboard. See docs/CMS.md.
        </p>
      </form>
    </div>
  )
}
