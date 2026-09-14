import { capabilities } from "@/content/capabilities"

import { SiteRail } from "../SiteRail"

/** The capability index: rail carries the five system links, none active yet. */

const SYSTEM_INDEX = {
  heading: "Systems",
  items: capabilities.map((capability) => ({
    label: capability.title,
    href: `/capabilities/${capability.slug}`,
  })),
}

export default function CapabilitiesRail() {
  return <SiteRail index={SYSTEM_INDEX} />
}
