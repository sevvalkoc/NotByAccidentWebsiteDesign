import { useRef, useState } from 'react'
import { supabase, publicMediaUrl } from '@/lib/supabase'
import { AdminButton } from '@/admin/ui'

/* Minimal inline image/file picker: upload straight from a form field, or
   clear it. For browsing/reusing existing files, use the full Media
   Library (src/admin/MediaLibrary.tsx) and paste the resulting media id —
   most fields just need "upload a new one", which this covers directly. */
export default function MediaPicker({
  mediaId,
  onChange,
  bucket = 'media',
  accept = 'image/*',
  fileType = 'image',
  label = 'Image',
}: {
  mediaId: string | null
  onChange: (mediaId: string | null) => void
  bucket?: 'media' | 'documents' | 'trainings'
  accept?: string
  fileType?: 'image' | 'svg' | 'pdf' | 'video' | 'document'
  label?: string
}) {
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!supabase) return
    setUploading(true)
    setError('')
    try {
      const ext = file.name.split('.').pop()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext ? `.${ext}` : ''}`
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
      if (upErr) throw upErr

      let width: number | null = null
      let height: number | null = null
      if (fileType === 'image') {
        const dims = await imageDimensions(file).catch(() => null)
        if (dims) {
          width = dims.width
          height = dims.height
        }
      }

      const { data, error: insertErr } = await supabase
        .from('media')
        .insert({
          bucket,
          storage_path: path,
          file_type: fileType,
          file_name: file.name,
          mime_type: file.type,
          file_size_bytes: file.size,
          width,
          height,
        })
        .select('id, storage_path')
        .single()
      if (insertErr) throw insertErr

      const savedPath = (data as { storage_path: string }).storage_path
      if (bucket === 'trainings') {
        // Private bucket — the public-URL helper would 400. Use a
        // short-lived signed URL for the preview instead.
        const { data: signed } = await supabase.storage.from(bucket).createSignedUrl(savedPath, 60 * 60)
        setPreview(signed?.signedUrl ?? null)
      } else {
        setPreview(publicMediaUrl(bucket, savedPath))
      }
      onChange((data as { id: string }).id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      <div className="flex items-center gap-3">
        {(preview || mediaId) && fileType === 'image' && (
          <div className="w-16 h-16 rounded border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
            {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">saved</div>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => {
          const f = e.target.files?.[0]
          if (f) void handleFile(f)
        }} />
        <AdminButton type="button" variant="secondary" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? 'Uploading…' : mediaId ? 'Replace' : 'Upload'}
        </AdminButton>
        {mediaId && (
          <AdminButton
            type="button"
            variant="ghost"
            onClick={() => {
              setPreview(null)
              onChange(null)
            }}
          >
            Remove
          </AdminButton>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  )
}

function imageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('could not read image'))
    }
    img.src = url
  })
}
