/* THE LAB — browser test of Admin → The Lab, against the built site on
 * :4173 and a LOCAL Supabase (same requirements as lab-e2e.mjs).
 * Signs in as the CMS admin and works every Lab admin screen; also checks
 * that a Lab user is turned away from /admin. Cleans up what it creates. */
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:4173'
const URL_ = process.env.SUPABASE_URL ?? process.env.API_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY
const ANON = process.env.SUPABASE_ANON_KEY ?? process.env.ANON_KEY
const ADMIN_EMAIL = process.env.LAB_ADMIN_EMAIL ?? 'qa-admin@example.com'
const ADMIN_PASSWORD = process.env.LAB_ADMIN_PASSWORD ?? 'qa-admin-pass-2026'
if (!URL_ || !SERVICE || !ANON) throw new Error('Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY')
if (/supabase\.co/.test(URL_)) throw new Error('Refusing to run against a hosted project')
const svc = createClient(URL_, SERVICE, { auth: { persistSession: false } })
const out = 'qa-output/lab-admin-e2e'
mkdirSync(out, { recursive: true })
const tag = Date.now().toString(36)
const steps = []
const errors = []

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
page.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(`console: ${m.text().slice(0, 200)}`))
let n = 0
async function step(name, fn) {
  try {
    await fn()
    await page.screenshot({ path: `${out}/${String(++n).padStart(2, '0')}-${name.replace(/\W+/g, '-').toLowerCase()}.png`, fullPage: true })
    steps.push({ name, ok: true })
    console.log(`  ✓ ${name}`)
  } catch (e) {
    await page.screenshot({ path: `${out}/FAIL-${name.replace(/\W+/g, '-').toLowerCase()}.png`, fullPage: true }).catch(() => {})
    steps.push({ name, ok: false, error: e.message })
    console.log(`  ✗ ${name}\n      ${e.message.split('\n')[0]}`)
  }
}
const see = (t, o) => page.getByText(t, o).first().waitFor({ timeout: 15000 })

// a Lab user with a pending introduction to review
const lab = createClient(URL_, ANON, { auth: { persistSession: false } })
const labEmail = `lab-admin-e2e-${tag}@example.com`
const su = await lab.auth.signUp({ email: labEmail, password: 'admin-e2e-2026', options: { data: { account: 'lab', full_name: 'Admin E2E', consents: { terms: true, privacy: true, partner_sharing: true }, consent_version: '2026-10' } } })
if (su.error) throw su.error
const brand = (await lab.from('lab_brands').insert({ name: `Admin E2E Brand ${tag}`, industry: 'fashion', product_category: 'accessories', customer_segments: ['professionals'], price_tier: 'premium', target_markets: ['NL', 'DE'], distribution_model: 'retail' }).select().single()).data
const partner = (await svc.from('lab_partners').select('id').eq('website_domain', 'canal-concept.example').single()).data
const intro = await lab.rpc('lab_request_introduction', { p_brand: brand.id, p_partner: partner.id, p_purpose: 'retail_listing', p_message: 'Admin E2E request' })
if (intro.error) throw intro.error

