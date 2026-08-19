import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { BrandColors } from '@/lib/database.types'
import { AdminPageHeader, AdminCard, AdminButton, AdminField, AdminInput, AdminSelect } from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

interface FormState {
  logo_primary_media_id: string | null
  logo_secondary_media_id: string | null
  symbol_media_id: string | null
  favicon_media_id: string | null
  og_default_media_id: string | null
  colors: BrandColors
  display_font: string
  heading_font: string
  body_font: string
  ui_font: string
  font_source: 'google' | 'hosted' | 'system'
}

const defaultColors: BrandColors = {
  background: '#F0EADA', surface: '#FFFFFF', primaryText: '#221E1B', secondaryText: '#6A6560',
  primaryBrand: '#6E2237', secondaryBrand: '#221E1B', accent: '#E9C558', border: '#D8CFC0',
}

const blank: FormState = {
  logo_primary_media_id: null, logo_secondary_media_id: null, symbol_media_id: null, favicon_media_id: null, og_default_media_id: null,
  colors: defaultColors, display_font: 'Lora', heading_font: 'Lora', body_font: 'DM Sans', ui_font: 'DM Sans', font_source: 'google',
}

const COLOR_LABELS: { key: keyof BrandColors; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'surface', label: 'Surface' },
  { key: 'primaryText', label: 'Primary text' },
  { key: 'secondaryText', label: 'Secondary text' },
  { key: 'primaryBrand', label: 'Primary brand' },
  { key: 'secondaryBrand', label: 'Secondary brand' },
  { key: 'accent', label: 'Accent' },
  { key: 'border', label: 'Border' },
]

export default function BrandSettings() {
  const [form, setForm] = useState<FormState>(blank)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('brand_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm({ ...blank, ...(data as Partial<FormState>), colors: { ...defaultColors, ...(data as { colors?: Partial<BrandColors> }).colors } })
      setLoading(false)
    })
  }, [])

  function set<K extends keyof FormState>(key: K, v: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: v }))
    setSaved(false)
  }
  function setColor(key: keyof BrandColors, value: string) {
    setForm(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } }))
    setSaved(false)
  }

  async function save() {
    if (!supabase) return
    setSaving(true)
    setError('')
    const { error } = await supabase.from('brand_settings').update(form).eq('id', 1)
    setSaving(false)
    if (error) return setError(error.message)
    setSaved(true)
  }

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Brand Settings"
        description="Logos, favicon and design tokens. These are stored for reference and future use across templates — the live site's CSS is not yet re-generated from these values automatically (see docs/CMS.md)."
        actions={<AdminButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</AdminButton>}
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {saved && <p className="text-sm text-green-700 mb-4">Saved.</p>}

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Logos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <MediaPicker label="Primary logo" mediaId={form.logo_primary_media_id} onChange={v => set('logo_primary_media_id', v)} accept="image/*,image/svg+xml" fileType="svg" />
          <MediaPicker label="Secondary logo" mediaId={form.logo_secondary_media_id} onChange={v => set('logo_secondary_media_id', v)} accept="image/*,image/svg+xml" fileType="svg" />
          <MediaPicker label="Symbol" mediaId={form.symbol_media_id} onChange={v => set('symbol_media_id', v)} accept="image/*,image/svg+xml" fileType="svg" />
          <MediaPicker label="Favicon" mediaId={form.favicon_media_id} onChange={v => set('favicon_media_id', v)} />
          <MediaPicker label="Default OG image" mediaId={form.og_default_media_id} onChange={v => set('og_default_media_id', v)} />
        </div>
      </AdminCard>

      <AdminCard className="p-6 mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Colours</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {COLOR_LABELS.map(({ key, label }) => (
            <div key={key}>
              <span className="block text-xs font-medium text-gray-700 mb-1">{label}</span>
              <div className="flex items-center gap-2">
                <input type="color" value={form.colors[key]} onChange={e => setColor(key, e.target.value)} className="w-8 h-8 rounded border border-gray-200" />
                <AdminInput value={form.colors[key]} onChange={e => setColor(key, e.target.value)} className="text-xs" />
              </div>
            </div>
          ))}
        </div>
        {contrastWarning(form.colors) && <p className="text-xs text-yellow-700 mt-3">{contrastWarning(form.colors)}</p>}
      </AdminCard>

      <AdminCard className="p-6">
        <p className="text-sm font-semibold text-gray-900 mb-4">Typography</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
          <AdminField label="Display font"><AdminInput value={form.display_font} onChange={e => set('display_font', e.target.value)} /></AdminField>
          <AdminField label="Heading font"><AdminInput value={form.heading_font} onChange={e => set('heading_font', e.target.value)} /></AdminField>
          <AdminField label="Body font"><AdminInput value={form.body_font} onChange={e => set('body_font', e.target.value)} /></AdminField>
          <AdminField label="UI font"><AdminInput value={form.ui_font} onChange={e => set('ui_font', e.target.value)} /></AdminField>
        </div>
        <AdminField label="Font source">
          <AdminSelect value={form.font_source} onChange={e => set('font_source', e.target.value as FormState['font_source'])}>
            <option value="google">Google Fonts</option>
            <option value="hosted">Hosted webfont URL</option>
            <option value="system">System fallback only</option>
          </AdminSelect>
        </AdminField>
      </AdminCard>
    </div>
  )
}

/* Crude WCAG-ish contrast check between primary text and background —
   enough to flag an obviously broken combination without a full audit. */
function contrastWarning(colors: BrandColors): string | null {
  const ratio = contrastRatio(colors.primaryText, colors.background)
  if (ratio < 4.5) return `Primary text on background has a contrast ratio of ${ratio.toFixed(1)}:1 — below the 4.5:1 WCAG AA minimum for body text.`
  return null
}
function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (lighter + 0.05) / (darker + 0.05)
}
function relativeLuminance(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null
}
