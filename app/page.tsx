import Image from "next/image"
import Link from "next/link"

import {
  Commissioning,
  Controls,
  Hydraulic,
  Maintenance,
  Mechanical,
} from "@/components/icons"
import { accreditations } from "@/content/accreditations"
import { capabilities } from "@/content/capabilities"
import { projects } from "@/content/projects"
import { formatMonthYear, scaleOf } from "@/content/types"
import type { System } from "@/content/types"

/**
 * Homepage. Audience is a head contractor estimator with under three
 * minutes, deciding whether to invite Harrow to tender.
 *
 * Structure is fixed by CLAUDE.md: opening, project count, featured
 * projects, capability summary, accreditation strip, capability statement.
 * Nothing else belongs here.
 */

const ICON_BY_SYSTEM: Record<System, typeof Mechanical> = {
  Mechanical,
  Hydraulic,
  Controls,
  Commissioning,
  Maintenance,
}

const featuredProjects = projects.filter((project) => project.featured)

const OPENING_FACTS = [
  ["Founded", "1994"],
  ["Staff", "58"],
  ["Contract range", "$400,000 to $4.2m"],
  ["Sectors", "Health, education, data centre, industrial, commercial office"],
] as const

export default function Home() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
              Dandenong South / est. 1994
            </p>
            <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
              Mechanical, hydraulic and controls contracting for buildings
              that cannot go offline.
            </h1>
            <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
              Design and construct, and construct only, mechanical services
              for head contractors and asset owners across Melbourne, in
              health, education, data centre, industrial and commercial
              office work.
            </p>
          </div>

          <dl className="border-t border-border-hairline pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            {OPENING_FACTS.map(([label, value]) => (
              <div key={label} className="mt-4 first:mt-0">
                <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                  {label}
                </dt>
                <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section
        aria-labelledby="project-count-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] border-t border-border-hairline px-[var(--layout-gutter)] pt-12 lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              id="project-count-heading"
              className="font-mono text-xs tracking-label uppercase text-text-secondary"
            >
              Projects on record
            </p>
            <p className="mt-2 font-display text-hero tracking-display text-text-primary">
              {projects.length}
            </p>
          </div>
          <p className="max-w-[var(--measure)] font-body text-base text-text-secondary">
            Completed and current contracts across five sectors, from a four
            month tenancy fitout to an eighteen month data centre build.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="featured-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-6">
          <h2
            id="featured-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            Selected projects
          </h2>
          <Link
            href="/projects"
            className="focus-ring font-mono text-xs tracking-label uppercase text-text-secondary hover:text-text-primary"
          >
            All projects <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => {
            const image = project.images[0]

            return (
              <Link
                key={project.slug}
                href={`/projects/${project.slug}`}
                className="focus-ring block border border-border-hairline"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base tracking-display text-text-primary">
                    {project.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs tracking-label uppercase text-text-secondary">
                    {project.sector} / {project.systems.join(", ")}
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-mono text-text-secondary">
                    {scaleOf(project.contractValue)}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section
        aria-labelledby="capabilities-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-6">
          <h2
            id="capabilities-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            Capability by system
          </h2>
          <Link
            href="/capabilities"
            className="focus-ring font-mono text-xs tracking-label uppercase text-text-secondary hover:text-text-primary"
          >
            All capabilities <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map((capability) => {
            const Icon = ICON_BY_SYSTEM[capability.title]

            return (
              <li key={capability.slug} className="border border-border-hairline">
                <Link
                  href={`/capabilities/${capability.slug}`}
                  className="focus-ring flex h-full flex-col gap-4 p-6"
                >
                  <Icon
                    className="h-8 w-8 text-text-primary"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs tracking-label uppercase text-text-primary">
                    {capability.title}
                  </span>
                  <p className="text-sm text-text-secondary">
                    {capability.summary}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section
        aria-labelledby="accreditation-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="flex items-baseline justify-between gap-4 border-t border-border-strong pt-6">
          <h2
            id="accreditation-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            Current accreditation
          </h2>
          <Link
            href="/compliance"
            className="focus-ring font-mono text-xs tracking-label uppercase text-text-secondary hover:text-text-primary"
          >
            Full compliance record <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <dl className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {accreditations.map((accreditation) => (
            <div
              key={accreditation.reference}
              className="border border-border-hairline p-4"
            >
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
        aria-labelledby="capability-statement-heading"
        className="mx-auto mt-[var(--spacing-section-generous)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <div className="border-t border-border-accent bg-surface-inverse px-6 py-12 lg:px-12 lg:py-16">
          <p className="font-mono text-xs tracking-label uppercase text-text-accent">
            Capability statement
          </p>
          <h2
            id="capability-statement-heading"
            className="mt-4 max-w-[var(--measure)] font-display text-2xl tracking-display text-text-inverse"
          >
            Project history, accreditations and licensing in one document.
          </h2>
          <p className="mt-4 max-w-[var(--measure)] font-body text-base text-text-inverse">
            The same record shown on this site, formatted for a tender
            submission: {projects.length} projects, six current
            accreditations and licences, and insurance certificates of
            currency.
          </p>
          <a
            href="/documents/capability-statement.pdf"
            className="focus-ring mt-8 inline-flex items-center gap-3 border border-border-accent px-6 py-3 font-mono text-xs tracking-label uppercase text-text-inverse hover:bg-signal"
          >
            View or download <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>
    </div>
  )
}
