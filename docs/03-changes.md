# 03 — What changed against the current site

Nothing in the old repository was modified. This file lists every deliberate difference in behaviour, so nothing gets removed without anyone noticing.

## Kept, working the same

| Connection | Status |
|---|---|
| All public routes, EN at `/`, NL at `/nl/*`, FR at `/fr/*` | Same URLs, same slugs. No redirects needed. |
| Supabase CMS (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) | Same env vars. Projects, capabilities, categories, notes (incl. block editor content), testimonials, team, site settings are read live, exactly as before. |
| Lead capture → `contact_submissions` | Same table, same `source` values: `contact`, `footer`, `newsletter`. |
| `/admin/*` CMS tool | Copied in unchanged (two unused imports removed so strict TypeScript passes). Lazy chunk, own Tailwind CSS, `noindex`. |
| Emails | hello@, new@, press@notbyaccident.com |
| Socials | LinkedIn, Instagram, TikTok, Substack, Are.na, Dribbble (from data, or the CMS when set) |
| Sitemap with hreflang, robots.txt (`Disallow: /admin`) | Rebuilt at build time from the same data |
| Analytics / tag manager / pixels | None existed; none added |
| Hosting | Vercel (`vercel.json`), plus `_redirects` for Netlify-style hosts |

## Changed on purpose

1. **Prerendering.** Every page is now real HTML at build time (177 files), including head, canonical, hreflang and JSON-LD. Before, crawlers that don't run JS saw an empty `<div>`.
2. **CMS at build time.** `pnpm snapshot` reads published CMS content before prerendering, so the static HTML matches the CMS. Set the two Supabase env vars in the Vercel project, as before. **Publishing in the admin now needs a redeploy before crawlers and no-JS readers see the change** (visitors still get live content after the page loads). A Vercel deploy hook triggered from the admin, or a nightly redeploy, closes the gap.
3. **Contact form.** *Company* and *budget* now reach the inbox (folded into `message`). The old form collected them and discarded them.
4. **Newsletter popup removed.** The 18-second modal is gone. Signup lives in the footer on every page, plus Studio, Trainings and Reports. Same table, `source: footer` / `newsletter`.
5. **Page-section copy is no longer CMS-editable.** Admin → Pages (hero eyebrow, section headings, custom sections) edited the previous layout's fixed slots, and those slots don't exist in this design. Page copy lives in `src/content/copy.{en,nl,fr}.ts`. Records (cases, capabilities, notes, team, testimonials, settings) remain CMS-driven.
6. **Client and partner logo walls removed.** The old code marks them as placeholders, and they listed companies with no supporting evidence.
7. **Phone, address, registration number.** The old footer printed "to be added". These are now hidden until real values exist in Site Settings, then they appear automatically (and in the Organization schema).
8. **Header.** The lockup is the supplied artwork (the old header set the name in Lora, which the guidelines forbid). Primary nav: Work · Capabilities · Notes · Studio · Contact. Trainings, Reports, Case studies, Search and the language switch moved to the **Index** sheet and the footer.
9. **Favicon.** Generated from the supplied symbol. The old inline SVG had the wedge at the wrong depth.
10. **Search** is `noindex` and disallowed in robots.txt (as a results page it was thin content).
11. **Homepage FAQ schema dropped**, because its questions weren't visible on the page. Capability pages keep FAQ markup, and their two questions now print visibly.

## Before launch: facts to verify

See `01-audit.md` → *Facts to verify*. In short: case-study details and figures, the four testimonials, the two team bios, "Est. 2019". All copy is used exactly as the current site states it. Wrong facts are fixed in the CMS (EN) or `src/content/seed/data.{nl,fr}.ts`.

## Imagery

Every project, note and team image on the current site is an Unsplash stock photo, and the guidelines forbid stock. The new site uses the same URLs, so nothing is invented, through a responsive `srcset` (AVIF/WebP via the CDN). Replace them with real project photography through the CMS media library. No code change needed.

## Known limits

- The reference sites were blocked by this build environment's network policy. The design principles come from prior knowledge of those studios, not from a fresh inspection (see `02-direction.md`).
- Dutch and French record data (cases, capabilities, notes) is the previous site's translation, used as-is. Page copy was newly translated to match the shorter English.
- Studio hours for the live clock (Mon–Thu 10:00–17:00, Europe/Amsterdam) are set in `src/components/StudioClock.tsx`. If the hours change in the CMS, change them there too.
