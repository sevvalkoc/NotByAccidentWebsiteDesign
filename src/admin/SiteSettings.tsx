import { useSiteSettingsForm } from '@/admin/useSiteSettingsForm'
import { AdminPageHeader, AdminCard, AdminButton, AdminField, AdminInput, AdminTextarea } from '@/admin/ui'

export default function SiteSettings() {
  const { form, set, loading, saving, saved, error, save } = useSiteSettingsForm()
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <AdminPageHeader title="Site Settings" description="Global defaults used across the site and in metadata." actions={<AdminButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</AdminButton>} />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved.</p>}

      <AdminCard className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Site name"><AdminInput value={form.site_name} onChange={e => set('site_name', e.target.value)} /></AdminField>
          <AdminField label="Domain"><AdminInput value={form.domain} onChange={e => set('domain', e.target.value)} placeholder="notbyaccident.studio" /></AdminField>
          <AdminField label="Language" hint="e.g. en-GB"><AdminInput value={form.language} onChange={e => set('language', e.target.value)} /></AdminField>
          <AdminField label="Locale" hint="e.g. en_GB"><AdminInput value={form.locale} onChange={e => set('locale', e.target.value)} /></AdminField>
        </div>
        <AdminField label="Site description"><AdminTextarea rows={2} value={form.site_description} onChange={e => set('site_description', e.target.value)} /></AdminField>
        <AdminField label="Default SEO title"><AdminInput value={form.default_seo_title} onChange={e => set('default_seo_title', e.target.value)} /></AdminField>
        <AdminField label="Default meta description"><AdminTextarea rows={2} value={form.default_meta_description} onChange={e => set('default_meta_description', e.target.value)} /></AdminField>
        <AdminField label="Default OG image URL"><AdminInput type="url" value={form.default_og_image_url} onChange={e => set('default_og_image_url', e.target.value)} /></AdminField>
      </AdminCard>
    </div>
  )
}
