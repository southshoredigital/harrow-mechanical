# Harrow Mechanical — build plan

**Total:** 13 to 16 hours across 7 sessions
**Prerequisites, all complete:** token pipeline, self-hosted fonts, typed content in `content/`, logo in `public/`, five icons in `components/icons/`, ten graded photographs in `public/images/`.

---

## How to parse a build into sessions

Three rules that make the difference between a clean build and a long one.

1. **One session, one vertical slice.** Each session produces something you could show a client. A session that ends with nothing viewable is a session you cannot evaluate.
2. **Structure before surface, once.** Session 1 establishes the design system and shell. After that, never revisit it mid-build. If session 4 wants to change the type scale, that is a signal the tokens were wrong, and you fix the tokens rather than working around them.
3. **The memorable moment goes early, not last.** Session 2. Left to the end it gets cut when time runs short, which is exactly backwards, because it is the thing that gets the site referred.

`/clear` between sessions. Commit at every working state.

**Model guidance.** Bigger model where the shape of the solution is uncertain, smaller where you are filling in an established pattern.

| Session | Model |
|---|---|
| 1, design system and rail | Opus, high effort |
| 2, riser schematic | Opus, high effort |
| 3, homepage | Sonnet, Opus if it drifts |
| 4, projects and filtering | Opus |
| 5, capabilities, compliance, careers | Sonnet |
| 6, about and forms | Sonnet |
| 7, gates and fixes | Opus |

---

## Session 1: design system and shell (3 hours)

> Read `docs/brief.md`, `docs/art-direction.md`, `design/tokens.ts` and `CLAUDE.md`.
>
> The token pipeline already works: `design/tokens.ts` generates `app/tokens.css` via `pnpm tokens`, and `app/globals.css` imports it. Fonts are self-hosted and loaded in `app/fonts.ts`. Do not rebuild any of that.
>
> Build three things:
>
> 1. `components/sections/SpecRail.tsx` — the persistent left rail described in `CLAUDE.md`. Takes its content as props, never fetches. Fixed left column at `lg` and above, collapsing to a sticky top strip below that. Section identifier and contextual data in mono.
>
> 2. The root layout using the rail, with Lenis smooth scroll configured and driving ScrollTrigger rather than both listening to scroll independently.
>
> 3. A `/styleguide` route rendering every token: the full type scale in all three faces, the colour palette with names, the spacing scale, border treatments, the five icons from `components/icons` at 32px and 48px, and the plotter reveal motion demonstrated on a sample block.
>
> Do not build any page content yet. Report what you changed and anything in the tokens you found incomplete.

**Why the styleguide route:** it makes the design system visible before any page exists, so a wrong type scale surfaces in session 1 rather than session 5. Delete it before launch or keep it behind a path the client never sees.

**Done when:** `/styleguide` renders correctly, the rail behaves at every breakpoint, and nothing on screen uses a value outside the token file.

---

## Session 2: the memorable moment (2 hours)

> Build `components/sections/RiserSchematic.tsx` per the specification in `CLAUDE.md`.
>
> The SVG shows a simplified building services riser across six levels, with three branches: mechanical supply and return air, hydraulic, and controls. Draw it as a technical line diagram, not an illustration. Include level markers and branch labels in mono. Match the stroke weight and grid discipline of the icons in `components/icons`.
>
> Animate with GSAP ScrollTrigger driving `stroke-dashoffset`, scroll-linked rather than time-linked. Each branch completes as its section enters the viewport. Branch labels appear `schematic.labelDelay` after their line lands. Only the active branch uses `schematic.strokeActive`.
>
> Wrap in `gsap.matchMedia()`. Under `prefers-reduced-motion`, render the complete diagram immediately with no animation. Provide a text alternative describing the systems shown.
>
> Put it on a temporary route so I can review it in isolation.

**Done when:** it plots convincingly on scroll, reads as a finished technical drawing when static, and works with reduced motion on.

---

## Session 3: homepage (2 hours)

> Build the homepage. The audience is a head contractor estimator with under three minutes who is deciding whether to invite this firm to tender.
>
> Structure:
> - Opening: what Harrow does, at what scale, in which sectors. No hero video, no centred headline with two buttons. The structural idea is the rail, so let the opening be asymmetric against it.
> - The project count set in `fontSize.hero`. This is one of only two uses of that size on the site.
> - The six featured projects from `content/projects.ts`, linking to the index. Sector, system type and contract scale visible on each, all in mono.
> - Capability summary by system using the icons in `components/icons`, linking through.
> - Accreditation strip from `content/accreditations.ts`, current and specific.
> - Capability statement as the primary conversion action.
>
> Use real content from `content/`. No section that is not listed above. Four of the ten images are portrait, noted in `content/projects.ts`, so layouts must handle both orientations.

**Done when:** you would send it to a client.

---

## Session 4: projects (2.5 hours)

