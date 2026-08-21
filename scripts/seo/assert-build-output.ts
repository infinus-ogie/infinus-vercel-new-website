/**
 * Asserts the SEO-relevant properties of the production build output against
 * test/fixtures/routes.ts.
 *
 * Run AFTER `next build`:
 *   npm run seo:assert-build
 *
 * What it protects, in order of importance:
 *
 * 1. STATIC OUTPUT. Every route the fixture marks `expectStaticHtml` must have a
 *    prerendered .html file. A route that silently drops to dynamic rendering loses
 *    its .html — and that is exactly the failure that previously caused Next to
 *    inject a site-wide `noindex` on this site. This is the single most valuable
 *    assertion in the harness.
 * 2. FIXTURE == MANIFEST, so a new route cannot ship unclassified.
 * 3. robots, canonical and <html lang> against independent literal expectations.
 */
import fs from 'node:fs'
import {
  ROUTES,
  PRODUCTION_ORIGIN,
  EXPECTED_COUNTS,
  pageRoutes,
  handlerRoutes,
  htmlRoutes,
  isFrameworkRoute,
} from '../../test/fixtures/routes'
import {
  Report,
  assertBuildExists,
  headOf,
  htmlLang,
  titleOf,
  htmlPathFor,
  linkByRel,
  listRenderedHtml,
  main,
  metaByName,
  normalizeDirectives,
  readManifest,
  resolvePaths,
  routePathForHtml,
  ssrJsonLdBlocks,
} from './lib/build-output'

