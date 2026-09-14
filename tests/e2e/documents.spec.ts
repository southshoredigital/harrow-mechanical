import { expect, test } from "@playwright/test"
import type { APIRequestContext } from "@playwright/test"

import { documents } from "@/content/documents"
import { formatFileSize } from "@/content/types"

import { openSettled } from "./support/page"

/**
 * The primary conversion action, and the document library an estimator
 * checks before inviting a firm to tender. A link that 404s is worse than no
 * link, so every one is fetched and checked for a real PDF.
 */

async function expectPdf(request: APIRequestContext, href: string) {
  const response = await request.get(href)
  expect(response.status(), href).toBe(200)
  expect(response.headers()["content-type"], href).toContain("application/pdf")

  const body = await response.body()
  expect(body.subarray(0, 5).toString("latin1"), `${href} is not a PDF`).toBe("%PDF-")
}

test.describe("capability statement", () => {
  test("is offered from the homepage and resolves to a PDF", async ({ page, request }) => {
    await openSettled(page, "/")

    const section = page.getByRole("region", { name: /project history, accreditations and licensing/i })
    const link = section.getByRole("link", { name: /view or download/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute("href", "/documents/capability-statement.pdf")

    await expectPdf(request, "/documents/capability-statement.pdf")
  })

  test("opens from the homepage link", async ({ page, request }) => {
    await openSettled(page, "/")
    const link = page.getByRole("link", { name: /view or download/i })

    // Chromium either renders the PDF in the tab or hands it to the download
    // manager depending on headless mode. Both start with the same request,
    // which is the conversion, so that is what the test waits for.
    const [pdfRequest] = await Promise.all([
      page.waitForRequest((req) => req.url().endsWith("/documents/capability-statement.pdf")),
      link.click(),
    ])

    expect(pdfRequest.method()).toBe("GET")
    await expectPdf(request, "/documents/capability-statement.pdf")
  })
})

test.describe("compliance documents", () => {
  test("every document in content is listed with its file type, size and issue date", async ({ page }) => {
    await openSettled(page, "/compliance/documents")

    for (const document of documents) {
      const link = page.getByRole("link", { name: document.title, exact: true })
      await expect(link).toHaveAttribute("href", document.file)

      const row = page.getByRole("listitem").filter({ has: link })
      await expect(row).toContainText(/PDF, \d+(\.\d)? (KB|MB)/)
      await expect(row).toContainText(/Issued [A-Z][a-z]+ \d{4}/)
    }
  })

  for (const document of documents) {
    test(`resolves: ${document.file}`, async ({ request }) => {
      await expectPdf(request, document.file)
    })
  }

  test("the size shown is the size of the file served", async ({ page, request }) => {
    await openSettled(page, "/compliance/documents")

    for (const document of documents) {
      const bytes = (await (await request.get(document.file)).body()).length
      const row = page
        .getByRole("listitem")
        .filter({ has: page.getByRole("link", { name: document.title, exact: true }) })
      await expect(row).toContainText(`PDF, ${formatFileSize(bytes)}`)
    }
  })
})
