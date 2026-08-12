/**
 * PERMANENT i18n route + output assertions.
 *
 *   npm run seo:assert-i18n
 *
 * The unit tests in test/i18n/ prove the primitives behave correctly. This script proves
 * something they cannot: that the SHIPPED BUILD contains none of it. The i18n foundation is
 * only safe while it is inert, and "inert" is a property of the output, not of the model.
 *
 * A. No /sr route exists — not in the route manifest, not as prerendered HTML, not in
 *    the sitemap. No Serbian URL launches in this phase.
 * B. No planned path from content/routes.ts exists as a real route.
 * C. Zero hreflang: no <link rel="alternate" hreflang> and no x-default in ANY prerendered
 *    document. There is no genuine EN/SR pair, so any hreflang would be a lie to crawlers.
 * D. No visible language switcher: the component's marker attribute appears in no document,
 *    and the shared chrome does not import it.
 * E. Every `live` path in the route-pair map is a real route in the manifest, and its
 *    document declares the <html lang> its locale implies. A pair map that points at a
 *    nonexistent page would produce a broken switcher the moment it is turned on.
 * F. The route-pair map is structurally sound (validateRoutePairs), checked here too so a
 *    broken map fails the build gate and not only the unit suite.
 * G. The foundation is INERT: no page, layout or shared SEO helper imports it, so it
 *    contributes nothing to any shipped bundle. Verified against source because a stray
 *    import breaks no behavioural assertion — it only moves bytes.
 *
 * Assertion C scans the served <head> rather than the source: hreflang can be emitted by
 * Next from `alternates.languages` anywhere in the metadata chain, so the document is the
 * only trustworthy place to look.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  Report,
  assertBuildExists,
  headOf,
  htmlLang,
  listRenderedHtml,
  main,
  readManifest,
  resolvePaths,
  routePathForHtml,
} from './lib/build-output'
import { ROUTE_PAIRS, validateRoutePairs } from '../../content/routes'
import { allLivePaths, localeOfPath, plannedPaths } from '../../lib/locale-routes'
import { htmlLangFor } from '../../lib/i18n'

const SITEMAP_URLSET = 'public/sitemap-0.xml'

/** Chrome files that must not mount the switcher. */
const CHROME_FILES = [
  'components/shell/RootShell.tsx',
  'components/shell/SiteChrome.tsx',
  'components/ui/navbar-demo.tsx',
  // The footer SiteChrome actually renders (components/layout/footer.tsx is unused).
  'components/ui/footer.tsx',
]

function isSerbianPrefixed(routePath: string): boolean {
  return routePath === '/sr' || routePath.indexOf('/sr/') === 0
}

