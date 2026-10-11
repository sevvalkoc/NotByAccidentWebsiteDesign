/* axe-core (and horizontal overflow, at WIDTH px) over the signed-in Lab screens (pnpm preview on :4173, built
 * against a LOCAL Supabase with the staging fixtures). Creates a throwaway
 * user with a brand, a completed assessment, matches and a request, signs
 * in through the real login page, checks every screen, then cleans up. */
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:4173'
const URL_ = process.env.SUPABASE_URL ?? process.env.API_URL
const ANON = process.env.SUPABASE_ANON_KEY ?? process.env.ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY
if (/supabase\.co/.test(URL_ ?? '')) throw new Error('Refusing to run against a hosted project')
const svc = createClient(URL_, SERVICE, { auth: { persistSession: false } })
const c = createClient(URL_, ANON, { auth: { persistSession: false } })
const email = `lab-a11y-${Date.now().toString(36)}@example.com`
const password = 'a11y-pass-2026'
const su = await c.auth.signUp({ email, password, options: { data: { account: 'lab', full_name: 'A11y', consents: { terms: true, privacy: true, partner_sharing: true }, consent_version: '2026-10' } } })
if (su.error) throw su.error
const b = (await c.from('lab_brands').insert({ name: 'A11y Brand', industry: 'fashion', product_category: 'accessories', origin_country: 'NL', customer_segments: ['professionals'], price_tier: 'premium', current_markets: ['NL'], target_markets: ['DE', 'BE', 'GB'], distribution_model: 'retail', languages: ['en'] }).select().single()).data
const aid = (await c.rpc('lab_start_assessment', { p_brand: b.id })).data
let s = (await c.rpc('lab_assessment_state', { p_assessment: aid })).data
for (let i = 0; i < 40; i++) {
  const q = s.questions.find(x => s.applicable.includes(x.key) && !(x.key in s.answers))
  if (!q) break
  await c.rpc('lab_save_answer', { p_assessment: aid, p_question: q.key, p_options: [q.options[1 % q.options.length].key] })
  s = (await c.rpc('lab_assessment_state', { p_assessment: aid })).data
}
await c.rpc('lab_complete_assessment', { p_assessment: aid })
const run = (await c.rpc('lab_run_matching', { p_brand: b.id, p_filters: {} })).data
await c.from('lab_saved_matches').insert({ brand_id: b.id, partner_id: run.matches[0].partner.id, note: 'a11y' })
await c.rpc('lab_request_introduction', { p_brand: b.id, p_partner: run.matches[0].partner.id, p_purpose: 'retail_listing', p_message: 'a11y' })
await c.from('lab_opportunities').insert({ brand_id: b.id, kind: 'retail', title: 'A11y opportunity' })
const rep = (await c.rpc('lab_generate_report', { p_brand: b.id })).data

const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const width = Number(process.env.WIDTH ?? 1280)
const page = await browser.newPage({ viewport: { width, height: 900 } })
const { mkdirSync } = await import('node:fs')
mkdirSync('qa-output/lab-screens', { recursive: true })
let bad = 0
try {
  await page.goto(BASE + '/lab/login')
  await page.getByLabel(/^Email \(required\)/).fill(email)
  await page.getByLabel(/^Password \(required\)/).fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/lab/dashboard')
  const screens = [
    ['/lab/dashboard', 'Your route'],
    ['/lab/brand', 'Brand name'],
    ['/lab/assessment', 'answered'],
    ['/lab/results', 'By area'],
    ['/lab/markets', 'What the score is made of'],
    ['/lab/matches', 'compatibility'],
    ['/lab/matches?tab=shortlist', 'Save note'],
    ['/lab/matches?tab=requests', 'Withdraw request'],
    ['/lab/opportunities', 'A11y opportunity'],
    [`/lab/reports?id=${rep}`, 'Method & limitations'],
    ['/lab/settings', 'Export my data'],
  ]
  for (const [path, marker] of screens) {
    await page.goto(BASE + path)
    await page.getByText(marker).first().waitFor({ timeout: 15000 })
    await page.addScriptTag({ content: axe })
    const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map(x => `${x.impact} ${x.id}: ${x.nodes.length}× ${x.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`))
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > innerWidth + 1
        ? [...document.querySelectorAll('main *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(-3).map(e => `${e.tagName.toLowerCase()}.${e.className}`).join(', ')
        : '',
    )
    if (overflow) v.push(`horizontal overflow at ${width}px: ${overflow}`)
    await page.screenshot({ path: `qa-output/lab-screens/${width}${path.replace(/\W+/g, '-')}.png`, fullPage: true })
    if (v.length) bad++
    console.log(`${v.length ? '✗' : '✓'} ${path}${v.length ? '\n   ' + v.join('\n   ') : ''}`)
  }
  // a dialog open
  await page.goto(BASE + '/lab/matches')
  await page.locator('.lab-match').first().getByRole('button', { name: 'Details' }).click()
  await page.getByText('A compatibility score describes').waitFor()
  await page.addScriptTag({ content: axe })
  const v = await page.evaluate(async () => (await window.axe.run(document.querySelector('dialog[open]'), { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa'] })).violations.map(x => `${x.impact} ${x.id}`))
  if (v.length) bad++
  console.log(`${v.length ? '✗' : '✓'} partner dialog${v.length ? '\n   ' + v.join('\n   ') : ''}`)
} finally {
  await browser.close()
  await svc.from('lab_brands').delete().eq('id', b.id)
  await svc.auth.admin.deleteUser(su.data.user.id)
}
console.log(`${bad} screen(s) with violations`)
process.exit(bad ? 1 : 0)
