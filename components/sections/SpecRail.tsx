import Link from "next/link"

import { LogoImage } from "@/components/typography/LogoImage"
import type { LogoAsset } from "@/lib/brand"

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

/** A secondary, page scoped index. The capability system list on /capabilities. */
export type RailSubIndex = {
  heading: string
  items: readonly RailSection[]
}

export type SpecRailProps = {
  /** The business name: the masthead logo's alt text. */
  identifier: string
  /** Title block masthead, the full lockup. Links home. */
  logo: LogoAsset
  /** Top level section index. Passed in, never fetched. */
  sections: readonly RailSection[]
  /**
   * Page contextual data. Contract value, duration, sector, systems on a
   * project. Omitted where there is no context to carry rather than filled
   * with something invented.
   */
  data?: readonly RailDatum[]
  /**
   * A second, page scoped index below the main one: the five systems on
   * /capabilities, active one in `color.signal` via the same aria-current
   * styling RailIndex already applies.
   */
  index?: RailSubIndex
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
/**
 * Every link in the rail sets prefetch={false}. The rail is on screen on
 * every page, so viewport prefetching would fetch all six sections' code at
 * idle on every visit: 55KB on the homepage, on a phone on mobile data.
 */
export function SpecRail({ identifier, logo, sections, data, index }: SpecRailProps) {
  return (
    <>
      {/*
        Below lg the rail becomes two sticky lines, both in flow so neither
        ever covers content: the identifier strip, then the section index.
      */}
      <div className="sticky top-0 z-40 flex h-[var(--rail-mobile-height)] items-center justify-between gap-4 border-b border-border-hairline bg-surface-page px-4 font-mono text-xs tracking-label uppercase lg:hidden">
        <Link href="/" prefetch={false} className="focus-ring block">
          <LogoImage
            asset={logo}
            alt={identifier}
            className="block h-[var(--logo-rail-mobile)] w-auto"
          />
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

      {/* lg and up: fixed rail, starting below the fixed concept bar. */}
      <aside
        aria-label="Specification"
        className="fixed top-[var(--concept-bar-height)] bottom-0 left-0 z-40 hidden w-[var(--rail-width)] flex-col border-r border-border-hairline bg-surface-page px-4 py-6 font-mono text-xs tracking-label uppercase lg:flex"
      >
        <Link href="/" prefetch={false} className="focus-ring block self-start">
          <LogoImage
            asset={logo}
            alt={identifier}
            className="block h-[var(--logo-rail)] w-auto"
          />
        </Link>

        <nav
          aria-label="Sections"
          className="mt-8 border-t border-border-hairline pt-4"
        >
          <RailIndex sections={sections} />
        </nav>

        {index ? (
          <nav
            aria-label={index.heading}
            className="mt-8 border-t border-border-hairline pt-4"
          >
            <p className="text-text-secondary">{index.heading}</p>
            <div className="mt-3">
              <RailIndex sections={index.items} />
            </div>
          </nav>
        ) : null}

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
