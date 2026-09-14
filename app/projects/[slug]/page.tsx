import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { ProjectSpread } from "@/components/sections/ProjectSpread"
import type { SpreadSection } from "@/components/sections/ProjectSpread"
import { Figures } from "@/components/typography/Figures"
import { projects } from "@/content/projects"
import { getProject, projectFacts } from "@/lib/projects"

/**
 * Project detail. Reads as a job record, not a case study: the brief, the
 * systems installed, the constraints, the outcome, in that order and nothing
 * else. Contract facts sit in the specification rail, rendered by the
 * matching page in the @rail slot.
 */

type Props = { params: Promise<{ slug: string }> }

/** Every project is known at build time. Anything else is a 404. */
export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug)
  if (!project) return {}

  return {
    title: `${project.title} | Harrow Mechanical`,
    description: project.brief,
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug)
  if (!project) notFound()

  const [firstImage, secondImage] = project.images
  const facts = projectFacts(project)

  const prose = (text: string) => (
    <p className="font-body text-base text-text-primary">
      <Figures text={text} />
    </p>
  )

  const sections: SpreadSection[] = [
    { id: "brief", number: "01", title: "Brief", body: prose(project.brief) },
    {
      id: "systems-installed",
      number: "02",
      title: "Systems installed",
      body: (
        <ul className="border-t border-border-hairline">
          {project.systemsInstalled.map((item) => (
            <li
              key={item}
              className="border-b border-border-hairline py-3 font-mono text-sm tracking-mono text-text-primary"
            >
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "constraints",
      number: "03",
      title: "Constraints",
      body: prose(project.constraints),
    },
    { id: "outcome", number: "04", title: "Outcome", body: prose(project.outcome) },
  ]

  return (
    <article className="pb-[var(--spacing-section-generous)]">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          <Link
            href="/projects"
            className="focus-ring hover:text-text-primary"
          >
            Projects
          </Link>{" "}
          / {project.location}
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          {project.title}
        </h1>
        <p className="mt-4 font-mono text-xs tracking-label uppercase text-text-secondary">
          {project.client}
        </p>

        {/*
          Below lg the rail is a single strip with no room for data, so the
          same facts are set here. From lg this list is hidden, not duplicated:
          the rail carries it.
        */}
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border-hairline pt-6 sm:grid-cols-3 lg:hidden">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary">
                {fact.label}
              </dt>
              <dd className="mt-1 font-mono text-sm tracking-mono text-text-primary">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <ProjectSpread image={firstImage} sections={sections.slice(0, 2)} lead />
      <ProjectSpread image={secondImage} sections={sections.slice(2)} />
    </article>
  )
}
