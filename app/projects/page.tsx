import { Suspense } from "react"

import { ProjectIndex } from "@/components/sections/ProjectIndex"
import { ProjectIndexView } from "@/components/sections/ProjectIndexView"
import { SECTORS, formatValue } from "@/content/types"
import { EMPTY_SELECTION } from "@/lib/project-filters"
import { scheduleRows } from "@/lib/projects"
import { JsonLd, breadcrumbList, projectsMetadata } from "@/lib/seo"

export const metadata = projectsMetadata

/**
 * Projects index. The centrepiece of the site per the brief: an estimator
 * checks for relevant work at similar scale before anything else.
 *
 * The page is static. The schedule is prerendered unfiltered as the Suspense
 * fallback, which is the view that works without JavaScript. ProjectIndex
 * then reads the query string on the client and filters in place.
 */
export default function ProjectsPage() {
  const rows = scheduleRows()
  const values = rows.map((row) => row.contractValue)
  const years = rows.map((row) => row.completionYear)

  const summary = [
    ["Projects", String(rows.length)],
    ["Sectors", String(SECTORS.length)],
    ["Completed", `${Math.min(...years)} to ${Math.max(...years)}`],
    [
      "Contract values",
      `${formatValue(Math.min(...values))} to ${formatValue(Math.max(...values))}`,
    ],
  ] as const

  return (
    <div className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 pb-[var(--spacing-section-generous)] lg:px-[var(--layout-gutter-wide)] lg:pt-24">
      <JsonLd data={breadcrumbList([{ name: "Projects", path: "/projects" }])} />
      <header className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <h1 className="font-display text-3xl tracking-display text-text-primary lg:text-4xl">
            Project record
          </h1>
          <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
            Filter by sector, system and contract scale. Each record sets out
            the brief, the plant installed, the constraints the job was
            delivered under and the measured outcome.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-hairline pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
          {summary.map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                {label}
              </dt>
              <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="mt-[var(--spacing-section-compact)]">
        <Suspense
          fallback={<ProjectIndexView rows={rows} selection={EMPTY_SELECTION} />}
        >
          <ProjectIndex rows={rows} />
        </Suspense>
      </div>
    </div>
  )
}
