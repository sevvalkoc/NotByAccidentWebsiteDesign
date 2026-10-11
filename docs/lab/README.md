# THE LAB — V1

Market validation and smart matching for independent brands, built into the
Not by Accident site. Discover → Register → Create brand → Validate → Compare
→ Match → Connect → Track.

- Admin guide: [admin-guide.md](admin-guide.md)
- Test report: [test-report.md](test-report.md)

## 1. Product summary

| Stage | What the user does | Where |
| --- | --- | --- |
| Discover | Reads what The Lab is; tries a 6-question indicative readiness preview (scored in the browser, nothing stored) | `/lab`, `/lab/how-it-works`, `/lab/market-readiness`, homepage band |
| Register | Email + password, explicit data-use consent, optional partner-sharing and marketing consent; email verification, login, reset | `/lab/sign-up`, `/lab/login`, `/lab/forgot-password`, `/lab/reset-password` |
| Create brand | 3-step onboarding (identity, commercial, expansion), saves as you go, logo upload; several brands per account | `/lab/brand` |
| Validate | ~20 conditional questions in 6 areas, N/A answers, resume, review; deterministic versioned score, band, explanations, rule-based recommendations, history | `/lab/assessment`, `/lab/results` |
| Compare | Up to 3 markets side by side; every factor labelled *your answers / verified / our records / rule / missing*; score only with enough inputs; ranking only when ≥ 5 points apart | `/lab/markets` |
| Match | Hard filters, then 6 weighted criteria; reasons, limitations, unknowns; filters; shortlist with notes; empty state + research request | `/lab/matches` |
| Connect | Introduction requests reviewed by staff (9 statuses), public messages, replies, withdrawal; internal notes never reach the brand | `/lab/matches?tab=requests`, Admin → The Lab → Introductions |
| Track | Opportunities with status, next action, timeline; auto-created when an introduction is sent | `/lab/opportunities` |
| Report | Snapshot reports (web + PDF), history | `/lab/reports` |

Nothing is predictive: bands describe preparation, compatibility describes how
recorded attributes align, and missing data never counts in a partner's favour.

## 2. Architecture

A modular monolith: no new server. The static, prerendered React site talks to
Supabase (Postgres + Auth + Storage). Everything that decides something runs in
the database.

```
src/lab/
  api.ts              client layer: RPC wrappers, session store, auth, logos, analytics
  labels.ts           enum labels (mirror the CHECK constraints in 0011)
  ui.tsx, lab.css     the Lab's interface pieces, in the site's design system
  public/             SSR'd public pages: Landing, HowItWorks, Readiness, Auth
  app/                signed-in app (own lazy chunk): LabApp shell + 9 screens, pdf.ts
src/admin/lab/        Admin → The Lab (10 tabs)
src/pages/home/LabFeature.tsx   homepage band
supabase/migrations/
  0011_lab_schema.sql   33 lab_* tables, RLS, triggers, storage bucket, sign-up hook
  0012_lab_engine.sql   scoring, market fit, matching, workflow, reports, admin RPCs
  0013_lab_seed.sql     questionnaire v1, rules, partner types, matching weights, 9 markets (basic facts)
  0014_lab_content.sql  CMS copy for the Lab pages, homepage band, menu link
supabase/seed/lab_fixtures.sql  fictional partners — staging only
scripts/lab-tests.mjs, lab-e2e.mjs, lab-admin-e2e.mjs, lab-a11y.mjs
```

**Security model**

- Roles: visitor (anon), Lab user (`lab_profiles`), administrator = approved CMS staff (`is_staff()` → `lab_is_admin()`).
  Lab sign-ups (`account: 'lab'` in the sign-up metadata) never get a CMS profile; `/admin` turns them away.
- Every `lab_*` table has RLS. Brand data is visible to brand members (`lab_brand_members`) and staff only.
- Computed tables (results, matches, runs, reports, introductions, events) have no user write grants: they are written only by
  `SECURITY DEFINER` functions that check membership (`lab_require_member`) or staff (`lab_require_admin`) themselves.
