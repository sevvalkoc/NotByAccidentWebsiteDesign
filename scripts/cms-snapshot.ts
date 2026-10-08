/* Build step 1: snapshot published CMS content into
   src/content/cms-snapshot.json, so the prerendered HTML and the hydrating
   bundle agree on the same records. Without Supabase credentials (or if
   the CMS is unreachable) it writes {} and the static seed is used, which is
   exactly what the previous site fell back to. */
import { writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { fetchLiveContent } from '../src/lib/cms.ts'
import { company } from '../src/content/seed/data.en.ts'

const out = new URL('../src/content/cms-snapshot.json', import.meta.url)
const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

async function main() {
  if (!url || !key) {
    writeFileSync(out, '{}\n')
    console.log('cms-snapshot: no Supabase credentials, using the static seed')
    return
  }
  try {
    const client = createClient(url, key, { auth: { persistSession: false } })
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 20000))
    const data = await Promise.race([fetchLiveContent(client, company), timeout])
    writeFileSync(out, JSON.stringify(data, null, 1) + '\n')
    console.log(`cms-snapshot: ${Object.keys(data).join(', ') || 'nothing published'}`)
  } catch (e) {
    writeFileSync(out, '{}\n')
    console.warn('cms-snapshot: CMS unreachable, using the static seed.', (e as Error).message)
  }
}
void main()
