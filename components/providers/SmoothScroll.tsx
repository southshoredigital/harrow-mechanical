"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import "lenis/dist/lenis.css"

import { motion } from "@/design/tokens"

gsap.registerPlugin(ScrollTrigger)

/**
 * Smooth scroll, wired so there is exactly one scroll position on the page.
 *
 * GSAP's ticker drives Lenis, and Lenis tells ScrollTrigger when the position
 * changed. Without this the two run independent loops off the native scroll
 * event and scroll linked animations lag behind the content they pin to.
 *
 * Under prefers-reduced-motion Lenis is not started at all: native scroll,
 * and ScrollTrigger falls back to its own listener. The preference is watched,
 * so changing it mid session takes effect without a reload.
 *
 * Renders nothing.
 */
export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    let lenis: Lenis | null = null

    const raf = (time: number) => {
      // GSAP ticker time is seconds, Lenis wants milliseconds.
      lenis?.raf(time * 1000)
    }

    const start = () => {
      if (lenis) return

      lenis = new Lenis({
        lerp: motion.scroll.lerp,
        // GSAP owns the loop, so Lenis must not start its own.
        autoRaf: false,
        // Anchor jumps stay native so the browser still moves focus to the
        // target. The skip link has to keep working.
        anchors: false,
      })
      lenisRef.current = lenis

      lenis.on("scroll", ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    const stop = () => {
      if (!lenis) return

      gsap.ticker.remove(raf)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      lenis = null
      lenisRef.current = null
    }

    const sync = () => {
      if (query.matches) stop()
      else start()
    }

    sync()
    query.addEventListener("change", sync)

    return () => {
      query.removeEventListener("change", sync)
      stop()
    }
  }, [])

  useResetScrollOnNavigate(lenisRef)

  return null
}

/**
 * Lands every client-side navigation at the top of the new page.
 *
 * Lenis keeps its own idea of the scroll position (`targetScroll` and
 * `animatedScroll`) independent of the DOM, since that is what lets it lerp
 * smoothly rather than track the native value 1:1. The App Router resets the
 * native scroll position on navigation, but never touches Lenis: on the next
 * tick Lenis reads a native position of 0 against a target left over from
 * wherever the previous page was scrolled to, and lerps back toward it,
 * which is the "lands partway down" symptom. `lenis.scrollTo(0, { immediate:
 * true })` sets both values at once with no animation, which is what a plain
 * `window.scrollTo(0, 0)` cannot do.
 *
 * That reset has to be skipped for back/forward navigation, where the
 * correct outcome is the opposite: restore the previous position rather
 * than jump to the top. `usePathname` alone cannot distinguish the two, so a
 * `popstate` listener marks the next pathname change as history navigation.
 * A hash-only link never changes the pathname, so this effect does not run
 * for one and the browser's native anchor jump is left alone.
 */
function useResetScrollOnNavigate(lenisRef: React.RefObject<Lenis | null>) {
  const pathname = usePathname()
  const isPopNavigation = useRef(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const onPopState = () => {
      isPopNavigation.current = true
      // Nothing consumes the flag if this popstate did not change the
      // pathname (a hash-only history entry, say), so clear it on the next
      // tick rather than let it suppress a later, unrelated navigation.
      window.setTimeout(() => {
        isPopNavigation.current = false
      }, 0)
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  useEffect(() => {
    // The initial load: whatever scroll position the browser already
    // applied (top, or a restored reload position) is correct as is.
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    if (isPopNavigation.current) {
      isPopNavigation.current = false
      return
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, lenisRef])
}
