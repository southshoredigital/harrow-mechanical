import type { Metadata } from "next"

import { accreditations } from "@/content/accreditations"
import { projects } from "@/content/projects"
import { SECTORS } from "@/content/types"

export const metadata: Metadata = {
  title: "About | Harrow Mechanical",
  description:
    "Harrow Mechanical: founded 1994, 58 staff, Dandenong South, across five sectors and $400,000 to $4.2m contracts.",
}

const FOUNDED_YEAR = 1994
const STAFF = 58
const CONTRACT_RANGE = "$400,000 to $4.2m"
const HQ = "Dandenong South, Victoria"

const yearsOperating = new Date().getFullYear() - FOUNDED_YEAR

const STATS = [
  ["Staff", String(STAFF)],
  ["Headquarters", HQ],
  ["Sectors served", String(SECTORS.length)],
  ["Contract range", CONTRACT_RANGE],
  ["Projects on record", String(projects.length)],
  ["Current accreditations", String(accreditations.length)],
] as const

/**
 * About. Thirty years told in numbers, per CLAUDE.md: no biography, no
 * values statement, nothing that could appear unchanged on a competitor's
 * site. Every figure here is either given directly in docs/brief.md or
 * derived from the typed content the rest of the site already reads from.
 */
export default function AboutPage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          About
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          How long we&#39;ve been doing this, in numbers.
        </h1>
      </header>

      <section
        aria-labelledby="founded-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] border-t border-border-hairline px-[var(--layout-gutter)] pt-12 lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              id="founded-heading"
              className="font-mono text-xs tracking-label uppercase text-text-secondary"
            >
              Founded
            </p>
            <p className="mt-2 font-display text-hero tracking-display text-text-primary">
              {FOUNDED_YEAR}
            </p>
          </div>
          <p className="max-w-[var(--measure)] font-mono text-sm tracking-mono text-text-secondary">
            {yearsOperating} years operating out of {HQ}.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="stats-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2 id="stats-heading" className="sr-only">
          Figures
        </h2>
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map(([label, value]) => (
            <div key={label} className="border border-border-hairline p-4">
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                {label}
              </dt>
              <dd className="mt-2 font-mono text-lg tracking-mono text-text-primary">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="sectors-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2
          id="sectors-heading"
          className="border-t border-border-strong pt-6 font-display text-xl tracking-display text-text-primary"
        >
          Sectors served
        </h2>
        <ul className="mt-8 grid gap-px border-t border-border-hairline sm:grid-cols-2 lg:grid-cols-5">
          {SECTORS.map((sector, index) => (
            <li
              key={sector}
              className="flex items-baseline gap-3 border-b border-border-hairline py-4"
            >
              <span className="font-mono text-xs tracking-mono text-text-secondary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-body text-base text-text-primary">
                {sector}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
