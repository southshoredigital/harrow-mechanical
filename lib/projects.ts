import type { RailDatum } from "@/components/sections/SpecRail"
import { projects } from "@/content/projects"
import { formatValue } from "@/content/types"
import type { Image, Project } from "@/content/types"
import type { ScheduleRow } from "@/lib/project-filters"

/** Server side project lookups. Imports the full content array. */

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}

/**
 * Most recent first, then largest first within a year. An estimator is looking
 * for recent work at a similar scale, and a fixed order keeps the schedule
 * stable when filters are applied and removed.
 */
export function scheduleRows(): ScheduleRow[] {
  return [...projects]
    .sort(
      (a, b) =>
        b.completionYear - a.completionYear ||
        b.contractValue - a.contractValue
    )
    .map((project) => ({
      slug: project.slug,
      title: project.title,
      location: project.location,
      sector: project.sector,
      systems: project.systems,
      contractValue: project.contractValue,
      durationMonths: project.durationMonths,
      completionYear: project.completionYear,
    }))
}

/**
 * The job record facts, in title block order. The rail carries them from lg
 * up and the page header carries the same list below lg, so both read from
 * here and cannot disagree.
 *
 * Completion is a year only: the content records no completion month, so
 * formatMonthYear has nothing truthful to format.
 */
export function projectFacts(project: Project): RailDatum[] {
  return [
    { label: "Contract value", value: formatValue(project.contractValue) },
    { label: "Duration", value: `${project.durationMonths} months` },
    { label: "Sector", value: project.sector },
    { label: "Systems", value: project.systems.join(", ") },
    { label: "Completed", value: String(project.completionYear) },
  ]
}

export function isPortrait(image: Image) {
  return image.height > image.width
}
