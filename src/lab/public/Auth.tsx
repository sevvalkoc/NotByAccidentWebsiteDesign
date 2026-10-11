import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Link from '@/components/Link'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Zone from '@/components/Zone'
import { usePage } from '@/hooks/usePage'
import { getClient, labRequestReset, labResendConfirmation, labSignIn, labSignUp, labUpdatePassword, useLabSession } from '../api'
import { Notice, TextField, useAction } from '../ui'
import '../lab.css'

const MIN_PASSWORD = 8

/** Only same-site paths inside the Lab are accepted as a return address. */
const safeNext = (n: string | null) => (n && /^\/lab\/[a-z-]+(\?[\w=&%-]*)?$/.test(n) ? n : '/lab/dashboard')

function AuthFrame({ title, path, lede, noindex, children, aside }: { title: string; path: string; lede?: ReactNode; noindex?: boolean; children: ReactNode; aside?: ReactNode }) {
  const crumbs = [
    { name: 'The Lab', path: '/lab' },
    { name: title, path },
  ]
  usePage({
    title: `${title} · The Lab`,
    description: 'The Lab by Not by Accident: test your brand’s readiness for a new European market, compare markets and find compatible partners.',
    path,
    alternates: false,
    noindex,
    jsonLd: [crumbSchema(crumbs, 'en')],
  })
  return (
    <main id="main" tabIndex={-1} className="lab">
      <PageHead title={title} env="frost" crumbs={crumbs} sub={lede} />
      <Zone env="frost" className="wrap band lab-auth">
        <div className="lab-auth__form">{children}</div>
        {aside ? <aside className="lab-auth__aside t-small dim">{aside}</aside> : null}
      </Zone>
    </main>
  )
}

function SignedInNote() {
  const s = useLabSession()
  if (s.status !== 'in') return null
  return (
    <Notice>
      You’re signed in as {s.session?.user.email}.{' '}
      <Link to="/lab/dashboard" className="link">
        Go to your dashboard
      </Link>
    </Notice>
  )
}

export function LabSignUp() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [done, setDone] = useState<'confirm' | 'existing' | null>(null)
  const [resent, setResent] = useState(false)
  const a = useAction()

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (password.length < MIN_PASSWORD) return a.setError(`Use at least ${MIN_PASSWORD} characters for the password.`)
    if (!agree) return a.setError('Please confirm you’ve read how The Lab uses your data.')
    await a.run(async () => {
      const r = await labSignUp({ email: email.trim(), password, fullName: name.trim(), marketing, partnerSharing: sharing })
      if (r.existing) setDone('existing')
      else if (r.confirm) setDone('confirm')
      else navigate('/lab/dashboard')
    })
  }

  if (done === 'confirm')
    return (
      <AuthFrame title="Check your inbox" path="/lab/sign-up">
        <p className="t-lead">We’ve sent a confirmation link to {email}. Open it to activate your account; it takes you straight to your dashboard.</p>
        <p className="dim lab-gap-s">Nothing after a few minutes? Check spam, or send it again.</p>
        <div className="actions lab-gap">
          <button type="button" className="btn btn--ghost" disabled={a.busy || resent} onClick={() => a.run(async () => (await labResendConfirmation(email), setResent(true)))}>
            {resent ? 'Sent again' : 'Resend the link'}
          </button>
        </div>
        <Notice tone="error">{a.error}</Notice>
      </AuthFrame>
    )
  if (done === 'existing')
    return (
      <AuthFrame title="You already have an account" path="/lab/sign-up">
        <p className="t-lead">There’s already an account for {email}. Sign in, or set a new password if you’ve forgotten it.</p>
        <div className="actions lab-gap">
          <Link to="/lab/login" className="btn">
            Sign in
          </Link>
          <Link to="/lab/forgot-password" className="link-q">
            Reset the password
          </Link>
        </div>
      </AuthFrame>
    )

  return (
    <AuthFrame
      title="Create your Lab account"
      path="/lab/sign-up"
      lede="A minute now; the brand profile and assessment come next."
      aside={
        <>
          <h2 className="label">What we do with your data</h2>
          <ul className="lab-list lab-gap-s">
            <li>We store your account, your brand profile and your answers to run The Lab for you.</li>
            <li>Your scores and matches are calculated from your data and visible only to you, people you add to your brand, and our team.</li>
            <li>Nothing is sent to a partner unless you request an introduction and our team approves it.</li>
            <li>You can export or delete everything from Settings at any time.</li>
          </ul>
          <p className="lab-gap-s">
            Full details in our{' '}
            <Link to="/privacy" className="link">
              privacy policy
            </Link>
            .
          </p>
        </>
      }
    >
      <SignedInNote />
      <form onSubmit={submit} className="form lab-form" noValidate>
        <TextField label="Your name" value={name} onChange={setName} autoComplete="name" maxLength={120} />
        <TextField label="Work email" type="email" value={email} onChange={setEmail} required autoComplete="email" inputMode="email" />
        <TextField label="Password" type="password" value={password} onChange={setPassword} required autoComplete="new-password" help={`At least ${MIN_PASSWORD} characters.`} />
        <div className="lab-consents">
          <label className="lab-check">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} required />
            <span>
              I’ve read how The Lab uses my data and the{' '}
              <Link to="/privacy" className="link">
                privacy policy
              </Link>
              . <span className="dimmer">(required)</span>
            </span>
          </label>
          <label className="lab-check">
            <input type="checkbox" checked={sharing} onChange={e => setSharing(e.target.checked)} />
            <span>When I request an introduction and it’s approved, Not by Accident may share my brand profile with that partner. You can also decide per request.</span>
          </label>
          <label className="lab-check">
            <input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} />
            <span>Send me occasional notes from the studio. No more than once a month.</span>
          </label>
        </div>
        <div className="actions">
          <button type="submit" className="btn" disabled={a.busy}>
            {a.busy ? 'Creating your account…' : 'Create account'}
          </button>
          <Link to="/lab/login" className="link-q">
            I already have an account
          </Link>
        </div>
        <Notice tone="error">{a.error}</Notice>
      </form>
    </AuthFrame>
  )
}

