import { DOCUMENT_CATEGORIES } from "@/content/types"
import type { ComplianceDocument, DocumentCategory } from "@/content/types"

/**
 * Document library filtering. One facet, category, so this is a much smaller
 * version of lib/project-filters.ts, but the same shape: the URL is the only
 * state, so a filtered view is a shareable link and the unfiltered list
 * still works with no JavaScript.
 */

export type CategorySelection = DocumentCategory | null

const PARAM = "category"

/** URL form of a category: 'Certification' is 'certification'. */
export function categorySlug(category: DocumentCategory) {
  return category.toLowerCase()
}

/** Anything with a URLSearchParams style getter, including Next's read-only one. */
type ParamReader = { get(name: string): string | null }

export function readCategory(params: ParamReader): CategorySelection {
  const slug = params.get(PARAM)
  return DOCUMENT_CATEGORIES.find((category) => categorySlug(category) === slug) ?? null
}

export function categoryQuery(selection: CategorySelection) {
  const params = new URLSearchParams()
  if (selection) params.set(PARAM, categorySlug(selection))
  return params.toString()
}

export function applyCategory<T extends ComplianceDocument>(
  documents: readonly T[],
  selection: CategorySelection
): readonly T[] {
  return selection
    ? documents.filter((document) => document.category === selection)
    : documents
}
