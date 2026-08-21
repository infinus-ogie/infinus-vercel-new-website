import { defineConfig, devices } from '@playwright/test'

/**
 * Focused config for the browser assertions that must run against a real production build.
 *
 * Three specs, all needing a real layout/network engine that jsdom cannot provide:
 *   · consent.spec.ts        — the "no vendor request before consent" network proof
 *   · contact-layout.spec.ts — the narrow-viewport overflow guard for the Contact pair
 *   · video-switcher.spec.ts — proof the video overlay does not cover the navbar. Pure
 *                              paint order, so it needs elementFromPoint and real layout.
 *
 * Separate from playwright.config.local.ts on purpose:
 *
 *  - It deliberately EXCLUDES scripts/qa/ga4-smoke.spec.ts, which waits for a `gtag/js`
 *    request on page load — now correct behaviour to NOT have, since analytics no longer
 *    loads without consent. That spec is run separately via `npm run qa:ga`.
 *
 *  - It serves the PRODUCTION build (`npm run start`) rather than `npm run dev`. The
 *    claim under test is about what real visitors receive, and dev mode injects
 *    tooling that would make a "no vendor request" assertion less meaningful.
 */
export default defineConfig({
  testDir: './scripts/qa',
  // Extending this list is what gives a new browser assertion CI coverage for free: the
  // pipeline already runs `npm run test:consent` against the built site.
  testMatch: /(consent|contact-layout|video-switcher)\.spec\.ts$/,
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
