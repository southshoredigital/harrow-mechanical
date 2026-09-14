import type { Page } from "@playwright/test"

/**
 * Loads a route and waits until it is settled: network idle and the
 * self-hosted faces swapped in, so measurements and snapshots are taken
 * against the real type rather than the fallback metrics.
 */
export async function openSettled(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  return response
}
