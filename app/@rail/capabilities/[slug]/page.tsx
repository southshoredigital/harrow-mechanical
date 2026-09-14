import { notFound } from "next/navigation"

import { capabilities } from "@/content/capabilities"

import { SiteRail } from "../../SiteRail"

/**
 * A capability detail page's rail: the same five system links, with the
 * current one active in `color.signal` via RailIndex's own aria-current
 * styling. The pathname does that work, so no per-page prop for it.
 */

const SYSTEM_INDEX = {
  heading: "Systems",
  items: capabilities.map((capability) => ({
    label: capability.title,
    href: `/capabilities/${capability.slug}`,
  })),
}

export const dynamicParams = false

export function generateStaticParams() {
  return capabilities.map((capability) => ({ slug: capability.slug }))
}

export default async function CapabilityRail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!capabilities.some((capability) => capability.slug === slug)) notFound()

  return <SiteRail index={SYSTEM_INDEX} />
}
