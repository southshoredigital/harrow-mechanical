import { expect, test } from "@playwright/test"

import { openSettled } from "./support/page"
import { ALL_ROUTES } from "./support/routes"

/**
 * Bright sunlight legibility.
 *
 * WCAG lets large text drop to 3:1. A phone screen in direct sun washes
 * contrast out across the board, so this gate removes that allowance: every
 * run of rendered text, at every size, must clear 4.5:1 against the surface
 * it actually sits on. Body copy set in the body face must clear 5:1, the
 * floor `steel` was chosen for.
 *
 * Measured from computed styles in the browser, not from the token file, so
 * it catches a wrong utility class as well as a wrong token.
 */

const ANY_TEXT_MIN = 4.5
const BODY_TEXT_MIN = 5

type Failure = { text: string; ratio: number; min: number; fg: string; bg: string }

for (const path of ALL_ROUTES) {
  test(`sunlight contrast: ${path}`, async ({ page }) => {
    await openSettled(page, path)

    const failures: Failure[] = await page.evaluate(
      ({ anyMin, bodyMin }) => {
        const parse = (value: string) => {
          const match = value.match(/rgba?\(([^)]+)\)/)
          if (!match) return null
          const [r, g, b, a = 1] = match[1].split(/[ ,/]+/).filter(Boolean).map(Number)
          return { r, g, b, a }
        }

        const luminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
          const channel = (c: number) => {
            const s = c / 255
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
          }
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
        }

        const background = (el: Element | null) => {
          for (let node = el; node; node = node.parentElement) {
            const bg = parse(getComputedStyle(node).backgroundColor)
            if (bg && bg.a > 0) return bg
          }
          return { r: 255, g: 255, b: 255, a: 1 }
        }

        const isBodyFace = (el: Element) =>
          getComputedStyle(el).fontFamily.toLowerCase().includes("switzer")

        const results: Failure[] = []
        const seen = new Set<Element>()
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)

        for (let node = walker.nextNode(); node; node = walker.nextNode()) {
          const el = node.parentElement
          if (!el || seen.has(el) || !node.textContent?.trim()) continue
          seen.add(el)

          // Drawn text inside the schematic is covered by its text alternative;
          // script and style content is not rendered.
          if (el.closest("svg, script, style, noscript, [aria-hidden='true'] input")) continue
          if (el.closest(":disabled")) continue

          const style = getComputedStyle(el)
          const box = el.getBoundingClientRect()
          const clipped = style.clip === "rect(0px, 0px, 0px, 0px)" || el.closest(".sr-only")
          if (clipped || box.width === 0 || box.height === 0) continue
          if (style.visibility === "hidden" || el.closest("[hidden]")) continue

          const fg = parse(style.color)
          if (!fg) continue
          const bg = background(el)
          const l1 = luminance(fg)
          const l2 = luminance(bg)
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
          const min = isBodyFace(el) ? bodyMin : anyMin

          if (ratio < min) {
            results.push({
              text: node.textContent.trim().slice(0, 60),
              ratio: Math.round(ratio * 100) / 100,
              min,
              fg: style.color,
              bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`,
            })
          }
        }

        return results
      },
      { anyMin: ANY_TEXT_MIN, bodyMin: BODY_TEXT_MIN }
    )

    expect(failures, JSON.stringify(failures, null, 2)).toEqual([])
  })
}

/**
 * Form control boundaries. An input has no text of its own to identify it,
 * so its border is the only thing marking where to tap: WCAG 1.4.11 asks
 * 3:1, and in sunlight a hairline in `mist` disappears entirely.
 */
test("sunlight contrast: form control boundaries", async ({ page }) => {
  await openSettled(page, "/contact")

  const weak = await page
    .getByRole("tabpanel")
    .locator("input:not([tabindex='-1']), select, textarea")
    .evaluateAll((controls) => {
      const lum = (value: string) => {
        const [r, g, b] = value.match(/\d+(\.\d+)?/g)!.slice(0, 3).map(Number)
        const c = (v: number) => {
          const s = v / 255
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
        }
        return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b)
      }
      return controls
        .map((control) => {
          const style = getComputedStyle(control)
          const a = lum(style.borderTopColor)
          const b = lum(style.backgroundColor)
          const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
          return { name: control.getAttribute("name"), ratio: Math.round(ratio * 100) / 100 }
        })
        .filter((result) => result.ratio < 3)
    })

  expect(weak, JSON.stringify(weak, null, 2)).toEqual([])
})
