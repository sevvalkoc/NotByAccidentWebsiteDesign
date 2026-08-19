# The Not by Accident CMS — a plain-language guide

This explains how to run the site day-to-day without touching code:
logging in, adding Work, publishing articles, uploading files, and where
everything lives. If you're setting the backend up for the first time,
start with **Setup**, below.

---

## Setup (do this once)

The site's content lives in a [Supabase](https://supabase.com) project
that was created automatically when this site was first built in Figma
Make (project ID `nfpvygufottgzdbthgwt`). Three things need to happen
before the admin dashboard works:

### 1. Run the database migrations

Go to your Supabase project → **SQL Editor** → **New query**, and run these
three files in order (copy-paste the whole file, click Run):

1. `supabase/migrations/0001_init.sql` — creates every table, security rule
   and storage bucket.
2. `supabase/migrations/0002_seed.sql` — loads in everything already live
   on the site today (Work, Notes, Testimonials, Clients, Partners, Team,
   Capabilities), so the CMS starts populated instead of empty. This file
   is generated from the code — if you ever want to regenerate it (e.g.
   after a developer changes the static content), run:
   ```
   node --experimental-strip-types scripts/generate-seed-sql.mjs
   ```
3. `supabase/migrations/0003_auth_signup.sql` — adds self-service sign-up
   with email verification and admin approval (see step 3 below). Safe to
   run even if you don't plan to use sign-up — it only adds a `status`
   column and backfills every existing account to `approved`, so nothing
   that already has access loses it.

All three files are safe to re-run if something goes wrong partway through.

Also turn on email confirmation: Supabase Dashboard → **Authentication** →
**Providers** → **Email** → make sure **Confirm email** is switched on. That
is what makes Supabase actually send the verification email when someone
signs up from `/admin/signup`.

### 2. Set the site's environment variables

Copy `.env.example` to `.env` (for your own machine) and fill in:

