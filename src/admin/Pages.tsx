import { useEffect, useRef, useState } from 'react'
import { supabase, publicMediaUrl } from '@/lib/supabase'
import { refreshSite } from '@/content'
import { AdminPageHeader, AdminCard, AdminField, AdminInput, AdminTextarea, AdminButton } from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

/* Homepage section editor. Reads/writes the `page_sections` rows for the
   'home' page (seeded by supabase/migrations/0005_homepage_sections.sql),
   which src/lib/cms.ts's fetchHomeSections() reads back on the public site.
   Each section saves independently. The hero section additionally gets a
   drag control for nudging the hero photo's position — a bounded,
   responsive-safe placement adjustment (stored as a px offset in `extra`),
   not a freeform pixel canvas. */

type Extra = { words?: string[]; imageOffsetX?: number; imageOffsetY?: number }

interface SectionRow {
  id: string
  section_key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  image_media_id: string | null
  extra: Extra
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  capabilities: 'Capabilities',
  notes: 'Notes',
  case_studies: 'Case studies',
  final_cta: 'Final CTA',
}
const SECTION_ORDER = ['hero', 'capabilities', 'notes', 'case_studies', 'final_cta']

export default function Pages() {
  const [rows, setRows] = useState<SectionRow[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    void load()
  }, [])

  async function load() {
    if (!supabase) return
    const { data: page, error: pageError } = await supabase.from('pages').select('id').eq('slug', 'home').maybeSingle()
    if (pageError || !page) {
      setError(pageError?.message ?? "No 'home' page row found — run supabase/migrations/0005_homepage_sections.sql.")
      return
    }
    const { data, error } = await supabase
      .from('page_sections')
      .select('id, section_key, eyebrow, title, subtitle, body, image_media_id, extra')
      .eq('page_id', (page as { id: string }).id)
    if (error) {
      setError(error.message)
      return
    }
    setRows(((data ?? []) as unknown as SectionRow[]).sort((a, b) => SECTION_ORDER.indexOf(a.section_key) - SECTION_ORDER.indexOf(b.section_key)))
  }

  function patchRow(id: string, patch: Partial<SectionRow>) {
    setRows(rs => rs && rs.map(r => (r.id === id ? { ...r, ...patch } : r)))
  }

  async function saveRow(row: SectionRow) {
    if (!supabase) return
    const { error } = await supabase
      .from('page_sections')
      .update({
        eyebrow: row.eyebrow,
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        image_media_id: row.image_media_id,
        extra: row.extra,
      })
      .eq('id', row.id)
    if (error) {
      setError(error.message)
      return
    }
    refreshSite()
  }

  if (!supabase) {
    return (
      <div>
        <AdminPageHeader title="Pages" description="Structured copy editing for Home, Studio and other pages." />
        <p className="text-sm text-gray-400">Not connected.</p>
      </div>
    )
  }

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Edit the homepage's hero and section headings. Changes go live immediately after Save — check the site in another tab."
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">
          {rows.map(row =>
            row.section_key === 'hero' ? (
              <HeroCard key={row.id} row={row} onChange={patch => patchRow(row.id, patch)} onSave={() => saveRow(row)} />
            ) : (
              <SectionCard key={row.id} row={row} onChange={patch => patchRow(row.id, patch)} onSave={() => saveRow(row)} />
            )
          )}
        </div>
      )}
    </div>
  )
}

function SaveBar({ onSave, label }: { onSave: () => void; label: string }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  return (
    <div className="flex items-center gap-3 mt-4">
      <AdminButton
        type="button"
        disabled={saving}
        onClick={async () => {
          setSaving(true)
          setSaved(false)
          await onSave()
          setSaving(false)
          setSaved(true)
          window.setTimeout(() => setSaved(false), 2000)
        }}
      >
        {saving ? 'Saving…' : `Save ${label}`}
      </AdminButton>
      {saved && <span className="text-sm text-green-600">Saved</span>}
    </div>
  )
}

function SectionCard({
  row,
  onChange,
  onSave,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
}) {
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{SECTION_LABELS[row.section_key] ?? row.section_key}</h2>
      <AdminField label="Eyebrow">
        <AdminInput value={row.eyebrow ?? ''} onChange={e => onChange({ eyebrow: e.target.value })} />
      </AdminField>
      <AdminField label="Heading">
        <AdminInput value={row.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      </AdminField>
      {row.section_key === 'final_cta' && (
        <AdminField label="Body">
          <AdminTextarea value={row.body ?? ''} onChange={e => onChange({ body: e.target.value })} rows={3} />
        </AdminField>
      )}
      <SaveBar onSave={onSave} label={SECTION_LABELS[row.section_key] ?? row.section_key} />
    </AdminCard>
  )
}