- Execute rights are revoked from every `lab_*` function and granted one by one; visitors can call only `lab_track`
  (allow-listed, anonymous events) and the visibility helpers.
- Partners are never readable as a table by users. Brands see them only through RPCs returning
  `lab_partner_public` fields — never contacts, internal notes or unlisted/archived records.
- Internal introduction notes live in their own staff-only table.
- Published questionnaire versions are frozen by trigger; results store the version, weights and bands they used.
- Rate limits (introductions/day, matching runs/hour, reports/day) in `lab_settings`.
- Every partner, market, rule, setting and contact change is written to `lab_audit`.
- Logos: private bucket `lab-logos` (1 MB, PNG/JPEG/WebP), path `brand/<brand_id>/…`, membership-checked policies, signed URLs.
- Private pages render `noindex`; `/lab/app/*` also sends `X-Robots-Tag: noindex`.

**Scoring** (`lab_score_core`): answer score 0–100 (multi-select adds up, capped at 100); area score = weighted mean of
answered applicable questions; N/A leaves the denominator; overall = area weights over scored areas, 1 decimal;
band where `min ≤ overall < max + 1`.

**Market fit** (`lab_market_fit_one`): readiness 30, existing presence 10, language 15, logistics 15 (−15 for crossing
the EU customs border), partners in database 15; needs ≥ 3 known factors and a readiness result.

**Matching** (`lab_match_one`): hard filters (excluded industry, offering not accepted, market not covered, price two
tiers away, readiness far below the partner's minimum), then `Σ(weight × criterion) ÷ Σ(all weights)`;
weights category 25 / geography 20 / price 15 / segment 15 / distribution 15 / readiness 10, versioned in
`lab_matching_configs`; each run stores config, result used, filters and counts.

**Routing**: public pages are prerendered. Every other `/lab/…` URL is served the prerendered `/lab/app` shell
(`vercel.json` rewrite, `scripts/serve.mjs` locally); the app chunk mounts after hydration. Screens use query
parameters (`?id=`, `?tab=`), so one shell serves all. The Lab is English-only; `/lab` links are never
language-prefixed.

## 3. Feature status

| Area | Status | Notes |
| --- | --- | --- |
| Auth: sign-up, verification, login, logout, forgot/reset, sessions, settings, deletion | Built, tested | Production email needs custom SMTP (see §5) |
| Roles: visitor / Lab user / admin, enforced in the database | Built, tested | |
| Brand onboarding + management, multi-brand | Built, tested | Members other than the owner: data model ready, no invite UI yet |
| Readiness assessment (21 questions, 6 areas, conditional, N/A, versioned) | Built, tested | |
| Assessment builder: versions, copy, edit, preview, publish, rules | Built, tested | |
| Market intelligence (9 markets) | Built; **content pending** | Seeded with basic facts only (EU, currency, languages), marked "basic facts only". Research, sources and dates must be added by the team |
| Market comparison (≤ 3) with evidence labels | Built, tested | |
| Matching engine + explanations + filters | Built, tested | |
| Partner database, statuses, CSV import (validated, deduplicated) + export, contacts with lawful basis | Built, tested | **Production database is empty** by design: no fabricated partners |
| Shortlist with notes | Built, tested | |
| Introductions + research requests, staff review, internal notes | Built, tested | No automatic email to partners, by design |
| Empty state + research request | Built, tested | |
| Opportunities timeline | Built, tested | |
| Reports: web, history, PDF | Built, tested | |
| Rule-based recommendations | Built, tested | 19 rules |
| User dashboard | Built, tested | |
| Admin: overview/analytics, users & brands, introductions, assessment, markets, partners, matching, opportunities, Lab content, settings | Built, tested | |
| Privacy-conscious analytics | Built | Counts from tables plus allow-listed anonymous events; no cookies, no user ids |
| GDPR: consents (versioned history), export, deletion | Built, tested | Privacy policy text must be updated to cover The Lab (§6) |
| SEO: public pages, sitemap, JSON-LD (WebApplication, FAQPage, breadcrumbs); private noindex | Built, checked | |
| Homepage band + menu link | Built | Editable in Admin → Homepage / Global |
| Staging fixtures (fictional) | Built | Guarded against production |
| In-app notifications | Built | Email notifications are not sent (needs SMTP + templates) |

## 4. Environment setup (local / staging)

```bash
pnpm install
supabase start                       # local Postgres/Auth/Storage (Docker)
for f in supabase/migrations/*.sql; do psql "$DB_URL" -v ON_ERROR_STOP=1 -f "$f"; done
psql "$DB_URL" -f supabase/seed/lab_fixtures.sql          # staging only: fictional partners
cp .env.example .env                 # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
pnpm build && pnpm preview           # http://localhost:4173/lab
```

Staff access: an approved CMS admin (`profiles.role = 'admin'`, `status = 'approved'`) is a Lab administrator.

Test commands (need the preview running and a **local** Supabase; they refuse hosted projects):

```bash
export SUPABASE_URL=… SUPABASE_ANON_KEY=… SUPABASE_SERVICE_ROLE_KEY=… LAB_ADMIN_EMAIL=… LAB_ADMIN_PASSWORD=…
node scripts/lab-tests.mjs        # API & security
node scripts/lab-e2e.mjs          # whole user journey in a browser
node scripts/lab-admin-e2e.mjs    # admin screens
node scripts/lab-a11y.mjs         # axe on signed-in screens (WIDTH=375 for mobile)
```

## 5. Deployment (production: Vercel + Supabase `nfpvygufottgzdbthgwt`)

1. **Database.** Apply `0011`–`0014` in order (SQL editor or `supabase db push`). All four are additive and idempotent;
   they don't touch existing tables except replacing `handle_new_user()` (same behaviour for CMS sign-ups, plus the Lab
   branch). **Never** run `supabase/seed/lab_fixtures.sql` in production.
