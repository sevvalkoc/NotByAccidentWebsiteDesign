import { useId, useState, type FormEvent } from 'react'
import PageHead, { crumbSchema } from '@/components/PageHead'
import StudioClock from '@/components/StudioClock'
import Zone from '@/components/Zone'
import { plain } from '@/components/Rich'
import { useCopy, usePageMeta, useSection, useSite } from '@/content'
import { usePage } from '@/hooks/usePage'
import { useLocale } from '@/i18n/locale'
import { submitLead } from '@/lib/leads'
import './misc.css'

/** Contact: the address first, the form for those who prefer it. */
export default function Contact() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const meta = usePageMeta('contact')
  const header = useSection('contact', 'header')
  const form = useSection('contact', 'form')
  const c = copy.contact
  const id = useId()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'offline'>('idle')
  const crumbs = [
    { name: copy.nav.homeCrumb, path: '/' },
    { name: copy.pages.contact, path: '/contact' },
  ]
  usePage({
    page: 'contact',
    path: '/contact',
    jsonLd: [crumbSchema(crumbs, locale), { '@context': 'https://schema.org', '@type': 'ContactPage', name: plain(meta.title), description: meta.description, about: { '@id': 'https://notbyaccident.com/#organization' } }],
  })

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const email = get('email')
    if (!email) return
    // Company and budget travel in the message (the previous form dropped them).
    const message = [get('company') && `Company: ${get('company')}`, get('budget') && `Budget: ${get('budget')}`, get('message')].filter(Boolean).join('\n\n')
    setState('sending')
    const res = await submitLead({ email, name: get('name'), message, source: 'contact' })
    setState(res.ok ? 'done' : res.reason)
  }

  const co = site.company
  return (
    <main id="main" tabIndex={-1}>
      <PageHead page="contact" env="signal" />
      <Zone env="frost" className="wrap band contact">
        <div className="contact__direct">
          {header?.body ? <p className="dim">{header.body}</p> : null}
          <dl className="facts">
            <div>
              <dt className="t-caption dimmer">{copy.footer.newBusiness}</dt>
              <dd className="t-title">
                <a className="link" href={`mailto:${co.newBusinessEmail}`}>
                  {co.newBusinessEmail}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-caption dimmer">{copy.footer.general}</dt>
              <dd>
                <a className="link" href={`mailto:${co.email}`}>
                  {co.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="t-caption dimmer">{copy.footer.press}</dt>
              <dd>
                <a className="link" href={`mailto:${co.pressEmail}`}>
                  {co.pressEmail}
                </a>
              </dd>
            </div>
            {co.phone ? (
              <div>
                <dt className="t-caption dimmer">Phone</dt>
                <dd>
                  <a className="link" href={`tel:${co.phone.replace(/[^+\d]/g, '')}`}>
                    {co.phone}
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="t-caption dimmer">{c.hours}</dt>
              <dd className="t-small">
                {co.hours}
                {form?.body ? `. ${form.body}` : ''}
              </dd>
            </div>
          </dl>
          <StudioClock className="dimmer contact__clock t-caption" />
        </div>
        <div className="contact__form">
          {form?.title ? <h2 className="label">{form.title}</h2> : null}
          {state === 'done' ? (
            <p className="t-title" role="status">
              {c.thanks}
            </p>
          ) : (
            <form onSubmit={submit} className="form">
              <div className="form__row">
                <div className="field">
                  <label htmlFor={`${id}-n`}>{c.name}</label>
                  <input id={`${id}-n`} name="name" className="input" autoComplete="name" aria-describedby={`${id}-nh`} />
                  <p id={`${id}-nh`} className="help">
                    {c.nameHelp}
                  </p>
                </div>
                <div className="field">
                  <label htmlFor={`${id}-c`}>{c.company}</label>
                  <input id={`${id}-c`} name="company" className="input" autoComplete="organization" aria-describedby={`${id}-ch`} />
                  <p id={`${id}-ch`} className="help">
                    {c.companyHelp}
                  </p>
                </div>
              </div>
              <div className="field">
                <label htmlFor={`${id}-e`}>
                  {c.email} <span className="dimmer">({copy.forms.required})</span>
                </label>
                <input id={`${id}-e`} name="email" type="email" required className="input" autoComplete="email" inputMode="email" aria-describedby={`${id}-eh`} />
                <p id={`${id}-eh`} className="help">
                  {c.emailHelp}
                </p>
              </div>
              <div className="field">
                <label htmlFor={`${id}-b`}>{c.budget}</label>
                <select id={`${id}-b`} name="budget" className="input" defaultValue="" aria-describedby={`${id}-bh`}>
                  <option value="" disabled>
                    {c.budgetPick}
                  </option>
                  {c.budgetOptions.map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
                <p id={`${id}-bh`} className="help">
                  {c.budgetHelp}
                </p>
              </div>
              <div className="field">
                <label htmlFor={`${id}-m`}>{c.message}</label>
                <textarea id={`${id}-m`} name="message" className="input" rows={5} aria-describedby={`${id}-mh`} />
                <p id={`${id}-mh`} className="help">
                  {c.messageHelp}
                </p>
              </div>
              <div className="actions">
                <button type="submit" className="btn" disabled={state === 'sending'}>
                  {state === 'sending' ? copy.forms.sending : c.send}
                </button>
                <p className="form-msg" role="alert">
                  {state === 'error' ? copy.forms.error : state === 'offline' ? copy.forms.offline : ''}
                </p>
              </div>
            </form>
          )}
        </div>
      </Zone>
    </main>
  )
}
