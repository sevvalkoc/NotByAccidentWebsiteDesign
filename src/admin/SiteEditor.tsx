import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { refreshSite } from '@/content'
import { AdminPageHeader, AdminCard, AdminField, AdminInput, AdminTextarea, AdminButton, AdminCheckbox, AdminSelect } from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

/* Editor for the new site's pages: the `next/*` rows in `pages` and their
   `page_sections` (seeded by migration 0010, read back by fetchPages() in
   src/lib/cms.ts). The previous site keeps its own slugs and its own editor
   (Admin → Pages, previous site), so nothing here can touch it.

   Each section is described by a small schema: which plain columns it uses
   and which structured values live in `extra` (project picks, practice
   areas, a chosen testimonial…). Sections without a schema get the generic
   field set, so a section added later is still editable. Every Save writes
   to Supabase and checks that a row actually changed; nothing is local. */

type Item = { title: string; body: string; meta?: string }
type Area = { key: string; label?: string; text?: string }

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
  video_url: string | null
  sort_order: number
  is_visible: boolean
  extra: Record<string, unknown> & { items?: Item[] }
}

interface PageRow {
  id: string
  slug: string
  title: string
  seo_title: string | null
  seo_description: string | null
  og_title: string | null
  og_description: string | null
  og_media_id: string | null
  canonical_url: string | null
  noindex: boolean
}

type Col = 'eyebrow' | 'title' | 'subtitle' | 'body' | 'cta' | 'image' | 'video' | 'items'
type ExtraField =
  | { key: string; label: string; type: 'text' | 'textarea' | 'words'; hint?: string }
  | { key: string; label: string; type: 'projects' | 'notes'; max: number; hint?: string }
  | { key: string; label: string; type: 'testimonial' | 'areas'; hint?: string }
type Schema = {
  label: string
  cols: Col[]
  extra?: ExtraField[]
  hints?: Partial<Record<Col, string>>
  itemsLabel?: string
  itemsMeta?: string
}

const GENERIC: Schema = {
  label: '',
  cols: ['eyebrow', 'title', 'subtitle', 'body', 'cta', 'image', 'items'],
}
const EMPH = 'Wrap a word in *asterisks* to set it in italic.'

const SCHEMAS: Record<string, Record<string, Schema>> = {
  home: {
    hero: {
      label: 'Hero',
      cols: ['eyebrow', 'title', 'subtitle', 'cta', 'image', 'video'],
      hints: {
        eyebrow: 'Small metadata line above the headline.',
        title: `One sharp line. ${EMPH}`,
        subtitle: 'Compact positioning statement.',
        video: 'Optional. A video URL replaces the image (the image becomes its poster).',
      },
      extra: [
        { key: 'cta2Label', label: 'Second button label', type: 'text' },
        { key: 'cta2Url', label: 'Second button link', type: 'text' },
        {
          key: 'words',
          label: 'Rotating words',
          type: 'words',
          hint: 'Comma-separated. They take turns with the *emphasised* word in the heading, e.g. chosen, remembered, recommended. Leave empty to keep the heading still.',
        },
      ],
    },
    work: {
      label: 'Selected work',
      cols: ['eyebrow', 'title', 'cta'],
      extra: [
        {
          key: 'projects',
          label: 'Projects, in order',
          type: 'projects',
          max: 5,
          hint: 'Three to five. Only published projects appear on the site.',
        },
      ],
    },
    practice: {
      label: 'Practice areas',
      cols: ['eyebrow', 'title', 'cta'],
      extra: [
        {
          key: 'areas',
          label: 'Areas',
          type: 'areas',
          hint: 'Three to five. Each links to its group on /capabilities.',
        },
      ],
    },
    evidence: {
      label: 'Testimonials',
      cols: ['eyebrow'],
      extra: [
        {
          key: 'testimonial',
          label: 'Start with',
          type: 'testimonial',
          hint: 'Every active testimonial (Admin → Testimonials) is shown with arrows; this one comes first. The figures beside them come from the selected projects.',
        },
      ],
    },
    studio: {
      label: 'Studio statement',
      cols: ['eyebrow', 'title', 'body', 'cta', 'image', 'video'],
    },
    notes: {
      label: 'Featured notes',
      cols: ['eyebrow', 'title', 'cta'],
      extra: [
        {
          key: 'notes',
          label: 'Notes, in order',
          type: 'notes',
          max: 3,
          hint: 'Leave empty to show the three most recent.',
        },
      ],
    },
    contact: {
      label: 'Contact',
      cols: ['eyebrow', 'title', 'body', 'cta'],
      hints: { title: EMPH, body: 'Short line next to the email address.' },
    },
  },
  global: {
    footer: {
      label: 'Footer',
      cols: ['title', 'body'],
      hints: { title: 'Closing line.', body: 'Newsletter invitation.' },
      extra: [
        { key: 'lastLine', label: 'Last line', type: 'text' },
        { key: 'lastLink', label: 'Last line, linked word', type: 'text' },
      ],
    },
    announcement: {
      label: 'Announcement bar',
      cols: ['title', 'cta'],
      hints: { title: 'Shown above the header while this section is visible.' },
    },
    header_nav: {
      label: 'Header menu',
      cols: ['items'],
      itemsLabel: 'Links (label, URL)',
      hints: { items: 'Title is the label, Body is the URL (/work, https://…).' },
    },
    footer_nav: {
      label: 'Footer menu',
      cols: ['items'],
      itemsLabel: 'Links (label, URL)',
      hints: { items: 'Title is the label, Body is the URL.' },
    },
  },
}