2. **Auth → URL configuration.** Site URL `https://notbyaccident.com`; add redirect URLs
   `https://notbyaccident.com/lab/**` (and any preview domain you test on).
3. **Auth → Email.** "Confirm email" on. **Configure custom SMTP** (e.g. Resend with a verified `notbyaccident.com`
   domain): Supabase's built-in mailer only delivers to the project's team members and is heavily rate-limited, so
   without it real users never receive the confirmation or reset email. Optionally brand the templates.
4. **Deploy the site.** Merge to `main`; Vercel builds (`pnpm build`) and picks up the new `vercel.json` rewrite for
   `/lab/*`. No new environment variables.
5. **Check.** `/lab` loads; sign up with a real address; confirm; onboarding → assessment → results; Admin → The Lab shows
   the user. Matches will show the empty state until partners are added.

## 6. Blockers and what's needed from you

- **SMTP** (above): required before inviting real users.
- **Market intelligence**: profiles hold only EU membership, currency and languages. Add researched notes with sources
  and dates per market (Admin → The Lab → Markets); set confidence accordingly.
- **Partners**: add verified organisations (by hand or CSV), set their status honestly, list them. Contact individuals only
  with a lawful basis and through your own outreach process; the system never emails partners.
- **Legal**: update the privacy policy (Admin → Pages → Privacy) to describe The Lab's processing (account, brand
  profile, answers, consents, sharing with partners on approved introductions, retention, export/deletion). Consider
  separate terms of use for The Lab. The sign-up records consent version `2026-10`; bump `CONSENT_VERSION` in
  `src/lab/api.ts` when the texts change.

## 7. Next priorities

1. Fill markets and partners (§6). With SMTP configured, nothing else blocks going live.
2. Transactional emails for status changes (needs SMTP + templates; in-app notifications exist).
3. Brand team invitations (members table and policies already exist).
4. Market notes per product category beyond industry; source freshness reminders (`outdated` flag exists).
5. Report sharing link (signed, expiring) for brands that want to forward a PDF.
6. Admin bulk actions on partners; duplicate-merge tool.
7. Dutch and French versions of the public Lab pages, if the audience needs them.
