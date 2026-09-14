import { SCALES, SECTORS, SYSTEMS, scaleOf } from "@/content/types"
import type { Project, System } from "@/content/types"

/**
 * Projects index filtering.
 *
 * Pure functions only, no content import, so the client component that uses
 * them ships the filter logic and nothing else. The rows it filters are passed
 * in from the server.
 */

/** The fields the index schedule shows. Prose stays on the server. */
export type ScheduleRow = Pick<
  Project,
  | "slug"
  | "title"
  | "location"
  | "sector"
  | "systems"
  | "contractValue"
  | "durationMonths"
  | "completionYear"
>

export const FACETS = [
  { key: "sector", label: "Sector", options: SECTORS },
  { key: "system", label: "System", options: SYSTEMS },
  { key: "scale", label: "Contract scale", options: SCALES },
] as const

export type FacetKey = (typeof FACETS)[number]["key"]

/** One option per facet, or null for all. Values are the content constants. */
export type Selection = Record<FacetKey, string | null>

export const EMPTY_SELECTION: Selection = {
  sector: null,
  system: null,
  scale: null,
}

/**
 * URL form of an option: 'Data centre' is 'data-centre', '$1m to $2.5m' is
 * '1m-to-2-5m'. Readable in a shared link, and derived rather than stored so
 * it cannot disagree with the constant it came from.
 */
export function optionSlug(option: string) {
  return option
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Anything with a URLSearchParams style getter, including Next's read-only one. */
type ParamReader = { get(name: string): string | null }

/** Unknown or malformed values are ignored rather than matching nothing. */
export function readSelection(params: ParamReader): Selection {
  const selection = { ...EMPTY_SELECTION }

  for (const facet of FACETS) {
    const slug = params.get(facet.key)
    selection[facet.key] =
      facet.options.find((option) => optionSlug(option) === slug) ?? null
  }

  return selection
}

/** Query string for a selection, facets in a fixed order, empty when unfiltered. */
export function selectionQuery(selection: Selection) {
  const params = new URLSearchParams()

  for (const facet of FACETS) {
    const option = selection[facet.key]
    if (option) params.set(facet.key, optionSlug(option))
  }

  return params.toString()
}

export function isFiltered(selection: Selection) {
  return FACETS.some((facet) => selection[facet.key] !== null)
}

function matchesFacet(row: ScheduleRow, facet: FacetKey, option: string) {
  switch (facet) {
    case "sector":
      return row.sector === option
    case "system":
      return row.systems.includes(option as System)
    case "scale":
      return scaleOf(row.contractValue) === option
  }
}

/**
 * Rows matching every active facet. Pass `ignore` to leave one facet out,
 * which is how each option's count reflects the other two filters.
 */
export function applySelection(
  rows: readonly ScheduleRow[],
  selection: Selection,
  ignore?: FacetKey
) {
  return rows.filter((row) =>
    FACETS.every((facet) => {
      const option = selection[facet.key]
      return facet.key === ignore || option === null
        ? true
        : matchesFacet(row, facet.key, option)
    })
  )
}

/** How many rows an option would show, given the other facets as they stand. */
export function optionCount(
  rows: readonly ScheduleRow[],
  selection: Selection,
  facet: FacetKey,
  option: string | null
) {
  const pool = applySelection(rows, selection, facet)
  return option === null
    ? pool.length
    : pool.filter((row) => matchesFacet(row, facet, option)).length
}
