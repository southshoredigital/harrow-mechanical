import { DOCUMENT_CATEGORIES, formatFileSize, formatMonthYear } from "@/content/types"
import type { ComplianceDocument } from "@/content/types"
import { applyCategory } from "@/lib/document-filters"
import type { CategorySelection } from "@/lib/document-filters"
import { cn } from "@/lib/utils"

/**
 * The document library: category filter and file list. Presentation only, no
 * hooks and no directive, so the same markup renders on the server as the
 * unfiltered, JavaScript free view and inside the client component that
 * reads the URL.
 *
 * Without `onSelect` the controls render disabled: they cannot filter
 * without JavaScript, so they should not pretend to.
 */
export type DocumentLibraryViewProps = {
  documents: readonly ComplianceDocument[]
  selection: CategorySelection
  onSelect?: (category: CategorySelection) => void
}

export function DocumentLibraryView({
  documents,
  selection,
  onSelect,
}: DocumentLibraryViewProps) {
  const interactive = Boolean(onSelect)
  const results = applyCategory(documents, selection)
  const choices: CategorySelection[] = [null, ...DOCUMENT_CATEGORIES]

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Category"
        className="flex flex-wrap gap-px border-y border-border-hairline py-4"
      >
        {choices.map((category) => {
          const checked = selection === category
          const count = category
            ? documents.filter((document) => document.category === category).length
            : documents.length

          return (
            <label
              key={category ?? "all"}
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
                name="category"
                value={category ?? ""}
                checked={checked}
                disabled={!interactive}
                readOnly={!interactive}
                onChange={onSelect ? () => onSelect(category) : undefined}
                className="sr-only"
              />
              <span>{category ?? "All"}</span>
              <span className={checked ? "text-text-inverse" : "text-text-secondary"}>
                {count}
              </span>
            </label>
          )
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-6 font-mono text-xs tracking-label uppercase text-text-secondary"
      >
        Showing <span className="text-text-primary">{results.length}</span> of{" "}
        {documents.length} documents
      </p>

      <ul className="mt-4 border-t border-border-strong">
        {results.map((document) => (
          <li
            key={document.file}
            className="relative grid gap-2 border-b border-border-hairline py-4 hover:bg-surface-subtle sm:grid-cols-12 sm:items-baseline sm:gap-6"
          >
            <div className="sm:col-span-6">
              <h2 className="font-display text-base tracking-display text-text-primary">
                <a
                  href={document.file}
                  className="focus-ring after:absolute after:inset-0"
                >
                  {document.title}
                </a>
              </h2>
              <p className="mt-1 font-mono text-xs tracking-label uppercase text-text-secondary">
                {document.category}
              </p>
            </div>
            <p className="font-mono text-xs tracking-mono text-text-secondary sm:col-span-2">
              PDF, {formatFileSize(document.fileSize)}
            </p>
            <p className="font-mono text-xs tracking-mono text-text-secondary sm:col-span-2">
              Issued {formatMonthYear(document.issueDate)}
            </p>
            <p className="font-mono text-xs tracking-mono text-text-secondary sm:col-span-2 sm:text-right">
              {document.expiryDate
                ? `To ${formatMonthYear(document.expiryDate)}`
                : "No expiry"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
