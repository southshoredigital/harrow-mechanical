/**
 * Lighthouse CI configuration.
 *
 * The numbers live in lighthouse/budget.json, the performance budget from
 * CLAUDE.md in Lighthouse's budget format. Lighthouse 12 no longer reads
 * budget files itself, so this file turns each line of the budget into an
 * LHCI assertion. Change a budget there, never here.
 *
 * Each budget entry applies to the pages its `path` matches, in the budget
 * format's robots.txt style: `*` matches anything and a trailing `$` anchors
 * the end, so "/*" is every page and "/$" is the homepage alone. The script
 * budget is homepage only, as CLAUDE.md states it.
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
const budgets = require("./lighthouse/budget.json")

const PORT = process.env.PORT ?? 3100
// /about and /contact carry the most type that rewraps on font swap, so they
// are the pages a CLS regression would show on first.
const ROUTES = ["/", "/projects", "/capabilities", "/about", "/contact"]

/** A budget path, robots.txt style, as a pattern over the full page URL. */
function urlPattern(path) {
  const anchored = path.endsWith("$")
  const body = (anchored ? path.slice(0, -1) : path)
    .split("*")
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*")
  return `^https?://[^/]+${body}${anchored ? "$" : ""}`
}

const assertMatrix = budgets.map(({ path, timings = [], resourceSizes = [] }) => {
  const assertions = {}

  for (const { metric, budget: max } of timings) {
    assertions[metric] = ["error", { maxNumericValue: max, aggregationMethod: "median-run" }]
  }

  for (const { resourceType, budget: kb } of resourceSizes) {
    // Budget files are in KB of transfer size; the audit reports bytes.
    assertions[`resource-summary:${resourceType}:size`] = [
      "error",
      { maxNumericValue: kb * 1024, aggregationMethod: "median-run" },
    ]
  }

  return { matchingUrlPattern: urlPattern(path), assertions }
})

module.exports = {
  ci: {
    collect: {
      url: ROUTES.map((route) => `http://localhost:${PORT}${route}`),
      numberOfRuns: 3,
      settings: { throttlingMethod: "devtools" },
    },
    assert: { assertMatrix },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
}
