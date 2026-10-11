/* THE LAB — end-to-end browser test of the whole journey, against the built
 * site (pnpm preview on :4173, built with VITE_SUPABASE_* pointing at a
 * LOCAL Supabase that has migrations 0011–0014 and the staging fixtures).
 *
 *   SUPABASE_URL=… SUPABASE_ANON_KEY=… SUPABASE_SERVICE_ROLE_KEY=… node scripts/lab-e2e.mjs
 *
 * Discover → preview → register → brand → assessment → results → markets →
 * matches → shortlist → introduction → admin review (via the admin API) →
 * reply → opportunity → report + PDF → export → password reset → delete.
 * Screenshots of each step go to qa-output/lab-e2e/. */
import { chromium } from 'playwright'
import { createClient } from '@supabase/supabase-js'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE ?? 'http://localhost:4173'
const URL_ = process.env.SUPABASE_URL ?? process.env.API_URL
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY
const ANON = process.env.SUPABASE_ANON_KEY ?? process.env.ANON_KEY
const ADMIN_EMAIL = process.env.LAB_ADMIN_EMAIL ?? 'qa-admin@example.com'
const ADMIN_PASSWORD = process.env.LAB_ADMIN_PASSWORD ?? 'qa-admin-pass-2026'
if (!URL_ || !SERVICE || !ANON) throw new Error('Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY')
if (/supabase\.co/.test(URL_)) throw new Error('Refusing to run against a hosted project')
const svc = createClient(URL_, SERVICE, { auth: { persistSession: false } })
const admin = createClient(URL_, ANON, { auth: { persistSession: false } })
const out = 'qa-output/lab-e2e'
mkdirSync(out, { recursive: true })

const email = `lab-e2e-${Date.now().toString(36)}@example.com`
const password = 'e2e-pass-2026-x'
const steps = []
const errors = []
const notes = []
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true })
const page = await ctx.newPage()
page.on('pageerror', e => errors.push(`pageerror: ${e.message}`))
page.on('console', m => m.type() === 'error' && !/Failed to load resource/.test(m.text()) && errors.push(`console: ${m.text().slice(0, 200)}`))
let n = 0
async function step(name, fn) {
  const t = Date.now()
  try {
    await fn()
    await page.screenshot({ path: `${out}/${String(++n).padStart(2, '0')}-${name.replace(/\W+/g, '-').toLowerCase()}.png`, fullPage: true })
    steps.push({ name, ok: true, ms: Date.now() - t })
    console.log(`  ✓ ${name}`)
  } catch (e) {
    await page.screenshot({ path: `${out}/FAIL-${name.replace(/\W+/g, '-').toLowerCase()}.png`, fullPage: true }).catch(() => {})
    steps.push({ name, ok: false, error: e.message })
    console.log(`  ✗ ${name}\n      ${e.message.split('\n')[0]}`)
    throw e
  }
}
const see = (text, opts) => page.getByText(text, opts).first().waitFor({ timeout: 15000 })

