import { expect, test } from "@playwright/test"

import budgets from "../../lighthouse/budget.json"

import { ALL_ROUTES } from "./support/routes"

/**
 * Layout shift when the web fonts arrive late.
 *
 * On a phone on a slow connection the page paints in the fallback faces and
 * the self-hosted fonts swap in afterwards. If a fallback's metrics differ,
 * lines rewrap on the swap and everything below them moves. On a fast
 * connection the fonts arrive before first paint and the shift never shows,
 * which is how it went unnoticed, so this test forces the slow case: every
 * font file is held back, and CLS is read once all three have swapped in.
 *
 * The limit is the CLS budget from lighthouse/budget.json.
 */

const CLS_BUDGET = budgets[0].timings.find((t) => t.metric === "cumulative-layout-shift")!.budget
const FONT_DELAY_MS = 2000

for (const path of ALL_ROUTES) {
  test(`fonts arriving late do not shift the layout: ${path}`, async ({ page }) => {
    await page.route(/\.woff2$/, async (route) => {
      await new Promise((resolve) => setTimeout(resolve, FONT_DELAY_MS))
      await route.continue()
    })
    await page.addInitScript(() => {
      const w = window as unknown as { __cls: number; __shifts: { value: number; nodes: string[] }[] }
      w.__cls = 0
      w.__shifts = []
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as (PerformanceEntry & {
          value: number
          hadRecentInput: boolean
          sources?: { node?: Node }[]
        })[]) {
          if (entry.hadRecentInput) continue
          w.__cls += entry.value
          w.__shifts.push({
            value: Math.round(entry.value * 10000) / 10000,
            nodes: (entry.sources ?? []).map((source) => {
              const el = source.node as Element | undefined
              return el?.tagName ? `${el.tagName.toLowerCase()} "${el.textContent?.trim().slice(0, 30)}"` : "?"
            }),
          })
        }
      }).observe({ type: "layout-shift", buffered: true })
    })

    await page.goto(path, { waitUntil: "load" })
    await page.waitForFunction(() => document.fonts.status === "loaded" && document.fonts.size > 0)
    await page.waitForTimeout(FONT_DELAY_MS + 500)
    await page.evaluate(() => document.fonts.ready)
    // Two frames for the post-swap layout to be reported.
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

    const { cls, shifts } = await page.evaluate(() => {
      const w = window as unknown as { __cls: number; __shifts: unknown[] }
      return { cls: w.__cls, shifts: w.__shifts }
    })
    expect(cls, JSON.stringify(shifts, null, 2)).toBeLessThanOrEqual(CLS_BUDGET)
  })
}
