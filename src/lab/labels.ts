/* Labels for the Lab's enumerations. The keys mirror the CHECK constraints
   in migration 0011; change both together. */
type Opt = readonly (readonly [string, string])[]

export const INDUSTRIES: Opt = [
  ['fashion', 'Fashion & apparel'],
  ['jewellery', 'Jewellery & accessories'],
  ['beauty', 'Beauty & personal care'],
  ['home', 'Home & interiors'],
  ['food_drink', 'Food & drink'],
  ['wellness', 'Wellness'],
  ['design_objects', 'Design objects'],
  ['technology', 'Technology'],
  ['services', 'Services'],
  ['other', 'Other'],
]
export const OFFERINGS: Opt = [
  ['physical', 'Physical products'],
  ['digital', 'Digital products'],
  ['service', 'A service'],
  ['mixed', 'A mix'],
]
export const SEGMENTS: Opt = [
  ['young_adults', 'Young adults'],
  ['professionals', 'Professionals'],
  ['families', 'Families'],
  ['enthusiasts', 'Enthusiasts & collectors'],
  ['gift_buyers', 'Gift buyers'],
  ['businesses', 'Businesses'],
  ['broad', 'A broad audience'],
]
export const PRICE_TIERS: Opt = [
  ['value', 'Value'],
  ['mid', 'Mid-market'],
  ['premium', 'Premium'],
  ['luxury', 'Luxury'],
]
export const CHANNELS: Opt = [
  ['own_ecommerce', 'Own web shop'],
  ['marketplaces', 'Marketplaces'],
  ['own_retail', 'Own stores'],
  ['wholesale', 'Wholesale'],
  ['distributors', 'Distributors'],
  ['popups', 'Pop-ups & markets'],
  ['b2b_direct', 'Direct B2B sales'],
  ['subscriptions', 'Subscriptions'],
]
export const STAGES: Opt = [
  ['pre_launch', 'Not selling yet'],
  ['early', 'Early sales'],
  ['growing', 'Growing'],
  ['established', 'Established'],
]
export const CAPACITY: Opt = [
  ['limited', 'Limited: small batches'],
  ['moderate', 'Moderate: could double'],
  ['scalable', 'Scalable'],
]
export const TIMELINES: Opt = [
  ['0_3', 'Within 3 months'],
  ['3_6', '3–6 months'],
  ['6_12', '6–12 months'],
  ['12_plus', 'More than a year'],
]
export const OBJECTIVES: Opt = [
  ['test_demand', 'Test demand'],
  ['first_retailers', 'Find first retailers'],
  ['distribution', 'Find a distributor'],
  ['direct_to_consumer', 'Sell direct to consumers'],
  ['partnerships', 'Build partnerships'],
  ['awareness', 'Build awareness'],
]
export const DISTRIBUTION: Opt = [
  ['retail', 'Retail partners'],
  ['wholesale', 'Wholesale'],
  ['distributor', 'A distributor'],
  ['dtc', 'Direct to consumer'],
  ['marketplace', 'Marketplaces'],
  ['hybrid', 'A mix'],
  ['undecided', 'Not decided yet'],
]
export const BUDGETS: Opt = [
  ['under_10k', 'Under €10k'],
  ['10_25k', '€10–25k'],
  ['25_75k', '€25–75k'],
  ['75_150k', '€75–150k'],
  ['150k_plus', 'Over €150k'],
  ['undecided', 'Not decided yet'],
]
export const OBSTACLES: Opt = [
  ['market_choice', 'Choosing the market'],
  ['pricing', 'Pricing'],
  ['logistics', 'Logistics'],
  ['regulation', 'Regulation'],
  ['partners', 'Finding partners'],
  ['brand_fit', 'Brand fit abroad'],
  ['budget', 'Budget'],
  ['team_capacity', 'Team capacity'],
  ['language', 'Language'],
]
export const LANGUAGES: Opt = [
  ['en', 'English'],
  ['nl', 'Dutch'],
  ['de', 'German'],
  ['fr', 'French'],
  ['it', 'Italian'],
  ['es', 'Spanish'],
  ['da', 'Danish'],
  ['sv', 'Swedish'],
]
/** The markets The Lab covers (lab_markets). Order = default display order. */
export const MARKETS: Opt = [
  ['NL', 'Netherlands'],
  ['DE', 'Germany'],
  ['GB', 'United Kingdom'],
  ['FR', 'France'],
  ['BE', 'Belgium'],
  ['DK', 'Denmark'],
  ['SE', 'Sweden'],
  ['IT', 'Italy'],
  ['ES', 'Spain'],
]
/** Origin / current-market choices: the Lab markets plus common others. */
export const COUNTRIES: Opt = [
  ...MARKETS,
  ['AT', 'Austria'],
  ['CH', 'Switzerland'],
  ['FI', 'Finland'],
  ['IE', 'Ireland'],
  ['LU', 'Luxembourg'],
  ['NO', 'Norway'],
  ['PL', 'Poland'],
  ['PT', 'Portugal'],
  ['TR', 'Türkiye'],
  ['US', 'United States'],
]
export const CATEGORIES: Opt = [
  ['brand', 'Brand foundation'],
  ['pmf', 'Product–market fit'],
  ['commercial', 'Commercial readiness'],
  ['operations', 'Operational readiness'],
  ['partnership', 'Partnership readiness'],
  ['strategy', 'Expansion strategy'],
]
export const VERIFICATION: Opt = [
  ['research_prospect', 'Research prospect'],
  ['verified_organization', 'Verified organisation'],
  ['contacted_prospect', 'Contacted prospect'],
  ['confirmed_partner', 'Confirmed participating partner'],
]
export const VERIFICATION_HELP: Record<string, string> = {
  research_prospect: 'Found in our research. We have not verified its details or contacted it.',
  verified_organization: 'We have checked that this organisation exists and its details are current. It has not agreed to anything.',
  contacted_prospect: 'Our team has been in touch. It has not confirmed that it takes introductions.',
  confirmed_partner: 'Has confirmed it takes introductions through The Lab.',
}
export const INTRO_STATUS: Opt = [
  ['requested', 'Requested'],
  ['under_review', 'Under review'],
  ['more_info_needed', 'More information needed'],
  ['approved', 'Approved'],
  ['declined', 'Declined'],
  ['introduction_sent', 'Introduction sent'],
  ['in_discussion', 'In discussion'],
  ['completed', 'Completed'],
  ['closed', 'Closed'],
]
export const PURPOSES: Opt = [
  ['retail_listing', 'A retail listing'],
  ['distribution', 'Distribution'],
  ['wholesale', 'A wholesale order'],
  ['market_entry_support', 'Help entering the market'],
  ['collaboration', 'A collaboration'],
  ['service', 'A service'],
  ['other', 'Something else'],
]
export const OPP_STATUS: Opt = [
  ['exploring', 'Exploring'],
  ['in_discussion', 'In discussion'],
  ['negotiating', 'Negotiating'],
  ['pilot', 'Pilot'],
  ['won', 'Won'],
  ['lost', 'Lost'],
  ['paused', 'Paused'],
]
export const OPP_KINDS: Opt = [
  ['retail', 'Retail'],
  ['distribution', 'Distribution'],
  ['wholesale', 'Wholesale'],
  ['collaboration', 'Collaboration'],
  ['market_entry', 'Market entry'],
  ['other', 'Other'],
]
export const PARTNER_TYPES: Opt = [
  ['retailer', 'Retailer'],
  ['concept_store', 'Concept store'],
  ['distributor', 'Distributor'],
  ['wholesale_buyer', 'Wholesale buyer'],
  ['market_entry_partner', 'Market-entry partner'],
  ['creative_collaborator', 'Creative collaborator'],
  ['service_provider', 'Service provider'],
]
export const BUSINESS_SIZES: Opt = [
  ['independent', 'Independent'],
  ['small_group', 'Small group'],
  ['mid_size', 'Mid-size'],
  ['large', 'Large'],
]
export const EVIDENCE: Record<string, { label: string; help: string }> = {
  self_reported: { label: 'Your answers', help: 'Based on what you told us in your brand profile and assessment.' },
  verified: { label: 'Verified', help: 'From a market profile our team has checked, with its source and date.' },
  database: { label: 'Our records', help: 'Counted from the partner records in our database.' },
  rule: { label: 'Rule', help: 'A fixed product rule, such as crossing the EU customs border.' },
  missing: { label: 'Missing', help: 'We don’t hold this information yet.' },
}

const maps = new Map<Opt, Map<string, string>>()
/** The label for a key, falling back to the key itself. */
export function label(opts: Opt, key: string | null | undefined): string {
  if (!key) return ''
  let m = maps.get(opts)
  if (!m) maps.set(opts, (m = new Map(opts as [string, string][])))
  return m.get(key) ?? key.replace(/_/g, ' ')
}
export const labels = (opts: Opt, keys: string[] | null | undefined) => (keys ?? []).map(k => label(opts, k))
export const marketName = (code: string) => label(COUNTRIES, code)

export const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
export const fmtScore = (n: number | null | undefined) => (n == null ? '—' : Number.isInteger(n) ? String(n) : n.toFixed(1))
