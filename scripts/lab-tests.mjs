/* THE LAB — API and security tests against a LOCAL / STAGING Supabase.
 *
 *   SUPABASE_URL=http://127.0.0.1:54321 SUPABASE_ANON_KEY=… SUPABASE_SERVICE_ROLE_KEY=… \
 *   LAB_ADMIN_EMAIL=… LAB_ADMIN_PASSWORD=… node scripts/lab-tests.mjs
 *
 * Needs migrations 0011–0014 and supabase/seed/lab_fixtures.sql applied, an
 * approved CMS admin (LAB_ADMIN_*) and email confirmation switched off (the
 * local default). It creates throwaway users and brands, and removes them
 * again at the end. It refuses to run against a hosted *.supabase.co project.
 *
 * Every check calls the real API as the role it is about (anon, a Lab user,
 * another Lab user, an administrator); scoring is cross-checked against an
 * independent re-implementation of the published algorithm below. */
import { createClient } from '@supabase/supabase-js'

const URL_ = process.env.SUPABASE_URL ?? process.env.API_URL
const ANON = process.env.SUPABASE_ANON_KEY ?? process.env.ANON_KEY
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_ROLE_KEY
const ADMIN_EMAIL = process.env.LAB_ADMIN_EMAIL ?? 'qa-admin@example.com'
const ADMIN_PASSWORD = process.env.LAB_ADMIN_PASSWORD ?? 'qa-admin-pass-2026'
if (!URL_ || !ANON || !SERVICE) throw new Error('Set SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY')
if (/supabase\.co/.test(URL_)) throw new Error('Refusing to run against a hosted project: these tests write throwaway data')

const opts = { auth: { persistSession: false, autoRefreshToken: false } }
const anon = createClient(URL_, ANON, opts)
const svc = createClient(URL_, SERVICE, opts)

// ── tiny harness ──────────────────────────────────────────────────────────
const results = []
let section = ''
const group = name => { section = name; console.log(`\n${name}`) }
async function test(name, fn) {
  try {
    await fn()
    results.push({ section, name, ok: true })
    console.log(`  ✓ ${name}`)
  } catch (e) {
    results.push({ section, name, ok: false, error: e.message })
    console.log(`  ✗ ${name}\n      ${e.message}`)
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg) }
const eq = (a, b, msg) => assert(a === b, `${msg}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`)
const ok = (r, what) => { if (r.error) throw new Error(`${what}: ${r.error.message}`); return r.data }
const fails = (r, what, re) => {
  assert(r.error, `${what} should have been refused`)
  if (re) assert(re.test(r.error.message), `${what}: unexpected error "${r.error.message}"`)
}
const near = (a, b, msg, eps = 0.051) => assert(Math.abs(Number(a) - Number(b)) <= eps, `${msg}: expected ≈${b}, got ${a}`)

const stamp = Date.now().toString(36)
const createdUsers = []
async function labUser(tag, extra = {}) {
  const c = createClient(URL_, ANON, opts)
  const email = `lab-test-${tag}-${stamp}@example.com`
  const r = await c.auth.signUp({
    email, password: `pw-${stamp}-${tag}-2026`,
    options: { data: { account: 'lab', full_name: `Test ${tag}`, consent_version: '2026-10', consents: { terms: true, privacy: true, marketing: false, partner_sharing: true }, ...extra } },
  })
  ok(r, `sign up ${tag}`)
  assert(r.data.session, 'local auth should return a session (email confirmation off)')
  createdUsers.push(r.data.user.id)
  return { c, id: r.data.user.id, email }
}
const BRAND = {
  name: 'Test Brand', origin_country: 'NL', industry: 'fashion', product_category: 'accessories', offering: 'physical',
  customer_segments: ['professionals'], price_tier: 'premium', sales_channels: ['own_ecommerce'], current_markets: ['NL'],
  target_markets: ['DE', 'BE', 'GB'], distribution_model: 'retail', languages: ['en', 'nl'],
}

// ── independent scoring model (mirrors docs/lab/scoring.md) ────────────────
async function loadVersion(versionId) {
  const v = ok(await svc.from('lab_assessment_versions').select('*').eq('id', versionId).single(), 'version')
  const qs = ok(await svc.from('lab_questions').select('*, lab_options(*)').eq('version_id', versionId).order('sort'), 'questions')
  return { v, qs }
}
function holds(cond, brand, answers) {
  if (!cond) return true
  const val = cond.source === 'brand' ? [brand[cond.field]].flat().filter(x => x != null) : answers[cond.question] ?? []
  if (cond.in) return val.some(x => cond.in.includes(x))
  if (cond.not_in) return !val.some(x => cond.not_in.includes(x))
  return true
}
function expectedScore({ v, qs }, brand, answers) {
  const eff = {}
  const acc = {}
  for (const q of [...qs].sort((a, b) => a.sort - b.sort || a.key.localeCompare(b.key))) {
    if (!holds(q.applies_if, brand, eff)) continue
    const sel = answers[q.key] ?? []
    const opts_ = q.lab_options.filter(o => sel.includes(o.key))
    if (!opts_.length || (q.kind !== 'multi' && opts_.length > 1)) continue
    eff[q.key] = sel
    if (opts_.some(o => o.is_na)) continue
    const real = opts_.filter(o => !o.is_na).map(o => Number(o.score))
    const s = q.kind === 'multi' ? Math.min(100, real.reduce((a, b) => a + b, 0)) : Math.max(...real)
    const a = (acc[q.category] ??= { wsum: 0, wtot: 0 })
    a.wsum += Number(q.weight) * s
    a.wtot += Number(q.weight)
  }
  let num = 0, den = 0
  const cats = {}
  for (const [c, w] of Object.entries(v.category_weights)) {
    if (acc[c]?.wtot > 0) { const raw = acc[c].wsum / acc[c].wtot; cats[c] = raw; num += w * raw; den += w }
  }
  const overall = den ? Math.round((num / den) * 10) / 10 : null
  const band = v.bands.find(b => overall >= b.min && overall < b.max + 1)
  return { overall, cats, band: band?.key }
}

