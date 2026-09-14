import { cn } from "@/lib/utils"

/** Shared control styling: hairline border, zero radius, mono error state. */
export function fieldClass(invalid?: boolean) {
  return cn(
    "mt-2 block min-h-[var(--tap-target)] w-full border bg-surface-page px-3 py-2 font-body text-base text-text-primary placeholder:text-text-secondary focus-ring",
    invalid ? "border-status-error" : "border-border-hairline"
  )
}

export const labelClass =
  "block font-mono text-xs tracking-label uppercase text-text-primary"
