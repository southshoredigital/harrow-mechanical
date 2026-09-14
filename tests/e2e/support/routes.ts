import { sitemapPaths } from "@/lib/seo/pages"

/**
 * Every route the gates run against. Content routes come from the same list
 * the sitemap is built from, so a new project or role is tested without
 * anyone remembering to add it here.
 */
export const CONTENT_ROUTES = sitemapPaths()

export const NOT_FOUND_ROUTE = "/no-such-page"

export const ALL_ROUTES = [...CONTENT_ROUTES, NOT_FOUND_ROUTE]
