import Link from "next/link"

import { RiserSchematic } from "@/components/sections/RiserSchematic"
import { Figures } from "@/components/typography/Figures"
import type {
  RiserBranchKey,
  RiserSchematicProps,
} from "@/components/sections/RiserSchematic"
import { capabilities } from "@/content/capabilities"
import { ICON_BY_SYSTEM } from "@/lib/capabilities"
import {
  JsonLd,
  breadcrumbList,
  capabilitiesMetadata,
  graph,
  service,
} from "@/lib/seo"

export const metadata = capabilitiesMetadata

/**
 * Capabilities. Leads with the riser schematic, the memorable moment, then
 * the five system capabilities as an index into /capabilities/[slug].
 */

function bySlug(slug: RiserBranchKey) {
  const found = capabilities.find((capability) => capability.slug === slug)
  if (!found) throw new Error(`No capability content for "${slug}"`)
  return found
}

function branchContent(key: RiserBranchKey) {
  const capability = bySlug(key)
  return {
    label: capability.title,
    summary: capability.summary,
    scope: capability.scope,
  }
}

const branches: RiserSchematicProps["branches"] = {
  mechanical: branchContent("mechanical"),
  hydraulic: branchContent("hydraulic"),
  controls: branchContent("controls"),
}

export default function CapabilitiesPage() {
  return (
    <div className="pb-[var(--spacing-section-generous)]">
      <JsonLd
        data={graph(
          breadcrumbList([{ name: "Capabilities", path: "/capabilities" }]),
          ...capabilities.map(service)
        )}
      />
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 lg:px-[var(--layout-gutter-wide)] lg:pt-24">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Capability by system
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary lg:text-4xl">
          Mechanical, hydraulic and controls in one riser, commissioned and
          maintained after handover.
        </h1>
        <p className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary">
          Scroll to see how the three services occupy the same building.
          Commissioning and maintenance follow below, once the plant is in.
        </p>
      </header>

      <div className="mt-[var(--spacing-section-default)]">
        <RiserSchematic
          title="Mechanical, hydraulic and controls in one riser"
          branches={branches}
        />
      </div>

      <section
        aria-labelledby="capability-index-heading"
        className="mx-auto mt-[var(--spacing-section-default)] w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]"
      >
        <h2
          id="capability-index-heading"
          className="border-t border-border-strong pt-6 font-display text-xl tracking-display text-text-primary"
        >
          Every system
        </h2>

        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.map((capability, index) => {
            const Icon = ICON_BY_SYSTEM[capability.title]

            return (
              <li key={capability.slug} className="border border-border-hairline">
                <Link
                  href={`/capabilities/${capability.slug}`}
                  className="focus-ring flex h-full flex-col gap-4 p-6"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-text-primary" aria-hidden="true" />
                    <span className="font-mono text-xs tracking-mono text-text-secondary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className="font-mono text-xs tracking-label uppercase text-text-primary">
                    {capability.title}
                  </span>
                  <p className="text-sm text-text-secondary"><Figures text={capability.summary} /></p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
