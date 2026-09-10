---
name: icon-set
description: Generate a bespoke set of consistent SVG icon components as hand-written React code, on a shared grid with uniform stroke weight, plus a review route for checking optical consistency. Use when a project needs custom icons, technical symbols, drawing conventions, or any geometric mark set, instead of installing an icon library or generating raster images.
---

# Icon set

## When this applies

Use this whenever a project needs icons that are not from a library.

**Good fits:** technical or industry drawing conventions, sector-specific symbols, custom navigation or feature icons, diagram primitives, any geometric mark set.

**Not a fit:** organic illustration, anything with texture or gradient, anything with a hand-drawn quality. Those need a generator or an illustrator.

The rule: **if it can be described as coordinates, write it as code.** Image generators approximate geometry and produce sets whose members do not belong to each other. Hand-written SVG on a shared grid is consistent by construction, versioned, editable by adjusting a number, and inherits colour from CSS.

## Why not an icon library

Every project using the same library shares its icon voice. Lucide ships with shadcn, so it is on a large share of new sites. A bespoke set is a cheap, visible differentiator, and at 20 minutes it costs less than choosing between libraries.

## Before starting

Read the project's art direction document and design tokens. The icon set inherits from them: stroke weight relates to the type weight and rule weight, corner treatment follows the surface language, and any curve allowance follows whatever the art direction says about geometry.

Ask the user for anything not derivable:

1. **Stroke width** and the grid unit
2. **viewBox size**, default 48x48
3. **Cap and join style**, default square and miter for technical work, round for softer directions
4. **The list of symbols**, with a one-line description of each
5. Whether any **real-world drawing convention** applies. If the sector has standard symbols, use them. An audience that reads drawings recognises a convention instantly and spots an invented approximation just as fast.

## Constraints, applied identically to every symbol

These are what make a set look like a set.

- Fixed viewBox, same for all
- Fixed padding inside it, so nothing sits flush to the edge
- **Every coordinate lands on the grid unit.** No exceptions. This is the single most important rule.
- One `stroke-width` across the whole set
- One cap style and one join style
- `fill="none"` unless a symbol genuinely requires a filled element
- `stroke="currentColor"`, never a hardcoded colour, so the icon inherits from context
- Right angles only, unless a convention requires a circle or triangle

## Component shape

One file per symbol in `components/icons/`, each a named export in PascalCase.

Each component:

- Accepts `className` and spreads remaining props onto the `svg`
- Sets `width` and `height` to `1em` so it scales with font size
- Includes a `<title>` element with an `id`, referenced by `aria-labelledby`
- Takes an optional `title` prop so the label can be overridden per use
- Is a server component, no `"use client"`

Also produce `components/icons/index.ts` re-exporting all of them.

## The review route

Always create a temporary route at `/icons` rendering the full set:

- Every symbol at 32px, 48px and 96px
- On the project's page background colour, not white
- Names beneath each, in the project's mono face if it has one
- One row showing all symbols at 32px together, which is where inconsistency shows up

Tell the user to delete this route before launch, or keep it behind a path the client never sees.

**The test to describe to the user:** view the 32px row and squint. Any symbol that reads noticeably denser or lighter than its neighbours needs rework. Optical weight matters more than mathematical consistency, and it is the thing that separates a set from a collection.

## Iteration

Expect two or three rounds. The user gives feedback in plain terms and you adjust coordinates:

- "The pump circle is too small relative to the others"
- "Commissioning reads lighter than the rest"
- "The valve is too wide"

Change numbers, not approach. If a symbol needs a different stroke width to look right, the problem is its density rather than its weight: remove an internal element instead.

## Common drawing conventions

Where a sector has real symbols, use them. A partial reference:

**Building services and mechanical**
- Pump: circle containing a triangle pointing in the flow direction
- Valve, isolation: two triangles meeting point to point
- Gauge or test point: circle on a stem rising from a line
- Air handling unit: rectangle with internal parallel lines as a coil, duct stubs each side
- Fan: circle with an internal chord or blade indication
- Damper: rectangle with a diagonal line across it

**Electrical**
- Switchboard: rectangle with a vertical division
- Transformer: two overlapping circles
- Earth: horizontal lines of decreasing width on a stem

**Controls and instrumentation**
- Controller: square or square with rounded ends depending on the ISA convention
- Sensor: small circle on a branch line
- Signal line: dashed, versus solid for process

**Structural and civil**
- Section cut: heavy line with direction arrows
- Level marker: triangle on a line
- Contour: nested closed curves

If unsure whether a convention exists for a given symbol, say so rather than inventing one, and ask the user to confirm. Getting a convention wrong is worse than using a plainer generic form, because the audience who notices is the audience the site is for.

## Output summary

Report back with:

- Files created
- The shared constraints used
- Any symbol you were unsure about, and why
- A reminder to check the 32px row before accepting the set
