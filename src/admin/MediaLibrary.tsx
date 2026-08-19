import { useEffect, useRef, useState } from 'react'
import { supabase, publicMediaUrl } from '@/lib/supabase'
import { AdminPageHeader, AdminButton, AdminCard, AdminInput, AdminSelect, ConfirmButton, formatBytes } from '@/admin/ui'

interface MediaRow {
  id: string
  bucket: string
  storage_path: string
  file_type: string
  file_name: string
  file_size_bytes: number | null
  alt_text: string | null
  caption: string | null
  created_at: string
}

export default function MediaLibrary() {
  const [rows, setRows] = useState<MediaRow[] | null>(null)
  const [filter, setFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function load() {
    if (!supabase) return
    const { data } = await supabase.from('media').select('*').eq('bucket', 'media').order('created_at', { ascending: false })
    setRows((data as MediaRow[]) ?? [])
  }
  useEffect(() => {
    void load()
  }, [])

  async function handleFiles(files: FileList) {
    if (!supabase) return
    setUploading(true)
    setError('')
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext ? `.${ext}` : ''}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, file)
      if (upErr) {
        setError(upErr.message)
        continue
      }
      const fileType = file.type.startsWith('image/svg')
        ? 'svg'
        : file.type.startsWith('image/')
          ? 'image'
          : file.type === 'application/pdf'
            ? 'pdf'
            : file.type.startsWith('video/')
              ? 'video'
              : 'document'
      await supabase.from('media').insert({
        bucket: 'media',
        storage_path: path,
        file_type: fileType,
        file_name: file.name,
        mime_type: file.type,
        file_size_bytes: file.size,
      })
    }
    setUploading(false)
    await load()
  }

  async function updateField(id: string, field: 'alt_text' | 'caption', value: string) {
    if (!supabase) return
    await supabase.from('media').update({ [field]: value }).eq('id', id)
  }

  async function remove(id: string, storagePath: string) {
    if (!supabase) return
    await supabase.storage.from('media').remove([storagePath])
    await supabase.from('media').delete().eq('id', id)
    await load()
  }

  const filtered = (rows ?? []).filter(r => {
    if (typeFilter && r.file_type !== typeFilter) return false
    if (filter && !r.file_name.toLowerCase().includes(filter.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Every file referenced across the site. Deleting a file here also removes it from anything currently using it — check where it's used before deleting."
        actions={
          <>
            <input ref={inputRef} type="file" multiple className="hidden" onChange={e => e.target.files && void handleFiles(e.target.files)} />
            <AdminButton disabled={uploading} onClick={() => inputRef.current?.click()}>{uploading ? 'Uploading…' : '+ Upload'}</AdminButton>
          </>
        }
      />
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="flex items-center gap-3 mb-4">
        <AdminInput placeholder="Search by filename…" value={filter} onChange={e => setFilter(e.target.value)} className="max-w-xs" />
        <AdminSelect value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-auto">
          <option value="">All types</option>
          <option value="image">Images</option>
          <option value="svg">SVGs</option>
          <option value="pdf">PDFs</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </AdminSelect>
      </div>

      {rows === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400">No files match.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map(r => (
            <AdminCard key={r.id} className="overflow-hidden">
              <div className="h-24 bg-gray-50 flex items-center justify-center">
                {r.file_type === 'image' || r.file_type === 'svg' ? (
                  <img src={publicMediaUrl(r.bucket, r.storage_path)} alt={r.alt_text ?? ''} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400 uppercase">{r.file_type}</span>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-gray-700 truncate" title={r.file_name}>{r.file_name}</p>
                <p className="text-[10px] text-gray-400 mb-1">{formatBytes(r.file_size_bytes)}</p>
                <input
                  placeholder="Alt text"
                  defaultValue={r.alt_text ?? ''}
                  onBlur={e => updateField(r.id, 'alt_text', e.target.value)}
                  className="w-full text-[11px] border border-gray-200 rounded px-1.5 py-1 mb-1"
                />
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigator.clipboard.writeText(publicMediaUrl(r.bucket, r.storage_path))}
                    className="text-[11px] text-gray-400 hover:text-gray-700"
                  >
                    Copy URL
                  </button>
                  <ConfirmButton onConfirm={() => remove(r.id, r.storage_path)}>Delete</ConfirmButton>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  )
}
