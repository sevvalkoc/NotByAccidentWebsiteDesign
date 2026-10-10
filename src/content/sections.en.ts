/* ── Page content: English defaults ───────────────────────────────────────
   Every page's copy and media, shaped exactly like a `page_sections` row so
   the CMS can override any field. These values are the fallback and the
   seed: scripts/generate-next-seed.ts writes them into migration
   0010_next_site.sql, and the public site prefers whatever the CMS holds.
   Edit content in /admin, not here.

   In titles, wrap a word in *asterisks* to set it in serif italic. */
import type { PageMeta, PageSections, PageSlug } from './types'

const unsplash = (id: string) => `https://images.unsplash.com/${id}?w=2000&auto=format`

export const sectionsEn: Record<PageSlug, PageSections> = {
  home: {
    hero: {
      eyebrow: 'Brand strategy & creative studio · Amsterdam',
      title: 'We make companies *wanted*.',
      subtitle: 'An independent branding agency for founders who need the brand to sell. Strategy, identity, digital and demand, made by one senior team.',
      ctaLabel: 'Start a project',
      ctaUrl: '/contact',
      extra: { cta2Label: 'See the work', cta2Url: '#work', words: ['chosen', 'remembered', 'recommended'] },
      image: { url: unsplash('photo-1764096534662-a194a348c4a0'), alt: 'Materials from a Not by Accident strategy session', kind: 'image' },
    },
    work: {
      eyebrow: 'Selected work',
      title: 'Brands that moved the numbers behind them.',
      ctaLabel: 'The full archive',
      ctaUrl: '/work',
      extra: { projects: ['lavanta', 'studio-marche', 'edde', 'hinterland'] },
    },
    practice: {
      eyebrow: 'Capabilities',
      title: 'Five practices. One team. No hand-offs.',
      ctaLabel: 'Every capability',
      ctaUrl: '/capabilities',
      extra: {
        areas: [
          { key: 'Brand & Identity', label: 'Brand & Identity', text: 'Positioning, naming and identity that give people a reason to pick you over the one next door.' },
          { key: 'Digital & Product', label: 'Digital & Product', text: 'Websites, e-commerce and products where attention turns into a decision.' },
          { key: 'Growth & Demand', label: 'Growth & Demand', text: 'SEO, content and performance marketing that get a brand searched for, not just seen.' },
          { key: 'Market & Expansion', label: 'Market & Expansion', text: 'Research and go-to-market for the next market, before the budget is spent.' },
          { key: 'Experiences', label: 'Experiences', text: 'Events, exhibitions and workshops where people meet the brand in person.' },
        ],
      },
    },
    evidence: {
      eyebrow: 'In their words',
      extra: { testimonial: 'Amara Devlin' },
    },
    studio: {
      eyebrow: 'The studio',
      title: 'Small on purpose. Senior in the room. Commercial by *instinct*.',
      body: 'We began on the growth side of the table, so every piece of brand work here is expected to earn its keep.',
      ctaLabel: 'Inside the studio',
      ctaUrl: '/studio',
      image: { url: unsplash('photo-1649414744605-3bfa4f1870fc'), alt: 'A crowd at a technology conference in Amsterdam', kind: 'image' },
    },
    notes: {
      eyebrow: 'Journal',
      title: 'Notes on brand, strategy and growth.',
      ctaLabel: 'Read the journal',
      ctaUrl: '/notes',
      extra: { notes: [] },
    },
    lab: {
      eyebrow: 'The Lab',
      title: 'Before you enter a market, *question* it.',
      body: 'A new way to understand where your brand belongs, what stands in its way, and who could help it get there.',
      ctaLabel: 'Explore The Lab ↗',
      ctaUrl: '/lab',
      extra: { cta2Label: 'Test your readiness ↗', cta2Url: '/lab/market-readiness' },
    },
    contact: {
      eyebrow: 'New business',
      title: 'Tell us the company you want to *become*.',
      body: 'A person replies within one working day. Never a bot, never a sales script.',
      ctaLabel: 'Start a project',
      ctaUrl: '/contact',
    },
  },

  global: {
    footer: {
      title: 'Wanted, on purpose.',
      body: 'The journal, by email. Essays only, a few times a year.',
      extra: { lastLine: 'Made in Amsterdam. Nothing here is an accident, except', lastLink: 'this' },
    },
    announcement: { title: '', ctaLabel: '', ctaUrl: '' },
    header_nav: {
      title: 'Header menu',
      items: [
        { title: 'Work', body: '/work' },
        { title: 'Capabilities', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notes', body: '/notes' },
        { title: 'The Lab', body: '/lab' },
      ],
    },
    footer_nav: {
      title: 'Footer menu',
      items: [
        { title: 'Work', body: '/work' },
        { title: 'Case studies', body: '/case-studies' },
        { title: 'Capabilities', body: '/capabilities' },
        { title: 'Studio', body: '/studio' },
        { title: 'Notes', body: '/notes' },
        { title: 'Trainings', body: '/trainings' },
        { title: 'Reports', body: '/reports' },
        { title: 'The Lab', body: '/lab' },
        { title: 'Contact', body: '/contact' },
      ],
    },
  },

  work: {
    header: { eyebrow: 'Work', title: 'Brand, digital and growth *work*.', subtitle: 'We take on fewer projects than most agencies, so every one gets senior attention from the first brief to the final number.' },
  },

  'case-studies': {
    header: { eyebrow: 'Case studies', title: 'How the work *worked*.', subtitle: 'Every case follows the same line: the problem, the insight, the decision and what it did to the business.' },
  },

  capabilities: {
    header: {
      eyebrow: 'Capabilities',
      title: 'Everything a brand needs to be *wanted*.',
      subtitle: 'Brand strategy, identity, digital, growth and expansion, in five practices. Hire one, or the whole sequence. Each discipline has its own page.',
    },
    cta: { title: 'Not sure where to start? Most clients aren’t, at first. Working that out is our first conversation.', ctaLabel: 'Talk to us', ctaUrl: '/contact' },
  },

  studio: {
    header: {
      eyebrow: 'Studio',
      title: 'Small on purpose. Senior in the room. Commercial by *instinct*.',
      body: 'Not by Accident is an independent brand strategy and creative studio in Amsterdam, working across brand, digital product and demand. We started on the growth side, which is why the creative work and the commercial case have never sat in separate rooms here.',
      image: { url: unsplash('photo-1649414744605-3bfa4f1870fc'), alt: 'A crowd at a technology conference in Amsterdam', kind: 'image' },
    },
    principles: {
      title: 'How we think',
      items: [
        { title: 'Specific', body: 'Name the material, the month, the number, the street. “A range of” is not a description.' },
        { title: 'Decided', body: 'Two routes, never three. The recommendation comes first. We are paid to have a view.' },
        { title: 'Warm, not soft', body: 'People, hands, imperfection, humour. The work stays sharp.' },
        { title: 'Culturally awake', body: 'References from outside design. Credited always, never explained.' },
        { title: 'Quietly funny', body: 'One human moment per communication. In the last line, never the headline.' },
        { title: 'Commercially literate', body: 'Every soft attribute shows up one step downstream as a hard number.' },
      ],
    },
    culture: {
      title: 'The culture',
      items: [
        { title: 'One room', body: 'Strategy, design and demand sit together from day one.' },
        { title: 'Senior hands', body: 'The people who win the work do the work.' },
        { title: 'Commercial first', body: 'Every decision traces back to a number a client can move.' },
      ],
    },
    locations: { title: 'Where', items: [{ title: 'Amsterdam', body: 'Monday–Thursday, 10:00–17:00 CET' }] },
    signup: { title: 'Not the right moment yet? Leave your email and stay close.' },
  },

  notes: {
    header: { eyebrow: 'Journal', title: 'Notes', subtitle: 'Essays on brand strategy, positioning, naming and growth. An independent point of view, published when there is something worth saying.' },
  },

  trainings: {
    header: { eyebrow: 'Workshops · Opening 2027', title: 'The work, taught by the people who do it.', subtitle: 'Two-day brand strategy and creative direction workshops, in person, for twelve people at most.' },
    body: {
      items: [
        { title: '', body: 'Two workshops from 2027. One on brand strategy: positioning, naming, building a brief. One on creative direction: making work that is different and commercially sound.' },
        { title: '', body: 'In person and deliberately small. Amsterdam, plus one other city a year. No certificate. No slides you will never open again.' },
      ],
    },
    format: {
      title: 'Format',
      items: [
        { title: 'Format', body: 'In-person workshop, two days' },
        { title: 'Group size', body: 'Twelve participants at most' },
        { title: 'Location', body: 'Amsterdam, plus one city a year' },
        { title: 'First date', body: '2027, to be confirmed' },
        { title: 'Disciplines', body: 'Brand Strategy · Creative Direction' },
      ],
    },
    waiting: { title: 'Waiting list', body: 'We will write first when registration opens. One email, no marketing.', ctaLabel: 'Join the list' },
  },

  reports: {
    header: {
      eyebrow: 'Reports · Soon',
      title: 'The research, in the open.',
      subtitle: 'Benchmarks, field notes and the numbers agencies usually keep to themselves, plainly argued. The first report is close.',
    },
    notify: { title: 'Notify me', body: 'One email when it launches. Nothing else.', ctaLabel: 'Notify me' },
  },

  contact: {
    header: {
      eyebrow: 'Contact',
      title: 'Start a *project*.',
      subtitle: 'For founders and marketing leads who suspect their company is better than its reputation.',
      body: 'We take on fewer projects than most, and usually begin with a strategy engagement. If you need a production company or an execution partner, we are probably not the right fit.',
    },
    form: { title: 'Or tell us here', body: 'Usually within one working day.' },
  },

  privacy: {
    header: {
      eyebrow: 'Privacy',
      title: 'What we hold, and why.',
      subtitle: 'We collect very little and treat it plainly. This notice explains how, in language you should not need a lawyer to follow.',
      extra: { lastUpdated: '8 August 2026' },
    },
    legal: {
      items: [
        {
          title: 'Who we are',
          body: 'Not by Accident is an independent creative company. When we refer to “we”, “us” or “our” in this notice, we mean Not by Accident. When we refer to “you”, we mean anyone who visits this website or corresponds with us. Our full registered company details will be added here before this notice is treated as final.\n\nThis notice explains what we collect, why we collect it, and what you can ask us to do about it. It is written to be read, not to be survived.',
        },
        {
          title: 'What we collect',
          body: 'We collect only what a conversation requires. When you write to us through the contact form or by email, we hold your name, your company, your email address and whatever you choose to tell us about your project. We keep it for as long as the conversation is live and for a reasonable period afterwards.\n\nWhen you browse the site, our hosting provider records standard technical information: the pages requested, the approximate region, the browser used. This is ordinary server activity, not surveillance.',
        },
        {
          title: 'Why we hold it',
          body: 'We use your information for one purpose: to respond to you and, where it becomes relevant, to carry out work you have asked us to do. We do not sell it. We do not build advertising profiles. We do not enrich it with data bought from elsewhere.\n\nOur lawful basis is either your consent, given when you write to us, or our legitimate interest in running a small business well.',
        },
        {
          title: 'Who sees it',
          body: 'Your information is seen by the people at Not by Accident who need to see it, and by a short list of service providers who help us operate: email, hosting and analytics. Each is bound by its own obligations. We choose them carefully and review them.',
        },
        {
          title: 'Your rights',
          body: 'You may ask to see the information we hold about you, to correct it, or to have it deleted. You may withdraw consent at any time. You may also complain to the Information Commissioner’s Office, though we would rather you told us first, so we can put it right.\n\nTo exercise any of these rights, write to hello@notbyaccident.com. We will respond within one month, usually sooner.',
        },
      ],
    },
  },

  cookies: {
    header: {
      eyebrow: 'Cookies',
      title: 'A short note on cookies.',
      subtitle: 'We use a handful, and only the useful kind. No advertising trackers, no third-party profiling, no reselling of attention.',
    },
    table: {
      items: [
        { title: 'Essential', body: 'Keeps the site working: remembers your cookie choice and secures the connection. Nothing to opt out of; without these, nothing loads.', meta: 'Session – 12 months' },
        { title: 'Analytics', body: 'A single, privacy-respecting measure of which pages are read and roughly where readers arrive from. Aggregated, never tied to a name.', meta: '12 months' },
        { title: 'Preferences', body: 'Remembers small things you would rather we did not ask twice, such as whether you have dismissed a notice.', meta: '6 months' },
      ],
    },
    managing: {
      title: 'Managing them yourself',
      body: 'Every browser lets you see, block or delete cookies from its settings. Blocking the essential ones will stop parts of the site working; blocking the rest changes nothing you would notice.',
    },
  },

  lab: {
    hero: {
      eyebrow: 'The Lab · Market validation and matching',
      title: 'Before you enter a market, *question* it.',
      subtitle:
        'The Lab tests whether your brand is ready for a new European market, compares the markets you’re weighing, and finds partners whose records fit yours. Then it keeps track of what happens next.',
      ctaLabel: 'Create your account',
      ctaUrl: '/lab/sign-up',
      extra: { cta2Label: 'Test your readiness', cta2Url: '/lab/market-readiness' },
    },
    problem: {
      eyebrow: 'The problem',
      title: 'Expansion advice arrives in pieces.',
      body: 'One firm sells you a market report. Another sells a database. A consultant explains the report, an agency does the outreach, and nobody joins the pieces up. The decision lands back on your desk with four invoices attached.',
    },
    capabilities: {
      eyebrow: 'What it does',
      title: 'Four steps, one place.',
      items: [
        { title: 'Validate', meta: '01', body: 'About twenty questions across six areas, from positioning to returns. A readiness score you can trace back, answer by answer.' },
        { title: 'Understand', meta: '02', body: 'Up to three markets side by side. Where we hold verified information we show the source and the date it was checked. Where we don’t, we say so.' },
        { title: 'Match', meta: '03', body: 'Partners scored on category, geography, price, customer, distribution and readiness, with the reasons written out and the gaps flagged.' },
        { title: 'Act', meta: '04', body: 'Request introductions, follow their progress, and keep the conversations that matter in one short pipeline.' },
      ],
    },
    example: {
      eyebrow: 'Example output',
      title: 'What a result looks like.',
      body: 'Illustrative data for a fictional jewellery brand. Not a client, not a real result.',
      extra: {
        overall: 64,
        band: 'Pilot-ready potential',
        categories: [
          { label: 'Brand foundation', score: 78 },
          { label: 'Product–market fit', score: 58 },
          { label: 'Commercial readiness', score: 70 },
          { label: 'Operational readiness', score: 52 },
          { label: 'Partnership readiness', score: 61 },
          { label: 'Expansion strategy', score: 66 },
        ],
        match: {
          name: 'A concept store (fictional)',
          score: 81,
          text: 'Strong category and geography alignment. Your price positioning also fits this concept store’s recorded range. Distribution requirements still need verification.',
        },
      },
    },
    method: {
      eyebrow: 'How we match',
      title: 'A score you can argue with.',
      body: 'Every compatibility score is a weighted sum of six criteria, all visible. Missing information never counts in a partner’s favour. And a score describes fit, not interest: a high number doesn’t mean anyone is waiting for your call.',
      ctaLabel: 'Read the methodology',
      ctaUrl: '/lab/how-it-works',
    },
    steps: {
      eyebrow: 'How it works',
      title: 'From a question to a conversation.',
      items: [
        { title: 'Register', body: 'An email address and a password. Nothing else yet.' },
        { title: 'Describe your brand', body: 'Three short steps, three to five minutes. Save and come back whenever you like.' },
        { title: 'Take the assessment', body: 'Your score, area by area, with what lifted it and what held it back.' },
        { title: 'Compare markets', body: 'Your readiness, market by market, next to what we know about each one.' },
        { title: 'Review matches', body: 'Partners ranked by fit, each with its reasons and limitations.' },
        { title: 'Request introductions', body: 'Our team reviews every request, then you follow it through here.' },
      ],
    },
    studio: {
      eyebrow: 'Built in a studio',
      title: 'The Lab is where our studio work starts.',
      body: 'It grew out of the questions we ask every brand before an expansion project. Use it on your own. When you want people in the room, the studio is one conversation away.',
      ctaLabel: 'Work with the studio',
      ctaUrl: '/contact',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Before you sign up.',
      items: [
        { title: 'Is the readiness score a prediction?', body: 'No. It summarises your own answers against a published method. A band such as “Pilot-ready potential” describes how prepared you are, not how likely you are to succeed.' },
        { title: 'Where does the market information come from?', body: 'From profiles our team maintains, each with its sources and the date it was last checked. A profile that holds basic facts only is labelled that way.' },
        { title: 'Are the partners expecting my introduction?', body: 'Not necessarily. Every partner carries a status, from research prospect to confirmed participating partner, and our team reviews each request before anyone is contacted.' },
        { title: 'Who sees my data?', body: 'You, anyone you add to your brand, and our team when running introductions. Nothing goes to a partner unless you ask for an introduction. You can export or delete everything from Settings.' },
        { title: 'Which markets are covered?', body: 'We start with the Netherlands, Germany, the United Kingdom, France, Belgium, Denmark, Sweden, Italy and Spain, and add others as we research them.' },
      ],
    },
    cta: {
      title: 'Start with the questions.',
      body: 'An account takes a minute. The assessment takes about ten.',
      ctaLabel: 'Create your account',
      ctaUrl: '/lab/sign-up',
    },
  },

  'lab-how': {
    header: {
      eyebrow: 'The Lab · Methodology',
      title: 'How the Lab *scores*.',
      subtitle: 'Three engines, all deterministic: the same answers and the same configuration always produce the same result. No sampling, no black box.',
    },
    readiness: {
      title: 'Readiness',
      body: 'Each question belongs to one of six areas and carries a weight. An answer earns 0 to 100 points. An area’s score is the weighted average of the questions that apply to you; questions that don’t apply, such as returns for a software company, leave the calculation instead of counting as zero. The overall score combines the areas with the weights below. Every result records the version of the questions and weights it used, so an old report never changes when the method does.',
    },
    bands: {
      title: 'What the bands mean',
      body: 'Bands are product-defined readiness categories. They describe preparation, not the chance of success.',
    },
    market: {
      title: 'Market fit',
      body: 'For each market we combine your overall readiness, any existing presence, language readiness, logistics capability (with a rule for crossing the EU customs border) and the partners in our database for your category. A market-fit score appears only when there is enough to go on, and markets are ranked only when the scores are at least five points apart. Every factor is labelled by where its evidence comes from: your answers, our verified profiles, our partner records or a product rule.',
    },
    matching: {
      title: 'Matching',
      body: 'Clearly incompatible partners are filtered out first: excluded categories, offerings they don’t take, markets they don’t cover, a price tier two steps away. The rest are scored on six weighted criteria. A criterion we can’t evaluate earns nothing, so missing information never lifts a score, and each match lists what still needs checking.',
    },
    limits: {
      title: 'What the numbers don’t say',
      items: [
        { title: 'Readiness is self-reported', body: 'The score is only as accurate as the answers behind it.' },
        { title: 'Fit is not interest', body: 'A compatibility score says the recorded attributes align. It says nothing about whether a partner is looking for new brands.' },
        { title: 'Our data has edges', body: 'Market profiles and partner records are researched by our team and dated. Where we have little, we show little.' },
      ],
    },
    cta: { title: 'See your own numbers.', ctaLabel: 'Create your account', ctaUrl: '/lab/sign-up' },
  },

  'lab-readiness': {
    header: {
      eyebrow: 'The Lab · Readiness preview',
      title: 'How ready is your brand for a new *market*?',
      subtitle: 'Six questions, two minutes, an indicative result. Nothing you answer here is stored.',
    },
    result: {
      title: 'An indicative read',
      body: 'Based on six of the twenty or so questions in the full assessment. The full version scores six areas, explains every number, compares markets and suggests what to do next.',
      ctaLabel: 'Take the full assessment',
      ctaUrl: '/lab/sign-up',
    },
  },

  'lab-app': {
    onboarding: { title: 'Tell us about your brand', body: 'Three short steps. Everything saves as you go, and you can change any of it later.' },
    assessment_intro: {
      title: 'The readiness assessment',
      body: 'About twenty questions across six areas. Answer as things are, not as you hope they’ll be: the result is only useful if it’s true. Progress saves after every answer.',
    },
    results_note: {
      body: 'Readiness bands are product-defined categories based on your answers. They describe how prepared you are, not how likely you are to succeed.',
    },
    markets_note: {
      body: 'Market fit combines your answers with the facts recorded in our profiles. It describes your readiness for a market, not the size of the opportunity.',
    },
    matches_empty: {
      title: 'We haven’t found a strong match in our current database.',
      body: 'That doesn’t mean one doesn’t exist. Tell us what you’re looking for and our team will research it.',
      ctaLabel: 'Request research',
    },
    intro_note: {
      body: 'Requests go to our team first. We check fit and context before anyone is contacted, and a compatibility score doesn’t guarantee a partner’s interest.',
    },
    opportunities_empty: { title: 'No opportunities yet.', body: 'When an introduction happens it appears here. You can also add conversations you started yourself.' },
    reports_empty: { title: 'No reports yet.', body: 'Generate one after your first assessment. It captures your readiness, markets, matches and next steps as they stand today.' },
  },

  '404': {
    header: { eyebrow: 'Error 404', title: 'This page is an accident.', body: 'Everything else here was made on purpose. The link may be broken, or the page has moved.' },
  },
}

/* SEO defaults per page. Editable per page in /admin (Pages → SEO). */
export const pageMetaEn: Record<PageSlug, PageMeta> = {
  home: {
    title: 'Not by Accident · Branding agency & creative studio, Amsterdam',
    description:
      'Independent branding agency in Amsterdam. Brand strategy, identity, websites and growth marketing that make companies wanted, chosen and remembered.',
  },
  global: { title: 'Not by Accident', description: '' },
  work: { title: 'Work · Brand, digital & growth projects', description: 'Selected projects by Not by Accident: brand strategy, identity, websites and growth campaigns for founders who need the brand to sell.' },
  'case-studies': {
    title: 'Case Studies · Branding results',
    description: 'Brand strategy and growth case studies from an Amsterdam studio: the problem, the insight, the decision and the commercial result.',
  },
  capabilities: {
    title: 'Capabilities · Branding, digital & growth',
    description: 'Brand strategy, naming, visual identity, website design, SEO, performance marketing, market research and events. Five practices, one studio in Amsterdam.',
  },
  studio: {
    title: 'Studio · Independent creative company, Amsterdam',
    description: 'Not by Accident is an independent brand strategy and creative studio in Amsterdam. Small on purpose, senior in the room, commercial by instinct.',
  },
  notes: {
    title: 'Journal · Essays on brand strategy',
    description: 'Essays on brand strategy, positioning, naming, design and commercial growth from Not by Accident, an independent studio in Amsterdam.',
  },
  trainings: { title: 'Brand Strategy Workshops', description: 'Brand strategy and creative direction workshops from Not by Accident. Two days, in person, twelve people at most. Opening 2027.' },
  reports: { title: 'Reports', description: 'Benchmarks, field notes and original research on brand and growth from Not by Accident. The first report is coming soon.' },
  contact: { title: 'Contact · Start a brand project', description: 'Start a brand, digital or growth project with Not by Accident in Amsterdam. Tell us the company you want to become. A person replies within one working day.' },
  privacy: { title: 'Privacy', description: 'How Not by Accident collects, uses and protects your personal data.' },
  cookies: { title: 'Cookies', description: 'How Not by Accident uses cookies and similar technologies on this website.' },
  lab: {
    title: 'The Lab · European market entry for independent brands',
    description: 'Test your brand’s readiness for a new European market, compare markets on sourced information and find compatible retail and distribution partners. By Not by Accident, Amsterdam.',
  },
  'lab-how': {
    title: 'How The Lab works · Readiness scoring and partner matching',
    description: 'The methodology behind The Lab: how expansion readiness is scored, how markets are compared and how partner matches are calculated and explained.',
  },
  'lab-readiness': {
    title: 'Expansion readiness test for consumer brands · The Lab',
    description: 'Six questions, two minutes: an indicative read on how ready your brand is for a new European market. Free, and nothing you answer is stored.',
  },
  'lab-app': { title: 'The Lab', description: 'Your Lab workspace.' },
  '404': { title: 'Page not found', description: 'This page does not exist.' },
}
