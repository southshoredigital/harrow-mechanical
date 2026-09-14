"use client"

import { useCallback } from "react"
import { usePathname, useSearchParams } from "next/navigation"

import { categoryQuery, readCategory } from "@/lib/document-filters"
import type { CategorySelection } from "@/lib/document-filters"
import type { LibraryDocument } from "@/lib/documents"

import { DocumentLibraryView } from "./DocumentLibraryView"

/**
 * The filterable document library. Same URL-as-state approach as
 * ProjectIndex: replaceState keeps a filtered view shareable without
 * filling the back button with one entry per click.
 *
 * Must sit inside a Suspense boundary whose fallback is the unfiltered
 * DocumentLibraryView, which is what renders without JavaScript.
 */
export function DocumentLibrary({
  documents,
}: {
  documents: readonly LibraryDocument[]
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selection = readCategory(searchParams)

  const commit = useCallback(
    (query: string) => {
      window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname)
    },
    [pathname]
  )

  const onSelect = (category: CategorySelection) => commit(categoryQuery(category))

  return (
    <DocumentLibraryView documents={documents} selection={selection} onSelect={onSelect} />
  )
}
