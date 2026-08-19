import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { updatePassword } from '@/lib/auth'
import { AdminButton, AdminInput } from '@/admin/ui'

/** Landing page for the "reset your password" email link. Supabase turns
 *  that link into a live (recovery) session automatically on load — this
 *  page just waits for it, then lets the user set a new password. */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setLoading(true)
    setError('')
    const res = await updatePassword(password)
    setLoading(false)
    if (res.error) setError(res.error)
    else {
      setDone(true)
      setTimeout(() => navigate('/admin/dashboard'), 1500)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Reset link not found</h1>
          <p className="text-sm text-gray-600 mb-6">
            Open this page from the link in your password reset email, or request a new one.
          </p>
          <Link to="/admin/forgot-password" className="text-sm text-blue-600 hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Password updated</h1>
          <p className="text-sm text-gray-600">Taking you to the dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Set a new password</h1>
        <p className="text-sm text-gray-500 mb-6">Choose something you haven't used before.</p>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">New password</span>
          <AdminInput
            type="password"
            required
            autoFocus
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>
        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">Confirm password</span>
          <AdminInput
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <AdminButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Saving…' : 'Save new password'}
        </AdminButton>
      </form>
    </div>
  )
}
