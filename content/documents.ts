import type { ComplianceDocument } from './types'

/**
 * Six documents. Each needs a real PDF at the `file` path under
 * /public/documents, or the download link 404s and the case study
 * claim that the library works is untrue.
 *
 * Generate one page placeholder PDFs. Anything that opens is fine.
 */
export const documents: ComplianceDocument[] = [
  {
    title: 'Certificate of Currency — Public and Products Liability',
    category: 'Insurance',
    file: '/documents/public-products-liability.pdf',
    fileSize: 184_000,
    issueDate: '2026-07-01',
    expiryDate: '2027-06-30',
  },

  // Suggested remaining five:
  //  - Workers Compensation certificate        (Insurance)
  //  - Plumbing Industry Commission licence    (Licence)
  //  - Refrigerant Handling Licence, ARC        (Licence)
  //  - ISO 9001 Quality Management             (Certification)
  //  - Safety performance statement, LTIFR      (Safety)
]
