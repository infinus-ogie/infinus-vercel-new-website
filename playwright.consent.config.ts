import { defineConfig, devices } from '@playwright/test'

/**
 * Focused config for the browser assertions that must run against a real production build.
 *
 * Four specs, all needing a real layout/network engine that jsdom cannot provide:
 *   · consent.spec.ts        — the "no vendor request before consent" network proof
 *   · growth-routes.spec.ts  — the eight GROW / Professional Services routes: language,
 *                              chrome locale, canonical, hreflang, switcher destination and
 *                              phone-width overflow. Added with the URL migration that made
 *                              four published Serbian paths English.
 *   · contact-layout.spec.ts — the narrow-viewport overflow guard for the Contact pair
 *   · video-switcher.spec.ts — proof the video overlay does not cover the navbar. Pure
 *                              paint order, so it needs elementFromPoint and real layout.
 *   · video-close-control.spec.ts — proof the overlay's close control is inside the
 *                              viewport and clear of the navbar at six widths. Geometry,
 *                              which jsdom cannot measure at all.
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
  testMatch: /(consent|contact-layout|video-switcher|video-close-control|growth-routes)\.spec\.ts$/,
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
