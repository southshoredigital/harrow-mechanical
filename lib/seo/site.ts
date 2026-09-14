import { company } from "@/content/company"

/**
 * The facts every piece of metadata and structured data is built from.
 *
 * The production origin is fixed rather than read from the environment, so a
 * Vercel preview still declares the production URL as canonical and never
 * competes with it.
 */
export const SITE = {
  /**
   * The one switch for search engines. This is a concept for a fictional
   * business, so it stays false: every page is noindex, nofollow, the sitemap
   * is empty and robots.txt does not advertise it. Flipping it to true is the
   * whole of the launch change, and the three can never disagree.
   */
  indexable: false as boolean,
  name: "Harrow Mechanical",
  url: "https://harrow.southshoredigital.com.au",
  locale: "en_AU",
  founded: 1994,
  staff: 58,
  locality: company.address.locality,
  region: company.address.region,
  country: company.address.country,
  /** Where the work is. The project record runs across metropolitan and regional Victoria. */
  areaServed: ["Melbourne", "Victoria"],
  contractRange: "$400,000 to $4.2m",
  logo: "/logo.svg",
} as const

/** Absolute URL for a site path. */
export function absoluteUrl(path: string) {
  return new URL(path, SITE.url).toString()
}