export function LabLogin() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resent, setResent] = useState(false)
  const a = useAction()
  async function submit(e: FormEvent) {
    e.preventDefault()
    setUnconfirmed(false)
    const ok = await a.run(() => labSignIn(email.trim(), password))
    if (ok) navigate(safeNext(params.get('next')))
  }
  useEffect(() => {
    if (/Confirm your email/.test(a.error)) setUnconfirmed(true)
  }, [a.error])
  return (
    <AuthFrame title="Sign in to The Lab" path="/lab/login" lede={params.get('ended') ? 'Your session ended. Sign in again to carry on where you left off.' : undefined}>
      <SignedInNote />
      <form onSubmit={submit} className="form lab-form">
        <TextField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" inputMode="email" />
        <TextField label="Password" type="password" value={password} onChange={setPassword} required autoComplete="current-password" />
        <div className="actions">
          <button type="submit" className="btn" disabled={a.busy}>
            {a.busy ? 'Signing in…' : 'Sign in'}
          </button>
          <Link to="/lab/forgot-password" className="link-q">
            Forgot the password?
          </Link>
        </div>
        <Notice tone="error">{a.error}</Notice>
        {unconfirmed ? (
          <button type="button" className="link-q t-small" disabled={resent} onClick={() => void labResendConfirmation(email.trim()).then(() => setResent(true))}>
            {resent ? 'Confirmation link sent again' : 'Send the confirmation link again'}
          </button>
        ) : null}
        <p className="t-small dim lab-gap">
          New here?{' '}
          <Link to="/lab/sign-up" className="link">
            Create an account
          </Link>
        </p>
      </form>
    </AuthFrame>
  )
}

export function LabForgot() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const a = useAction()
  return (
    <AuthFrame title="Reset your password" path="/lab/forgot-password" noindex>
      {sent ? (
        <Notice tone="ok">If there’s an account for {email}, a reset link is on its way. It works once and expires after an hour.</Notice>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault()
            void a.run(async () => (await labRequestReset(email.trim()), setSent(true)))
          }}
          className="form lab-form"
        >
          <TextField label="Email" type="email" value={email} onChange={setEmail} required autoComplete="email" inputMode="email" />
          <div className="actions">
            <button type="submit" className="btn" disabled={a.busy}>
              {a.busy ? 'Sending…' : 'Send the reset link'}
            </button>
            <Link to="/lab/login" className="link-q">
              Back to sign in
            </Link>
          </div>
          <Notice tone="error">{a.error}</Notice>
        </form>
      )}
    </AuthFrame>
  )
}

export function LabReset() {
  const navigate = useNavigate()
  const [ready, setReady] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const a = useAction()
  useEffect(() => {
    let off = () => {}
    void getClient().then(c => {
      if (!c) return setReady(false)
      const { data } = c.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY' || session) setReady(true)
      })
      off = () => data.subscription.unsubscribe()
      void c.auth.getSession().then(({ data: d }) => setReady(r => r || Boolean(d.session)))
      // give the link's token a moment to be exchanged before saying it's missing
      window.setTimeout(() => setReady(r => r ?? false), 2500)
    })
    return () => off()
  }, [])
  return (
    <AuthFrame title="Choose a new password" path="/lab/reset-password" noindex>
      {ready === false ? (
        <>
          <p className="t-lead">This page works from the link in your reset email. The link may have expired.</p>
          <p className="lab-gap">
            <Link to="/lab/forgot-password" className="btn">
              Request a new link
            </Link>
          </p>
        </>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault()
            if (password.length < MIN_PASSWORD) return a.setError(`Use at least ${MIN_PASSWORD} characters.`)
            void a.run(async () => {
              await labUpdatePassword(password)
              navigate('/lab/dashboard')
            })
          }}
          className="form lab-form"
        >
          <TextField label="New password" type="password" value={password} onChange={setPassword} required autoComplete="new-password" help={`At least ${MIN_PASSWORD} characters.`} />
          <div className="actions">
            <button type="submit" className="btn" disabled={a.busy || !ready}>
              {a.busy ? 'Saving…' : 'Save and continue'}
            </button>
          </div>
          <Notice tone="error">{a.error}</Notice>
        </form>
      )}
    </AuthFrame>
  )
}
