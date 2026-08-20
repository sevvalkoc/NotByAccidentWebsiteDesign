import { useEffect, useRef, useState } from 'react'
import { supabase, publicMediaUrl } from '@/lib/supabase'
import { refreshSite } from '@/content'
import { AdminPageHeader, AdminCard, AdminField, AdminInput, AdminTextarea, AdminButton } from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

/* Homepage + Studio section editor. Reads/writes the `page_sections` rows
   seeded by supabase/migrations/0005_homepage_sections.sql (home) and
   0006_studio_sections.sql (studio), which src/lib/cms.ts's
   fetchHomeSections()/fetchStudioSections() read back on the public site.
   Each section saves independently. Hero additionally gets a drag control
   for nudging the hero photo's position — a bounded, responsive-safe
   placement adjustment (stored as a px offset in `extra`), not a freeform
   canvas. Principles/Culture are repeatable lists (title + body pairs),
   stored as extra.items since page_sections has no dedicated list columns. */

interface ListItem {
  title: string
  body: string
  meta?: string
}
interface ButtonItem {
  label: string
  url: string
}
type Extra = {
  words?: string[]
  imageOffsetX?: number
  imageOffsetY?: number
  items?: ListItem[]
  body2?: string
  waitingListNote?: string
  lastUpdated?: string
  buttons?: ButtonItem[]
}

interface SectionRow {
  id: string
  section_key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  cta_label: string | null
  cta_url: string | null
  image_media_id: string | null
  sort_order: number
  is_visible: boolean
  extra: Extra
}

const PAGES = [
  { slug: 'home', label: 'Homepage' },
  { slug: 'studio', label: 'Studio' },
  { slug: 'contact', label: 'Contact' },
  { slug: 'trainings', label: 'Trainings' },
  { slug: 'reports', label: 'Reports' },
  { slug: 'work', label: 'Work' },
  { slug: 'case-studies', label: 'Case Studies' },
  { slug: 'capabilities', label: 'Capabilities' },
  { slug: 'privacy', label: 'Privacy' },
  { slug: 'cookies', label: 'Cookies' },
]
type PageSlug = (typeof PAGES)[number]['slug']

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  capabilities: 'Capabilities',
  notes: 'Notes',
  case_studies: 'Case studies',
  final_cta: 'Final CTA',
  opening: 'Opening statement',
  principles: 'Principles',
  culture: 'Culture',
  cta: 'Final CTA',
  header: 'Page header',
  legal: 'Legal sections',
  table: 'Cookie categories',
  managing: 'Managing cookies',
  testimonials: 'Testimonials',
  clients: 'Clients',
  partners: 'Partners',
}

/** Which text fields (beyond eyebrow/title, which every section gets) apply,
 *  keyed by `${pageSlug}:${section_key}` since the same section_key (e.g.
 *  'header') means different things, with different fields, on different pages. */
const SECTION_FIELDS: Record<
  string,
  {
    subtitle?: boolean
    body?: boolean
    body2Field?: string
    titleHint?: string
    lastUpdatedField?: boolean
    ctaFields?: boolean
    imageField?: boolean
  }
> = {
  'home:final_cta': { body: true, ctaFields: true, imageField: true },
  'home:capabilities': { imageField: true },
  'studio:opening': { subtitle: true, body: true, imageField: true },
  'contact:header': { subtitle: true, body: true, body2Field: 'Second paragraph' },
  'reports:header': { subtitle: true },
  'work:header': { subtitle: true },
  'case-studies:header': { subtitle: true },
  'capabilities:header': {
    subtitle: true,
    titleHint: 'Appears after the live capability count, e.g. "42 capabilities, in the order…" — only type the part after the number.',
  },
  'privacy:header': { subtitle: true, lastUpdatedField: true, imageField: true },
  'cookies:header': { subtitle: true },
  'cookies:managing': { body: true },
}
const LIST_SECTIONS = new Set(['principles', 'culture', 'legal'])
/** These sections' actual content comes from their own tables/admin screens
 *  (Testimonials, Clients, Partners) — their page_sections row exists only
 *  to carry position and visibility, so they get a lightweight card instead
 *  of text fields that would do nothing if edited. */
const ORDER_ONLY_SECTIONS = new Set(['testimonials', 'clients', 'partners'])

