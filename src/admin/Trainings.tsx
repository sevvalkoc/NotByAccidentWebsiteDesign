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
  ConfirmButton,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminBackLink,
} from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

const STATUSES = ['draft', 'ready', 'coming_soon', 'published', 'archived'] as const

export function TrainingsList() {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null)
  useEffect(() => {
    if (!supabase) return
    supabase
      .from('trainings')
      .select('id, title, status, updated_at')
      .order('updated_at', { ascending: false })
      .then(({ data }) => setRows(data ?? []))
  }, [])

  return (
    <div>
      <AdminPageHeader
        title="Trainings"
        description="Prepare the future training catalogue here. The public /trainings page always shows Coming Soon, whatever status is set here — flip that in code when you're ready to launch it (see docs/CMS.md)."
        actions={<Link to="/admin/trainings/new"><AdminButton>+ New Training</AdminButton></Link>}
      />
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No trainings yet" action={<Link to="/admin/trainings/new"><AdminButton>+ New Training</AdminButton></Link>} />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-gray-100">
            {rows.map(r => (
              <li key={r.id as string} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{r.title as string}</span>
                  <AdminBadge tone={statusTone(r.status as string)}>{(r.status as string).replace('_', ' ')}</AdminBadge>
                </div>
                <Link to={`/admin/trainings/${r.id}`} className="text-sm text-blue-600 hover:underline">Edit</Link>
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
  short_description: string
  full_description: string
  instructor: string
  cover_media_id: string | null
  category: string
  level: string
  duration: string
  language: string
  format: string
  price: string
  status: (typeof STATUSES)[number]
  pdf_media_id: string | null
  video_media_id: string | null
  external_video_url: string
  seo_title: string
  seo_description: string
}

const blank: FormState = {
  title: '', slug: '', short_description: '', full_description: '', instructor: '', cover_media_id: null,
  category: '', level: '', duration: '', language: '', format: '', price: '', status: 'draft',
  pdf_media_id: null, video_media_id: null, external_video_url: '', seo_title: '', seo_description: '',
}

export function TrainingEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(blank)
  const [loading, setLoading] = useState(!isNew)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew || !supabase) return
    supabase.from('trainings').select('*').eq('id', id).single().then(({ data }) => {
      if (!data) return
      const row = data as Record<string, unknown>
      setForm({
        title: String(row.title ?? ''), slug: String(row.slug ?? ''),
        short_description: String(row.short_description ?? ''), full_description: String(row.full_description ?? ''),
        instructor: String(row.instructor ?? ''), cover_media_id: (row.cover_media_id as string) ?? null,
        category: String(row.category ?? ''), level: String(row.level ?? ''), duration: String(row.duration ?? ''),
        language: String(row.language ?? ''), format: String(row.format ?? ''), price: String(row.price ?? ''),
        status: (row.status as FormState['status']) ?? 'draft',
        pdf_media_id: (row.pdf_media_id as string) ?? null, video_media_id: (row.video_media_id as string) ?? null,
        external_video_url: String(row.external_video_url ?? ''),
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
    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      published_at: form.status === 'published' ? new Date().toISOString() : null,
    }
    if (isNew) {
      const { data, error } = await supabase.from('trainings').insert(payload).select('id').single()
      if (error) return setError(error.message)
      navigate(`/admin/trainings/${(data as { id: string }).id}`, { replace: true })
      return
    }
    const { error } = await supabase.from('trainings').update(payload).eq('id', id)
    if (error) return setError(error.message)
    setSaved(true)
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <AdminBackLink to="/admin/trainings" label="Trainings" />
      <AdminPageHeader title={isNew ? 'New Training' : form.title || 'Untitled'} actions={<AdminButton onClick={handleSave}>Save</AdminButton>} />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved.</p>}

      <AdminCard className="p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Title"><AdminInput value={form.title} onChange={e => set('title', e.target.value)} onBlur={() => !form.slug && set('slug', slugify(form.title))} /></AdminField>
          <AdminField label="Slug"><AdminInput value={form.slug} onChange={e => set('slug', e.target.value)} /></AdminField>
          <AdminField label="Instructor"><AdminInput value={form.instructor} onChange={e => set('instructor', e.target.value)} /></AdminField>
          <AdminField label="Category"><AdminInput value={form.category} onChange={e => set('category', e.target.value)} /></AdminField>
          <AdminField label="Level"><AdminInput value={form.level} onChange={e => set('level', e.target.value)} /></AdminField>
          <AdminField label="Duration"><AdminInput value={form.duration} onChange={e => set('duration', e.target.value)} /></AdminField>
          <AdminField label="Language"><AdminInput value={form.language} onChange={e => set('language', e.target.value)} /></AdminField>
          <AdminField label="Format"><AdminInput value={form.format} onChange={e => set('format', e.target.value)} /></AdminField>
          <AdminField label="Price"><AdminInput value={form.price} onChange={e => set('price', e.target.value)} /></AdminField>
          <AdminField label="Status">
            <AdminSelect value={form.status} onChange={e => set('status', e.target.value as FormState['status'])}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </AdminSelect>
          </AdminField>
        </div>
        <AdminField label="Short description"><AdminTextarea rows={2} value={form.short_description} onChange={e => set('short_description', e.target.value)} /></AdminField>
        <AdminField label="Full description"><AdminTextarea rows={5} value={form.full_description} onChange={e => set('full_description', e.target.value)} /></AdminField>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Files & media</p>
        <p className="text-xs text-gray-400 mb-3">Uploaded to the private trainings bucket — never publicly accessible, whatever the status above.</p>
        <div className="space-y-4">
          <MediaPicker label="Cover image" mediaId={form.cover_media_id} onChange={v => set('cover_media_id', v)} bucket="trainings" />
          <MediaPicker label="PDF" mediaId={form.pdf_media_id} onChange={v => set('pdf_media_id', v)} bucket="trainings" accept="application/pdf" fileType="pdf" />
          <MediaPicker label="Video file" mediaId={form.video_media_id} onChange={v => set('video_media_id', v)} bucket="trainings" accept="video/*" fileType="video" />
          <AdminField label="External video URL" hint="Alternative to uploading a file — e.g. a private Vimeo link"><AdminInput type="url" value={form.external_video_url} onChange={e => set('external_video_url', e.target.value)} /></AdminField>
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
