import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { slugify } from '@/content'
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminBadge,
  statusTone,
  AdminEmptyState,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminCheckbox,
  AdminBackLink,
} from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

const STATUSES = ['draft', 'published', 'archived'] as const

export function ReportsList() {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  useEffect(() => {
    if (!supabase) return
    supabase.from('reports').select('id, title, status, updated_at').order('updated_at', { ascending: false }).then(({ data }) => setRows(data ?? []))
  }, [])

  return (
    <div>
      <AdminPageHeader title="Reports" description="PDF reports shown on /reports once published." actions={<Link to="/admin/reports/new"><AdminButton>+ New Report</AdminButton></Link>} />
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No reports yet" action={<Link to="/admin/reports/new"><AdminButton>+ New Report</AdminButton></Link>} />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {rows.map(r => (
              <li key={r.id as string} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{r.title as string}</span>
                  <AdminBadge tone={statusTone(r.status as string)}>{r.status as string}</AdminBadge>
                </div>
                <Link to={`/admin/reports/${r.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}
    </div>
  )
}

interface FormState {
  title: string
  slug: string
  description: string
  cover_media_id: string | null
  category: string
  author: string
  pdf_media_id: string | null
  featured: boolean
  status: (typeof STATUSES)[number]
  seo_title: string
  seo_description: string
}

const blank: FormState = {
  title: '', slug: '', description: '', cover_media_id: null, category: '', author: '',
  pdf_media_id: null, featured: false, status: 'draft', seo_title: '', seo_description: '',
}

export function ReportEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(blank)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew || !supabase) return
    supabase.from('reports').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) return
      const row = data as Record<string, unknown>
      setForm({
        title: String(row.title ?? ''), slug: String(row.slug ?? ''), description: String(row.description ?? ''),
        cover_media_id: (row.cover_media_id as string) ?? null, category: String(row.category ?? ''),
        author: String(row.author ?? ''), pdf_media_id: (row.pdf_media_id as string) ?? null,
        featured: Boolean(row.featured), status: (row.status as FormState['status']) ?? 'draft',
        seo_title: String(row.seo_title ?? ''), seo_description: String(row.seo_description ?? ''),
      })
      setLoading(false)
    })
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: v }))
  }

  async function handleSave() {
    if (!supabase) return
    setError('')
    let fileSize: number | null = null
    if (form.pdf_media_id) {
      const { data } = await supabase.from('media').select('file_size_bytes').eq('id', form.pdf_media_id).maybeSingle()
      fileSize = (data as { file_size_bytes: number } | null)?.file_size_bytes ?? null
    }
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      file_size_bytes: fileSize,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    }
    if (isNew) {
      const { data, error } = await supabase.from('reports').insert(payload).select('id').single()
      if (error) return setError(error.message)
      navigate(`/admin/reports/${(data as { id: string }).id}`, { replace: true })
      return
    }
    const { error } = await supabase.from('reports').update(payload).eq('id', id)
    if (error) return setError(error.message)
    setSaved(true)
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <AdminBackLink to="/admin/reports" label="Reports" />
      <AdminPageHeader title={isNew ? 'New Report' : form.title || 'Untitled'} actions={<AdminButton onClick={handleSave}>Save</AdminButton>} />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved.</p>}

      <AdminCard className="p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Title"><AdminInput value={form.title} onChange={e => set('title', e.target.value)} onBlur={() => !form.slug && set('slug', slugify(form.title))} /></AdminField>
          <AdminField label="Slug"><AdminInput value={form.slug} onChange={e => set('slug', e.target.value)} /></AdminField>
          <AdminField label="Category"><AdminInput value={form.category} onChange={e => set('category', e.target.value)} /></AdminField>
          <AdminField label="Author"><AdminInput value={form.author} onChange={e => set('author', e.target.value)} /></AdminField>
          <AdminField label="Status">
            <AdminSelect value={form.status} onChange={e => set('status', e.target.value as FormState['status'])}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </AdminSelect>
          </AdminField>
        </div>
        <AdminField label="Description"><AdminTextarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} /></AdminField>
        <AdminCheckbox label="Featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <div className="space-y-4">
          <MediaPicker label="Cover image" mediaId={form.cover_media_id} onChange={v => set('cover_media_id', v)} bucket="documents" />
          <MediaPicker label="PDF file" mediaId={form.pdf_media_id} onChange={v => set('pdf_media_id', v)} bucket="documents" accept="application/pdf" fileType="pdf" />
        </div>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">SEO</p>
        <AdminField label="SEO title"><AdminInput value={form.seo_title} onChange={e => set('seo_title', e.target.value)} /></AdminField>
        <AdminField label="Meta description"><AdminTextarea rows={2} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} /></AdminField>
      </AdminCard>
    </div>
  )
}
