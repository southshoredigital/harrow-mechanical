/**
 * Lighthouse CI configuration.
 *
 * The numbers live in lighthouse/budget.json, the performance budget from
 * CLAUDE.md in Lighthouse's budget format. Lighthouse 12 no longer reads
 * budget files itself, so this file turns each line of the budget into an
 * LHCI assertion. Change a budget there, never here.
 *
 * Collection uses Lighthouse's mobile emulation (412px, 4x CPU slowdown,
 * slow 4G network): the "mid-range mobile device" the budget is written
 * against.
 *
 * Throttling is applied, not simulated. Lighthouse's default simulated mode
 * loads the page unthrottled and then estimates what the metrics would have
 * been on a slow device, by replaying everything requested before the first
 * paint. On this site that counts framework script, preloaded fonts and lazy
 * images against LCP even though none of them delays the LCP text, and it
 * reported about 3s where the real paint under the same throttling measures
 * about 1.5s. The budget in CLAUDE.md describes real paint on a mid-range
 * phone, so the gate measures it. Applied throttling also loads fonts late
 * enough to expose layout shift from font swap, which simulated mode, loading
 * unthrottled, never saw.
 */

// LHCI loads this file as CommonJS, so require is the only import available.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const budget = require("./lighthouse/budget.json")[0]

const PORT = process.env.PORT ?? 3100
// /about and /contact carry the most type that rewraps on font swap, so they
// are the pages a CLS regression would show on first.
const ROUTES = ["/", "/projects", "/capabilities", "/about", "/contact"]

const assertions = {}

for (const { metric, budget: max } of budget.timings) {
  assertions[metric] = ["error", { maxNumericValue: max, aggregationMethod: "median-run" }]
}

for (const { resourceType, budget: kb } of budget.resourceSizes) {
  // Budget files are in KB of transfer size; the audit reports bytes.
  assertions[`resource-summary:${resourceType}:size`] = [
    "error",
    { maxNumericValue: kb * 1024, aggregationMethod: "median-run" },
  ]
}

module.exports = {
  ci: {
    collect: {
      url: ROUTES.map((route) => `http://localhost:${PORT}${route}`),
      numberOfRuns: 3,
      settings: { throttlingMethod: "devtools" },
    },
    assert: { assertions },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
}
