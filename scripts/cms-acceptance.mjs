/* CMS acceptance test: the 18-step check from the v2 brief, automated.
   Drives the real admin (/admin) in one browser context, checks the public
   site in another (no shared state, so nothing passes through local
   storage), and checks the database through the anonymous REST API, i.e.
   exactly what a visitor can read.

     ADMIN_EMAIL=… ADMIN_PASSWORD=… VITE_SUPABASE_URL=… VITE_SUPABASE_ANON_KEY=… \
       node scripts/cms-acceptance.mjs [--base=http://localhost:4173]

   Run it against a local or staging database: it writes real rows. Every
   value it writes carries a "QA " marker so it is easy to find and revert. */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split('=').slice(1).join('=')
const base = arg('base', 'http://localhost:4173')
const { ADMIN_EMAIL, ADMIN_PASSWORD, VITE_SUPABASE_URL: SB, VITE_SUPABASE_ANON_KEY: ANON } = process.env
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !SB || !ANON) {
  console.error('Set ADMIN_EMAIL, ADMIN_PASSWORD, VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
  process.exit(2)
}

const stamp = Date.now().toString(36).slice(-4)
const V = {
  hero: `QA hero ${stamp}: we make companies *wanted*.`,
  heroText: `QA hero ${stamp}: we make companies wanted.`,
  project: `QA Lavanta ${stamp}`,
  capability: `QA Brand Strategy ${stamp}`,
  email: `qa-${stamp}@notbyaccident.com`,
  seoTitle: `QA home title ${stamp}`,
  seoDesc: `QA description ${stamp}. Independent creative studio in Amsterdam, checked by the acceptance test.`,
  draft: `QA Draft ${stamp}`,
}

const results = []
const step = async (n, name, fn) => {
  try {
    const note = await fn()
    results.push({ n, name, ok: true, note: note ?? '' })
    console.log(`✓ ${String(n).padStart(2)} ${name}${note ? ` (${note})` : ''}`)
  } catch (e) {
    results.push({ n, name, ok: false, note: e.message.split('\n')[0] })
    await admin.screenshot({ path: `qa-output/acceptance-fail-${n}.png` }).catch(() => {})
    console.log(`✗ ${String(n).padStart(2)} ${name}\n     ${e.message.split('\n')[0]}`)
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
}
const anon = async path => {
  const r = await fetch(`${SB}/rest/v1/${path}`, { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } })
  return r.json()
}

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const admin = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
const pub = await browser.newContext({ viewport: { width: 1440, height: 900 } })
// The sandbox can't reach Unsplash; answer with a 1px image so pages settle.
await pub.route('**/images.unsplash.com/**', r => r.fulfill({ status: 200, contentType: 'image/gif', body: Buffer.from('R0lGODlhAQABAAAAACw=', 'base64') }))
const visit = async path => {
  const p = await pub.newPage()
  await p.goto(base + path, { waitUntil: 'networkidle' })
  await p.waitForTimeout(600) // live CMS refresh after hydration
  return p
}
const card = key => admin.locator(`section[data-section="${key}"]`)
const saveCard = async title => {
  const c = card(title)
  await c.getByRole('button', { name: 'Save', exact: true }).click()
  await c.getByText('Saved. Live on the site now.').waitFor({ timeout: 8000 })
}

// 1–3: run the site, open /admin, sign in.
await step(1, 'Site runs', async () => {
  const r = await fetch(base + '/')
  assert(r.ok, `GET / → ${r.status}`)
})
await step(2, '/admin opens', async () => {
  await admin.goto(base + '/admin', { waitUntil: 'networkidle' })
  await admin.locator('input[type=email]').waitFor()
})
await step(3, 'Sign in', async () => {
  await admin.locator('input[type=email]').fill(ADMIN_EMAIL)
  await admin.locator('input[type=password]').fill(ADMIN_PASSWORD)
  await admin.locator('button[type=submit]').click()
  await admin.waitForURL(/\/admin\/dashboard/, { timeout: 10000 })
})

// 4–7: hero text.
await step(4, 'Change homepage hero text', async () => {
  await admin.goto(base + '/admin/homepage', { waitUntil: 'networkidle' })
  await card('hero').getByLabel('Heading', { exact: true }).fill(V.hero)
})
await step(5, 'Save it', () => saveCard('hero'))
await step(6, 'Refresh the public homepage', async () => {
  const p = await visit('/')
  await p.close()
})
await step(7, 'New hero text appears', async () => {
  const p = await visit('/')
  const h1 = (await p.locator('h1').first().innerText()).replace(/\s+/g, ' ')
  await p.close()
  assert(h1.includes(`QA hero ${stamp}`), `h1 is “${h1}”`)
  return `h1 “${h1}”`
})

// 8–9: hero image (a real upload to Storage).
let uploaded = ''
await step(8, 'Change a homepage image (upload)', async () => {
  const dir = join(tmpdir(), 'nba-qa')
  mkdirSync(dir, { recursive: true })
  const file = join(dir, `qa-hero-${stamp}.png`)
  // 2×2 PNG
  writeFileSync(file, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGP4z8DwnwEIGBgYGBgYAAAhRQH/mMR7XQAAAABJRU5ErkJggg==', 'base64'))
  await card('hero').locator('input[type=file]').setInputFiles(file)
  await admin.waitForTimeout(2500)
  await saveCard('hero')
  const rows = await anon(`page_sections?select=image:media(storage_path,bucket)&section_key=eq.hero&page_id=eq.${(await anon('pages?select=id&slug=eq.next/home'))[0].id}`)
  uploaded = rows[0]?.image?.storage_path ?? ''
  assert(uploaded.includes('uploads/'), `hero media is ${JSON.stringify(rows[0])}`)
  const img = await fetch(`${SB}/storage/v1/object/public/media/${uploaded}`)
  assert(img.ok, `uploaded file not retrievable: ${img.status}`)
  return uploaded
})
await step(9, 'Image updates publicly', async () => {
  const p = await visit('/')
  const src = await p.locator('.hero img').first().getAttribute('src')
  await p.close()
  assert(src?.includes(uploaded), `hero img src is ${src}`)
})

// 10–11: project title.
await step(10, 'Change a project title', async () => {
  await admin.goto(base + '/admin/work', { waitUntil: 'networkidle' })
  await admin.locator('tr', { hasText: 'Lavanta' }).getByRole('link', { name: 'Edit' }).click()
  await admin.getByLabel('Title', { exact: true }).fill(V.project)
  await admin.getByRole('button', { name: 'Save draft' }).click()
  await admin.getByRole('heading', { name: V.project }).waitFor()
  await admin.waitForTimeout(800)
  const rows = await anon('projects?select=title,status&slug=eq.lavanta')
  assert(rows[0]?.title === V.project && rows[0]?.status === 'published', JSON.stringify(rows))
})
await step(11, 'Updates on listing and case study', async () => {
  for (const path of ['/work', '/case-studies', '/', '/case-studies/lavanta']) {
    const p = await visit(path)
    const ok = await p.getByText(V.project).first().isVisible().catch(() => false)
    const html = await p.content()
    await p.close()
    assert(ok || html.includes(V.project), `${path} doesn't show “${V.project}”`)
  }
  return '/work, /case-studies, /, /case-studies/lavanta'
})

// 12–13: capability.
await step(12, 'Change capability display information', async () => {
  await admin.goto(base + '/admin/capabilities', { waitUntil: 'networkidle' })
  await admin.locator('div', { hasText: /^Brand Strategy/ }).getByRole('button', { name: 'Edit' }).first().click()
  const name = admin.locator('div.mb-4', { has: admin.locator('span', { hasText: /^Name$/ }) }).locator('input')
  await name.fill(V.capability)
  await admin.getByRole('button', { name: 'Save', exact: true }).click()
  await admin.waitForTimeout(1000)
  const rows = await anon('capabilities?select=name&slug=eq.brand-strategy')
  assert(rows[0]?.name === V.capability, JSON.stringify(rows))
})
await step(13, 'Capability updates', async () => {
  for (const path of ['/capabilities', '/capabilities/brand-strategy']) {
    const p = await visit(path)
    const html = await p.content()
    await p.close()
    assert(html.includes(V.capability), `${path} doesn't show it`)
  }
  return '/capabilities, /capabilities/brand-strategy'
})

// 14–15: footer contact.
await step(14, 'Change footer contact information', async () => {
  await admin.goto(base + '/admin/contact', { waitUntil: 'networkidle' })
  await admin.getByLabel('New business email').fill(V.email)
  await admin.getByRole('button', { name: 'Save', exact: true }).first().click()
  await admin.waitForTimeout(1200)
  const rows = await anon('site_settings?select=new_business_email')
  assert(rows[0]?.new_business_email === V.email, JSON.stringify(rows))
})
await step(15, 'Contact updates everywhere', async () => {
  const where = []
  for (const path of ['/', '/contact', '/studio', '/work']) {
    const p = await visit(path)
    const n = await p.locator(`a[href="mailto:${V.email}"]`).count()
    await p.close()
    assert(n > 0, `${path} has no mailto:${V.email}`)
    where.push(`${path}×${n}`)
  }
  return where.join(', ')
})

// 16–17: SEO.
await step(16, 'Change SEO metadata', async () => {
  await admin.goto(base + '/admin/homepage', { waitUntil: 'networkidle' })
  const seo = card('seo')
  await seo.getByLabel('SEO title', { exact: true }).fill(V.seoTitle)
  await seo.locator('label:has(> span:text-is("Meta description")) textarea').fill(V.seoDesc)
  await saveCard('seo')
})
await step(17, 'Page <head> updates', async () => {
  const p = await visit('/')
  const title = await p.title()
  const desc = await p.locator('meta[name=description]').getAttribute('content')
  const og = await p.locator('meta[property="og:title"]').getAttribute('content')
  await p.close()
  assert(title.includes(V.seoTitle), `title “${title}”`)
  assert(desc === V.seoDesc, `description “${desc}”`)
  assert(og?.includes(V.seoTitle), `og:title “${og}”`)
  return `“${title}”`
})

// 18: drafts don't leak.
await step(18, 'Draft items do not leak', async () => {
  await admin.goto(base + '/admin/work/new', { waitUntil: 'networkidle' })
  await admin.getByLabel('Title', { exact: true }).fill(V.draft)
  await admin.getByLabel('Slug', { exact: true }).fill(`qa-draft-${stamp}`)
  await admin.getByRole('button', { name: 'Save draft' }).click()
  await admin.waitForURL(/\/admin\/work\/[0-9a-f-]{36}/, { timeout: 10000 })
  const rows = await anon(`projects?select=slug&slug=eq.qa-draft-${stamp}`)
  assert(Array.isArray(rows) && rows.length === 0, `anon can read the draft: ${JSON.stringify(rows)}`)
  for (const path of ['/work', '/case-studies', '/search']) {
    const p = await visit(path)
    const html = await p.content()
    await p.close()
    assert(!html.includes(V.draft), `${path} shows the draft`)
  }
  const p = await visit(`/case-studies/qa-draft-${stamp}`)
  const h1 = await p.locator('h1').first().innerText()
  await p.close()
  assert(!h1.includes(V.draft), 'draft case study renders')
  return 'not in REST, /work, /case-studies, /search or its own URL'
})

await browser.close()
const failed = results.filter(r => !r.ok)
writeFileSync('qa-output/cms-acceptance.json', JSON.stringify({ stamp, values: V, results }, null, 2))
console.log(failed.length ? `\n${failed.length} of 18 failed` : '\nAll 18 steps passed')
process.exit(failed.length ? 1 : 0)