- `VITE_SUPABASE_URL` — already filled in for you (`https://nfpvygufottgzdbthgwt.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — from Supabase Dashboard → **Project Settings** →
  **API** → **anon public** key

For the live site, set the same two variables in **Vercel → your project →
Settings → Environment Variables** instead (don't commit `.env` — it's
gitignored on purpose).

Both are safe to be public — the anon key can only do what the database's
Row Level Security rules allow it to do (see `supabase/migrations/0001_init.sql`),
which for anonymous visitors is: read published content, and submit the
contact form. Never put the **service role** key anywhere in this project.

### 3. Create your first admin account

Nobody starts out as an admin — including your own first account — so
there's one manual step to bootstrap it. After that, everything below can
happen through the dashboard itself.

1. Go to `/admin/signup` on the site, create an account, and click the
   verification link Supabase emails you.
2. Signing up lands you as a **pending editor** (see "Users and access" below)
   — nobody can sign in until they're approved, including you right now. In
   Supabase Dashboard → **SQL Editor**, run:
   ```sql
   update public.profiles set role = 'admin', status = 'approved'
   where email = 'you@example.com';
   ```
3. Go to `/admin` and sign in. You're now the first admin, and can approve
   everyone else from the **Users** screen instead of touching SQL again.

If you'd rather skip self-service sign-up entirely for a given person,
Supabase Dashboard → **Authentication** → **Users** → **Add user** still
works — just also give them a `profiles` row (`role`, `status: 'approved'`)
in the **Table Editor**, since accounts created that way don't get one
automatically.

### Users and access

- **Sign-up** (`/admin/signup`) is open, but new accounts start out
  `pending` and can't sign in to anything until an admin approves them from
  **Users**. Supabase sends the email verification link itself.
- **Forgot password** (`/admin/forgot-password`, linked from the sign-in
  page) emails a reset link; clicking it lands on `/admin/reset-password`
  to set a new password.
- Two roles exist once approved:
  - **Admin** — everything, including Users, Brand Settings and Site Settings.
  - **Editor** — everyday content management, without those sensitive
    system-level screens.
- An admin can also **Suspend** an approved account from Users, and
  **Reinstate** it later — suspended accounts are blocked at the database
  level (Row Level Security), not just hidden in the UI.

---

## Logging in

Go to `yourdomain.com/admin` and sign in with your email and password. The
dashboard is not linked from the public site and is set to `noindex`. See
"Users and access" above for sign-up, approval, roles and password reset.

---

## Adding a piece of Work (case study)

1. **Work** in the sidebar → **+ New Work**.
2. Fill in the title, client, year, location and a short description (this
   is what shows on listing cards).
3. Under **Problem → Insight → Intervention → Outcome**, write the actual
   narrative — this is what the public case study page displays. Leave a
   field blank if it's genuinely not written yet; don't invent an outcome
   or a number.
4. **Services** and **Related capability slugs** are comma-separated —
   e.g. `Brand Strategy, Creative Direction` and `brand-strategy,
   creative-direction`. The capability slugs must match a real capability
   (see the Capabilities list on the public site's `/capabilities` page
   for the exact slugs) — they're what makes "Capabilities behind this
   work" link correctly on the case study page.
5. Under **Images**, upload a hero image and thumbnail, then save once
   (click **Save draft**) before adding gallery images — the gallery
   needs the project to already exist.
6. Fill in **SEO** — title, description, canonical URL if needed.
7. Click **Publish** when it's ready. **Save draft** keeps it private.
   Unpublishing (via the "Unpublish" button that appears once published)
   sends it back to draft without deleting anything.

If you ever change a published project's **slug**, the system automatically
creates a redirect from the old URL to the new one — so old links and
search results don't break. You can see and manage all redirects under
**SEO**.

---

## Publishing a Blog / Notes article

1. **Blog / Notes** → **+ New Article**.
2. Title, slug, category, tags, excerpt, hero image.
3. **Body** uses a block editor — add paragraphs, headings, quotes, lists,
   images, callouts, dividers or a video embed URL, one block at a time,
   reorder with the arrows. This is deliberate: you can't change fonts,
   colours or sizes by hand, so every article automatically looks
   consistent with the rest of the site.
4. **Publish** when ready, or **Save draft** to keep working on it later.

---

## Uploading images, PDFs and other files

**Media Library** in the sidebar is the general-purpose store for anything
used across the site — search, filter by type, edit alt text and captions,
copy a file's URL, or delete it (careful: deleting here removes it from
anywhere currently using it).

You don't have to go to the Media Library first, though — every image
field anywhere in the dashboard (Work, Articles, Testimonials, Team,
Clients, Partners…) has its own **Upload** button that adds the file
straight to the library and attaches it in one step.

**Reports** (PDFs) and **Trainings** (PDFs/videos) use their own upload
buttons inside their own editors, and are stored in separate, purpose-built
buckets — see **Trainings**, below, for why that matters.

---

## Preparing Trainings (without going live)

The public `/trainings` page always shows "Coming Soon" — that's
hard-coded in `src/pages/Trainings.tsx` on purpose, regardless of what's in
the database. This means you can build out the entire training catalogue
in the **Trainings** admin screen — titles, descriptions, PDFs, videos,
pricing, everything — with zero risk of it leaking to the public site
early. Files you upload here go into a **private** storage bucket that
only signed-in admins/editors can read, on top of the page itself being
hidden.

When you're ready to actually launch the catalogue, that's a small code
change (swapping the hard-coded "Coming Soon" page for one that lists
published trainings) — ask a developer, or flag it and it can be done
quickly, since all the content and infrastructure will already be there.

---

## Uploading Reports

**Reports** → **+ New Report**. Unlike Trainings, published Reports *are*
public straight away (the public `/reports` page is designed to list them,
once any exist) — so only set status to **Published** when you actually
want it live.

---

## Managing Testimonials, Clients, Partners, Studio (Team)

Each of these is a simple list: **+ Add**, fill in the fields, **Save**.
Use the ↑/↓ arrows to reorder — this is the order they appear in on the
public site. Toggle "Visible on the public site" off to hide an entry
without deleting it.

- **Clients** and **Partners** are two separate lists, feeding two separate
  logo sliders on the homepage — don't mix them up.
- **Testimonials**: quote, person, role, company — nothing else appears
  publicly (no company logo wall underneath, on purpose).
- **Studio**: team members shown on the `/studio` page. The rest of that
  page's copy (the opening statement, principles, culture text) isn't
  wired to a live editor yet — see **What isn't finished yet**, below.

---

## Editing Contact information, the footer and navigation

**Footer / Contact** in the sidebar edits your studio address, phone,
emails, hours and social links **in one place** — change the address here
once, and it updates in the footer, the Contact page, and the site's
structured data (the machine-readable info search engines and AI assistants
read) simultaneously.

**Navigation** manages the header menu and the footer's "Explore" column —
label, URL, whether it opens in a new tab, and the order. Changing a link's
URL here does **not** automatically create a redirect — if a page's actual
address changed, add that under **SEO → Redirects** as well.

---

## Viewing enquiries (Submissions)

**Submissions** collects everything: the contact form, the footer
newsletter box, the homepage newsletter pop-up, and the Trainings/Reports
waiting lists — each tagged with its `source` so you can tell them apart.
Mark each as New / Read / Replied / Archived as you work through them.

---

## Changing colours and fonts

**Brand Settings** lets you set the eight core colours (with a picker and a
contrast warning if text-on-background falls below the accessible
minimum) and the four font roles (Display, Heading, Body, UI). **Important
honesty note:** these values are saved and available for future use, but
the live site's actual CSS does not yet re-read them automatically — a
colour or font change here won't visually change the public site until
that wiring is built (see **What isn't finished yet**). Logos and the
favicon uploaded here are stored and ready to be wired in the same way.

---

## SEO

**SEO** shows a plain-language health check across every published Work
item and Article — SEO title and description present and a sensible
length, hero image set, slug present — flagged **Good** / **Needs
attention** / **Missing**, with a link straight to the editor. It is not a
full site crawler; it checks what the database actually holds.

The same page also has **Redirects**: add an old path and a new path, and
anyone who lands on the old URL is sent on to the new one. The form blocks
you from creating an immediate redirect loop. **One honest limitation:**
because this is a JavaScript site with no server of its own, this isn't a
true HTTP 301 — the old URL still briefly returns the page's normal
"not found" response before JavaScript checks the redirects list and sends
the visitor on. Real browsers and most modern search engine crawlers
handle this fine, but it's not as clean as a genuine server-level redirect.
If a specific URL's redirect really matters for SEO (a lot of existing
backlinks, for instance), it's worth also adding a rule directly in
`vercel.json`, which does issue a true 301 at the hosting level.

Robots.txt, the XML sitemap, canonical URLs, Open Graph tags, and
Organization/Article/BreadcrumbList structured data are already handled in
code across the whole site and don't need day-to-day management — they
update automatically as you publish content.

---

## What isn't finished yet

Being direct about this rather than letting you discover it by accident:

- **Homepage & Studio page copy** (the Hero headline rotation, section
  eyebrows/headings, the Studio page's opening statement and principles
  text) is not yet wired to a live editor. The database schema for this
  (`pages` / `page_sections`) already exists and is ready — building the
  admin screen and the corresponding read-side wiring is the next phase.
  Everything else in this document **is** live today.
- **Brand Settings' colours and fonts** are stored but not yet applied to
  the live site's CSS automatically (see above).
- Scheduled publishing (`scheduled_at` fields exist on Work and Articles)
  is not yet automated — publishing still happens by clicking Publish.
  There's no cron job flipping status at a future time yet.
- The SEO overview is a straightforward field-presence check, not a full
  crawler (no broken-link detection across the whole site, for instance).

None of this affects what's already live and working: Work, Blog/Notes,
Testimonials, Clients, Partners, Studio team, Trainings (private catalogue
prep), Reports, Media Library, Contact/Footer settings, Navigation,
Submissions, and Redirects are all fully functional today.
