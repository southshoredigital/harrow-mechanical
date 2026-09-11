# CLAUDE.md

Conventions for this project. Read this before writing any code. These rules override your defaults.

---

## Project context

- **Client:** Harrow Mechanical (concept project, fictional business)
- **Sector:** Commercial mechanical services contractor, Dandenong South
- **Package:** Studio, notional $8,000
- **Three adjectives:** Engineered. Unsentimental. Exact.
- **We are not:** corporate blue · aspirational · friendly · vague · decorated
- **Structural idea:** a persistent specification rail on the left, reading as a drawing title block, carrying the section index and contextual data for whatever is on screen
- **Memorable moment:** a scroll-plotted riser schematic on the capabilities page, SVG paths drawing themselves via `stroke-dashoffset` driven by ScrollTrigger
- **Primary conversion action:** an estimator views or downloads the capability statement

Read `docs/brief.md` and `docs/art-direction.md` before starting. Both are complete. If a design decision is not derivable from the art direction document, ask rather than inventing it.

**Audience order, which drives every structural decision:** head contractor estimators first, facility managers second, prospective employees third. An estimator spends under three minutes and is checking whether this firm is credible enough to invite to tender.

---

## Non-negotiables

1. **Never hardcode a design value.** Everything comes from `design/tokens.ts`. If a value is missing, add it to the token file first, then use it. A literal hex or px in a component is a bug.
2. **Never add a section that isn't in the content plan.** If a page looks thin, say so. Do not invent a testimonials block to fill space.
3. **Never use placeholder text.** Real content from `content/` or ask.
4. **Never install a package without asking.** The library set is fixed.
5. **Accessibility ships with the component**, not in a later pass.

---

## Project-specific rules

These override anything generic. They are what makes this site this site.

- **Border radius is zero everywhere.** No exceptions, including form inputs, buttons and images.
- **No shadows and no elevation at any level.** Separation is achieved with hairline rules in `color.border.hairline`.
- **Nothing fades in.** Reveals are clip-path or mask wipes, left to right, using `motion.ease.plotter`. If you are about to write an opacity transition on scroll, stop.
- **Every number on this site is set in mono.** Contract values, dates, certification references, section identifiers, project codes, staff counts, safety statistics. This is the strongest single element of the design language.
- **`color.signal` appears at most three times per viewport.** It is an accent, not a brand colour. Track it as you build.
- **`color.signal` is for headings, rules and active states only. Never body text.** It measures 3.47:1 against paper, which is AA for large text and fails for anything set small. If a sentence needs emphasis, restructure it or use `color.text.primary`. Secondary text is `color.text.secondary`, which clears 5:1.
- **`fontSize.hero` is used exactly twice on the entire site:** the founding year on the about page and the project count on the homepage. Nowhere else.
- **Hover states are instant.** `motion.hover` is 0. Mechanical, not soft.
- **Every claim carries a number, a date, a certification reference or a project name.** If copy could appear unchanged on a competitor's site, rewrite it.
- **No client logos anywhere** without written permission, which this concept does not have. Refer to head contractors generically.

---

## Structure

```
/                        homepage
/projects                filterable index: sector, system type, contract scale
/projects/[slug]         project detail with rail showing value, duration, systems
/capabilities            system-led, contains the riser schematic
/capabilities/[system]   mechanical, hydraulic, controls, commissioning, maintenance
/compliance              accreditations, insurance, ISO, safety statistics
/compliance/documents    document library, filterable, PDFs from public/documents
/careers                 roles, plain language
/careers/[role]
/about                   30 years told in numbers
/contact                 three separate paths: tender, service, careers
```


**Explicitly out of scope:** blog, news, social feeds, live chat. Do not build them or suggest them.

**Contact must not be one generic form.** Three distinct entry paths with different fields and different routing.

---

## The specification rail

- Fixed left column, `rail.width`, from the `lg` breakpoint up
- Carries: section identifier in mono, current section index, and page-contextual data
- On project pages: contract value, duration, sector, systems, completion year
- On capabilities: the system index, with the active system in `color.signal`
- Below `lg`: collapses to a sticky top strip, `rail.mobileHeight`, still carrying the section identifier
- Built once as `components/sections/SpecRail.tsx`, taking its content as props. Never fetches.

---

## The riser schematic

`components/sections/RiserSchematic.tsx`

- Layered SVG paths representing a building services riser: mechanical, hydraulic, controls, each as a branch
- Animated via `stroke-dashoffset`, driven by GSAP ScrollTrigger, scroll-linked rather than time-linked
- Branch labels appear only after their line lands, `schematic.labelDelay` after completion
- Active branch uses `schematic.strokeActive`, all others `schematic.strokeInactive`
- Wrapped in `gsap.matchMedia()`. Under `prefers-reduced-motion` the complete diagram renders immediately with no animation and must still read as a finished technical drawing
- Do not use a library for this. GSAP and an SVG.

