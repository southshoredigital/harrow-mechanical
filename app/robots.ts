import type { MetadataRoute } from "next"

import { absoluteUrl } from "@/lib/seo"

/**
 * Crawling is allowed on content routes on purpose. What keeps this concept
 * out of search results is the `noindex` meta tag set in the root layout, and
 * a crawler has to fetch a page to read it: a blanket Disallow would hide
 * that tag and still let a linked URL be listed.
 *
 * Review routes and the form API are not for crawlers at all.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/styleguide", "/icons", "/riser"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  }
}
