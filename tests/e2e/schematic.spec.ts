import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { openSettled } from "./support/page"

/**
 * The riser schematic plots with scroll, with motion allowed.
 *
 * Scrolls by wheel, so Lenis handles the input and its scroll events are
 * what ScrollTrigger reads: this is the test that the one scroll position
 * wiring between the two holds, not just that the drawing exists.
 */

const SIGNAL = "rgb(226, 82, 27)"

/** The schematic, not the capability icons, which are also role=img. */
const FIGURE = 'svg[role="img"]:has([data-branch])'

async function hiddenPathCount(page: Page) {
  return page.locator('svg[role="img"] [data-branch] [data-part] path').evaluateAll(
    (paths) =>
      paths.filter((path) => {
        const style = getComputedStyle(path)
        return style.strokeDasharray !== "none" && parseFloat(style.strokeDashoffset) > 1
      }).length
  )
}

/** Branches currently drawn in the active stroke. */
async function activeBranches(page: Page) {
  return page.locator('svg[role="img"] [data-branch]').evaluateAll(
    (groups, signal) =>
      groups.filter((g) => getComputedStyle(g).stroke === signal).map((g) => g.getAttribute("data-branch")),
    SIGNAL
  )
}

async function figurePosition(page: Page) {
  return page
    .locator(FIGURE)
    .evaluate((svg) => getComputedStyle(svg.parentElement!).position)
}

test.describe("from lg: sticky figure beside the text", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("plots progressively as the reader scrolls, and lands complete", async ({ page, isMobile }) => {
    test.skip(isMobile, "Wheel input is a desktop gesture; the phone layout is tested below.")
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await openSettled(page, "/capabilities")

    const total = await page.locator('svg[role="img"] [data-branch] [data-part] path').count()
    const atTop = await hiddenPathCount(page)
    expect(atTop, "nothing should be plotted before the sequence starts").toBe(total)

    const heading = page.getByRole("heading", { level: 3, name: "Hydraulic" })
    const sequenceMidpoint = async () => {
      for (let i = 0; i < 60; i++) {
        await page.mouse.wheel(0, 400)
        await page.waitForTimeout(50)
        const box = await heading.boundingBox()
        if (box && box.y < 450) return
      }
    }
    await sequenceMidpoint()
    await page.waitForTimeout(800)

    const midway = await hiddenPathCount(page)
    expect(midway, "part way through, some but not all lines have plotted").toBeLessThan(total)
    expect(midway).toBeGreaterThan(0)

    for (let i = 0; i < 40; i++) await page.mouse.wheel(0, 600)
    await page.waitForTimeout(1500)
    expect(await hiddenPathCount(page), "past the sequence, the drawing is complete").toBe(0)
  })
})

test.describe("lg to xl: figure pinned above the text", () => {
  test.use({ viewport: { width: 1100, height: 800 } })

  test("keeps the sticky figure", async ({ page, isMobile }) => {
    test.skip(isMobile, "Viewport set explicitly; one run is enough.")
    await openSettled(page, "/capabilities")
    expect(await figurePosition(page)).toBe("sticky")
  })
})

test.describe("below lg: drawing first, then the text", () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test("the figure is in the flow, not pinned over the text", async ({ page }) => {
    await openSettled(page, "/capabilities")
    expect(await figurePosition(page)).not.toBe("sticky")

    // The whole drawing fits on screen with room to spare, and the first
    // branch's text starts below it rather than passing underneath.
    const figure = await page.locator(FIGURE).boundingBox()
    expect(figure!.height).toBeLessThan(844 * 0.6)
    const figureBottom = await page
      .locator(FIGURE)
      .evaluate((svg) => svg.parentElement!.getBoundingClientRect().bottom + scrollY)
    const firstHeading = await page
      .getByRole("heading", { level: 3, name: "Mechanical" })
      .evaluate((h) => h.getBoundingClientRect().top + scrollY)
    expect(firstHeading).toBeGreaterThan(figureBottom)
  })

  test("under reduced motion, renders complete with no active branch", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openSettled(page, "/capabilities")
    expect(await hiddenPathCount(page)).toBe(0)
    expect(await activeBranches(page)).toEqual([])
  })

  test("plots as it comes into view, then settles with no active branch", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" })
    await openSettled(page, "/capabilities")

    const total = await page.locator('svg[role="img"] [data-branch] [data-part] path').count()
    expect(await hiddenPathCount(page)).toBe(total)

    const figure = page.locator(FIGURE)
    const figureTop = await figure.evaluate((svg) => svg.parentElement!.getBoundingClientRect().top + scrollY)
    const figureHeight = await figure.evaluate((svg) => svg.parentElement!.getBoundingClientRect().height)

    // Half way through its passage into view: part drawn, one branch live.
    await page.evaluate((y) => window.scrollTo(0, y), figureTop - 844 + figureHeight / 2)
    await page.waitForTimeout(600)
    const midway = await hiddenPathCount(page)
    expect(midway).toBeGreaterThan(0)
    expect(midway).toBeLessThan(total)
    expect((await activeBranches(page)).length).toBe(1)

    // Fully in view: a finished monochrome drawing.
    await page.evaluate((y) => window.scrollTo(0, y), figureTop)
    await page.waitForTimeout(600)
    expect(await hiddenPathCount(page)).toBe(0)
    expect(await activeBranches(page)).toEqual([])
  })
})
