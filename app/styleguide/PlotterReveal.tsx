"use client"

import { useEffect, useState } from "react"

/**
 * The plotter reveal, demonstrated.
 *
 * Nothing on this site fades. Reveals are a clip-path wipe left to right on
 * the plotter ease, staggered so a group of elements draws in sequence. The
 * replay control exists because a reveal you can only see once is impossible
 * to review.
 *
 * Under prefers-reduced-motion the blocks are simply present.
 */

/** Watches the preference rather than reading it once, so a change takes effect live. */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(query.matches)

    sync()
    query.addEventListener("change", sync)
    return () => query.removeEventListener("change", sync)
  }, [])

  return reduced
}

const BLOCKS = [
  { label: "Mechanical", value: "AHU, chilled water, ductwork" },
  { label: "Hydraulic", value: "Pumps, heat rejection, gas" },
  { label: "Controls", value: "BMS, field devices, integration" },
] as const

export function PlotterReveal() {
  const reduced = usePrefersReducedMotion()
  const [drawn, setDrawn] = useState(false)

  // Two steps: land in the undrawn state with transitions off, then enable
  // them on the next frame so the wipe runs forward every time, including
  // on replay.
  useEffect(() => {
    if (drawn) return
    const frame = requestAnimationFrame(() => setDrawn(true))
    return () => cancelAnimationFrame(frame)
  }, [drawn])

  const open = reduced || drawn

  return (
    <div>
      <div>
        {BLOCKS.map((block, index) => (
          <div
            key={block.label}
            style={{
              clipPath: open ? "inset(0 0 0 0)" : "inset(0 100% 0 0)",
              // Longhand throughout: mixing the transition shorthand with
              // transitionDelay makes React warn and can drop the delay.
              transitionProperty: open && !reduced ? "clip-path" : "none",
              transitionDuration: "var(--duration-reveal)",
              transitionTimingFunction: "var(--ease-plotter)",
              transitionDelay: `calc(var(--stagger-reveal) * ${index})`,
            }}
            className="mt-px flex items-baseline justify-between gap-4 border-t border-border-hairline bg-surface-subtle px-4 py-4 first:mt-0"
          >
            <span className="font-mono text-xs tracking-label uppercase text-text-primary">
              {block.label}
            </span>
            <span className="font-mono text-xs tracking-mono text-text-secondary">
              {block.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setDrawn(false)}
        className="focus-ring mt-6 border border-border-strong px-4 py-2 font-mono text-xs tracking-label uppercase text-text-primary hover:bg-surface-inverse hover:text-text-inverse"
      >
        Replay
      </button>

      {reduced ? (
        <p className="mt-4 font-mono text-xs tracking-mono text-text-secondary">
          Reduced motion is on. Blocks render complete, no wipe.
        </p>
      ) : null}
    </div>
  )
}
