import { Suspense } from "react"

import { DocumentLibrary } from "@/components/sections/DocumentLibrary"
import { DocumentLibraryView } from "@/components/sections/DocumentLibraryView"
import { libraryDocuments } from "@/lib/documents"
import { JsonLd, breadcrumbList, documentsMetadata } from "@/lib/seo"

export const metadata = documentsMetadata

/** Sizes are measured from public/documents when the page is built. */
const documents = libraryDocuments()

export default function DocumentsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 pb-[var(--spacing-section-generous)] lg:px-[var(--layout-gutter-wide)] lg:pt-24">
      <JsonLd
        data={breadcrumbList([
          { name: "Compliance", path: "/compliance" },
          { name: "Document library", path: "/compliance/documents" },
        ])}
      />
      <header>
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Compliance / Document library
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          Every certificate, licence and letter of currency we hold.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          Filter by category. Each file downloads directly, with type, size
          and issue date shown before you open it.
        </p>
      </header>

      <div className="mt-[var(--spacing-section-compact)]">
        <Suspense
          fallback={<DocumentLibraryView documents={documents} selection={null} />}
        >
          <DocumentLibrary documents={documents} />
        </Suspense>
      </div>
    </div>
  )
}
