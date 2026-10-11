# The Lab · admin guide

Admin → **The Lab** (`/admin/lab`). Any approved CMS admin or editor is a Lab administrator. Lab users can't open the
admin; they are sent back to `/lab/dashboard`.

## Daily: Overview and Introductions

- **Overview** shows counts for the chosen period (registrations, assessments, comparisons, matching runs, shortlists,
  requests, reports, PDF downloads, previews) and the **staff inbox**: every new introduction or research request, every
  brand reply and every withdrawal.
- **Introductions** lists open requests. Open one to see the brand, what it's considering, its message, whether it
  allowed its profile to be shared with partners, and the partner's verification status.
  - Set a **status** and, optionally, a **message to the brand**. The brand sees both, and gets an in-app notification.
  - **Internal notes** are for the team only. They're stored separately and never reach the brand, its reports or its
    data export.
  - Statuses: requested → under review → more info needed / approved / declined → introduction sent → in discussion →
    completed / closed. "More info needed" lets the brand reply; its reply moves the request back to "under review".
  - Marking **introduction sent** or **in discussion** adds an opportunity to the brand's pipeline.
  - The system never contacts a partner. Make introductions yourself, and only where the partner has agreed to receive
    them or you have another lawful basis and an outreach process. Requests to fictional (fixture) partners are labelled.
  - Research requests (no partner) come from the empty state: research, add verified partners, then update the request.

## Partner database

- **Status** must be honest: *research prospect* (found, not verified) → *verified organisation* (you checked it exists
  and the details are current) → *contacted prospect* → *confirmed participating partner* (agreed to take introductions).
  Brands see this label on every match.
- **Listed** controls whether a partner can appear in matching. **Takes introductions** only once they've confirmed it.
- Hard filters come from: markets covered, offerings accepted, excluded industries, price tiers (two tiers away is
  excluded) and minimum readiness. Leave a field empty when you don't know it: unknown criteria score 0 and are shown to
  the brand as "still to verify", so gaps never inflate a match.
- **Contacts** are staff-only. Record the lawful basis for each person. Prefer published business contacts or consent.
- **Import CSV**: header row required; columns `name, website, country_code, city, type_key, description, industries,
  product_categories, customer_segments, price_tiers, distribution_models, accepts_offering, brand_requirements,
  business_size, min_readiness, source_url, last_verified_at, verification_status, markets, listed`. Lists use `|`.
  Every import runs as a **dry run** first and shows new / updated / skipped rows with reasons. Duplicates are found by
  website domain, then by name + country (within the file and against the database). Imported rows are unlisted
  research prospects unless the file says otherwise. **Export CSV** downloads the filtered list in the same format.

## Markets

Nine profiles (NL, DE, UK, FR, BE, DK, SE, IT, ES), seeded with basic facts only. For each market, add only what you can
source: overview, consumer behaviour, channels, pricing, logistics, regulation, entry barriers; then **sources** (title,
URL, publisher, dates) and **notes per industry**. Set **confidence** (basic facts only / partly verified / verified) and
**last verified**; tick **possibly outdated** when something may have changed. Brands see confidence, dates and sources,
and empty fields as "missing information".

## Assessment builder

- The live questionnaire is the **published** version. Published and archived versions are frozen, so every result can
  be reproduced exactly.
- To change anything: **Copy to new draft**, then edit weights (must total 100), bands (contiguous 0–100; describe
  preparation, never chances of success), questions and answers (score 0–100, N/A, a recommendation key that the answer
  triggers), conditions ("show only if"), and which questions appear in the public preview.
- Use **Preview scoring** to try answers before publishing. **Publish** validates the draft and archives the old
  version. Results already computed keep their version; brands see their next result on the new one.
- **Recommendation rules**: title, advice, area, priority, condition (`category_below`, `category_at_least`,
  `overall_below`, `overall_at_least`, `option_selected`, `brand_field`, or `manual` for answer-triggered rules).

## Matching

Six weights (must total 100) and the minimum score shown. Each save creates a new version; each matching run records
the version it used.

## Users & brands, Opportunities

Read-only overviews: accounts, confirmation status, brands with their latest score, assessments in progress; every
brand's pipeline.

## Content

The copy of `/lab`, `/lab/how-it-works`, `/lab/market-readiness` and the in-app microcopy (empty states, notes) — the same
editor as other pages, including SEO fields. The homepage band is under **Homepage → The Lab**; the menu links under
**Global**.

## Settings

Abuse limits (introductions per day, matching runs per hour, reports per day) and **Show fictional demo partners**.
Keep the latter **off in production**. `supabase/seed/lab_fixtures.sql` refuses to run on a database that holds real
partners.
