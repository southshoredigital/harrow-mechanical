# Art direction: Harrow Mechanical

The constraints that govern this build. Written before any generation. If a design decision is not derivable from this document, it has not been made yet.

---

## Three adjectives

**Engineered. Unsentimental. Exact.**

Not "professional", not "modern", not "clean". Those describe the absence of bad decisions rather than the presence of good ones.

---

## We are not

Five things this site must not be. This list does more work than the adjectives.

1. **Not corporate blue.** The default palette of every contractor site in Australia.
2. **Not aspirational.** No photography of people looking at plans and nodding. No hero shot of a glass tower at dusk.
3. **Not friendly.** No rounded cards, no soft shadows, no warm reassuring tone. The audience is an estimator with fourteen tabs open.
4. **Not vague.** Every claim carries a number, a date, a certification reference or a project name. Nothing that could appear on a competitor's site unchanged.
5. **Not decorated.** No element exists for visual interest alone. If it doesn't carry information, it comes out.

---

## Reference anchor

**Technical documentation.** Specifically: mechanical services drawings, equipment nameplates, and the visual language of Swiss engineering documentation from the 1970s.

Think schedule tables, revision blocks, callout leaders, dimension lines, part numbers. The site should feel like it was set by someone who reads drawings for a living, because the audience does.

Look at: plant nameplates, AS1668 drawing sets, Braun product documentation, Otl Aicher's Munich signage system, old Grundfos and Danfoss catalogues.

Do not look at: other contractor websites. Every one of them will pull you toward the median.

---

## Structural idea

**A persistent specification rail.**

A left-hand column that stays fixed while content scrolls, carrying the current section index, a revision-style identifier, and contextual data for whatever the reader is looking at. On a project page it shows contract value, duration, sector and systems. On the capabilities page it shows the system index.

It reads as a drawing title block. It also solves a real navigation problem on a content-dense site, which is the test of whether a structural idea is any good: it has to earn its place functionally, not just visually.

On mobile it collapses to a sticky single-line strip at the top, still carrying the section identifier.

---

## The memorable moment

**A scroll-plotted riser schematic.**

On the capabilities page, an SVG line diagram of a building's mechanical services riser draws itself as the reader scrolls, the way a plotter traces a drawing. Each system branch completes as its corresponding section enters the viewport, and the branch label appears only once its line lands.

Implementation: GSAP ScrollTrigger driving `stroke-dashoffset` on layered SVG paths. Monochrome lines, accent colour on the active branch only. Roughly 90 minutes to build well.

Under `prefers-reduced-motion`, the full diagram renders immediately with no animation. It must still make sense as a static image.

**Why this one:** it is literally the thing they sell, drawn the way they draw it. It is not decoration borrowed from another industry.

---

## Typography

All self-hosted, all free for commercial use, none of them the default sans.

| Role | Face | Source |
|---|---|---|
| Display and headings | **Cabinet Grotesk** | Fontshare (ITF) |
| Body | **Switzer** | Fontshare (ITF) |
| Data, specs, labels, the rail | **JetBrains Mono** | OFL |

**The mono is doing real work.** Every number on the site , contract values, dates, certification references, section identifiers, project codes , is set in mono. That single decision creates the technical-document feeling more than any other element, and it costs nothing.

Type scale: 1.25 ratio. Include one deliberately oversized display size used exactly twice on the site, for the founding year and the project count.

Body measure capped at 68 characters.

---

## Colour

Near-monochrome with one accent that is unexpected only because nobody in this sector uses it with restraint.

| Token | Value | Use |
|---|---|---|
| Ink | `#141413` | Text, rules, primary surfaces |
| Paper | `#F5F3EE` | Page background, warm not white |
| Steel | `#6E6E68` | Secondary text, rules, inactive states |
| Mist | `#DDDAD1` | Dividers, table zebra, borders |
| Signal | `#E2521B` | Accent. Active states, the live schematic branch, one CTA per page |

**Signal appears at most three times per viewport.** It is safety orange, it belongs in this world, and it stops working the moment it becomes decorative.

Photography is graded to a single cool-neutral treatment so it sits with the palette rather than fighting it. Plant rooms, switchboards, site work. No people posing.

---

## Motion language

**Nothing fades in.** Fade-up-on-scroll is the single most recognisable tell of a generated site.

Instead, things **plot**: reveals happen by clip-path or mask wipe, left to right, as if being drawn. Durations 600 to 900ms with a custom ease that starts fast and settles slowly, mimicking a plotter head.

- Section reveals: mask wipe, staggered by 80ms
- Hover states: instant, no transition. Mechanical, not soft.
- Page transitions: none. Speed is the feature.
- The schematic: scroll-linked, not time-linked.

Under `prefers-reduced-motion`, all reveals render immediately.

---

## Surface language

- **Radius: 0.** Everywhere. No rounded corners anywhere on the site.
- **Borders: 1px hairline in Mist.** No shadows, no elevation, ever.
- Tables use rules rather than cards.
- Images are hard-edged, full-bleed where possible.
- Generous vertical space, tight horizontal space. Dense but not cramped.

---

## The test

If you removed the logo and showed this to someone in building services, they should assume it was made by someone who understands their work. If you showed it to someone outside the industry, they should find it unexpectedly beautiful.

If either of those fails, something above has been diluted.
