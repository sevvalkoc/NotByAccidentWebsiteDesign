import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminBadge, AdminButton, AdminInput, ConfirmButton } from '@/admin/ui'

interface SeoCheck {
  label: string
  status: 'good' | 'attention' | 'missing'
  detail: string
}
interface AuditRow {
  kind: 'Work' | 'Article'
  id: string
  title: string
  editHref: string
  checks: SeoCheck[]
}

function titleAndDescriptionChecks(title: string | null, seoTitle: string | null, description: string | null): SeoCheck[] {
  const effectiveTitle = seoTitle || title || ''
  const checks: SeoCheck[] = []
  if (!effectiveTitle) checks.push({ label: 'SEO title', status: 'missing', detail: 'No title set.' })
  else if (effectiveTitle.length > 60) checks.push({ label: 'SEO title', status: 'attention', detail: `${effectiveTitle.length} characters — over the ~60 character guideline.` })
  else checks.push({ label: 'SEO title', status: 'good', detail: `${effectiveTitle.length} characters.` })

  if (!description) checks.push({ label: 'Meta description', status: 'missing', detail: 'No description set.' })
  else if (description.length < 50 || description.length > 160)
    checks.push({ label: 'Meta description', status: 'attention', detail: `${description.length} characters — outside the 50–160 character guideline.` })
  else checks.push({ label: 'Meta description', status: 'good', detail: `${description.length} characters.` })

  return checks
}

export default function Seo() {
  const [rows, setRows] = useState<AuditRow[] | null>(null)

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('projects').select('id, title, short_description, seo_title, seo_description, hero_image_media_id, slug').eq('status', 'published'),
      supabase.from('articles').select('id, title, excerpt, seo_title, seo_description, hero_image_media_id, slug').eq('status', 'published'),
    ]).then(([projects, articles]) => {
      const out: AuditRow[] = []
      for (const p of (projects.data as Record<string, unknown>[]) ?? []) {
        const checks = titleAndDescriptionChecks(p.title as string, p.seo_title as string, (p.seo_description as string) || (p.short_description as string))
        checks.push(
          p.hero_image_media_id
            ? { label: 'Hero image', status: 'good', detail: 'Set.' }
            : { label: 'Hero image', status: 'attention', detail: 'No hero image set.' }
        )
        checks.push(p.slug ? { label: 'Slug', status: 'good', detail: String(p.slug) } : { label: 'Slug', status: 'missing', detail: 'No slug.' })
        out.push({ kind: 'Work', id: p.id as string, title: p.title as string, editHref: `/admin/work/${p.id}`, checks })
      }
      for (const a of (articles.data as Record<string, unknown>[]) ?? []) {
        const checks = titleAndDescriptionChecks(a.title as string, a.seo_title as string, (a.seo_description as string) || (a.excerpt as string))
        checks.push(
          a.hero_image_media_id
            ? { label: 'Hero image', status: 'good', detail: 'Set.' }
            : { label: 'Hero image', status: 'attention', detail: 'No hero image set.' }
        )
        out.push({ kind: 'Article', id: a.id as string, title: a.title as string, editHref: `/admin/notes/${a.id}`, checks })
      }
      setRows(out)
    })
  }, [])

  const worst = (checks: SeoCheck[]): SeoCheck['status'] =>
    checks.some(c => c.status === 'missing') ? 'missing' : checks.some(c => c.status === 'attention') ? 'attention' : 'good'

  return (
    <div>
      <AdminPageHeader
        title="SEO"
        description="A plain health check across published Work and Articles — not a full crawler audit. Robots.txt, sitemap.xml, canonical URLs and structured data are already handled in code across the site."
      />

      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <AdminCard className="mb-10">
          <ul className="divide-y divide-gray-100">
            {rows.map(r => (
              <li key={`${r.kind}-${r.id}`} className="px-4 py-3">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <AdminBadge tone={worst(r.checks) === 'good' ? 'green' : worst(r.checks) === 'attention' ? 'yellow' : 'red'}>
                      {worst(r.checks) === 'good' ? 'Good' : worst(r.checks) === 'attention' ? 'Needs attention' : 'Missing'}
                    </AdminBadge>
                    <span className="text-xs text-gray-400">{r.kind}</span>
                    <span className="text-sm font-medium text-gray-900">{r.title}</span>
                  </div>
                  <Link to={r.editHref} className="text-sm text-blue-600 hover:underline">Edit →</Link>
                </div>
                <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                  {r.checks.map(c => (
                    <li key={c.label} className="text-xs text-gray-500">
                      <span className={c.status === 'good' ? 'text-green-700' : c.status === 'attention' ? 'text-yellow-700' : 'text-red-600'}>
                        {c.label}:
                      </span>{' '}
                      {c.detail}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <Redirects />
    </div>
  )
}

interface RedirectRow {
  id: string
  from_path: string
  to_path: string
  redirect_type: number
  is_active: boolean
}

function Redirects() {
  const [rows, setRows] = useState<RedirectRow[] | null>(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [error, setError] = useState('')

  async function load() {
    if (!supabase) return
    const { data } = await supabase.from('redirects').select('*').order('created_at', { ascending: false })
    setRows((data as RedirectRow[]) ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function add() {
    if (!supabase) return
    setError('')
    const fromPath = normalisePath(from)
    const toPath = normalisePath(to)
    if (!fromPath || !toPath) return setError('Both paths are required.')
    if (fromPath === toPath) return setError('A redirect cannot point to itself.')
    if ((rows ?? []).some(r => r.from_path === toPath && r.to_path === fromPath)) {
      return setError('That would create a redirect loop with an existing redirect.')
    }
    const { error } = await supabase.from('redirects').insert({ from_path: fromPath, to_path: toPath })
    if (error) return setError(error.message)
    setFrom('')
    setTo('')
    await load()
  }

  async function toggle(id: string, is_active: boolean) {
    if (!supabase) return
    await supabase.from('redirects').update({ is_active: !is_active }).eq('id', id)
    await load()
  }

  async function remove(id: string) {
    if (!supabase) return
    await supabase.from('redirects').delete().eq('id', id)
    await load()
  }

  function normalisePath(p: string): string {
    const trimmed = p.trim()
    if (!trimmed) return ''
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  }

  return (
    <div>
      <AdminPageHeader
        title="Redirects"
        description="Entries created automatically when you change a published Work or Article slug also appear here. Handled client-side (this site has no server of its own) — fine for normal use, but add a rule in vercel.json too if a specific old URL's SEO value really matters. See docs/CMS.md."
      />
      <AdminCard className="p-4 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <AdminInput placeholder="/old-path" value={from} onChange={e => setFrom(e.target.value)} className="w-48" />
          <span className="text-gray-400">→</span>
          <AdminInput placeholder="/new-path" value={to} onChange={e => setTo(e.target.value)} className="w-48" />
          <AdminButton type="button" onClick={add}>Add redirect</AdminButton>
        </div>
        {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      </AdminCard>
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-400">No redirects yet.</p>
      ) : (
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {rows.map(r => (
              <li key={r.id} className="flex items-center justify-between px-4 py-2.5">
                <p className="text-sm text-gray-700">
                  <code className="text-xs bg-gray-100 px-1 rounded">{r.from_path}</code> → <code className="text-xs bg-gray-100 px-1 rounded">{r.to_path}</code>{' '}
                  <span className="text-gray-400">({r.redirect_type})</span>
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggle(r.id, r.is_active)} className="text-xs text-gray-500 hover:text-gray-800">
                    {r.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <ConfirmButton onConfirm={() => remove(r.id)}>Delete</ConfirmButton>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  )
}
