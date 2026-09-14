import type { MetadataRoute } from "next"

import { SITE, absoluteUrl } from "@/lib/seo"

/**
 * Crawling is allowed on content routes on purpose. What keeps this concept
 * out of search results is the noindex meta tag, set site wide from
 * SITE.indexable, and a crawler has to fetch a page to read it: a blanket
 * Disallow would hide that tag and still let a linked URL be listed.
 *
 * The sitemap is only advertised when the site is indexable, so robots.txt
 * never points a crawler at a list of pages that each say noindex.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    ...(SITE.indexable ? { sitemap: absoluteUrl("/sitemap.xml") } : {}),
  }
}
