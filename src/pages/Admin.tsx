import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '@/components/Seo'
import {
  useAuth,
  login,
  logout,
  signup,
  verifyEmail,
  useAccounts,
  approveAccount,
  revokeAccount,
  deleteAccount,
  useSite,
  saveNote,
  deleteNote,
  resetSite,
  updateCompany,
  updateHero,
  updateHomepage,
  updateNav,
  updateSocials,
  updateClients,
  updatePartners,
  updateSeo,
  updateTrainings,
  updateTestimonials,
  slugify,
  type Note,
  type Testimonial,
  type TrainingRow,
  type NavLink,
  type Social,
  type Wordmark,
  type WordmarkStyle,
  useLeads,
  deleteLead,
  exportLeadsCsv,
} from '@/content'

/* ── Small shared field primitives ──────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="t-caption block"
      style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', marginBottom: '6px' }}
    >
      {children}
    </label>
  )
}

function Saved() {
  return <span className="t-ui" style={{ color: '#7F8B3E' }}>Saved ✓</span>
}

/* ── Sign up / sign in gate ─────────────────────────────────────────────── */
function LoginGate() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin')
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [code, setCode] = useState('')
  const [sentCode, setSentCode] = useState('') // simulated inbox — no backend to deliver mail
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    if (mode === 'signup') {
      const res = signup(email, pw)
      if (!res.ok) { setError(res.error ?? 'Could not create account.'); return }
      // Move to the verification step. Real delivery needs a backend; for the
      // prototype we surface the code on screen in place of an inbox.
      setSentCode(res.code ?? '')
      setCode('')
      setMode('verify')
    } else if (mode === 'verify') {
      const res = verifyEmail(email, code)
      if (!res.ok) { setError(res.error ?? 'Could not verify.'); return }
      if (res.pending) {
        setMode('signin')
        setNotice('Email verified — an administrator needs to approve your account before you can sign in.')
        setPw('')
        setCode('')
      } else {
        // First account is the owner and is approved automatically.
        login(email, pw)
      }
    } else {
      const res = login(email, pw)
      if (!res.ok) setError(res.error ?? 'Could not sign in.')
    }
  }

  const switchTo = (m: 'signin' | 'signup') => { setMode(m); setError(''); setNotice(''); setPw(''); setCode('') }

  if (mode === 'verify') {
    return (
      <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA', minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
        <Seo title="Admin" description="Internal content board for Not by Accident." path="/admin" noindex />
        <div className="page-grid" style={{ width: '100%' }}>
          <form onSubmit={submit} style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '10px' }}>Verify your email</p>
            <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 1.25rem' }}>
              Check your inbox.
            </h1>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              We sent a six-digit code to <strong style={{ color: '#221E1B' }}>{email}</strong>. Enter it below to confirm this address.
            </p>
            {sentCode && (
              <p className="t-caption" style={{ background: 'rgba(233,197,88,.25)', border: '1px solid rgba(34,30,27,.15)', borderRadius: '4px', padding: '10px 12px', color: '#221E1B', textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Prototype — no email is actually sent. Your code is <strong style={{ fontFamily: 'ui-monospace, monospace', letterSpacing: '0.1em' }}>{sentCode}</strong>. Connect Supabase to deliver real verification emails.
              </p>
            )}
            <Label>Verification code</Label>
            <input
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              className="input-field"
              autoFocus
              inputMode="numeric"
              placeholder="123456"
              style={{ letterSpacing: '0.2em', fontFamily: 'ui-monospace, monospace' }}
            />
            {error && <p className="t-caption" style={{ color: '#6E2237', marginTop: '8px' }}>{error}</p>}
            <button type="submit" className="btn-primary" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}>
              Verify email
            </button>
            <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '1.25rem', textTransform: 'none', letterSpacing: '0.02em' }}>
              <button type="button" onClick={() => switchTo('signin')} className="link-grow" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E2237', padding: 0 }}>
                ← Back to sign in
              </button>
            </p>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA', minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
      <Seo title="Admin" description="Internal content board for Not by Accident." path="/admin" noindex />
      <div className="page-grid" style={{ width: '100%' }}>
        <form onSubmit={submit} style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <p className="t-caption" style={{ color: '#6E2237', marginBottom: '10px' }}>Content board</p>
          <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, margin: '0 0 1.5rem' }}>
            {mode === 'signup' ? 'Create your account.' : 'Sign in to edit.'}
          </h1>

          <div style={{ marginBottom: '16px' }}>
            <Label>Email</Label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              className="input-field"
              autoFocus
              autoComplete="email"
              placeholder="you@company.com"
            />
          </div>
          <Label>Password</Label>
          <input
            type="password"
            value={pw}
            onChange={e => { setPw(e.target.value); setError('') }}
            className="input-field"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
          />
          {error && <p className="t-caption" style={{ color: '#6E2237', marginTop: '8px' }}>{error}</p>}
          {notice && <p className="t-caption" style={{ color: '#7F8B3E', marginTop: '8px' }}>{notice}</p>}
          <button type="submit" className="btn-primary" style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}>
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
          <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '1.25rem', textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.6 }}>
            {mode === 'signup'
              ? 'Already have an account? '
              : 'No account yet? '}
            <button
              type="button"
              onClick={() => switchTo(mode === 'signup' ? 'signin' : 'signup')}
              className="link-grow"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6E2237', padding: 0 }}
            >
              {mode === 'signup' ? 'Sign in' : 'Create one'}
            </button>
          </p>
          <p className="t-caption" style={{ color: 'rgba(34,30,27,.35)', marginTop: '1rem', textTransform: 'none', letterSpacing: '0.02em', lineHeight: 1.6 }}>
            Accounts are stored in this browser for the prototype. Connect Supabase for real, secure, shared sign-in.
          </p>
          <Link to="/" className="t-caption link-grow" style={{ color: 'rgba(34,30,27,.5)', display: 'inline-block', marginTop: '1rem' }}>← Back to site</Link>
        </form>
      </div>
    </main>
  )
}

