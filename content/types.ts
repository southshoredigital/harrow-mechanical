/**
 * Harrow Mechanical , content types
 *
 * All site content lives in typed files in this folder. There is no CMS.
 * Import the arrays directly in server components. Never fetch at runtime.
 *
 * The unions below are deliberate: a typo in a sector name fails the build
 * rather than rendering something wrong, and Claude Code cannot invent a
 * field that does not exist here.
 */

export const SECTORS = [
  'Health',
  'Education',
  'Data centre',
  'Industrial',
  'Commercial office',
] as const
export type Sector = (typeof SECTORS)[number]

export const SYSTEMS = [
  'Mechanical',
  'Hydraulic',
  'Controls',
  'Commissioning',
  'Maintenance',
] as const
export type System = (typeof SYSTEMS)[number]

/** Contract scale bands. Used as a filter on the projects index. */
export const SCALES = ['Under $1m', '$1m to $2.5m', 'Over $2.5m'] as const
export type Scale = (typeof SCALES)[number]

export type Image = {
  src: string
  alt: string
  /** Intrinsic dimensions. Required , missing dimensions cause layout shift. */
  width: number
  height: number
}

export type Project = {
  slug: string
  title: string
  /** Head contractor or building owner. Generic only, no real client names. */
  client: string
  location: string
  sector: Sector
  systems: System[]
  /** Whole dollars. Formatted at render time, in mono. */
  contractValue: number
  durationMonths: number
  completionYear: number
  /** One or two sentences. What the job was. */
  brief: string
  /** Bullet list of plant and systems installed. */
  systemsInstalled: string[]
  /** What made it difficult. This is the part estimators actually read. */
  constraints: string
  /** What was delivered. Factual, no marketing language. */
  outcome: string
  images: Image[]
  /** Shown on the homepage selection. Aim for six. */
  featured?: boolean
}

export type Capability = {
  slug: string
  /** Matches a System value so the two can be cross-referenced. */
  title: System
  /** One sentence for the capability index. */
  summary: string
  /** Paragraphs for the detail page. */
  detail: string[]
  /** Plant types, standards, or service scope. Rendered as a list. */
  scope: string[]
  /** Project slugs. */
  relatedProjects: string[]
}

export type DocumentCategory =
  | 'Insurance'
  | 'Licence'
  | 'Certification'
  | 'Safety'

export type ComplianceDocument = {
  title: string
  category: DocumentCategory
  /** Path under /public/documents, e.g. '/documents/public-liability.pdf' */
  file: string
  /** Bytes. Displayed in mono next to the link. */
  fileSize: number
  /** ISO date, e.g. '2026-03-01' */
  issueDate: string
  expiryDate?: string
}

export type Role = {
  slug: string
  title: string
  type: 'Full time' | 'Contract' | 'Apprenticeship'
  location: string
  /** Plain language. Written for a tradesperson, not a recruiter. */
  description: string[]
  requirements: string[]
  /** Trade licence or ticket required, if any. */
  ticket?: string
}

export type Accreditation = {
  name: string
  /** Issuing body. */
  body: string
  reference: string
  /** ISO date. */
  currentTo: string
}

/** Derives the scale band from a contract value. */
export function scaleOf(value: number): Scale {
  if (value < 1_000_000) return 'Under $1m'
  if (value <= 2_500_000) return '$1m to $2.5m'
  return 'Over $2.5m'
}

/** Formats a contract value for display. Always rendered in mono. */
export function formatValue(value: number): string {
  return `$${value.toLocaleString('en-AU')}`
}

/** Formats an ISO date as, e.g., 'March 2026'. */
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    month: 'long',
    year: 'numeric',
  })
}

/** Formats bytes as, e.g., '1.2 MB'. */
export function formatFileSize(bytes: number): string {
  const mb = bytes / 1_000_000
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1000)} KB`
}
