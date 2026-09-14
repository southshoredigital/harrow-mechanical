"use client"

import { useId, useRef, useState } from "react"
import type { KeyboardEvent } from "react"

import { CareersForm } from "./CareersForm"
import { ServiceForm } from "./ServiceForm"
import { TenderForm } from "./TenderForm"
import { cn } from "@/lib/utils"

const PATHS = [
  {
    key: "tender",
    label: "Tender enquiry",
    description:
      "You're a head contractor or asset owner with a package to price.",
  },
  {
    key: "service",
    label: "Service call",
    description: "You manage a building and something needs attention.",
  },
  {
    key: "careers",
    label: "Careers",
    description: "You're a tradesperson looking at one of our open roles.",
  },
] as const

type PathKey = (typeof PATHS)[number]["key"]

/**
 * Three distinct forms behind a tab switcher, not one form with a type
 * dropdown: each path has its own fields, its own route and its own
 * confirmation copy, so the tabs are the only thing they share.
 *
 * Keyboard follows the WAI-ARIA tabs pattern: the tab list is one stop in the
 * Tab sequence, arrow keys, Home and End move between paths and select as
 * they go, and Tab from the selected tab lands in its form.
 */
export function ContactForms() {
  const [active, setActive] = useState<PathKey>("tender")
  const tablistId = useId()
  const tabRefs = useRef<Partial<Record<PathKey, HTMLButtonElement | null>>>({})

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = PATHS.findIndex((path) => path.key === active)
    const last = PATHS.length - 1
    const next = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key]

    if (next === undefined) return
    event.preventDefault()
    const key = PATHS[next].key
    setActive(key)
    tabRefs.current[key]?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Contact path"
        className="flex flex-wrap gap-px border-y border-border-hairline"
      >
        {PATHS.map((path) => {
          const selected = path.key === active
          return (
            <button
              key={path.key}
              ref={(el) => {
                tabRefs.current[path.key] = el
              }}
              type="button"
              role="tab"
              id={`${tablistId}-tab-${path.key}`}
              aria-selected={selected}
              aria-controls={`${tablistId}-panel-${path.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(path.key)}
              onKeyDown={onTabKeyDown}
              className={cn(
                "focus-ring min-h-[var(--tap-target)] flex-1 border border-border-hairline px-4 font-mono text-xs tracking-label uppercase",
                selected
                  ? "border-border-strong bg-surface-inverse text-text-inverse"
                  : "text-text-primary hover:bg-surface-subtle"
              )}
            >
              {path.label}
            </button>
          )
        })}
      </div>

      {PATHS.map((path) => (
        <p
          key={path.key}
          hidden={path.key !== active}
          className="mt-6 max-w-[var(--measure)] font-body text-base text-text-secondary"
        >
          {path.description}
        </p>
      ))}

      {PATHS.map((path) => (
        <div
          key={path.key}
          role="tabpanel"
          id={`${tablistId}-panel-${path.key}`}
          aria-labelledby={`${tablistId}-tab-${path.key}`}
          hidden={path.key !== active}
        >
          {path.key === "tender" ? <TenderForm /> : null}
          {path.key === "service" ? <ServiceForm /> : null}
          {path.key === "careers" ? <CareersForm /> : null}
        </div>
      ))}
    </div>
  )
}
