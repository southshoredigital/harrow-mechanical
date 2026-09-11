import Link from "next/link"

import { RailIndex, RailSheet, RailCurrent } from "./SpecRailIndex"

/**
 * One entry in the section index. Numbering is derived from array order,
 * so the index cannot disagree with itself.
 */
export type RailSection = {
  label: string
  href: string
}

/** A contextual fact. Rendered label over value, both mono. */
export type RailDatum = {
  label: string
  value: string
}

export type SpecRailProps = {
  /** Title block masthead. Links home. */
  identifier: string
  /** Top level section index. Passed in, never fetched. */
  sections: readonly RailSection[]
  /**
   * Page contextual data. Contract value, duration, sector, systems on a
   * project; the system index on capabilities. Omitted where there is no
   * context to carry rather than filled with something invented.
   */
  data?: readonly RailDatum[]
}

/**
 * The specification rail.
 *
 * Fixed left column from lg up, reading as a drawing title block. Below lg
 * it collapses to a sticky single line strip carrying the identifier and the
 * current section. Everything in it is mono, per the art direction.
 *
 * Pure presentation: it takes all of its content as props and never fetches.
 */
export function SpecRail({ identifier, sections, data }: SpecRailProps) {
  return (
    <>
      {/*
        Below lg the rail becomes two sticky lines, both in flow so neither
        ever covers content: the identifier strip, then the section index.
      */}
      <div className="sticky top-0 z-40 flex h-[var(--rail-mobile-height)] items-center justify-between gap-4 border-b border-border-hairline bg-surface-page px-4 font-mono text-xs tracking-label uppercase lg:hidden">
        <Link href="/" className="focus-ring text-text-primary">
          {identifier}
        </Link>
        <RailCurrent sections={sections} />
      </div>

      {/*
        The index scrolls horizontally and is deliberately clipped at the right
        edge rather than faded or arrowed: a gradient is banned and an arrow
        carries no information the cut item does not already carry.
      */}
      <nav
        aria-label="Sections"
        className="sticky top-[var(--rail-mobile-height)] z-40 border-b border-border-hairline bg-surface-page pl-4 font-mono text-xs tracking-label uppercase lg:hidden"
      >
        <RailIndex sections={sections} orientation="row" />
      </nav>

      {/* lg and up: fixed rail. */}
      <aside
        aria-label="Specification"
        className="fixed inset-y-0 left-0 z-40 hidden w-[var(--rail-width)] flex-col border-r border-border-hairline bg-surface-page px-4 py-6 font-mono text-xs tracking-label uppercase lg:flex"
      >
        <Link
          href="/"
          className="focus-ring block text-text-primary"
        >
          {identifier}
        </Link>

        <nav
          aria-label="Sections"
          className="mt-8 border-t border-border-hairline pt-4"
        >
          <RailIndex sections={sections} />
        </nav>

        {data && data.length > 0 ? (
          <dl className="mt-8 border-t border-border-hairline pt-4">
            {data.map((datum) => (
              <div key={datum.label} className="mt-3 first:mt-0">
                <dt className="text-text-secondary">{datum.label}</dt>
                <dd className="mt-1 normal-case tracking-mono text-text-primary">
                  {datum.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-auto pt-8 text-text-secondary">
          <RailSheet sections={sections} />
        </div>
      </aside>
    </>
  )
}