// answer every applicable question with a pattern, in the order the app does
async function answerAll(c, aid, pick) {
  let s = ok(await c.rpc('lab_assessment_state', { p_assessment: aid }), 'state')
  const given = {}
  for (let guard = 0; guard < 60; guard++) {
    const next = s.questions.find(q => s.applicable.includes(q.key) && !(q.key in s.answers))
    if (!next) break
    const keys = pick(next)
    given[next.key] = keys
    ok(await c.rpc('lab_save_answer', { p_assessment: aid, p_question: next.key, p_options: keys }), `answer ${next.key}`)
    s = ok(await c.rpc('lab_assessment_state', { p_assessment: aid }), 'state')
  }
  return { state: s, given: s.answers ?? given }
}

// ═════════════════════════════════════════════════════════════════════════
const admin = createClient(URL_, ANON, opts)
ok(await admin.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }), 'admin sign in')
const settings0 = ok(await svc.from('lab_settings').select('*').eq('id', 1).single(), 'settings')
assert(settings0.fixtures_enabled, 'apply supabase/seed/lab_fixtures.sql first (fixtures_enabled is false)')
const published = ok(await svc.from('lab_assessment_versions').select('id, version').eq('status', 'published').single(), 'published version')

let A, B, brandA, brandB, aidA, resultA, scoreA, matchesA
const P = Object.fromEntries(ok(await svc.from('lab_partners').select('id, website_domain').eq('is_fixture', true), 'fixtures').map(p => [p.website_domain.split('.')[0], p.id]))

group('Accounts & roles')
await test('Lab sign-up creates a Lab profile and consent records, never a CMS profile', async () => {
  A = await labUser('a')
  const prof = ok(await svc.from('lab_profiles').select('*').eq('user_id', A.id).single(), 'profile')
  eq(prof.full_name, 'Test a', 'full name from metadata')
  const cons = ok(await svc.from('lab_consents').select('kind, granted, version').eq('user_id', A.id), 'consents')
  eq(cons.length, 4, 'consent rows')
  assert(cons.find(x => x.kind === 'marketing').granted === false, 'marketing consent stored as declined')
  const cms = ok(await svc.from('profiles').select('id').eq('id', A.id), 'cms profile')
  eq(cms.length, 0, 'CMS profile rows for a Lab user')
})
await test('A Lab user is not an administrator', async () => {
  const boot = ok(await A.c.rpc('lab_bootstrap'), 'bootstrap')
  eq(boot.is_admin, false, 'is_admin')
  fails(await A.c.rpc('lab_admin_stats', { p_days: 30 }), 'admin stats as user', /admin|permission/i)
  fails(await A.c.rpc('lab_admin_users'), 'admin users as user')
})
await test('Visitors cannot reach private Lab data', async () => {
  fails(await anon.rpc('lab_bootstrap'), 'bootstrap as anon')
  for (const t of ['lab_brands', 'lab_partners', 'lab_results', 'lab_introductions', 'lab_partner_contacts', 'lab_introduction_notes']) {
    const r = await anon.from(t).select('*').limit(1)
    assert(r.error || r.data.length === 0, `${t} readable by anon`)
  }
})
await test('Visitors can read the published questionnaire, weights and markets', async () => {
  const qs = ok(await anon.from('lab_questions').select('key, in_preview').eq('version_id', published.id), 'anon questions')
  assert(qs.length >= 15 && qs.length <= 25, `question count ${qs.length}`)
  eq(qs.filter(q => q.in_preview).length, 6, 'preview questions')
  const v = ok(await anon.from('lab_assessment_versions').select('category_weights').eq('id', published.id).single(), 'anon weights')
  eq(Object.values(v.category_weights).reduce((a, b) => a + b, 0), 100, 'weights total')
  const ms = ok(await A.c.from('lab_markets').select('code').eq('status', 'published'), 'markets')
  eq(ms.length, 9, 'published markets')
})
await test('Anonymous analytics accept only allow-listed events', async () => {
  ok(await anon.rpc('lab_track', { p_kind: 'landing_cta', p_props: { cta: 'test' } }), 'track allowed')
  const n0 = (await svc.from('lab_events').select('*', { count: 'exact', head: true })).count
  ok(await anon.rpc('lab_track', { p_kind: 'anything_else', p_props: { email: 'x@example.com' } }), 'unknown kind is ignored')
  const n1 = (await svc.from('lab_events').select('*', { count: 'exact', head: true })).count
  eq(n1, n0, 'events written for an unknown kind')
  const last = ok(await svc.from('lab_events').select('props').order('id', { ascending: false }).limit(1), 'last')
  assert(!JSON.stringify(last).includes('@'), 'personal data stored in analytics')
})
await test('Users cannot call internal scoring functions or write computed tables', async () => {
  fails(await A.c.rpc('lab_score_core', { p_version: published.id, p_brand: {}, p_answers: {} }), 'lab_score_core')
  fails(await A.c.rpc('lab_match_one', {}), 'lab_match_one')
  fails(await A.c.from('lab_results').insert({ brand_id: '00000000-0000-0000-0000-000000000000' }), 'insert result')
  fails(await A.c.from('lab_matches').insert({ run_id: '00000000-0000-0000-0000-000000000000' }), 'insert match')
})

