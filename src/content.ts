/* ── Content store ──────────────────────────────────────────────────────────
   A localStorage-backed store for editable site content, so the /admin board
   can edit copy, company details, testimonials and Journal posts without a
   backend. Seeded from src/data.ts; overrides persist in the browser.

   NOTE: the admin login is a lightweight client-side gate suitable for a
   prototype. It is not real security — anyone with the bundle can read the
   password. Move to Supabase auth for anything production-facing. */
import { useSyncExternalStore } from 'react'
import {
  notes as seedNotes,
  company as seedCompany,
  testimonials as seedTestimonials,
  socials as seedSocials,
  clientLogos as seedClients,
  partnerLogos as seedPartners,
} from '@/data'

export interface Note {
  id: number
  title: string
  subtitle: string
  body: string
  date: string
  category: string
  readTime: string
  img: string
  slug: string
}

export interface Testimonial {
  quote: string
  name: string
  role: string
  company: string
}

export interface Hero {
  words: string[]
  subhead: string
  definition: string
  image: string
}

export interface Seo {
  description: string
  ogImage: string
}

export interface TrainingRow {
  label: string
  value: string
}

export interface Trainings {
  eyebrow: string
  heading: string
  subhead: string
  body1: string
  body2: string
  waitingListNote: string
  format: TrainingRow[]
}

export interface Homepage {
  featuredEyebrow: string
  featuredHeading: string
  capabilitiesHeading: string
  journalHeading: string
  ctaHeading: string
  ctaBody: string
}

export interface NavLink {
  to: string
  label: string
  soon?: boolean
}

export type WordmarkStyle = 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black'

export interface Wordmark {
  name: string
  style: WordmarkStyle
}

export interface Social {
  label: string
  handle: string
  url: string
}

export type Company = typeof seedCompany

export interface Site {
  company: Company
  hero: Hero
  homepage: Homepage
  nav: NavLink[]
  socials: Social[]
  clients: Wordmark[]
  partners: Wordmark[]
  seo: Seo
  trainings: Trainings
  testimonials: Testimonial[]
  notes: Note[]
}

const seedHero: Hero = {
  words: ['wanted', 'chosen', 'remembered', 'recommended'],
  subhead:
    'Growth is what happens next. We work across brand, product and demand — in one room, to one commercial end.',
  definition:
    'Not by Accident is an independent creative company that joins brand thinking and commercial thinking. Strategy, identity, websites, digital products and the marketing that makes them pay back.',
  image:
    'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000',
}

const seedSeo: Seo = {
  description:
    'Not by Accident is an independent creative company in Amsterdam working across brand strategy, identity, digital products and demand. We make companies wanted — growth is what happens next.',
  ogImage:
    'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200',
}

const seedTrainings: Trainings = {
  eyebrow: 'Trainings — Opening 2027',
  heading: 'Teaching the work, not the theory.',
  subhead:
    'Everything we have learned about brand strategy and creative direction, taught directly.',
  body1:
    'Two workshops, available in 2027. The first on brand strategy — the real work of positioning, naming and building a brief. The second on creative direction — how to make things that are genuinely different and commercially sound.',
  body2:
    'In person. Deliberately small. Amsterdam and one other city per year. No certification. No slides you will never open again.',
  waitingListNote:
    'Leave your email address and we will write to you first when registration opens. One email. No marketing.',
  format: [
    { label: 'Format', value: 'In-person workshop, two days' },
    { label: 'Group size', value: 'Maximum twelve participants' },
    { label: 'Location', value: 'Amsterdam, one further city per year' },
    { label: 'First date', value: '2027 — date to be confirmed' },
    { label: 'Disciplines', value: 'Brand Strategy · Creative Direction' },
  ],
}

const seedHomepage: Homepage = {
  featuredEyebrow: 'Selected work',
  featuredHeading: 'Proof that the brand decision was the commercial one.',
  capabilitiesHeading: 'Eighteen capabilities. One way of working.',
  journalHeading: 'How we think, in public.',
  ctaHeading: 'Tell us the company you want to become.',
  ctaBody:
    'We work with founders, marketing leads and creative directors who suspect their company is better than its reputation. First reply within one working day — from a person, not a form.',
}

const seedNav: NavLink[] = [
  { to: '/work', label: 'Work' },
  { to: '/notes', label: 'Notes' },
  { to: '/studio', label: 'Studio' },
  { to: '/trainings', label: 'Trainings' },
  { to: '/reports', label: 'Reports', soon: true },
  { to: '/contact', label: 'Contact' },
]

