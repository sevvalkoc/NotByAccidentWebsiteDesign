# Not by Accident — website

React 19 + React Router 7 + Vite 8, prerendered to static HTML (`scripts/prerender.mjs`), deployed on Vercel. Content comes from Supabase (project `nfpvygufottgzdbthgwt`) and is edited at `/admin`. Start with `README.md`; the CMS guide is `docs/CMS.md`.

- Package manager: pnpm. `pnpm build` = carbon factor → CMS snapshot → client build → server build → prerender. `pnpm preview` serves `dist/client` on :4173.
- Checks before shipping: `pnpm typecheck`, `node scripts/seo-audit.mjs`, `node scripts/a11y.mjs` and `node scripts/qa.mjs` (the last two need `pnpm preview` running).
- Page copy lives in `page_sections` under pages with the `next/` slug prefix (migration `0010_next_site.sql`); the defaults in `src/content/sections.*.ts` are only the fallback. Never edit the non-`next/` page rows: they belong to the previous site's history.
- Migrations in `supabase/migrations/` are additive and idempotent; never overwrite editor content in a migration.
- Don't invent facts, clients, metrics or testimonials in copy.
- Strings with apostrophes use double quotes or typographic ’.
