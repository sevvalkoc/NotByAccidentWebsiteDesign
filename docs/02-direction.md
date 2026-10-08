# 02 — References, concept, architecture

## Reference notes

The session's network policy blocked every reference domain (blit.studio, awwwards.com, clicktokeep.com, experiment.obys.agency, audit.devoco.studio, ordernchaos.aiziza.com …). I couldn't load them live, so these notes are principles taken from what is publicly known about each studio's work. They don't come from a fresh inspection, and nothing here is copied.

| Reference | Principle taken | Explicitly not taken |
|---|---|---|
| Still Night | A page can feel like a place. Darkness used as stage, not mood. Restraint holds the tension. | Gothic palette, imagery, narrative |
| Blit | Typography at architectural scale. Media and type share one plane. Sections behave like spaces you move through, not stacked boxes. | Their type, layouts, video treatments |
| Click to Keep | Interface that rewards touching it. A rule you can bend, then watch it hold. | Their mechanics, humour |
| Obys Experiment | One dataset, several views (index ⇄ sheet). Motion explains structure. | Horizontal scroll galleries, their grid |
| Order & Chaos | A strict grid makes a single disruption legible. | Random scatter as the default state |
| Devoco audit | Chapters with a visible system: numbered, labelled, comparable. Information as interface. | Their chapter UI |

## Concept: **The Notch**

The Nick is a plain, ordered shape with one cut made into it on purpose. The site works the same way.

> A strict editorial system. One deliberate cut per surface.

- **Order**: one 12-column grid, one type pair, numbered chapters, ruled metadata in every margin. The guidelines' seven layout behaviours become seven chapters, each one labelled.
- **The cut**: once per screen something breaks the system on purpose. A wedge opens in a field. A word gets replaced. A sheet pushes the page away. A capability lights up the work that used it. Then the system closes again.
- **Accident**: one page in the site is allowed to be an accident, and that's the 404. The footer admits it.

The future here comes from behaviour. Chapters change the environment instead of stacking, and type changes scale as you approach it. Pages arrive as sheets. The interface also knows small true things, like whether the Amsterdam studio is open right now.

## Homepage: seven chapters, seven behaviours

| # | Chapter | Behaviour | Relationship | Job |
|---|---|---|---|---|
| 00 | Entry | Small against large | House (Milk, Beetroot edge, Pickle rule) | Who, in one line. The notch band sits at the right edge. |
| 01 | Position | The field | Beetroot field, Milk type | Under twelve words. The band widens into this field as you scroll. |
| 02 | Work | The interval | Dark | Numbered list + one fixed viewer that cross-cuts |
| 03 | Capabilities | The dense page | House | All 30 capabilities, all linked. Hover/focus lights up the cases that used them |
| 04 | Proof | The shelf | Dark | One figure per case, large. One quotation. |
| 05 | Notes | The cluster | Quiet (Carbon) | Four notes at four sizes |
| 06 | Contact | The edge | House | One line, one email. Live studio status. |
| — | Footer | Final frame | Dark | Quiet ending, full index, last-line humour |

No two neighbouring chapters share a behaviour, which the guidelines require.

## Information architecture

- Every route in the current site keeps its URL. NL/FR stay at `/nl/*` and `/fr/*`, so there's nothing to redirect.
- Homepage = position + proof. The depth lives on the capability pages (30), the case studies (5) and Notes (12).
- `/work` = archive (index ⇄ sheet view). `/case-studies` = the long reads. Each canonicalises to itself, and the two pages are written differently so they don't compete.
- Header: lockup · Work · Capabilities · Notes · Studio · Contact · **Index**. Index opens a full-sheet typographic directory of every page, including Trainings, Reports, Case studies, Search, languages, emails and socials.
- Footer: an authored ending plus the complete index.

## Copy rules

Before rewriting, the copy goes through a fixed set of steps. Every line gets checked for search intent, primary term and the facts it carries. Then it's rewritten shorter. The essays and legal pages stay verbatim, because they're articles and notices, not marketing copy. Page copy drops about 40–60%. Capability pages keep their full semantic content and gain structure instead of losing words.

## Deliberate departures from the guidelines (and why)

| Guideline | Here | Reason |
|---|---|---|
| "No scroll-triggered showcase" | Scroll changes environments and closes the notch. No scroll-jacking, and the page always scrolls natively. | The brief asks for spatial chapters, so motion explains the structure and isn't a showcase. |
| "No parallax" | Kept: no parallax. | — |
| "Nothing follows the mouse" | Kept: system cursor and an image crosshair. Previews appear in a **fixed viewer** that never follows the pointer. | Brand rule beats the brief's optional cursor. |
| Motion timings 120/240/400/500 | Kept exactly. A longer duration only appears where it's tied to scroll position. | — |
| Colour 10–25% | The Position chapter is a full Beetroot field (the "Field" behaviour, fewer than 12 words). The rest of the page stays within proportion. | The field is the one licensed full-bleed moment per page. |