const seed: Site = {
  company: seedCompany,
  hero: seedHero,
  homepage: seedHomepage,
  nav: seedNav,
  socials: seedSocials as Social[],
  clients: seedClients as Wordmark[],
  partners: seedPartners as Wordmark[],
  seo: seedSeo,
  trainings: seedTrainings,
  testimonials: seedTestimonials as Testimonial[],
  notes: seedNotes as Note[],
}

const KEY = 'nba.content.site.v1'
const listeners = new Set<() => void>()
let cache: Site | null = null

function read(): Site {
  if (cache) return cache
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null
    cache = raw ? mergeSeed(JSON.parse(raw) as Partial<Site>) : seed
  } catch {
    cache = seed
  }
  return cache
}

/* keep new seed fields if an older payload is missing them */
function mergeNav(stored?: NavLink[]): NavLink[] {
  if (!stored) return seed.nav
  // Ensure the Reports link exists in previously-saved menus, placed before Contact.
  if (stored.some(l => l.to === '/reports')) return stored
  const reports: NavLink = { to: '/reports', label: 'Reports', soon: true }
  const contactIdx = stored.findIndex(l => l.to === '/contact')
  if (contactIdx === -1) return [...stored, reports]
  return [...stored.slice(0, contactIdx), reports, ...stored.slice(contactIdx)]
}

function mergeSeed(stored: Partial<Site>): Site {
  return {
    company: { ...seed.company, ...(stored.company ?? {}) },
    hero: { ...seed.hero, ...(stored.hero ?? {}) },
    homepage: { ...seed.homepage, ...(stored.homepage ?? {}) },
    nav: mergeNav(stored.nav),
    socials: stored.socials ?? seed.socials,
    clients: stored.clients ?? seed.clients,
    partners: stored.partners ?? seed.partners,
    seo: { ...seed.seo, ...(stored.seo ?? {}) },
    trainings: { ...seed.trainings, ...(stored.trainings ?? {}) },
    testimonials: stored.testimonials ?? seed.testimonials,
    notes: stored.notes ?? seed.notes,
  }
}

