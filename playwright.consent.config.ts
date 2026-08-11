import { defineConfig, devices } from '@playwright/test'

/**
 * Focused config for the consent network proof.
 *
 * Separate from playwright.config.local.ts on purpose:
 *
 *  - It runs ONLY scripts/qa/consent.spec.ts. The pre-existing
 *    scripts/qa/ga4-smoke.spec.ts waits for a `gtag/js` request on page load, which is
 *    now correct behaviour to NOT have: analytics no longer loads without consent. That
 *    spec needs rewriting to grant consent first — deliberately left for a separate
 *    change so this diff stays reviewable.
 *
 *  - It serves the PRODUCTION build (`npm run start`) rather than `npm run dev`. The
 *    claim under test is about what real visitors receive, and dev mode injects
 *    tooling that would make a "no vendor request" assertion less meaningful.
 */
export default defineConfig({
  testDir: './scripts/qa',
  testMatch: 'consent.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Requires a prior `npm run build`; CI runs the build step before this one.
    command: 'npx next start --port 3100',
    url: 'http://127.0.0.1:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
