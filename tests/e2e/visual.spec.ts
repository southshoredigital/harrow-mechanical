import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { openSettled } from "./support/page"

/**
 * Visual regression, one snapshot per section component, at both viewports.
 *
 * Reduced motion throughout: the riser schematic then renders complete and
 * Lenis stays off, so a snapshot never catches a line part way through
 * plotting. Locators are semantic (landmarks, roles, headings) rather than
 * test ids, so a snapshot fails on a visual change, not a markup rename.
 *
 * Baselines are per platform. Font rasterising differs between Windows and
 * the Linux CI runner, so each keeps its own set; see .github/workflows.
 */

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
})

/**
 * Below lg the rail is sticky at the top of the viewport, so it paints over
 * any tall component a locator screenshot scrolls past. Hidden for every
 * snapshot except SpecRail's own, so a rail change fails one test, not six.
 */
async function hideRailChrome(page: Page) {
  await page.addStyleTag({
    content: "body > .sticky, body > nav.sticky { visibility: hidden !important; }",
  })
}

/** The innermost element that contains every one of the given markers. */
function componentRoot(page: Page, ...markers: Parameters<Page["locator"]>[0][]) {
  let locator = page.locator("main div")
  for (const marker of markers) locator = locator.filter({ has: page.locator(marker) })
  return locator.last()
}

test("SpecRail", async ({ page, isMobile }) => {
  await openSettled(page, "/projects/northfield-private-hospital-plant-upgrade")

  if (isMobile) {
    // Below lg the rail is the two sticky lines at the top of the viewport.
    const strip = page.getByRole("navigation", { name: "Sections" })
    const box = await strip.boundingBox()
    await expect(page).toHaveScreenshot("spec-rail.png", {
      clip: { x: 0, y: 0, width: page.viewportSize()!.width, height: box!.y + box!.height },
    })
  } else {
    await expect(page.getByRole("complementary", { name: "Specification" })).toHaveScreenshot(
      "spec-rail.png"
    )
  }
})

test("RiserSchematic", async ({ page }) => {
  await openSettled(page, "/capabilities")
  await hideRailChrome(page)
  const figure = page.getByRole("img", { name: /riser schematic/i })
  await figure.scrollIntoViewIfNeeded()
  await expect(figure).toHaveScreenshot("riser-schematic.png")
})

test("ProjectIndex", async ({ page }) => {
  await openSettled(page, "/projects")
  await hideRailChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("project-index.png")
})

test("ProjectIndex, filtered", async ({ page }) => {
  await openSettled(page, "/projects?sector=health")
  await hideRailChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("project-index-filtered.png")
})

test("ProjectSpread", async ({ page }) => {
  await openSettled(page, "/projects/northfield-private-hospital-plant-upgrade")
  await hideRailChrome(page)
  const lead = componentRoot(page, "figure img", "h2#brief")
  await expect(lead).toHaveScreenshot("project-spread.png")
})

test("DocumentLibrary", async ({ page }) => {
  await openSettled(page, "/compliance/documents")
  await hideRailChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("document-library.png")
})

test("SiteFooter", async ({ page }) => {
  await openSettled(page, "/about")
  await hideRailChrome(page)
  await expect(page.getByRole("contentinfo")).toHaveScreenshot("site-footer.png")
})

test("ContactForms", async ({ page }) => {
  await openSettled(page, "/contact")
  await hideRailChrome(page)
  const root = componentRoot(page, '[role="tablist"]', '[role="tabpanel"]:not([hidden])')
  await expect(root).toHaveScreenshot("contact-forms.png")
})