main(() => {
  const paths = resolvePaths()
  assertBuildExists(paths)
  const report = new Report('i18n route + output assertions')

  const manifest = readManifest(paths)
  const htmlFiles = listRenderedHtml(paths)
  report.check(htmlFiles.length > 0, 'no prerendered HTML found — the build output looks wrong')
  report.note(`${manifest.total} manifest entries, ${htmlFiles.length} prerendered documents`)

  // ── F: the map itself ──────────────────────────────────────────────────────────
  const problems = validateRoutePairs()
  report.check(problems.length === 0, `content/routes.ts is invalid: ${problems.join('; ')}`)
  report.note(`${ROUTE_PAIRS.length} route pairs, ${allLivePaths().length} live paths, ${plannedPaths().length} planned`)

  // ── A: no Serbian URL space exists yet ─────────────────────────────────────────
  const allRoutes = manifest.pages.concat(manifest.handlers, manifest.framework)
  for (const routePath of allRoutes) {
    report.check(!isSerbianPrefixed(routePath), `route ${routePath} launches the /sr URL space`)
  }
  for (const file of htmlFiles) {
    const routePath = routePathForHtml(paths, file)
    report.check(!isSerbianPrefixed(routePath), `prerendered document ${routePath}.html is under /sr`)
  }

  const sitemapFile = path.join(paths.projectRoot, SITEMAP_URLSET)
  if (fs.existsSync(sitemapFile)) {
    const sitemap = fs.readFileSync(sitemapFile, 'utf8')
    report.check(!/<loc>[^<]*\/sr(\/|<)/.test(sitemap), `${SITEMAP_URLSET} contains a /sr URL`)
    // next-sitemap can emit alternate refs; there is nothing to alternate to yet.
    report.check(!/hreflang/i.test(sitemap), `${SITEMAP_URLSET} contains hreflang alternates`)
  } else {
    report.note(`${SITEMAP_URLSET} not found — run npm run build first for the sitemap checks`)
  }

  // ── B: planned paths are not real ──────────────────────────────────────────────
  const planned = plannedPaths()
  report.check(planned.length > 0, 'no planned paths declared — the pair map looks empty')
  for (const plannedPath of planned) {
    report.check(
      allRoutes.indexOf(plannedPath) === -1,
      `${plannedPath} is marked "planned" in content/routes.ts but exists in the build`
    )
  }

  // ── C + D: nothing i18n reaches any document ───────────────────────────────────
  report.note(`scanning ${htmlFiles.length} documents for hreflang and language-switcher markup`)
  for (const file of htmlFiles) {
    const routePath = routePathForHtml(paths, file)
    const html = fs.readFileSync(file, 'utf8')
    const head = headOf(html)

    report.check(!/hreflang\s*=/i.test(head), `${routePath} emits an hreflang link`)
    report.check(!/x-default/i.test(head), `${routePath} emits an x-default alternate`)
    report.check(
      !/<link[^>]*rel="alternate"/i.test(head),
      `${routePath} emits a rel="alternate" link`
    )
    // The switcher's marker attribute. Anywhere in the document, not just the head.
    report.check(!/data-language-switcher/.test(html), `${routePath} renders the language switcher`)
  }

  for (const chrome of CHROME_FILES) {
    const full = path.join(paths.projectRoot, chrome)
    if (!fs.existsSync(full)) {
      report.note(`${chrome} not found — skipped`)
      continue
    }
    report.check(
      !/LanguageSwitcher/.test(fs.readFileSync(full, 'utf8')),
      `${chrome} imports LanguageSwitcher — the switcher must stay unmounted`
    )
  }

  // ── G: the foundation ships in no bundle ───────────────────────────────────────
  // Matches the import specifier, so the doc comments in these files (which name the
  // modules in prose) cannot trigger a false failure.
  const FOUNDATION = /from\s+['"](?:@\/)?(?:\.\.?\/)*(?:lib\/)?(?:i18n|locale-routes|seo-i18n)['"]|from\s+['"](?:@\/)?content\/(?:routes|dictionary)['"]/
  const consumers: string[] = []
  const walk = (dir: string): void => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry.name) && FOUNDATION.test(fs.readFileSync(full, 'utf8'))) {
        consumers.push(path.relative(paths.projectRoot, full))
      }
    }
  }
  walk(path.join(paths.projectRoot, 'app'))
  report.check(
    consumers.length === 0,
    `these route files import the i18n foundation, which is meant to be inert: ${consumers.join(', ')}`
  )

  const seoSource = path.join(paths.projectRoot, 'lib/seo.ts')
  report.check(
    !FOUNDATION.test(fs.readFileSync(seoSource, 'utf8')),
    'lib/seo.ts imports the i18n foundation — 10 pages import lib/seo.ts, so that would ' +
      'pull content/routes.ts into their bundles'
  )

  // ── E: every live pair-map path is a real route with the right document language ─
  for (const livePath of allLivePaths()) {
    const inManifest = manifest.pages.indexOf(livePath) !== -1
    report.check(inManifest, `${livePath} is "live" in content/routes.ts but is not a page route`)
    if (!inManifest) continue

    const htmlFile = path.join(paths.appDir, livePath === '/' ? 'index.html' : `${livePath.replace(/^\//, '')}.html`)
    const exists = fs.existsSync(htmlFile)
    report.check(exists, `${livePath} is "live" but has no prerendered HTML`)
    if (!exists) continue

    const locale = localeOfPath(livePath)
    report.check(locale !== null, `${livePath} has no locale owner`)
    if (locale === null) continue

    const actual = htmlLang(fs.readFileSync(htmlFile, 'utf8'))
    const expected = htmlLangFor(locale)
    report.check(
      actual === expected,
      `${livePath} is owned by locale "${locale}" but its document declares lang="${actual}", expected "${expected}"`
    )
  }

  return report.finish()
})
