import { defineConfig, devices } from "@playwright/test"

/**
 * Quality gates. Runs against the production build (`next start`), never the
 * dev server: dev mode ships unminified JS and an overlay that axe and the
 * visual snapshots would both pick up.
 *
 * Build first: `pnpm build && pnpm test:e2e`. CI does the same.
 */

const PORT = Number(process.env.PORT ?? 3100)
const BASE_URL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  // `list` in CI too, so values tests print (the late-font CLS baseline)
  // appear in the job log.
  reporter: process.env.CI
    ? [["github"], ["list"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],

  snapshotPathTemplate:
    "{testDir}/__snapshots__/{testFileName}/{arg}-{projectName}-{platform}{ext}",

  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      // Anti-aliasing noise only. A moved rule or a changed colour is far more.
      maxDiffPixelRatio: 0.002,
    },
  },

  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      // The site office phone. Chromium with a phone viewport and touch,
      // so the suite needs one browser binary, not two.
      name: "mobile",
      use: { ...devices["Pixel 7"] },
    },
  ],

  // Linux baselines are generated in CI (workflow_dispatch, update_snapshots)
  // since font rasterising differs from the Windows machines they were first
  // taken on. Until they are committed, a missing baseline fails the run.
  updateSnapshots: "none",

  webServer: {
    command: `pnpm exec next start -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
