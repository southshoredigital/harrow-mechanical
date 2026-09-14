import { expect, test } from "@playwright/test"

import { SITE } from "@/lib/seo/site"

import { ALL_ROUTES, CONTENT_ROUTES } from "./support/routes"

/**
 * Search engine signals agree with each other. While the concept is not
 * indexable, every page says noindex, nofollow, the sitemap lists nothing and
 * robots.txt does not advertise it. If SITE.indexable flips, the same tests
 * hold the opposite state.
 */

test.describe("robots and sitemap agree", () => {
  // Server responses, not browser rendering: one project is enough.
  test.skip(({ isMobile }) => isMobile, "Viewport independent")

  for (const path of ALL_ROUTES) {
    test(`robots meta: ${path}`, async ({ request }) => {
      const html = await (await request.get(path)).text()
      // Next adds its own `noindex` tag to the 404 page, so read every one.
      const tags = [...html.matchAll(/<meta name="robots" content="([^"]+)"/g)].map((m) => m[1])
      expect(tags, `${path} has no robots meta`).toContain(
        SITE.indexable ? "index, follow" : "noindex, nofollow"
      )
      if (!SITE.indexable) {
        for (const tag of tags) expect(tag, `${path}: ${tag}`).toContain("noindex")
      }
    })
  }

  test("sitemap matches the robots state", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text()
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
    expect(urls).toEqual(SITE.indexable ? CONTENT_ROUTES : [])
  })

  test("robots.txt advertises a sitemap only when indexable", async ({ request }) => {
    const text = await (await request.get("/robots.txt")).text()
    expect(/^Sitemap:/m.test(text)).toBe(SITE.indexable)
    expect(text).toMatch(/^Disallow: \/api\/$/m)
  })

  test("review routes are gone", async ({ request }) => {
    for (const path of ["/styleguide", "/icons", "/riser"]) {
      expect((await request.get(path)).status(), path).toBe(404)
    }
  })
})
