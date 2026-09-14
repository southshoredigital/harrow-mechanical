import {
  Commissioning,
  Controls,
  Hydraulic,
  Maintenance,
  Mechanical,
} from "@/components/icons"
import { capabilities } from "@/content/capabilities"
import type { System } from "@/content/types"

/** Server side capability lookups. Imports the full content array. */

export const ICON_BY_SYSTEM: Record<System, typeof Mechanical> = {
  Mechanical,
  Hydraulic,
  Controls,
  Commissioning,
  Maintenance,
}

export function getCapability(slug: string) {
  return capabilities.find((capability) => capability.slug === slug)
}
