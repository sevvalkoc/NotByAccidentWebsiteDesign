/* ── English UI microcopy ──────────────────────────────────────────────────
   Interface strings only: labels, buttons, form fields, aria text, small
   templates around records. Page content (headlines, intros, CTAs, images)
   is not here: it lives in the CMS, with defaults in sections.en.ts. */

export const en = {
  nav: {
    skip: 'Skip to content',
    home: 'Not by Accident, home',
    main: 'Main',
    menu: 'Menu',
    close: 'Close',
    soon: 'Soon',
    breadcrumb: 'Breadcrumb',
    homeCrumb: 'Home',
    contact: 'Contact',
    footer: 'Site map',
  },

  pages: {
    work: 'Work',
    caseStudies: 'Case studies',
    capabilities: 'Capabilities',
    notes: 'Notes',
    studio: 'Studio',
    trainings: 'Trainings',
    reports: 'Reports',
    contact: 'Contact',
    search: 'Search',
    privacy: 'Privacy',
    cookies: 'Cookies',
  },

  index: {
    write: 'Write to us',
    elsewhere: 'Elsewhere',
    languages: 'Language',
  },

  clock: {
    open: (time: string) => `Open · ${time} Amsterdam`,
    closed: (time: string, back: string) => `Closed · ${time} Amsterdam · back ${back}`,
    today: 'today',
    tomorrow: 'tomorrow',
  },

  home: {
    scroll: 'Scroll',
    viewCase: 'View case',
    inProgress: 'In progress',
    nextVoice: 'Next',
    prevVoice: 'Previous testimonial',
    nextVoiceLabel: 'Next testimonial',
    voices: 'Testimonials',
    of: (a: number, b: number) => `${a} / ${b}`,
  },

  footer: {
    newBusiness: 'New business',
    general: 'General',
    press: 'Press',
    elsewhere: 'Elsewhere',
    rights: (y: number) => `© ${y} Not by Accident`,
  },

  climate: {
    label: 'Carbon, this page',
    measuring: 'Measuring this page…',
    unit: 'g CO₂e',
    perView: 'per page view',
    scale: 'Sustainable Web Design rating, A+ (lowest) to F',
    how: 'How we measure',
    method:
      'Your browser reports every byte this page transfers, live, and we convert the total with the Sustainable Web Design model (v4) through CO2.js, the Green Web Foundation’s open-source library. It assumes a global-average electricity grid and standard hosting.',
    why: 'Low by design: prerendered pages, two self-hosted fonts, no third-party tracking scripts, no WebGL and no animation libraries.',
    unmeasured: (n: number) => `${n} ${n === 1 ? 'file' : 'files'} from other servers didn’t report a size and ${n === 1 ? 'isn’t' : 'aren’t'} counted.`,
  },

  forms: {
    email: 'Email address',
    emailHelp: 'We only use it to reply.',
    emailPlaceholder: 'you@company.com',
    subscribe: 'Subscribe',
    subscribed: 'You are on the list. Thank you.',
    sending: 'Sending…',
    error: 'That did not send. Try again, or email us directly.',
    offline: 'The form is not connected yet. Please email us directly.',
    required: 'Required',
  },

  work: {
    viewIndex: 'Index',
    viewSheet: 'Sheet',
    viewLabel: 'View',
    cols: { no: 'No.', project: 'Project', brief: 'Brief', discipline: 'Discipline', place: 'Place', year: 'Year' },
  },

  caseStudies: { read: 'Read the case' },

  caseStudy: {
    titleSuffix: 'Case study',
    client: 'Client',
    discipline: 'Discipline',
    location: 'Location',
    year: 'Year',
    problem: 'The problem',
    insight: 'The insight',
    intervention: 'What we decided',
    outcome: 'What happened',
    capabilities: 'Capabilities',
    gallery: 'The work',
    credits: 'Credits',
    visit: 'Visit the project',
    next: 'Next case',
    inProgress: 'In progress. More when we can.',
  },

  capabilities: {
    group: 'Practice',
    count: (n: number) => `${n} ${n === 1 ? 'discipline' : 'disciplines'}`,
  },

  capability: {
    question: 'The question it answers',
    outcome: 'What you leave with',
    includes: 'What the engagement includes',
    seen: 'Seen in the work',
    alsoIn: (group: string) => `Also in ${group}`,
    talk: (name: string) => `Talk to us about ${name.toLowerCase()}`,
    whatIs: (name: string) => `What is ${name.toLowerCase()}?`,
    whatDelivers: (name: string) => `What does ${name.toLowerCase()} deliver?`,
    included: (name: string) => `${name}: what is included`,
    all: 'All capabilities',
  },

  notes: { all: 'All', filter: 'Filter by kind', read: 'read', schemaName: 'The Journal · Not by Accident' },

  note: { next: 'Next note', published: 'Published', video: 'Embedded video' },

  trainings: { thanks: 'You are on the list. We will write when dates are set.' },

  reports: { thanks: 'Thank you. We will write when the first report is live.', meanwhile: 'Meanwhile, read the notes' },

  contact: {
    direct: 'Directly',
    hours: 'Hours',
    name: 'Name',
    nameHelp: 'So we know who we are writing to.',
    company: 'Company',
    companyHelp: 'Optional.',
    email: 'Email',
    emailHelp: 'We reply here, nowhere else.',
    budget: 'Approximate budget',
    budgetHelp: 'A range is enough. Not sure is a fine answer.',
    budgetPick: 'Select a range',
    budgetOptions: ['Under £25,000', '£25,000–£75,000', '£75,000–£150,000', '£150,000–£300,000', 'Over £300,000', 'Not sure yet'],
    message: 'What are you working on?',
    messageHelp: 'The company, and what you are trying to change. Specific beats long.',
    send: 'Send',
    thanks: 'Thank you. A person will reply within one working day.',
  },

  search: {
    seoTitle: 'Search',
    seoDescription: 'Search Not by Accident: work, capabilities and notes.',
    h1: 'Search',
    label: 'Search the site',
    placeholder: 'A project, a note, a discipline…',
    idle: 'Type to search case studies, notes and capabilities.',
    results: (n: number, q: string) => `${n} ${n === 1 ? 'result' : 'results'} for “${q}”`,
    empty: 'Nothing matches that yet. Try a broader word, or start from',
    kinds: { page: 'Page', capability: 'Capability', case: 'Case study', note: 'Note' },
  },

  privacy: { updated: 'Last updated', onThisPage: 'On this page', questions: 'Questions about any of this? Write to' },

  cookies: { category: 'Category', does: 'What it does', lifespan: 'Lifespan', fuller: 'For the fuller picture of what we hold and why, see the', privacyLink: 'privacy notice' },

  notFound: { tidy: 'Put it back', untidy: 'Undo', home: 'Go home', work: 'See the work', hint: 'Drag the letters, or put them back in order.' },
}

export type Copy = typeof en
