import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/* Both variables are required for the CMS to work. Until the schema in
   supabase/migrations/0001_init.sql has been run and these are set (see
   docs/CMS.md), `supabaseReady` is false and the frontend/admin fall back to
   the static content in src/data.ts so the site never breaks. */
export const supabaseReady = Boolean(url && anonKey)

export const supabase = supabaseReady
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

/* Public URL for a file stored in Supabase Storage. `bucket: 'external'` is
   a convention (not a real Storage bucket) used by seed data and any admin
   entry that just pastes an external image URL instead of uploading — in
   that case `path` already IS the full URL. For the private `trainings`
   bucket this only works for signed URLs generated elsewhere — use
   createSignedUrl in admin code for those instead. */
export function publicMediaUrl(bucket: string, path: string): string {
  if (!path) return ''
  if (bucket === 'external') return path
  if (!supabase) return ''
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
