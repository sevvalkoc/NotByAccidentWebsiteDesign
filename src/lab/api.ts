/* ── The Lab · client layer ────────────────────────────────────────────────
   Every read and write goes to Supabase. Everything that decides something
   (scores, matches, who may see what) runs in the database, in the RPCs of
   migration 0012, behind row-level security; this file only calls them.

   The Supabase client is imported lazily, so the public Lab pages don't
   ship it in the main bundle. */
import { useSyncExternalStore } from 'react'
import type { Session, SupabaseClient } from '@supabase/supabase-js'

let clientP: Promise<SupabaseClient | null> | null = null
export const getClient = () => (clientP ??= import('@/lib/supabase').then(m => m.supabase as SupabaseClient | null))

export class LabError extends Error {}
export const NOT_CONFIGURED = 'The Lab isn’t connected to its database in this environment.'

async function need(): Promise<SupabaseClient> {
  const c = await getClient()
  if (!c) throw new LabError(NOT_CONFIGURED)
  return c
}

/** Postgres messages from our own RPCs are written for people; driver and
 *  network errors are not, so those get a plain sentence. */
function human(msg: string): string {
  if (/fetch|network|Failed to/i.test(msg)) return 'We couldn’t reach the server. Check your connection and try again.'
  if (/JWT|not authenticated|sign in first/i.test(msg)) return 'Your session has ended. Sign in again.'
  if (/row-level security|permission denied/i.test(msg)) return 'You don’t have access to that.'
  return msg.replace(/^ERROR:\s*/, '')
}

export async function rpc<T>(fn: string, args?: Record<string, unknown>): Promise<T> {
  const c = await need()
  const { data, error } = await c.rpc(fn, args)
  if (error) throw new LabError(human(error.message))
  return data as T
}

/** A table query, with the same error handling. */
export async function q<T>(build: (c: SupabaseClient) => PromiseLike<{ data: unknown; error: { message: string } | null }>): Promise<T> {
  const c = await need()
  const { data, error } = await build(c)
  if (error) throw new LabError(human(error.message))
  return data as T
}

export const errMsg = (e: unknown) => (e instanceof Error ? e.message : String(e))

