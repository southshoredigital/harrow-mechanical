"use client"

import { useEffect } from "react"
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

  return null
}
