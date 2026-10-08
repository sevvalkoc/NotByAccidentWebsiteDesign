# 04 — Why v1 failed, and what v2 changes

v1 was not approved. This is the audit of the v1 build, written before any v2 change.

## Design: what went wrong, and where

| Problem | Where it lives in v1 | Cause |
|---|---|---|
| Type far too large | `tokens.css` `--t-mega: clamp(3.5rem, 12.6vw, 14.5rem)`; `home.css` `.entry__h1` up to 13rem; `.case__title` 15rem; `.case__fig-v` 20rem; `.proof__v` 8.5rem; `.position__statement` 7.5rem; Index sheet names 3.5rem | Scale was the main idea. Every section reached for display type. |
| Logo/brand too present | Hero `entry__band`: a Beetroot field carrying the Nick's wedge at 27% of viewport width, morphing into a full-bleed field | A logo-derived shape was used as the hero and as a section transition. v2 rule: no logo-shaped masks, no logo as content. |
| Homepage heavy | Seven chapters, each with a ruled index line, numbers, asides, counts | Every chapter explained itself. |
| Capability overload | `CapabilityMap.tsx`: all 30 capabilities in 5 columns, plus project cross-mapping, plus readout panel | "Every discipline, every link, at full density" — explicitly rejected. |
| Too much exposed at once | Work list showed brief, discipline, place, year, figure, open-cue for every row; proof shelf showed four 8rem figures | Information was dumped rather than revealed. |
| Palette tied to the old identity | Milk/Ink/Beetroot/Pickle/Carbon/Yolk used directly as the public palette | Correct for print, too heritage-bound for the digital expression. |
| Metadata noise | Chapter numbers (`00 · Entry` … `06 · Contact`), counts (`30 · 5`, `05 · 2024–2026`), header chapter label | Numbers added to look designed, not to inform. |
| Weak hierarchy | Most headings at display or near-display size | No contrast between small, precise information and the few expressive moments. |

## CMS: what was really editable in v1

The admin (`/admin`) and Supabase schema were carried over intact, but the v1 public site only read part of it.

| Content | Schema | Admin | v1 public site reads it? |
|---|---|---|---|
| Projects (title, client, slug, year, location, brief, narrative, services, capabilities, SEO, status, order) | yes | yes (`WorkEditor`) | partly: no gallery, credits, external URL, SEO fields, client, industry |
| Project gallery / video | `project_media` | yes (`GalleryManager`) | **no** |
| Capabilities | yes (no SEO fields) | yes | yes, minus visibility nuance and SEO |
| Notes / articles (blocks, SEO, tags) | yes | yes | yes, minus SEO fields and tags |
| Team, testimonials | yes | yes | yes |
| Site settings (contact, socials, SEO defaults, OG image) | yes | yes | contact + socials only; **SEO defaults ignored** |
| Brand settings (logo, favicon, OG media) | yes | yes | **no** |
| Navigation (header/footer) | yes | yes | **no**, nav was hard-coded |
| Page copy (hero, section titles, CTAs, images) | `pages` + `page_sections` | yes, but shaped for the *previous* site's layout | **no**, v1 read `copy.en.ts` only |
| Per-page SEO (`pages.seo_*`, canonical, noindex) | yes | no editor | **no** |

So in v1, changing homepage wording required a code change. That fails the brief.

## Constraint discovered

The previous website is live on the **same Supabase project**. Its homepage reads `pages.slug = 'home'`. If v2 rewrote those rows, the live site would change, which breaks "keep the original website untouched". v2 therefore keeps its page copy in its own pages, slugs prefixed `next/` (`next/home`, `next/studio`, `next/global` …). Shared collections (projects, capabilities, notes, team) stay shared, as they should: one source of truth.

## v2 plan

1. **Visual system**: new digital palette (near-black, cold off-white, mineral, cool grey, one periwinkle signal, one acidic accent, Beetroot as a rare warm interrupt). Rebuilt type scale (micro → display, display max ≈ 6.75rem, used sparingly). Logo at 104–124px.
2. **Homepage**: hero → selected work (dominant) → practice (5 areas, one line each) → evidence → studio → notes → contact. Each section has one focal point.
3. **Signature interaction, "the slip"**: media is built from horizontal bands that briefly fall out of register and settle back. Order → interruption → order. Plus environment shifts between sections and sheet page transitions. Nothing else.
4. **CMS**: migration `0010_next_site.sql` (idempotent, additive) seeds `next/*` pages and adds missing SEO/video fields. New admin screens: **Homepage**, **Pages (new site)**. The public site reads page copy, media, navigation, settings and SEO from Supabase. Static copy stays only as a fallback.
5. **Verification**: a real local Supabase (Docker) running every migration, with the acceptance test from the brief scripted against it.