/* ── Types (shapes returned by the RPCs) ─────────────────────────────────── */
export type Consent = { granted: boolean; version: string; at: string }
export type Boot = {
  profile: { user_id: string; full_name: string | null; job_title: string | null } | null
  is_admin: boolean
  brands: { id: string; name: string; role: 'owner' | 'editor' }[]
  unread: number
  consents: Partial<Record<'terms' | 'privacy' | 'marketing' | 'partner_sharing', Consent>>
}
export type Brand = {
  id: string
  name: string
  website: string | null
  social_url: string | null
  origin_country: string | null
  industry: string | null
  product_category: string | null
  offering: string
  description: string | null
  logo_path: string | null
  customer_segments: string[]
  price_tier: string | null
  typical_price_eur: number | null
  sales_channels: string[]
  current_markets: string[]
  sales_stage: string | null
  capacity: string | null
  target_markets: string[]
  entry_timeline: string | null
  primary_objective: string | null
  distribution_model: string | null
  budget_range: string | null
  obstacles: string[]
  languages: string[]
  created_at: string
  updated_at: string
}
export type Category = { score: number | null; weight: number; answered: number; applicable: number; na: number; unanswered: number }
export type Result = {
  id: string
  assessment_id: string
  brand_id: string
  version_id: string
  version: number
  overall: number | null
  band_key: string | null
  band_label: string | null
  categories: Record<string, Category>
  contributions: { key: string; category: string; prompt: string; na: boolean; score?: number; weight: number; options: string[] }[]
  weights: Record<string, number>
  bands: Band[]
  answered: number
  applicable: number
  computed_at: string
}
export type Band = { key: string; min: number; max: number; label: string; summary?: string }
export type Recommendation = { rule_key: string; title: string; body: string; category: string | null; priority: number; partner_types?: string[] }
export type Question = {
  id: string
  key: string
  category: string
  kind: 'single' | 'multi' | 'scale'
  prompt: string
  help: string | null
  why: string | null
  weight: number
  required: boolean
  applies_if: unknown
  options: { key: string; label: string; is_na: boolean }[]
}
export type AssessmentState = {
  assessment: { id: string; brand_id: string; status: string; version_id: string; started_at?: string }
  version: { id: string; title: string; version: number; weights: Record<string, number> }
  questions: Question[]
  answers: Record<string, string[]>
  applicable: string[]
  answered: number
  applicable_count: number
  missing_required: string[]
}
export type Factor = { key: string; label: string; value: number | null; weight: number; evidence: Evidence; note: string; count?: number }
export type Evidence = 'self_reported' | 'verified' | 'database' | 'rule' | 'missing'
export type MarketFit = {
  code: string
  name: string
  score: number | null
  status: 'scored' | 'insufficient'
  rank?: number | null
  factors: Factor[]
  missing: string[]
  considerations: { label: string; text: string; evidence: Evidence; verified_at?: string | null }[]
  sources: { title: string; url: string; publisher: string | null; field: string; accessed_on: string | null }[]
  next_steps: string[]
  is_target: boolean
  profile: {
    currency: string | null
    eu_member: boolean | null
    languages: string[]
    confidence: 'unverified' | 'partial' | 'verified'
    last_verified_at: string | null
    outdated: boolean
    overview: string | null
    consumer_notes: string | null
  }
}
export type PartnerPublic = {
  id: string
  name: string
  website: string | null
  country_code: string | null
  city: string | null
  type_key: string
  type_label: string
  description: string | null
  industries: string[]
  product_categories: string[]
  price_tiers: string[]
  distribution_models: string[]
  business_size: string | null
  brand_requirements: string | null
  coverage: string[]
  verification_status: VerificationStatus
  accepts_introductions: boolean
  last_verified_at: string | null
  source_url: string | null
  is_fixture: boolean
}
export type VerificationStatus = 'research_prospect' | 'verified_organization' | 'contacted_prospect' | 'confirmed_partner'
export type Criterion = { key: string; label: string; score: number | null; weight: number; needs?: number }
export type Match = {
  rank: number
  score: number
  coverage: number
  partner: PartnerPublic
  criteria: Criterion[]
  reasons: string[]
  limitations: string[]
  missing: string[]
  saved: boolean
  introduction: { id: string; status: string } | null
}
export type MatchRun = {
  run: { id: string; created_at: string; filters: Record<string, string>; weights: Record<string, number>; eligible: number; excluded: number; min_score: number; config_version: number; used_result: string | null } | null
  matches: Match[]
}
export type Intro = {
  id: string
  brand_id: string
  partner_id: string | null
  purpose: string
  message: string | null
  market_codes: string[]
  partner_types: string[]
  status: IntroStatus
  created_at: string
  updated_at: string
}
export type IntroStatus = 'requested' | 'under_review' | 'more_info_needed' | 'approved' | 'declined' | 'introduction_sent' | 'in_discussion' | 'completed' | 'closed'
export type Opportunity = {
  id: string
  brand_id: string
  partner_id: string | null
  introduction_id: string | null
  kind: string
  title: string
  status: string
  next_action: string | null
  next_action_on: string | null
  notes: string | null
  created_at: string
  updated_at: string
  last_activity_at: string
}
export type Activity = { id: string; opportunity_id: string; kind: string; body: string; created_at: string }
export type Report = { id: string; brand_id: string; title: string; snapshot: ReportSnapshot; created_at: string }
export type ScoreRow = { key: string; score: number; weight: number }
export type MarketFitResult = {
  markets: MarketFit[]
  ranking: { order: string[]; reason: string; possible: boolean } | null
  readiness: { band: string | null; overall: number | null; version: number; computed_at: string } | null
}
export type SavedItem = { note: string | null; score: number | null; partner: PartnerPublic; saved_at: string; introduction: { id: string; status: IntroStatus } | null }
export type ReportSnapshot = {
  generated_at: string
  brand: Partial<Brand>
  objectives: Pick<Brand, 'obstacles' | 'budget_range' | 'entry_timeline' | 'target_markets' | 'primary_objective' | 'distribution_model'> | null
  readiness: {
    overall: number | null
    version: number
    answered: number
    applicable: number
    band_key: string | null
    band_label: string | null
    band_summary?: string | null
    categories: ScoreRow[]
    computed_at: string
  } | null
  strengths: ScoreRow[]
  risks: ScoreRow[]
  recommendations: { key: string; title: string; body: string; category: string | null; priority: number; partner_types: string[] }[]
  markets: MarketFitResult | null
  partner_types: { key: string; label: string }[]
  saved_matches: SavedItem[]
  introductions: { partner: string | null; status: IntroStatus; purpose: string; created_at: string }[]
  next_actions: { text: string; source: string }[]
  methodology: {
    bands: Band[]
    limitations: string[]
    category_weights: Record<string, number>
    matching_weights: Record<string, number> | null
    assessment_version: number | null
    matching_version: number | null
  }
}
export type Dashboard = {
  brand: Brand
  latest_result: (Pick<Result, 'id' | 'overall' | 'version' | 'band_label' | 'categories' | 'computed_at'> & { band_key?: string }) | null
  history: { id: string; overall: number; version: number; band_label: string; computed_at: string }[]
  priorities: { title: string; category: string | null }[]
  saved: number
  introductions: Partial<Record<IntroStatus, number>>
  reports: { id: string; title: string; created_at: string }[]
  open_assessment: { id: string; answered: number; started_at: string } | null
  opportunities: { id: string; title: string; status: string; next_action: string | null; next_action_on: string | null }[]
  notifications: { id: string; title: string; body: string | null; link: string | null; created_at: string; read: boolean }[]
}

