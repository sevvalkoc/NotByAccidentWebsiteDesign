import { useState } from 'react'
import { Link } from 'react-router-dom'
import { signUp } from '@/lib/auth'
import { AdminButton, AdminInput } from '@/admin/ui'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signUp(email, password, fullName)
    setLoading(false)
    if (res.error) setError(res.error)
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h1>
          <p className="text-sm text-gray-600 mb-4">
            We sent a verification link to <span className="font-medium text-gray-900">{email}</span>. Click it to
            confirm your address.
          </p>
          <p className="text-sm text-gray-600">
            After that, an admin still needs to approve your account before you can sign in — you'll get access as
            soon as they do.
          </p>
          <Link to="/admin/login" className="inline-block text-sm text-blue-600 hover:underline mt-6">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="max-w-sm w-full bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Create an account</h1>
        <p className="text-sm text-gray-500 mb-6">
          You'll need to verify your email, then an admin approves access before you can sign in.
        </p>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Full name</span>
          <AdminInput required autoFocus value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
          <AdminInput type="email" required value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label className="block mb-6">
          <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
          <AdminInput
            type="password"
            required
            minLength={8}
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <AdminButton type="submit" disabled={loading} className="w-full justify-center">
          {loading ? 'Creating account…' : 'Create account'}
        </AdminButton>

        <p className="text-xs text-gray-400 mt-6">
          Already have access?{' '}
          <Link to="/admin/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
