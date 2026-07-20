/**
 * next-sitemap configuration
 *
 * Routes are DISCOVERED AUTOMATICALLY from the Next.js build output, so any
 * future page (including new /case-study/* routes) is included without editing
 * this file. Non-indexable routes are removed via the `exclude` globs below.
 *
 * siteUrl is hardcoded to the production origin so the generated <loc> values
 * are always correct, regardless of NEXT_PUBLIC_SITE_URL at build time (a stray
 * localhost value previously poisoned every URL).
 *
 * robots.txt is maintained by hand at public/robots.txt, so generateRobotsTxt
 * is disabled here to avoid clobbering it on every build.
 */
module.exports = {
  siteUrl: 'https://www.infinus.co',
  generateRobotsTxt: false,
  // No genuine per-page modification dates exist; omit lastmod rather than
  // stamp every URL with the build/deploy time on each deployment.
  autoLastmod: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 7000,
  // Keep non-canonical, redirected, demo, debug and utility routes out of the sitemap.
  // Everything else that the build produces is included automatically.
  exclude: [
    '/**#*',
    '/cfo', // permanent redirect -> /grow/cfo
    '/hero-demo',
    '/combined-demo',
    '/services-demo',
    '/footer-demo',
    '/env-test',
    '/test-join',
    '/test-footer',
    '/vi-debug',
    '/debug',
    '/debug/*',
    '/well-known',
    '/well-known/*',
    '/.well-known',
    '/.well-known/*',
    '/llms.txt', // plaintext AI file, not an indexable page
    '/privacy', // intentionally noindex,follow -> keep out of the sitemap
  ],
  transform: async (config, path) => {
    const keyRoutes = ['/', '/grow', '/grow/cfo', '/grow/ceo', '/professional-services', '/contact', '/faq'];
    const priority = keyRoutes.includes(path) ? 0.8 : 0.7;

    return {
      loc: path,
      changefreq: 'weekly',
      priority,
    };
  },
};
