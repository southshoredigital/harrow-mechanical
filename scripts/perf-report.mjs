/**
 * Performance report against the budget in CLAUDE.md.
 *
 *   pnpm build && pnpm start -p 3100   (in another terminal)
 *   node scripts/perf-report.mjs [baseUrl]
 *
 * Lab conditions for "a mid-range mobile device": Lighthouse's mobile preset
 * applied through DevTools, not simulated. 412px viewport, 4x CPU slowdown,
 * 562.5ms round trip, 1.47 Mbps down. Each route is loaded cold three times
 * and the median reported.
 *
 * This is the local instrument. CI runs Lighthouse against the same budget
 * (lighthouse/budget.json), which is the gate.
 */

import { readFileSync } from "node:fs"
import { gzipSync } from "node:zlib"
import { chromium } from "@playwright/test"

const BASE = process.argv[2] ?? "http://localhost:3100"
const ROUTES = ["/", "/projects", "/capabilities"]
const RUNS = 3

const BUDGET = { lcpMs: 2000, cls: 0.01, jsKb: 200, animationKb: 40 }

const kb = (bytes) => Math.round((bytes / 1024) * 10) / 10
const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)]
const gz = (buffer) => gzipSync(buffer).length

async function measure(browser, path) {
  const context = await browser.newContext({
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    isMobile: true,
    hasTouch: true,
  })
  const page = await context.newPage()
  const cdp = await context.newCDPSession(page)
  await cdp.send("Network.enable")
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 562.5,
    downloadThroughput: (1474.5 * 1024) / 8,
    uploadThroughput: (675 * 1024) / 8,
  })
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 })

  const scripts = new Map()
  page.on("response", async (response) => {
    if (response.request().resourceType() !== "script") return
    try {
      scripts.set(new URL(response.url()).pathname, await response.body())
    } catch {
      // Redirects and aborted requests have no body.
    }
  })
  const html = await (await fetch(BASE + path)).text()

  await page.addInitScript(() => {
    window.__lcp = 0
    window.__cls = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) window.__lcp = entry.startTime
    }).observe({ type: "largest-contentful-paint", buffered: true })
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__cls += entry.value
      }
    }).observe({ type: "layout-shift", buffered: true })
  })

  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 120_000 })
  // LCP is finalised on first input; settle, then read.
  await page.waitForTimeout(1500)
  const { lcp, cls } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls }))

  // The page's own JS is what the HTML references. Anything else was fetched
  // at idle by Next prefetching a linked route, and executes only if the
  // reader navigates there.
  let initial = 0
  let prefetched = 0
  let animation = 0
  for (const [pathname, body] of scripts) {
    const size = gz(body)
    if (!html.includes(pathname)) {
      prefetched += size
      continue
    }
    initial += size
    const source = body.toString("latin1")
    if (ANIMATION_SIGNATURES.some((signature) => source.includes(signature))) animation += size
  }

  await context.close()
  return { lcp, cls, initial, prefetched, animation }
}

/**
 * Chunks that carry the animation stack. A chunk is counted whole when it
 * contains any of these, which overstates slightly where a chunk also holds
 * unrelated modules: the report errs towards failing, not passing.
 */
const ANIMATION_SIGNATURES = ["ScrollTrigger", "_gsap", "lenis-smooth", "virtual-scroll"]

/** Reference sizes: each library's own minified distribution, gzipped. */
function libraryReference() {
  const files = {
    "gsap core": "node_modules/gsap/dist/gsap.min.js",
    ScrollTrigger: "node_modules/gsap/dist/ScrollTrigger.min.js",
    "@gsap/react": "node_modules/@gsap/react/dist/index.min.js",
    lenis: "node_modules/lenis/dist/lenis.min.js",
  }
  return Object.fromEntries(
    Object.entries(files).map(([name, file]) => [name, kb(gz(readFileSync(file)))])
  )
}

const browser = await chromium.launch()
const rows = []

for (const path of ROUTES) {
  const runs = []
  for (let i = 0; i < RUNS; i++) runs.push(await measure(browser, path))
  rows.push({
    route: path,
    lcpMs: Math.round(median(runs.map((r) => r.lcp))),
    cls: Math.round(median(runs.map((r) => r.cls)) * 10000) / 10000,
    jsKb: kb(median(runs.map((r) => r.initial))),
    animationKb: kb(median(runs.map((r) => r.animation))),
    idlePrefetchKb: kb(median(runs.map((r) => r.prefetched))),
  })
}
await browser.close()

const verdict = (ok) => (ok ? "pass" : "FAIL")

console.log(`\nMobile lab, Lighthouse mobile throttling applied, median of ${RUNS}. JS is gzipped.\n`)
console.table(
  rows.map((row) => ({
    ...row,
    lcp: verdict(row.lcpMs < BUDGET.lcpMs),
    clsOk: verdict(row.cls <= BUDGET.cls),
    js: verdict(row.jsKb < BUDGET.jsKb),
    anim: verdict(row.animationKb < BUDGET.animationKb),
  }))
)
console.log("Budget: LCP < 2000ms, CLS <= 0.01, JS < 200KB, animation stack < 40KB (homepage).")
console.log("Library reference sizes, gzipped KB:")
console.table(libraryReference())

// The animation budget is scoped to the homepage by CLAUDE.md; the rest
// applies to every measured route.
const failed = rows.filter(
  (row) =>
    row.lcpMs >= BUDGET.lcpMs ||
    row.cls > BUDGET.cls ||
    row.jsKb >= BUDGET.jsKb ||
    (row.route === "/" && row.animationKb >= BUDGET.animationKb)
)
if (failed.length > 0) {
  console.error(`\nOver budget: ${failed.map((row) => row.route).join(", ")}`)
  process.exit(1)
}
