# Not by Accident — next

A new direction for notbyaccident.com. It's a separate project and repository: the current site (`NotByAccidentWebsiteDesign`) was read for facts, assets and behaviour and never modified.

> Quiet, visual and editable. Order, a designed interruption, order again.

## Run

```bash
pnpm install
pnpm dev          # Vite dev server
pnpm build        # snapshot CMS → client build → server build → prerender
pnpm preview      # serve dist/client like production (clean URLs, real 404s)
pnpm typecheck
node scripts/seo-audit.mjs     # titles, descriptions, H1s, canonicals, JSON-LD, broken links
node scripts/qa.mjs --full     # screenshots + runtime/overflow checks at 375–1728px (needs preview running)
node scripts/a11y.mjs          # axe-core over representative pages (needs preview running)
node scripts/cms-acceptance.mjs  # the 18-step CMS test against a real database (see docs/05-v2.md)
```

Environment: copy `.env.example` → `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, the same as the current site. Without them the site builds from the static seed and forms say they aren't connected.

## Stack, and why

React 19 + React Router 7 on Vite 8, which is the current site's ecosystem, kept on purpose. What changed is **prerendering**: `scripts/prerender.mjs` renders every route and language to static HTML with its full head, then the browser hydrates. That gives excellent SEO without migrating frameworks, and the admin carries over as-is.

No GSAP, Lenis or WebGL. Every motion here is a clip-path, a transform, a registered custom property or a View Transition, driven by CSS and a few small scroll listeners. Nothing in this brief needed a library.

## Structure

```
src/
  App.tsx                  routes (EN /, NL /nl, FR /fr, /admin)
  main.tsx / entry-server  hydrate / prerender
  content/
    copy.{en,nl,fr}.ts     interface microcopy (typed: NL/FR must match EN)
    sections.{en,nl,fr}.ts page copy as CMS-shaped sections; EN seeds the CMS (migration 0010)
    seed/data.*.ts         records from the current site (CMS overlays EN)
    index.ts               store: seed → build snapshot → live refresh
    figures.ts             one figure per case, lifted from its own outcome
  seo/head.ts, schema.ts   head description → static HTML + client updates; JSON-LD
  components/              Header, IndexSheet, Footer, Zone (environment), Slip (signature interaction), PageHead, Rich (*emphasis*, CTAs), Link (sheet push), Logo, Img, StudioClock, EmailCapture
  pages/                   one file per template; home/ holds the seven homepage sections
  styles/                  tokens.css (brand system), base.css, motion.css, page.css
  admin/                   the CMS: Homepage, Pages and Global editors (SiteEditor) plus the carried-over collections
scripts/                   cms-snapshot, prerender, serve, qa, a11y, seo-audit, cms-acceptance, generate-next-seed
docs/                      01 audit · 02 direction · 03 v1 changes · 04 v2 audit · 05 v2 · CMS guide
```

## Design system, in one screen

- **Colour**: void `#0b0c0f`, graphite, frost `#ecedea`, mineral, cool, silver; signal `#8e97ff` (periwinkle, the digital accent), acid `#d3df5e` (used once per view, for a number that matters) and beet `#6e2237` (the inherited warm interrupt). No gradients.
- **Environments**: each section is a `Zone` with `data-zone` (`void`, `frost`, `mineral`, `cool`, `signal`). The zone under the reading line sets `<body data-env>`, and the colours are registered custom properties, so the page changes colour as you read instead of cutting. The prerender sets the opening environment, so the first paint matches.
- **Type**: DM Sans for everything; Lora italic only for an emphasised word (`*word*` in the CMS). Scale `--t-micro … --t-display`; display tops out at about 6.5rem and appears twice on the homepage.
- **Logo**: identity, not content. 104–120px in the header, 96px in the footer. No masks, no logo-as-hero.
- **Motion**: the slip (media built from five bands that briefly fall out of register and settle back, on hover or arrival), environment shifts, sheet page transitions, and quiet arrivals. `prefers-reduced-motion` removes all of it.
