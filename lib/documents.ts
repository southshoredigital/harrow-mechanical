import { statSync } from "node:fs"
import { join } from "node:path"

import { documents } from "@/content/documents"
import type { ComplianceDocument } from "@/content/types"

/**
 * Server side document lookups. Imports node:fs, so never from a client
 * component: pass the result down as props.
 */

/** A library entry with its size, measured from the file that is served. */
export type LibraryDocument = ComplianceDocument & {
  /** Bytes, from the file in public/ at build time. */
  fileSize: number
}

/**
 * Every document with its real size. Read from disk rather than written into
 * content, so replacing a PDF updates the size shown next to it and the two
 * can never drift. A document whose file is missing throws, which fails the
 * static build instead of shipping a link that 404s.
 */
export function libraryDocuments(): LibraryDocument[] {
  return documents.map((document) => {
    const path = join(process.cwd(), "public", document.file)
    try {
      return { ...document, fileSize: statSync(path).size }
    } catch {
      throw new Error(`Document "${document.title}" has no file at public${document.file}`)
    }
  })
}
