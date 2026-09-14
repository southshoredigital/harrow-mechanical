import type Lenis from "lenis"

/**
 * The live Lenis instance, for the components that need to read its scroll.
 *
 * SmoothScroll owns the instance and publishes it here. A scroll linked
 * component subscribes and wires Lenis into its own animation library, so
 * GSAP and ScrollTrigger load only on the routes that animate with them
 * rather than on every page from the root layout.
 *
 * The listener is called immediately with the current value, and again every
 * time Lenis starts or stops (a reduced motion change mid session).
 */

type Listener = (lenis: Lenis | null) => void

let current: Lenis | null = null
const listeners = new Set<Listener>()

export function publishLenis(lenis: Lenis | null) {
  current = lenis
  listeners.forEach((listener) => listener(lenis))
}

export function subscribeLenis(listener: Listener) {
  listeners.add(listener)
  listener(current)
  return () => {
    listeners.delete(listener)
  }
}
