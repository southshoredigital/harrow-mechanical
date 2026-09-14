import { projects } from "@/content/projects"
import { SITE } from "@/lib/seo"
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/seo/og"
import { SITE_IMAGE_ALT } from "@/lib/seo/og-shared"

/** The site wide social image. Project records override it with their own. */

export const alt = SITE_IMAGE_ALT
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return renderOgImage({
    eyebrow: `${SITE.locality} / est. ${SITE.founded}`,
    heading:
      "Mechanical, hydraulic and controls contracting for buildings that cannot go offline.",
    headingSize: "lg",
    facts: [
      { label: "Founded", value: String(SITE.founded) },
      { label: "Staff", value: String(SITE.staff) },
      { label: "Projects", value: String(projects.length) },
      { label: "Contract range", value: SITE.contractRange },
    ],
  })
}
