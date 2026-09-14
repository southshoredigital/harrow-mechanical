import NextImage from "next/image"

import type { Image } from "@/content/types"
import { breakpoint, layout, rail } from "@/design/tokens"
import { isPortrait } from "@/lib/projects"
import { cn } from "@/lib/utils"

/**
 * One spread of a project record: a photograph and the numbered sections that
 * sit against it.
 *
 * Photographs are always shown at their true aspect ratio, never cropped to a
 * frame. What changes with orientation is where the text goes:
 *
 * - Landscape runs full bleed across the content column, flush to the rail,
 *   and the sections follow underneath as specification clauses, heading in
 *   the left columns and text in the right.
 * - Portrait at full width would be taller than the screen, so from lg it
 *   takes five columns flush to the rail and the sections stack beside it.
 *   Below lg it is full width, where a portrait frame is the natural shape of
 *   the screen anyway.
 */

export type SpreadSection = {
  id: string
  number: string
  title: string
  body: React.ReactNode
}

type ProjectSpreadProps = {
  image?: Image
  sections: readonly SpreadSection[]
  /** The first spread's photograph is the page's largest paint. */
  lead?: boolean
}

/**
 * The content column's width, stated once from tokens for the image `sizes`
 * hints: the viewport less the rail from lg, capped at the layout maximum.
 */
const column = `min(100vw - ${rail.width}, ${layout.maxWidth})`
const SIZES = {
  landscape: `(min-width: ${breakpoint.lg}) ${column}, 100vw`,
  portrait: `(min-width: ${breakpoint.lg}) calc((${column}) * 5 / 12), 100vw`,
}

export function ProjectSpread({ image, sections, lead }: ProjectSpreadProps) {
  const portrait = image ? isPortrait(image) : false

  const photograph = image ? (
    <figure className={cn(portrait && "lg:col-span-5")}>
      <NextImage
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={portrait ? SIZES.portrait : SIZES.landscape}
        loading={lead ? "eager" : undefined}
        fetchPriority={lead ? "high" : undefined}
        className="block h-auto w-full"
      />
    </figure>
  ) : null

  if (portrait) {
    return (
      <div className="mx-auto mt-[var(--spacing-section-compact)] w-full max-w-[var(--layout-max)] lg:grid lg:grid-cols-12 lg:items-start lg:gap-12">
        {photograph}
        <div className="mt-12 px-[var(--layout-gutter)] lg:col-span-7 lg:mt-0 lg:pl-0 lg:pr-[var(--layout-gutter-wide)]">
          {sections.map((section) => (
            <Clause key={section.id} section={section} layout="stacked" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mt-[var(--spacing-section-compact)] w-full max-w-[var(--layout-max)]">
      {photograph}
      <div
        className={cn(
          "px-[var(--layout-gutter)] lg:px-[var(--layout-gutter-wide)]",
          photograph && "mt-12 lg:mt-16"
        )}
      >
        {sections.map((section) => (
          <Clause key={section.id} section={section} layout="split" />
        ))}
      </div>
    </div>
  )
}

/**
 * A numbered clause. The number is the section identifier, in mono and hidden
 * from screen readers, which hear the heading as a plain title.
 */
function Clause({
  section,
  layout,
}: {
  section: SpreadSection
  layout: "split" | "stacked"
}) {
  const split = layout === "split"

  return (
    <section
      aria-labelledby={section.id}
      className={cn(
        "mt-16 border-t border-border-strong pt-6 first:mt-0",
        split && "lg:grid lg:grid-cols-12 lg:gap-12"
      )}
    >
      <h2
        id={section.id}
        className={cn(
          "flex items-baseline gap-4 font-display text-xl tracking-display text-text-primary",
          split && "lg:col-span-3"
        )}
      >
        <span
          aria-hidden="true"
          className="font-mono text-xs tracking-label text-text-secondary"
        >
          {section.number}
        </span>
        {section.title}
      </h2>
      <div
        className={cn("mt-6 max-w-[var(--measure)]", split && "lg:col-span-9 lg:mt-0")}
      >
        {section.body}
      </div>
    </section>
  )
}
