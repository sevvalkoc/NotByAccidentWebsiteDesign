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
  categories as seedCategories,
  team as seedTeam,
  type Note,
  type Project,
  type Capability,
  type TeamMember,
  type Category,
} from '@/data'
import { supabase, supabaseReady } from '@/lib/supabase'
import { useLocale } from '@/i18n/locale'
import { site as nlSite } from '@/content.nl'
import { site as frSite } from '@/content.fr'
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
  fetchStudioSections,
  fetchContactSections,
  fetchReportsSections,
  fetchTrainingsPageSections,
  fetchWorkSections,
  fetchCaseStudiesSections,
  fetchCapabilitiesPageSections,
  fetchPrivacySections,
  fetchCookiesSections,
  fetchCategoryMeta,
} from '@/lib/cms'

export interface CategoryMeta {
  key: Category
  label: string
  blurb: string
  accent: string
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
  /** Bounded px nudge on the hero image, set from the admin's drag control
   *  (Admin → Pages). Applied as a CSS transform — small range, so it never
   *  breaks the responsive layout. */
  imageOffsetX: number
  imageOffsetY: number
  buttons: HeroButton[]
}

export interface HeroButton {
  label: string
  url: string
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

export interface StudioListItem {
  title: string
  body: string
  /** Optional third field — only Cookies' table (lifespan column) uses it. */
  meta?: string
}

export interface PageHeader {
  eyebrow: string
  heading: string
  subhead: string
}

export interface CapabilitiesPageCopy {
  eyebrow: string
  /** Appears after the live capability count, e.g. "42 <headingSuffix>" — the
   *  count itself is generated in code, not stored, so it can never go stale. */
  headingSuffix: string
  subhead: string
}

export interface LegalCopy {
  eyebrow: string
  heading: string
  subhead: string
  /** Optional decorative sidebar photo — empty string means "not set". */
  headerImage: string
  lastUpdated: string
  sections: StudioListItem[]
}

export interface CookiesCopy {
  eyebrow: string
  heading: string
  subhead: string
  rows: StudioListItem[]
  managingHeading: string
  managingBody: string
}

export interface Studio {
  eyebrow: string
  heading: string
  subhead: string
  body: string
  /** Optional editorial photo on the opening statement — empty string means "not set". */
  openingImage: string
  principlesEyebrow: string
  principles: StudioListItem[]
  cultureEyebrow: string
  cultureHeading: string
  cultureItems: StudioListItem[]
  ctaHeading: string
}

export interface ContactCopy {
  eyebrow: string
  heading: string
  subhead: string
  intro1: string
  intro2: string
}

export interface ReportsCopy {
  eyebrow: string
  heading: string
  subhead: string
}

export interface Homepage {
  featuredEyebrow: string
  featuredHeading: string
  capabilitiesEyebrow: string
  capabilitiesHeading: string
  /** Optional small side image — empty string means "not set", section
   *  renders exactly as it always has. */
  capabilitiesImage: string
  notesEyebrow: string
  journalHeading: string
  ctaEyebrow: string
  ctaHeading: string
  ctaBody: string
  ctaButtonLabel: string
  ctaButtonUrl: string
  /** Optional small side image — empty string means "not set". */
  finalCtaImage: string
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
  homeSections: string[]
  studio: Studio
  contact: ContactCopy
  reportsCopy: ReportsCopy
  work: PageHeader
  caseStudiesCopy: PageHeader
  capabilitiesCopy: CapabilitiesPageCopy
  privacyCopy: LegalCopy
  cookiesCopy: CookiesCopy
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
  categories: CategoryMeta[]
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
  buttons: [
    { label: 'Start a project', url: '/contact' },
    { label: 'See the work', url: '/work' },
  ],
}

/** Default order — the ordered list of visible homepage section keys.
 *  Matches what was previously a fixed JSX sequence in Home.tsx, so a site
 *  with Supabase unreachable still renders identically to before this
 *  became data-driven. Hidden sections just aren't in the list — there's
 *  no separate visible flag to track. */
const seedHomeSections: string[] = ['hero', 'capabilities', 'testimonials', 'clients', 'partners', 'notes', 'case_studies', 'final_cta']

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

const seedStudio: Studio = {
  eyebrow: 'Studio',
  heading: 'We make companies wanted.',
  subhead: 'Growth is what happens next. Wanted, on purpose.',
  body: 'Not by Accident is an independent creative company working across brand, product and demand. Brand thinking and commercial thinking do not sit in separate rooms.',
  openingImage: 'https://images.unsplash.com/photo-1649414744605-3bfa4f1870fc?w=720&h=900&fit=crop&auto=format',
  principlesEyebrow: 'How we think',
  principles: [
    { title: 'Specific', body: 'Name the material, the month, the number, the street. A range of possibilities is not a description. It is an avoidance of one.' },
    { title: 'Decided', body: 'Present decisions as decisions. Two routes, never three. The recommendation comes first, not last. We are paid to have a view.' },
    { title: 'Warm, not soft', body: 'People, hands, imperfection and humour. The work stays sharp. Warmth and rigour are not in tension. Softness is just politeness at the cost of truth.' },
    { title: 'Culturally awake', body: 'References from outside design, credited always and never explained. We do not borrow from culture without knowing where we borrowed from.' },
    { title: 'Quietly funny', body: 'One human moment per communication. In the last line, never the headline. Funny because it is true, not because it is trying.' },
    { title: 'Commercially literate', body: 'Every soft attribute shows up one step downstream as a hard number. We do not separate aesthetic decisions from commercial ones.' },
  ],
  cultureEyebrow: 'The culture',
  cultureHeading: 'Small on purpose. Senior in the room. Commercial by instinct.',
  cultureItems: [
    { title: 'One room', body: 'Strategy, design and demand sit together from day one — no relay races, no telephone game between departments.' },
    { title: 'Senior hands', body: 'The people who win the work do the work. We stay small so the standard never gets diluted downstream.' },
    { title: 'Commercial first', body: 'Every decision traces back to a number a client can actually move. Beauty is the method, not the goal.' },
  ],
  ctaHeading: 'If you would like to work with us, leave your email.',
}

const seedContact: ContactCopy = {
  eyebrow: 'Contact',
  heading: 'Write to us.',
  subhead: 'We work with founders and creative leads who suspect their company is better than its reputation.',
  intro1: 'We do not work with everyone. We work on fewer projects than most, and each one receives the attention it requires.',
  intro2: 'Before writing, it is worth knowing that we typically begin with a strategy engagement. If you are looking for a production company or an execution partner, we are probably not the right fit.',
}

const seedReportsCopy: ReportsCopy = {
  eyebrow: 'Reports · Coming soon',
  heading: 'The research, in the open.',
  subhead: 'We are putting together a small library of original reports — benchmarks, field notes and the working we usually keep to ourselves. Honest numbers, plainly argued. It is not ready yet, but it is close.',
}

const seedWork: PageHeader = {
  eyebrow: 'Work',
  heading: 'An independent record of what we have made.',
  subhead: 'We work on fewer projects than most. Each one receives the attention it requires. This is the archive.',
}

const seedCaseStudiesCopy: PageHeader = {
  eyebrow: 'Case Studies',
  heading: 'Work examined at length.',
  subhead: 'Each case study is a full account of a project — the problem, the thinking and the result. Not a highlights reel.',
}

const seedCapabilitiesCopy: CapabilitiesPageCopy = {
  eyebrow: 'Capabilities',
  headingSuffix: 'capabilities, in the order a company actually needs them.',
  subhead: 'Five groups — Brand & Identity, Digital & Product, Growth & Demand, Market & Expansion, and Experiences. Take one, or the whole sequence. Each has its own team, method and page.',
}

const seedPrivacyCopy: LegalCopy = {
  eyebrow: 'Privacy',
  heading: 'What we hold, and why.',
  subhead: 'We collect very little and we treat it plainly. This notice explains exactly how, in language you should not need a lawyer to follow.',
  headerImage: 'https://images.unsplash.com/photo-1755375551130-cf278d391d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=640',
  lastUpdated: '8 August 2026',
  sections: [
    {
      title: 'Who we are',
      body: 'Not by Accident is an independent creative company. When we refer to “we”, “us” or “our” in this notice, we mean Not by Accident. When we refer to “you”, we mean anyone who visits this website or corresponds with us. Our full registered company details will be added here before this notice is treated as final.\n\nThis notice explains what we collect, why we collect it, and what you can ask us to do about it. It is written to be read, not to be survived.',
    },
    {
      title: 'What we collect',
      body: 'We collect only what a conversation requires. When you write to us through the contact form or by email, we hold your name, your company, your email address and whatever you choose to tell us about your project. We keep it for as long as the conversation is live and for a reasonable period afterwards.\n\nWhen you browse the site, our hosting provider records standard technical information — the pages requested, the approximate region, the browser used. This is ordinary server activity, not surveillance.',
    },
    {
      title: 'Why we hold it',
      body: 'We use your information for one purpose: to respond to you and, where it becomes relevant, to carry out work you have asked us to do. We do not sell it. We do not build advertising profiles. We do not enrich it with data bought from elsewhere.\n\nOur lawful basis is either your consent, given when you write to us, or our legitimate interest in running a small business well.',
    },
    {
      title: 'Who sees it',
      body: 'Your information is seen by the people at Not by Accident who need to see it, and by a short list of service providers who help us operate — email, hosting and analytics. Each is bound by its own obligations. We choose them carefully and review them.',
    },
    {
      title: 'Your rights',
      body: 'You may ask to see the information we hold about you, to correct it, or to have it deleted. You may withdraw consent at any time. You may also complain to the Information Commissioner’s Office, though we would rather you told us first, so we can put it right.\n\nTo exercise any of these rights, write to hello@notbyaccident.com. We will respond within one month, usually sooner.',
    },
  ],
}

const seedCookiesCopy: CookiesCopy = {
  eyebrow: 'Cookies',
  heading: 'A short note on cookies.',
  subhead: 'We use a handful, and only the useful kind. No advertising trackers, no third-party profiling, no reselling of attention.',
  rows: [
    { title: 'Essential', body: 'Keeps the site working — remembers your cookie choice and secures the connection. Nothing to opt out of; without these, nothing loads.', meta: 'Session – 12 months' },
    { title: 'Analytics', body: 'A single, privacy-respecting measure of which pages are read and roughly where readers arrive from. Aggregated, never tied to a name.', meta: '12 months' },
    { title: 'Preferences', body: 'Remembers small things you would rather we did not ask twice — such as whether you have dismissed a notice.', meta: '6 months' },
  ],
  managingHeading: 'Managing them yourself',
  managingBody: 'Every browser lets you see, block or delete cookies from its settings. Blocking the essential ones will stop parts of the site working; blocking the rest changes nothing you would notice.',
}

const seedHomepage: Homepage = {
  featuredEyebrow: 'Selected work',
  featuredHeading: 'Proof that the brand decision was the commercial one.',
  capabilitiesEyebrow: 'What we do',
  capabilitiesHeading: 'Capabilities. One way of working.',
  capabilitiesImage: '',
  notesEyebrow: 'Notes — an independent publication',
  journalHeading: 'How we think, in public.',
  ctaEyebrow: 'Start something',
  ctaHeading: 'Tell us the company you want to become.',
  ctaBody:
    'We work with founders, marketing leads and creative directors who suspect their company is better than its reputation. First reply within one working day — from a person, not a form.',
  ctaButtonLabel: 'Start a project',
  ctaButtonUrl: '/contact',
  finalCtaImage: '',
}

const seedNav: NavLink[] = [
  { to: '/work', label: 'Work' },
  { to: '/notes', label: 'Notes' },
  { to: '/studio', label: 'Studio' },
  { to: '/trainings', label: 'Trainings', soon: true },
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
  homeSections: seedHomeSections,
  studio: seedStudio,
  contact: seedContact,
  reportsCopy: seedReportsCopy,
  work: seedWork,
  caseStudiesCopy: seedCaseStudiesCopy,
  capabilitiesCopy: seedCapabilitiesCopy,
  privacyCopy: seedPrivacyCopy,
  cookiesCopy: seedCookiesCopy,
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
  categories: seedCategories,
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
    fetchCategoryMeta().then(v => v && write({ categories: v })),
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
        homeSections: v.sections.length ? v.sections : cache.homeSections,
      })
    }),
    fetchStudioSections().then(v => v && write({ studio: { ...cache.studio, ...v } })),
    fetchContactSections().then(v => v && write({ contact: { ...cache.contact, ...v } })),
    fetchReportsSections().then(v => v && write({ reportsCopy: { ...cache.reportsCopy, ...v } })),
    fetchTrainingsPageSections().then(v => v && write({ trainings: { ...cache.trainings, ...v } })),
    fetchWorkSections().then(v => v && write({ work: { ...cache.work, ...v } })),
    fetchCaseStudiesSections().then(v => v && write({ caseStudiesCopy: { ...cache.caseStudiesCopy, ...v } })),
    fetchCapabilitiesPageSections().then(v => v && write({ capabilitiesCopy: { ...cache.capabilitiesCopy, ...v } })),
    fetchPrivacySections().then(v => v && write({ privacyCopy: { ...cache.privacyCopy, ...v } })),
    fetchCookiesSections().then(v => v && write({ cookiesCopy: { ...cache.cookiesCopy, ...v } })),
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
/* Dutch and French are static translations (src/content.nl.ts, src/content.fr.ts)
   that never touch Supabase or the admin panel — only the English site is
   CMS-editable. Every hook below reads through useSite(), so this single
   switch is enough to localize the whole public site. */
export function useSite(): Site {
  const en = useSyncExternalStore(subscribe, read, () => seed)
  const locale = useLocale()
  if (locale === 'nl') return nlSite
  if (locale === 'fr') return frSite
  return en
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
export function useCategories(): CategoryMeta[] {
  return useSite().categories
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
export function useHomeSections(): string[] {
  return useSite().homeSections
}
export function useStudio(): Studio {
  return useSite().studio
}
export function useContactCopy(): ContactCopy {
  return useSite().contact
}
export function useReportsCopy(): ReportsCopy {
  return useSite().reportsCopy
}
export function useWorkCopy(): PageHeader {
  return useSite().work
}
export function useCaseStudiesCopy(): PageHeader {
  return useSite().caseStudiesCopy
}
export function useCapabilitiesCopy(): CapabilitiesPageCopy {
  return useSite().capabilitiesCopy
}
export function usePrivacyCopy(): LegalCopy {
  return useSite().privacyCopy
}
export function useCookiesCopy(): CookiesCopy {
  return useSite().cookiesCopy
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