try {
  await step('Admin sign-in and The Lab overview', async () => {
    await page.goto(BASE + '/admin/login')
    await page.getByLabel('Email').fill(ADMIN_EMAIL)
    await page.getByLabel('Password').fill(ADMIN_PASSWORD)
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('**/admin/dashboard')
    await page.getByRole('link', { name: 'The Lab', exact: true }).click()
    await see('The Lab · Overview')
    await see('Staff inbox')
    await see(`Admin E2E Brand ${tag}`)
  })
  await step('Review an introduction: status, public message, internal note', async () => {
    await page.getByRole('link', { name: 'Introductions', exact: true }).click()
    await page.getByRole('button', { name: new RegExp(`Admin E2E Brand ${tag}`) }).click()
    await see('Brand may share its profile with partners: yes')
    await page.getByLabel('Status').selectOption('under_review')
    await page.getByLabel('Message to the brand').fill('We are looking into this.')
    await page.getByLabel('Internal note').fill(`ADMIN-E2E internal ${tag}`)
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await see(`ADMIN-E2E internal ${tag}`)
    const { data } = await lab.from('lab_introductions').select('status').eq('id', intro.data).single()
    if (data.status !== 'under_review') throw new Error(`status is ${data.status}`)
    const { data: notes } = await lab.from('lab_introduction_notes').select('id')
    if (notes.length) throw new Error('Lab user can read internal notes')
  })
  await step('Users & brands', async () => {
    await page.getByRole('link', { name: 'Users & brands' }).click()
    await see(labEmail)
  })
  let draftVersion
  await step('Assessment builder: copy to draft, edit weights, preview, delete', async () => {
    await page.getByRole('link', { name: 'Assessment', exact: true }).click()
    await see('Assessment builder')
    await page.getByRole('button', { name: 'Copy to new draft' }).first().click()
    await see('Draft: edit freely')
    await page.getByLabel('Brand foundation %').fill('20')
    await page.getByLabel('Product–market fit %').fill('15')
    await page.getByRole('button', { name: 'Save weights & bands' }).click()
    await see('Saved.')
    const { data } = await svc.from('lab_assessment_versions').select('id, category_weights').eq('status', 'draft').single()
    draftVersion = data.id
    if (data.category_weights.brand !== 20) throw new Error('weights not saved')
    await page.getByRole('button', { name: 'Score' }).click()
    await see('required still unanswered')
    await page.getByRole('button', { name: 'Delete' }).first().click()
    await page.getByRole('button', { name: 'Sure?' }).click()
    await page.waitForTimeout(800)
    const { data: left } = await svc.from('lab_assessment_versions').select('id').eq('id', draftVersion)
    if (left.length) throw new Error('draft not deleted')
  })
  await step('Published questions are read-only', async () => {
    await page.reload()
    await see('are frozen so earlier results stay reproducible')
  })
  await step('Recommendation rules', async () => {
    await page.getByRole('button', { name: 'Recommendation rules' }).click()
    await see('Test demand before you ship stock')
  })
  await step('Markets: add a source, then remove it', async () => {
    await page.getByRole('link', { name: 'Markets', exact: true }).click()
    await page.getByRole('button', { name: /Germany/ }).click()
    await page.getByLabel('Title').fill(`E2E source ${tag}`)
    await page.getByLabel('URL').fill('https://example.org/e2e-source')
    await page.getByRole('button', { name: 'Add source' }).click()
    await see(`E2E source ${tag}`)
    await svc.from('lab_market_sources').delete().like('title', `E2E source ${tag}`)
  })
  await step('Partners: create, list, contact, export, CSV dry run', async () => {
    await page.getByRole('link', { name: 'Partner database' }).click()
    await page.getByRole('button', { name: 'New partner' }).click()
    await page.getByLabel('Organisation name').fill(`E2E Partner ${tag}`)
    await page.getByLabel('Website').fill(`https://e2e-${tag}.example`)
    await page.getByRole('button', { name: 'Save partner' }).click()
    await see('Contacts (staff only)')
    await page.getByLabel('Name', { exact: true }).fill('Test Person')
    await page.getByRole('button', { name: 'Add contact' }).click()
    await see('basis: legitimate interest')
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export CSV' }).click()])
    const csvPath = `${out}/partners.csv`
    await dl.saveAs(csvPath)
    writeFileSync(`${out}/import.csv`, `name,website,type_key,country_code,markets\nE2E Import ${tag},https://e2e-${tag}.example/x,retailer,NL,NL|BE\nNo type,,spaceship,,\n`)
    await page.getByRole('button', { name: 'Import CSV' }).click()
    await page.getByLabel('CSV file').setInputFiles(`${out}/import.csv`)
    await see('Dry run: 0 new, 1 updated, 1 skipped.')
  })
  await step('Matching weights validate to 100', async () => {
    await page.getByRole('link', { name: 'Matching', exact: true }).click()
    await page.getByLabel('Product category (%)').fill('50')
    if (!(await page.getByRole('button', { name: 'Save as new version' }).isDisabled())) throw new Error('could save weights ≠ 100')
    await page.getByLabel('Product category (%)').fill('25')
  })
  await step('Opportunities, Content and Settings render', async () => {
    await page.getByRole('link', { name: 'Opportunities', exact: true }).click()
    await see('Every brand’s pipeline')
    await page.getByRole('link', { name: 'Content', exact: true }).click()
    await see('The Lab · Landing (/lab)')
    await page.getByRole('link', { name: 'Settings', exact: true }).click()
    await see('Show fictional demo partners')
  })
  await step('A Lab user is turned away from /admin', async () => {
    const c2 = await browser.newContext()
    const p2 = await c2.newPage()
    await p2.goto(BASE + '/admin/login')
    await p2.getByLabel('Email').fill(labEmail)
    await p2.getByLabel('Password').fill('admin-e2e-2026')
    await p2.getByRole('button', { name: 'Sign in' }).click()
    await p2.getByText('Your account is a Lab account').waitFor({ timeout: 15000 })
    await c2.close()
  })
} finally {
  await browser.close()
  await svc.from('lab_partners').delete().like('website_domain', `e2e-${tag}%`)
  await svc.from('lab_brands').delete().eq('id', brand.id)
  await svc.auth.admin.deleteUser(su.data.user.id)
}
const failed = steps.filter(s => !s.ok).length
console.log(`\n${steps.length - failed}/${steps.length} steps passed${errors.length ? `; browser errors:\n  ${[...new Set(errors)].join('\n  ')}` : ', no browser errors'}`)
process.exit(failed || errors.length ? 1 : 0)