group('Brands')
await test('Create a brand; the creator becomes its owner', async () => {
  brandA = ok(await A.c.from('lab_brands').insert({ ...BRAND, name: 'Test Brand A' }).select().single(), 'insert brand')
  const m = ok(await A.c.from('lab_brand_members').select('role').eq('brand_id', brandA.id), 'members')
  eq(m[0]?.role, 'owner', 'membership role')
})
await test('Brand validation rejects unknown market codes and enum values', async () => {
  fails(await A.c.from('lab_brands').insert({ ...BRAND, target_markets: ['XX'] }), 'unknown market')
  fails(await A.c.from('lab_brands').insert({ ...BRAND, target_markets: ['US'] }), 'market the Lab does not cover', /cover/)
  const t = ok(await A.c.from('lab_brands').insert({ ...BRAND, name: 'Current markets anywhere', current_markets: ['TR'] }).select('id').single(), 'current market outside the Lab')
  ok(await A.c.from('lab_brands').delete().eq('id', t.id), 'owner deletes brand')
  fails(await A.c.from('lab_brands').insert({ ...BRAND, price_tier: 'cheap' }), 'bad price tier')
  fails(await A.c.from('lab_brands').insert({ ...BRAND, created_by: '00000000-0000-0000-0000-000000000000' }), 'spoofed creator')
})
await test('A user cannot see, edit or assess another user’s brand', async () => {
  B = await labUser('b')
  brandB = ok(await B.c.from('lab_brands').insert({ ...BRAND, name: 'Test Brand B', industry: 'home', product_category: 'ceramics' }).select().single(), 'brand B')
  eq(ok(await B.c.from('lab_brands').select('id').eq('id', brandA.id), 'read A').length, 0, 'B sees A’s brand')
  const upd = ok(await B.c.from('lab_brands').update({ name: 'hijack' }).eq('id', brandA.id).select(), 'update A')
  eq(upd.length, 0, 'rows B updated in A’s brand')
  fails(await B.c.rpc('lab_start_assessment', { p_brand: brandA.id }), 'B starts assessment on A')
  fails(await B.c.rpc('lab_run_matching', { p_brand: brandA.id, p_filters: {} }), 'B runs matching for A')
  fails(await B.c.rpc('lab_dashboard', { p_brand: brandA.id }), 'B reads A’s dashboard')
  fails(await B.c.from('lab_brand_members').insert({ brand_id: brandA.id, user_id: B.id, role: 'owner' }), 'B adds itself to A')
})