---

## Stack

Fixed. Do not substitute.

Next.js App Router · TypeScript strict · Tailwind · shadcn/ui primitives (Radix) · GSAP + ScrollTrigger · Lenis · Motion for UI transitions · React Hook Form + Zod · Resend · Playwright

**Content lives in typed TS files under `content/`. There is no CMS on this build.** Import the typed arrays directly in server components. Never fetch content at runtime.

Lucide is installed as a shadcn dependency. Do not import from it. Icons come from Iconoir, and the five capability symbols are custom SVGs in `components/icons`.

Server components by default. `"use client"` only for state, effects or browser APIs, pushed as far down the tree as possible.

This is Next.js 16, which has breaking changes from earlier versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing routing, caching or data-fetching code rather than relying on training data.

---

## Typography

Self-hosted from `public/fonts`. Never a third-party CDN, never Adobe Fonts.

- Display and headings: Cabinet Grotesk (Fontshare)
- Body: Switzer (Fontshare)
- Data, labels, the rail: JetBrains Mono (OFL)

Body measure caps at `measure`. Type scale is 1.25 from a 16px base and no intermediate sizes may be introduced.

---

## Banned patterns

Do not produce these. If a layout you are about to build matches one, propose an alternative and explain the structural difference.

- Centred hero with headline, subhead and two buttons
- Three feature cards in a row with generic icons
- Any gradient, decorative or otherwise
- Default system sans as the display face
- Stock photography, particularly anything involving hard hats, handshakes or people at laptops
- Section headings that are single abstract nouns: "Solutions", "Innovation", "Excellence"
- Testimonial carousels
- Uniform border radius (here, any radius at all)
- Fade-up-on-scroll applied uniformly
- A "trusted by" logo strip
- Copy shaped like "Empowering businesses to..." or "Your trusted partner in..."
- Em dashes (—) and en dashes (–) anywhere in content or copy. Use a comma, a colon, a full stop, or restructure the sentence. Hyphens in compound words are fine. Curly quotes and apostrophes are banned too, straight ASCII only.

---

## Performance budget

- LCP under 2.0s on a mid-range mobile device
- CLS effectively zero: explicit dimensions on every image, `font-display: swap` with matched fallback metrics
- Total JS under 200KB gzipped on the homepage, animation stack under 40KB of that
- AVIF or WebP through the Next.js image pipeline

**Legibility on a phone in bright sunlight is a stated requirement**, not a nicety. The site office is a real usage context. Check contrast against that condition, not just against WCAG minimums.

---

## Accessibility

WCAG 2.1 AA throughout.

Semantic HTML first · keyboard operable with visible non-default focus states · alt text on meaningful images and empty alt on decorative ones · labelled inputs with errors tied via `aria-describedby` · sequential headings, one `h1` per page · colour never the sole carrier of meaning · skip link.

The schematic needs a text alternative describing the systems it shows.

---

## SEO

Unique title and description per page via `lib/seo` · canonical URLs · Open Graph and social image · JSON-LD `Organization`, `LocalBusiness`, `Service` and `BreadcrumbList` · sitemap entry · heading structure matching visual hierarchy.

**Target the system-type searches facility managers actually use**, not generic contractor terms. Chiller, AHU, BMS, hydronic, commissioning, plus building type and location.

---

## Forms

Three paths: tender enquiry, service call, careers. Different fields, different routing, different confirmation copy.

Validated client and server side with the same Zod schema · honeypot field for spam · sent via Resend and logged · designed success and error states.

---

## Testing

Playwright covering all three form paths and the capability statement download. Visual regression snapshots per section component. CI blocks a client review on a failing gate, not just a launch.

---

## Working style

- Read the brief and art direction before proposing anything.
- Ask one specific question when a requirement is ambiguous rather than guessing.
- Smallest change that solves the problem. Do not refactor adjacent code that wasn't part of the task.
- Do not modify files outside the scope of the request.
- When you finish, say what you changed and what you deliberately did not change.
- If a request conflicts with a rule in this file, say so before proceeding.
- `pnpm check-content` runs as part of the build and rejects em dashes, en dashes and curly quotes in `content/`. Write plain ASCII punctuation from the start rather than fixing it after a failed build.
- Read only the files needed for the specific task. Do not read `docs/brief.md` or `docs/art-direction.md` for small edits to existing components. Ask if you are unsure whether a file is relevant.
- Before any `git push`, run `pnpm build` and confirm it passes. Never push a failing build. Commit messages describe what changed, not which files were edited.