import {
  Commissioning,
  Controls,
  Hydraulic,
  Maintenance,
  Mechanical,
} from "@/components/icons"
import {
  border,
  breakpoint,
  color,
  focus,
  font,
  fontLeading,
  fontSize,
  fontWeight,
  layout,
  letterSpacing,
  lineHeight,
  measure,
  motion,
  radius,
  rail,
  schematic,
  sectionSpacing,
  signalBudgetPerViewport,
  space,
} from "@/design/tokens"

import { PlotterReveal } from "./PlotterReveal"

/**
 * Internal reference sheet. Every value on this page is read from
 * design/tokens.ts at build time, so it cannot drift from the tokens it
 * documents. Not part of the content plan, remove before launch.
 *
 * The three per viewport signal budget does not apply here: this page exists
 * to show the accent, not to use it.
 */

/* -------------------------------------------------------------------------- */
/* Contrast, computed. Bright sunlight on site is a stated requirement, so the */
/* numbers are on the page rather than in a report nobody opens.               */
/* -------------------------------------------------------------------------- */

function channelToLinear(value: number) {
  const channel = value / 255
  return channel <= 0.03928
    ? channel / 12.92
    : Math.pow((channel + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string) {
  const int = Number.parseInt(hex.slice(1), 16)
  const r = channelToLinear((int >> 16) & 255)
  const g = channelToLinear((int >> 8) & 255)
  const b = channelToLinear(int & 255)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(foreground: string, background: string) {
  const a = relativeLuminance(foreground)
  const b = relativeLuminance(background)
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}

/* -------------------------------------------------------------------------- */
/* Page furniture                                                             */
/* -------------------------------------------------------------------------- */

function Section({
  index,
  title,
  note,
  children,
}: {
  index: string
  title: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-[var(--spacing-section-compact)] border-t border-border-strong pt-6">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-label uppercase text-text-secondary">
          {index}
        </span>
        <h2 className="font-display text-xl tracking-display">
          {title}
        </h2>
      </div>
      {note ? (
        <p className="mt-3 max-w-[var(--measure)] font-body text-sm text-text-secondary">
          {note}
        </p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-xs tracking-label uppercase text-text-secondary">
      {children}
    </h3>
  )
}

function SpecList({ rows }: { rows: readonly (readonly [string, string])[] }) {
  return (
    <dl className="border-t border-border-hairline font-mono text-xs">
      {rows.map(([key, value]) => (
        <div
          key={key}
          className="grid grid-cols-2 gap-4 border-b border-border-hairline py-3"
        >
          <dt className="tracking-label uppercase text-text-secondary">{key}</dt>
          <dd className="tracking-mono text-text-primary">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

const FACES = [
  {
    id: "display",
    name: "Cabinet Grotesk",
    role: "Display and headings",
    family: font.display,
    tracking: letterSpacing.display,
    specimens: {
      small: "Mechanical, hydraulic, controls",
      large: "Commissioning",
      hero: "1994",
    },
  },
  {
    id: "body",
    name: "Switzer",
    role: "Body",
    family: font.body,
    tracking: letterSpacing.body,
    specimens: {
      small: "Chilled water, AHU, BMS, hydronic heating",
      large: "Commissioning",
      hero: "1994",
    },
  },
  {
    id: "mono",
    name: "JetBrains Mono",
    role: "Data, labels, the rail",
    family: font.mono,
    tracking: letterSpacing.mono,
    specimens: {
      small: "AHU-04 / 2.4 MW / 1994",
      large: "$4,200,000",
      hero: "1994",
    },
  },
] as const

const LARGE_SIZES = ["2xl", "3xl", "4xl"]

function specimenFor(face: (typeof FACES)[number], sizeKey: string) {
  if (sizeKey === "hero") return face.specimens.hero
  if (LARGE_SIZES.includes(sizeKey)) return face.specimens.large
  return face.specimens.small
}

/* -------------------------------------------------------------------------- */
/* Colour                                                                     */
/* -------------------------------------------------------------------------- */

// The token file is `as const`, so its entries widen here before they can be
// narrowed back into the two shapes the palette renders: flat values and
// semantic groups.
const COLOUR_ENTRIES: readonly (readonly [string, unknown])[] =
  Object.entries(color)

const BASE_COLOURS = COLOUR_ENTRIES.filter(
  (entry): entry is [string, string] => typeof entry[1] === "string"
)

const SEMANTIC_GROUPS = COLOUR_ENTRIES.filter(
  (entry): entry is [string, Record<string, string>] =>
    typeof entry[1] === "object" && entry[1] !== null
)

const CONTRAST_PAIRS = [
  ["text.primary on surface.page", color.text.primary, color.surface.page],
  ["text.secondary on surface.page", color.text.secondary, color.surface.page],
  ["text.accent on surface.page", color.text.accent, color.surface.page],
  ["text.primary on surface.subtle", color.text.primary, color.surface.subtle],
  ["text.inverse on surface.inverse", color.text.inverse, color.surface.inverse],
  ["text.accent on surface.inverse", color.text.accent, color.surface.inverse],
  ["status.error on surface.page", color.status.error, color.surface.page],
] as const

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div>
      <div
        className="h-24 border border-border-hairline"
        style={{ backgroundColor: value }}
      />
      <p className="mt-2 font-mono text-xs tracking-label uppercase text-text-primary">
        {name}
      </p>
      <p className="font-mono text-xs tracking-mono text-text-secondary">
        {value}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

const ICONS = [
  { name: "Mechanical", Icon: Mechanical },
  { name: "Hydraulic", Icon: Hydraulic },
  { name: "Controls", Icon: Controls },
  { name: "Commissioning", Icon: Commissioning },
  { name: "Maintenance", Icon: Maintenance },
] as const

const ICON_SIZES = [32, 48] as const

/* -------------------------------------------------------------------------- */

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-[var(--layout-max)] px-[var(--layout-gutter)] py-16 lg:px-[var(--layout-gutter-wide)]">
      <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
        Styleguide / internal reference / not in the content plan
      </p>
      <h1 className="mt-4 font-display text-3xl tracking-display">
        Design tokens
      </h1>
      <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
        Every value below is read from design/tokens.ts at build time. If a
        value is wrong here it is wrong in the token file, which is the only
        place it can be fixed.
      </p>

      <Section
        index="01"
        title="Type scale"
        note="Ratio of 1.25 from a 16px base, no intermediate sizes. Every size carries its own leading, so a bare text utility never inherits a framework default. Each specimen is set at the tracking its face carries and the leading its size carries."
      >
        <div className="flex flex-col gap-16">
          {FACES.map((face) => (
            <div key={face.id}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border-strong pb-3">
                <Subhead>{face.id}</Subhead>
                <span className="font-mono text-xs tracking-mono text-text-primary">
                  {face.name}
                </span>
                <span className="font-mono text-xs tracking-mono text-text-secondary">
                  {face.role}
                </span>
              </div>

              {Object.entries(fontSize).map(([key, value]) => (
                <div key={key} className="border-b border-border-hairline py-6">
                  <div className="flex flex-wrap items-baseline gap-4 font-mono text-xs">
                    <span className="tracking-label uppercase text-text-secondary">
                      {key}
                    </span>
                    <span className="tracking-mono text-text-secondary">
                      {value}
                    </span>
                    <span className="tracking-mono text-text-secondary">
                      leading {fontLeading[key as keyof typeof fontSize]}
                    </span>
                    {key === "hero" ? (
                      <span className="tracking-mono text-text-accent">
                        Twice on the site, nowhere else
                      </span>
                    ) : null}
                  </div>
                  <p
                    className="mt-3 overflow-hidden"
                    style={{
                      fontFamily: face.family,
                      fontSize: value,
                      lineHeight: fontLeading[key as keyof typeof fontSize],
                      letterSpacing: face.tracking,
                    }}
                  >
                    {specimenFor(face, key)}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2">
          <div>
            <Subhead>Weights</Subhead>
            <div className="mt-4">
              {Object.entries(fontWeight).map(([key, value]) => (
                <p
                  key={key}
                  className="border-b border-border-hairline py-3 font-body text-md"
                  style={{ fontWeight: value }}
                >
                  {key} {value}, commissioning and maintenance
                </p>
              ))}
            </div>
          </div>

          <div>
            <Subhead>Leading</Subhead>
            <div className="mt-4">
              {Object.entries(lineHeight).map(([key, value]) => (
                <div key={key} className="border-b border-border-hairline py-3">
                  <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
                    {key} {value}
                  </p>
                  <p
                    className="mt-2 max-w-[var(--measure)] font-body text-sm"
                    style={{ lineHeight: value }}
                  >
                    Chilled water reticulation, air handling plant and building
                    management system integration across an occupied hospital.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <Subhead>Tracking</Subhead>
          <div className="mt-4">
            {Object.entries(letterSpacing).map(([key, value]) => (
              <p
                key={key}
                className="border-b border-border-hairline py-3 font-mono text-sm uppercase"
                style={{ letterSpacing: value }}
              >
                {key} {value} / commissioning 1994
              </p>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Subhead>Measure, {measure}</Subhead>
          <p className="mt-4 max-w-[var(--measure)] border-l border-border-accent pl-4 font-body text-base">
            Body copy caps here. Harrow Mechanical was founded in 1994 and runs
            58 staff out of Dandenong South, delivering contracts between
            $400,000 and $4.2 million across health, education, data centre,
            industrial and commercial office work. This paragraph exists to show
            where the line breaks, which is the only thing a measure token does.
          </p>
        </div>
      </Section>

      <Section
        index="02"
        title="Colour palette"
        note={`Near monochrome with one accent. Signal appears at most ${signalBudgetPerViewport} times per viewport on a real page: it is an accent, not a brand colour.`}
      >
        <Subhead>Base</Subhead>
        <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {BASE_COLOURS.map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>

        {SEMANTIC_GROUPS.map(([group, values]) => (
          <div key={group} className="mt-12">
            <Subhead>{group}</Subhead>
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {Object.entries(values).map(([name, value]) => (
                <Swatch key={name} name={`${group}.${name}`} value={value} />
              ))}
            </div>
          </div>
        ))}

        <div className="mt-16">
          <Subhead>Contrast, measured</Subhead>
          <p className="mt-3 max-w-[var(--measure)] font-body text-sm text-text-secondary">
            Legibility on a phone in bright sunlight is a stated requirement.
            WCAG AA is 4.5:1 for body text and 3:1 for large text, and secondary text
            here is held to 5:1 rather than the minimum. Signal clears large
            text only, which is why it never sets body copy.
          </p>
          <dl className="mt-6 border-t border-border-hairline font-mono text-xs">
            {CONTRAST_PAIRS.map(([label, foreground, background]) => {
              const ratio = contrastRatio(foreground, background)

              return (
                <div
                  key={label}
                  className="grid grid-cols-2 gap-4 border-b border-border-hairline py-3 sm:grid-cols-3"
                >
                  <dt className="tracking-mono text-text-secondary">{label}</dt>
                  <dd className="tracking-mono text-text-primary">
                    {ratio.toFixed(2)}:1
                  </dd>
                  <dd className="tracking-label uppercase text-text-secondary">
                    {ratio >= 4.5
                      ? "AA body and large"
                      : ratio >= 3
                        ? "AA large only"
                        : "Fails AA"}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </Section>

      <Section
        index="03"
        title="Spacing scale"
        note="Base unit 4px. Generous vertical space, tight horizontal space."
      >
        <div>
          {Object.entries(space).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center gap-4 border-b border-border-hairline py-2"
            >
              <span className="w-[3ch] font-mono text-xs tracking-mono text-text-secondary">
                {key}
              </span>
              <span className="w-[5ch] font-mono text-xs tracking-mono text-text-secondary">
                {value}
              </span>
              <span
                className="h-3 bg-ink"
                style={{ width: value, minWidth: space.px }}
              />
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Subhead>Section spacing</Subhead>
          <div className="mt-4">
            <SpecList
              rows={Object.entries(sectionSpacing).map(
                ([key, value]) => [key, value] as const
              )}
            />
          </div>
        </div>

        <div className="mt-12">
          <Subhead>Layout and rail</Subhead>
          <div className="mt-4">
            <SpecList
              rows={[
                ["layout.maxWidth", layout.maxWidth],
                ["layout.gutter", layout.gutter],
                ["layout.gutterWide", layout.gutterWide],
                ["layout.gridColumns", String(layout.gridColumns)],
                ["rail.width", rail.width],
                ["rail.widthWide", rail.widthWide],
                ["rail.mobileHeight", rail.mobileHeight],
                ["rail.mobileIndexHeight", rail.mobileIndexHeight],
                ["rail.mobileTotalHeight", rail.mobileTotalHeight],
                ...Object.entries(breakpoint).map(
                  ([key, value]) => [`breakpoint.${key}`, value] as const
                ),
              ]}
            />
          </div>
        </div>
      </Section>

      <Section
        index="04"
        title="Border treatments"
        note="Separation is a hairline rule. There is no shadow token because there is no elevation, at any level, anywhere."
      >
        <div className="grid gap-8 sm:grid-cols-3">
          {Object.entries(border).map(([key, value]) => (
            <div key={key}>
              <div
                className="flex h-24 items-center justify-center bg-surface-subtle"
                style={{ border: value, borderRadius: radius }}
              >
                <span className="font-mono text-xs tracking-label uppercase text-text-secondary">
                  {key}
                </span>
              </div>
              <p className="mt-2 font-mono text-xs tracking-mono text-text-secondary">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <SpecList
            rows={[
              ["radius", radius],
              ["shadow", "None. The token object is deliberately empty."],
              ["focus.color", focus.color],
              ["focus.width", focus.width],
              ["focus.offset", focus.offset],
              ["schematic.strokeWidth", String(schematic.strokeWidth)],
              [
                "schematic.strokeWidthActive",
                String(schematic.strokeWidthActive),
              ],
              ["schematic.strokeInactive", schematic.strokeInactive],
              ["schematic.strokeActive", schematic.strokeActive],
              ["schematic.labelDelay", `${schematic.labelDelay}ms`],
            ]}
          />
        </div>

        <div className="mt-12">
          <Subhead>Focus</Subhead>
          <p className="mt-3 max-w-[var(--measure)] font-body text-sm text-text-secondary">
            Tab to the control below. The ring is signal at {focus.width},
            offset {focus.offset}, and is never the browser default.
          </p>
          <button
            type="button"
            className="focus-ring mt-4 border border-border-strong px-4 py-2 font-mono text-xs tracking-label uppercase text-text-primary hover:bg-surface-inverse hover:text-text-inverse"
          >
            Focusable sample
          </button>
        </div>
      </Section>

      <Section
        index="05"
        title="Capability symbols"
        note="Five custom symbols on a 48 unit grid at a uniform stroke, shown at the two sizes they run at."
      >
        <div className="flex flex-col gap-12">
          {ICON_SIZES.map((size) => (
            <div key={size}>
              <Subhead>{size}px</Subhead>
              <div className="mt-4 flex flex-wrap items-end gap-12">
                {ICONS.map(({ name, Icon }) => (
                  <div key={name} className="flex flex-col items-center gap-3">
                    <Icon
                      className="text-ink"
                      style={{ width: size, height: size }}
                    />
                    <span className="font-mono text-xs tracking-mono text-text-secondary">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        index="06"
        title="Motion, the plotter reveal"
        note="Nothing fades. Reveals are a clip-path wipe left to right on the plotter ease, staggered so a group draws in sequence. Hover is instant, which is why the hover duration is zero rather than short."
      >
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Subhead>Values</Subhead>
            <div className="mt-4">
              <SpecList
                rows={[
                  ["ease.plotter", motion.ease.plotter],
                  ["ease.linear", motion.ease.linear],
                  ["duration.instant", `${motion.duration.instant}ms`],
                  ["duration.reveal", `${motion.duration.reveal}ms`],
                  ["duration.revealSlow", `${motion.duration.revealSlow}ms`],
                  ["stagger", `${motion.stagger}ms`],
                  ["hover", `${motion.hover}ms`],
                  ["scroll.lerp", String(motion.scroll.lerp)],
                ]}
              />
            </div>
          </div>

          <div>
            <Subhead>Demonstrated</Subhead>
            <div className="mt-4">
              <PlotterReveal />
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
