# 01 — Audit of the current site

Source: `sevvalkoc/NotByAccidentWebsiteDesign` at `e60b151` (read-only; never modified).
Brand source: *Complete Brand Guidelines, Edition 01, August 2026* + *Asset Index*.

## Stack

| Item | Current |
|---|---|
| Framework | Vite 8 + React 19 SPA, React Router 7 (library mode), Tailwind v4 |
| Rendering | Client-only. Crawlers that don't run JS get an empty `<div id="root">`. |
| Head | React 19 hoisting of `<title>/<meta>` from `Seo.tsx` (client-side only) |
| CMS | Supabase (`nfpvygufottgzdbthgwt`). Seed content in `src/data.ts`, live content swapped in when `VITE_SUPABASE_*` env vars are set |
| Admin | `/admin/*`, lazy-loaded, Supabase auth, edits collections + page sections |
| Forms | All write to `contact_submissions` with `source` = `contact` · `footer` · `newsletter` · `newsletter-popup` |
| i18n | English at `/`, Dutch at `/nl/*`, French at `/fr/*` (static translations, hreflang in head + sitemap) |
| Sitemap | Generated at build by a Vite plugin (all static routes, capabilities, cases, notes × 3 locales) |
| robots.txt | `Allow: /`, `Disallow: /admin`, sitemap link |
| Hosting | Vercel (`vercel.json`: SPA rewrite, `index.html` no-cache, hashed assets immutable). Netlify `_redirects` also present |
| Analytics / pixels / tag manager | **None configured** (`site.json` has no GA id; no scripts) |
| Cookie banner | None (the Cookies page describes categories; nothing is set) |

## Routes (all mirrored under `/nl` and `/fr`)

`/` · `/work` · `/case-studies` · `/case-studies/:slug` (5) · `/capabilities` · `/capabilities/:slug` (30) · `/studio` · `/notes` · `/notes/:slug` (12) · `/trainings` · `/reports` · `/contact` · `/search` (noindex) · `/privacy` · `/cookies` · `*` 404 · `/admin/*`

## Navigation

- Header: Work · Notes · Studio · Trainings (Soon) · Reports (Soon) · Contact + language select
- Footer: Work · Case Studies · Capabilities · Studio · The Journal · Events & Workshops; first 6 capabilities; New business / General / Press emails; phone placeholder; hours; 6 socials; address placeholder; Trainings · Privacy · Cookies · Search

## Contact facts

- hello@notbyaccident.com (general) · new@notbyaccident.com (new business) · press@notbyaccident.com
- Hours: Monday–Thursday, 10:00–17:00 CET
- Phone, address, registration number: **placeholders, never filled** (rendered as "to be added")
- Socials: LinkedIn `/company/notbyaccident`, Instagram `@notbyaccident`, TikTok `@notbyaccident`, Substack `notbyaccident.substack.com`, Are.na `not-by-accident`, Dribbble `notbyaccident`

## Positioning (from site + guidelines)

- "We make companies wanted. Growth is what happens next." / "Wanted, on purpose."
- Independent creative company, Amsterdam, est. 2019
- Offer: Position · Identity · Product · Demand
- "Brand thinking and commercial thinking are not separated into different rooms."

## Capabilities (30, five groups) — the real list

Brand & Identity (8): Brand Strategy, Brand Positioning, Naming, Brand Architecture, Visual Identity, Verbal Identity, Creative Direction, Packaging
Digital & Product (4): Website Design & Development, UX/UI Design, Digital Product Design, E-commerce
Growth & Demand (8): Growth Strategy, Performance Marketing, SEO, Content Strategy & Content Management, Social Media Strategy & Management, Influencer / Creator Marketing, Email Marketing, Campaign Strategy
Market & Expansion (6): Market Research, Go-to-Market Strategy, B2B Partnerships & Potential Client Meetings, Market Entry, Investor Readiness & Investor Meetings, Growth Process Consultancy
Experiences (4): Events, Exhibitions, Workshops, Trainings

Each has: summary, lede, includes (4), question, outcome, search queries. These pages carry most of the semantic SEO and are kept nearly verbatim.

## Brand system extracted

- Colour: Milk `#F0EADA` · Print black `#221E1B` · Beetroot `#6E2237` · Pickle `#7F8B3E` · Carbon violet `#6A6383` · Yolk `#E9C558`. (Site also uses `#C08A1E` as a category accent. It isn't in the guidelines, so it's dropped.)
- Proportion: foundation 82% / signature 7% / accent 1%. Colour on 10–25% of a surface, at edges. Approved relationships: House, Quiet, Dark, Energy, Editorial (Special is print only).
- Type: display serif (Lora) + grotesk (DM Sans). Roles D1 `clamp(40px,6vw,104px)`, body 16px, 68ch measure.
- Grid: 12 col, 72px gutter desktop; 4 col / 20px margin < 480px. 8-pt spacing. Content capped at 1440px.
- Motion: 120/240/400/500ms, `cubic-bezier(.22,.8,.24,1)`. Cross-cut not fade. Page transition: push, "screens behave like sheets of paper". Hover: images lift 1.02.
- Seven layout behaviours: Field, Edge, Interval, Shelf, Small against large, Dense page, Cluster. One per surface, never two the same in a row.
- Logo: lockup in header only; never lockup + symbol on the same screen; wordmark is artwork, never typeset.

## Issues found in the current build

1. SPA with no prerender, so the HTML that non-JS crawlers and social bots see is empty.
2. The header sets "Not by Accident" in Lora as if it were the wordmark (the guidelines forbid this) and shows the symbol next to it.
3. The favicon SVG is redrawn wrong: the wedge tip sits at 68% of the width, but in the master it is at 15%.
4. The contact form collects *company* and *budget* and silently discards both. Only name/email/message reach Supabase.
5. Client and partner walls are marked "placeholders" in the code (`src/data.ts` line ~837).
6. The site relies on Unsplash stock throughout, and the guidelines prohibit stock.
7. An 18-second modal newsletter popup interrupts the reader.
8. The copy is long and repetitive. The hero alone carries an eyebrow, title, subhead, two buttons, a definition paragraph and a caption.

## Facts to verify before launch (not invented here, but suspect)

The earlier brief stored in `src/imports/pasted_text/not-by-accident-website-brief.md` asked the previous build to "write all placeholder copy". So these items came from that build, not from the studio:

- **Case studies.** Lavanta (London, 2024, +34% conversion), Studio Marché (Paris, 2025, +22% footfall), Edde (Berlin, 2025, skincare, +41% repeat purchase), Hinterland (Melbourne, 2025, 12 venues), Unnamed (2026). Your other brand notes describe **Edde as woven silver jewellery** and **Lavanta as born between Boston and Istanbul**, which doesn't match the site.
- **Testimonials:** Amara Devlin (Lavanta), Henri Vasseur (Studio Marché), Ingrid Solberg (Edde), Marcus Bianchi (Hinterland).
- **Team:** Sara Okafor and Tomás Reyes, plus their bios. The portrait URLs reuse project stock photos.
- **"Est. 2019"**, plus the TNW / Amsterdam August 2026 photo caption.
- **Trainings:** two-day format, max 12, Amsterdam + one city, 2027.

The new site uses these exactly as the current site states them. Nothing has been added. Testimonials and team appear as text only, so a correction means editing one record. Client/partner logo walls are **not** used, because the code labels them placeholders.
