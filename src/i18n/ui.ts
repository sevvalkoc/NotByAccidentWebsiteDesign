/* ── Shared + per-page UI microcopy ───────────────────────────────────────
   Everything visible on the public site that is NOT already sourced from
   the content store (src/content.ts) — buttons, aria-labels, form labels,
   empty states, breadcrumbs, template fragments around dynamic values.
   English lives here as the canonical shape; src/i18n/ui.nl.ts and
   src/i18n/ui.fr.ts are static translations in the same shape, never
   touched by the CMS/admin panel. */
import { useLocale } from '@/i18n/locale'
import { ui as nlUi } from '@/i18n/ui.nl'
import { ui as frUi } from '@/i18n/ui.fr'

export interface UiStrings {
  nav: {
    skipToContent: string
    homeAriaLabel: string
    openMenu: string
    closeMenu: string
    soon: string
  }
  footer: {
    newsletterEyebrow: string
    thankYou: string
    newsletterDisclaimer: string
    emailLabel: string
    emailPlaceholder: string
    subscribe: string
    explore: string
    capabilities: string
    allCapabilities: string
    contact: string
    newBusiness: string
    general: string
    press: string
    elsewhere: string
    companyDescriptor: string
    trainings: string
    privacy: string
    cookies: string
    search: string
  }
  newsletterPopup: {
    close: string
    doneEyebrow: string
    doneBody: string
    eyebrow: string
    heading: string
    body: string
    emailPlaceholder: string
    subscribe: string
    dismiss: string
    formError: string
  }
  home: {
    heroAriaLabel: string
    heroSymbolAlt: string
    heroEyebrow: string
    heroPrefix: string
    heroPhotoAlt: string
    heroCaption: string
    capabilitiesAriaLabel: string
    capabilitiesIntro: (count: number) => string
    seeAllCapabilities: (count: number) => string
    testimonialsAriaLabel: string
    testimonialsEyebrow: string
    showQuoteFrom: (name: string) => string
    partnersAriaLabel: string
    partnersEyebrow: string
    partnersLabel: string
    notesAriaLabel: string
    readNotes: string
    readSuffix: string
    readEssay: string
    clientsAriaLabel: string
    clientsEyebrow: string
    clientsLabel: string
    caseStudiesAriaLabel: string
    allCaseStudies: string
    problem: string
    outcome: string
    workWithUsAriaLabel: string
    itemListName: string
    faqQuestion: string
    faqAnswer: string
    faqServicesQuestion: string
    faqServicesAnswer: (services: string) => string
  }
  work: {
    discipline: string
    year: string
    viewCaseStudy: string
  }
  caseStudy: {
    breadcrumbNavLabel: string
    back: string
    discipline: string
    location: string
    year: string
    problem: string
    insight: string
    intervention: string
    outcome: string
    additionalViewAlt: (name: string) => string
    capabilitiesHeading: string
    nextProject: string
    nextAriaLabel: (name: string) => string
    breadcrumbHome: string
    breadcrumbCaseStudies: string
    titleSuffix: string
  }
  capabilitiesIndex: {
    notSureText: string
    startConversation: string
    breadcrumbHome: string
    breadcrumbCapabilities: string
  }
  capabilityDetail: {
    breadcrumbNavLabel: string
    notFoundLabel: string
    notFoundHeading: string
    allCapabilitiesButton: string
    breadcrumbCapabilities: string
    questionHeading: string
    outcomeHeading: string
    includesHeading: string
    seenInWorkHeading: string
    morePrefix: string
    rarelyOneThing: string
    travelsWithSuffix: (name: string) => string
    talkToUsAbout: (name: string) => string
    allCapabilitiesLink: string
    whatsIncludedSuffix: (name: string) => string
    whatIsWrapper: (name: string) => string
    whatDeliversWrapper: (name: string) => string
    breadcrumbName: string
  }
  studio: {
    thankYou: string
    formError: string
    emailLabel: string
    emailPlaceholder: string
    send: string
    crowdAlt: string
    caption: string
    peopleHeading: string
  }
  blog: {
    title: string
    volTag: string
    body: string
    featurePrefix: string
    readSuffix: string
    readEssay: string
    moreFromJournal: string
    schemaName: string
    schemaDescription: string
  }
  blogPost: {
    breadcrumbNavLabel: string
    embeddedVideo: string
    back: string
    readSuffix: string
    next: string
    nextAriaLabel: (title: string) => string
  }
  trainings: {
    waitingList: string
    thankYou: string
    formError: string
    formAriaLabel: string
    emailLabel: string
    emailPlaceholder: string
    join: string
    format: string
  }
  reports: {
    formError: string
    thankYou: string
    emailLabel: string
    emailPlaceholder: string
    notifyMe: string
    oneEmailPrefix: string
    readJournal: string
  }
  contact: {
    email: string
    responseTime: string
    responseBody: string
    thankYouHeading: string
    thankYouBody: string
    formError: string
    formAriaLabel: string
    name: string
    namePlaceholder: string
    company: string
    companyPlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    budget: string
    selectRange: string
    budgetOptions: string[]
    whatWorking: string
    whatWorkingPlaceholder: string
    send: string
  }
  search: {
    indexEntries: { title: string; blurb: string }[]
    pageLabel: string
    capabilityLabel: string
    caseStudyLabel: string
    noteLabel: string
    heading: string
    ariaLabel: string
    placeholder: string
    resultsCount: (count: number, query: string) => string
    idleText: string
    emptyHeading: string
    emptyBodyPrefix: string
    workLink: string
    notesLink: string
  }
  privacy: {
    lastUpdatedPrefix: string
    onThisPage: string
    questionsPrefix: string
    cookieNoticeLink: string
  }
  cookies: {
    category: string
    whatItDoes: string
    lifespan: string
    fullerPicturePrefix: string
    privacyNoticeLink: string
    unclearPrefix: string
  }
  notFound: {
    code: string
    heading: string
    body: string
    goHome: string
    seeWork: string
    quote: string
    attribution: string
  }
}

