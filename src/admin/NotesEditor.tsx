import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { slugify, refreshSite } from '@/content'
import type { ArticleBlock } from '@/lib/database.types'
import {
  AdminPageHeader,
  AdminCard,
  AdminButton,
  AdminField,
  AdminInput,
  AdminTextarea,
  AdminCheckbox,
  AdminBackLink,
  ConfirmButton,
} from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'
import BlockEditor from '@/admin/BlockEditor'

interface FormState {
  title: string
  slug: string
  excerpt: string
  body: ArticleBlock[]
  category: string
  tags: string
  hero_image_media_id: string | null
  reading_time_minutes: string
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  seo_title: string
  seo_description: string
  canonical_url: string
  noindex: boolean
  og_media_id: string | null
}

const blank: FormState = {
  title: '',
  slug: '',
  excerpt: '',
  body: [],
  category: '',
  tags: '',
  hero_image_media_id: null,
  reading_time_minutes: '',
  featured: false,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  canonical_url: '',
  noindex: false,
  og_media_id: null,
}

export default function NotesEditor() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(blank)
  const [originalSlug, setOriginalSlug] = useState<string | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (isNew || !supabase) return
    supabase
      .from('articles')
      .select('*, category:article_categories ( name )')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) return
        const row = data as Record<string, unknown>
        setForm({
          title: String(row.title ?? ''),
          slug: String(row.slug ?? ''),
          excerpt: String(row.excerpt ?? ''),
          body: (row.body as ArticleBlock[]) ?? [],
          category: (row.category as { name: string } | null)?.name ?? '',
          tags: ((row.tags as string[]) ?? []).join(', '),
          hero_image_media_id: (row.hero_image_media_id as string) ?? null,
          reading_time_minutes: row.reading_time_minutes ? String(row.reading_time_minutes) : '',
          featured: Boolean(row.featured),
          status: (row.status as FormState['status']) ?? 'draft',
          seo_title: String(row.seo_title ?? ''),
          seo_description: String(row.seo_description ?? ''),
          canonical_url: String(row.canonical_url ?? ''),
          noindex: Boolean(row.noindex),
          og_media_id: (row.og_media_id as string) ?? null,
        })
        setOriginalSlug(String(row.slug ?? ''))
        setLoading(false)
      })
  }, [id, isNew])

  function set<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: v }))
  }

  async function resolveCategoryId(name: string): Promise<string | null> {
    if (!supabase || !name.trim()) return null
    const clean = name.trim()
    const { data } = await supabase.from('article_categories').select('id').eq('name', clean).maybeSingle()
    if (data) return (data as { id: string }).id
    const { data: created } = await supabase
      .from('article_categories')
      .insert({ name: clean, slug: slugify(clean) })
      .select('id')
      .single()
    return (created as { id: string } | null)?.id ?? null
  }

  async function handleSave(nextStatus?: FormState['status']) {
    if (!supabase) return
    setSaving(true)
    setError('')
    setSaved(false)

    const slugChanged = !isNew && originalSlug && form.slug !== originalSlug
    const categoryId = await resolveCategoryId(form.category)

    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt || null,
      body: form.body,
      category_id: categoryId,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
      hero_image_media_id: form.hero_image_media_id,
      reading_time_minutes: form.reading_time_minutes ? parseInt(form.reading_time_minutes, 10) : null,
      featured: form.featured,
      status: nextStatus ?? form.status,
      published_at: (nextStatus ?? form.status) === 'published' ? new Date().toISOString() : null,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      canonical_url: form.canonical_url || null,
      noindex: form.noindex,
      og_media_id: form.og_media_id,
    }

    if (isNew) {
      const { data, error } = await supabase.from('articles').insert(payload).select('id').single()
      setSaving(false)
      if (error) return setError(error.message)
      refreshSite()
      navigate(`/admin/notes/${(data as { id: string }).id}`, { replace: true })
      return
    }

    const { error } = await supabase.from('articles').update(payload).eq('id', id)
    if (error) {
      setSaving(false)
      return setError(error.message)
    }
    if (slugChanged) {
      await supabase.from('redirects').insert({
        from_path: `/notes/${originalSlug}`,
        to_path: `/notes/${payload.slug}`,
        redirect_type: 301,
      })
      setOriginalSlug(payload.slug)
    }
    if (nextStatus) set('status', nextStatus)
    setSaving(false)
    setSaved(true)
    refreshSite()
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="max-w-3xl">
      <AdminBackLink to="/admin/notes" label="Blog / Notes" />
      <AdminPageHeader
        title={isNew ? 'New Article' : form.title || 'Untitled'}
        actions={
          <>
            {!isNew && form.status !== 'draft' && (
              <AdminButton variant="secondary" disabled={saving} onClick={() => handleSave('draft')}>Unpublish</AdminButton>
            )}
            <AdminButton variant="secondary" disabled={saving} onClick={() => handleSave(isNew ? 'draft' : undefined)}>
              Save draft
            </AdminButton>
            <AdminButton disabled={saving} onClick={() => handleSave('published')}>
              {saving ? 'Saving…' : 'Publish'}
            </AdminButton>
          </>
        }
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved.</p>}

      <AdminCard className="p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Title"><AdminInput value={form.title} onChange={e => set('title', e.target.value)} onBlur={() => !form.slug && set('slug', slugify(form.title))} required /></AdminField>
          <AdminField label="Slug" hint="/notes/…"><AdminInput value={form.slug} onChange={e => set('slug', e.target.value)} required /></AdminField>
          <AdminField label="Category"><AdminInput value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Essay" /></AdminField>
          <AdminField label="Tags" hint="Comma-separated"><AdminInput value={form.tags} onChange={e => set('tags', e.target.value)} /></AdminField>
          <AdminField label="Reading time (minutes)"><AdminInput type="number" value={form.reading_time_minutes} onChange={e => set('reading_time_minutes', e.target.value)} /></AdminField>
        </div>
        <AdminField label="Excerpt"><AdminTextarea rows={2} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} /></AdminField>
        <MediaPicker label="Hero image" mediaId={form.hero_image_media_id} onChange={v => set('hero_image_media_id', v)} />
        <div className="mt-4">
          <AdminCheckbox label="Featured on homepage" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
        </div>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Body</p>
        <BlockEditor blocks={form.body} onChange={b => set('body', b)} />
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">SEO</p>
        <AdminField label="SEO title"><AdminInput value={form.seo_title} onChange={e => set('seo_title', e.target.value)} /></AdminField>
        <AdminField label="Meta description"><AdminTextarea rows={2} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} /></AdminField>
        <AdminField label="Canonical URL"><AdminInput type="url" value={form.canonical_url} onChange={e => set('canonical_url', e.target.value)} /></AdminField>
        <MediaPicker label="OG image" mediaId={form.og_media_id} onChange={v => set('og_media_id', v)} />
        <div className="mt-4">
          <AdminCheckbox label="Noindex (hide from search engines)" checked={form.noindex} onChange={e => set('noindex', e.target.checked)} />
        </div>
      </AdminCard>

      {!isNew && (
        <div className="mb-10">
          <ConfirmButton onConfirm={() => handleSave('archived')} confirmLabel="Archive this article?">Archive this article</ConfirmButton>
        </div>
      )}
    </div>
  )
}
