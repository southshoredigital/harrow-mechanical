import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Figures } from "@/components/typography/Figures"
import { capabilities } from "@/content/capabilities"
import { formatValue } from "@/content/types"
import { ICON_BY_SYSTEM, getCapability } from "@/lib/capabilities"
import { getProject } from "@/lib/projects"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return capabilities.map((capability) => ({ slug: capability.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const capability = getCapability((await params).slug)
  if (!capability) return {}

  return {
    title: `${capability.title} | Harrow Mechanical`,
    description: capability.summary,
  }
}

export default async function CapabilityPage({ params }: Props) {
  const capability = getCapability((await params).slug)
  if (!capability) notFound()

  const Icon = ICON_BY_SYSTEM[capability.title]
  const relatedProjects = capability.relatedProjects
    .map((slug) => getProject(slug))
    .filter((project) => project !== undefined)

  return (
    <article className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          <Link href="/capabilities" className="focus-ring hover:text-text-primary">
            Capabilities
          </Link>{" "}
          / {capability.title}
        </p>

        <div className="mt-4 flex items-start gap-6">
          <Icon
            className="hidden h-12 w-12 shrink-0 text-text-primary sm:block"
            aria-hidden="true"
          />
          <div>
            <h1 className="max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
              {capability.title}
            </h1>
            <p className="mt-4 max-w-[var(--measure)] font-body text-base text-text-secondary">
              {capability.summary}
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-[var(--spacing-section-compact)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]">
        <section
          aria-labelledby="capability-detail-heading"
          className="border-t border-border-strong pt-6"
        >
          <h2 id="capability-detail-heading" className="sr-only">
            Detail
          </h2>
          {capability.detail.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-[var(--measure)] font-body text-base text-text-primary first:mt-0"
            >
              <Figures text={paragraph} />
            </p>
          ))}
        </section>

        <section
          aria-labelledby="capability-scope-heading"
          className="mt-[var(--spacing-section-compact)] border-t border-border-strong pt-6"
        >
          <h2
            id="capability-scope-heading"
            className="font-display text-xl tracking-display text-text-primary"
          >
            Scope
          </h2>
          <ul className="mt-8 max-w-[var(--measure)] border-t border-border-hairline">
            {capability.scope.map((item, index) => (
              <li
                key={item}
                className="flex gap-4 border-b border-border-hairline py-3"
              >
                <span className="font-mono text-xs tracking-mono text-text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-text-primary">
                  <Figures text={item} />
                </span>
              </li>
            ))}
          </ul>
        </section>

        {relatedProjects.length > 0 ? (
          <section
            aria-labelledby="capability-projects-heading"
            className="mt-[var(--spacing-section-compact)] border-t border-border-strong pt-6"
          >
            <h2
              id="capability-projects-heading"
              className="font-display text-xl tracking-display text-text-primary"
            >
              Related work
            </h2>

            <ul className="mt-8 border-t border-border-hairline">
              {relatedProjects.map((project) => (
                <li
                  key={project.slug}
                  className="relative grid gap-4 border-b border-border-hairline py-4 hover:bg-surface-subtle lg:grid-cols-12 lg:items-baseline lg:gap-6"
                >
                  <div className="lg:col-span-6">
                    <h3 className="font-display text-base tracking-display text-text-primary">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="focus-ring after:absolute after:inset-0"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="mt-1 font-body text-sm text-text-secondary">
                      {project.location}
                    </p>
                  </div>
                  <p className="font-mono text-xs tracking-mono text-text-secondary lg:col-span-2">
                    {project.sector}
                  </p>
                  <p className="font-mono text-xs tracking-mono text-text-primary lg:col-span-2">
                    {formatValue(project.contractValue)}
                  </p>
                  <p className="font-mono text-xs tracking-mono text-text-primary lg:col-span-2 lg:text-right">
                    {project.completionYear}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  )
}
