import type { Metadata } from "next"
import Link from "next/link"

import { accreditations } from "@/content/accreditations"
import { documents } from "@/content/documents"
import { safetyStatistics } from "@/content/safety"
import { formatMonthYear } from "@/content/types"

export const metadata: Metadata = {
  title: "Compliance | Harrow Mechanical",
  description:
    "Accreditations, insurance currency, licensing and safety performance for Harrow Mechanical: ISO 9001, ISO 45001, VBA registration and ARCtick authorisation.",
}

const insurance = documents.filter((document) => document.category === "Insurance")

const SAFETY_STATS = [
  ["Lost time injuries", String(safetyStatistics.lostTimeInjuries)],
  ["LTIFR", safetyStatistics.ltifr.toFixed(1)],
  ["Days lost", String(safetyStatistics.daysLost)],
  ["Recordable injuries", String(safetyStatistics.recordableInjuries)],
  ["TRIFR", safetyStatistics.trifr.toFixed(1)],
  ["Notifiable incidents", String(safetyStatistics.notifiableIncidents)],
] as const

/**
 * Compliance. Accreditations, insurance currency and safety performance as
 * data, not prose, per CLAUDE.md.
 */
export default function CompliancePage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Compliance
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          Accreditation and insurance currency, checked before you ask.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          Every certificate, licence and letter of currency in this record
          holds a real reference number and a real currency date. The
          document library below carries the PDFs.
        </p>
      </header>

      <section
        aria-labelledby="accreditations-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2
          id="accreditations-heading"
          className="border-t border-border-strong pt-6 font-display text-xl tracking-display text-text-primary"
        >
          Accreditations and licensing
        </h2>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accreditations.map((accreditation) => (
            <div key={accreditation.reference} className="border border-border-hairline p-4">
              <dt className="font-mono text-xs tracking-label uppercase text-text-primary">
                {accreditation.name}
              </dt>
              <dd className="mt-2 font-mono text-xs tracking-mono text-text-secondary">
                {accreditation.body}
              </dd>
              <dd className="mt-1 font-mono text-xs tracking-mono text-text-secondary">
                Ref {accreditation.reference}
              </dd>
              <dd className="mt-1 font-mono text-xs tracking-mono text-text-secondary">
                Current to {formatMonthYear(accreditation.currentTo)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="insurance-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2
          id="insurance-heading"
          className="border-t border-border-strong pt-6 font-display text-xl tracking-display text-text-primary"
        >
          Insurance currency
        </h2>

        <dl className="mt-8 border-t border-border-hairline">
          {insurance.map((document) => (
            <div
              key={document.file}
              className="grid gap-4 border-b border-border-hairline py-4 sm:grid-cols-3"
            >
              <dt className="font-mono text-xs tracking-label uppercase text-text-primary sm:col-span-1">
                {document.title}
              </dt>
              <dd className="font-mono text-xs tracking-mono text-text-secondary">
                Issued {formatMonthYear(document.issueDate)}
              </dd>
              <dd className="font-mono text-xs tracking-mono text-text-secondary">
                {document.expiryDate
                  ? `Current to ${formatMonthYear(document.expiryDate)}`
                  : "No expiry recorded"}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        aria-labelledby="safety-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2
          id="safety-heading"
          className="border-t border-border-strong pt-6 font-display text-xl tracking-display text-text-primary"
        >
          Safety performance
        </h2>

        <p className="mt-6 max-w-[var(--measure)] font-mono text-xs tracking-mono text-text-secondary">
          {formatMonthYear(safetyStatistics.periodStart)} to{" "}
          {formatMonthYear(safetyStatistics.periodEnd)}, against{" "}
          <span className="text-text-primary">
            {safetyStatistics.hoursWorked.toLocaleString("en-AU")}
          </span>{" "}
          hours worked. LTIFR and TRIFR are per million hours.
        </p>

        <dl className="mt-8 grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {SAFETY_STATS.map(([label, value]) => (
            <div key={label} className="border border-border-hairline p-4">
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                {label}
              </dt>
              <dd className="mt-2 font-mono text-lg tracking-mono text-text-primary">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 font-mono text-xs tracking-mono text-text-secondary">
          Last reviewed {formatMonthYear(safetyStatistics.lastReviewed)}. Full
          statement in the document library.
        </p>
      </section>

      <section
        aria-labelledby="document-library-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-6">
          <h2
            id="document-library-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            Document library
          </h2>
          <Link
            href="/compliance/documents"
            className="focus-ring font-mono text-xs tracking-label uppercase text-text-secondary hover:text-text-primary"
          >
            All documents <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          {documents.length} certificates and licences, filterable by type,
          each with file size and issue date.
        </p>
      </section>
    </div>
  )
}
