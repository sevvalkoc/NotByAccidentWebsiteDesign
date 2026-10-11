import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Link from '@/components/Link'
import { CONSENT_VERSION, labSignOut, labUpdatePassword, q, reloadBoot, rpc, selectBrand, useBrandId, useLabSession } from '../api'
import { fmtDate } from '../labels'
import { Notice, TextField, useAction } from '../ui'
import { AppHead, useAppPage } from './LabApp'

export default function Settings() {
  const s = useLabSession()
  const navigate = useNavigate()
  const current = useBrandId()
  useAppPage('Settings', '/lab/settings')
  const uid = s.session?.user.id
  const [name, setName] = useState('')
  const [job, setJob] = useState('')
  const [pw, setPw] = useState('')
  const [confirmDelete, setConfirmDelete] = useState('')
  const [msg, setMsg] = useState('')
  const profile = useAction()
  const pass = useAction()
  const consent = useAction()
  const danger = useAction()

  useEffect(() => {
    setName(s.boot?.profile?.full_name ?? '')
    setJob(s.boot?.profile?.job_title ?? '')
  }, [s.boot?.profile])

  const c = s.boot?.consents ?? {}
  async function setConsent(kind: 'marketing' | 'partner_sharing', granted: boolean) {
    await consent.run(async () => {
      await q(cl => cl.from('lab_consents').insert({ user_id: uid, kind, granted, version: CONSENT_VERSION }))
      await reloadBoot()
    })
  }
  async function exportData() {
    await danger.run(async () => {
      const data = await rpc<unknown>('lab_export_my_data')
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `the-lab-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
    })
  }
  async function deleteBrand(id: string, bname: string) {
    if (!window.confirm(`Delete ${bname} and everything recorded for it: answers, results, matches, requests, opportunities and reports? This can’t be undone.`)) return
    await danger.run(async () => {
      await q(cl => cl.from('lab_brands').delete().eq('id', id))
      if (current === id) selectBrand(null)
      await reloadBoot()
      setMsg(`${bname} was deleted.`)
    })
  }
  async function deleteAccount() {
    await danger.run(async () => {
      await rpc('lab_delete_my_account')
      await labSignOut()
      navigate('/lab')
    })
  }

  return (
    <div className="lab-screen lab-narrow">
      <AppHead eyebrow="Settings" title="Account" />
      <Notice tone="ok">{msg}</Notice>

      <section className="lab-panel" aria-labelledby="set-profile">
        <h2 id="set-profile" className="label">
          Profile
        </h2>
        <form
          className="form lab-form lab-gap-s"
          onSubmit={e => {
            e.preventDefault()
            void profile.run(async () => {
              await q(cl => cl.from('lab_profiles').update({ full_name: name.trim() || null, job_title: job.trim() || null }).eq('user_id', uid))
              await reloadBoot()
              setMsg('Profile saved.')
            })
          }}
        >
          <p className="t-small dim">Signed in as {s.session?.user.email}</p>
          <div className="form__row">
            <TextField label="Name" value={name} onChange={setName} maxLength={120} autoComplete="name" />
            <TextField label="Role" value={job} onChange={setJob} maxLength={120} autoComplete="organization-title" />
          </div>
          <div className="actions">
            <button type="submit" className="btn btn--ghost" disabled={profile.busy}>
              Save profile
            </button>
          </div>
          <Notice tone="error">{profile.error}</Notice>
        </form>
      </section>

      <section className="lab-panel lab-gap" aria-labelledby="set-pw">
        <h2 id="set-pw" className="label">
          Password
        </h2>
        <form
          className="form lab-form lab-gap-s"
          onSubmit={e => {
            e.preventDefault()
            if (pw.length < 8) return pass.setError('Use at least 8 characters.')
            void pass.run(async () => {
              await labUpdatePassword(pw)
              setPw('')
              setMsg('Password changed.')
            })
          }}
        >
          <TextField label="New password" type="password" value={pw} onChange={setPw} autoComplete="new-password" help="At least 8 characters." />
          <div className="actions">
            <button type="submit" className="btn btn--ghost" disabled={pass.busy}>
              Change password
            </button>
          </div>
          <Notice tone="error">{pass.error}</Notice>
        </form>
      </section>

      <section className="lab-panel lab-gap" aria-labelledby="set-consent">
        <h2 id="set-consent" className="label">
          Permissions
        </h2>
        <div className="lab-consents lab-gap-s">
          <label className="lab-check">
            <input type="checkbox" checked={Boolean(c.partner_sharing?.granted)} disabled={consent.busy} onChange={e => void setConsent('partner_sharing', e.target.checked)} />
            <span>
              Share my brand profile with a partner when an introduction I requested is approved.
              {c.partner_sharing ? <span className="t-caption dimmer"> Last changed {fmtDate(c.partner_sharing.at)}.</span> : null}
            </span>
          </label>
          <label className="lab-check">
            <input type="checkbox" checked={Boolean(c.marketing?.granted)} disabled={consent.busy} onChange={e => void setConsent('marketing', e.target.checked)} />
            <span>
              Occasional notes from the studio.
              {c.marketing ? <span className="t-caption dimmer"> Last changed {fmtDate(c.marketing.at)}.</span> : null}
            </span>
          </label>
        </div>
        <p className="t-caption dimmer lab-gap-s">
          You accepted how The Lab uses your data on {fmtDate(c.privacy?.at)} (version {c.privacy?.version}). See the{' '}
          <Link to="/privacy" className="link">
            privacy policy
          </Link>
          .
        </p>
        <Notice tone="error">{consent.error}</Notice>
      </section>

      <section className="lab-panel lab-gap" aria-labelledby="set-brands">
        <h2 id="set-brands" className="label">
          Brands
        </h2>
        <ul role="list" className="lab-rows lab-gap-s">
          {(s.boot?.brands ?? []).map(b => (
            <li key={b.id} className="lab-rows__split">
              <span>
                {b.name} <span className="t-caption dimmer">· {b.role}</span>
                {b.id === current ? <span className="t-caption dimmer"> · open</span> : null}
              </span>
              {b.id !== current ? (
                <button type="button" className="link-q t-caption" onClick={() => selectBrand(b.id)}>
                  Open
                </button>
              ) : (
                <span />
              )}
              {b.role === 'owner' ? (
                <button type="button" className="link-q t-caption dimmer" onClick={() => void deleteBrand(b.id, b.name)}>
                  Delete<span className="sr-only"> {b.name}</span>
                </button>
              ) : (
                <span />
              )}
            </li>
          ))}
        </ul>
        <p className="lab-gap-s">
          <Link to="/lab/brand?new=1" className="link-q go t-small">
            Add another brand
          </Link>
        </p>
      </section>

      <section className="lab-panel lab-gap" aria-labelledby="set-data">
        <h2 id="set-data" className="label">
          Your data
        </h2>
        <p className="t-small dim lab-gap-s">Download everything The Lab holds about you and your brands as a JSON file.</p>
        <div className="actions lab-gap-s">
          <button type="button" className="btn btn--ghost" onClick={() => void exportData()} disabled={danger.busy}>
            Export my data
          </button>
        </div>
        <h3 className="label lab-gap">Delete the account</h3>
        <p className="t-small dim lab-gap-s">Deletes your login, your profile and every brand you alone own, with all its answers, results, requests and reports. Brands you share with someone else stay with them.</p>
        <div className="form lab-form lab-gap-s">
          <TextField label="Type DELETE to confirm" value={confirmDelete} onChange={setConfirmDelete} />
          <div className="actions">
            <button type="button" className="btn" disabled={confirmDelete !== 'DELETE' || danger.busy} onClick={() => void deleteAccount()}>
              Delete my account
            </button>
          </div>
        </div>
        <Notice tone="error">{danger.error}</Notice>
      </section>
    </div>
  )
}