group('Readiness assessment & scoring')
let ver
await test('An assessment cannot be completed with required answers missing', async () => {
  aidA = ok(await A.c.rpc('lab_start_assessment', { p_brand: brandA.id }), 'start')
  ok(await A.c.rpc('lab_save_answer', { p_assessment: aidA, p_question: 'positioning', p_options: ['versions'] }), 'one answer')
  fails(await A.c.rpc('lab_complete_assessment', { p_assessment: aidA }), 'complete with gaps', /required|missing|answer/i)
})
await test('Option scores are not exposed to users', async () => {
  const s = ok(await A.c.rpc('lab_assessment_state', { p_assessment: aidA }), 'state')
  assert(s.questions.every(q => q.options.every(o => !('score' in o))), 'an option carries a score')
})
await test('Score matches an independent computation (mixed answers, N/A, multi-select)', async () => {
  ver = await loadVersion(published.id)
  let i = 0
  const { given } = await answerAll(A.c, aidA, q => {
    i++
    const na = q.options.find(o => o.is_na)
    if (na) return [na.key] // exercise N/A wherever it is offered
    if (q.kind === 'multi') return q.options.slice(0, 2).map(o => o.key)
    return [q.options[i % q.options.length].key]
  })
  const resId = ok(await A.c.rpc('lab_complete_assessment', { p_assessment: aidA }), 'complete')
  resultA = ok(await A.c.from('lab_results').select('*').eq('id', resId).single(), 'result')
  const exp = expectedScore(ver, brandA, given)
  near(resultA.overall, exp.overall, 'overall')
  for (const [c, raw] of Object.entries(exp.cats)) near(resultA.categories[c].score, Math.round(raw * 10) / 10, `category ${c}`)
  eq(resultA.band_key, exp.band, 'band')
  eq(resultA.version, published.version, 'version stored on result')
  scoreA = resultA.overall
})
await test('N/A answers leave the question out of the denominator', async () => {
  const naCats = Object.entries(resultA.categories).filter(([, c]) => c.na > 0)
  assert(naCats.length > 0, 'no N/A was recorded')
  for (const [k, c] of naCats) assert(c.answered >= c.na, `${k}: answered ${c.answered} < na ${c.na}`)
})
await test('Conditional questions only apply when their condition holds', async () => {
  const q = ver.qs.find(x => x.key === 'unit_economics')
  assert(q?.applies_if, 'unit_economics has a condition')
  const s = await A.c.rpc('lab_start_assessment', { p_brand: brandA.id, p_prefill: false })
  const aid = ok(s, 'start fresh')
  ok(await A.c.rpc('lab_save_answer', { p_assessment: aid, p_question: 'channels', p_options: ['not_selling'] }), 'not selling')
  const st = ok(await A.c.rpc('lab_assessment_state', { p_assessment: aid }), 'state')
  assert(!st.applicable.includes('unit_economics'), 'unit_economics still applicable for a brand that is not selling')
  ok(await svc.from('lab_assessments').delete().eq('id', aid), 'cleanup open assessment')
})
await test('Same answers → same score (deterministic)', async () => {
  const answers = ok(await svc.from('lab_responses').select('option_keys, lab_questions(key)').eq('assessment_id', aidA), 'responses')
    .reduce((m, r) => ({ ...m, [r.lab_questions.key]: r.option_keys }), {})
  for (let i = 0; i < 3; i++) {
    const again = ok(await admin.rpc('lab_admin_preview_score', { p_version: published.id, p_brand: brandA, p_answers: answers }), 'preview')
    near(again.overall, scoreA, `re-score #${i + 1}`)
  }
})
await test('Results carry rule-based recommendations, including option-linked ones', async () => {
  const recs = ok(await A.c.from('lab_result_recommendations').select('rule_key').eq('result_id', resultA.id), 'recs')
  assert(recs.length > 0, 'no recommendations')
})

group('Assessment versions (admin)')
let draftId
await test('Admin clones, previews and publishes a new version; old results keep their version and score', async () => {
  draftId = ok(await admin.rpc('lab_admin_clone_version', { p_version: published.id }), 'clone')
  const w = { brand: 40, pmf: 12, commercial: 12, operations: 12, partnership: 12, strategy: 12 }
  ok(await admin.from('lab_assessment_versions').update({ category_weights: w }).eq('id', draftId), 'edit draft weights')
  const answers = ok(await svc.from('lab_responses').select('option_keys, lab_questions(key)').eq('assessment_id', aidA), 'responses')
    .reduce((m, r) => ({ ...m, [r.lab_questions.key]: r.option_keys }), {})
  const prev = ok(await admin.rpc('lab_admin_preview_score', { p_version: draftId, p_brand: brandA, p_answers: answers }), 'preview')
  const exp = expectedScore(await loadVersion(draftId), brandA, answers)
  near(prev.overall, exp.overall, 'preview under new weights')
  ok(await admin.rpc('lab_admin_publish_version', { p_version: draftId }), 'publish')
  const old = ok(await A.c.from('lab_results').select('version, overall').eq('id', resultA.id).single(), 'old result')
  eq(old.version, published.version, 'old result version')
  near(old.overall, scoreA, 'old result score unchanged')
})
await test('Published and archived questions are frozen', async () => {
  const q = ver.qs[0]
  const r = await admin.from('lab_questions').update({ prompt: 'Changed after publishing?' }).eq('id', q.id).select()
  assert(r.error || (r.data ?? []).length === 0, 'an archived question was edited')
  const o = await admin.from('lab_options').update({ score: 1 }).eq('id', q.lab_options[0].id).select()
  assert(o.error || (o.data ?? []).length === 0, 'an archived option was edited')
})
await test('Publishing validates weights and bands', async () => {
  const d = ok(await admin.rpc('lab_admin_clone_version', { p_version: draftId }), 'clone again')
  ok(await admin.from('lab_assessment_versions').update({ category_weights: { brand: 50, pmf: 20, commercial: 15, operations: 20, partnership: 15, strategy: 15 } }).eq('id', d), 'bad weights')
  fails(await admin.rpc('lab_admin_publish_version', { p_version: d }), 'publish with weights ≠ 100', /100/)
  ok(await admin.from('lab_assessment_versions').update({ category_weights: ver.v.category_weights, bands: [{ key: 'a', label: 'A', min: 0, max: 50 }, { key: 'b', label: 'B', min: 60, max: 100 }] }).eq('id', d), 'gappy bands')
  fails(await admin.rpc('lab_admin_publish_version', { p_version: d }), 'publish with a gap in bands', /gap|band/i)
  // restore the original weights and bands as the live version
  ok(await admin.from('lab_assessment_versions').update({ category_weights: ver.v.category_weights, bands: ver.v.bands, notes: 'Restored by lab-tests' }).eq('id', d), 'restore')
  ok(await admin.rpc('lab_admin_publish_version', { p_version: d }), 'publish restored')
})
await test('A Lab user cannot edit the questionnaire', async () => {
  const r = await A.c.from('lab_assessment_versions').update({ notes: 'hack' }).eq('id', draftId).select()
  assert(r.error || (r.data ?? []).length === 0, 'user updated a version')
  fails(await A.c.rpc('lab_admin_clone_version', { p_version: draftId }), 'user clones a version')
})

