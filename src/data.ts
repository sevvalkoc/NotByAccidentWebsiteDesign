/* ── Case studies ─────────────────────────────────────────────────────────
   Each project is told as Problem → Insight → Intervention → Outcome, and
   linked to the capability pages it actually drew on — so the site can
   argue, not just show. */

export interface ProjectNarrative {
  problem: string
  insight: string
  intervention: string
  outcome: string
}

export interface Project {
  id: string
  num: string
  name: string
  discipline: string
  year: string
  location: string
  brief: string
  narrative: ProjectNarrative | null
  services: string[]
  relatedCapabilities: string[]
  img: string
  heroImg: string
  result: string
  slug: string
  featured: boolean
}

export const projects: Project[] = [
  {
    id: '1',
    num: '01',
    name: 'Lavanta',
    discipline: 'Identity · Product · Demand',
    year: '2024',
    location: 'London',
    brief: 'A jewellery brand that was being admired and not bought.',
    narrative: {
      problem: 'Lavanta came to us three years into existence with a clear problem: strong product, strong following, soft sales.',
      insight: 'The brand was being admired, not bought — priced like affordable luxury when it was already being worn like an heirloom. The gap was never the product. It was the story people had no permission to tell about owning it.',
      intervention: 'We repositioned the brand around the idea of heirloom at a contemporary price point — not affordable luxury, but the last piece in a category of one — and rebuilt the identity, product and demand system around that single idea.',
      outcome: '+34% conversion in six months, and a waiting list for the new collection.',
    },
    services: ['Brand Strategy', 'Creative Direction', 'SEO', 'Growth Strategy'],
    relatedCapabilities: ['brand-strategy', 'creative-direction', 'seo', 'growth-strategy'],
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=1600&h=1000&fit=crop&auto=format',
    result: '+34% conversion in six months, and a waiting list.',
    slug: 'lavanta',
    featured: true,
  },
  {
    id: '2',
    num: '02',
    name: 'Studio Marché',
    discipline: 'Position · Demand',
    year: '2025',
    location: 'Paris',
    brief: 'A market that needed to feel like it belonged to its neighbourhood.',
    narrative: {
      problem: 'Studio Marché had been running for four years without ever answering the question most successful markets never ask: what are we, exactly?',
      insight: 'Not the vendors, not the footfall — the market itself was the brand, and nobody had named it as one thing. Every stall had its own identity. The market had none.',
      intervention: 'We defined a position that made the market itself the brand, not the sum of what was sold there, then built the creative system and campaign that let every vendor sit inside it without losing their own voice.',
      outcome: 'Footfall up 22%, and a market that finally reads as one place.',
    },
    services: ['Brand Strategy', 'Brand Positioning', 'Creative Direction', 'Campaign Strategy'],
    relatedCapabilities: ['brand-strategy', 'brand-positioning', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1759050486852-fdfe2fdc7bea?w=1600&h=1000&fit=crop&auto=format',
    result: 'Footfall up 22%, and a market that finally reads as one place.',
    slug: 'studio-marche',
    featured: false,
  },
  {
    id: '3',
    num: '03',
    name: 'Edde',
    discipline: 'Identity · Digital',
    year: '2025',
    location: 'Berlin',
    brief: 'A skincare brand built to age alongside its customers.',
    narrative: {
      problem: "Most skincare brands are afraid of ageing, and build their entire identity around reversing it. Edde's customers were not afraid of it, and the brand did not yet reflect that.",
      insight: 'Visible time was not something to hide from this audience. It was a credential — evidence of a life the product was there to support, not correct.',
      intervention: 'We built an identity and digital system that treated ageing as something to understand rather than reverse, from the language on the packaging to the words used on the product pages.',
      outcome: 'Repeat purchase up 41% among customers over fifty.',
    },
    services: ['Visual Identity', 'Verbal Identity', 'Website Design & Development', 'UX/UI Design'],
    relatedCapabilities: ['brand-identity', 'verbal-identity', 'web-design-development', 'ux-ui-design'],
    img: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?w=1600&h=1000&fit=crop&auto=format',
    result: 'Repeat purchase up 41% among customers over fifty.',
    slug: 'edde',
    featured: false,
  },
  {
    id: '4',
    num: '04',
    name: 'Hinterland',
    discipline: 'Identity · Campaigns',
    year: '2025',
    location: 'Melbourne',
    brief: 'A hospitality group that needed to mean something in three cities at once.',
    narrative: {
      problem: 'Hinterland operated twelve venues across three cities. It was successful by most measures and unrecognisable as a single brand.',
      insight: 'The problem was not inconsistency of taste — every venue looked considered on its own. It was the absence of a system that let them all be recognisably one company without being identical.',
      intervention: 'We built a brand architecture and identity system that could flex across formats — restaurant, bar, event space — while remaining unmistakably the same company, then rolled it out across all twelve venues.',
      outcome: 'One brand across twelve venues, three cities, no confusion.',
    },
    services: ['Brand Strategy', 'Brand Architecture', 'Creative Direction', 'Campaign Strategy'],
    relatedCapabilities: ['brand-strategy', 'brand-architecture', 'creative-direction', 'campaign-strategy'],
    img: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440047944-0b5d792213a9?w=1600&h=1000&fit=crop&auto=format',
    result: 'One brand across twelve venues, three cities, no confusion.',
    slug: 'hinterland',
    featured: false,
  },
  {
    id: '5',
    num: '05',
    name: 'Unnamed Project',
    discipline: 'Position',
    year: '2026',
    location: 'Undisclosed',
    brief: 'In progress. More when we can.',
    narrative: null,
    services: ['Brand Strategy'],
    relatedCapabilities: ['brand-strategy'],
    img: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1200&h=800&fit=crop&auto=format',
    heroImg: 'https://images.unsplash.com/photo-1771440048218-68069773fa81?w=1600&h=1000&fit=crop&auto=format',
    result: 'In progress. More when we can.',
    slug: 'unnamed-2026',
    featured: false,
  },
]

/* Renderable body blocks for an article — mirrors the admin's ArticleBlock
   (src/lib/database.types.ts) but with image blocks carrying a resolved
   `url` instead of a raw media id, since the public site has no reason to
   know about the media table's internal ids. */
export type NoteBlock =
  | { type: 'h2' | 'h3' | 'paragraph' | 'quote' | 'callout'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'divider' }
  | { type: 'embed'; url: string }

export interface Note {
  id: string
  title: string
  subtitle: string
  body: string
  /* Present when the article was written with the CMS's block editor —
     BlogPost renders these directly instead of the plain-paragraph `body`
     string, so lists/images/quotes/embeds/dividers survive. Absent for the
     static seed content below, which only ever needed plain paragraphs. */
  blocks?: NoteBlock[]
  date: string
  category: string
  readTime: string
  img: string
  slug: string
}

export const notes: Note[] = [
  {
    id: '1',
    title: "The brief is never the brief",
    subtitle: "Why the document handed to a creative company at the start of a project almost always describes the symptom, not the problem.",
    body: `There is a document that exists at the start of every brand project. It is usually twelve pages long. It has a section called 'Background', a section called 'Objectives', and a section called 'The Challenge'. It is called a brief.

It is rarely a brief.

What most clients hand over at the start of a project is a description of the effect of a problem they have not yet named. The brief says: our conversion rate is low. It says: people don't understand what we sell. It says: we feel premium but our price point doesn't reflect it.

These are symptoms. The brief is a list of symptoms. The actual problem — the one that, if solved, makes all the symptoms go away — is never in the brief, because the client does not know what it is. If they knew, they would have fixed it already.

This is not a criticism. It is the nature of the work. The brief exists to start a conversation, not to define the answer.

A creative company that takes a brief literally is usually building the wrong thing. Not because the client is wrong, but because the client cannot see the shape of their own problem. That is what they are paying for.

The first job of any strategy engagement is to translate the brief into the real question. This is harder than it sounds and takes longer than most clients expect. It is almost never appreciated until it is done.`,
    date: '3 July 2026',
    category: 'Essay',
    readTime: '8 min',
    img: 'https://images.unsplash.com/photo-1661178081018-d1b8e685ef10?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-brief-is-never-the-brief',
  },
  {
    id: '2',
    title: "What packaging actually does",
    subtitle: "A note on the difference between packaging that looks expensive and packaging that makes a product cost more.",
    body: `Packaging has a job. Most packaging forgets what the job is.

The job is not to look expensive. A thing that looks expensive is trying. The job is to make someone feel, at the moment they hold it, that the price they paid was correct. That the price was, in fact, conservative.

This is a much harder thing to achieve, because it requires the packaging to communicate something true about the product rather than something aspirational about the brand. And most brands do not know something true about their product that is worth communicating. They know what category they are in. They know their USP. They do not know what makes their product genuinely different from the thing beside it on the shelf.

Good packaging is the visual translation of product truth. When the truth is strong, the packaging can be minimal. When the truth is weak, no amount of embossing or weight of board will save it.`,
    date: '18 June 2026',
    category: 'Notes',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1636014724389-270c4e9c0100?w=1200&h=800&fit=crop&auto=format',
    slug: 'what-packaging-actually-does',
  },
  {
    id: '3',
    title: "Naming is not a creative exercise",
    subtitle: "On the misconception that a good brand name comes from a long list and a vote.",
    body: `Every naming project starts the same way. The client wants a list. The longer the list, the better. They believe that somewhere inside a list of four hundred names, the right one is hiding.

It is not.

A brand name is a bet on a set of values that do not yet exist in the market. It does not describe the company. It does not explain what the company sells. It is the beginning of a reputation, which means it only means something after years of work have made it mean something.

What this means in practice is that the name almost never matters as much as the client thinks it does, and the process of naming almost always matters more. A naming process that requires everyone in the room to agree is a process designed to produce a mediocre outcome that offends no one.

The best names come from a decision, not a consensus.`,
    date: '2 May 2026',
    category: 'Essay',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1483366774565-c783b9f70e2c?w=1200&h=800&fit=crop&auto=format',
    slug: 'naming-is-not-a-creative-exercise',
  },
  {
    id: '4',
    title: "Why growth is a brand problem",
    subtitle: "The point at which demand generation and brand strategy become the same discipline.",
    body: `There is a version of marketing that treats brand and demand as separate budgets with separate goals. Brand is what you spend on awareness. Demand is what you spend on conversion. The two teams meet monthly and disagree about attribution.

This separation made some sense when media was expensive and brand building required years of patient investment. It makes less sense now, when the same piece of work can build awareness, generate desire and drive a transaction in a single scroll.

The most commercially effective brands we have worked with do not separate these things. They understand that every touchpoint is simultaneously doing brand work and demand work. The distinction is a legacy of media planning, not a useful description of how people actually decide to buy something.

Growth is a brand problem because desire is a brand outcome. You do not generate demand for something people do not want. You build wanting first. Growth comes next.`,
    date: '14 April 2026',
    category: 'Essay',
    readTime: '7 min',
    img: 'https://images.unsplash.com/photo-1654481414716-2f4ab5fe0fbe?w=1200&h=800&fit=crop&auto=format',
    slug: 'why-growth-is-a-brand-problem',
  },
  {
    id: '5',
    title: "The tyranny of the reference",
    subtitle: "Why the mood board a client arrives with is usually a description of the last brand that impressed them, not the one they should become.",
    body: `Every project begins with references. A folder, a board, a link to three companies the client admires. This is meant to be helpful, and sometimes it is. More often it is a quiet act of surrender.

A reference is a description of a problem someone else already solved. It is the visible outcome of a strategy you cannot see, made for a company you are not. Borrowing the outcome without the strategy is how brands end up looking expensive and meaning nothing.

The companies worth admiring did not arrive at their look by collecting references. They arrived at it by understanding something true about themselves that no one else could claim. The confidence you are responding to is not aesthetic. It is the confidence of a company that knows exactly what it is.

So we take the references seriously — not as instructions, but as evidence. What is it, precisely, that you envy here? Nine times out of ten the answer is not the typeface or the palette. It is the certainty. And certainty cannot be referenced. It has to be earned.`,
    date: '9 April 2026',
    category: 'Essay',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-tyranny-of-the-reference',
  },
  {
    id: '6',
    title: "Premium is a promise, not a finish",
    subtitle: "On the difference between a brand that looks costly and a brand that behaves as though it is worth the money.",
    body: `Clients ask for premium the way they ask for the weather. As if it were a setting. Make it feel more premium — add some black, a serif, a little space.

But premium is not a finish you apply at the end. It is a promise you keep at every point of contact, most of which have nothing to do with how anything looks. It is the speed of the reply. The quality of the box. The person who answers the phone. The fact that nothing is oversold and nothing disappoints.

A brand feels expensive when the experience never once contradicts the price. The moment it does — a clumsy checkout, a cheap email, a promise not kept — the spell breaks, and no amount of gold foil will restore it.

This is inconvenient, because it means premium is not something we can hand over in a deck. It is a standard the whole company has to hold, long after we have gone. Our job is to define that standard precisely enough that it can be defended. Keeping it is the client's.`,
    date: '20 March 2026',
    category: 'Notes',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop&auto=format',
    slug: 'premium-is-a-promise-not-a-finish',
  },
  {
    id: '7',
    title: "In defence of the slow project",
    subtitle: "Why the best brand work resists the timeline it was sold on, and what that actually costs.",
    body: `Every good project has a moment where it should slow down and almost never does. It is the moment after the research and before the making, when the honest answer is: we do not yet know what this is.

The pressure at that point is enormous. There is a timeline. There are people waiting. There is a natural human urge to convert uncertainty into activity, to start producing something so that it at least looks like progress. This is how most projects go quietly wrong — not through bad work, but through work made too early, before the thinking had finished.

The slow project is not slow because anyone is idle. It is slow because it refuses to make things it cannot yet justify. It holds the uncomfortable open question a few days longer than feels reasonable, because the alternative is to answer it badly and spend the next three months defending the answer.

We are not romantic about time. Slow is expensive and we know it. But the most expensive thing a company can do is build the wrong brand quickly, then live inside it for a decade.`,
    date: '28 February 2026',
    category: 'Field notes',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=1200&h=800&fit=crop&auto=format',
    slug: 'in-defence-of-the-slow-project',
  },
  {
    id: '8',
    title: "The audience is not everyone",
    subtitle: "A note on why the instinct to appeal to more people is the surest way to move fewer of them.",
    body: `The most common note we receive on a piece of strategy is some version of: could this speak to more people? It is asked in good faith and it is almost always wrong.

A brand that tries to be for everyone is legible to no one. It rounds off every edge that might have made someone choose it, in the hope of offending no one who might have walked past anyway. The result is a brand that is technically acceptable to a large group and genuinely wanted by none of it.

Wanting is specific. It is the feeling that something was made for you, by people who understood you well enough to leave other people out. That feeling is impossible to manufacture at scale, and it is the only feeling that reliably moves someone from interest to purchase.

So when we narrow the audience, we are not shrinking the opportunity. We are concentrating it. A brand that a small group cannot live without will always outgrow a brand that a large group can take or leave. Reach is a distribution problem. Desire is a definition problem. Solve the second one first.`,
    date: '11 February 2026',
    category: 'Essay',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-audience-is-not-everyone',
  },
  {
    id: '9',
    title: "A logo is the least of it",
    subtitle: "Why the mark everyone argues about is the smallest decision in a brand, and the one that should be made last.",
    body: `The logo gets the meeting. It gets the revisions, the opinions, the person who was quiet all project suddenly finding their voice. It is the part everyone feels qualified to judge, because it is the part that looks like a decision.

But a logo is a signature, and a signature only means something because of everything the person has done under it. On its own it is a shape. It acquires meaning through repetition, through the quality of the work it sits beside, through years of a company behaving consistently enough that the shape starts to stand for something.

This is why we make it late, and quietly. By the time we design the mark, the hard decisions are already made — the position, the voice, the system. The logo just has to sit at the front of all that without contradicting it. When the thinking underneath is strong, almost any competent mark will do. When it is weak, no mark will save it.

Spend the argument on the strategy. Let the logo be the easy part.`,
    date: '22 January 2026',
    category: 'Notes',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&h=800&fit=crop&auto=format',
    slug: 'a-logo-is-the-least-of-it',
  },
  {
    id: '10',
    title: "The cost of sounding like everyone",
    subtitle: "On the strange comfort of the words every company uses, and the price of hiding inside them.",
    body: `Read enough brand copy and you start to notice it is all the same. Everyone is passionate. Everyone is innovative. Everyone puts the customer at the heart of everything they do. The words are so common they have stopped carrying information — they are noise dressed as meaning.

Companies reach for these words because they are safe. Nobody was ever fired for calling their company innovative. But safe language has a cost that does not show up on any invoice: it makes you invisible. If you sound like everyone, you are asking to be remembered as no one.

The alternative is frightening, because it requires saying something specific enough that some people will disagree. A real voice has edges. It leaves things out. It commits to a way of seeing the world that not everyone will share, which is exactly what makes the people who do share it feel found.

We spend a lot of time deleting the words that could belong to anyone. What is left is usually smaller, plainer and far more yours.`,
    date: '8 January 2026',
    category: 'Essay',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=800&fit=crop&auto=format',
    slug: 'the-cost-of-sounding-like-everyone',
  },
  {
    id: '11',
    title: "Consistency is not repetition",
    subtitle: "The difference between a brand that feels coherent and one that is merely identical everywhere.",
    body: `Somewhere along the way, consistency came to mean sameness. Use the logo at this size. This blue, never that one. The same headline treatment on every surface. Guidelines became a list of prohibitions, and the brand became a thing you could break but never build.

Real consistency is not about repeating the same elements. It is about repeating the same judgement. It is the reason two pieces made by different people, in different formats, years apart, still feel like they came from the same mind. That coherence does not come from locking everything down. It comes from everyone involved understanding what the brand is trying to be, so their thousand small decisions point the same way.

Rigid brands look consistent in a grid and fall apart in the world, because the world always asks for something the guidelines did not anticipate. Coherent brands flex without losing themselves, because the thing holding them together was never the rules — it was the taste underneath the rules.

Write down the judgement, not just the measurements.`,
    date: '17 December 2025',
    category: 'Field notes',
    readTime: '6 min',
    img: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=1200&h=800&fit=crop&auto=format',
    slug: 'consistency-is-not-repetition',
  },
  {
    id: '12',
    title: "Say the price out loud",
    subtitle: "Why a brand that is shy about what it costs is usually unsure of what it is worth.",
    body: `You can tell a lot about a company by how it behaves around its own price. The confident ones state it plainly and move on. The unsure ones bury it, gate it behind a form, surround it with justification, or avoid the subject until the last possible moment.

Price is the clearest thing a brand ever says about itself. It is a claim about worth, made in public, that the whole experience then has to honour. A company that is nervous about its price is really telling you it is not sure the claim is true — and customers feel that hesitation long before they see a number.

The work of brand is, in large part, the work of earning the right to a price and then having the nerve to name it. When the position is sharp and the experience is whole, the number stops feeling like a risk and starts feeling like a fact. Nothing signals confidence like a company that will simply tell you what it costs.

If you cannot say the price out loud, the problem is rarely the price.`,
    date: '3 December 2025',
    category: 'Essay',
    readTime: '5 min',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=800&fit=crop&auto=format',
    slug: 'say-the-price-out-loud',
  },
]

export const clients = [
  'Lavanta', 'Studio Marché', 'Edde', 'Hinterland',
  'Vela Collective', 'Roux Atelier', 'Sonder Press',
  'Maison Têtu', 'Folio & Co', 'Kōan Health',
  'The North Table', 'Stratum', 'Archive Forty',
  'Palomar Films', 'Glassworks', 'Lund & Meyer',
]

export const partners = [
  'Monotype', 'Contra Studio', 'The Type Foundry',
  'Riso & Ink', 'Field Notes Press', 'Aesop Trade',
  'It’s Nice That', 'Are.na', 'Semi-Permanent',
  'Design Week', 'Frame Store', 'Counter-Print',
  'Unit Editions', 'The Gourmand',
]

export const testimonials = [
  {
    quote: 'They found the sentence our whole company had been failing to say for six years. Everything after that was easier — the pricing, the hiring, the pitch.',
    name: 'Amara Devlin',
    role: 'Founder',
    company: 'Lavanta',
  },
  {
    quote: 'Most people arrive with a deck. They arrived with a question, and it turned out to be the only one that mattered. We are still using the answer.',
    name: 'Henri Vasseur',
    role: 'Managing Director',
    company: 'Studio Marché',
  },
  {
    quote: 'We had confused looking expensive with being wanted. They took the whole thing apart, kept the two things that were true, and built the rest around them.',
    name: 'Ingrid Solberg',
    role: 'Chief Executive',
    company: 'Edde',
  },
  {
    quote: 'The work was sharp, but the thing I did not expect was how commercial it was. Every decision came back to a number we could actually move.',
    name: 'Marcus Bianchi',
    role: 'Group Marketing Director',
    company: 'Hinterland',
  },
]

/* ── Capabilities ──────────────────────────────────────────────────────────
   Organised into five groups: Brand & Identity, Digital & Product, Growth &
   Demand, Market & Expansion, Experiences. Every capability is a CMS-ready
   record with SEO fields and its own landing page at /capabilities/:slug —
   so nothing the studio does is hidden from a search engine or an AI
   answer, and every page can be crawled, cited and linked to on its own. */

export type Category = 'Brand & Identity' | 'Digital & Product' | 'Growth & Demand' | 'Market & Expansion' | 'Experiences'

export interface Capability {
  slug: string
  name: string
  category: Category
  /* one-line summary, used on cards and as meta description seed */
  summary: string
  /* editorial lede for the landing page */
  lede: string
  /* what the engagement actually includes */
  includes: string[]
  /* the commercial question this answers */
  question: string
  /* a plain-language outcome — good for AI search answers */
  outcome: string
  /* natural-language search phrases this page should answer */
  queries: string[]
}

export const categories: { key: Category; label: string; blurb: string; accent: string }[] = [
  { key: 'Brand & Identity', label: 'Brand & Identity', blurb: 'What the company is, and how it looks, sounds and behaves.', accent: '#6E2237' },
  { key: 'Digital & Product', label: 'Digital & Product', blurb: 'Where people meet it, and decide.', accent: '#6A6383' },
  { key: 'Growth & Demand', label: 'Growth & Demand', blurb: 'How it gets wanted, at scale.', accent: '#7F8B3E' },
  { key: 'Market & Expansion', label: 'Market & Expansion', blurb: 'Where it goes next, and who it needs to convince to get there.', accent: '#C08A1E' },
  { key: 'Experiences', label: 'Experiences', blurb: 'Where the brand happens in a room, not a browser.', accent: '#221E1B' },
]

export const capabilities: Capability[] = [
  // ── Brand & Identity ──────────────────────────────────────────────────
  {
    slug: 'brand-strategy',
    name: 'Brand Strategy',
    category: 'Brand & Identity',
    summary: 'The commercial logic underneath the brand — what you sell, to whom, and why it wins.',
    lede: 'Brand strategy is not a mood. It is the argument for why a company deserves to exist, priced correctly, in a market that already has enough. We build that argument first, because every downstream decision — identity, product, pricing, media — is cheaper and sharper once it exists.',
    includes: ['Audience and demand mapping', 'Proposition and value articulation', 'Brand architecture', 'Competitive and category analysis'],
    question: 'Why should anyone choose us, and pay what we are worth?',
    outcome: 'A written, agreed strategy that makes the next hundred decisions faster.',
    queries: ['what is brand strategy', 'brand strategy agency Amsterdam', 'how to position a brand', 'brand strategy vs marketing strategy'],
  },
  {
    slug: 'brand-positioning',
    name: 'Brand Positioning',
    category: 'Brand & Identity',
    summary: 'The single space you own in a buyer’s mind — defended with evidence, not adjectives.',
    lede: 'Most companies are positioned by accident: by whoever spoke loudest in the last workshop. We find the position that is both true and unoccupied, then make it defensible — so the market files you under a category of one.',
    includes: ['Category and frame-of-reference definition', 'Point-of-difference and proof', 'Positioning statement and messaging house', 'Migration plan from where you are today'],
    question: 'What do we want to be the obvious choice for?',
    outcome: 'A position competitors cannot copy without becoming you.',
    queries: ['brand positioning', 'how to reposition a company', 'positioning statement examples', 'category of one strategy'],
  },
  {
    slug: 'naming',
    name: 'Naming',
    category: 'Brand & Identity',
    summary: 'Names for companies, products and ranges — decided, not voted on.',
    lede: 'A name is a bet on a set of values that do not yet exist in the market. We do not hand over a list of four hundred and ask you to choose. We make a decision, defend it linguistically and legally, and give you the story that makes it stick.',
    includes: ['Naming strategy and territories', 'Creation and shortlisting', 'Linguistic and trademark screening', 'Rationale and rollout language'],
    question: 'What should this be called, and can we own it?',
    outcome: 'A name you can register, defend and grow into.',
    queries: ['brand naming agency', 'how to name a company', 'product naming process', 'is my brand name available'],
  },
  {
    slug: 'brand-architecture',
    name: 'Brand Architecture',
    category: 'Brand & Identity',
    summary: 'How a company organises its brands, sub-brands and products so growth adds clarity instead of confusion.',
    lede: 'Every company eventually has more than one thing to name — a new range, a new market, a new venue. Brand architecture is the decision system that determines what gets its own name, what borrows the parent’s, and how the whole family stays legible as it grows.',
    includes: ['Portfolio and structure audit', 'Master-brand vs sub-brand decisions', 'Naming and nomenclature rules', 'Roll-out governance'],
    question: 'When we launch the next thing, does it strengthen us or dilute us?',
    outcome: 'A structure that scales without a rename every eighteen months.',
    queries: ['brand architecture strategy', 'sub brand vs master brand', 'brand portfolio strategy', 'how to name a product line'],
  },
  {
    slug: 'brand-identity',
    name: 'Visual Identity',
    category: 'Brand & Identity',
    summary: 'A complete visual system — logo, type, colour, layout — that survives without the logo.',
    lede: 'Recognition does not come from a logo. It comes from a set of codes so consistent that the brand is legible even when the name is missing. We build that system and the guidelines that keep it alive.',
    includes: ['Logo, symbol and lockups', 'Type, colour and layout systems', 'Art direction and iconography', 'Brand guidelines and asset libraries'],
    question: 'What makes us unmistakable at a glance?',
    outcome: 'A system your team can run without us in the room.',
    queries: ['visual identity design', 'brand identity system', 'logo and brand guidelines', 'rebrand agency'],
  },
  {
    slug: 'verbal-identity',
    name: 'Verbal Identity',
    category: 'Brand & Identity',
    summary: 'The words that only your company would use — tone, vocabulary and the rules that keep them consistent.',
    lede: 'A visual system tells you what a brand looks like. A verbal identity tells you what it sounds like — the vocabulary it reaches for, the jokes it does and does not make, the sentence length that feels like it. We write the rules, then write the first hundred examples so the team can hear the difference.',
    includes: ['Tone of voice principles', 'Vocabulary and lexicon', 'Messaging house and headline library', 'Copy guidelines and training'],
    question: 'Would someone recognise our writing with the logo removed?',
    outcome: 'A voice specific enough to be worth protecting.',
    queries: ['brand tone of voice', 'verbal identity guidelines', 'brand messaging framework', 'how to write brand voice guidelines'],
  },
  {
    slug: 'creative-direction',
    name: 'Creative Direction',
    category: 'Brand & Identity',
    summary: 'The taste and judgement that hold a brand together across everything it makes.',
    lede: 'Creative direction is editing at the level of the whole company: photography, tone, campaigns and the thousand small calls that decide whether a brand feels considered or assembled. We hold the line so the work stays coherent as it scales.',
    includes: ['Art and photography direction', 'Campaign concepting', 'Tone and creative governance', 'Production oversight'],
    question: 'Does everything we make feel like us?',
    outcome: 'Work that is unmistakably one company, at any volume.',
    queries: ['creative direction agency', 'art direction for brands', 'campaign creative direction', 'photography direction'],
  },
  {
    slug: 'packaging',
    name: 'Packaging',
    category: 'Brand & Identity',
    summary: 'Structural and graphic packaging design that earns the price on the shelf, not just on the screen.',
    lede: 'Packaging is the one piece of brand work a customer actually holds. We design structure and graphics together, so the object argues for the price before anyone reads a word — and works just as hard photographed for a feed as it does on a shelf.',
    includes: ['Structural and dieline design', 'Materials and print production', 'Range and variant systems', 'Sustainability and cost engineering'],
    question: 'Does holding this make the price feel correct?',
    outcome: 'Packaging that reads as considered, not decorated.',
    queries: ['packaging design agency', 'product packaging design', 'sustainable packaging design', 'FMCG packaging design'],
  },

  // ── Digital & Product ────────────────────────────────────────────────
  {
    slug: 'web-design-development',
    name: 'Website Design & Development',
    category: 'Digital & Product',
    summary: 'Websites that load fast, read clearly to search and AI crawlers, and move people towards a decision.',
    lede: 'A website is where most people decide whether to trust you. We design and build sites that load fast, read well to search engines and AI crawlers, and move visitors towards a decision — without ever looking like a template.',
    includes: ['Design and art direction', 'Front-end build and CMS', 'Core Web Vitals and performance', 'Schema, semantics and accessibility'],
    question: 'Does our website earn trust and enquiries?',
    outcome: 'A site that ranks, converts and is easy to keep alive.',
    queries: ['website design agency', 'high converting website design', 'SEO friendly web design', 'CMS website build'],
  },
  {
    slug: 'ux-ui-design',
    name: 'UX/UI Design',
    category: 'Digital & Product',
    summary: 'Interfaces people understand instantly and enjoy using.',
    lede: 'Good UX is invisible; bad UX is a leak in the funnel. We design flows, screens and systems that reduce friction, respect attention and hold up under real use — measured, not asserted.',
    includes: ['User research and flows', 'Interface and interaction design', 'Design systems and components', 'Usability testing'],
    question: 'Can people do what they came to do, easily?',
    outcome: 'Fewer drop-offs, more completed actions.',
    queries: ['UX UI design agency', 'product design services', 'usability testing', 'design system build'],
  },
  {
    slug: 'digital-product-design',
    name: 'Digital Product Design',
    category: 'Digital & Product',
    summary: 'Apps, platforms and tools designed and engineered end to end.',
    lede: 'Some brands need more than a website — they need a product. We take digital products from concept to shipped, joining design and engineering so the thing you launch is the thing you argued for.',
    includes: ['Product strategy and scoping', 'Design and prototyping', 'Full-stack engineering', 'Iteration and roadmap'],
    question: 'What should we build, and can you build it?',
    outcome: 'A product in market, not a prototype in a drawer.',
    queries: ['digital product design agency', 'app design and development', 'MVP build', 'product engineering studio'],
  },
  {
    slug: 'ecommerce',
    name: 'E-commerce',
    category: 'Digital & Product',
    summary: 'Storefronts and checkout experiences built to convert, not just to display a catalogue.',
    lede: 'An e-commerce site is a sales floor with the lighting, the queue and the assistant all designed at once. We build storefronts, product pages and checkout flows tuned for conversion and repeat purchase, on the platform that actually suits the business.',
    includes: ['Platform selection and build', 'Product and category page design', 'Checkout and conversion optimisation', 'Merchandising and CRO testing'],
    question: 'Is the path from interest to purchase as short as it should be?',
    outcome: 'A storefront that turns browsing into buying.',
    queries: ['ecommerce website design', 'Shopify agency', 'conversion rate optimisation ecommerce', 'ecommerce UX design'],
  },

  // ── Growth & Demand ──────────────────────────────────────────────────
  {
    slug: 'growth-strategy',
    name: 'Growth Strategy',
    category: 'Growth & Demand',
    summary: 'The plan that connects brand, product and demand into one commercial engine.',
    lede: 'Growth is not a department. It is what happens when the brand, the product and the demand generation agree on the same story and the same numbers. We build the plan that holds all three together, with the channels, sequencing and targets to prove it is working.',
    includes: ['Growth model and channel mix', 'Funnel and conversion mapping', 'Prioritisation and testing roadmap', 'Reporting and commercial targets'],
    question: 'What is actually going to move revenue, in what order?',
    outcome: 'One growth plan the whole company can work from.',
    queries: ['growth strategy agency', 'growth marketing strategy', 'how to build a growth plan', 'brand and demand alignment'],
  },
  {
    slug: 'performance-marketing',
    name: 'Performance Marketing',
    category: 'Growth & Demand',
    summary: 'Paid acquisition that respects the brand and the P&L in equal measure.',
    lede: 'Performance without brand burns cash; brand without performance starves. We run paid media as one system with your brand — creative that could only be you, targeting that is not lazy, and reporting you can actually act on.',
    includes: ['Paid search, social and display', 'Creative testing frameworks', 'Measurement and attribution', 'Budget and bid strategy'],
    question: 'Is every pound of media working as hard as it could?',
    outcome: 'Acquisition economics that improve as you scale.',
    queries: ['performance marketing agency', 'paid media management', 'PPC agency', 'growth marketing'],
  },
  {
    slug: 'seo',
    name: 'SEO',
    category: 'Growth & Demand',
    summary: 'Technical, content and entity SEO built for Google and AI answer engines.',
    lede: 'Search in 2026 is two games at once: ranking in Google and being the source an AI answer quotes. We do both — technical foundations, semantic content and entity authority — so you show up where the decision is actually being made.',
    includes: ['Technical SEO and Core Web Vitals', 'Entity and topical authority', 'On-page and content optimisation', 'AI-search and answer-engine optimisation'],
    question: 'Do we show up when it matters, in search and in AI answers?',
    outcome: 'Qualified traffic that arrives ready to enquire.',
    queries: ['SEO agency 2026', 'AI search optimisation', 'answer engine optimisation', 'entity SEO', 'how to rank in ChatGPT and Perplexity'],
  },
  {
    slug: 'content-strategy',
    name: 'Content Strategy & Content Management',
    category: 'Growth & Demand',
    summary: 'What to say, where and why — plus the operating system that keeps it published on time.',
    lede: 'Content is how a brand earns attention between purchases. We define the themes you can credibly own, the formats that suit each channel, the semantic structure that gets you cited by search and AI, and the calendar and workflow that make it sustainable rather than sporadic.',
    includes: ['Editorial strategy and pillars', 'Topic and entity mapping for SEO', 'Content operations and calendar', 'Measurement and iteration'],
    question: 'What should we publish, and can we actually keep it up?',
    outcome: 'A content engine that compounds instead of resets.',
    queries: ['content strategy agency', 'SEO content strategy', 'editorial strategy for brands', 'content management for AI search'],
  },
  {
    slug: 'social-media',
    name: 'Social Media Strategy & Management',
    category: 'Growth & Demand',
    summary: 'A social presence with a point of view, run with the discipline of a publication.',
    lede: 'Most brand social is a content calendar wearing a strategy costume. We start with what the brand actually has to say, choose the platforms worth the effort, and run the account like an editor would — consistent voice, considered pace, real engagement.',
    includes: ['Platform and format strategy', 'Content planning and production', 'Community management', 'Analytics and iteration'],
    question: 'Does our social output sound like anyone in particular?',
    outcome: 'A following that behaves like an audience, not a number.',
    queries: ['social media strategy agency', 'social media management agency', 'brand social media strategy', 'organic social growth'],
  },
  {
    slug: 'influencer-marketing',
    name: 'Influencer / Creator Marketing',
    category: 'Growth & Demand',
    summary: 'Creator partnerships chosen for fit and trust, not follower counts.',
    lede: 'The best creator partnerships feel like a recommendation, not an advert. We find the voices your audience already trusts, brief them properly, and build relationships that pay back beyond a single post.',
    includes: ['Creator strategy and sourcing', 'Briefing and relationship management', 'Content rights and usage', 'Performance and measurement'],
    question: 'Who does our audience believe, and how do we work with them well?',
    outcome: 'Partnerships that read as trust, not spend.',
    queries: ['influencer marketing agency', 'creator partnerships', 'UGC strategy', 'how to run influencer campaigns'],
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing',
    category: 'Growth & Demand',
    summary: 'Lifecycle and CRM programmes that turn a list into revenue.',
    lede: 'Email is the one channel you own. We design lifecycle programmes — welcome, nurture, retention, win-back — that sound like your brand and move numbers you can see in the dashboard by Friday.',
    includes: ['Lifecycle and automation design', 'Segmentation and CRM strategy', 'Copy, design and templates', 'Testing and deliverability'],
    question: 'Is our owned audience actually earning?',
    outcome: 'Revenue from people who already know you.',
    queries: ['email marketing agency', 'CRM lifecycle marketing', 'klaviyo agency', 'retention marketing'],
  },
  {
    slug: 'campaign-strategy',
    name: 'Campaign Strategy',
    category: 'Growth & Demand',
    summary: 'The big idea and the media plan that gets it in front of the right people, on time.',
    lede: 'A campaign is not a creative treatment looking for a channel plan. It is one idea, expressed correctly for each place it appears, with a media plan built around when and how your audience actually pays attention. We design both halves together.',
    includes: ['Campaign idea and concept', 'Channel and media planning', 'Cross-format asset development', 'Flighting and measurement'],
    question: 'What is the one idea, and where does it need to show up?',
    outcome: 'A campaign that feels planned, not scattered.',
    queries: ['campaign strategy agency', 'integrated campaign planning', 'creative campaign development', 'media planning for brand campaigns'],
  },

  // ── Market & Expansion ───────────────────────────────────────────────
  {
    slug: 'market-research',
    name: 'Market Research',
    category: 'Market & Expansion',
    summary: 'Evidence about buyers, categories and pricing — before the expensive decisions.',
    lede: 'We research to decide, not to reassure. Qualitative depth where nuance matters, quantitative scale where confidence does, and a synthesis that actually changes what you build next.',
    includes: ['Qualitative interviews and ethnography', 'Quantitative surveys and segmentation', 'Pricing and willingness-to-pay studies', 'Category and trend analysis'],
    question: 'What do our buyers actually believe, and pay for?',
    outcome: 'Decisions grounded in evidence instead of the loudest opinion.',
    queries: ['brand market research', 'customer segmentation study', 'pricing research', 'willingness to pay analysis'],
  },
  {
    slug: 'go-to-market-strategy',
    name: 'Go-to-Market Strategy',
    category: 'Market & Expansion',
    summary: 'The sequenced plan for launching or scaling — channels, message, motion and economics.',
    lede: 'A great product with a vague go-to-market is a slow, expensive failure. We plan the launch as a commercial system: who hears first, what they hear, where the money goes, and how you know it is working within weeks rather than quarters.',
    includes: ['Launch sequencing and phasing', 'Channel and message planning', 'Sales and marketing alignment', 'Metrics, targets and readiness'],
    question: 'How do we launch this so it lands and pays back?',
    outcome: 'A launch plan with owners, dates and numbers attached.',
    queries: ['go to market strategy', 'product launch plan', 'GTM strategy for startups', 'how to launch a brand'],
  },
  {
    slug: 'b2b-partnerships',
    name: 'B2B Partnerships & Potential Client Meetings',
    category: 'Market & Expansion',
    summary: 'Distribution through other companies — targeting, outreach and the meetings themselves.',
    lede: 'Sometimes the fastest route to demand is someone else’s audience. We design and broker partnerships — co-marketing, channel, bundling — and, where useful, get in the room ourselves: identifying, approaching and meeting the businesses worth partnering with.',
    includes: ['Partnership strategy and targeting', 'Outreach and deal shaping', 'Co-marketing programmes', 'Meeting preparation and facilitation'],
    question: 'Whose audience should we borrow, and on what terms?',
    outcome: 'A distribution channel that is not more ad spend.',
    queries: ['B2B partnership strategy', 'co-marketing agency', 'channel partnerships', 'strategic alliances'],
  },
  {
    slug: 'market-entry',
    name: 'Market Entry',
    category: 'Market & Expansion',
    summary: 'The research, positioning and plan for taking a brand into a new country or category.',
    lede: 'A brand that works in one market does not automatically work in the next one. We assess demand, competition, regulation and cultural fit before recommending how — or whether — to enter, then build the localised positioning and plan to do it properly.',
    includes: ['Market viability assessment', 'Competitive and regulatory landscape', 'Localised positioning and messaging', 'Entry sequencing and partners'],
    question: 'Should we enter this market, and if so, how?',
    outcome: 'A market-entry plan grounded in evidence, not enthusiasm.',
    queries: ['international market entry strategy', 'market expansion strategy', 'how to launch a brand in a new country', 'market entry consultancy'],
  },
  {
    slug: 'investor-readiness',
    name: 'Investor Readiness & Investor Meetings',
    category: 'Market & Expansion',
    summary: 'The narrative, deck and evidence that make a company fundable — and the meetings themselves.',
    lede: 'Investors buy a story about the future, backed by proof from the present. We shape the equity story, sharpen the deck and pressure-test the numbers so the room leans in for the right reasons — and where it helps, we join the meetings themselves.',
    includes: ['Equity story and narrative', 'Pitch deck design and copy', 'Data-room narrative support', 'Rehearsal, Q&A prep and investor meetings'],
    question: 'Why is this the company to back, now?',
    outcome: 'A raise narrative that survives due diligence.',
    queries: ['investor pitch deck agency', 'how to make a fundable pitch', 'equity story', 'seed round narrative'],
  },
  {
    slug: 'growth-process-consultancy',
    name: 'Growth Process Consultancy',
    category: 'Market & Expansion',
    summary: 'How the team actually plans, ships and measures growth work — not just what it should do next.',
    lede: 'Sometimes the plan is right and the process around it is broken: nobody owns the roadmap, testing has no rhythm, and every quarter starts from a blank page. We audit how growth actually gets decided and shipped inside your company, then install a process your team keeps using after we leave.',
    includes: ['Growth operating rhythm audit', 'Roadmap, ownership and reporting structure', 'Testing and prioritisation frameworks', 'Team training and handover'],
    question: 'Is the bottleneck the strategy, or how we work?',
    outcome: 'A growth process the team runs without us.',
    queries: ['growth process consulting', 'marketing operations consultancy', 'growth team operating model', 'how to build a growth roadmap'],
  },

  // ── Experiences ──────────────────────────────────────────────────────
  {
    slug: 'events',
    name: 'Events',
    category: 'Experiences',
    summary: 'Gatherings designed to build the brand in the room, not just fill a calendar.',
    lede: 'Some brand-building only happens in person. We concept, design and produce events worth attending — launches, dinners, studio evenings — treating the room itself as a piece of creative work with a beginning, middle and end.',
    includes: ['Event concept and identity', 'Guest experience design', 'Production and on-the-day delivery', 'Follow-up and measurement'],
    question: 'What is worth gathering people for, and will they remember it?',
    outcome: 'A room that remembers you.',
    queries: ['brand events agency', 'experiential marketing agency', 'launch event production', 'corporate event design'],
  },
  {
    slug: 'exhibitions',
    name: 'Exhibitions',
    category: 'Experiences',
    summary: 'Physical and pop-up spaces that let people encounter the brand as an object, not a screen.',
    lede: 'An exhibition asks more of a brand than a stand ever does — it has to survive being walked around. We design exhibitions, installations and pop-ups that hold up in three dimensions, from spatial concept through to fabrication and install.',
    includes: ['Spatial and exhibition concept', 'Graphic and environmental design', 'Fabrication and production management', 'Install and de-rig'],
    question: 'Does the brand still feel like itself in a physical space?',
    outcome: 'A space people photograph without being asked to.',
    queries: ['exhibition design agency', 'pop-up store design', 'brand installation design', 'trade show stand design'],
  },
  {
    slug: 'workshops',
    name: 'Workshops',
    category: 'Experiences',
    summary: 'Practical, small-group sessions that leave a team able to do more of the work themselves.',
    lede: 'We run working sessions, not lectures — on positioning, naming, creative direction and the brief itself — built around your actual project, not a generic deck. Teams leave with a decision made, not just a framework explained.',
    includes: ['Workshop design and facilitation', 'Pre-work and materials', 'Live decision-making sessions', 'Written outputs and next steps'],
    question: 'What could this team decide for itself, with the right structure in the room?',
    outcome: 'A decision made, not just a framework explained.',
    queries: ['brand strategy workshop', 'creative direction workshop', 'positioning workshop facilitation', 'in-house brand training'],
  },
  {
    slug: 'trainings',
    name: 'Trainings',
    category: 'Experiences',
    summary: 'Longer-form, in-person training in brand strategy and creative direction — opening 2027.',
    lede: 'Everything we have learned about brand strategy and creative direction, taught directly, over two days, to a small group. Not a webinar series. Not a certificate. The same thinking we charge clients for, taught in person.',
    includes: ['Two-day in-person format', 'Maximum twelve participants', 'Brand Strategy and Creative Direction tracks', 'Amsterdam, plus one further city per year'],
    question: 'Can the thinking behind the work be taught, not just delivered?',
    outcome: 'A room of people who can now do more of this themselves.',
    queries: ['brand strategy training course', 'creative direction training', 'in person branding workshop 2027', 'Not by Accident trainings'],
  },
]

/* ── Company, contact and social ──────────────────────────────────────────
   Registration, phone and studio address are placeholders — they must never
   be invented. Populate them before launch; until then the site renders the
   placeholder copy plainly rather than fabricated specifics. */
export const company = {
  name: 'Not by Accident',
  legalName: 'Not by Accident',
  tagline: 'Wanted, on purpose.',
  proposition: 'We make companies wanted. Growth is what happens next.',
  email: 'hello@notbyaccident.com',
  pressEmail: 'press@notbyaccident.com',
  newBusinessEmail: 'new@notbyaccident.com',
  phone: '',
  phonePlaceholder: 'Phone number — to be added',
  registrationNote: 'Company registration number and registered office — to be added',
  address: {
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    country: '',
  },
  addressPlaceholder: 'Studio address — to be added',
  hours: 'Monday–Thursday, 10:00–17:00 CET',
}

export const socials = [
  { label: 'LinkedIn', handle: 'Not by Accident', url: 'https://linkedin.com/company/notbyaccident' },
  { label: 'Instagram', handle: '@notbyaccident', url: 'https://instagram.com/notbyaccident' },
  { label: 'TikTok', handle: '@notbyaccident', url: 'https://tiktok.com/@notbyaccident' },
  { label: 'Substack', handle: 'notbyaccident', url: 'https://notbyaccident.substack.com' },
  { label: 'Are.na', handle: 'not-by-accident', url: 'https://are.na/not-by-accident' },
  { label: 'Dribbble', handle: 'notbyaccident', url: 'https://dribbble.com/notbyaccident' },
]

/* Client and partner logos rendered as monochrome typographic wordmarks.
   `style` picks a treatment so the wall reads like distinct marks. These are
   placeholders until real client/partner logo files are supplied. */
export const clientLogos: { name: string; style: 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black' }[] = [
  { name: 'Lavanta', style: 'serif' },
  { name: 'STUDIO MARCHÉ', style: 'sans-wide' },
  { name: 'edde', style: 'sans-tight' },
  { name: 'Hinterland', style: 'italic' },
  { name: 'VELA', style: 'black' },
  { name: 'Roux', style: 'serif' },
  { name: 'SONDER', style: 'mono' },
  { name: 'Maison Têtu', style: 'italic' },
  { name: 'Folio&Co', style: 'sans-tight' },
  { name: 'KŌAN', style: 'sans-wide' },
  { name: 'The North Table', style: 'serif' },
  { name: 'STRATUM', style: 'black' },
]

export const partnerLogos: { name: string; style: 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black' }[] = [
  { name: 'Monotype', style: 'sans-tight' },
  { name: 'CONTRA', style: 'black' },
  { name: 'It’s Nice That', style: 'serif' },
  { name: 'Are.na', style: 'mono' },
  { name: 'Semi-Permanent', style: 'sans-wide' },
  { name: 'Counter-Print', style: 'italic' },
  { name: 'Unit Editions', style: 'serif' },
  { name: 'Framestore', style: 'sans-tight' },
  { name: 'Riso&Ink', style: 'mono' },
  { name: 'The Gourmand', style: 'italic' },
]

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  img: string
}

export const team: TeamMember[] = [
  {
    id: '1',
    name: 'Sara Okafor',
    role: 'Founding Partner, Strategy',
    bio: 'Sara spent a decade in strategy consulting before concluding that brand and commercial thinking should be one discipline, not two. She built Not by Accident on that premise.',
    img: 'https://images.unsplash.com/photo-1675773051474-55c4b7d2cf53?w=600&h=750&fit=crop&auto=format',
  },
  {
    id: '2',
    name: 'Tomás Reyes',
    role: 'Founding Partner, Creative',
    bio: 'Tomás ran creative for two decade-long stints at independent agencies in Amsterdam and São Paulo before deciding the work was better when the creative director also sat in on the strategy.',
    img: 'https://images.unsplash.com/photo-1523908511403-7fc7b25592f4?w=600&h=750&fit=crop&auto=format',
  },
]
