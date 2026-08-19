import { useEffect, useRef, useState } from 'react'
import { supabase, publicMediaUrl } from '@/lib/supabase'
import { AdminButton, AdminInput, ConfirmButton } from '@/admin/ui'

interface GalleryItem {
  id: string
  caption: string | null
  sort_order: number
  media: { id: string; bucket: string; storage_path: string; alt_text: string | null } | null
}

/** Gallery image management for a project — upload, caption, reorder, remove. */
export default function GalleryManager({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<GalleryItem[] | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    if (!supabase) return
    const { data } = await supabase
      .from('project_media')
      .select('id, caption, sort_order, media:media_id ( id, bucket, storage_path, alt_text )')
      .eq('project_id', projectId)
      .eq('kind', 'gallery')
      .order('sort_order', { ascending: true })
    setItems((data as unknown as GalleryItem[]) ?? [])
  }
  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  async function handleFiles(files: FileList) {
    if (!supabase) return
    setUploading(true)
    let nextOrder = items?.length ?? 0
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext ? `.${ext}` : ''}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file)
      if (upErr) continue
      const { data: mediaRow } = await supabase
        .from('media')
        .insert({ bucket: 'media', storage_path: path, file_type: 'image', file_name: file.name, mime_type: file.type, file_size_bytes: file.size })
        .select('id')
        .single()
      if (!mediaRow) continue
      await supabase.from('project_media').insert({
        project_id: projectId,
        media_id: (mediaRow as { id: string }).id,
        kind: 'gallery',
        sort_order: nextOrder++,
      })
    }
    setUploading(false)
    await load()
  }

  async function updateCaption(id: string, caption: string) {
    if (!supabase) return
    await supabase.from('project_media').update({ caption }).eq('id', id)
  }

  async function remove(id: string) {
    if (!supabase) return
    await supabase.from('project_media').delete().eq('id', id)
    await load()
  }

  async function move(item: GalleryItem, direction: -1 | 1) {
    if (!supabase || !items) return
    const idx = items.findIndex(i => i.id === item.id)
    const swap = items[idx + direction]
    if (!swap) return
    await Promise.all([
      supabase.from('project_media').update({ sort_order: swap.sort_order }).eq('id', item.id),
      supabase.from('project_media').update({ sort_order: item.sort_order }).eq('id', swap.id),
    ])
    await load()
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Gallery</p>
      {items === null ? (
        <p className="text-xs text-gray-400">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
          {items.map((item, i) => (
            <div key={item.id} className="border border-gray-200 rounded-md overflow-hidden">
              {item.media && (
                <img
                  src={publicMediaUrl(item.media.bucket, item.media.storage_path)}
                  alt={item.media.alt_text ?? ''}
                  className="w-full h-28 object-cover"
                />
              )}
              <div className="p-2">
                <AdminInput
                  placeholder="Caption"
                  defaultValue={item.caption ?? ''}
                  onBlur={e => updateCaption(item.id, e.target.value)}
                  className="text-xs mb-1"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button onClick={() => move(item, -1)} disabled={i === 0} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30">↑</button>
                    <button onClick={() => move(item, 1)} disabled={i === items.length - 1} className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30">↓</button>
                  </div>
                  <ConfirmButton onConfirm={() => remove(item.id)}>Remove</ConfirmButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          if (e.target.files?.length) void handleFiles(e.target.files)
        }}
      />
      <AdminButton type="button" variant="secondary" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? 'Uploading…' : '+ Add images'}
      </AdminButton>
    </div>
  )
}