group('Market comparison')
await test('Compares 1–3 markets with evidence labels; refuses more than 3', async () => {
  const fit = ok(await A.c.rpc('lab_market_fit', { p_brand: brandA.id, p_codes: ['DE', 'BE', 'GB'] }), 'fit')
  eq(fit.markets.length, 3, 'markets returned')
  const ev = new Set(fit.markets.flatMap(m => m.factors.map(f => f.evidence)))
  assert(ev.has('self_reported') && ev.has('database'), `evidence labels: ${[...ev]}`)
  assert(fit.markets.every(m => Array.isArray(m.missing)), 'missing information listed')
  fails(await A.c.rpc('lab_market_fit', { p_brand: brandA.id, p_codes: ['DE', 'BE', 'GB', 'FR'] }), 'four markets')
})
await test('No market-fit score without enough inputs', async () => {
  const fit = ok(await B.c.rpc('lab_market_fit', { p_brand: brandB.id, p_codes: ['DE'] }), 'fit without a result')
  assert(fit.markets[0].score == null, `brand without a readiness result got a score ${fit.markets[0].score}`)
})
await test('UK is treated as outside the EU customs border', async () => {
  const fit = ok(await A.c.rpc('lab_market_fit', { p_brand: brandA.id, p_codes: ['GB', 'BE'] }), 'fit')
  const gb = fit.markets.find(m => m.code === 'GB'), be = fit.markets.find(m => m.code === 'BE')
  const lg = m => m.factors.find(f => f.key === 'logistics')?.value
  assert(lg(gb) < lg(be), `logistics GB ${lg(gb)} should be below BE ${lg(be)}`)
})

group('Matching')
await test('Hard filters exclude mismatched partners; unlisted partners never appear', async () => {
  const run = ok(await A.c.rpc('lab_run_matching', { p_brand: brandA.id, p_filters: {} }), 'run')
  matchesA = run.matches
  const ids = matchesA.map(m => m.partner.id)
  assert(!ids.includes(P['unlisted-prospect']), 'unlisted partner returned')
  assert(!ids.includes(P['nordlys-dist']), 'industry-mismatched partner returned')
  assert(!ids.includes(P['milano-outlet']), 'partner two price tiers away returned')
  assert(ids.includes(P['canal-concept']), 'expected the concept store to match')
})
await test('Ranked by score, each with criteria, reasons and limitations', async () => {
  for (let i = 1; i < matchesA.length; i++) assert(matchesA[i - 1].score >= matchesA[i].score, 'not sorted by score')
  matchesA.forEach((m, i) => eq(m.rank, i + 1, 'rank'))
  for (const m of matchesA) {
    eq(m.criteria.length, 6, 'criteria per match')
    assert(m.reasons.length > 0, 'no reasons')
    const w = m.criteria.reduce((s, c) => s + c.weight, 0)
    const got = m.criteria.reduce((s, c) => s + (c.score == null ? 0 : c.weight * c.score), 0)
    eq(m.score, Math.round((100 * got) / w), `score of ${m.partner.name}`)
  }
})
await test('Missing partner data never counts as a positive match', async () => {
  const t = matchesA.find(m => m.partner.id === P['thames-entry'])
  assert(t, 'expected the market-entry partner (sparse data) in results')
  assert(t.missing.length >= 3, 'missing criteria not reported')
  assert(t.coverage < 100, 'coverage should drop with missing data')
  assert(t.criteria.filter(c => c.score == null).every(c => t.missing.includes(c.key)), 'missing list mismatch')
})
await test('Filters narrow the results', async () => {
  const run = ok(await A.c.rpc('lab_run_matching', { p_brand: brandA.id, p_filters: { country: 'DE' } }), 'filtered run')
  assert(run.matches.every(m => m.partner.country_code === 'DE' || m.partner.coverage.includes('DE')), 'filter by country ignored')
})
await test('Fixture partners disappear when fixtures are switched off', async () => {
  ok(await svc.from('lab_settings').update({ fixtures_enabled: false }).eq('id', 1), 'fixtures off')
  try {
    const run = ok(await A.c.rpc('lab_run_matching', { p_brand: brandA.id, p_filters: {} }), 'run')
    eq(run.matches.filter(m => m.partner.is_fixture).length, 0, 'fixture partners shown')
  } finally {
    ok(await svc.from('lab_settings').update({ fixtures_enabled: true }).eq('id', 1), 'fixtures on')
  }
})
await test('Run metadata is stored (config version, weights, result used)', async () => {
  const runs = ok(await A.c.from('lab_match_runs').select('*').eq('brand_id', brandA.id).order('created_at', { ascending: false }).limit(1), 'runs')
  assert(runs[0]?.config_id && runs[0]?.result_id, 'config/result not stored on the run')
})
await test('Partner data shown to brands never includes internal notes or contacts', async () => {
  const prof = ok(await A.c.rpc('lab_partner_profile', { p_partner: P['canal-concept'], p_brand: brandA.id }), 'profile')
  const blob = JSON.stringify([prof, matchesA])
  assert(!/FIXTURE internal note/.test(blob), 'internal note leaked')
  assert(!/internal_notes|contacts/.test(blob), 'internal fields present')
  eq(ok(await A.c.from('lab_partner_contacts').select('id'), 'contacts').length, 0, 'contacts readable by user')
})
await test('Matching is rate-limited', async () => {
  ok(await svc.from('lab_settings').update({ match_runs_per_hour: 1 }).eq('id', 1), 'tight limit')
  try {
    fails(await A.c.rpc('lab_run_matching', { p_brand: brandA.id, p_filters: {} }), 'over the hourly limit', /limit|too many/i)
  } finally {
    ok(await svc.from('lab_settings').update({ match_runs_per_hour: settings0.match_runs_per_hour }).eq('id', 1), 'restore limit')
  }
})