function write(next: Site) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — keep in-memory only */
  }
  listeners.forEach(l => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/* ── Public hooks ─────────────────────────────────────────────────────────── */
export function useSite(): Site {
  return useSyncExternalStore(subscribe, read, () => seed)
}
export function useNotes(): Note[] {
  return useSite().notes
}
export function useCompany(): Company {
  return useSite().company
}
export function useTestimonials(): Testimonial[] {
  return useSite().testimonials
}
export function useHero(): Hero {
  return useSite().hero
}
export function useHomepage(): Homepage {
  return useSite().homepage
}
export function useNav(): NavLink[] {
  return useSite().nav
}
export function useSocials(): Social[] {
  return useSite().socials
}
export function useClients(): Wordmark[] {
  return useSite().clients
}
export function usePartners(): Wordmark[] {
  return useSite().partners
}
export function useSeo(): Seo {
  return useSite().seo
}
export function useTrainings(): Trainings {
  return useSite().trainings
}

export function getSite(): Site {
  return read()
}

/* ── Mutations ────────────────────────────────────────────────────────────── */
export function updateCompany(patch: Partial<Company>) {
  const s = read()
  write({ ...s, company: { ...s.company, ...patch } })
}
export function updateHero(patch: Partial<Hero>) {
  const s = read()
  write({ ...s, hero: { ...s.hero, ...patch } })
}
export function updateHomepage(patch: Partial<Homepage>) {
  const s = read()
  write({ ...s, homepage: { ...s.homepage, ...patch } })
}
export function updateNav(next: NavLink[]) {
  write({ ...read(), nav: next })
}
export function updateSocials(next: Social[]) {
  write({ ...read(), socials: next })
}
export function updateClients(next: Wordmark[]) {
  write({ ...read(), clients: next })
}
export function updatePartners(next: Wordmark[]) {
  write({ ...read(), partners: next })
}
export function updateSeo(patch: Partial<Seo>) {
  const s = read()
  write({ ...s, seo: { ...s.seo, ...patch } })
}
export function updateTrainings(patch: Partial<Trainings>) {
  const s = read()
  write({ ...s, trainings: { ...s.trainings, ...patch } })
}
export function updateTestimonials(next: Testimonial[]) {
  write({ ...read(), testimonials: next })
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function saveNote(input: Omit<Note, 'id'> & { id?: number }): Note {
  const s = read()
  const list = s.notes.slice()
  if (input.id != null) {
    const idx = list.findIndex(n => n.id === input.id)
    if (idx !== -1) {
      const updated = { ...list[idx], ...input, id: input.id } as Note
      list[idx] = updated
      write({ ...s, notes: list })
      return updated
    }
  }
  const id = list.reduce((m, n) => Math.max(m, n.id), 0) + 1
  const created: Note = { ...(input as Note), id }
  write({ ...s, notes: [created, ...list] })
  return created
}

export function deleteNote(id: number) {
  const s = read()
  write({ ...s, notes: s.notes.filter(n => n.id !== id) })
}

export function resetSite() {
  write(seed)
}

/* ── Leads (form + newsletter submissions) ─────────────────────────────────
   Captured submissions live under their own key so they survive content
   resets. Prototype-only: stored in this browser. Once Supabase is connected,
   submitLead() also posts to the backend so the owner can see every email in
   one place and a notification is sent. */
const LEADS_KEY = 'nba.leads.v1'
const leadListeners = new Set<() => void>()

export type LeadSource = 'newsletter' | 'newsletter-popup' | 'contact' | 'footer'

export interface Lead {
  id: string
  email: string
  name?: string
  message?: string
  source: LeadSource
  createdAt: string
}

let leadsCache: Lead[] | null = null

function readLeads(): Lead[] {
  if (leadsCache) return leadsCache
  try {
    const raw = localStorage.getItem(LEADS_KEY)
    leadsCache = raw ? (JSON.parse(raw) as Lead[]) : []
  } catch {
    leadsCache = []
  }
  return leadsCache
}

function writeLeads(next: Lead[]) {
  leadsCache = next
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — keep in-memory only */
  }
  leadListeners.forEach(l => l())
}

export function useLeads(): Lead[] {
  return useSyncExternalStore(
    cb => {
      leadListeners.add(cb)
      return () => leadListeners.delete(cb)
    },
    readLeads,
    () => [],
  )
}

/* Records a submission locally and, when a backend is available, forwards it so
   the owner can review every email and receive a notification. Returns the
   stored Lead. The network call is best-effort and never blocks the UI. */
export function submitLead(input: { email: string; name?: string; message?: string; source: LeadSource }): Lead {
  const lead: Lead = {
    id: (crypto.randomUUID?.() ?? String(Date.now() + Math.random())),
    email: input.email.trim(),
    name: input.name?.trim() || undefined,
    message: input.message?.trim() || undefined,
    source: input.source,
    createdAt: new Date().toISOString(),
  }
  writeLeads([lead, ...readLeads()])
  void forwardLead(lead)
  return lead
}

/* Best-effort forward to the backend. No-op until Supabase is wired in — once
   the edge function exists this posts the lead so the owner sees every email
   and a notification is sent. The lead is always safe in localStorage first. */
async function forwardLead(_lead: Lead): Promise<void> {
  /* Supabase not connected yet — nothing to forward to. */
}

export function deleteLead(id: string) {
  writeLeads(readLeads().filter(l => l.id !== id))
}

export function exportLeadsCsv(): string {
  const rows = readLeads()
  const head = ['createdAt', 'source', 'email', 'name', 'message']
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = [head.join(',')]
  for (const l of rows) {
    lines.push([l.createdAt, l.source, l.email, l.name ?? '', l.message ?? ''].map(v => esc(String(v))).join(','))
  }
  return lines.join('\n')
}

/* ── Auth (lightweight client-side accounts) ───────────────────────────────
   Sign up creates an account, then sign in starts a session. Accounts live in
   localStorage; the active session lives in sessionStorage. This is a prototype
   gate, NOT real security — anyone with the bundle can read stored accounts.
   Connect Supabase Auth for real, shared, secure sign-in. */
const AUTH_KEY = 'nba.admin.session'
const USERS_KEY = 'nba.admin.users.v1'
const authListeners = new Set<() => void>()

interface Account {
  email: string
  password: string
  approved: boolean
  verified: boolean
  code?: string
}

const userListeners = new Set<() => void>()

function readUsers(): Account[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    // Back-compat: older accounts had no `approved`/`verified` flags — treat them as both.
    return (JSON.parse(raw) as Account[]).map(u => ({
      ...u,
      approved: u.approved ?? true,
      verified: u.verified ?? true,
    }))
  } catch {
    return []
  }
}

