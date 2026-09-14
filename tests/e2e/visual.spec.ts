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
 * Page chrome that paints over any tall component a locator screenshot
 * scrolls past: below lg the rail's sticky lines, from lg the fixed concept
 * bar. Hidden for every snapshot except their own, so a chrome change fails
 * one test, not six.
 */
async function hidePageChrome(page: Page) {
  await page.addStyleTag({
    content: "body > .sticky, body > nav.sticky, body > div.fixed { visibility: hidden !important; }",
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
  await hidePageChrome(page)
  const figure = page.getByRole("img", { name: /riser schematic/i })
  await figure.scrollIntoViewIfNeeded()
  await expect(figure).toHaveScreenshot("riser-schematic.png")
})

test("ProjectIndex", async ({ page }) => {
  await openSettled(page, "/projects")
  await hidePageChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("project-index.png")
})

test("ProjectIndex, filtered", async ({ page }) => {
  await openSettled(page, "/projects?sector=health")
  await hidePageChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("project-index-filtered.png")
})

test("ProjectSpread", async ({ page }) => {
  await openSettled(page, "/projects/northfield-private-hospital-plant-upgrade")
  await hidePageChrome(page)
  const lead = componentRoot(page, "figure img", "h2#brief")
  await expect(lead).toHaveScreenshot("project-spread.png")
})

test("DocumentLibrary", async ({ page }) => {
  await openSettled(page, "/compliance/documents")
  await hidePageChrome(page)
  const root = componentRoot(page, '[role="radiogroup"]', "ul")
  await expect(root).toHaveScreenshot("document-library.png")
})

test("ConceptBar", async ({ page, isMobile }) => {
  await openSettled(page, "/")
  const bar = page.locator("body > div.fixed").filter({ hasText: "Concept project by" })
  if (isMobile) {
    // Below lg the bar is hidden; the footer carries the disclosure.
    await expect(bar).toBeHidden()
    return
  }
  await expect(bar).toHaveScreenshot("concept-bar.png")
})

test("SiteFooter", async ({ page }) => {
  await openSettled(page, "/about")
  await hidePageChrome(page)
  await expect(page.getByRole("contentinfo")).toHaveScreenshot("site-footer.png")
})

test("ContactForms", async ({ page }) => {
  await openSettled(page, "/contact")
  await hidePageChrome(page)
  const root = componentRoot(page, '[role="tablist"]', '[role="tabpanel"]:not([hidden])')
  await expect(root).toHaveScreenshot("contact-forms.png")
})