group('Shortlist')
await test('Save with a note, list, and remove', async () => {
  ok(await A.c.from('lab_saved_matches').insert({ brand_id: brandA.id, partner_id: P['canal-concept'], note: 'Ask about consignment' }), 'save')
  const list = ok(await A.c.rpc('lab_saved_list', { p_brand: brandA.id }), 'list')
  assert(JSON.stringify(list).includes('Ask about consignment'), 'note missing from shortlist')
  ok(await A.c.from('lab_saved_matches').update({ note: 'Updated note' }).eq('brand_id', brandA.id).eq('partner_id', P['canal-concept']), 'edit note')
  ok(await A.c.from('lab_saved_matches').delete().eq('brand_id', brandA.id).eq('partner_id', P['canal-concept']), 'remove')
  ok(await A.c.from('lab_saved_matches').insert({ brand_id: brandA.id, partner_id: P['canal-concept'], note: 'Keep' }), 'save again')
})
await test('Cannot save an unlisted partner or into another brand', async () => {
  fails(await A.c.from('lab_saved_matches').insert({ brand_id: brandA.id, partner_id: P['unlisted-prospect'] }), 'save unlisted')
  fails(await B.c.from('lab_saved_matches').insert({ brand_id: brandA.id, partner_id: P['rhein-wholesale'] }), 'save into A as B')
})

group('Introductions & research requests')
let introId, researchId
await test('Request an introduction; duplicates are refused; staff inbox notified', async () => {
  introId = ok(await A.c.rpc('lab_request_introduction', { p_brand: brandA.id, p_partner: P['canal-concept'], p_purpose: 'retail_listing', p_message: 'We would like to discuss a first order.' }), 'request')
  fails(await A.c.rpc('lab_request_introduction', { p_brand: brandA.id, p_partner: P['canal-concept'], p_purpose: 'retail_listing', p_message: '' }), 'duplicate', /already/i)
  fails(await A.c.rpc('lab_request_introduction', { p_brand: brandA.id, p_partner: P['unlisted-prospect'], p_purpose: 'retail_listing', p_message: '' }), 'unlisted partner')
  const inbox = ok(await admin.from('lab_notifications').select('title').is('user_id', null).ilike('title', '%Test Brand A%'), 'staff inbox')
  assert(inbox.length > 0, 'staff not notified')
})
await test('Users cannot change a request’s status themselves', async () => {
  const r = await A.c.from('lab_introductions').update({ status: 'approved' }).eq('id', introId).select()
  assert(r.error || (r.data ?? []).length === 0, 'user approved its own request')
  fails(await A.c.rpc('lab_admin_update_introduction', { p_id: introId, p_status: 'approved' }), 'admin RPC as user')
})
await test('Admin review: public note reaches the user, internal note never does', async () => {
  ok(await admin.rpc('lab_admin_update_introduction', { p_id: introId, p_status: 'more_info_needed', p_note: 'Could you share your wholesale price list?', p_internal: 'INTERNAL: buyer prefers spring.' }), 'admin update')
  const intro = ok(await A.c.from('lab_introductions').select('status').eq('id', introId).single(), 'user reads status')
  eq(intro.status, 'more_info_needed', 'status seen by user')
  const ev = ok(await A.c.from('lab_introduction_events').select('note').eq('introduction_id', introId), 'events')
  assert(ev.some(e => e.note?.includes('wholesale price list')), 'public note not visible')
  eq(ok(await A.c.from('lab_introduction_notes').select('id'), 'internal notes').length, 0, 'internal notes readable by user')
  const notes = ok(await A.c.from('lab_notifications').select('title, body'), 'user notifications')
  assert(!JSON.stringify(notes).includes('INTERNAL'), 'internal note leaked in a notification')
  assert(notes.some(n => /more info needed/i.test(n.title)), 'user not notified of status change')
  const dash = ok(await A.c.rpc('lab_dashboard', { p_brand: brandA.id }), 'dashboard')
  assert(!JSON.stringify(dash).includes('INTERNAL'), 'internal note leaked in dashboard')
})
await test('Brand lists its requests (public history only), replies, and others cannot', async () => {
  const reqs = ok(await A.c.rpc('lab_my_requests', { p_brand: brandA.id }), 'my requests')
  const mine = reqs.find(r => r.id === introId)
  assert(mine && mine.partner?.name, 'request with partner name missing')
  assert(!JSON.stringify(reqs).includes('INTERNAL'), 'internal note in my_requests')
  fails(await B.c.rpc('lab_my_requests', { p_brand: brandA.id }), 'B lists A’s requests')
  fails(await B.c.rpc('lab_reply_introduction', { p_id: introId, p_note: 'hijack' }), 'B replies on A’s request')
  ok(await A.c.rpc('lab_reply_introduction', { p_id: introId, p_note: 'Price list sent.' }), 'reply')
  eq(ok(await A.c.from('lab_introductions').select('status').eq('id', introId).single(), 'status').status, 'under_review', 'status after reply')
})
await test('“Introduction sent” creates an opportunity on the brand’s timeline', async () => {
  ok(await admin.rpc('lab_admin_update_introduction', { p_id: introId, p_status: 'introduction_sent', p_note: 'Introduced by email.' }), 'sent')
  const opp = ok(await A.c.from('lab_opportunities').select('id, status').eq('introduction_id', introId), 'opportunity')
  eq(opp.length, 1, 'opportunities created')
})
await test('Empty state: a research request without a partner', async () => {
  researchId = ok(await A.c.rpc('lab_request_research', { p_brand: brandA.id, p_markets: ['DK'], p_types: ['distributor'], p_message: 'Looking for a Nordic distributor.' }), 'research')
  const r = ok(await A.c.from('lab_introductions').select('partner_id, market_codes').eq('id', researchId).single(), 'read')
  eq(r.partner_id, null, 'partner on research request')
  eq(r.market_codes[0], 'DK', 'market recorded')
})

