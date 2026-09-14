import Link from "next/link"

import { Figures } from "@/components/typography/Figures"
import { formatValue } from "@/content/types"
import {
  FACETS,
  applySelection,
  isFiltered,
  optionCount,
} from "@/lib/project-filters"
import type { FacetKey, ScheduleRow, Selection } from "@/lib/project-filters"
import { cn } from "@/lib/utils"

/**
 * The projects index: filter bar, result count and schedule.
 *
 * Presentation only, no hooks and no directive, so the same markup renders in
 * two places: on the server as the unfiltered, JavaScript free view, and inside
 * the client component that reads the URL. Identical markup in both is what
 * keeps the swap at hydration free of layout shift.
 *
 * Without `onSelect` the controls render disabled: they cannot filter without
 * JavaScript, so they should not pretend to.
 */

export type ProjectIndexViewProps = {
  rows: readonly ScheduleRow[]
  selection: Selection
  onSelect?: (facet: FacetKey, option: string | null) => void
  onClear?: () => void
}

/** Column spans at lg, shared by the header row and every schedule row. */
const COLUMNS = {
  project: "lg:col-span-4",
  sector: "lg:col-span-2",
  systems: "lg:col-span-2",
  value: "lg:col-span-2 lg:text-right",
  duration: "lg:col-span-1 lg:text-right",
  completed: "lg:col-span-1 lg:text-right",
} as const

export function ProjectIndexView({
  rows,
  selection,
  onSelect,
  onClear,
}: ProjectIndexViewProps) {
  const interactive = Boolean(onSelect)
  const results = applySelection(rows, selection)
  const filtered = isFiltered(selection)

  return (
    <div>
      <div className="border-t border-border-strong">
        {FACETS.map((facet) => {
          const labelId = `facet-${facet.key}`
          const choices = [null, ...facet.options]

          return (
            <div
              key={facet.key}
              className="grid gap-3 border-b border-border-hairline py-4 lg:grid-cols-12 lg:items-baseline lg:gap-6"
            >
              <p
                id={labelId}
                className="font-mono text-xs tracking-label uppercase text-text-secondary lg:col-span-2"
              >
                {facet.label}
              </p>

              <div
                role="radiogroup"
                aria-labelledby={labelId}
                className="flex flex-wrap gap-px lg:col-span-10"
              >
                {choices.map((option) => {
                  const checked = selection[facet.key] === option
                  const count = optionCount(rows, selection, facet.key, option)

                  return (
                    <label
                      key={option ?? "all"}
                      className={cn(
                        "flex min-h-[var(--tap-target)] items-center gap-2 border border-border-hairline px-3 font-mono text-xs tracking-mono has-focus-visible:focus-outline",
                        checked
                          ? "border-border-strong bg-surface-inverse text-text-inverse"
                          : "text-text-primary",
                        interactive
                          ? !checked && "cursor-pointer hover:bg-surface-subtle"
                          : "cursor-not-allowed"
                      )}
                    >
                      <input
                        type="radio"
                        name={facet.key}
                        value={option ?? ""}
                        checked={checked}
                        disabled={!interactive}
                        readOnly={!interactive}
                        onChange={
                          onSelect
                            ? () => onSelect(facet.key, option)
                            : undefined
                        }
                        className="sr-only"
                      />
                      <span>{option ?? "All"}</span>
                      <span
                        className={
                          checked ? "text-text-inverse" : "text-text-secondary"
                        }
                      >
                        {count}
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex min-h-[var(--tap-target)] flex-wrap items-center justify-between gap-4">
        <p
          aria-live="polite"
          className="font-mono text-xs tracking-label uppercase text-text-secondary"
        >
          Showing <span className="text-text-primary">{results.length}</span> of{" "}
          {rows.length} projects
        </p>

        {filtered && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="focus-ring min-h-[var(--tap-target)] border border-border-strong px-4 font-mono text-xs tracking-label uppercase text-text-primary hover:bg-surface-inverse hover:text-text-inverse"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div
        aria-hidden="true"
        className="mt-4 hidden gap-6 border-b border-border-strong pb-3 font-mono text-xs tracking-label uppercase text-text-secondary lg:grid lg:grid-cols-12"
      >
        <span className={COLUMNS.project}>Project</span>
        <span className={COLUMNS.sector}>Sector</span>
        <span className={COLUMNS.systems}>Systems</span>
        <span className={COLUMNS.value}>Contract value</span>
        <span className={COLUMNS.duration}>Months</span>
        <span className={COLUMNS.completed}>Year</span>
      </div>

      {results.length > 0 ? (
        <ul className="border-t border-border-strong lg:border-t-0">
          {results.map((row) => (
            <ScheduleRowItem key={row.slug} row={row} />
          ))}
        </ul>
      ) : (
        <div className="border-t border-border-strong py-12 lg:border-t-0">
          <p className="max-w-[var(--measure)] font-body text-base text-text-primary">
            <Figures
              text={`No project on record matches ${listed(
                FACETS.filter((facet) => selection[facet.key]).map(
                  (facet) =>
                    `${facet.label.toLowerCase()} ${selection[facet.key]}`
                )
              )}. Remove a filter to widen the schedule.`}
            />
          </p>
        </div>
      )}
    </div>
  )
}

/** 'a', 'a and b', 'a, b and c'. */
function listed(items: string[]) {
  return items.length > 1
    ? `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`
    : items.join("")
}

/**
 * One job on the schedule. The title link is stretched over the whole row, so
 * the row is one target and one tab stop.
 *
 * Below lg each value carries its own label. From lg the labels go visually
 * hidden and the column header row above does that job, while screen readers
 * still hear label and value together.
 */
function ScheduleRowItem({ row }: { row: ScheduleRow }) {
  const label =
    "font-mono text-xs tracking-label uppercase text-text-secondary lg:sr-only"
  const value = "mt-1 font-mono text-xs tracking-mono text-text-primary lg:mt-0"

  return (
    <li className="relative grid gap-4 border-b border-border-hairline py-4 hover:bg-surface-subtle lg:grid-cols-12 lg:items-baseline lg:gap-6">
      <div className={COLUMNS.project}>
        <h2 className="font-display text-base tracking-display text-text-primary">
          <Link
            href={`/projects/${row.slug}`}
            className="focus-ring after:absolute after:inset-0"
          >
            {row.title}
          </Link>
        </h2>
        <p className="mt-1 font-body text-sm text-text-secondary">
          {row.location}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:col-span-8 lg:grid-cols-8 lg:items-baseline">
        <div className={COLUMNS.sector}>
          <dt className={label}>Sector</dt>
          <dd className={value}>{row.sector}</dd>
        </div>
        <div className={COLUMNS.systems}>
          <dt className={label}>Systems</dt>
          <dd className={value}>
            <ul>
              {row.systems.map((system) => (
                <li key={system}>{system}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div className={COLUMNS.value}>
          <dt className={label}>Contract value</dt>
          <dd className={value}>{formatValue(row.contractValue)}</dd>
        </div>
        <div className={COLUMNS.duration}>
          <dt className={label}>Months</dt>
          <dd className={value}>{row.durationMonths}</dd>
        </div>
        <div className={COLUMNS.completed}>
          <dt className={label}>Year</dt>
          <dd className={value}>{row.completionYear}</dd>
        </div>
      </dl>
    </li>
  )
}
