# Not by Accident — website

React 19 + React Router 7 + Vite 8, prerendered to static HTML (`scripts/prerender.mjs`), deployed on Vercel. Content comes from Supabase (project `nfpvygufottgzdbthgwt`) and is edited at `/admin`. Start with `README.md`; the CMS guide is `docs/CMS.md`.

- Package manager: pnpm. `pnpm build` = carbon factor → CMS snapshot → client build → server build → prerender. `pnpm preview` serves `dist/client` on :4173.
- Checks before shipping: `pnpm typecheck`, `node scripts/seo-audit.mjs`, `node scripts/a11y.mjs` and `node scripts/qa.mjs` (the last two need `pnpm preview` running).
- Page copy lives in `page_sections` under pages with the `next/` slug prefix (migration `0010_next_site.sql`); the defaults in `src/content/sections.*.ts` are only the fallback. Never edit the non-`next/` page rows: they belong to the previous site's history.
- Migrations in `supabase/migrations/` are additive and idempotent; never overwrite editor content in a migration.
- Don't invent facts, clients, metrics or testimonials in copy.
- Strings with apostrophes use double quotes or typographic ’.
- The Lab (`/lab`, `src/lab`, `src/admin/lab`, migrations 0011–0014) is documented in `docs/lab/README.md`. All scoring, matching and permission logic lives in the database (RPCs + RLS); the frontend only calls it. Never put fabricated partners or market facts in migrations; `supabase/seed/lab_fixtures.sql` is staging-only. Lab checks: `scripts/lab-tests.mjs`, `lab-e2e.mjs`, `lab-admin-e2e.mjs`, `lab-a11y.mjs` (local Supabase only).
