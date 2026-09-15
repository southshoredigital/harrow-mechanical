/**
 * Measures fallback font metrics, so the fallback faces take the same space
 * as the web fonts and nothing moves when the web fonts swap in.
 *
 *   pnpm build && pnpm exec next start -p 3100   (in another terminal)
 *   node scripts/measure-font-fallbacks.mjs [baseUrl]
 *
 * Run on a machine with Arial and Courier New installed. On Linux the
 * fallbacks resolve to Liberation Sans and Liberation Mono, their metric
 * compatible equivalents.
 *
 * Method: crawl the site from the homepage, and on every page at a desktop
 * and a phone width collect each run of text actually set in each face, at
 * its real size, weight and case. Measure every run in the web font and in
 * the fallback with canvas text metrics, and take size-adjust as the ratio of
 * the totals, so it is weighted by the text the site really sets rather than
 * by the font's average glyph width. The spread of per-run ratios is printed
 * too: a wide spread means some strings will still rewrap on swap.
 *
 * Ascent and descent are the web font's own vertical metrics, divided by
 * size-adjust because the browser scales the overrides by it. They matter
 * even where width is already matched: a line mixing two faces takes the
 * tallest ascent and descent on it, so a mismatch grows the line on swap.
 *
 * Paste the printed values into `fontFallback` in design/tokens.ts.
 */

import { chromium } from "@playwright/test"

const BASE = process.argv[2] ?? "http://localhost:3100"

/** Each face, and the local font its fallback resolves to. */
const FACES = {
  display: { match: "cabinet", fallback: "Arial" },
  body: { match: "switzer", fallback: "Arial" },
  // Width is matched already by the shared 0.6em advance; the vertical
  // metrics are what need overriding for this one.
  mono: { match: "jetbrains", fallback: "Courier New" },
}

async function crawl() {
  const found = new Set(["/"])
  const queue = ["/"]
  while (queue.length > 0) {
    const path = queue.shift()
    const response = await fetch(BASE + path)
    if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) continue
    const html = await response.text()
    for (const [, href] of html.matchAll(/<a[^>]+href="([^"#?]+)/g)) {
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/api/")) continue
      if (/\.[a-z0-9]+$/i.test(href) || found.has(href)) continue
      found.add(href)
      queue.push(href)
    }
  }
  return [...found]
}

const routes = await crawl()
const browser = await chromium.launch()
const totals = Object.fromEntries(
  Object.keys(FACES).map((face) => [face, { web: 0, fallback: 0, runs: 0, ratios: [] }])
)
const vertical = {}

for (const viewport of [{ width: 1440, height: 900 }, { width: 412, height: 823 }]) {
  const page = await browser.newPage({ viewport })
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" })
    await page.evaluate(() => document.fonts.ready)

    const result = await page.evaluate((faces) => {
      const ctx = document.createElement("canvas").getContext("2d")
      const out = Object.fromEntries(
        Object.keys(faces).map((face) => [face, { web: 0, fallback: 0, runs: 0, ratios: [] }])
      )
      const metrics = {}
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)

      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement
        const raw = node.textContent.replace(/\s+/g, " ").trim()
        if (!el || !raw || el.closest("script, style, svg, noscript")) continue
        const style = getComputedStyle(el)
        const face = Object.keys(faces).find((key) =>
          style.fontFamily.toLowerCase().includes(faces[key].match)
        )
        if (!face) continue

        const family = style.fontFamily.split(",")[0].trim()
        const text = style.textTransform === "uppercase" ? raw.toUpperCase() : raw
        const size = parseFloat(style.fontSize)

        ctx.font = `${style.fontWeight} ${size}px ${family}`
        const web = ctx.measureText(text).width
        ctx.font = `${style.fontWeight} ${size}px "${faces[face].fallback}"`
        const fallback = ctx.measureText(text).width

        out[face].web += web
        out[face].fallback += fallback
        out[face].runs += 1
        if (text.length >= 8) out[face].ratios.push(web / fallback)

        if (!metrics[face]) {
          ctx.font = `400 100px ${family}`
          const m = ctx.measureText("Hxg")
          metrics[face] = { ascent: m.fontBoundingBoxAscent / 100, descent: m.fontBoundingBoxDescent / 100 }
        }
      }
      return { out, metrics }
    }, FACES)

    for (const face of Object.keys(totals)) {
      totals[face].web += result.out[face].web
      totals[face].fallback += result.out[face].fallback
      totals[face].runs += result.out[face].runs
      totals[face].ratios.push(...result.out[face].ratios)
      vertical[face] ??= result.metrics[face]
    }
  }
  await page.close()
}
await browser.close()

const pct = (value) => `${(value * 100).toFixed(2)}%`
console.log(`Measured over ${routes.length} routes at 1440 and 412 wide.`)
for (const [face, total] of Object.entries(totals)) {
  const sizeAdjust = total.web / total.fallback
  const { ascent, descent } = vertical[face]
  const sorted = [...total.ratios].sort((a, b) => a - b)
  const at = (f) => pct(sorted[Math.floor(f * (sorted.length - 1))])
  console.log(`\n${face}, against ${FACES[face].fallback} (${total.runs} runs of text)`)
  console.log(`  per-run width ratio: p5 ${at(0.05)}, median ${at(0.5)}, p95 ${at(0.95)}`)
  console.log(`  sizeAdjust: '${pct(sizeAdjust)}',`)
  console.log(`  ascentOverride: '${pct(ascent / sizeAdjust)}',`)
  console.log(`  descentOverride: '${pct(descent / sizeAdjust)}',`)
  console.log(`  lineGapOverride: '0%',`)
}
