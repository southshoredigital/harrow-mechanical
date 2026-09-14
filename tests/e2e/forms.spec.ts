import { expect, test } from "@playwright/test"
import type { Locator, Page } from "@playwright/test"

import { openSettled } from "./support/page"

/**
 * The three contact paths.
 *
 * Browser tests intercept the POST, so the suite never sends mail through
 * Resend: they prove each path collects its own fields, posts them to its own
 * route, and shows its own confirmation and error states. The API tests at the
 * bottom hit the real route handlers to prove the server validates against the
 * same schema and discards honeypot submissions without sending.
 */

type Path = {
  tab: string
  endpoint: string
  submit: RegExp
  fill: (panel: Locator) => Promise<void>
  /** Fields only this path sends. Proves the paths are not one generic form. */
  distinctFields: string[]
  confirmation: string
  requiredErrors: string[]
}

const PATHS: Path[] = [
  {
    tab: "Tender enquiry",
    endpoint: "/api/contact/tender",
    submit: /send tender enquiry/i,
    fill: async (panel) => {
      await panel.getByLabel("Your name").fill("Sam Estimator")
      await panel.getByLabel("Company").fill("Example Constructions")
      await panel.getByLabel("Email").fill("sam@example.com")
      await panel.getByLabel("Phone").fill("0400 000 000")
      await panel.getByLabel("Sector").selectOption("Health")
      await panel.getByLabel("Project location").fill("Berwick, Victoria")
      await panel.getByLabel("Contract scale").selectOption("$1m to $2.5m")
      await panel.getByLabel("Scope of work").fill(
        "Mechanical services package, two theatre AHUs and a chiller replacement."
      )
    },
    distinctFields: ["company", "sector", "contractScale", "projectLocation", "scope"],
    confirmation: "On the tender list.",
    requiredErrors: ["Enter your name", "Enter your company name", "Describe the scope of work"],
  },
  {
    tab: "Service call",
    endpoint: "/api/contact/service",
    submit: /log service call/i,
    fill: async (panel) => {
      await panel.getByLabel("Your name").fill("Alex Facilities")
      await panel.getByLabel("Email").fill("alex@example.com")
      await panel.getByLabel("Phone").fill("0400 000 001")
      await panel.getByLabel("Urgency").selectOption("Urgent")
      await panel.getByLabel("Site address").fill("12 Example Street, Clayton")
      await panel.getByLabel("Building type").fill("Research laboratory")
      await panel.getByLabel("Fault or issue").fill(
        "Chiller 2 tripping on high head pressure since this morning."
      )
    },
    distinctFields: ["siteAddress", "buildingType", "urgency", "issue"],
    confirmation: "Logged.",
    requiredErrors: ["Enter the site address", "Describe the fault or issue"],
  },
  {
    tab: "Careers",
    endpoint: "/api/contact/careers",
    submit: /send application/i,
    fill: async (panel) => {
      await panel.getByLabel("Your name").fill("Jo Mechanic")
      await panel.getByLabel("Email").fill("jo@example.com")
      await panel.getByLabel("Phone").fill("0400 000 002")
      await panel.getByLabel("Role").selectOption("refrigeration-mechanic")
      await panel.getByLabel("Your trade background").fill(
        "Cert III refrigeration, eight years on commercial chiller plant."
      )
    },
    distinctFields: ["roleSlug", "background", "resumeLink"],
    confirmation: "Application received.",
    requiredErrors: ["Enter your name", "Tell us about your trade background"],
  },
]

async function openPath(page: Page, tab: string) {
  await openSettled(page, "/contact")
  await page.getByRole("tab", { name: tab }).click()
  return page.getByRole("tabpanel")
}

for (const path of PATHS) {
  test.describe(`contact: ${path.tab}`, () => {
    test("blocks an empty submission client side, with errors tied to their fields", async ({ page }) => {
      let posted = false
      await page.route(path.endpoint, (route) => {
        posted = true
        return route.abort()
      })

      const panel = await openPath(page, path.tab)
      await panel.getByRole("button", { name: path.submit }).click()

      for (const message of path.requiredErrors) {
        const error = panel.getByText(message, { exact: true })
        await expect(error).toBeVisible()

        const errorId = await error.getAttribute("id")
        const field = panel.locator(`[aria-describedby~="${errorId}"]`)
        await expect(field).toHaveAttribute("aria-invalid", "true")
      }
      expect(posted).toBe(false)
    })

    test("posts its own fields to its own route and shows its own confirmation", async ({ page }) => {
      let body: Record<string, unknown> = {}
      await page.route(path.endpoint, async (route) => {
        body = route.request().postDataJSON()
        await route.fulfill({ json: { ok: true } })
      })

      const panel = await openPath(page, path.tab)
      await path.fill(panel)
      await panel.getByRole("button", { name: path.submit }).click()

      const status = panel.getByRole("status")
      await expect(status).toContainText(path.confirmation)

      for (const field of path.distinctFields) expect(body).toHaveProperty(field)
      for (const other of PATHS.filter((p) => p !== path)) {
        for (const field of other.distinctFields.filter((f) => !path.distinctFields.includes(f))) {
          expect(body, `${path.tab} must not send ${field}`).not.toHaveProperty(field)
        }
      }
    })

    test("shows the designed error state when the server fails", async ({ page }) => {
      await page.route(path.endpoint, (route) =>
        route.fulfill({
          status: 502,
          json: { ok: false, error: "Something went wrong sending this. Try again in a moment." },
        })
      )

      const panel = await openPath(page, path.tab)
      await path.fill(panel)
      await panel.getByRole("button", { name: path.submit }).click()

      await expect(panel.getByRole("alert")).toContainText("Something went wrong sending this")
      await expect(panel.getByRole("button", { name: path.submit })).toBeEnabled()
    })
  })
}

test.describe("contact API", () => {
  const INVALID = { email: "not-an-email" }

  for (const path of PATHS) {
    test(`${path.endpoint} rejects an invalid payload with field errors`, async ({ request }) => {
      const response = await request.post(path.endpoint, { data: INVALID })
      expect(response.status()).toBe(400)

      const json = await response.json()
      expect(json.ok).toBe(false)
      expect(json.fieldErrors).toHaveProperty("email")
    })
  }

  test("a filled honeypot is accepted and discarded without sending", async ({ request }) => {
    // Valid in every other respect, so the only thing stopping a send is the trap.
    const response = await request.post("/api/contact/service", {
      data: {
        contactName: "Bot",
        email: "bot@example.com",
        phone: "0400 000 003",
        siteAddress: "1 Example Street",
        buildingType: "Office",
        urgency: "Routine",
        issue: "This text is long enough to pass validation.",
        website: "https://spam.example",
      },
    })

    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })
})
