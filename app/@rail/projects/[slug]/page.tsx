import { notFound } from "next/navigation"

import { projects } from "@/content/projects"
import { getProject, projectFacts } from "@/lib/projects"

import { SiteRail } from "../../SiteRail"

/** The rail on a project record: contract value, duration, sector, systems, year. */

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export default async function ProjectRail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const project = getProject((await params).slug)
  if (!project) notFound()

  return <SiteRail data={projectFacts(project)} />
}