await test('A brand can withdraw an open request', async () => {
  ok(await A.c.rpc('lab_withdraw_introduction', { p_id: researchId }), 'withdraw')
  eq(ok(await A.c.from('lab_introductions').select('status').eq('id', researchId).single(), 'status').status, 'closed', 'status after withdrawal')
})

group('Opportunities')
await test('Status and next-action changes are recorded on the timeline', async () => {
  const [opp] = ok(await A.c.from('lab_opportunities').select('id').eq('introduction_id', introId), 'opp')
  ok(await A.c.from('lab_opportunities').update({ status: 'in_discussion', next_action: 'Send samples', next_action_on: '2026-11-01' }).eq('id', opp.id), 'update')
  ok(await A.c.from('lab_opportunity_activities').insert({ opportunity_id: opp.id, kind: 'note', body: 'Call went well.' }), 'note')
  const acts = ok(await A.c.from('lab_opportunity_activities').select('kind, body').eq('opportunity_id', opp.id), 'activities')
  assert(acts.some(a => a.kind === 'status'), 'status change not logged')
  assert(acts.some(a => a.kind === 'next_action'), 'next action not logged')
  assert(acts.some(a => a.body === 'Call went well.'), 'note missing')
})
await test('Users cannot forge system entries or hidden activities', async () => {
  const [opp] = ok(await A.c.from('lab_opportunities').select('id').eq('introduction_id', introId), 'opp')
  const r = ok(await A.c.from('lab_opportunity_activities').insert({ opportunity_id: opp.id, kind: 'system', body: 'forged', visible_to_user: false }).select().single(), 'insert')
  eq(r.kind, 'note', 'kind coerced')
  eq(r.visible_to_user, true, 'visibility coerced')
  fails(await B.c.from('lab_opportunity_activities').insert({ opportunity_id: opp.id, kind: 'note', body: 'x' }), 'B writes to A’s opportunity')
})
await test('A brand can track an opportunity without an introduction', async () => {
  ok(await A.c.from('lab_opportunities').insert({ brand_id: brandA.id, kind: 'retail', title: 'Pop-up in Antwerp', status: 'exploring' }), 'manual opportunity')
})

group('Reports')
let reportId
await test('Generate a report snapshot; history is kept; no internal data inside', async () => {
  reportId = ok(await A.c.rpc('lab_generate_report', { p_brand: brandA.id }), 'generate')
  const rep = ok(await A.c.from('lab_reports').select('*').eq('id', reportId).single(), 'read')
  for (const k of ['brand', 'readiness', 'recommendations', 'methodology']) assert(k in rep.snapshot, `snapshot lacks ${k}`)
  const blob = JSON.stringify(rep.snapshot)
  assert(!blob.includes('INTERNAL') && !blob.includes('FIXTURE internal note'), 'internal note in report')
  eq(ok(await B.c.from('lab_reports').select('id').eq('id', reportId), 'B reads A report').length, 0, 'other user sees report')
})

