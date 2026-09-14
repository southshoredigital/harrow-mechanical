import type { MetadataRoute } from "next"

import { absoluteUrl, sitemapPaths } from "@/lib/seo"

/**
 * Every content route. Review routes (/styleguide, /icons, /riser) and the
 * contact API are deliberately absent.
 *
 * No lastModified: content carries no edit dates, and a build timestamp on
 * every URL tells a crawler nothing true.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths().map((path) => ({ url: absoluteUrl(path) }))
}
