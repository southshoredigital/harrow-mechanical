import { SpecRail } from "@/components/sections/SpecRail"
import type { RailDatum } from "@/components/sections/SpecRail"
import { SITE_SECTIONS } from "@/content/sections"

/**
 * The rail as every page renders it: the same identifier and section index,
 * with page contextual data where a page has some.
 *
 * The rail is a parallel route slot (@rail) rather than a fixed element in the
 * root layout, because a layout cannot see which page is under it and the
 * rail's data belongs to the page. A route that carries data adds its own page
 * inside @rail; everything else falls through to the catch-all.
 */
export function SiteRail({ data }: { data?: readonly RailDatum[] }) {
  return (
    <SpecRail identifier="Harrow Mechanical" sections={SITE_SECTIONS} data={data} />
  )
}