main(() => {
  const paths = resolvePaths()
  assertBuildExists(paths)

  const report = new Report('SEO build-output assertions')
  report.note(`build dir: ${paths.buildDir}`)

  const manifest = readManifest(paths)

  // ── 1. fixture vs manifest, kept strictly separate by route type ───────────────
  const fixturePagePaths = new Set(pageRoutes().map((r) => r.path))
  const fixtureHandlerPaths = new Set(handlerRoutes().map((r) => r.path))
  const fixtureFrameworkPaths = new Set(ROUTES.filter(isFrameworkRoute).map((r) => r.path))

  for (const p of manifest.pages) {
    report.check(
      fixturePagePaths.has(p),
      `PAGE ${p} is in the build manifest but not classified in test/fixtures/routes.ts — ` +
        `add it with its expected lang, robots, canonical and sitemap behaviour`
    )
  }
  for (const p of Array.from(fixturePagePaths)) {
    report.check(manifest.pages.includes(p), `PAGE ${p} is in the fixture but no longer in the build manifest`)
  }
  for (const h of manifest.handlers) {
    report.check(fixtureHandlerPaths.has(h), `HANDLER ${h} is in the build manifest but not in the fixture`)
  }
  for (const h of Array.from(fixtureHandlerPaths)) {
    report.check(manifest.handlers.includes(h), `HANDLER ${h} is in the fixture but no longer in the build manifest`)
  }
  for (const f of manifest.framework) {
    report.check(fixtureFrameworkPaths.has(f), `FRAMEWORK ${f} is in the build manifest but not in the fixture`)
  }

  // Counts, so a simultaneous add+remove cannot cancel out unnoticed.
  report.check(
    manifest.pages.length === EXPECTED_COUNTS.manifestPages,
    `expected ${EXPECTED_COUNTS.manifestPages} page routes in the manifest, found ${manifest.pages.length}`
  )
  report.check(
    manifest.handlers.length === EXPECTED_COUNTS.manifestHandlers,
    `expected ${EXPECTED_COUNTS.manifestHandlers} route handlers in the manifest, found ${manifest.handlers.length}`
  )
  report.check(
    manifest.total === EXPECTED_COUNTS.manifestTotal,
    `expected ${EXPECTED_COUNTS.manifestTotal} total manifest entries, found ${manifest.total}`
  )

  // ── 2. static output ──────────────────────────────────────────────────────────
  const rendered = listRenderedHtml(paths)
  report.check(
    rendered.length === EXPECTED_COUNTS.renderedHtml,
    `expected ${EXPECTED_COUNTS.renderedHtml} rendered .html files, found ${rendered.length} — ` +
      `a missing file means a route stopped being statically prerendered`
  )

  const renderedRoutes = new Set(rendered.map((f) => routePathForHtml(paths, f)))
  for (const route of htmlRoutes()) {
    report.check(
      renderedRoutes.has(route.path),
      `${route.path} has no prerendered HTML — it is no longer statically generated, ` +
        `which is how this site previously acquired an accidental site-wide noindex`
    )
  }
  for (const routePath of Array.from(renderedRoutes)) {
    report.check(
      htmlRoutes().some((r) => r.path === routePath),
      `${routePath} produced HTML but the fixture does not expect static HTML for it`
    )
  }

  // Route handlers must NOT be treated as HTML pages.
  for (const route of handlerRoutes()) {
    report.check(
      !renderedRoutes.has(route.path),
      `${route.path} is classified as a route handler but produced an HTML document`
    )
  }

  // ── 3. per-page head assertions ───────────────────────────────────────────────
  let ssrJsonLdTotal = 0

  for (const route of htmlRoutes()) {
    const file = htmlPathFor(paths, route.path)
    if (!fs.existsSync(file)) continue // already reported above
    const html = fs.readFileSync(file, 'utf8')
    const head = headOf(html)

    // <html lang>
    const lang = htmlLang(html)
    report.check(
      lang === route.expectLang,
      `${route.path} <html lang> is ${JSON.stringify(lang)}, expected ${JSON.stringify(route.expectLang)}`
    )

    // robots — compared on normalized directives, never on spacing
    const robots = metaByName(head, 'robots')
    report.check(
      robots.length <= 1,
      `${route.path} has ${robots.length} robots meta tags; at most one is allowed`
    )
    const actualRobots = robots.length > 0 ? normalizeDirectives(robots[0]) : null
    report.check(
      actualRobots === route.expectRobots,
      `${route.path} robots is ${JSON.stringify(actualRobots)}, expected ${JSON.stringify(route.expectRobots)}`
    )

    // No indexable or internal route may acquire an unexpected noindex.
    if (route.expectRobots !== null && !route.expectRobots.includes('noindex')) {
      report.check(
        !(actualRobots ?? '').includes('noindex'),
        `${route.path} unexpectedly contains "noindex" — this is the regression the harness exists to catch`
      )
    }

    // canonical
    const canonicals = linkByRel(head, 'canonical')
    if (route.expectCanonical === null) {
      report.check(
        canonicals.length === 0,
        `${route.path} has a canonical (${canonicals.join(', ')}) but none is expected`
      )
    } else {
      report.check(
        canonicals.length === 1,
        `${route.path} has ${canonicals.length} canonical tags, expected exactly 1`
      )
      const actual = canonicals[0]
      if (actual !== undefined) {
        report.check(
          actual === route.expectCanonical,
          `${route.path} canonical is ${actual}, expected ${route.expectCanonical}`
        )
        report.check(
          actual.startsWith(`${PRODUCTION_ORIGIN}/`),
          `${route.path} canonical ${actual} is not on the production origin ${PRODUCTION_ORIGIN}`
        )
        report.check(
          !/localhost|127\.0\.0\.1|vercel\.app/.test(actual),
          `${route.path} canonical ${actual} points at a non-production host`
        )
      }
    }

    // ── <title>: exactly one brand suffix ──────────────────────────────────────
    // Two mechanisms used to append " | Infinus" — lib/seo.ts and the root layout's
    // `title.template` — and on 21 of 35 pages they both fired, rendering
    // "X | Infinus | Infinus". The fix makes lib/seo.ts the single owner via
    // `title.absolute`; this asserts the OUTPUT so a future page that hand-writes its own
    // metadata cannot quietly reintroduce it.
    //
    // The check counts brand SUFFIXES, i.e. "| Infinus" at the end or followed by another
    // "|" separator. It deliberately does NOT ban the word appearing twice: two approved
    // titles legitimately carry the brand mid-string as part of a phrase —
    // "SAP Starter Package | Infinus – SAP Packaged Solutions | Infinus" and the
    // ProjectPulse brochure equivalent — where only the final segment is a suffix.
    const title = titleOf(html)
    if (title !== null) {
      const suffixes = title.split('|').filter((seg) => seg.trim() === 'Infinus').length
      report.check(
        suffixes <= 1,
        `${route.path} <title> repeats the "| Infinus" suffix ${suffixes} times: ${JSON.stringify(title)}`
      )
      report.check(
        !/\|\s*Infinus\s*\|\s*Infinus\s*$/i.test(title),
        `${route.path} <title> ends in a doubled brand suffix: ${JSON.stringify(title)}`
      )
    }

    ssrJsonLdTotal += ssrJsonLdBlocks(html).length
  }

  // ── informational: server-rendered structured data ─────────────────────────────
  // Recorded rather than asserted. The site currently ships ZERO real
  // <script type="application/ld+json"> elements: every schema is injected client
  // side by next/script (default strategy afterInteractive), so it is absent from the
  // HTML a non-rendering crawler receives. Asserting "expect 0" would enshrine the
  // bug; the head snapshot records the count so a fix shows up as a visible diff.
  report.note(
    `server-rendered JSON-LD elements across all pages: ${ssrJsonLdTotal} ` +
      `(KNOWN ISSUE — all structured data is currently client-injected via next/script)`
  )

  return report.finish()
})
