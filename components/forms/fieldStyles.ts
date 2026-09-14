import { cn } from "@/lib/utils"

/**
 * Shared control styling: strong border, zero radius, mono error state.
 *
 * The border is `border.strong`, not the hairline used for rules: an empty
 * input has no text of its own, so its edge is the only thing showing where
 * to tap. Mist on paper is 1.26:1 and vanishes in sunlight; steel is 5.21:1,
 * clearing the 3:1 WCAG 1.4.11 asks of a control boundary.
 */
export function fieldClass(invalid?: boolean) {
  return cn(
    "mt-2 block min-h-[var(--tap-target)] w-full border bg-surface-page px-3 py-2 font-body text-base text-text-primary placeholder:text-text-secondary focus-ring",
    invalid ? "border-status-error" : "border-border-strong"
  )
}

export const labelClass =
  "block font-mono text-xs tracking-label uppercase text-text-primary"
