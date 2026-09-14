import type { Metadata } from "next"

import { accreditations } from "@/content/accreditations"
import { capabilities } from "@/content/capabilities"
import { documents } from "@/content/documents"
import { projects } from "@/content/projects"
import { roles } from "@/content/roles"
import { safetyStatistics } from "@/content/safety"
import { formatMonthYear, formatValue } from "@/content/types"
import type { Capability, Project, Role } from "@/content/types"

import { clip, pageMetadata } from "./metadata"
import { SITE } from "./site"

/**
 * Title and description for every route, in one place.
 *
 * Written for the searches facility managers and estimators actually run:
 * the plant (chiller, AHU, BMS, hydronic), the discipline (commissioning,
 * maintenance), the building type and the location. Not "commercial
 * contractor" or "HVAC solutions".
 *
 * Every figure is derived from content/ where content holds it, so a new
 * project or role changes the description with it.
 */

const values = projects.map((project) => project.contractValue)
const VALUE_RANGE = `${formatValue(Math.min(...values))} to ${formatValue(Math.max(...values))}`

export const homeMetadata: Metadata = pageMetadata({
  title: `${SITE.name}: chiller, AHU and BMS contractor, Melbourne`,
  description: `Dandenong South contractor since ${SITE.founded}: chiller plant, AHUs, BMS and hydronic works for hospitals, schools and data centres. Contracts $400k to $4.2m.`,
  path: "/",
})

export const projectsMetadata: Metadata = pageMetadata({
  title: "Chiller, AHU and BMS projects by sector and contract value",
  description: `${projects.length} mechanical services contracts, ${VALUE_RANGE}: chiller plant, AHU, BMS and hydronic work in hospitals, schools, data centres and industrial buildings.`,
  path: "/projects",
})

export function projectMetadata(project: Project): Metadata {
  return pageMetadata({
    title: project.title,
    description: clip(
      `${formatValue(project.contractValue)} ${project.sector.toLowerCase()} contract, ${project.durationMonths} months, completed ${project.completionYear}. ${project.brief}`
    ),
    path: `/projects/${project.slug}`,
  })
}

export const capabilitiesMetadata: Metadata = pageMetadata({
  title: "Chiller, AHU, BMS, hydronic and commissioning services",
  description:
    "Chiller plant to 2MW, AHUs, hydronic reticulation DN50 to DN300, BMS and DDC controls, commissioning to AIRAH DA27 and DA28, and maintenance from $40k a year.",
  path: "/capabilities",
})

/**
 * One search target per system, keyed by slug. A capability without an entry
 * throws during static generation, so the build fails rather than shipping a
 * page with a generic title.
 */
const CAPABILITY_SEO: Record<string, { title: string; description: string }> = {
  mechanical: {
    title: "Chiller plant and AHU installation, Melbourne",
    description:
      "Water and air cooled chiller plant to 2MW, AHUs, VAV and CAV systems and DW/144 ductwork for hospitals, labs and data centres from 2,000 to 40,000 m2.",
  },
  hydraulic: {
    title: "Hydronic heating and chilled water pipework, Melbourne",
    description:
      "Chilled, condenser and hydronic heating water reticulation, DN50 to DN300, welded and pressure tested to AS 4041, with pump staging, glycol and trade waste.",
  },
  controls: {
    title: "BMS and DDC controls contractor, Melbourne",
    description:
      "DDC and BMS design, programming and head end replacement. BACnet/IP and Modbus integration, VAV and VRF sequencing, and metering for NABERS.",
  },
  commissioning: {
    title: "HVAC commissioning and air and water balancing, Melbourne",
    description:
      "Air and water balancing to AIRAH DA27 and DA28, integrated systems testing and witnessed performance testing for hospitals, labs and data centres.",
  },
  maintenance: {
    title: "Chiller and HVAC maintenance contracts, Melbourne",
    description:
      "Scheduled and 24 hour reactive maintenance for chiller plant, AHUs and BMS, $40k to $180k a year, with essential safety measures and AS/NZS 3666.3 testing.",
  },
}

export function capabilityMetadata(capability: Capability): Metadata {
  const seo = CAPABILITY_SEO[capability.slug]
  if (!seo) throw new Error(`No SEO copy for capability "${capability.slug}"`)

  return pageMetadata({ ...seo, path: `/capabilities/${capability.slug}` })
}

export const complianceMetadata: Metadata = pageMetadata({
  title: "ISO 9001, ISO 45001, VBA registration and insurance currency",
  description: `${accreditations.length} current accreditations including ISO 9001 and ISO 45001. LTIFR ${safetyStatistics.ltifr.toFixed(1)} and TRIFR ${safetyStatistics.trifr.toFixed(1)} over ${safetyStatistics.hoursWorked.toLocaleString("en-AU")} hours to ${formatMonthYear(safetyStatistics.periodEnd)}.`,
  path: "/compliance",
})

export const documentsMetadata: Metadata = pageMetadata({
  title: "Certificates of currency, licences and ISO certification",
  description: `${documents.length} PDFs for tender pre-qualification: public liability and workers compensation certificates of currency, PIC and ARCtick licences, ISO 9001.`,
  path: "/compliance/documents",
})

export const careersMetadata: Metadata = pageMetadata({
  title: "Refrigeration mechanic and controls technician jobs, Dandenong South",
  description: clip(
    `${roles.length} open roles: ${roles.map((role) => role.title).join(", ")}. Commercial chiller, BMS and hydronic work across Melbourne.`
  ),
  path: "/careers",
})

export function roleMetadata(role: Role): Metadata {
  return pageMetadata({
    title: `${role.title} job, Dandenong South`,
    description: clip(
      `${role.type}${role.ticket ? `, ${role.ticket} required` : ""}. ${role.description[0]}`
    ),
    path: `/careers/${role.slug}`,
  })
}

export const aboutMetadata: Metadata = pageMetadata({
  title: `Mechanical services contractor since ${SITE.founded}, Dandenong South`,
  description: `Founded ${SITE.founded} in Dandenong South. ${SITE.staff} staff, ${projects.length} projects on record, ${accreditations.length} current accreditations and contracts from ${SITE.contractRange}.`,
  path: "/about",
})

export const contactMetadata: Metadata = pageMetadata({
  title: "Tender enquiry, HVAC service call or careers application",
  description: `Three separate paths: a tender enquiry to estimating, a routine, urgent or emergency service call, or an application for one of ${roles.length} open roles.`,
  path: "/contact",
})

/**
 * Review routes. Not in the content plan, not in the sitemap, and marked
 * noindex explicitly so they stay out even if the root robots rule changes.
 */
function reviewRoute(title: string, path: string): Metadata {
  return {
    ...pageMetadata({ title, description: `${title}, internal review route.`, path }),
    robots: { index: false, follow: false },
  }
}

export const styleguideMetadata = reviewRoute("Styleguide", "/styleguide")
export const iconsMetadata = reviewRoute("Icon check", "/icons")
export const riserMetadata = reviewRoute("Riser check", "/riser")

/** Every route that belongs in the sitemap. */
export function sitemapPaths() {
  return [
    "/",
    "/projects",
    ...projects.map((project) => `/projects/${project.slug}`),
    "/capabilities",
    ...capabilities.map((capability) => `/capabilities/${capability.slug}`),
    "/compliance",
    "/compliance/documents",
    "/careers",
    ...roles.map((role) => `/careers/${role.slug}`),
    "/about",
    "/contact",
  ]
}
