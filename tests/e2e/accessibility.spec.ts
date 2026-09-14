import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { openSettled } from "./support/page"
import { ALL_ROUTES } from "./support/routes"

/**
 * WCAG 2.1 AA, via axe, on every route at both viewports, plus the states a
 * route only reaches after interaction: a filtered and an empty schedule,
 * each contact path, and a form showing its errors.
 */

const WCAG_AA = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]

async function expectNoViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG_AA).analyze()

  const summary = violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    help: violation.help,
    targets: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
  }))

  expect(summary, JSON.stringify(summary, null, 2)).toEqual([])
}

for (const path of ALL_ROUTES) {
  test(`axe: ${path}`, async ({ page }) => {
    await openSettled(page, path)
    await expectNoViolations(page)
  })
}

test("axe: projects index, filtered to no results", async ({ page }) => {
  await openSettled(page, "/projects?sector=data-centre&scale=under-1m")
  await expect(page.getByText(/No project on record matches/)).toBeVisible()
  await expectNoViolations(page)
})

test("axe: document library, filtered", async ({ page }) => {
  await openSettled(page, "/compliance/documents?category=insurance")
  await expectNoViolations(page)
})

for (const tab of ["Tender enquiry", "Service call", "Careers"]) {
  test(`axe: contact, ${tab} path showing validation errors`, async ({ page }) => {
    await openSettled(page, "/contact")
    await page.getByRole("tab", { name: tab }).click()
    await page.getByRole("tabpanel").getByRole("button", { name: /send|log/i }).click()
    await expect(page.getByRole("tabpanel").locator('[aria-invalid="true"]').first()).toBeVisible()
    await expectNoViolations(page)
  })
}

test.describe("riser schematic text alternative", () => {
  test("names and describes every system it draws", async ({ page }) => {
    await openSettled(page, "/capabilities")

    const figure = page.getByRole("img", { name: /riser schematic/i })
    await expect(figure).toHaveCount(1)
    await expect(figure).toHaveAccessibleName(
      /mechanical, hydraulic and controls/i
    )
    await expect(figure).toHaveAccessibleDescription(/six levels/i)

    const description = await figure.evaluate((svg) =>
      svg.querySelector("desc")?.textContent?.replace(/\s+/g, " ") ?? ""
    )
    for (const phrase of [
      "air handling unit",
      "chiller",
      "fan coil unit",
      "building management head end",
      "floor controller",
    ]) {
      expect(description.toLowerCase()).toContain(phrase)
    }

    // The same three systems are also carried as real headings beside it.
    for (const system of ["Mechanical", "Hydraulic", "Controls"]) {
      await expect(page.getByRole("heading", { level: 3, name: system })).toBeVisible()
    }
  })

  test("renders complete, with no hidden strokes, under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openSettled(page, "/capabilities")

    const hidden = await page.locator('svg[role="img"] [data-branch] path').evaluateAll(
      (paths) =>
        paths.filter((path) => {
          const style = getComputedStyle(path)
          const offset = parseFloat(style.strokeDashoffset || "0")
          return style.strokeDasharray !== "none" && offset !== 0
        }).length
    )
    expect(hidden).toBe(0)

    const clippedLabels = await page
      .locator('svg[role="img"] clipPath rect')
      .evaluateAll((rects) =>
        rects.filter((rect) => (rect as SVGElement).style.transform !== "scaleX(1)").length
      )
    expect(clippedLabels).toBe(0)
  })
})
