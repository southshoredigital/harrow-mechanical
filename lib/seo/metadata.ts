import type { Metadata } from "next"

import { OG_SIZE, SITE_IMAGE_ALT } from "./og-shared"
import { SITE } from "./site"

/**
 * Builds a page's metadata: title, description, canonical, Open Graph and
 * Twitter card, from one title and one description so the four can never
 * disagree.
 *
 * The title is written in full here (`absolute`) rather than through a
 * template in the layout, so what lib/seo says is exactly what ships.
 *
 * Robots is deliberately not set: it is inherited from the root layout,
 * which holds `index: false` for the whole concept.
 *
 * The site image is named explicitly because a page's `openGraph` replaces
 * its parent's whole object, images included. A route with its own
 * opengraph-image file (project records) still wins: file based metadata
 * takes precedence over this.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  /** Front-loaded with the search term. The site name is appended. */
  title: string
  description: string
  /** Site path, used for the canonical and og:url. */
  path: string
}): Metadata {
  const fullTitle = title.startsWith(SITE.name) ? title : `${title} | ${SITE.name}`

  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      images: [SITE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SITE_IMAGE],
    },
  }
}

const SITE_IMAGE = {
  url: "/opengraph-image",
  width: OG_SIZE.width,
  height: OG_SIZE.height,
  alt: SITE_IMAGE_ALT,
}

/**
 * Cuts generated copy to a length search results display in full, at a word
 * boundary. Hand written descriptions are kept under the limit instead.
 */
export function clip(text: string, max = 158) {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 3)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}...`
}
