import { RiserSchematic } from "@/components/sections/RiserSchematic"
import type {
  RiserBranchKey,
  RiserSchematicProps,
} from "@/components/sections/RiserSchematic"
import { capabilities } from "@/content/capabilities"

/**
 * Temporary route. Exercises the riser schematic in isolation, with real
 * capability content above and below it so the scroll linked plotting has
 * something to run against. Not part of the content plan, remove before
 * launch, the same way /icons goes.
 */

function bySlug(slug: string) {
  const found = capabilities.find((capability) => capability.slug === slug)
  if (!found) throw new Error(`No capability content for "${slug}"`)
  return found
}

/** The capability slugs and the schematic branch keys are the same three. */
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

/** The two capabilities the schematic does not draw. Used as the tail content. */
const TAIL = ["commissioning", "maintenance"].map(bySlug)

export default function RiserCheckPage() {
  return (
    <div className="pb-48">
      <header className="mx-auto w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] pt-16 xl:px-[var(--layout-gutter-wide)]">
        <p className="font-mono text-xs tracking-label uppercase text-text-secondary">
          Riser check / temporary
        </p>
        <h1 className="mt-4 max-w-[var(--measure)] font-display text-3xl tracking-display text-text-primary">
          Capabilities
        </h1>
      </header>

      {/* Above the schematic: the full capability index, as the page would carry it. */}
      <section
        aria-label="Capability index"
        className="mx-auto mt-24 w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] xl:px-[var(--layout-gutter-wide)]"
      >
        <dl className="border-t border-border-hairline">
          {capabilities.map((capability, index) => (
            <div
              key={capability.slug}
              className="grid gap-4 border-b border-border-hairline py-8 lg:grid-cols-[6rem_14rem_1fr] lg:gap-8"
            >
              <dt className="font-mono text-xs tracking-label uppercase text-text-secondary lg:order-2">
                {capability.title}
              </dt>
              <p className="font-mono text-xs tracking-mono text-text-secondary lg:order-1">
                {String(index + 1).padStart(2, "0")}
              </p>
              <dd className="max-w-[var(--measure)] text-base text-text-secondary lg:order-3">
                {capability.summary}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-32">
        <RiserSchematic
          title="Mechanical, hydraulic and controls in one riser"
          branches={branches}
        />
      </div>

      {/* Below the schematic: the two capabilities it does not draw. */}
      {TAIL.map((capability) => (
        <section
          key={capability.slug}
          aria-labelledby={`tail-${capability.slug}`}
          className="mx-auto mt-32 w-full max-w-[var(--layout-max)] px-[var(--layout-gutter)] xl:px-[var(--layout-gutter-wide)]"
        >
          <h2
            id={`tail-${capability.slug}`}
            className="font-display text-xl tracking-display text-text-primary"
          >
            {capability.title}
          </h2>

          {capability.detail.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-6 max-w-[var(--measure)] text-base text-text-secondary"
            >
              {paragraph}
            </p>
          ))}

          <ul className="mt-12 max-w-[var(--measure)] border-t border-border-hairline">
            {capability.scope.map((item, index) => (
              <li
                key={item}
                className="flex gap-4 border-b border-border-hairline py-3"
              >
                <span className="font-mono text-xs tracking-mono text-text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
