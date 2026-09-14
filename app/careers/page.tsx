import type { Metadata } from "next"
import Link from "next/link"

import { roles } from "@/content/roles"

export const metadata: Metadata = {
  title: "Careers | Harrow Mechanical",
  description:
    "Open roles at Harrow Mechanical: refrigeration mechanic, controls technician, project manager and first year apprentice, Dandenong South.",
}

/**
 * Careers index. Third audience by commercial value but real trade shortage
 * pressure, per CLAUDE.md and the brief. Plain language, no recruiter voice.
 */
export default function CareersPage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Careers
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          {roles.length} roles open, Dandenong South.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          What the work actually is, where it is, and what ticket you need.
          No mission statement.
        </p>
      </header>

      <ul className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] border-t border-border-strong px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]">
        {roles.map((role) => (
          <li
            key={role.slug}
            className="relative grid gap-4 border-b border-border-hairline py-6 hover:bg-surface-subtle lg:grid-cols-12 lg:items-baseline lg:gap-6"
          >
            <div className="lg:col-span-6">
              <h2 className="font-display text-lg tracking-display text-text-primary">
                <Link href={`/careers/${role.slug}`} className="focus-ring after:absolute after:inset-0">
                  {role.title}
                </Link>
              </h2>
              <p className="mt-1 font-body text-sm text-text-secondary">{role.location}</p>
            </div>
            <p className="font-mono text-xs tracking-label uppercase text-text-secondary lg:col-span-3">
              {role.type}
            </p>
            <p className="font-mono text-xs tracking-mono text-text-secondary lg:col-span-3 lg:text-right">
              {role.ticket ?? "No ticket required"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
