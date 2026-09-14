/**
 * Lighthouse CI configuration.
 *
 * The numbers live in lighthouse/budget.json, the performance budget from
 * CLAUDE.md in Lighthouse's budget format. Lighthouse 12 no longer reads
 * budget files itself, so this file turns each line of the budget into an
 * LHCI assertion. Change a budget there, never here.
 *
 * Collection uses Lighthouse's default mobile emulation and throttling: the
 * "mid-range mobile device" the budget is written against.
 */

// LHCI loads this file as CommonJS, so require is the only import available.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const budget = require("./lighthouse/budget.json")[0]

const PORT = process.env.PORT ?? 3100
const ROUTES = ["/", "/projects", "/capabilities"]

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
    },
    assert: { assertions },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
}
