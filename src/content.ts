/* ── Public content store ───────────────────────────────────────────────────
   A reactive store the whole public site reads through. It always starts
   from the static seed in src/data.ts (so the site renders correctly even
   before the CMS migration has been run, or if Supabase is briefly
   unreachable), then — once Supabase is configured — quietly fetches the
   live, published content and swaps it in. Every component that calls one
   of the hooks below re-renders automatically when that happens; nothing
   about how pages consume this data changes. */
import { useSyncExternalStore } from 'react'
import {
  notes as seedNotes,
  company as seedCompany,
  testimonials as seedTestimonials,
  socials as seedSocials,
  clientLogos as seedClients,
  partnerLogos as seedPartners,
  projects as seedProjects,
  capabilities as seedCapabilities,
  team as seedTeam,
  type Note,
  type Project,
  type Capability,
  type TeamMember,
} from '@/data'
import { supabase, supabaseReady } from '@/lib/supabase'
import {
  fetchProjects,
  fetchCapabilities,
  fetchNotes,
  fetchTestimonials,
  fetchClients,
  fetchPartners,
  fetchTeam,
  fetchSiteSettings,
  fetchNavigation,
  fetchHomeSections,
} from '@/lib/cms'

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
  /** Bounded px nudge on the hero image, set from the admin's drag control
   *  (Admin → Pages). Applied as a CSS transform — small range, so it never
   *  breaks the responsive layout. */
  imageOffsetX: number
  imageOffsetY: number
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
  capabilitiesEyebrow: string
  capabilitiesHeading: string
  notesEyebrow: string
  journalHeading: string
  ctaEyebrow: string
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
  footerNav: NavLink[]
  socials: Social[]
  clients: Wordmark[]
  partners: Wordmark[]
  seo: Seo
  trainings: Trainings
  testimonials: Testimonial[]
  notes: Note[]
  projects: Project[]
  capabilities: Capability[]
  team: TeamMember[]
}

/* Hero image and homepage section headings are not yet wired to a live CMS
   editor (the `pages` / `page_sections` tables exist in the schema for
   this, ready for a future admin screen) — everything else in Site is. */
const seedHero: Hero = {
  words: ['wanted', 'chosen', 'remembered', 'recommended'],
  subhead:
    'Growth is what happens next. We work across brand, product and demand — in one room, to one commercial end.',
  definition:
    'Not by Accident is an independent creative company that joins brand thinking and commercial thinking. Strategy, identity, websites, digital products and the marketing that makes them pay back.',
  image:
    'https://images.unsplash.com/photo-1764096534662-a194a348c4a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1000',
  imageOffsetX: 0,
  imageOffsetY: 0,
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
  capabilitiesEyebrow: 'What we do',
  capabilitiesHeading: 'Capabilities. One way of working.',
  notesEyebrow: 'Notes — an independent publication',
  journalHeading: 'How we think, in public.',
  ctaEyebrow: 'Start something',
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

const seedFooterNav: NavLink[] = [
  { to: '/work', label: 'Work' },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/capabilities', label: 'Capabilities' },
  { to: '/studio', label: 'Studio' },
  { to: '/notes', label: 'The Journal' },
  { to: '/trainings', label: 'Events & Workshops' },
]

const seed: Site = {
  company: seedCompany,
  hero: seedHero,
  homepage: seedHomepage,
  nav: seedNav,
  footerNav: seedFooterNav,
  socials: seedSocials as Social[],
  clients: seedClients as Wordmark[],
  partners: seedPartners as Wordmark[],
  seo: seedSeo,
  trainings: seedTrainings,
  testimonials: seedTestimonials as Testimonial[],
  notes: seedNotes,
  projects: seedProjects,
  capabilities: seedCapabilities,
  team: seedTeam,
}

let cache: Site = seed
const listeners = new Set<() => void>()

function read(): Site {
  return cache
}

function write(patch: Partial<Site>) {
  cache = { ...cache, ...patch }
  listeners.forEach(l => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

/* Fires once per page load. Each fetch is independent, so a failure in one
   (e.g. testimonials table not seeded yet) never blocks the others from
   loading — the store just keeps that one field on its seed value. */
let loadStarted = false
function loadLiveContent() {
  if (loadStarted || !supabaseReady) return
  loadStarted = true
  void Promise.allSettled([
    fetchProjects().then(v => v && write({ projects: v })),
    fetchCapabilities().then(v => v && write({ capabilities: v })),
    fetchNotes().then(v => v && write({ notes: v })),
    fetchTestimonials().then(v => v && write({ testimonials: v })),
    fetchClients().then(v => v && write({ clients: v })),
    fetchPartners().then(v => v && write({ partners: v })),
    fetchTeam().then(v => v && write({ team: v })),
    fetchNavigation('header').then(v => v && write({ nav: v })),
    fetchNavigation('footer').then(v => v && write({ footerNav: v })),
    fetchSiteSettings().then(v => v && write({ company: v.company, socials: v.socials, seo: v.seo })),
    fetchHomeSections().then(v => {
      if (!v) return
      write({
        hero: { ...cache.hero, ...v.hero },
        homepage: { ...cache.homepage, ...v.homepage },
      })
    }),
  ])
}
loadLiveContent()

/** Forces an immediate re-fetch — call after an admin save so the change is
 *  visible without a hard refresh (e.g. an admin previewing in another tab). */
export function refreshSite() {
  loadStarted = false
  loadLiveContent()
}

/* ── Public hooks ─────────────────────────────────────────────────────────── */
export function useSite(): Site {
  return useSyncExternalStore(subscribe, read, () => seed)
}
export function useNotes(): Note[] {
  return useSite().notes
}
export function useProjects(): Project[] {
  return useSite().projects
}
export function useCapabilities(): Capability[] {
  return useSite().capabilities
}
export function useTeam(): TeamMember[] {
  return useSite().team
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
export function useFooterNav(): NavLink[] {
  return useSite().footerNav
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

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/* ── Lead capture (contact form, newsletter signups, waiting lists) ────────
   All of these write to the same `contact_submissions` table, distinguished
   by `source`, so the admin has one inbox instead of several. */
export type LeadSource = 'newsletter' | 'newsletter-popup' | 'contact' | 'footer'

export async function submitLead(input: {
  email: string
  name?: string
  message?: string
  source: LeadSource
}): Promise<{ ok: boolean; error?: string }> {
  if (!supabase) {
    return { ok: false, error: 'This site is not yet connected to its content backend — see docs/CMS.md.' }
  }
  const { error } = await supabase.from('contact_submissions').insert({
    email: input.email.trim(),
    name: input.name?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source,
  })
  return error ? { ok: false, error: 'Something went wrong sending that — please try again or email us directly.' } : { ok: true }
}
