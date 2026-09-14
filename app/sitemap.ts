import type { MetadataRoute } from "next"

import { SITE, absoluteUrl, sitemapPaths } from "@/lib/seo"

/**
 * Empty while SITE.indexable is false. A sitemap is a request to index the
 * URLs in it, and every page here is noindex: listing them would ask search
 * engines for the opposite of what each page says. When the flag flips, every
 * content route appears.
 *
 * No lastModified: content carries no edit dates, and a build timestamp on
 * every URL tells a crawler nothing true.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!SITE.indexable) return []
  return sitemapPaths().map((path) => ({ url: absoluteUrl(path) }))
}