/* ── Session store ─────────────────────────────────────────────────────────
   One subscription to Supabase Auth for the whole Lab. `boot` is the Lab's
   own view of the account (lab_bootstrap): profile, brands, consents. */
type SessionState = { status: 'loading' | 'out' | 'in' | 'offline'; session: Session | null; boot: Boot | null; error?: string }
let state: SessionState = { status: 'loading', session: null, boot: null }
const subs = new Set<() => void>()
const emit = (next: Partial<SessionState>) => {
  state = { ...state, ...next }
  subs.forEach(f => f())
}
let started = false
async function start() {
  if (started) return
  started = true
  const c = await getClient()
  if (!c) return emit({ status: 'offline' })
  const apply = async (session: Session | null) => {
    if (!session) return emit({ status: 'out', session: null, boot: null })
    try {
      const boot = await rpc<Boot>('lab_bootstrap')
      emit({ status: 'in', session, boot, error: undefined })
    } catch (e) {
      emit({ status: 'in', session, boot: null, error: errMsg(e) })
    }
  }
  const { data } = await c.auth.getSession()
  await apply(data.session)
  c.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') return emit({ session })
    if (event === 'SIGNED_IN' && state.session?.user.id === session?.user.id && state.boot) return emit({ session })
    void apply(session)
  })
}
export async function reloadBoot() {
  try {
    emit({ boot: await rpc<Boot>('lab_bootstrap') })
  } catch (e) {
    emit({ error: errMsg(e) })
  }
}
const SERVER: SessionState = { status: 'loading', session: null, boot: null }
export function useLabSession(): SessionState {
  if (typeof window !== 'undefined') void start()
  return useSyncExternalStore(
    cb => (subs.add(cb), () => void subs.delete(cb)),
    () => state,
    () => SERVER,
  )
}

/* ── Current brand ──────────────────────────────────────────────────────────
   Multi-brand ready: a user may own several. Which one is open is a
   per-browser convenience (remembered in localStorage); the list of brands
   itself always comes from the database. */
