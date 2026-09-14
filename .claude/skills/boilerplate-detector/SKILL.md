---
name: boilerplate-detector
description: Scan every page of the Harrow Mechanical site for the banned patterns in CLAUDE.md (generated-site tells like centred heroes, three icon cards, gradients, shadows, radius, fade-ins, em dashes, vague copy, signal overuse, numbers not in mono) and report every flag. Use when asked to check for boilerplate, run the banned patterns check, or as part of a quality pass.
---

# Boilerplate detector

Finds the patterns that make a site read as generated or templated, as defined by the **Banned patterns** and **Project-specific rules** sections of `CLAUDE.md`. It reports; it does not fix. Every flag goes in the report, including ones you believe are acceptable, with your reasoning next to it.

The check has two halves, and both are required:

1. **The scanner** (`scan.mjs`), for everything that can be measured: rendered text, computed styles and source.
2. **The judgment pass**, for layout patterns a script cannot call reliably.

## 1. Run the scanner

Against a production build, never the dev server (dev injects an overlay and unminified code).

```sh
pnpm build
pnpm exec next start -p 3100          # leave running
node .claude/skills/boilerplate-detector/scan.mjs http://localhost:3100
```

It loads every route in the sitemap plus the review routes, at 1440 wide and at 390 wide, and writes `boilerplate-report.json` to the working directory as well as printing a table. Exit code is 1 if any `violation` is found.

What it checks, and the rule each comes from:

| Check | Severity | CLAUDE.md rule |
|---|---|---|
| Em dash, en dash, curly quotes in rendered text, titles, meta descriptions, alt text, aria labels, JSON-LD | violation | Banned patterns: dashes and curly quotes |
| Phrases like "empowering", "trusted partner", "solutions", "world-class", "seamless", "cutting-edge" | violation | Banned patterns: copy shaped like "Empowering businesses to..." |
| h1 to h3 that is a single abstract noun (Solutions, Innovation, Excellence, Services, Expertise, Quality, Overview...) | violation | Banned patterns: single abstract noun headings |
| Any other single word heading | review | Same rule; concrete nouns ("Scope", "Hydraulic") usually pass |
| `linear-gradient`, `radial-gradient`, `conic-gradient` in computed backgrounds, or gradient utilities in source | violation | No gradients |
| Computed `box-shadow`, `text-shadow`, `filter: drop-shadow`, or shadow utilities in source | violation | No shadows, no elevation |
| Non-zero computed `border-radius`, or `rounded-*` utilities in source (other than `rounded-none`) | violation | Border radius is zero everywhere |
| Elements at `opacity: 0` on load, `opacity` in a transition, fade animations, `autoAlpha`/`opacity` tweens in source | violation | Nothing fades in |
| Any non-zero `transition-duration` on an element with a hover style | violation | Hover states are instant |
| More than 3 elements painted in `color.signal` inside one viewport, at every scroll step | violation | Signal at most three times per viewport |
| `color.signal` as the text colour of body copy or of any text below `lg` | violation | Signal never sets body text |
| `fontSize.hero` anywhere other than the project count on `/` and the founding year on `/about`, or either missing | violation | Hero size used exactly twice |
| A run of text containing a digit whose computed face is not JetBrains Mono, except `fontSize.hero` numbers in the display face | violation | Every number is set in mono; hero numbers are the one exception |
| Paragraphs of 60+ characters with no digit, standard reference, or project name | review | Every claim carries a number, date, reference or project name |
| `<img>` whose src or alt suggests a logo (other than the Harrow logo), stock source, or banned subject (hard hat, handshake, laptop, team) | violation | No client logos; no stock photography |
| Text matching testimonial, carousel, "trusted by", "our clients" | violation | No testimonial carousels, no logo strip |
| Imports from `lucide-react` | violation | Icons come from Iconoir and components/icons |
| Hex colours or px values written into components (`app/`, `components/`) | violation | Never hardcode a design value |

## 2. The judgment pass

Screenshot every content route at 1440 and 390 (the scanner saves them to `boilerplate-shots/`). Look at each one against this list. For each, answer yes or no per page, and for every yes write down the element and why.

- **Centred hero with headline, subhead and two buttons.** Is the first screen a centred text block with a pair of calls to action? The opening should be asymmetric against the rail.
- **Three feature cards in a row with generic icons.** Any row of exactly three equal boxes, each an icon, a heading and a sentence? Also check four and five card rows that do the same job: the count is not the point, the interchangeable card is.
- **Stock photography.** Does any image show people posing, hard hats, handshakes, laptops or skylines? Plant rooms, switchboards and site work only.
- **Testimonial carousel or quote block.**
- **"Trusted by" logo strip**, or any row of client or partner marks.
- **Fade-up on scroll applied uniformly.** Scroll each page with motion on. Anything that appears by fading or rising rather than a left to right wipe is a flag.
- **Default system sans in a display role.** Any heading that is not Cabinet Grotesk.
- **Copy that could appear unchanged on a competitor's site.** Read every heading and every paragraph flagged `review` by the scanner. If you could swap the company name and it would still be true of any contractor, flag it.
- **Decoration.** Any element that carries no information and exists for visual interest.
- **A section that is not in the content plan** (`CLAUDE.md` Structure, and the page lists in `docs/BUILD-PLAN.md`).

## 3. Report

Report every flag. Do not drop a flag because it seems minor, and do not fix anything unless asked.

Group by page, then by severity. For each flag give:

- the page and viewport
- the element (selector or the text itself)
- the rule from `CLAUDE.md` it matches
- `violation` or `review`
- for a violation, a proposed alternative **and the structural difference** it makes, as `CLAUDE.md` asks ("propose an alternative and explain the structural difference")
- for a review item you judge acceptable, one line on why

Finish with the counts: violations, review items, pages with no flags. If a check could not run (server not up, route errored), say so rather than reporting it as clean.
