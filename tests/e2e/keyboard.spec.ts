import { expect, test } from "@playwright/test"
import type { Page } from "@playwright/test"

import { openSettled } from "./support/page"
import { ALL_ROUTES } from "./support/routes"

/**
 * Keyboard walkthrough.
 *
 * On every route: Tab from the top of the page to the end, and check that
 * every visible interactive element is reached, in the order the DOM gives,
 * and that each one shows the site's focus outline rather than the browser
 * default or nothing.
 *
 * Then the interactions that go beyond Tab: the skip link, the radio filters
 * (arrow keys), the contact tabs (arrow keys) and form submission by Enter.
 */

type Stop = { id: string; label: string; outline: string }

/**
 * Stops are identified by a data attribute stamped on them before the walk,
 * not by DOM position: Next inserts prefetch tags into the head as links
 * scroll into view, which would shift any index taken from the document.
 */
async function describeFocus(page: Page): Promise<Stop | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return null

    const label = `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ||
      el.textContent ||
      (el as HTMLInputElement).name ||
      "").trim().replace(/\s+/g, " ").slice(0, 40)}"`
    const id = el.dataset.kbStop ?? `unexpected:${label}`

    // A visually hidden radio shows its focus on the label wrapping it.
    const shown =
      el.matches("input.sr-only") && el.parentElement ? el.parentElement : el
    const style = getComputedStyle(shown)
    const outline =
      style.outlineStyle === "none" || parseFloat(style.outlineWidth) === 0
        ? "none"
        : `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}`

    return { id, label, outline }
  })
}

/** Everything a keyboard user should be able to reach on the page as rendered. */
async function expectedStops(page: Page) {
  return page.evaluate(() => {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        "a[href], button, input, select, textarea, [tabindex]"
      )
    )

    const radioGroupsSeen = new Set<string>()

    return candidates
      .filter((el) => {
        if (el.matches(":disabled") || el.tabIndex < 0) return false
        if (el.closest("[hidden], [inert]")) return false

        // Visually hidden radios are real controls: judge them by their label.
        const box = (el.matches("input.sr-only") ? el.parentElement! : el).getBoundingClientRect()
        const style = getComputedStyle(el)
        const skipLink = el.matches("a[href='#main']")
        if (!skipLink && (box.width === 0 || box.height === 0)) return false
        if (style.visibility === "hidden" || style.display === "none") return false

        // A radio group is one tab stop.
        if (el.matches("input[type=radio]")) {
          const name = (el as HTMLInputElement).name
          if (radioGroupsSeen.has(name)) return false
          radioGroupsSeen.add(name)
        }
        return true
      })
      .map((el, index) => {
        el.dataset.kbStop = String(index)
        const text = (el.getAttribute("aria-label") || el.textContent || (el as HTMLInputElement).name || "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, 40)
        return { id: String(index), label: `${el.tagName.toLowerCase()} "${text}"` }
      })
  })
}

for (const path of ALL_ROUTES) {
  test(`keyboard walkthrough: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" })
    await openSettled(page, path)

    const expected = await expectedStops(page)
    const reached = new Map<string, Stop>()

    // Generous upper bound: one pass plus slack, so a trap fails rather than hangs.
    // A date input takes one Tab per segment (day, month, year), so the same
    // stop twice in a row is still progress; only a return to an earlier stop
    // means the sequence has wrapped.
    let previous: string | null = null
    for (let i = 0; i < expected.length + 20; i++) {
      await page.keyboard.press("Tab")
      const stop = await describeFocus(page)
      if (!stop) break
      if (stop.id === previous) continue
      if (reached.has(stop.id)) break
      reached.set(stop.id, stop)
      previous = stop.id
    }

    const missed = expected.filter((stop) => !reached.has(stop.id)).map((stop) => stop.label)
    expect(missed, "elements never reached by Tab").toEqual([])

    const unexpected = [...reached.keys()].filter((id) => id.startsWith("unexpected:"))
    expect(unexpected, "focus landed on something not visibly interactive").toEqual([])

    const noOutline = [...reached.values()].filter((stop) => stop.outline === "none")
    expect(noOutline, JSON.stringify(noOutline, null, 2)).toEqual([])
  })
}

test("skip link is the first stop and moves focus to main content", async ({ page }) => {
  await openSettled(page, "/projects")
  await page.keyboard.press("Tab")

  const skip = page.getByRole("link", { name: "Skip to content" })
  await expect(skip).toBeFocused()
  const box = await skip.boundingBox()
  expect(box?.width ?? 0).toBeGreaterThan(1)

  await page.keyboard.press("Enter")
  await expect(page.locator("main#main")).toBeFocused()
})

test("project filters work with arrow keys and update the URL", async ({ page }) => {
  await openSettled(page, "/projects")

  await page.getByRole("radiogroup", { name: "Sector" }).getByRole("radio", { name: /All/ }).focus()
  await page.keyboard.press("ArrowRight")

  await expect(page).toHaveURL(/[?&]sector=health\b/)
  await expect(
    page.getByRole("radiogroup", { name: "Sector" }).getByRole("radio", { name: /Health/ })
  ).toBeChecked()
})

test("document filter works with arrow keys", async ({ page }) => {
  await openSettled(page, "/compliance/documents")

  await page.getByRole("radiogroup", { name: "Category" }).getByRole("radio", { name: /All/ }).focus()
  await page.keyboard.press("ArrowRight")

  await expect(page).toHaveURL(/[?&]category=insurance\b/)
})

test("contact tabs follow the ARIA tabs pattern", async ({ page }) => {
  await openSettled(page, "/contact")

  const tender = page.getByRole("tab", { name: "Tender enquiry" })
  const service = page.getByRole("tab", { name: "Service call" })
  const careers = page.getByRole("tab", { name: "Careers" })

  await tender.focus()
  await page.keyboard.press("ArrowRight")
  await expect(service).toBeFocused()
  await expect(service).toHaveAttribute("aria-selected", "true")

  await page.keyboard.press("End")
  await expect(careers).toBeFocused()
  await page.keyboard.press("ArrowRight")
  await expect(tender).toBeFocused()
  await page.keyboard.press("ArrowLeft")
  await expect(careers).toBeFocused()

  // Only the selected tab is in the tab sequence; Tab moves into its panel.
  await expect(tender).toHaveAttribute("tabindex", "-1")
  await expect(careers).toHaveAttribute("tabindex", "0")
  await page.keyboard.press("Tab")
  await expect(page.getByRole("tabpanel").getByLabel("Your name")).toBeFocused()
})

test("a form submitted by Enter moves focus to the first invalid field", async ({ page }) => {
  await openSettled(page, "/contact")

  const panel = page.getByRole("tabpanel")
  await panel.getByLabel("Your name").fill("Sam Estimator")
  await panel.getByLabel("Your name").press("Enter")

  const company = panel.getByLabel("Company")
  await expect(company).toBeFocused()
  await expect(company).toHaveAttribute("aria-invalid", "true")
})