group('Administration')
await test('Admin overview and user list work for staff only', async () => {
  const st = ok(await admin.rpc('lab_admin_stats', { p_days: 30 }), 'stats')
  assert(typeof st === 'object', 'stats shape')
  const users = ok(await admin.rpc('lab_admin_users'), 'users')
  assert(JSON.stringify(users).includes(A.email), 'user list lacks test user')
})
await test('CSV import validates rows and deduplicates (dry run, then write)', async () => {
  const rows = [
    { name: 'Dup of canal', website: 'https://www.canal-concept.example/shop', type_key: 'concept_store', country_code: 'NL' },
    { name: `Import Test ${stamp}`, website: `https://import-${stamp}.example`, type_key: 'retailer', country_code: 'de', markets: ['DE'] },
    { name: `Import Test ${stamp} again`, website: `https://import-${stamp}.example/about`, type_key: 'retailer' },
    { name: 'Bad type', type_key: 'spaceship' },
    { name: '', type_key: 'retailer' },
    { name: 'Bad site', website: 'ftp://x.example', type_key: 'retailer' },
  ]
  const dry = ok(await admin.rpc('lab_admin_import_partners', { p_rows: rows, p_dry_run: true }), 'dry run')
  eq(dry.inserted, 1, 'new rows'); eq(dry.updated, 1, 'matched existing'); eq(dry.skipped, 4, 'skipped')
  eq(ok(await svc.from('lab_partners').select('id').eq('website_domain', `import-${stamp}.example`), 'dry wrote').length, 0, 'rows written by dry run')
  const real = ok(await admin.rpc('lab_admin_import_partners', { p_rows: [rows[1]], p_dry_run: false }), 'import')
  eq(real.inserted, 1, 'inserted')
  const p = ok(await svc.from('lab_partners').select('listed, verification_status, country_code').eq('website_domain', `import-${stamp}.example`).single(), 'imported row')
  eq(p.listed, false, 'imported rows arrive unlisted'); eq(p.verification_status, 'research_prospect', 'imported status'); eq(p.country_code, 'DE', 'country normalised')
  fails(await A.c.rpc('lab_admin_import_partners', { p_rows: rows, p_dry_run: true }), 'import as user')
})
await test('Partner changes are audited', async () => {
  const a = ok(await svc.from('lab_audit').select('action, entity').eq('entity', 'lab_partners').order('id', { ascending: false }).limit(5), 'audit')
  assert(a.length > 0, 'no audit rows for partners')
  eq(ok(await A.c.from('lab_audit').select('id'), 'audit as user').length, 0, 'audit readable by user')
})
await test('Matching weights are configurable and validated', async () => {
  const cfg = ok(await svc.from('lab_matching_configs').select('*').eq('active', true).single(), 'active config')
  fails(await admin.rpc('lab_admin_set_matching', { p_weights: { ...cfg.weights, category: 90 }, p_min_score: 40, p_notes: 'bad' }), 'weights ≠ 100')
  ok(await admin.rpc('lab_admin_set_matching', { p_weights: cfg.weights, p_min_score: cfg.min_score, p_notes: 'Re-saved by lab-tests' }), 'save same weights')
  fails(await A.c.rpc('lab_admin_set_matching', { p_weights: cfg.weights, p_min_score: 40, p_notes: '' }), 'as user')
})

group('Privacy: export & deletion')
await test('Export my data returns the user’s own records', async () => {
  const x = ok(await A.c.rpc('lab_export_my_data'), 'export')
  const blob = JSON.stringify(x)
  assert(blob.includes('Test Brand A') && blob.includes('privacy'), 'export lacks brand or consents')
  assert(!blob.includes('Test Brand B'), 'export includes another user’s brand')
  assert(!blob.includes('INTERNAL'), 'export includes internal notes')
})
await test('Delete account removes the user and their solely-owned brands', async () => {
  ok(await B.c.rpc('lab_delete_my_account'), 'delete B')
  const u = await svc.auth.admin.getUserById(B.id)
  assert(u.error || !u.data?.user, 'auth user still exists')
  eq(ok(await svc.from('lab_brands').select('id').eq('id', brandB.id), 'brand B').length, 0, 'brand B remains')
  createdUsers.splice(createdUsers.indexOf(B.id), 1)
})
await test('CMS staff cannot delete themselves through the Lab', async () => {
  fails(await admin.rpc('lab_delete_my_account'), 'staff self-delete', /staff/i)
})

// ── cleanup ───────────────────────────────────────────────────────────────
await svc.from('lab_partners').delete().like('website_domain', `import-${stamp}%`)
for (const id of createdUsers) {
  await svc.from('lab_brands').delete().eq('created_by', id)
  await svc.auth.admin.deleteUser(id)
}

const failed = results.filter(r => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (process.env.LAB_TEST_JSON) {
  const { writeFileSync } = await import('node:fs')
  writeFileSync(process.env.LAB_TEST_JSON, JSON.stringify({ ran_at: new Date().toISOString(), results }, null, 2))
}
process.exit(failed.length ? 1 : 0)