try {
  await step('Homepage shows The Lab section', async () => {
    await page.goto(BASE + '/')
    await see('Before you enter a market,')
    await page.getByRole('link', { name: /Explore The Lab/ }).first().click()
    await page.waitForURL('**/lab')
  })
  await step('Readiness preview gives an indicative result', async () => {
    await page.goto(BASE + '/lab/market-readiness')
    await page.getByRole('button', { name: 'Start the preview' }).click()
    for (let i = 0; i < 6; i++) {
      await page.locator('.lab-choice').first().waitFor()
      await page.locator('.lab-choice').nth(1).click()
      await page.getByRole('button', { name: /Next question|See my indicative result/ }).click()
    }
    await see('Indicative result · not stored')
  })
  await step('Sign up', async () => {
    await page.goto(BASE + '/lab/sign-up')
    await page.getByLabel('Your name').fill('E2E Founder')
    await page.getByLabel(/Work email/).fill(email)
    await page.getByLabel(/^Password/).fill(password)
    await page.getByLabel(/I’ve read how The Lab uses my data/).check()
    await page.getByRole('button', { name: 'Create account' }).click()
    await page.waitForURL('**/lab/brand**', { timeout: 20000 })
  })
  await step('Brand onboarding (3 steps)', async () => {
    await page.getByLabel(/Brand name/).fill('E2E Silverworks')
    await page.getByLabel(/Industry/).selectOption('jewellery')
    await page.getByLabel('Where the brand is based').selectOption('NL')
    await page.getByLabel('Product category').fill('silver jewellery')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await see('Who buys from you')
    await page.getByLabel('Professionals').check()
    await page.getByLabel('Price positioning').selectOption('premium')
    await page.getByLabel('Own web shop').check()
    await page.getByRole('group', { name: /Markets where you already sell/ }).getByLabel('Netherlands').check()
    await page.getByRole('group', { name: /Languages your materials/ }).getByLabel('English').check()
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await see('Markets you’re considering')
    const g = page.getByRole('group', { name: /Markets you’re considering/ })
    await g.getByLabel('Germany').check()
    await g.getByLabel('Belgium').check()
    await g.getByLabel('United Kingdom').check()
    await page.getByLabel('Preferred distribution').selectOption('retail')
    await page.getByRole('button', { name: 'Save and start the assessment' }).click()
    await page.waitForURL('**/lab/assessment')
  })
  await step('Readiness assessment, answered and completed', async () => {
    await page.getByRole('button', { name: 'Begin' }).click()
    for (let i = 0; i < 30; i++) {
      const review = page.getByRole('heading', { name: 'Review your answers' })
      if (await review.isVisible()) break
      await page.locator('.lab-choice').first().waitFor()
      const opts = page.locator('.lab-choice')
      await opts.nth(i % 2 === 0 ? 0 : 1).click()
      await page.getByText('Saved', { exact: true }).waitFor()
      await page.getByRole('button', { name: /^(Next|Review answers)$/ }).click()
    }
    await page.getByRole('button', { name: 'Complete and see my result' }).click()
    await page.waitForURL('**/lab/results**')
    await see('By area')
    await see('Recommended next steps')
  })
  await step('Compare markets', async () => {
    await page.getByRole('link', { name: 'Compare markets' }).click()
    await page.waitForURL('**/lab/markets**')
    await page.locator('.lab-compare__col').nth(2).waitFor()
    await see('What the score is made of')
  })
  await step('Matches with explanations', async () => {
    await page.goto(BASE + '/lab/matches')
    await page.getByRole('button', { name: 'Find matches' }).first().click()
    await page.locator('.lab-match').first().waitFor()
    await see('Fictional demo record')
    await page.locator('.lab-match').first().getByRole('button', { name: 'Details' }).click()
    await see('A compatibility score describes how recorded attributes align')
    await page.keyboard.press('Escape')
  })
  await step('Shortlist with a note', async () => {
    await page.locator('.lab-match').first().getByRole('button', { name: 'Shortlist' }).click()
    await page.locator('.lab-match').first().getByRole('button', { name: 'Shortlisted' }).waitFor()
    await page.getByRole('tab', { name: 'Shortlist' }).click()
    await page.getByPlaceholder('Add a note').first().fill('Ask about consignment terms')
    await page.getByRole('button', { name: 'Save note' }).first().click()
    await see('Note saved.')
  })
  await step('Request an introduction', async () => {
    await page.getByRole('tab', { name: 'Matches' }).click()
    await page.locator('.lab-match').first().getByRole('button', { name: 'Request an introduction' }).click()
    const d = page.getByRole('dialog')
    await d.getByLabel(/What it’s for/).selectOption('retail_listing')
    await d.getByLabel('Message to our team').fill('We would like to discuss a first order for spring.')
    const share = d.getByLabel(/may share my brand profile/)
    if (await share.count()) await share.check()
    await d.getByRole('button', { name: 'Send request' }).click()
    await see('Request sent.')
  })
  let introId
  await step('Admin review: more information needed (internal note stays internal)', async () => {
    const { error } = await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
    if (error) throw error
    const { data: u } = await svc.auth.admin.listUsers({ perPage: 200 })
    const uid = u.users.find(x => x.email === email).id
    const { data: intro } = await svc.from('lab_introductions').select('id').eq('requested_by', uid).single()
    introId = intro.id
    const r = await admin.rpc('lab_admin_update_introduction', { p_id: introId, p_status: 'more_info_needed', p_note: 'Could you share your wholesale price list?', p_internal: 'E2E INTERNAL NOTE' })
    if (r.error) throw r.error
    await page.goto(BASE + '/lab/matches?tab=requests')
    await see('More information needed')
    await see('Could you share your wholesale price list?')
    if (await page.getByText('E2E INTERNAL NOTE').count()) throw new Error('internal note visible to the brand')
  })
  await step('Brand replies; admin sends the introduction; opportunity appears', async () => {
    await page.getByLabel('Your reply').fill('Price list attached to our profile; wholesale from €38.')
    await page.getByRole('button', { name: 'Send', exact: true }).click()
    await see('Under review')
    const r = await admin.rpc('lab_admin_update_introduction', { p_id: introId, p_status: 'introduction_sent', p_note: 'Introduced by email today.' })
    if (r.error) throw r.error
    await page.goto(BASE + '/lab/opportunities')
    await see('Introduction: Fictional')
  })
  await step('Track the opportunity', async () => {
    await page.locator('.lab-opps__item').first().click()
    await page.getByRole('button', { name: 'Edit' }).click()
    await page.getByLabel('Status').selectOption('in_discussion')
    await page.getByLabel('Next action').fill('Send samples')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await see('Next action: Send samples')
    await page.getByPlaceholder('Add what happened').fill('Buyer call went well.')
    await page.getByRole('button', { name: 'Add', exact: true }).click()
    await see('Buyer call went well.')
  })
  await step('Dashboard reflects the journey', async () => {
    await page.goto(BASE + '/lab/dashboard')
    await see('Your route')
    await see('Market readiness')
    await see(/Introduction to .* introduction sent/i)
  })
  await step('Generate a report and download the PDF', async () => {
    await page.goto(BASE + '/lab/reports')
    await page.getByRole('button', { name: 'Generate a report' }).click()
    await see('Method & limitations')
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download PDF' }).click()])
    const path = `${out}/report.pdf`
    await dl.saveAs(path)
    const { readFileSync } = await import('node:fs')
    const head = readFileSync(path).subarray(0, 5).toString()
    if (head !== '%PDF-') throw new Error('download is not a PDF')
  })
  await step('Export my data', async () => {
    await page.goto(BASE + '/lab/settings')
    const [dl] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Export my data' }).click()])
    const path = `${out}/export.json`
    await dl.saveAs(path)
    const { readFileSync } = await import('node:fs')
    const json = JSON.parse(readFileSync(path, 'utf8'))
    if (!JSON.stringify(json).includes('E2E Silverworks')) throw new Error('export lacks the brand')
    if (JSON.stringify(json).includes('E2E INTERNAL NOTE')) throw new Error('export leaks an internal note')
  })
  await step('Sign out, forgot password, reset via recovery link, sign in', async () => {
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.waitForURL('**/lab/login**')
    await page.goto(BASE + '/lab/forgot-password')
    await page.getByLabel(/^Email \(required\)/).fill(email)
    await page.getByRole('button', { name: 'Send the reset link' }).click()
    await page.getByText(/a reset link is on its way|couldn’t send the email/).first().waitFor({ timeout: 15000 })
    if (await page.getByText(/couldn’t send the email/).count()) notes.push('Reset email not sent: this Supabase has no SMTP/mail server (expected locally). Recovery link generated through the admin API instead.')
    // the email itself: the same recovery link, generated through the admin API
    const { data, error } = await svc.auth.admin.generateLink({ type: 'recovery', email, options: { redirectTo: `${BASE}/lab/reset-password` } })
    if (error) throw error
    // Follow the verify step server-side (as the mail client would) and hand
    // the resulting recovery session to the reset page, as the redirect does.
    const res = await fetch(data.properties.action_link, { redirect: 'manual' })
    const hash = (res.headers.get('location') ?? '').split('#')[1]
    if (!hash || !/type=recovery/.test(hash)) throw new Error(`no recovery session in redirect: ${res.status} ${res.headers.get('location')}`)
    await page.goto(`${BASE}/lab/reset-password#${hash}`)
    await page.getByLabel('New password').fill(password + '-new')
    await page.getByRole('button', { name: 'Save and continue' }).click()
    await page.waitForURL('**/lab/dashboard')
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.goto(BASE + '/lab/login')
    await page.getByLabel(/^Email \(required\)/).fill(email)
    await page.getByLabel(/^Password \(required\)/).fill(password + '-new')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await page.waitForURL('**/lab/dashboard')
  })
  await step('Private pages are noindex', async () => {
    const robots = await page.locator('meta[name="robots"]').getAttribute('content')
    if (!/noindex/.test(robots ?? '')) throw new Error(`robots is ${robots}`)
  })
  await step('Delete the account', async () => {
    await page.goto(BASE + '/lab/settings')
    await page.getByLabel('Type DELETE to confirm').fill('DELETE')
    await page.getByRole('button', { name: 'Delete my account' }).click()
    await page.waitForURL('**/lab')
    const { data } = await svc.auth.admin.listUsers({ perPage: 200 })
    if (data.users.some(u => u.email === email)) throw new Error('user still exists')
  })
} catch {
  /* reported by step() */
} finally {
  await browser.close()
  const { data } = await svc.auth.admin.listUsers({ perPage: 200 })
  const u = data.users.find(x => x.email === email)
  if (u) {
    await svc.from('lab_brands').delete().eq('created_by', u.id)
    await svc.auth.admin.deleteUser(u.id)
  }
}
const failed = steps.filter(s => !s.ok).length
console.log(`\n${steps.length - failed}/${steps.length} steps passed${errors.length ? `; ${errors.length} browser errors:\n  ${[...new Set(errors)].join('\n  ')}` : ', no browser errors'}`)
if (notes.length) console.log(`notes:\n  ${notes.join('\n  ')}`)
process.exit(failed || errors.length ? 1 : 0)
