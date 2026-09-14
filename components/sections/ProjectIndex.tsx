"use client"

import { useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import {
  EMPTY_SELECTION,
  readSelection,
  selectionQuery,
} from "@/lib/project-filters"
import type { FacetKey, ScheduleRow } from "@/lib/project-filters"

import { ProjectIndexView } from "./ProjectIndexView"

/**
 * The filterable projects index.
 *
 * The URL is the only state: the selection is read from the query string and
 * written back with history.replaceState, which Next syncs into
 * useSearchParams without a server round trip. A filtered view is therefore
 * shareable as a link, and filtering is a re-render of rows already on the
 * page.
 *
 * replaceState rather than pushState, so working through the filters does not
 * fill the back button with a history entry per click.
 *
 * Must sit inside a Suspense boundary whose fallback is the unfiltered
 * ProjectIndexView, which is what renders without JavaScript.
 */
export function ProjectIndex({ rows }: { rows: readonly ScheduleRow[] }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selection = readSelection(searchParams)

  const commit = useCallback(
    (query: string) => {
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname
      )
    },
    [pathname]
  )

  const onSelect = (facet: FacetKey, option: string | null) =>
    commit(selectionQuery({ ...selection, [facet]: option }))

  const onClear = () => commit(selectionQuery(EMPTY_SELECTION))

  return (
    <ProjectIndexView
      rows={rows}
      selection={selection}
      onSelect={onSelect}
      onClear={onClear}
    />
  )
}