const TABS = ['Company', 'Homepage', 'Menu & footer', 'Clients', 'Testimonials', 'Journal', 'Trainings', 'SEO', 'Leads', 'Accounts'] as const
type Tab = (typeof TABS)[number]

/* ── Main board ─────────────────────────────────────────────────────────── */
export default function Admin() {
  const authed = useAuth()
  const [tab, setTab] = useState<Tab>('Company')

  if (!authed) return <LoginGate />

  return (
    <main id="main" style={{ paddingTop: '56px', backgroundColor: '#F0EADA', minHeight: '100svh' }}>
      <Seo title="Admin — Content" description="Internal content board for Not by Accident." path="/admin" noindex />

      {/* Header */}
      <div className="page-grid" style={{ paddingTop: 'clamp(32px, 4vw, 56px)', paddingBottom: '1.25rem', borderBottom: '2px solid #221E1B' }}>
        <div className="flex items-end justify-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="t-caption" style={{ color: '#6E2237', marginBottom: '8px' }}>Content board</p>
            <h1 style={{ fontFamily: 'Lora, Georgia, serif', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 0.95, margin: 0 }}>
              Edit the website.
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {authed && <span className="t-caption" style={{ color: 'rgba(34,30,27,.45)', textTransform: 'none', letterSpacing: '0.02em' }}>{authed}</span>}
            <button
              onClick={() => { if (confirm('Reset ALL content back to the built-in defaults?')) resetSite() }}
              className="t-caption link-grow"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.5)', textTransform: 'none', letterSpacing: '0.02em' }}
            >
              Reset all
            </button>
            <Link to="/" className="t-ui link-grow" style={{ color: '#221E1B' }}>View site →</Link>
            <button
              onClick={logout}
              className="t-caption"
              style={{ background: 'none', border: '1px solid rgba(34,30,27,.25)', borderRadius: '2px', padding: '5px 12px', cursor: 'pointer', color: '#221E1B', textTransform: 'none', letterSpacing: '0.02em' }}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2" style={{ marginTop: '1.5rem' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="t-ui"
              style={{
                background: tab === t ? '#221E1B' : 'transparent',
                color: tab === t ? '#F0EADA' : '#221E1B',
                border: '1px solid ' + (tab === t ? '#221E1B' : 'rgba(34,30,27,.2)'),
                borderRadius: '100px',
                padding: '7px 16px',
                cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="page-grid" style={{ paddingTop: 'clamp(28px, 3vw, 48px)', paddingBottom: 'clamp(64px, 8vw, 128px)' }}>
        {tab === 'Company' && <CompanyEditor />}
        {tab === 'Homepage' && <HomepageEditor />}
        {tab === 'Menu & footer' && <MenuEditor />}
        {tab === 'Clients' && <ClientsEditor />}
        {tab === 'Testimonials' && <TestimonialsEditor />}
        {tab === 'Journal' && <JournalEditor />}
        {tab === 'Trainings' && <TrainingsEditor />}
        {tab === 'SEO' && <SeoEditor />}
        {tab === 'Leads' && <LeadsEditor />}
        {tab === 'Accounts' && <AccountsEditor />}
      </div>
    </main>
  )
}

/* ── Company / contact ──────────────────────────────────────────────────── */
function CompanyEditor() {
  const { company } = useSite()
  const [saved, setSaved] = useState(false)

  function field(key: keyof typeof company, value: string) {
    setSaved(false)
    updateCompany({ [key]: value } as Partial<typeof company>)
  }
  function addr(key: keyof typeof company.address, value: string) {
    setSaved(false)
    updateCompany({ address: { ...company.address, [key]: value } })
  }

  const text = (key: keyof typeof company, label: string) => (
    <div style={{ marginBottom: '16px' }}>
      <Label>{label}</Label>
      <input className="input-field" value={String(company[key] ?? '')} onChange={e => field(key, e.target.value)} />
    </div>
  )

  return (
    <form onSubmit={e => { e.preventDefault(); setSaved(true) }} style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>Company & contact — shown in the footer, metadata and calls to action across the site.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        {text('name', 'Name')}
        {text('legalName', 'Legal name')}
        {text('tagline', 'Tagline')}
        {text('phone', 'Phone')}
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Proposition</Label>
        <input className="input-field" value={company.proposition} onChange={e => field('proposition', e.target.value)} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
        {text('email', 'General email')}
        {text('newBusinessEmail', 'New business email')}
        {text('pressEmail', 'Press email')}
      </div>
      {text('hours', 'Hours')}
      {text('registration', 'Registration')}
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', margin: '1rem 0 0.75rem' }}>Address</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
        <div style={{ marginBottom: '16px' }}><Label>Line 1</Label><input className="input-field" value={company.address.line1} onChange={e => addr('line1', e.target.value)} /></div>
        <div style={{ marginBottom: '16px' }}><Label>Line 2</Label><input className="input-field" value={company.address.line2} onChange={e => addr('line2', e.target.value)} /></div>
        <div style={{ marginBottom: '16px' }}><Label>City</Label><input className="input-field" value={company.address.city} onChange={e => addr('city', e.target.value)} /></div>
        <div style={{ marginBottom: '16px' }}><Label>Postcode</Label><input className="input-field" value={company.address.postcode} onChange={e => addr('postcode', e.target.value)} /></div>
        <div style={{ marginBottom: '16px' }}><Label>Country</Label><input className="input-field" value={company.address.country} onChange={e => addr('country', e.target.value)} /></div>
      </div>
      <div className="flex items-center gap-4" style={{ marginTop: '0.5rem' }}>
        <button type="submit" className="btn-primary">Done</button>
        {saved && <Saved />}
        <span className="t-caption" style={{ color: 'rgba(34,30,27,.4)', textTransform: 'none' }}>Changes save as you type.</span>
      </div>
    </form>
  )
}

/* ── Small reusable image field: URL, upload-from-computer, thumbnail, clear ── */
function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const [error, setError] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('')
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { setError('That file is not an image.'); return }
    // ~2MB guard — images are stored inline (base64) in the browser for this prototype.
    if (file.size > 2 * 1024 * 1024) { setError('Please choose an image under 2MB.'); return }
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.onerror = () => setError('Could not read that file.')
    reader.readAsDataURL(file)
    e.target.value = '' // allow re-selecting the same file
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <Label>{label}{hint && <span style={{ opacity: 0.6 }}> — {hint}</span>}</Label>
      <div className="flex items-start gap-4">
        <div style={{ flex: 1 }}>
          <input className="input-field" value={value.startsWith('data:') ? '' : value} onChange={e => onChange(e.target.value)} placeholder="Paste an image URL, or upload below" />
          <div className="flex items-center gap-3" style={{ marginTop: '8px' }}>
            <label className="t-caption" style={{ display: 'inline-block', border: '1px solid rgba(34,30,27,.25)', borderRadius: '2px', padding: '5px 12px', cursor: 'pointer', color: '#221E1B', textTransform: 'none', letterSpacing: '0.02em' }}>
              Upload from computer
              <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
            </label>
            {value.startsWith('data:') && <span className="t-caption" style={{ color: '#7F8B3E', textTransform: 'none' }}>Uploaded ✓</span>}
          </div>
          {error && <p className="t-caption" style={{ color: '#6E2237', marginTop: '6px', textTransform: 'none' }}>{error}</p>}
        </div>
        {value
          ? <img src={value} alt="" style={{ width: '56px', height: '70px', objectFit: 'cover', borderRadius: '2px', flex: 'none', background: 'rgba(34,30,27,.08)' }} />
          : <span className="t-caption flex items-center justify-center" style={{ width: '56px', height: '70px', borderRadius: '2px', flex: 'none', background: 'rgba(34,30,27,.06)', color: 'rgba(34,30,27,.3)', textAlign: 'center', lineHeight: 1.2 }}>none</span>}
      </div>
      {value && (
        <button type="button" onClick={() => onChange('')} className="t-caption link-grow" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.5)', padding: 0, marginTop: '6px', textTransform: 'none', letterSpacing: '0.02em' }}>
          Remove image
        </button>
      )}
    </div>
  )
}