export default function Pages() {
  const [activePage, setActivePage] = useState<PageSlug>('home')
  const [rows, setRows] = useState<SectionRow[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    setRows(null)
    void load(activePage)
  }, [activePage])

  async function load(slug: string) {
    if (!supabase) return
    const { data: page, error: pageError } = await supabase.from('pages').select('id').eq('slug', slug).maybeSingle()
    if (pageError || !page) {
      setError(pageError?.message ?? `No '${slug}' page row found — its migration may not have run yet.`)
      setRows([])
      return
    }
    setError('')
    const { data, error } = await supabase
      .from('page_sections')
      .select('id, section_key, eyebrow, title, subtitle, body, cta_label, cta_url, image_media_id, sort_order, is_visible, extra')
      .eq('page_id', (page as { id: string }).id)
    if (error) {
      setError(error.message)
      return
    }
    setRows(((data ?? []) as unknown as SectionRow[]).sort((a, b) => a.sort_order - b.sort_order))
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
        cta_label: row.cta_label,
        cta_url: row.cta_url,
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

  /* Reordering/visibility save immediately (no Save button) — same
   *  instant-write pattern SimpleCollection's move() uses. Only meaningful
   *  on 'home' today, since Home.tsx is the only page that reads
   *  sort_order/is_visible to decide what renders where; see
   *  src/pages/Home.tsx's SECTION_COMPONENTS + useHomeSections(). */
  async function moveSection(row: SectionRow, dir: -1 | 1) {
    if (!supabase || !rows) return
    const idx = rows.findIndex(r => r.id === row.id)
    const swapWith = rows[idx + dir]
    if (!swapWith) return
    await Promise.all([
      supabase.from('page_sections').update({ sort_order: swapWith.sort_order }).eq('id', row.id),
      supabase.from('page_sections').update({ sort_order: row.sort_order }).eq('id', swapWith.id),
    ])
    refreshSite()
    await load(activePage)
  }

  async function toggleVisible(row: SectionRow) {
    if (!supabase) return
    await supabase.from('page_sections').update({ is_visible: !row.is_visible }).eq('id', row.id)
    refreshSite()
    await load(activePage)
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
        description="Edit each page's headings, body copy and images. Changes go live immediately after Save — check the site in another tab."
      />
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {PAGES.map(p => (
          <button
            key={p.slug}
            type="button"
            onClick={() => setActivePage(p.slug)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activePage === p.slug ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">
          {rows.map((row, idx) => {
            const props = { row, onChange: (patch: Partial<SectionRow>) => patchRow(row.id, patch), onSave: () => saveRow(row) }
            const card = ORDER_ONLY_SECTIONS.has(row.section_key) ? (
              <OrderOnlyCard key={row.id} row={row} />
            ) : row.section_key === 'hero' ? (
              <HeroCard key={row.id} {...props} />
            ) : activePage === 'trainings' && row.section_key === 'header' ? (
              <TrainingsHeaderCard key={row.id} {...props} />
            ) : activePage === 'cookies' && row.section_key === 'table' ? (
              <CookiesTableCard key={row.id} {...props} />
            ) : LIST_SECTIONS.has(row.section_key) ? (
              <ListCard key={row.id} {...props} />
            ) : (
              <SectionCard key={row.id} {...props} pageSlug={activePage} />
            )
            if (activePage !== 'home') return card
            return (
              <div key={row.id}>
                <div className="flex items-center gap-3 mb-2 px-1">
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    disabled={idx === 0}
                    onClick={() => moveSection(row, -1)}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-gray-700 disabled:opacity-30"
                    disabled={idx === rows.length - 1}
                    onClick={() => moveSection(row, 1)}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <label className="flex items-center gap-1.5 text-xs text-gray-500">
                    <input type="checkbox" checked={row.is_visible} onChange={() => toggleVisible(row)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    Visible on homepage
                  </label>
                </div>
                {card}
              </div>
            )
          })}
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
  pageSlug,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
  pageSlug: PageSlug
}) {
  const fields = SECTION_FIELDS[`${pageSlug}:${row.section_key}`] ?? {}
  const label = SECTION_LABELS[row.section_key] ?? row.section_key
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{label}</h2>
      {row.eyebrow !== null && (
        <AdminField label="Eyebrow">
          <AdminInput value={row.eyebrow ?? ''} onChange={e => onChange({ eyebrow: e.target.value })} />
        </AdminField>
      )}
      <AdminField label="Heading" hint={fields.titleHint}>
        <AdminInput value={row.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      </AdminField>
      {fields.subtitle && (
        <AdminField label="Subhead">
          <AdminTextarea value={row.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} rows={2} />
        </AdminField>
      )}
      {fields.body && (
        <AdminField label="Body">
          <AdminTextarea value={row.body ?? ''} onChange={e => onChange({ body: e.target.value })} rows={3} />
        </AdminField>
      )}
      {fields.body2Field && (
        <AdminField label={fields.body2Field}>
          <AdminTextarea
            value={row.extra.body2 ?? ''}
            onChange={e => onChange({ extra: { ...row.extra, body2: e.target.value } })}
            rows={3}
          />
        </AdminField>
      )}
      {fields.lastUpdatedField && (
        <AdminField label="Last updated" hint="Shown under the intro as 'Last updated · …'.">
          <AdminInput
            value={row.extra.lastUpdated ?? ''}
            onChange={e => onChange({ extra: { ...row.extra, lastUpdated: e.target.value } })}
          />
        </AdminField>
      )}
      {fields.ctaFields && (
        <div className="grid grid-cols-2 gap-4">
          <AdminField label="Button label">
            <AdminInput value={row.cta_label ?? ''} onChange={e => onChange({ cta_label: e.target.value })} />
          </AdminField>
          <AdminField label="Button link" hint="A path like /contact, or a full https:// URL.">
            <AdminInput value={row.cta_url ?? ''} onChange={e => onChange({ cta_url: e.target.value })} />
          </AdminField>
        </div>
      )}
      {fields.imageField && (
        <div className="mb-4">
          <MediaPicker label="Image (optional — leave empty for no image)" mediaId={row.image_media_id} onChange={id => onChange({ image_media_id: id })} />
        </div>
      )}
      <SaveBar onSave={onSave} label={label} />
    </AdminCard>
  )
}

/** Testimonials/Clients/Partners on the homepage: content lives in their own
 *  tables and admin screens — this card only explains that and lets the
 *  reorder/visibility toolbar (rendered by the parent) do its job. */
function OrderOnlyCard({ row }: { row: SectionRow }) {
  const label = SECTION_LABELS[row.section_key] ?? row.section_key
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-2">{label}</h2>
      <p className="text-sm text-gray-500">
        Content for this section is managed on its own screen — <strong>{label}</strong> in the sidebar. This card only
        controls where it sits on the homepage and whether it's shown, via the arrows and checkbox above.
      </p>
    </AdminCard>
  )
}

/** Shared add/reorder/remove editor for a repeatable title+body(+meta) list,
 *  stored as extra.items. Used by ListCard (Principles/Culture/Privacy's
 *  legal sections), TrainingsHeaderCard (Format) and CookiesTableCard. */
function ItemsEditor({
  items,
  onChange,
  titlePlaceholder = 'Title',
  bodyPlaceholder = 'Body',
  metaLabel,
}: {
  items: ListItem[]
  onChange: (items: ListItem[]) => void
  titlePlaceholder?: string
  metaLabel?: string
  bodyPlaceholder?: string
}) {
  function updateItem(i: number, patch: Partial<ListItem>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)))
  }
  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i))
  }
  function moveItem(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-md p-3">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <AdminInput
                value={item.title}
                onChange={e => updateItem(i, { title: e.target.value })}
                placeholder={titlePlaceholder}
                className="mb-2"
              />
              <AdminTextarea value={item.body} onChange={e => updateItem(i, { body: e.target.value })} rows={2} placeholder={bodyPlaceholder} />
              {metaLabel && (
                <AdminInput
                  value={item.meta ?? ''}
                  onChange={e => updateItem(i, { meta: e.target.value })}
                  placeholder={metaLabel}
                  className="mt-2"
                />
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button type="button" className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30" disabled={i === 0} onClick={() => moveItem(i, -1)}>
                ↑
              </button>
              <button type="button" className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30" disabled={i === items.length - 1} onClick={() => moveItem(i, 1)}>
                ↓
              </button>
              <button type="button" className="text-xs text-red-500 hover:text-red-700" onClick={() => removeItem(i)}>
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
      <AdminButton type="button" variant="secondary" onClick={() => onChange([...items, { title: '', body: '' }])}>
        + Add item
      </AdminButton>
    </div>
  )
}

/** Add/reorder/remove editor for a list of label+link buttons. Used by
 *  HeroCard today; any other section that gets its own button(s) beyond a
 *  single cta_label/cta_url pair can reuse it. */
function ButtonsEditor({ buttons, onChange }: { buttons: ButtonItem[]; onChange: (buttons: ButtonItem[]) => void }) {
  function update(i: number, patch: Partial<ButtonItem>) {
    onChange(buttons.map((b, idx) => (idx === i ? { ...b, ...patch } : b)))
  }
  function remove(i: number) {
    onChange(buttons.filter((_, idx) => idx !== i))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= buttons.length) return
    const next = [...buttons]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      {buttons.map((b, i) => (
        <div key={i} className="flex items-center gap-2">
          <AdminInput value={b.label} onChange={e => update(i, { label: e.target.value })} placeholder="Label" className="flex-1" />
          <AdminInput value={b.url} onChange={e => update(i, { url: e.target.value })} placeholder="/path or https://…" className="flex-1" />
          <button type="button" className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)}>
            ↑
          </button>
          <button type="button" className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30" disabled={i === buttons.length - 1} onClick={() => move(i, 1)}>
            ↓
          </button>
          <button type="button" className="text-xs text-red-500 hover:text-red-700" onClick={() => remove(i)}>
            ✕
          </button>
        </div>
      ))}
      <AdminButton type="button" variant="secondary" onClick={() => onChange([...buttons, { label: '', url: '' }])}>
        + Add button
      </AdminButton>
    </div>
  )
}