function writeUsers(users: Account[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    /* ignore */
  }
  userListeners.forEach(l => l())
}

/** Public view of an account — never exposes the password. */
export interface AccountView {
  email: string
  approved: boolean
  verified: boolean
}

function readAccountViews(): AccountView[] {
  return readUsers().map(({ email, approved, verified }) => ({ email, approved, verified }))
}

let accountsCache: AccountView[] = []
function readAccountsCached(): AccountView[] {
  const next = readAccountViews()
  // Keep a stable reference unless the data actually changed (useSyncExternalStore).
  if (JSON.stringify(next) !== JSON.stringify(accountsCache)) accountsCache = next
  return accountsCache
}

function subscribeUsers(cb: () => void) {
  userListeners.add(cb)
  return () => {
    userListeners.delete(cb)
  }
}

export function useAccounts(): AccountView[] {
  return useSyncExternalStore(subscribeUsers, readAccountsCached, () => accountsCache)
}

export function approveAccount(email: string) {
  writeUsers(readUsers().map(u => (u.email === email ? { ...u, approved: true } : u)))
}

export function revokeAccount(email: string) {
  writeUsers(readUsers().map(u => (u.email === email ? { ...u, approved: false } : u)))
}

export function deleteAccount(email: string) {
  writeUsers(readUsers().filter(u => u.email !== email))
}

function readAuth(): string | null {
  try {
    return sessionStorage.getItem(AUTH_KEY)
  } catch {
    return null
  }
}

function subscribeAuth(cb: () => void) {
  authListeners.add(cb)
  return () => {
    authListeners.delete(cb)
  }
}

/** Current signed-in email, or null. */
export function useAuth(): string | null {
  return useSyncExternalStore(subscribeAuth, readAuth, () => null)
}

/** Six-digit code, as an email service would send. */
function makeCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function signup(
  email: string,
  password: string
): { ok: boolean; error?: string; code?: string } {
  const clean = email.trim().toLowerCase()
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(clean)) return { ok: false, error: 'Enter a valid email address.' }
  if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }
  const users = readUsers()
  const existing = users.find(u => u.email === clean)
  if (existing && existing.verified) {
    return { ok: false, error: 'An account with this email already exists — sign in instead.' }
  }
  // The first account is the owner and is approved automatically; every
  // subsequent request stays pending until an approved admin lets it in.
  // Nobody is created verified — a code must be confirmed first.
  const approved = users.filter(u => u.verified).length === 0
  const code = makeCode()
  const next: Account = { email: clean, password, approved, verified: false, code }
  writeUsers(existing ? users.map(u => (u.email === clean ? next : u)) : [...users, next])
  // NOTE: real delivery needs a backend (e.g. Supabase). We return the code so
  // the UI can show it in place of an inbox for the prototype.
  return { ok: true, code }
}

/** Confirm the emailed code. Verified accounts still await admin approval. */
export function verifyEmail(
  email: string,
  code: string
): { ok: boolean; error?: string; pending?: boolean } {
  const clean = email.trim().toLowerCase()
  const users = readUsers()
  const user = users.find(u => u.email === clean)
  if (!user) return { ok: false, error: 'No sign-up found for this email.' }
  if (user.verified) return { ok: true, pending: !user.approved }
  if (user.code !== code.trim()) return { ok: false, error: 'That code is not correct.' }
  writeUsers(users.map(u => (u.email === clean ? { ...u, verified: true, code: undefined } : u)))
  return { ok: true, pending: !user.approved }
}

export function login(email: string, password: string): { ok: boolean; error?: string } {
  const clean = email.trim().toLowerCase()
  const user = readUsers().find(u => u.email === clean)
  if (!user || user.password !== password) return { ok: false, error: 'Email or password is incorrect.' }
  if (!user.verified) return { ok: false, error: 'Please verify your email address first.' }
  if (!user.approved) return { ok: false, error: 'Your account is awaiting approval from an administrator.' }
  try {
    sessionStorage.setItem(AUTH_KEY, clean)
  } catch {
    /* ignore */
  }
  authListeners.forEach(l => l())
  return { ok: true }
}

export function logout() {
  try {
    sessionStorage.removeItem(AUTH_KEY)
  } catch {
    /* ignore */
  }
  authListeners.forEach(l => l())
}
