import { projects } from "@/content/projects"
import { getProject, projectFacts } from "@/lib/projects"
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og"

/**
 * A project record's social image: the job's own figures in the rail. This
 * is the page an estimator is most likely to forward, so the card carries
 * the contract value rather than the generic site image.
 *
 * Prerendered for every slug, so the font files are only ever read at build
 * and nothing depends on them being traced into a serverless function.
 */

export const dynamicParams = false

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export const alt =
  "Harrow Mechanical project record: title, contract value, duration, sector, systems and completion year"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const project = getProject((await params).slug)
  if (!project) throw new Error("Unknown project")

  return renderOgImage({
    eyebrow: `Project record / ${project.location}`,
    heading: project.title,
    headingSize: "xl",
    facts: projectFacts(project),
  })
}
