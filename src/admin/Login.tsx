import { useState } from 'react'
import { Link } from 'react-router-dom'
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
            The database itself is already set up — schema and content are live in Supabase. What's missing is two
            environment variables on this deployment (Vercel → Project → Settings → Environment Variables):
          </p>
          <ul className="text-sm text-gray-600 mb-4 space-y-1 list-disc list-inside">
            <li>
              <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_URL</code> — from Supabase Dashboard →
              Settings → API → Project URL
            </li>
            <li>
              <code className="bg-gray-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> — same page, the{' '}
              <span className="italic">anon / public</span> key (never the service-role key)
            </li>
          </ul>
          <p className="text-sm text-gray-600">
            Add both, redeploy, and this screen is replaced by the real sign-in form. Full steps in{' '}
            <code className="bg-gray-100 px-1 rounded">docs/CMS.md</code>.
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

        <div className="flex items-center justify-between mt-4">
          <Link to="/admin/forgot-password" className="text-xs text-blue-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/admin/signup" className="text-xs text-blue-600 hover:underline">
            Create an account
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          New accounts need email verification and admin approval before they can sign in.
        </p>
      </form>
    </div>
  )
}
