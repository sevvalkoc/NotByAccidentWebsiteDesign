import { useId, useState, type FormEvent } from 'react'
import { useCopy } from '@/content'
import { submitLead, type LeadSource } from '@/lib/leads'

/** One-field email capture. Writes to the same inbox as before. */
export default function EmailCapture({
  source,
  message,
  button,
  thanks,
  help,
  className = '',
}: {
  source: LeadSource
  message?: string
  button?: string
  thanks?: string
  help?: string
  className?: string
}) {
  const copy = useCopy()
  const id = useId()
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'offline'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '')
    if (!email.trim()) return
    setState('sending')
    const res = await submitLead({ email, source, message })
    setState(res.ok ? 'done' : res.reason)
  }

  if (state === 'done')
    return (
      <p className={`form-msg ${className}`} role="status">
        {thanks ?? copy.forms.subscribed}
      </p>
    )

  return (
    <form className={`capture ${className}`} onSubmit={submit} noValidate={false}>
      <div className="field">
        <label htmlFor={`${id}-e`}>{copy.forms.email}</label>
        <div className="capture__row">
          <input
            id={`${id}-e`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={copy.forms.emailPlaceholder}
            className="input"
            aria-describedby={`${id}-h`}
          />
          <button type="submit" className="btn" disabled={state === 'sending'}>
            {state === 'sending' ? copy.forms.sending : (button ?? copy.forms.subscribe)}
          </button>
        </div>
        <p id={`${id}-h`} className="help" aria-live="polite">
          {state === 'error' ? copy.forms.error : state === 'offline' ? copy.forms.offline : (help ?? copy.forms.emailHelp)}
        </p>
      </div>
    </form>
  )
}
