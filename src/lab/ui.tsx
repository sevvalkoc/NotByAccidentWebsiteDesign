/* The Lab's interface pieces. Same system as the rest of the site: rules
   instead of boxes, tabular figures, one grotesk with the serif as accent,
   colours from the page environment. */
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { EVIDENCE, fmtScore } from './labels'
import { errMsg } from './api'

/** Data loader for one screen. Keeps the previous data while reloading. */
export function useLoad<T>(fn: () => Promise<T>, deps: unknown[]): { data: T | undefined; error: string; loading: boolean; reload: () => Promise<void>; set: (v: T) => void } {
  const [data, setData] = useState<T>()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const seq = useRef(0)
  const run = useCallback(async () => {
    const n = ++seq.current
    setLoading(true)
    try {
      const v = await fn()
      if (n === seq.current) {
        setData(v)
        setError('')
      }
    } catch (e) {
      if (n === seq.current) setError(errMsg(e))
    } finally {
      if (n === seq.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  useEffect(() => {
    void run()
  }, [run])
  return { data, error, loading, reload: run, set: setData }
}

/** A button whose action is async: disabled while running, reports errors. */
export function useAction() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const run = useCallback(async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      return true
    } catch (e) {
      setError(errMsg(e))
      return false
    } finally {
      setBusy(false)
    }
  }, [])
  return { busy, error, run, setError }
}

export function Notice({ tone = 'info', children }: { tone?: 'info' | 'error' | 'ok'; children: ReactNode }) {
  if (!children) return null
  return (
    <p className={`lab-notice lab-notice--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  )
}

export function Loading({ label = 'Loading' }: { label?: string }) {
  return (
    <p className="lab-loading t-caption dimmer" role="status">
      <span aria-hidden="true" className="lab-loading__line" />
      {label}…
    </p>
  )
}

/** A thin horizontal measure, 0–100. `null` draws an empty, dashed track. */
export function Meter({ value, label, compact }: { value: number | null | undefined; label?: string; compact?: boolean }) {
  const v = value == null ? null : Math.max(0, Math.min(100, value))
  return (
    <span
      className={`lab-meter${compact ? ' lab-meter--compact' : ''}${v == null ? ' lab-meter--empty' : ''}`}
      {...(label ? { role: 'img', 'aria-label': `${label}: ${v == null ? 'not scored' : `${fmtScore(value)} of 100`}` } : { 'aria-hidden': true })}
    >
      <span className="lab-meter__fill" style={{ inlineSize: `${v ?? 0}%` }} />
    </span>
  )
}

/** A row in a score table: label, measure, figure. */
export function ScoreRow({ label, value, note, weight }: { label: ReactNode; value: number | null | undefined; note?: ReactNode; weight?: number }) {
  return (
    <li className="lab-srow">
      <span className="lab-srow__label">
        {label}
        {weight != null ? <span className="t-caption dimmer"> · weight {weight}</span> : null}
      </span>
      <Meter value={value} label={typeof label === 'string' ? label : undefined} />
      <span className="lab-srow__value t-num">{fmtScore(value)}</span>
      {note ? <span className="lab-srow__note t-caption dimmer">{note}</span> : null}
    </li>
  )
}

export function Tag({ children, tone, title }: { children: ReactNode; tone?: 'accent' | 'warn' | 'quiet'; title?: string }) {
  return (
    <span className={`lab-tag${tone ? ` lab-tag--${tone}` : ''}`} title={title}>
      {children}
    </span>
  )
}

export function EvidenceTag({ kind }: { kind: string }) {
  const e = EVIDENCE[kind] ?? { label: kind, help: '' }
  return (
    <Tag tone={kind === 'verified' ? 'accent' : kind === 'missing' ? 'warn' : 'quiet'} title={e.help}>
      {e.label}
    </Tag>
  )
}

export function Empty({ title, body, children }: { title: string; body?: ReactNode; children?: ReactNode }) {
  return (
    <div className="lab-empty">
      <p className="t-title">{title}</p>
      {body ? <p className="dim lab-empty__body">{body}</p> : null}
      {children ? <div className="actions">{children}</div> : null}
    </div>
  )
}

/** A choice group as a fieldset: radios or checkboxes styled as rows. */
export function Choices({
  legend,
  help,
  options,
  value,
  onChange,
  multiple,
  max,
  required,
  columns,
}: {
  legend: ReactNode
  help?: ReactNode
  options: readonly (readonly [string, string])[]
  value: string[]
  onChange: (v: string[]) => void
  multiple?: boolean
  max?: number
  required?: boolean
  columns?: boolean
}) {
  const id = useId()
  const toggle = (k: string) => {
    if (!multiple) return onChange([k])
    if (value.includes(k)) return onChange(value.filter(x => x !== k))
    if (max && value.length >= max) return
    onChange([...value, k])
  }
  return (
    <fieldset className="lab-choices" aria-describedby={help ? `${id}-h` : undefined}>
      <legend className="lab-choices__legend">
        {legend}
        {required ? <span className="dimmer"> (required)</span> : null}
      </legend>
      {help ? (
        <p id={`${id}-h`} className="help t-caption dimmer">
          {help}
        </p>
      ) : null}
      <div className={`lab-choices__list${columns ? ' lab-choices__list--cols' : ''}`}>
        {options.map(([k, l]) => (
          <label key={k} className="lab-choice">
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={id}
              value={k}
              checked={value.includes(k)}
              onChange={() => toggle(k)}
              disabled={multiple && !!max && value.length >= max && !value.includes(k)}
            />
            <span>{l}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function TextField({
  label,
  help,
  value,
  onChange,
  type = 'text',
  required,
  multiline,
  maxLength,
  autoComplete,
  placeholder,
  inputMode,
}: {
  label: ReactNode
  help?: ReactNode
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  multiline?: boolean
  maxLength?: number
  autoComplete?: string
  placeholder?: string
  inputMode?: 'text' | 'email' | 'url' | 'numeric' | 'decimal'
}) {
  const id = useId()
  const common = {
    id,
    className: 'input',
    value,
    required,
    maxLength,
    placeholder,
    'aria-describedby': help ? `${id}-h` : undefined,
  }
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="dimmer"> (required)</span> : null}
      </label>
      {multiline ? (
        <textarea {...common} rows={4} onChange={e => onChange(e.target.value)} />
      ) : (
        <input {...common} type={type} autoComplete={autoComplete} inputMode={inputMode} onChange={e => onChange(e.target.value)} />
      )}
      {help ? (
        <p id={`${id}-h`} className="help">
          {help}
        </p>
      ) : null}
    </div>
  )
}

export function SelectField({
  label,
  help,
  value,
  onChange,
  options,
  placeholder = 'Choose…',
  required,
}: {
  label: ReactNode
  help?: ReactNode
  value: string
  onChange: (v: string) => void
  options: readonly (readonly [string, string])[]
  placeholder?: string
  required?: boolean
}) {
  const id = useId()
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? <span className="dimmer"> (required)</span> : null}
      </label>
      <select id={id} className="input" value={value} required={required} onChange={e => onChange(e.target.value)} aria-describedby={help ? `${id}-h` : undefined}>
        <option value="">{placeholder}</option>
        {options.map(([k, l]) => (
          <option key={k} value={k}>
            {l}
          </option>
        ))}
      </select>
      {help ? (
        <p id={`${id}-h`} className="help">
          {help}
        </p>
      ) : null}
    </div>
  )
}

/** A modal dialog using the native <dialog> element (focus trap and Esc for free). */
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  const id = useId()
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog ref={ref} className="lab-dialog" aria-labelledby={id} onClose={onClose} onCancel={onClose}>
      <div className="lab-dialog__head">
        <h2 id={id} className="t-title">
          {title}
        </h2>
        <button type="button" className="lab-x" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      {open ? children : null}
    </dialog>
  )
}
