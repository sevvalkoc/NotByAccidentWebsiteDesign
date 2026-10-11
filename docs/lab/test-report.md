# The Lab · test report

Run on **11 October 2026** against a local Supabase (Postgres 17, migrations 0011–0014 + staging fixtures) and the
production build served by `pnpm preview`. Every result below was executed in that run; nothing is reported from
memory. Re-run with the commands in [README.md §4](README.md).

| Check | Command | Result |
| --- | --- | --- |
| Types | `pnpm typecheck` | pass |
| Migrations idempotent (each applied twice) | `psql -f 0011…0014` | pass |
| API & security | `node scripts/lab-tests.mjs` | **51 / 51** |
| User journey in a browser | `node scripts/lab-e2e.mjs` | **18 / 18**, no browser errors |
| Admin in a browser | `node scripts/lab-admin-e2e.mjs` | **11 / 11**, no browser errors |
| axe, signed-in screens + dialog, 1280 px | `node scripts/lab-a11y.mjs` | 12 / 12 clean |
| axe + horizontal overflow, 375 px | `WIDTH=375 node scripts/lab-a11y.mjs` | 12 / 12 clean |
| axe, public Lab pages | `node scripts/a11y.mjs /lab,…` (7 pages) | 0 violations |
| Regression: axe, existing site | `node scripts/a11y.mjs` (15 pages) | 0 violations |
| Regression: SEO | `node scripts/seo-audit.mjs` | 185 pages, 0 problems |
| Regression: runtime, hydration, overflow | `node scripts/qa.mjs` (13 pages × 375/768/1440) | no issues |
| Database exposure | SQL on `pg_proc`/`pg_class` | anon can execute only `lab_track` and 4 read-only helpers; all `lab_*` tables have RLS; all SECURITY DEFINER functions pin `search_path` |

## Not covered, or covered differently

- **Email delivery** isn't testable here: the local stack has no mail server. The E2E confirms the reset request reaches
  Supabase (which answers "error sending email", shown to the user as a friendly message) and then completes the reset
  with a recovery link generated through the admin API. In production this needs custom SMTP (README §5).
- Sign-up confirmation runs with confirmation off locally; the "check your inbox" and "resend" paths were reviewed in
  code, not executed.
- Logo upload was not exercised in a browser test (storage policies were written; no automated test).
- PDF output was verified to be a valid PDF file; its layout was not visually compared.
- Market-fit and matching were tested on fixture data (fictional partners, markets with basic facts only).

## Bugs the tests found and fixed during this work

- Seed: assessment version id not captured (`returning id into v`).
- Brand creation failed on `insert … returning` (owner membership written after the row) → creator can read own brand; creation now requires a Lab profile.
- Opportunity status change crashed (nested update of the same row from the activity trigger).
- CSV import: ambiguous `key` variable.
- Target markets accepted codes The Lab doesn't cover.
- Server render of the lazy app shell raised React #419 → app mounts after hydration.
- `/admin/login` kept showing the form to signed-in non-staff accounts (also affected pending CMS users).
- Accessibility: heading order on matches, unlabelled meters, nested complementary landmark.
- Mobile: brand form overflowed at 375 px.

## API & security tests (51)

**Accounts & roles**

- ✓ Lab sign-up creates a Lab profile and consent records, never a CMS profile
- ✓ A Lab user is not an administrator
- ✓ Visitors cannot reach private Lab data
- ✓ Visitors can read the published questionnaire, weights and markets
- ✓ Anonymous analytics accept only allow-listed events
- ✓ Users cannot call internal scoring functions or write computed tables

**Brands**

- ✓ Create a brand; the creator becomes its owner
- ✓ Brand validation rejects unknown market codes and enum values
- ✓ A user cannot see, edit or assess another user’s brand

**Readiness assessment & scoring**

- ✓ An assessment cannot be completed with required answers missing
- ✓ Option scores are not exposed to users
- ✓ Score matches an independent computation (mixed answers, N/A, multi-select)
- ✓ N/A answers leave the question out of the denominator
- ✓ Conditional questions only apply when their condition holds
- ✓ Same answers → same score (deterministic)
- ✓ Results carry rule-based recommendations, including option-linked ones

**Assessment versions (admin)**

- ✓ Admin clones, previews and publishes a new version; old results keep their version and score
- ✓ Published and archived questions are frozen
- ✓ Publishing validates weights and bands
- ✓ A Lab user cannot edit the questionnaire

**Market comparison**

- ✓ Compares 1–3 markets with evidence labels; refuses more than 3
- ✓ No market-fit score without enough inputs
- ✓ UK is treated as outside the EU customs border

**Matching**

- ✓ Hard filters exclude mismatched partners; unlisted partners never appear
- ✓ Ranked by score, each with criteria, reasons and limitations
- ✓ Missing partner data never counts as a positive match
- ✓ Filters narrow the results
- ✓ Fixture partners disappear when fixtures are switched off
- ✓ Run metadata is stored (config version, weights, result used)
- ✓ Partner data shown to brands never includes internal notes or contacts
- ✓ Matching is rate-limited

**Shortlist**

- ✓ Save with a note, list, and remove
- ✓ Cannot save an unlisted partner or into another brand

**Introductions & research requests**

- ✓ Request an introduction; duplicates are refused; staff inbox notified
- ✓ Users cannot change a request’s status themselves
- ✓ Admin review: public note reaches the user, internal note never does
- ✓ Brand lists its requests (public history only), replies, and others cannot
- ✓ “Introduction sent” creates an opportunity on the brand’s timeline
- ✓ Empty state: a research request without a partner
- ✓ A brand can withdraw an open request

**Opportunities**

- ✓ Status and next-action changes are recorded on the timeline
- ✓ Users cannot forge system entries or hidden activities
- ✓ A brand can track an opportunity without an introduction

**Reports**

- ✓ Generate a report snapshot; history is kept; no internal data inside

**Administration**

- ✓ Admin overview and user list work for staff only
- ✓ CSV import validates rows and deduplicates (dry run, then write)
- ✓ Partner changes are audited
- ✓ Matching weights are configurable and validated

**Privacy: export & deletion**

- ✓ Export my data returns the user’s own records
- ✓ Delete account removes the user and their solely-owned brands
- ✓ CMS staff cannot delete themselves through the Lab

## Browser journey (18)
- ✓ Homepage shows The Lab section
- ✓ Readiness preview gives an indicative result
- ✓ Sign up
- ✓ Brand onboarding (3 steps)
- ✓ Readiness assessment, answered and completed
- ✓ Compare markets
- ✓ Matches with explanations
- ✓ Shortlist with a note
- ✓ Request an introduction
- ✓ Admin review: more information needed (internal note stays internal)
- ✓ Brand replies; admin sends the introduction; opportunity appears
- ✓ Track the opportunity
- ✓ Dashboard reflects the journey
- ✓ Generate a report and download the PDF
- ✓ Export my data
- ✓ Sign out, forgot password, reset via recovery link, sign in
- ✓ Private pages are noindex
- ✓ Delete the account

## Admin (11)
- ✓ Admin sign-in and The Lab overview
- ✓ Review an introduction: status, public message, internal note
- ✓ Users & brands
- ✓ Assessment builder: copy to draft, edit weights, preview, delete
- ✓ Published questions are read-only
- ✓ Recommendation rules
- ✓ Markets: add a source, then remove it
- ✓ Partners: create, list, contact, export, CSV dry run
- ✓ Matching weights validate to 100
- ✓ Opportunities, Content and Settings render
- ✓ A Lab user is turned away from /admin
