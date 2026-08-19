import { Link } from 'react-router-dom'
import { useSiteSettingsForm } from '@/admin/useSiteSettingsForm'
import { AdminPageHeader, AdminCard, AdminButton, AdminField, AdminInput, AdminTextarea } from '@/admin/ui'

export default function ContactSettings() {
  const { form, set, loading, saving, saved, error, save } = useSiteSettingsForm()
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  function setSocial(i: number, key: 'label' | 'url', value: string) {
    const next = [...form.social_links]
    next[i] = { ...next[i], [key]: value }
    set('social_links', next)
  }

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Footer / Contact"
        description="Address, email, phone and social links — used in the footer and on the Contact page. Change the address once here and it updates everywhere."
        actions={
          <>
            <Link to="/admin/submissions" className="text-sm text-blue-600 hover:underline self-center mr-2">View submissions →</Link>
            <AdminButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</AdminButton>
          </>
        }
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved — this updates the footer, Contact page and structured data immediately.</p>}

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Contact</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="General email"><AdminInput type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} /></AdminField>
          <AdminField label="New business email"><AdminInput type="email" value={form.new_business_email} onChange={e => set('new_business_email', e.target.value)} /></AdminField>
          <AdminField label="Press email"><AdminInput type="email" value={form.press_email} onChange={e => set('press_email', e.target.value)} /></AdminField>
          <AdminField label="Phone"><AdminInput value={form.phone} onChange={e => set('phone', e.target.value)} /></AdminField>
          <AdminField label="Hours"><AdminInput value={form.hours} onChange={e => set('hours', e.target.value)} /></AdminField>
        </div>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Studio address</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Line 1"><AdminInput value={form.address_line1} onChange={e => set('address_line1', e.target.value)} /></AdminField>
          <AdminField label="Line 2"><AdminInput value={form.address_line2} onChange={e => set('address_line2', e.target.value)} /></AdminField>
          <AdminField label="City"><AdminInput value={form.address_city} onChange={e => set('address_city', e.target.value)} /></AdminField>
          <AdminField label="Postcode"><AdminInput value={form.address_postcode} onChange={e => set('address_postcode', e.target.value)} /></AdminField>
          <AdminField label="Country"><AdminInput value={form.address_country} onChange={e => set('address_country', e.target.value)} /></AdminField>
        </div>
        <AdminField label="Company registration" hint="Registration number, registered office — shown in the footer and Privacy page">
          <AdminTextarea rows={2} value={form.registration_note} onChange={e => set('registration_note', e.target.value)} />
        </AdminField>
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Social links</p>
        {form.social_links.map((s, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 mb-2">
            <AdminInput placeholder="Label (e.g. Instagram)" value={s.label} onChange={e => setSocial(i, 'label', e.target.value)} />
            <div className="flex items-center gap-2">
              <AdminInput placeholder="URL" value={s.url} onChange={e => setSocial(i, 'url', e.target.value)} />
              <button
                onClick={() => set('social_links', form.social_links.filter((_, idx) => idx !== i))}
                className="text-xs text-red-500 shrink-0"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <AdminButton
          type="button"
          variant="secondary"
          className="mt-2"
          onClick={() => set('social_links', [...form.social_links, { label: '', url: '' }])}
        >
          + Add social link
        </AdminButton>
      </AdminCard>
    </div>
  )
}