const OFFSET_RANGE = 40 // px, each direction — bounded so it always stays responsive-safe

function HeroCard({
  row,
  onChange,
  onSave,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
}) {
  const offsetX = row.extra.imageOffsetX ?? 0
  const offsetY = row.extra.imageOffsetY ?? 0
  const words = (row.extra.words ?? []).join(', ')
  const previewRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  function setOffset(x: number, y: number) {
    onChange({ extra: { ...row.extra, imageOffsetX: x, imageOffsetY: y } })
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || !previewRef.current) return
    const rect = previewRef.current.getBoundingClientRect()
    const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    const clamp = (n: number) => Math.max(-OFFSET_RANGE, Math.min(OFFSET_RANGE, Math.round(n * OFFSET_RANGE)))
    setOffset(clamp(relX), clamp(relY))
  }

  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Hero</h2>
      <AdminField label="Eyebrow line">
        <AdminInput value={row.eyebrow ?? ''} onChange={e => onChange({ eyebrow: e.target.value })} />
      </AdminField>
      <AdminField label="Headline (before the rotating word)" hint={'e.g. "We make companies" — the rotating word and final period are added automatically.'}>
        <AdminInput value={row.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      </AdminField>
      <AdminField label="Rotating words" hint="Comma-separated — cycles through these in the headline.">
        <AdminInput
          value={words}
          onChange={e =>
            onChange({ extra: { ...row.extra, words: e.target.value.split(',').map(w => w.trim()).filter(Boolean) } })
          }
        />
      </AdminField>
      <AdminField label="Subhead">
        <AdminTextarea value={row.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} rows={2} />
      </AdminField>
      <AdminField label="Definition line (bottom of column)">
        <AdminTextarea value={row.body ?? ''} onChange={e => onChange({ body: e.target.value })} rows={2} />
      </AdminField>

      <MediaPicker
        label="Hero image"
        mediaId={row.image_media_id}
        onChange={id => onChange({ image_media_id: id })}
      />

      <div className="mt-5">
        <span className="block text-sm font-medium text-gray-700 mb-1">Image position</span>
        <p className="text-xs text-gray-400 mb-2">Drag the dot to nudge the photo — small, bounded adjustment, safe on every screen size.</p>
        <div
          ref={previewRef}
          onPointerDown={e => {
            setDragging(true)
            ;(e.target as Element).setPointerCapture(e.pointerId)
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => setDragging(false)}
          className="relative bg-gray-100 border border-gray-300 rounded-md select-none"
          style={{ width: '220px', height: '140px', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        >
          <div
            className="absolute rounded-full bg-blue-600 border-2 border-white shadow"
            style={{
              width: '18px',
              height: '18px',
              left: `calc(50% + ${(offsetX / OFFSET_RANGE) * 50}%)`,
              top: `calc(50% + ${(offsetY / OFFSET_RANGE) * 50}%)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-500">x: {offsetX}px, y: {offsetY}px</span>
          {(offsetX !== 0 || offsetY !== 0) && (
            <button type="button" className="text-xs text-blue-600 hover:underline" onClick={() => setOffset(0, 0)}>
              Reset
            </button>
          )}
        </div>
      </div>

      {row.image_media_id && (
        <div className="mt-3 text-xs text-gray-400">
          Preview uses the same offset the public site applies —{' '}
          <PreviewThumb mediaId={row.image_media_id} offsetX={offsetX} offsetY={offsetY} />
        </div>
      )}

      <SaveBar onSave={onSave} label="Hero" />
    </AdminCard>
  )
}

/** Small live preview so the drag control's effect is visible without leaving the page. */
function PreviewThumb({ mediaId, offsetX, offsetY }: { mediaId: string; offsetX: number; offsetY: number }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    void supabase
      .from('media')
      .select('bucket, storage_path')
      .eq('id', mediaId)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return
        const row = data as { bucket: string; storage_path: string }
        setUrl(publicMediaUrl(row.bucket, row.storage_path))
      })
    return () => {
      cancelled = true
    }
  }, [mediaId])
  if (!url) return null
  return (
    <div className="mt-2 w-40 h-24 overflow-hidden rounded border border-gray-200 bg-gray-900">
      <img
        src={url}
        alt=""
        className="w-full h-full object-cover"
        style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}
      />
    </div>
  )
}