export const en: UiStrings = {
  nav: {
    skipToContent: 'Skip to content',
    homeAriaLabel: 'Not by Accident — Home',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    soon: 'Soon',
  },
  footer: {
    newsletterEyebrow: 'The Journal, occasionally by email',
    thankYou: 'Thank you — you’re on the list.',
    newsletterDisclaimer: 'Essays and notes only. No pitches. Unsubscribe in one click.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@company.com',
    subscribe: 'Subscribe',
    explore: 'Explore',
    capabilities: 'Capabilities',
    allCapabilities: 'All capabilities →',
    contact: 'Contact',
    newBusiness: 'New business',
    general: 'General',
    press: 'Press',
    elsewhere: 'Elsewhere',
    companyDescriptor: 'An independent creative company working across brand, product and demand.',
    trainings: 'Trainings',
    privacy: 'Privacy',
    cookies: 'Cookies',
    search: 'Search',
  },
  newsletterPopup: {
    close: 'Close',
    doneEyebrow: 'You’re on the list',
    doneBody: 'Thank you. We’ll be in touch — not often, and only when it’s worth it.',
    eyebrow: 'The Journal, by email',
    heading: 'Read what we actually think.',
    body: 'Essays and notes on brand, product and the business of making things — a few times a year, never a pitch.',
    emailPlaceholder: 'you@company.com',
    subscribe: 'Subscribe',
    dismiss: 'No thanks — maybe later.',
    formError: 'Something went wrong — please try again.',
  },
  home: {
    heroAriaLabel: 'Not by Accident — independent creative company',
    heroSymbolAlt: 'Not by Accident brand symbol',
    heroEyebrow: 'Independent creative company · Amsterdam · Est. 2019',
    heroPrefix: 'We make companies ',
    heroPhotoAlt: 'Materials and notes from a Not by Accident strategy session',
    heroCaption: 'Wanted, on purpose — the working method, not the tagline.',
    capabilitiesAriaLabel: 'Capabilities',
    capabilitiesIntro: count => `Five groups, ${count} capabilities. Take one, or the whole sequence — each has its own team, method and page.`,
    seeAllCapabilities: count => `See all ${count} capabilities`,
    testimonialsAriaLabel: 'Client testimonials',
    testimonialsEyebrow: 'In their words',
    showQuoteFrom: name => `Show quote from ${name}`,
    partnersAriaLabel: 'Partners',
    partnersEyebrow: 'Partners',
    partnersLabel: 'Partners & collaborators',
    notesAriaLabel: 'Notes',
    readNotes: 'Read Notes →',
    readSuffix: ' read',
    readEssay: 'Read the essay →',
    clientsAriaLabel: 'Clients',
    clientsEyebrow: 'Clients',
    clientsLabel: 'Selected clients',
    caseStudiesAriaLabel: 'Case studies',
    allCaseStudies: 'All case studies →',
    problem: 'Problem',
    outcome: 'Outcome',
    workWithUsAriaLabel: 'Work with us',
    itemListName: 'Capabilities',
    faqQuestion: 'What does Not by Accident do?',
    faqAnswer:
      'Not by Accident is an independent creative company working across brand and identity, digital and product, growth and demand, market and expansion, and experiences. We make companies wanted, so that growth becomes easier to earn.',
    faqServicesQuestion: 'What services does Not by Accident offer?',
    faqServicesAnswer: services => services,
  },
  work: {
    discipline: 'Discipline',
    year: 'Year',
    viewCaseStudy: 'View case study',
  },
  caseStudy: {
    breadcrumbNavLabel: 'Breadcrumb',
    back: '← Case Studies',
    discipline: 'Discipline',
    location: 'Location',
    year: 'Year',
    problem: 'Problem',
    insight: 'Insight',
    intervention: 'Intervention',
    outcome: 'Outcome',
    additionalViewAlt: name => `${name} — additional view`,
    capabilitiesHeading: 'Capabilities behind this work',
    nextProject: 'Next project',
    nextAriaLabel: name => `Next: ${name}`,
    breadcrumbHome: 'Home',
    breadcrumbCaseStudies: 'Case Studies',
    titleSuffix: ' — Case Study',
  },
  capabilitiesIndex: {
    notSureText: 'Not sure which you need? That is the first thing we work out together.',
    startConversation: 'Start a conversation',
    breadcrumbHome: 'Home',
    breadcrumbCapabilities: 'Capabilities',
  },
  capabilityDetail: {
    breadcrumbNavLabel: 'Breadcrumb',
    notFoundLabel: '404',
    notFoundHeading: 'That capability moved.',
    allCapabilitiesButton: 'All capabilities',
    breadcrumbCapabilities: 'Capabilities',
    questionHeading: 'The question this answers',
    outcomeHeading: 'What you leave with',
    includesHeading: 'What the engagement includes',
    seenInWorkHeading: 'Seen in the work',
    morePrefix: 'More from ',
    rarelyOneThing: 'Rarely one thing on its own.',
    travelsWithSuffix: name => `${name} usually travels with a few of these. We assemble the team the project needs.`,
    talkToUsAbout: name => `Talk to us about ${name.toLowerCase()}`,
    allCapabilitiesLink: 'All capabilities →',
    whatsIncludedSuffix: name => `${name} — what's included`,
    whatIsWrapper: name => `What is ${name.toLowerCase()}?`,
    whatDeliversWrapper: name => `What does ${name.toLowerCase()} deliver?`,
    breadcrumbName: 'Capabilities',
  },
  studio: {
    thankYou: "Thank you — we'll be in touch.",
    formError: 'Something went wrong — please try again.',
    emailLabel: 'Email address',
    emailPlaceholder: 'Leave your email',
    send: 'Send',
    crowdAlt: 'A crowd gathered at a technology conference in Amsterdam',
    caption: 'Amsterdam, August 2026. A few minutes from TNW.',
    peopleHeading: 'The people',
  },
  blog: {
    title: 'The Journal',
    volTag: 'Vol. 01',
    body: 'An independent point of view on brand, strategy and the businesses we find interesting. Published irregularly, never automated.',
    featurePrefix: 'Feature · ',
    readSuffix: ' read',
    readEssay: 'Read the essay →',
    moreFromJournal: 'More from the Journal',
    schemaName: 'The Journal — Not by Accident',
    schemaDescription: 'Essays and notes on brand strategy, positioning, design and commercial growth.',
  },
  blogPost: {
    breadcrumbNavLabel: 'Breadcrumb',
    embeddedVideo: 'Embedded video',
    back: '← Notes',
    readSuffix: ' read',
    next: 'Next',
    nextAriaLabel: title => `Next: ${title}`,
  },
  trainings: {
    waitingList: 'Waiting list',
    thankYou: "You're on the list — we'll write the moment dates are set.",
    formError: 'Something went wrong — please try again.',
    formAriaLabel: 'Training waiting list',
    emailLabel: 'Email address',
    emailPlaceholder: 'your@email.com',
    join: 'Join the waiting list',
    format: 'Format',
  },
  reports: {
    formError: 'Something went wrong — please try again.',
    thankYou: "Thank you — we'll write the moment the first report is live.",
    emailLabel: 'Email address',
    emailPlaceholder: 'you@company.com',
    notifyMe: 'Notify me',
    oneEmailPrefix: 'One email when it launches. Nothing else. Or write to',
    readJournal: 'In the meantime, read the Journal →',
  },
  contact: {
    email: 'Email',
    responseTime: 'Response time',
    responseBody: 'Usually within one working day.',
    thankYouHeading: 'Thank you. We will be in touch shortly.',
    thankYouBody: 'We typically respond within one working day.',
    formError: 'Something went wrong — please try again.',
    formAriaLabel: 'Contact form',
    name: 'Name',
    namePlaceholder: 'Your name',
    company: 'Company',
    companyPlaceholder: 'Company name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    budget: 'Approximate budget',
    selectRange: 'Select a range',
    budgetOptions: [
      'Under £25,000',
      '£25,000–£75,000',
      '£75,000–£150,000',
      '£150,000–£300,000',
      'Over £300,000',
      'Not sure yet',
    ],
    whatWorking: 'What are you working on?',
    whatWorkingPlaceholder: 'Tell us about your company and what you are trying to achieve. The more specific you are, the better.',
    send: 'Send message',
  },
  search: {
    indexEntries: [
      { title: 'Studio', blurb: 'Who we are, how we think and the people behind the work.' },
      { title: 'Work', blurb: 'A running index of projects, listed plainly.' },
      { title: 'Capabilities', blurb: 'The disciplines we practise and how they fit together.' },
      { title: 'Contact', blurb: 'Write to us about a project or a conversation.' },
      { title: 'Trainings', blurb: 'Workshops and training, coming soon.' },
    ],
    pageLabel: 'Page',
    capabilityLabel: 'Capability',
    caseStudyLabel: 'Case Study',
    noteLabel: 'Note',
    heading: 'Search',
    ariaLabel: 'Search the site',
    placeholder: 'Look for work, notes, a capability…',
    resultsCount: (count, query) => `${count} ${count === 1 ? 'result' : 'results'} for "${query}"`,
    idleText: 'Type to search across case studies, notes and capabilities.',
    emptyHeading: 'Nothing here matches that — yet.',
    emptyBodyPrefix: 'Try a broader word, or start from the ',
    workLink: 'work',
    notesLink: 'notes',
  },
  privacy: {
    lastUpdatedPrefix: 'Last updated · ',
    onThisPage: 'On this page',
    questionsPrefix: 'Questions about any of this? Write to',
    cookieNoticeLink: 'cookie notice',
  },
  cookies: {
    category: 'Category',
    whatItDoes: 'What it does',
    lifespan: 'Lifespan',
    fullerPicturePrefix: 'For the fuller picture of what we hold and why, see our',
    privacyNoticeLink: 'privacy notice',
    unclearPrefix: 'Anything unclear — write to',
  },
  notFound: {
    code: '404',
    heading: 'This page does not exist.',
    body: 'Everything else does. You may have followed a broken link, or the page has moved.',
    goHome: 'Go home',
    seeWork: 'See the work',
    quote: 'We make companies wanted. Growth is what happens next.',
    attribution: 'Not by Accident',
  },
}

export function useT(): UiStrings {
  const locale = useLocale()
  if (locale === 'nl') return nlUi
  if (locale === 'fr') return frUi
  return en
}