/* ── Homepage hero + sections ───────────────────────────────────────────── */
function HomepageEditor() {
  const { hero, homepage } = useSite()
  const [saved, setSaved] = useState(false)
  const change = () => setSaved(false)

  return (
    <form onSubmit={e => { e.preventDefault(); setSaved(true) }} style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>Homepage hero — the rotating headline and the lines beneath it.</p>
      <div style={{ marginBottom: '16px' }}>
        <Label>Rotating words <span style={{ opacity: 0.6 }}>— comma separated. “We make companies ___.”</span></Label>
        <input
          className="input-field"
          value={hero.words.join(', ')}
          onChange={e => { change(); updateHero({ words: e.target.value.split(',').map(w => w.trim()).filter(Boolean) }) }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Subheading</Label>
        <textarea className="textarea-field" value={hero.subhead} onChange={e => { change(); updateHero({ subhead: e.target.value }) }} rows={2} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Definition line</Label>
        <textarea className="textarea-field" value={hero.definition} onChange={e => { change(); updateHero({ definition: e.target.value }) }} rows={3} />
      </div>
      <ImageField label="Hero image" value={hero.image} onChange={v => { change(); updateHero({ image: v }) }} />

      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', margin: '2rem 0 1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(34,30,27,.14)' }}>Section headings — the rest of the homepage.</p>
      <div style={{ marginBottom: '16px' }}>
        <Label>Selected work — eyebrow</Label>
        <input className="input-field" value={homepage.featuredEyebrow} onChange={e => { change(); updateHomepage({ featuredEyebrow: e.target.value }) }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Selected work — heading</Label>
        <textarea className="textarea-field" value={homepage.featuredHeading} onChange={e => { change(); updateHomepage({ featuredHeading: e.target.value }) }} rows={2} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Capabilities — heading</Label>
        <textarea className="textarea-field" value={homepage.capabilitiesHeading} onChange={e => { change(); updateHomepage({ capabilitiesHeading: e.target.value }) }} rows={2} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Journal — heading</Label>
        <input className="input-field" value={homepage.journalHeading} onChange={e => { change(); updateHomepage({ journalHeading: e.target.value }) }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Closing call-to-action — heading</Label>
        <textarea className="textarea-field" value={homepage.ctaHeading} onChange={e => { change(); updateHomepage({ ctaHeading: e.target.value }) }} rows={2} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Closing call-to-action — body</Label>
        <textarea className="textarea-field" value={homepage.ctaBody} onChange={e => { change(); updateHomepage({ ctaBody: e.target.value }) }} rows={3} />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
    </form>
  )
}

/* ── SEO defaults ───────────────────────────────────────────────────────── */
function SeoEditor() {
  const { seo } = useSite()
  const [saved, setSaved] = useState(false)
  const change = () => setSaved(false)

  return (
    <form onSubmit={e => { e.preventDefault(); setSaved(true) }} style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>
        Search & social defaults — used for the homepage and any page without its own description. Company name, address and links live under the Company tab.
      </p>
      <div style={{ marginBottom: '16px' }}>
        <Label>Meta description <span style={{ opacity: 0.6 }}>— shown in search results and link previews</span></Label>
        <textarea className="textarea-field" value={seo.description} onChange={e => { change(); updateSeo({ description: e.target.value }) }} rows={3} />
      </div>
      <ImageField label="Social share image" hint="Open Graph / Twitter card" value={seo.ogImage} onChange={v => { change(); updateSeo({ ogImage: v }) }} />
      <div className="flex items-center gap-4">
        <button type="submit" className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
    </form>
  )
}

/* ── Trainings page ─────────────────────────────────────────────────────── */
function TrainingsEditor() {
  const { trainings } = useSite()
  const [saved, setSaved] = useState(false)
  const change = () => setSaved(false)

  function row(i: number, patch: Partial<TrainingRow>) {
    change()
    updateTrainings({ format: trainings.format.map((r, j) => (j === i ? { ...r, ...patch } : r)) })
  }
  function removeRow(i: number) {
    change()
    updateTrainings({ format: trainings.format.filter((_, j) => j !== i) })
  }
  function addRow() {
    change()
    updateTrainings({ format: [...trainings.format, { label: '', value: '' }] })
  }

  return (
    <form onSubmit={e => { e.preventDefault(); setSaved(true) }} style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>Trainings page — currently a “coming soon” announcement with a waiting list.</p>
      <div style={{ marginBottom: '16px' }}>
        <Label>Eyebrow <span style={{ opacity: 0.6 }}>— the small status line, e.g. “Opening 2027”</span></Label>
        <input className="input-field" value={trainings.eyebrow} onChange={e => { change(); updateTrainings({ eyebrow: e.target.value }) }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Heading</Label>
        <input className="input-field" value={trainings.heading} onChange={e => { change(); updateTrainings({ heading: e.target.value }) }} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Subheading</Label>
        <textarea className="textarea-field" value={trainings.subhead} onChange={e => { change(); updateTrainings({ subhead: e.target.value }) }} rows={2} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Intro paragraph</Label>
        <textarea className="textarea-field" value={trainings.body1} onChange={e => { change(); updateTrainings({ body1: e.target.value }) }} rows={3} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Second paragraph</Label>
        <textarea className="textarea-field" value={trainings.body2} onChange={e => { change(); updateTrainings({ body2: e.target.value }) }} rows={3} />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <Label>Waiting-list note</Label>
        <textarea className="textarea-field" value={trainings.waitingListNote} onChange={e => { change(); updateTrainings({ waitingListNote: e.target.value }) }} rows={2} />
      </div>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', margin: '1.25rem 0 0.75rem' }}>Format details</p>
      {trainings.format.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_1.5fr_auto] gap-3 items-end" style={{ marginBottom: '12px' }}>
          <div><Label>Label</Label><input className="input-field" value={r.label} onChange={e => row(i, { label: e.target.value })} /></div>
          <div><Label>Value</Label><input className="input-field" value={r.value} onChange={e => row(i, { value: e.target.value })} /></div>
          <button type="button" onClick={() => removeRow(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', fontSize: '13px', paddingBottom: '10px' }}>Remove</button>
        </div>
      ))}
      <div className="flex items-center gap-4" style={{ marginTop: '1.25rem' }}>
        <button type="button" onClick={addRow} className="btn-ghost">+ Add detail</button>
        <button type="submit" className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
    </form>
  )
}

/* ── Menu & footer (navigation + social links) ──────────────────────────── */
function MenuEditor() {
  const { nav, socials } = useSite()
  const [saved, setSaved] = useState(false)

  function editNav(i: number, patch: Partial<NavLink>) { setSaved(false); updateNav(nav.map((l, j) => (j === i ? { ...l, ...patch } : l))) }
  function removeNav(i: number) { setSaved(false); updateNav(nav.filter((_, j) => j !== i)) }
  function addNav() { setSaved(false); updateNav([...nav, { label: '', to: '/' }]) }

  function editSocial(i: number, patch: Partial<Social>) { setSaved(false); updateSocials(socials.map((s, j) => (j === i ? { ...s, ...patch } : s))) }
  function removeSocial(i: number) { setSaved(false); updateSocials(socials.filter((_, j) => j !== i)) }
  function addSocial() { setSaved(false); updateSocials([...socials, { label: '', handle: '', url: '' }]) }

  return (
    <div style={{ maxWidth: '720px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>Main menu — the links in the top navigation bar.</p>
      {nav.map((l, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end" style={{ marginBottom: '12px' }}>
          <div><Label>Label</Label><input className="input-field" value={l.label} onChange={e => editNav(i, { label: e.target.value })} placeholder="Work" /></div>
          <div><Label>Path</Label><input className="input-field" value={l.to} onChange={e => editNav(i, { to: e.target.value })} placeholder="/work" /></div>
          <button type="button" onClick={() => removeNav(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', fontSize: '13px', paddingBottom: '10px' }}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addNav} className="btn-ghost" style={{ marginTop: '4px' }}>+ Add menu link</button>

      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', margin: '2.5rem 0 1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(34,30,27,.14)' }}>Footer social links.</p>
      {socials.map((s, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1.4fr_auto] gap-3 items-end" style={{ marginBottom: '12px' }}>
          <div><Label>Label</Label><input className="input-field" value={s.label} onChange={e => editSocial(i, { label: e.target.value })} placeholder="LinkedIn" /></div>
          <div><Label>Handle</Label><input className="input-field" value={s.handle} onChange={e => editSocial(i, { handle: e.target.value })} placeholder="@notbyaccident" /></div>
          <div><Label>URL</Label><input className="input-field" value={s.url} onChange={e => editSocial(i, { url: e.target.value })} placeholder="https://…" /></div>
          <button type="button" onClick={() => removeSocial(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', fontSize: '13px', paddingBottom: '10px' }}>Remove</button>
        </div>
      ))}
      <div className="flex items-center gap-4" style={{ marginTop: '4px' }}>
        <button type="button" onClick={addSocial} className="btn-ghost">+ Add social link</button>
        <button type="button" onClick={() => setSaved(true)} className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '1rem', textTransform: 'none', letterSpacing: '0.02em' }}>Footer addresses, emails, phone and hours are edited under the Company tab.</p>
    </div>
  )
}

/* ── Clients & partners (homepage marquee wordmarks) ────────────────────── */
const wordmarkStyles: WordmarkStyle[] = ['serif', 'sans-tight', 'sans-wide', 'mono', 'italic', 'black']

function WordmarkList({ title, items, update }: { title: string; items: Wordmark[]; update: (next: Wordmark[]) => void }) {
  function edit(i: number, patch: Partial<Wordmark>) { update(items.map((w, j) => (j === i ? { ...w, ...patch } : w))) }
  function remove(i: number) { update(items.filter((_, j) => j !== i)) }
  function add() { update([...items, { name: '', style: 'serif' }]) }
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p className="t-caption" style={{ color: '#6E2237', marginBottom: '0.75rem' }}>{title} ({items.length})</p>
      {items.map((w, i) => (
        <div key={i} className="grid grid-cols-[1.6fr_1fr_auto] gap-3 items-end" style={{ marginBottom: '10px' }}>
          <div><Label>Name</Label><input className="input-field" value={w.name} onChange={e => edit(i, { name: e.target.value })} /></div>
          <div>
            <Label>Style</Label>
            <select className="input-field" value={w.style} onChange={e => edit(i, { style: e.target.value as WordmarkStyle })} style={{ cursor: 'pointer' }}>
              {wordmarkStyles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', fontSize: '13px', paddingBottom: '10px' }}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={add} className="btn-ghost" style={{ marginTop: '4px' }}>+ Add {title.toLowerCase()}</button>
    </div>
  )
}

function ClientsEditor() {
  const { clients, partners } = useSite()
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.5rem' }}>The two scrolling wordmark rows on the homepage — clients on top, partners beneath. “Style” sets the type treatment.</p>
      <WordmarkList title="Selected clients" items={clients} update={next => { setSaved(false); updateClients(next) }} />
      <WordmarkList title="Partners & collaborators" items={partners} update={next => { setSaved(false); updatePartners(next) }} />
      <div className="flex items-center gap-4">
        <button type="button" onClick={() => setSaved(true)} className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
    </div>
  )
}

/* ── Leads (form + newsletter submissions) ──────────────────────────────── */
const sourceLabel: Record<string, string> = {
  'newsletter': 'Newsletter',
  'newsletter-popup': 'Popup',
  'contact': 'Contact form',
  'footer': 'Footer',
}

function LeadsEditor() {
  const leads = useLeads()

  function download() {
    const blob = new Blob([exportLeadsCsv()], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nba-leads-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div style={{ maxWidth: '820px' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', margin: 0 }}>
          {leads.length} submission{leads.length === 1 ? '' : 's'} — every newsletter signup and enquiry captured on this site.
        </p>
        {leads.length > 0 && (
          <button type="button" onClick={download} className="btn-ghost">Export CSV</button>
        )}
      </div>

      {leads.length === 0 ? (
        <p className="t-body" style={{ color: 'rgba(34,30,27,.5)' }}>
          No submissions yet. Newsletter signups (footer, popup, Reports), the contact form and the
          trainings waiting list will all appear here.
        </p>
      ) : (
        <div className="flex flex-col" style={{ gap: '2px' }}>
          {leads.map(l => (
            <div key={l.id} style={{ padding: '14px 0', borderTop: '1px solid rgba(34,30,27,.12)' }}>
              <div className="flex items-baseline justify-between gap-4" style={{ flexWrap: 'wrap' }}>
                <a href={`mailto:${l.email}`} className="link-beetroot" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '18px' }}>{l.email}</a>
                <span className="flex items-center gap-3">
                  <span className="t-caption" style={{ color: '#6E2237' }}>{sourceLabel[l.source] ?? l.source}</span>
                  <span className="t-caption" style={{ color: 'rgba(34,30,27,.4)', textTransform: 'none', letterSpacing: '0.02em' }}>
                    {new Date(l.createdAt).toLocaleString()}
                  </span>
                  <button type="button" onClick={() => deleteLead(l.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.35)', fontSize: '13px' }}>Delete</button>
                </span>
              </div>
              {l.name && <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.7)', fontSize: '14px', marginTop: '4px' }}>{l.name}</p>}
              {l.message && <p className="t-body m-0" style={{ color: 'rgba(34,30,27,.6)', fontSize: '14px', marginTop: '4px', maxWidth: '64ch' }}>{l.message}</p>}
            </div>
          ))}
        </div>
      )}

      <p className="t-caption" style={{ color: 'rgba(34,30,27,.4)', marginTop: '2rem', textTransform: 'none', letterSpacing: '0.02em', paddingTop: '1rem', borderTop: '1px solid rgba(34,30,27,.12)' }}>
        These submissions are stored in this browser only. Connect Supabase to collect every email
        centrally and get a notification for each new one.
      </p>
    </div>
  )
}

/* ── Testimonials ───────────────────────────────────────────────────────── */
function TestimonialsEditor() {
  const { testimonials } = useSite()
  const [saved, setSaved] = useState(false)

  function edit(i: number, patch: Partial<Testimonial>) {
    setSaved(false)
    updateTestimonials(testimonials.map((t, j) => (j === i ? { ...t, ...patch } : t)))
  }
  function remove(i: number) {
    setSaved(false)
    updateTestimonials(testimonials.filter((_, j) => j !== i))
  }
  function add() {
    setSaved(false)
    updateTestimonials([...testimonials, { quote: '', name: '', role: '', company: '' }])
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>Testimonials — shown on the homepage.</p>
      {testimonials.map((t, i) => (
        <div key={i} style={{ padding: '20px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
          <div style={{ marginBottom: '12px' }}>
            <Label>Quote</Label>
            <textarea className="textarea-field" value={t.quote} onChange={e => edit(i, { quote: e.target.value })} rows={3} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4">
            <div style={{ marginBottom: '12px' }}><Label>Name</Label><input className="input-field" value={t.name} onChange={e => edit(i, { name: e.target.value })} /></div>
            <div style={{ marginBottom: '12px' }}><Label>Role</Label><input className="input-field" value={t.role} onChange={e => edit(i, { role: e.target.value })} /></div>
            <div style={{ marginBottom: '12px' }}><Label>Company</Label><input className="input-field" value={t.company} onChange={e => edit(i, { company: e.target.value })} /></div>
          </div>
          <button onClick={() => remove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.4)', fontSize: '13px' }}>Remove</button>
        </div>
      ))}
      <div className="flex items-center gap-4" style={{ marginTop: '1.5rem' }}>
        <button onClick={add} className="btn-ghost">+ Add testimonial</button>
        <button onClick={() => setSaved(true)} className="btn-primary">Done</button>
        {saved && <Saved />}
      </div>
    </div>
  )
}

/* ── Accounts / approvals ───────────────────────────────────────────────── */
function AccountsEditor() {
  const accounts = useAccounts()
  const authed = useAuth()
  const pending = accounts.filter(a => a.verified && !a.approved)
  const approved = accounts.filter(a => a.approved)
  const unverified = accounts.filter(a => !a.verified)

  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>
        Accounts — new sign-ups verify their email, then stay pending until you approve them here.
      </p>

      {unverified.length > 0 && (
        <>
          <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '0.75rem' }}>Awaiting email verification ({unverified.length})</p>
          <ul className="list-none m-0 p-0" style={{ marginBottom: '2rem' }}>
            {unverified.map(a => (
              <li key={a.email} className="flex items-center justify-between gap-4" style={{ padding: '14px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
                <span className="t-ui" style={{ color: 'rgba(34,30,27,.55)' }}>{a.email}</span>
                <button onClick={() => deleteAccount(a.email)} className="t-caption" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.45)' }}>Remove</button>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="t-caption" style={{ color: '#6E2237', marginBottom: '0.75rem' }}>Awaiting approval ({pending.length})</p>
      {pending.length === 0 ? (
        <p className="t-body" style={{ color: 'rgba(34,30,27,.5)', margin: '0 0 2rem' }}>No requests waiting.</p>
      ) : (
        <ul className="list-none m-0 p-0" style={{ marginBottom: '2rem' }}>
          {pending.map(a => (
            <li key={a.email} className="flex items-center justify-between gap-4" style={{ padding: '14px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
              <span className="t-ui" style={{ color: '#221E1B' }}>{a.email}</span>
              <span className="flex items-center gap-3">
                <button onClick={() => approveAccount(a.email)} className="btn-primary" style={{ padding: '6px 16px' }}>Approve</button>
                <button onClick={() => deleteAccount(a.email)} className="t-caption" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.45)' }}>Decline</button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '0.75rem' }}>Approved ({approved.length})</p>
      <ul className="list-none m-0 p-0">
        {approved.map(a => (
          <li key={a.email} className="flex items-center justify-between gap-4" style={{ padding: '14px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
            <span className="t-ui" style={{ color: '#221E1B' }}>
              {a.email}
              {a.email === authed && <span className="t-caption" style={{ color: '#7F8B3E', marginLeft: '10px' }}>you</span>}
            </span>
            {a.email !== authed && (
              <span className="flex items-center gap-3">
                <button onClick={() => revokeAccount(a.email)} className="t-caption" style={{ background: 'none', border: '1px solid rgba(34,30,27,.25)', borderRadius: '2px', padding: '5px 12px', cursor: 'pointer', color: '#221E1B' }}>Revoke</button>
                <button onClick={() => deleteAccount(a.email)} className="t-caption" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.45)' }}>Delete</button>
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Journal posts ──────────────────────────────────────────────────────── */
type Draft = Omit<Note, 'id'> & { id?: number }
const emptyDraft: Draft = { title: '', subtitle: '', body: '', date: '', category: 'Essay', readTime: '5 min', img: '', slug: '' }
const categories = ['Essay', 'Notes', 'Field notes', 'Interview']

function JournalEditor() {
  const { notes } = useSite()
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [saved, setSaved] = useState(false)
  const editing = draft.id != null

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setSaved(false)
    setDraft(d => ({ ...d, [key]: value }))
  }
  function startNew() { setSaved(false); setDraft(emptyDraft) }
  function submit(e: React.FormEvent) {
    e.preventDefault()
    const slug = draft.slug.trim() || slugify(draft.title)
    const date = draft.date.trim() || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const next = saveNote({ ...draft, slug, date })
    setDraft({ ...next })
    setSaved(true)
  }
  function remove(n: Note) {
    if (!confirm(`Delete “${n.title}”?`)) return
    deleteNote(n.id)
    if (draft.id === n.id) startNew()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">
      {/* List */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
          <p className="t-caption m-0" style={{ color: 'rgba(34,30,27,.45)' }}>{notes.length} posts</p>
          <button onClick={startNew} className="t-caption" style={{ background: 'none', border: '1px solid rgba(34,30,27,.25)', borderRadius: '2px', padding: '5px 12px', cursor: 'pointer', color: '#221E1B', textTransform: 'none', letterSpacing: '0.02em' }}>+ New</button>
        </div>
        <ul className="list-none m-0 p-0">
          {notes.map(n => (
            <li key={n.id}>
              <div className="flex items-baseline justify-between gap-3" style={{ padding: '14px 0', borderTop: '1px solid rgba(34,30,27,.14)' }}>
                <button onClick={() => { setSaved(false); setDraft({ ...n }) }} className="text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flex: 1 }}>
                  <span className="block" style={{ fontFamily: 'Lora, Georgia, serif', fontSize: '16px', lineHeight: 1.15, color: draft.id === n.id ? '#6E2237' : '#221E1B' }}>{n.title || 'Untitled'}</span>
                  <span className="t-caption" style={{ color: 'rgba(34,30,27,.4)' }}>{n.category} · {n.date}</span>
                </button>
                <button onClick={() => remove(n)} aria-label={`Delete ${n.title}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(34,30,27,.35)', fontSize: '13px' }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <form onSubmit={submit} style={{ maxWidth: '640px' }}>
        <p className="t-caption" style={{ color: 'rgba(34,30,27,.45)', marginBottom: '1.25rem' }}>{editing ? 'Editing post' : 'New post'}</p>
        <div style={{ marginBottom: '16px' }}><Label>Title</Label><input className="input-field" value={draft.title} onChange={e => set('title', e.target.value)} required placeholder="The brief is never the brief" /></div>
        <div style={{ marginBottom: '16px' }}><Label>Standfirst / subtitle</Label><input className="input-field" value={draft.subtitle} onChange={e => set('subtitle', e.target.value)} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" style={{ marginBottom: '16px' }}>
          <div><Label>Category</Label><select className="input-field" value={draft.category} onChange={e => set('category', e.target.value)} style={{ cursor: 'pointer' }}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><Label>Read time</Label><input className="input-field" value={draft.readTime} onChange={e => set('readTime', e.target.value)} placeholder="5 min" /></div>
          <div><Label>Date</Label><input className="input-field" value={draft.date} onChange={e => set('date', e.target.value)} placeholder="auto — today" /></div>
        </div>
        <ImageField label="Image" hint="leave blank for a text-only post" value={draft.img} onChange={v => set('img', v)} />
        <div style={{ marginBottom: '16px' }}><Label>Slug <span style={{ opacity: 0.6 }}>— blank = from title</span></Label><input className="input-field" value={draft.slug} onChange={e => set('slug', e.target.value)} placeholder={draft.title ? slugify(draft.title) : 'the-post-url'} /></div>
        <div style={{ marginBottom: '16px' }}><Label>Body <span style={{ opacity: 0.6 }}>— blank line between paragraphs</span></Label><textarea className="textarea-field" value={draft.body} onChange={e => set('body', e.target.value)} rows={12} style={{ minHeight: '260px', fontFamily: 'DM Sans, system-ui, sans-serif', lineHeight: 1.6 }} placeholder="Write the essay…" /></div>
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary">{editing ? 'Save changes' : 'Publish post'}</button>
          {editing && <button type="button" onClick={startNew} className="btn-ghost">Start new</button>}
          {saved && <span className="t-ui" style={{ color: '#7F8B3E' }}>Saved ✓{draft.slug && <> · <Link to={`/notes/${draft.slug}`} className="link-grow" style={{ color: '#6E2237' }}>view</Link></>}</span>}
        </div>
      </form>
    </div>
  )
}
