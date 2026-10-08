# 06 · v3: feedback round

Changes made in response to the review of v2.

- **Hero**: the previous site's headline is back, in Lora, with the last word turning over: *wanted*, *chosen*, *remembered*, *recommended* (Dutch and French use the previous site's own words). The words are edited in Admin → Homepage → Hero → Rotating words. Screen readers hear the sentence once; reduced motion keeps it still. On desktop, text and photograph share the same edges: the photo starts level with the eyebrow and ends level with the buttons.
- **Copy**: page copy and SEO titles/descriptions rewritten in all three languages, sharper and more search-led (branding agency, brand strategy, Amsterdam), with no new claims. Legal text unchanged. Migration 0010 regenerated; a database that already ran it keeps its current copy, since the migration never overwrites, so update those fields in /admin.
- **Space**: section padding reduced (`--section-pad` now 64–112px), selected-work offsets and section-head margins tightened. The homepage is about 12% shorter at 1440px.
- **Testimonials**: all active testimonials, one at a time, with previous/next arrows, a counter, keyboard arrows and swipe. The one chosen in the admin comes first.
- **Capabilities**: no more accordions. A row of five practice links at the top, then each practice with every discipline listed beside it as a direct link.
- **Studio**: the people section is removed.
- **Subscribe forms**: input and button on one line, same height and baseline, in the footer, on Studio, Trainings and Reports; the footer's closing line and form now share a top edge.

Checks after the change: typecheck clean, SEO audit 0 problems (177 pages), axe 0 violations, no overflow or runtime errors at 375–1728px.

## Carbon tracker

The footer of every page shows the live carbon footprint of the page being read: grams of CO₂e per page view, the page weight, and its grade on the Sustainable Web Design scale (A+ to F), with a "How we measure" note.

- **Measured, not claimed.** The browser's Resource Timing API reports every byte the page transfers, live, including lazy images as they load; a client-side route change starts a new page. Files from other servers that don't report a size (no `Timing-Allow-Origin`) are counted separately and the note says how many.
- **Converted with CO2.js** (Green Web Foundation), Sustainable Web Design model v4, at build time (`scripts/carbon-factor.mjs` → `src/content/carbon.json`), so the browser ships two numbers, not the library. Assumes a global-average grid and standard hosting: 0.1482 g CO₂e per MB. If the host is verified green by the Green Web Foundation, build with `GREEN_HOSTING=1`. The build checks that the A+–F thresholds still match the library.
- **Made lighter to match.** Photos now ask the CDN for quality 60 instead of 72 (AVIF/WebP), and the local preview compresses with Brotli like Vercel, so local readings match production.
- **Readings** (local preview, code + fonts + HTML, photos not reachable from the sandbox): homepage 302 kB, 0.045 g, A; capabilities 0.045 g, A; studio 0.044 g, A; an article 0.038 g, A+. In production the photos add to this.