> Build `/projects` and `/projects/[slug]`.
>
> The index filters by sector, system type and contract scale, using the `SECTORS`, `SYSTEMS` and `SCALES` constants and the `scaleOf` helper in `content/types.ts`. Filtering happens client side, updates the URL so a filtered view is shareable, and works without JavaScript for the unfiltered view. Results are a dense table-like grid using hairline rules, not cards.
>
> The detail page uses `SpecRail` to carry contract value, duration, sector, systems and completion year. Structure: the brief, the systems installed, the constraints, the outcome. Photography full-bleed and hard-edged, handling both portrait and landscape sources.
>
> Every figure in mono using `formatValue` and `formatMonthYear`. No client logos.

**Done when:** filtering is fast, the URL is shareable, and a project page reads like a job record rather than a marketing page.

---

## Session 5: capabilities, compliance, careers (2 hours)

> Build three sections from `content/`.
>
> `/capabilities` leads with `RiserSchematic`, then the five capabilities, each linking to `/capabilities/[slug]`. The rail carries the system index with the active system in `color.signal`. Use the matching icon from `components/icons` for each.
>
> `/compliance` displays accreditations, insurance currency and safety statistics as data, not prose. `/compliance/documents` is the document library: a filterable list from `content/documents.ts` with file type, size and issue date in mono, using `formatFileSize`. PDFs live in `public/documents`.
>
> `/careers` and `/careers/[slug]` from `content/roles.ts`. Plain language, written for a tradesperson rather than a recruiter.

**Done when:** every document downloads and the capability pages read as specification rather than marketing.

---

## Session 6: about, contact, forms (1.5 hours)

> Build `/about` and `/contact`.
>
> About tells thirty years in numbers. The founding year uses `fontSize.hero`, the second and last use of that size on the site.
>
> Contact has three separate paths with different fields, routing and confirmation copy: tender enquiry, service call, careers. Not one generic form.
>
> Each validated client and server side with the same Zod schema, a honeypot field for spam, sent via Resend, logged. Designed success and error states, never browser defaults. `RESEND_API_KEY` is already in `.env.local` and in Vercel for production and preview.

**Done when:** all three forms submit end to end and you have received all three notification emails.

---

## Session 7: gates and finish (2.5 hours)

> Run the full quality pass.
>
> 1. SEO: metadata and JSON-LD across every route, sitemap, robots, social image via `next/og`. Target system-type search terms per `CLAUDE.md`, not generic contractor terms. Keep `robots: { index: false }` since this is a concept.
> 2. Performance: hit the budget in `CLAUDE.md`. Report LCP, CLS and total JS for the homepage and the projects index.
> 3. Accessibility: full axe pass, keyboard walkthrough of every interactive element, contrast checked against bright-sunlight legibility, text alternative on the schematic.
> 4. Playwright: all three form paths and the capability statement download. Visual regression snapshots per section.
> 5. Run the `boilerplate-detector` skill across every page and report every flag.
>
> List anything you could not fix and why.

Then, by hand:

- Test on a real phone, outdoors, on mobile data
- Test in Safari
- Add the persistent concept bar: *Concept project by Southshore Digital. Harrow Mechanical is a fictional business.*
- Attach `harrow.southshoredigital.com.au` in Vercel and add the CNAME wherever your DNS lives
- Capture portfolio screenshots at 1440 and 390 while it is fresh
- Record the schematic plotting, which is the best single social asset
- Write the case study

**Done when:** every gate is green and the case study is written. The site is not the deliverable, the case study is.

---

## What to watch for

**The drift signal.** When Claude Code proposes something outside the tokens, that is information. Either the token file is incomplete or the agent is reverting to its defaults. Fix the tokens. Never accept the drift, because the second time is much easier than the first.

**The thinning signal.** If a page feels empty and you are tempted to add a section, check the content plan first. Empty usually means the content is thin, and the fix is content, not another block.

**Hours.** Log them against the project row in the tracker. This concept is your calibration data, and every quote you give afterwards depends on that number being real.

---

## Why a paid Studio project still takes 45 to 60 hours

Agent-assisted building compresses the build, not the project. A real Studio job at $6,500 to $9,500 breaks down roughly like this:

| Activity | Hours | Compressed by Claude Code? |
|---|---|---|
| Discovery, brief, confirmation | 4 | No |
| Art direction and tokens | 3 | Partly |
| Build | 12 to 16 | Yes, heavily |
| Content development | 8 | Partly |
| Client comms, meetings, revisions | 8 | No |
| Quality gates and fixes | 4 | Partly |
| Launch, handover, training | 4 | No |
| Proposal, admin, invoicing | 3 | No |
| **Total** | **46 to 50** | |

Build is about a third. Halving it moves the total by roughly 15%, not 60%.

**Do not quote off the concept numbers.** If you price a $6,500 project against 25 hours because the code is fast, and content and client comms deliver 48, your effective rate halves and you will not notice until the third project. The leverage shows up as more projects a year at the same hours, or more design iteration per project. Not as a lower price.
