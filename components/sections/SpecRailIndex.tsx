"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import type { RailSection } from "./SpecRail"

/**
 * The parts of the rail that have to know where the reader is.
 *
 * This is the only client code in the rail, and it holds no state: it reads
 * the pathname and nothing else. SpecRail itself stays a server component.
 */

/** Every number in the rail is two digit, like a drawing set. */
function pad(value: number) {
  return String(value).padStart(2, "0")
}

/** Sheet numbers are one based. */
function sheetNumber(index: number) {
  return pad(index + 1)
}

function useActiveIndex(sections: readonly RailSection[]) {
  const pathname = usePathname()

  return sections.findIndex(
    (section) =>
      pathname === section.href || pathname.startsWith(`${section.href}/`)
  )
}

/**
 * Brings the active item inside the horizontal scroller, moving the least
 * distance that does the job so an item near the start leaves the items after
 * it clipped, which is what tells the reader there is more to the right.
 *
 * Sets scrollLeft directly rather than calling scrollIntoView, which would
 * also move the page vertically underneath a sticky element.
 */
function alignActiveItem(
  container: HTMLElement | null,
  active: HTMLElement | null
) {
  if (!container || !active) return

  const containerBox = container.getBoundingClientRect()
  const activeBox = active.getBoundingClientRect()
  const overflowLeft = activeBox.left - containerBox.left
  const overflowRight = activeBox.right - containerBox.right

  if (overflowLeft < 0) container.scrollLeft += overflowLeft
  else if (overflowRight > 0) container.scrollLeft += overflowRight
}

/**
 * Numbered section index. Active state is colour plus weight plus
 * aria-current, so it never rests on colour alone.
 *
 * One index, two arrangements: a column in the fixed rail, a horizontally
 * scrolling row in the sticky strip below `lg`. The items themselves are the
 * same markup in both.
 */
export function RailIndex({
  sections,
  orientation = "column",
}: {
  sections: readonly RailSection[]
  orientation?: "column" | "row"
}) {
  const activeIndex = useActiveIndex(sections)
  const isRow = orientation === "row"

  const containerRef = useRef<HTMLOListElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!isRow) return

    const align = () => alignActiveItem(containerRef.current, activeRef.current)

    align()

    // Item widths move when the self-hosted faces swap in, so measure again
    // once they have landed.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) align()
    })

    return () => {
      cancelled = true
    }
  }, [isRow, activeIndex])

  return (
    <ol
      ref={containerRef}
      className={cn(
        isRow
          ? "flex h-[var(--rail-mobile-index-height)] items-stretch overflow-x-auto"
          : "flex flex-col"
      )}
    >
      {sections.map((section, index) => {
        const isActive = index === activeIndex

        return (
          <li
            key={section.href}
            ref={isActive ? activeRef : undefined}
            className={cn(isRow ? "shrink-0" : "mt-3 first:mt-0")}
          >
            <Link
              href={section.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "focus-ring",
                isRow
                  ? "flex h-full items-center gap-2 pr-6"
                  : "grid grid-cols-[2.5ch_1fr] items-baseline gap-3",
                isActive
                  ? "font-medium text-text-accent"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <span aria-hidden="true">{sheetNumber(index)}</span>
              <span>{section.label}</span>
            </Link>
          </li>
        )
      })}
    </ol>
  )
}

/** Title block sheet reference, bottom of the desktop rail. */
export function RailSheet({ sections }: { sections: readonly RailSection[] }) {
  const activeIndex = useActiveIndex(sections)
  if (activeIndex < 0) return null

  return <p>Sheet {sheetNumber(activeIndex)} of {pad(sections.length)}</p>
}

/** Current section, right hand end of the mobile strip. */
export function RailCurrent({ sections }: { sections: readonly RailSection[] }) {
  const activeIndex = useActiveIndex(sections)
  if (activeIndex < 0) return null

  return (
    <p className="truncate text-text-accent">
      <span aria-hidden="true">{sheetNumber(activeIndex)} / </span>
      {sections[activeIndex].label}
    </p>
  )
}