const BRAND_KEY = 'nba-lab-brand'
let brandSel: string | null = null
const brandSubs = new Set<() => void>()
export function selectBrand(id: string | null) {
  brandSel = id
  try {
    if (id) localStorage.setItem(BRAND_KEY, id)
    else localStorage.removeItem(BRAND_KEY)
  } catch {
    /* storage unavailable: selection lasts for this visit */
  }
  brandSubs.forEach(f => f())
}
export function useBrandId(): string | null {
  const s = useLabSession()
  const sel = useSyncExternalStore(
    cb => (brandSubs.add(cb), () => void brandSubs.delete(cb)),
    () => {
      if (brandSel === null) {
        try {
          brandSel = localStorage.getItem(BRAND_KEY)
        } catch {
          brandSel = null
        }
      }
      return brandSel
    },
    () => null,
  )
  const brands = s.boot?.brands ?? []
  return brands.find(b => b.id === sel)?.id ?? brands[0]?.id ?? null
}

/* ── Auth ───────────────────────────────────────────────────────────────── */
export const CONSENT_VERSION = '2026-10'
const origin = () => window.location.origin

export async function labSignUp(input: { email: string; password: string; fullName: string; marketing: boolean; partnerSharing: boolean }): Promise<{ existing?: boolean; confirm?: boolean }> {
  const c = await need()
  const { data, error } = await c.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${origin()}/lab/dashboard`,
      data: {
        account: 'lab',
        full_name: input.fullName,
        consent_version: CONSENT_VERSION,
        consents: { terms: true, privacy: true, marketing: input.marketing, partner_sharing: input.partnerSharing },
      },
    },
  })
  if (error) throw new LabError(human(error.message))
  if (data.user && data.user.identities?.length === 0) return { existing: true }
  return { confirm: !data.session }
}

export async function labSignIn(email: string, password: string) {
  const c = await need()
  const { error } = await c.auth.signInWithPassword({ email, password })
  if (!error) return
  if (error.code === 'invalid_credentials') throw new LabError('That email and password don’t match. Check the password, or reset it below.')
  if (error.code === 'email_not_confirmed') throw new LabError('Confirm your email first: open the link we sent you (check spam too).')
  throw new LabError(human(error.message))
}

export async function labResendConfirmation(email: string) {
  const c = await need()
  const { error } = await c.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${origin()}/lab/dashboard` } })
  if (error) throw new LabError(human(error.message))
}

export async function labRequestReset(email: string) {
  const c = await need()
  const { error } = await c.auth.resetPasswordForEmail(email, { redirectTo: `${origin()}/lab/reset-password` })
  if (error) throw new LabError(human(error.message))
}

export async function labUpdatePassword(password: string) {
  const c = await need()
  const { error } = await c.auth.updateUser({ password })
  if (error) throw new LabError(human(error.message))
}

export async function labSignOut() {
  const c = await getClient()
  await c?.auth.signOut()
  selectBrand(null)
}

/* ── Logos (private bucket, signed URLs) ───────────────────────────────── */
export async function logoUrl(path: string | null): Promise<string | null> {
  if (!path) return null
  const c = await getClient()
  const { data } = (await c?.storage.from('lab-logos').createSignedUrl(path, 3600)) ?? { data: null }
  return data?.signedUrl ?? null
}
export async function uploadLogo(brandId: string, file: File): Promise<string> {
  if (file.size > 1024 * 1024) throw new LabError('Logos can be up to 1 MB.')
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) throw new LabError('Use a PNG, JPEG or WebP file.')
  const c = await need()
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path = `brand/${brandId}/logo-${Date.now()}.${ext}`
  const { error } = await c.storage.from('lab-logos').upload(path, file, { upsert: false, contentType: file.type })
  if (error) throw new LabError(human(error.message))
  return path
}

/* ── Analytics (anonymous, allow-listed events only) ────────────────────── */
export function track(kind: 'preview_completed' | 'report_downloaded' | 'landing_cta', props: Record<string, string> = {}) {
  void rpc('lab_track', { p_kind: kind, p_props: props }).catch(() => {})
}