const COL_LABEL: Record<Exclude<Col, 'cta' | 'image' | 'video' | 'items'>, string> = {
  eyebrow: 'Eyebrow',
  title: 'Heading',
  subtitle: 'Subheading',
  body: 'Body',
}

type Lookups = {
  projects: { slug: string; title: string; status: string }[]
  notes: { slug: string; title: string; status: string }[]
  testimonials: { name: string; company: string | null }[]
  categories: { key: string; label: string }[]
}

const CHECK = 'Nothing was saved. Your account may not have write access; check Admin → Users, or sign in again.'

export default function SiteEditor({ slug, title, description }: { slug: string; title: string; description: string }) {
  const [page, setPage] = useState<PageRow | null>(null)
  const [rows, setRows] = useState<SectionRow[] | null>(null)
  const [lookups, setLookups] = useState<Lookups>({
    projects: [],
    notes: [],
    testimonials: [],
    categories: [],
  })
  const [error, setError] = useState('')

  async function load() {
    if (!supabase) return
    setRows(null)
    const { data: p, error: pe } = await supabase
      .from('pages')
      .select('id, slug, title, seo_title, seo_description, og_title, og_description, og_media_id, canonical_url, noindex')
      .eq('slug', `next/${slug}`)
      .maybeSingle()
    if (pe || !p) {
      setError(pe?.message ?? `No 'next/${slug}' page found. Run supabase/migrations/0010_next_site.sql.`)
      setRows([])
      return
    }
    setPage(p as unknown as PageRow)
    const { data, error: se } = await supabase
      .from('page_sections')
      .select('id, section_key, eyebrow, title, subtitle, body, cta_label, cta_url, image_media_id, video_url, sort_order, is_visible, extra')
      .eq('page_id', (p as { id: string }).id)
    if (se) return setError(se.message)
    setError('')
    setRows(((data ?? []) as unknown as SectionRow[]).map(r => ({ ...r, extra: r.extra ?? {} })).sort((a, b) => a.sort_order - b.sort_order))
  }

  useEffect(() => {
    void load()
    if (!supabase) return
    const sb = supabase
    void Promise.all([
      sb.from('projects').select('slug, title, status').order('sort_order'),
      sb.from('articles').select('slug, title, status').order('published_at', { ascending: false }),
      sb.from('testimonials').select('person_name, company').order('sort_order'),
      sb.from('category_meta').select('key, label').order('sort_order'),
    ]).then(([pr, ar, te, ca]) =>
      setLookups({
        projects: (pr.data ?? []) as Lookups['projects'],
        notes: (ar.data ?? []) as Lookups['notes'],
        testimonials: ((te.data ?? []) as { person_name: string; company: string | null }[]).map(t => ({ name: t.person_name, company: t.company })),
        categories: (ca.data ?? []) as Lookups['categories'],
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function saveRow(row: SectionRow) {
    if (!supabase) return false
    const { data, error } = await supabase
      .from('page_sections')
      .update({
        eyebrow: row.eyebrow,
        title: row.title,
        subtitle: row.subtitle,
        body: row.body,
        cta_label: row.cta_label,
        cta_url: row.cta_url,
        image_media_id: row.image_media_id,
        video_url: row.video_url || null,
        extra: row.extra,
      })
      .eq('id', row.id)
      .select('id')
    if (error) return setError(error.message), false
    if (!data?.length) return setError(CHECK), false
    setError('')
    refreshSite()
    return true
  }

  async function toggleVisible(row: SectionRow) {
    if (!supabase) return
    const { data, error } = await supabase.from('page_sections').update({ is_visible: !row.is_visible }).eq('id', row.id).select('id')
    if (error) setError(error.message)
    else if (!data?.length) setError(CHECK)
    else setRows(rs => rs && rs.map(r => (r.id === row.id ? { ...r, is_visible: !r.is_visible } : r)))
    refreshSite()
  }

  async function savePage(p: PageRow) {
    if (!supabase) return false
    const { data, error } = await supabase
      .from('pages')
      .update({
        seo_title: p.seo_title || null,
        seo_description: p.seo_description || null,
        og_title: p.og_title || null,
        og_description: p.og_description || null,
        og_media_id: p.og_media_id,
        canonical_url: p.canonical_url || null,
        noindex: p.noindex,
      })
      .eq('id', p.id)
      .select('id')
    if (error) return setError(error.message), false
    if (!data?.length) return setError(CHECK), false
    setError('')
    refreshSite()
    return true
  }

  if (!supabase) {
    return (
      <div>
        <AdminPageHeader title={title} description={description} />
        <p className="text-sm text-gray-400">Not connected to Supabase.</p>
      </div>
    )
  }

  const schemas = SCHEMAS[slug] ?? {}
  return (
    <div>
      <AdminPageHeader title={title} description={description} />
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-2xl">
          {rows.map(row => (
            <SectionCard
              key={row.id}
              row={row}
              schema={schemas[row.section_key] ?? { ...GENERIC, label: pretty(row.section_key) }}
              lookups={lookups}
              onChange={patch => setRows(rs => rs && rs.map(r => (r.id === row.id ? { ...r, ...patch } : r)))}
              onSave={() => saveRow(rows.find(r => r.id === row.id)!)}
              onToggle={() => toggleVisible(row)}
            />
          ))}
          {page && slug !== 'global' ? <SeoCard page={page} verbatim={slug === 'home'} onChange={patch => setPage({ ...page, ...patch })} onSave={() => savePage(page)} /> : null}
        </div>
      )}
    </div>
  )
}

const pretty = (k: string) => k.replace(/[_-]/g, ' ').replace(/^\w/, c => c.toUpperCase())

function SaveBar({ onSave }: { onSave: () => Promise<boolean> }) {
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'failed'>('idle')
  return (
    <div className="flex items-center gap-3 pt-2">
      <AdminButton
        type="button"
        disabled={state === 'saving'}
        onClick={async () => {
          setState('saving')
          setState((await onSave()) ? 'saved' : 'failed')
        }}
      >
        {state === 'saving' ? 'Saving…' : 'Save'}
      </AdminButton>
      {state === 'saved' && <span className="text-xs text-green-700">Saved. Live on the site now.</span>}
      {state === 'failed' && <span className="text-xs text-red-600">Not saved.</span>}
    </div>
  )
}

function SectionCard({
  row,
  schema,
  lookups,
  onChange,
  onSave,
  onToggle,
}: {
  row: SectionRow
  schema: Schema
  lookups: Lookups
  onChange: (patch: Partial<SectionRow>) => void
  onSave: () => Promise<boolean>
  onToggle: () => void
}) {
  const has = (c: Col) => schema.cols.includes(c)
  const setExtra = (key: string, value: unknown) => onChange({ extra: { ...row.extra, [key]: value } })
  const hint = (c: Col) => schema.hints?.[c]
  return (
    <section data-section={row.section_key} aria-label={schema.label}>
      <AdminCard className={`p-5 ${row.is_visible ? '' : 'opacity-70'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">{schema.label}</h2>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input type="checkbox" checked={row.is_visible} onChange={onToggle} />
            Visible
          </label>
        </div>
        {(['eyebrow', 'title', 'subtitle', 'body'] as const).filter(has).map(c => (
          <AdminField key={c} label={COL_LABEL[c]} hint={hint(c)}>
            {c === 'body' || c === 'subtitle' ? (
              <AdminTextarea rows={c === 'body' ? 4 : 2} value={row[c] ?? ''} onChange={e => onChange({ [c]: e.target.value })} />
            ) : (
              <AdminInput value={row[c] ?? ''} onChange={e => onChange({ [c]: e.target.value })} />
            )}
          </AdminField>
        ))}
        {has('cta') && (
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Button label">
              <AdminInput value={row.cta_label ?? ''} onChange={e => onChange({ cta_label: e.target.value })} />
            </AdminField>
            <AdminField label="Button link" hint="/path, #anchor, mailto: or https://">
              <AdminInput value={row.cta_url ?? ''} onChange={e => onChange({ cta_url: e.target.value })} />
            </AdminField>
          </div>
        )}
        {has('image') && (
          <div className="mb-4">
            <MediaPicker mediaId={row.image_media_id} onChange={id => onChange({ image_media_id: id })} label="Image" />
          </div>
        )}
        {has('video') && (
          <AdminField label="Video URL" hint={hint('video') ?? 'Optional. MP4/WebM URL; replaces the image.'}>
            <AdminInput value={row.video_url ?? ''} onChange={e => onChange({ video_url: e.target.value })} placeholder="https://…/clip.mp4" />
          </AdminField>
        )}
        {has('items') && (
          <ItemsEditor label={schema.itemsLabel ?? 'Items'} hint={hint('items')} items={row.extra.items ?? []} onChange={items => setExtra('items', items)} />
        )}
        {schema.extra?.map(f => <ExtraEditor key={f.key} field={f} value={row.extra[f.key]} lookups={lookups} onChange={v => setExtra(f.key, v)} />)}
        <SaveBar onSave={onSave} />
      </AdminCard>
    </section>
  )
}

function ItemsEditor({ label, hint, items, onChange }: { label: string; hint?: string; items: Item[]; onChange: (items: Item[]) => void }) {
  const set = (i: number, patch: Partial<Item>) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const move = (i: number, d: number) => {
    const next = [...items]
    const [it] = next.splice(i, 1)
    next.splice(i + d, 0, it!)
    onChange(next)
  }
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
      {hint && <p className="text-xs text-gray-400 mb-2">{hint}</p>}
      <ol className="flex flex-col gap-3">
        {items.map((it, i) => (
          <li key={i} className="border border-gray-200 rounded-md p-3">
            <AdminInput
              aria-label={`${label} ${i + 1} title`}
              value={it.title}
              onChange={e => set(i, { title: e.target.value })}
              placeholder="Title"
              className="mb-2"
            />
            <AdminTextarea aria-label={`${label} ${i + 1} body`} rows={2} value={it.body} onChange={e => set(i, { body: e.target.value })} placeholder="Body" />
            <div className="flex gap-2 mt-2">
              <AdminButton type="button" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                ↑
              </AdminButton>
              <AdminButton type="button" variant="ghost" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                ↓
              </AdminButton>
              <AdminButton type="button" variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                Remove
              </AdminButton>
            </div>
          </li>
        ))}
      </ol>
      <AdminButton type="button" variant="secondary" className="mt-2" onClick={() => onChange([...items, { title: '', body: '' }])}>
        Add item
      </AdminButton>
    </div>
  )
}

function ExtraEditor({ field, value, lookups, onChange }: { field: ExtraField; value: unknown; lookups: Lookups; onChange: (v: unknown) => void }) {
  if (field.type === 'words') {
    return <WordsField field={field} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
  }
  if (field.type === 'text' || field.type === 'textarea') {
    const v = typeof value === 'string' ? value : ''
    return (
      <AdminField label={field.label} hint={field.hint}>
        {field.type === 'text' ? (
          <AdminInput value={v} onChange={e => onChange(e.target.value)} />
        ) : (
          <AdminTextarea value={v} onChange={e => onChange(e.target.value)} />
        )}
      </AdminField>
    )
  }
  if (field.type === 'testimonial') {
    return (
      <AdminField label={field.label} hint={field.hint}>
        <AdminSelect value={typeof value === 'string' ? value : ''} onChange={e => onChange(e.target.value)}>
          <option value="">First active testimonial</option>
          {lookups.testimonials.map(t => (
            <option key={t.name} value={t.name}>
              {t.name}
              {t.company ? `, ${t.company}` : ''}
            </option>
          ))}
        </AdminSelect>
      </AdminField>
    )
  }
  if (field.type === 'areas') {
    const areas = Array.isArray(value) ? (value as Area[]) : []
    const set = (i: number, patch: Partial<Area>) => onChange(areas.map((a, j) => (j === i ? { ...a, ...patch } : a)))
    return (
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-1">{field.label}</p>
        {field.hint && <p className="text-xs text-gray-400 mb-2">{field.hint}</p>}
        <ol className="flex flex-col gap-3">
          {areas.map((a, i) => (
            <li key={i} className="border border-gray-200 rounded-md p-3 grid gap-2">
              <AdminSelect aria-label={`Area ${i + 1} group`} value={a.key} onChange={e => set(i, { key: e.target.value })}>
                {lookups.categories.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </AdminSelect>
              <AdminInput aria-label={`Area ${i + 1} label`} value={a.label ?? ''} onChange={e => set(i, { label: e.target.value })} placeholder="Label" />
              <AdminInput aria-label={`Area ${i + 1} line`} value={a.text ?? ''} onChange={e => set(i, { text: e.target.value })} placeholder="One line" />
              <AdminButton type="button" variant="ghost" onClick={() => onChange(areas.filter((_, j) => j !== i))}>
                Remove
              </AdminButton>
            </li>
          ))}
        </ol>
        {areas.length < 5 && (
          <AdminButton
            type="button"
            variant="secondary"
            className="mt-2"
            onClick={() => onChange([...areas, { key: lookups.categories[0]?.key ?? '', label: '', text: '' }])}
          >
            Add area
          </AdminButton>
        )}
      </div>
    )
  }
  // projects / notes: an ordered pick-list of slugs.
  const options = field.type === 'projects' ? lookups.projects : lookups.notes
  const picked = Array.isArray(value) ? (value as string[]) : []
  const move = (i: number, d: number) => {
    const next = [...picked]
    const [s] = next.splice(i, 1)
    next.splice(i + d, 0, s!)
    onChange(next)
  }
  return (
    <div className="mb-4">
      <p className="text-sm font-medium text-gray-700 mb-1">{field.label}</p>
      {field.hint && <p className="text-xs text-gray-400 mb-2">{field.hint}</p>}
      <ol className="flex flex-col gap-1 mb-2">
        {picked.map((s, i) => {
          const o = options.find(x => x.slug === s)
          return (
            <li key={s} className="flex items-center gap-2 text-sm border border-gray-200 rounded-md px-3 py-1.5">
              <span className="flex-1">
                {o?.title ?? s}
                {o && o.status !== 'published' ? <span className="ml-2 text-xs text-yellow-700">({o.status}, hidden on site)</span> : null}
              </span>
              <AdminButton type="button" variant="ghost" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                ↑
              </AdminButton>
              <AdminButton type="button" variant="ghost" disabled={i === picked.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                ↓
              </AdminButton>
              <AdminButton type="button" variant="ghost" onClick={() => onChange(picked.filter(x => x !== s))}>
                Remove
              </AdminButton>
            </li>
          )
        })}
      </ol>
      {picked.length < (field as { max: number }).max && (
        <AdminSelect aria-label={`Add to ${field.label}`} value="" onChange={e => e.target.value && onChange([...picked, e.target.value])}>
          <option value="">Add…</option>
          {options
            .filter(o => !picked.includes(o.slug))
            .map(o => (
              <option key={o.slug} value={o.slug}>
                {o.title}
                {o.status !== 'published' ? ` (${o.status})` : ''}
              </option>
            ))}
        </AdminSelect>
      )}
    </div>
  )
}

function SeoCard({ page, verbatim, onChange, onSave }: { page: PageRow; verbatim: boolean; onChange: (p: Partial<PageRow>) => void; onSave: () => Promise<boolean> }) {
  const t = page.seo_title ?? ''
  const d = page.seo_description ?? ''
  return (
    <section data-section="seo" aria-label="SEO">
      <AdminCard className="p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">SEO</h2>
        <p className="text-xs text-gray-400 mb-4">Empty fields fall back to the built-in defaults, then to Admin → SEO.</p>
        <AdminField
          label="SEO title"
          hint={
            verbatim
              ? `${t.length} characters. Used exactly as written; aim for under 60.`
              : `${t.length} characters. “ · Not by Accident” is added automatically; aim for under 60 in total.`
          }
        >
          <AdminInput value={t} onChange={e => onChange({ seo_title: e.target.value })} />
        </AdminField>
        <AdminField label="Meta description" hint={`${d.length} characters. Aim for 120–160.`}>
          <AdminTextarea rows={3} value={d} onChange={e => onChange({ seo_description: e.target.value })} />
        </AdminField>
        <AdminField label="Social title" hint="Open Graph / X. Defaults to the SEO title.">
          <AdminInput value={page.og_title ?? ''} onChange={e => onChange({ og_title: e.target.value })} />
        </AdminField>
        <AdminField label="Social description" hint="Defaults to the meta description.">
          <AdminTextarea rows={2} value={page.og_description ?? ''} onChange={e => onChange({ og_description: e.target.value })} />
        </AdminField>
        <div className="mb-4">
          <MediaPicker mediaId={page.og_media_id} onChange={id => onChange({ og_media_id: id })} label="Social image (1200×630)" />
        </div>
        <AdminField label="Canonical URL" hint="Leave empty to use this page's own URL.">
          <AdminInput value={page.canonical_url ?? ''} onChange={e => onChange({ canonical_url: e.target.value })} placeholder="https://notbyaccident.com/…" />
        </AdminField>
        <AdminCheckbox label="Hide from search engines (noindex)" checked={page.noindex} onChange={e => onChange({ noindex: e.target.checked })} />
        <SaveBar onSave={onSave} />
      </AdminCard>
    </section>
  )
}

/** A short list typed as comma-separated text. Kept as typed while editing,
 *  so a trailing comma doesn't vanish under the cursor. */
function WordsField({ field, value, onChange }: { field: { label: string; hint?: string }; value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState(value.join(', '))
  return (
    <AdminField label={field.label} hint={field.hint}>
      <AdminInput
        value={text}
        onChange={e => {
          setText(e.target.value)
          onChange(
            e.target.value
              .split(',')
              .map(w => w.trim())
              .filter(Boolean),
          )
        }}
      />
    </AdminField>
  )
}