function ListCard({
  row,
  onChange,
  onSave,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
}) {
  const items = row.extra.items ?? []
  const label = SECTION_LABELS[row.section_key] ?? row.section_key
  const showTitle = row.section_key === 'culture' // Principles has no section heading, just the list; Culture does.

  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{label}</h2>
      <AdminField label="Eyebrow">
        <AdminInput value={row.eyebrow ?? ''} onChange={e => onChange({ eyebrow: e.target.value })} />
      </AdminField>
      {showTitle && (
        <AdminField label="Heading">
          <AdminInput value={row.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
        </AdminField>
      )}

      <div className="mt-4">
        <ItemsEditor items={items} onChange={next => onChange({ extra: { ...row.extra, items: next } })} />
      </div>

      <SaveBar onSave={onSave} label={label} />
    </AdminCard>
  )
}

function TrainingsHeaderCard({
  row,
  onChange,
  onSave,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
}) {
  const items = row.extra.items ?? []
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Trainings page</h2>
      <AdminField label="Eyebrow">
        <AdminInput value={row.eyebrow ?? ''} onChange={e => onChange({ eyebrow: e.target.value })} />
      </AdminField>
      <AdminField label="Heading">
        <AdminInput value={row.title ?? ''} onChange={e => onChange({ title: e.target.value })} />
      </AdminField>
      <AdminField label="Subhead">
        <AdminTextarea value={row.subtitle ?? ''} onChange={e => onChange({ subtitle: e.target.value })} rows={2} />
      </AdminField>
      <AdminField label="Body — first paragraph">
        <AdminTextarea value={row.body ?? ''} onChange={e => onChange({ body: e.target.value })} rows={2} />
      </AdminField>
      <AdminField label="Body — second paragraph">
        <AdminTextarea
          value={row.extra.body2 ?? ''}
          onChange={e => onChange({ extra: { ...row.extra, body2: e.target.value } })}
          rows={2}
        />
      </AdminField>
      <AdminField label="Waiting list note">
        <AdminTextarea
          value={row.extra.waitingListNote ?? ''}
          onChange={e => onChange({ extra: { ...row.extra, waitingListNote: e.target.value } })}
          rows={2}
        />
      </AdminField>

      <div className="mt-4">
        <span className="block text-sm font-medium text-gray-700 mb-2">Format details</span>
        <ItemsEditor
          items={items}
          onChange={next => onChange({ extra: { ...row.extra, items: next } })}
          titlePlaceholder="Label (e.g. Format)"
          bodyPlaceholder="Value (e.g. In-person workshop, two days)"
        />
      </div>

      <SaveBar onSave={onSave} label="Trainings page" />
    </AdminCard>
  )
}

function CookiesTableCard({
  row,
  onChange,
  onSave,
}: {
  row: SectionRow
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => void
}) {
  const items = row.extra.items ?? []
  return (
    <AdminCard className="p-6">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Cookie categories</h2>
      <p className="text-xs text-gray-400 mb-4">Each row: name, what it does, and its lifespan.</p>
      <ItemsEditor
        items={items}
        onChange={next => onChange({ extra: { ...row.extra, items: next } })}
        titlePlaceholder="Category name (e.g. Essential)"
        bodyPlaceholder="What it does"
        metaLabel="Lifespan (e.g. 12 months)"
      />
      <SaveBar onSave={onSave} label="Cookie categories" />
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

      <div className="mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Buttons</span>
        <p className="text-xs text-gray-400 mb-2">The first button is styled solid, the rest outlined — reorder to change which one stands out.</p>
        <ButtonsEditor
          buttons={row.extra.buttons ?? []}
          onChange={next => onChange({ extra: { ...row.extra, buttons: next } })}
        />
      </div>

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
