import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset } from '@/lib/auth'
import { AdminButton, AdminInput } from '@/admin/ui'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await requestPasswordReset(email)
    setLoading(false)
    // Show the same confirmation whether or not the address exists, so this
    // form can't be used to check who has an account.
    if (res.error) setError(res.error)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h1>
          <p className="text-sm text-gray-600 mb-6">
            If <span className="font-medium text-gray-900">{email}</span> has an account, we've sent a link to reset
            the password.
          </p>
          <Link to="/admin/login" className="text-sm text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Forgot password</h1>
        <p className="text-sm text-gray-500 mb-6">We'll email you a link to set a new one.</p>

        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
          <AdminInput type="email" required autoFocus value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <AdminButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Sending…' : 'Send reset link'}
        </AdminButton>

        <p className="text-xs text-gray-400 mt-6">
          <Link to="/admin/login" className="text-blue-600 hover:underline">
            Back to sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
