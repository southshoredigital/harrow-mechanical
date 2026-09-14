import type { ComplianceDocument } from './types'

/**
 * Six documents. Each needs a real PDF at the `file` path under
 * /public/documents, or the download link 404s and the case study
 * claim that the library works is untrue.
 *
 * File sizes are not recorded here. They are read from the PDFs at build
 * time (lib/documents.ts), and a missing file fails the build.
 */
export const documents: ComplianceDocument[] = [
  {
    title: 'Certificate of Currency: Public and Products Liability',
    category: 'Insurance',
    file: '/documents/public-products-liability.pdf',
    issueDate: '2026-07-01',
    expiryDate: '2027-06-30',
  },

  {
    title: 'Certificate of Currency: Workers Compensation',
    category: 'Insurance',
    file: '/documents/workers-compensation.pdf',
    issueDate: '2026-07-01',
    expiryDate: '2027-06-30',
  },

  {
    title: 'Plumbing Industry Commission Licence: Mechanical Services',
    category: 'Licence',
    file: '/documents/plumbing-industry-commission-licence.pdf',
    issueDate: '2024-03-18',
  },

  {
    title: 'Refrigerant Handling Licence: ARCtick',
    category: 'Licence',
    file: '/documents/arc-refrigerant-handling-licence.pdf',
    issueDate: '2019-11-04',
  },

  {
    title: 'ISO 9001:2015 Quality Management Certification',
    category: 'Certification',
    file: '/documents/iso-9001-quality-management.pdf',
    issueDate: '2025-05-14',
    expiryDate: '2028-05-13',
  },

  {
    title: 'Safety Performance Statement: LTIFR',
    category: 'Safety',
    file: '/documents/safety-performance-statement.pdf',
    issueDate: '2026-08-01',
  },
]
