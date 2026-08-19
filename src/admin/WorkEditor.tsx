import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { slugify, refreshSite } from '@/content'
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
import GalleryManager from '@/admin/GalleryManager'

interface FormState {
  title: string
  client: string
  slug: string
  year: string
  industry: string
  location: string
  short_description: string
  challenge: string
  insight: string
  strategy: string
  what_we_did: string
  outcome: string
  results: string
  services: string
  related_capability_slugs: string
  hero_image_media_id: string | null
  thumbnail_media_id: string | null
  credits: string
  external_url: string
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
  client: '',
  slug: '',
  year: '',
  industry: '',
  location: '',
  short_description: '',
  challenge: '',
  insight: '',
  strategy: '',
  what_we_did: '',
  outcome: '',
  results: '',
  services: '',
  related_capability_slugs: '',
  hero_image_media_id: null,
  thumbnail_media_id: null,
  credits: '',
  external_url: '',
  featured: false,
  status: 'draft',
  seo_title: '',
  seo_description: '',
  canonical_url: '',
  noindex: false,
  og_media_id: null,
}

export default function WorkEditor() {
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
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) return
        const row = data as Record<string, unknown>
        setForm({
          title: String(row.title ?? ''),
          client: String(row.client ?? ''),
          slug: String(row.slug ?? ''),
          year: String(row.year ?? ''),
          industry: String(row.industry ?? ''),
          location: String(row.location ?? ''),
          short_description: String(row.short_description ?? ''),
          challenge: String(row.challenge ?? ''),
          insight: String(row.insight ?? ''),
          strategy: String(row.strategy ?? ''),
          what_we_did: String(row.what_we_did ?? ''),
          outcome: String(row.outcome ?? ''),
          results: String(row.results ?? ''),
          services: ((row.services as string[]) ?? []).join(', '),
          related_capability_slugs: ((row.related_capability_slugs as string[]) ?? []).join(', '),
          hero_image_media_id: (row.hero_image_media_id as string) ?? null,
          thumbnail_media_id: (row.thumbnail_media_id as string) ?? null,
          credits: String(row.credits ?? ''),
          external_url: String(row.external_url ?? ''),
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

  async function handleSave(nextStatus?: FormState['status']) {
    if (!supabase) return
    setSaving(true)
    setError('')
    setSaved(false)

    const slugChanged = !isNew && originalSlug && form.slug !== originalSlug
    const payload = {
      title: form.title,
      client: form.client || null,
      slug: form.slug || slugify(form.title),
      year: form.year || null,
      industry: form.industry || null,
      location: form.location || null,
      short_description: form.short_description || null,
      challenge: form.challenge || null,
      insight: form.insight || null,
      strategy: form.strategy || null,
      what_we_did: form.what_we_did || null,
      outcome: form.outcome || null,
      results: form.results || null,
      services: form.services.split(',').map(s => s.trim()).filter(Boolean),
      related_capability_slugs: form.related_capability_slugs.split(',').map(s => s.trim()).filter(Boolean),
      hero_image_media_id: form.hero_image_media_id,
      thumbnail_media_id: form.thumbnail_media_id,
      credits: form.credits || null,
      external_url: form.external_url || null,
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
      const { count } = await supabase.from('projects').select('id', { count: 'exact', head: true })
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...payload, sort_order: count ?? 0 })
        .select('id')
        .single()
      setSaving(false)
      if (error) return setError(error.message)
      refreshSite()
      navigate(`/admin/work/${(data as { id: string }).id}`, { replace: true })
      return
    }

    const { error } = await supabase.from('projects').update(payload).eq('id', id)
    if (error) {
      setSaving(false)
      return setError(error.message)
    }
    if (slugChanged) {
      await supabase.from('redirects').insert({
        from_path: `/case-studies/${originalSlug}`,
        to_path: `/case-studies/${payload.slug}`,
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
      <AdminBackLink to="/admin/work" label="Work" />
      <AdminPageHeader
        title={isNew ? 'New Work' : form.title || 'Untitled'}
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
          <AdminField label="Client"><AdminInput value={form.client} onChange={e => set('client', e.target.value)} /></AdminField>
          <AdminField label="Slug" hint="/case-studies/…"><AdminInput value={form.slug} onChange={e => set('slug', e.target.value)} required /></AdminField>
          <AdminField label="Year"><AdminInput value={form.year} onChange={e => set('year', e.target.value)} /></AdminField>
          <AdminField label="Industry"><AdminInput value={form.industry} onChange={e => set('industry', e.target.value)} /></AdminField>
          <AdminField label="Location"><AdminInput value={form.location} onChange={e => set('location', e.target.value)} /></AdminField>
        </div>
        <AdminField label="Short description" hint="Shown on listing cards"><AdminTextarea rows={2} value={form.short_description} onChange={e => set('short_description', e.target.value)} /></AdminField>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Problem → Insight → Intervention → Outcome</p>
        <AdminField label="Challenge (problem)"><AdminTextarea value={form.challenge} onChange={e => set('challenge', e.target.value)} /></AdminField>
        <AdminField label="Insight"><AdminTextarea value={form.insight} onChange={e => set('insight', e.target.value)} /></AdminField>
        <AdminField label="Strategy"><AdminTextarea value={form.strategy} onChange={e => set('strategy', e.target.value)} /></AdminField>
        <AdminField label="What we did"><AdminTextarea value={form.what_we_did} onChange={e => set('what_we_did', e.target.value)} /></AdminField>
        <AdminField label="Outcome"><AdminTextarea value={form.outcome} onChange={e => set('outcome', e.target.value)} /></AdminField>
        <AdminField label="Results" hint="A specific, real number or statement — never invent one"><AdminTextarea rows={2} value={form.results} onChange={e => set('results', e.target.value)} /></AdminField>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Services" hint="Comma-separated"><AdminInput value={form.services} onChange={e => set('services', e.target.value)} /></AdminField>
          <AdminField label="Related capability slugs" hint="Comma-separated, e.g. brand-strategy, seo"><AdminInput value={form.related_capability_slugs} onChange={e => set('related_capability_slugs', e.target.value)} /></AdminField>
          <AdminField label="Credits"><AdminInput value={form.credits} onChange={e => set('credits', e.target.value)} /></AdminField>
          <AdminField label="External URL"><AdminInput type="url" value={form.external_url} onChange={e => set('external_url', e.target.value)} /></AdminField>
        </div>
        <AdminCheckbox label="Featured on homepage" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Images</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <MediaPicker label="Hero image" mediaId={form.hero_image_media_id} onChange={v => set('hero_image_media_id', v)} />
          <MediaPicker label="Thumbnail" mediaId={form.thumbnail_media_id} onChange={v => set('thumbnail_media_id', v)} />
        </div>
        {!isNew && <GalleryManager projectId={id!} />}
        {isNew && <p className="text-xs text-gray-400">Save this project once before adding gallery images.</p>}
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
          <ConfirmButton onConfirm={() => handleSave('archived')} confirmLabel="Archive this work?">Archive this work</ConfirmButton>
        </div>
      )}
    </div>
  )
}
