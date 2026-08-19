import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

/* Plain, fast, utilitarian UI primitives for the admin dashboard. This is
   an internal operating tool, not the brand experience — it deliberately
   does not use the public site's typography/colour system. Neutral grays +
   one accent (blue) for primary actions, red for destructive ones. */

export function AdminField({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  )
}

const inputCls =
  'w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'

export function AdminInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function AdminTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ''}`} rows={props.rows ?? 4} />
}

export function AdminSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} bg-white ${props.className ?? ''}`} />
}

export function AdminCheckbox({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 mb-4">
      <input type="checkbox" {...props} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      {label}
    </label>
  )
}

export function AdminButton({
  variant = 'primary',
  className = '',
  ...props
}: { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    danger: 'bg-white text-red-600 border border-red-200 hover:bg-red-50',
    ghost: 'text-gray-500 hover:text-gray-800',
  }
  return (
    <button
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    />
  )
}

export function AdminBadge({ children, tone = 'gray' }: { children: ReactNode; tone?: 'gray' | 'green' | 'yellow' | 'red' | 'blue' }) {
  const tones: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
  }
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>
}

export function statusTone(status: string): 'gray' | 'green' | 'yellow' | 'red' | 'blue' {
  if (status === 'published') return 'green'
  if (status === 'draft') return 'gray'
  if (status === 'archived') return 'red'
  if (status === 'ready') return 'blue'
  if (status === 'coming_soon') return 'yellow'
  return 'gray'
}

export function AdminPageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function AdminCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>{children}</div>
}

export function AdminEmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-gray-300 rounded-lg">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {body && <p className="text-sm text-gray-400 mt-1">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Requires a second click within 4s to actually run — cheap accidental-delete guard. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = 'Sure?',
  variant = 'danger',
}: {
  onConfirm: () => void
  children: ReactNode
  confirmLabel?: string
  variant?: 'danger' | 'secondary'
}) {
  const [armed, setArmed] = useState(false)
  if (armed) {
    return (
      <AdminButton
        variant={variant}
        onClick={() => {
          setArmed(false)
          onConfirm()
        }}
        onBlur={() => setArmed(false)}
      >
        {confirmLabel}
      </AdminButton>
    )
  }
  return (
    <AdminButton
      variant="ghost"
      onClick={() => {
        setArmed(true)
        window.setTimeout(() => setArmed(false), 4000)
      }}
    >
      {children}
    </AdminButton>
  )
}

export function AdminBackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4">
      ← {label}
    </Link>
  )
}

export function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
