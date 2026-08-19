import type { ArticleBlock } from '@/lib/database.types'
import { AdminButton, AdminInput, AdminTextarea, AdminSelect } from '@/admin/ui'
import MediaPicker from '@/admin/MediaPicker'

/* A structured block editor, not free-form rich text: editors choose a
   block TYPE and fill its text — typography always comes from the design
   system when the article renders, never from ad-hoc formatting choices
   made here. */
const BLOCK_TYPES: { value: ArticleBlock['type']; label: string }[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h2', label: 'Heading (H2)' },
  { value: 'h3', label: 'Heading (H3)' },
  { value: 'quote', label: 'Pull quote' },
  { value: 'list', label: 'List' },
  { value: 'image', label: 'Image' },
  { value: 'callout', label: 'Callout' },
  { value: 'divider', label: 'Divider' },
  { value: 'embed', label: 'Video embed (URL)' },
]

export default function BlockEditor({ blocks, onChange }: { blocks: ArticleBlock[]; onChange: (b: ArticleBlock[]) => void }) {
  function update(i: number, next: ArticleBlock) {
    onChange(blocks.map((b, idx) => (idx === i ? next : b)))
  }
  function remove(i: number) {
    onChange(blocks.filter((_, idx) => idx !== i))
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  function addBlock(type: ArticleBlock['type']) {
    const fresh: ArticleBlock =
      type === 'list'
        ? { type: 'list', ordered: false, items: [''] }
        : type === 'image'
          ? { type: 'image', mediaId: '', caption: '' }
          : type === 'divider'
            ? { type: 'divider' }
            : type === 'embed'
              ? { type: 'embed', url: '' }
              : ({ type, text: '' } as ArticleBlock)
    onChange([...blocks, fresh])
  }

  return (
    <div>
      <div className="space-y-3">
        {blocks.map((block, i) => (
          <div key={i} className="border border-gray-200 rounded-md p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {BLOCK_TYPES.find(t => t.value === block.type)?.label}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === blocks.length - 1} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30">↓</button>
                <button onClick={() => remove(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
              </div>
            </div>

            {(block.type === 'paragraph' || block.type === 'h2' || block.type === 'h3' || block.type === 'quote' || block.type === 'callout') && (
              <AdminTextarea
                rows={block.type === 'paragraph' ? 4 : 2}
                value={block.text}
                onChange={e => update(i, { ...block, text: e.target.value })}
                placeholder="Text…"
              />
            )}

            {block.type === 'list' && (
              <div>
                <label className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                  <input type="checkbox" checked={block.ordered} onChange={e => update(i, { ...block, ordered: e.target.checked })} />
                  Numbered
                </label>
                {block.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 mb-1">
                    <AdminInput
                      value={item}
                      onChange={e => {
                        const items = [...block.items]
                        items[j] = e.target.value
                        update(i, { ...block, items })
                      }}
                    />
                    <button
                      onClick={() => update(i, { ...block, items: block.items.filter((_, k) => k !== j) })}
                      className="text-xs text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <AdminButton type="button" variant="ghost" onClick={() => update(i, { ...block, items: [...block.items, ''] })}>
                  + Item
                </AdminButton>
              </div>
            )}

            {block.type === 'image' && (
              <div>
                <MediaPicker label="" mediaId={block.mediaId || null} onChange={v => update(i, { ...block, mediaId: v ?? '' })} />
                <AdminInput
                  className="mt-2"
                  placeholder="Caption (optional)"
                  value={block.caption ?? ''}
                  onChange={e => update(i, { ...block, caption: e.target.value })}
                />
              </div>
            )}

            {block.type === 'embed' && (
              <AdminInput
                type="url"
                placeholder="https://…"
                value={block.url}
                onChange={e => update(i, { ...block, url: e.target.value })}
              />
            )}

            {block.type === 'divider' && <p className="text-xs text-gray-400">— divider —</p>}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <AdminSelect
          defaultValue=""
          onChange={e => {
            if (e.target.value) addBlock(e.target.value as ArticleBlock['type'])
            e.target.value = ''
          }}
          className="w-auto"
        >
          <option value="" disabled>+ Add block…</option>
          {BLOCK_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </AdminSelect>
      </div>
    </div>
  )
}
