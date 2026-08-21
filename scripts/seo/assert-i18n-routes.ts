/**
 * PERMANENT i18n route + output assertions.
 *
 *   npm run seo:assert-i18n
 *
 * The unit tests in test/i18n/ prove the primitives behave correctly. This script proves
 * something they cannot: what the SHIPPED BUILD actually contains.
 *
 * Phase F asserted the foundation was entirely inert. Phase G turned on one pair and Phase H1
 * two more, so the claim under test is: exactly the COMPLETE pairs may emit locale output,
 * each pair internally consistent, and every other document must emit none. That distinction
 * is the whole safety story, so it is asserted per-document rather than in aggregate.
 *
 * A. The /sr URL space contains ONLY the live Serbian paths the route map declares — no
 *    undeclared Serbian URL in the manifest, the prerendered output or the sitemap.
 * B. No planned path from content/routes.ts exists as a real route. As of Phase H3 the
 *    planned set is EMPTY, so what B now guards is that the map is not empty INSTEAD of
 *    being fully translated — an emptied or mis-parsed map would produce the same zero.
 * C. Reciprocal hreflang, on the real pair and NOWHERE ELSE:
 *      · each page of a complete pair emits one <link rel="alternate" hreflang> per locale
 *        plus x-default, with the exact absolute URLs the map implies
 *      · both halves of the SAME pair emit the IDENTICAL set — a one-way annotation is
 *        ignored by crawlers, and different pairs must not be conflated
 *      · x-default points at the default locale (English)
 *      · every self-reference is present (a page must list itself)
 *      · every other prerendered document emits zero hreflang and zero rel="alternate"
 * D. The language switcher renders ONLY on pages with a real counterpart, and never links
 *    to a path the map does not declare live.
 * E. Every `live` path in the map is a real route in the manifest whose document declares
 *    the <html lang> its locale implies, and whose canonical is self-referential.
 * F. The route-pair map is structurally sound (validateRoutePairs).
 *
 * Assertion C scans the served <head>, not the source: Next can emit hreflang from
 * `alternates.languages` anywhere in the metadata chain, so the document is the only
 * trustworthy place to look.
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  Report,
  assertBuildExists,
  headOf,
  metaByProperty,
  htmlLang,
  linkByRel,
  listRenderedHtml,
  main,
  readManifest,
  resolvePaths,
  routePathForHtml,
} from './lib/build-output'
import { ROUTE_PAIRS, validateRoutePairs } from '../../content/routes'
import { allLivePaths, localeAlternatesFor, localeOfPath, plannedPaths } from '../../lib/locale-routes'
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, absoluteUrl, htmlLangFor } from '../../lib/i18n'

const SITEMAP_URLSET = 'public/sitemap-0.xml'

function isSerbianPrefixed(routePath: string): boolean {
  return routePath === '/sr' || routePath.indexOf('/sr/') === 0
}

/**
 * `hreflang` values of every <link rel="alternate"> in a head, in document order.
 *
 * Matched case-INSENSITIVELY on purpose: React serialises the JSX `hrefLang` prop as the
 * camelCase attribute `hrefLang="…"`, not lowercase `hreflang="…"`. HTML attribute names are
 * case-insensitive so browsers and crawlers read it identically, but a case-sensitive check
 * here would silently find zero alternates and report a false PASS.
 */
function alternateHreflangs(head: string): string[] {
  const re = /<link[^>]*\srel="alternate"[^>]*>/gi
  const out: string[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(head)) !== null) {
    const tag = m[0]
    const lang = /\shreflang="([^"]*)"/i.exec(tag)
    const href = /\shref="([^"]*)"/i.exec(tag)
    out.push(`${lang ? lang[1] : '(none)'} => ${href ? href[1] : '(none)'}`)
  }
  return out
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

  // Widened to string[] so they can be compared against plain manifest / sitemap /
  // markup strings, which carry no template-literal path type.
  const live: string[] = allLivePaths()
  const planned: string[] = plannedPaths()
  report.note(`${ROUTE_PAIRS.length} route pairs, ${live.length} live paths, ${planned.length} planned`)

  /** Paths whose pair is complete on both sides — the only ones allowed locale output. */
  const pairedPaths: string[] = []
  for (let i = 0; i < live.length; i += 1) {
    if (localeAlternatesFor(live[i]) !== null) pairedPaths.push(live[i])
  }
  report.note(
    pairedPaths.length === 0
      ? 'no complete locale pair yet — zero hreflang expected everywhere'
      : `complete locale pair(s): ${pairedPaths.join(', ')}`
  )
  // A complete pair must have one member per locale, so the count is always a multiple of
  // the locale count. An odd number means the map lost reciprocity.
  report.check(
    pairedPaths.length % LOCALES.length === 0,
    `${pairedPaths.length} paired paths is not a whole number of ${LOCALES.length}-locale pairs — reciprocity is broken`
  )

  // ── A: the Serbian URL space holds exactly what the map declares ───────────────
  const allRoutes = manifest.pages.concat(manifest.handlers, manifest.framework)
  const declaredSr: string[] = live.filter(isSerbianPrefixed)
  for (const routePath of allRoutes) {
    if (!isSerbianPrefixed(routePath)) continue
    report.check(
      declaredSr.indexOf(routePath) !== -1,
      `route ${routePath} exists under /sr but content/routes.ts does not declare it live`
    )
  }
  for (const declared of declaredSr) {
    report.check(manifest.pages.indexOf(declared) !== -1, `${declared} is declared live but is not a page route`)
  }
  // Every /sr route in the build must be declared; the loop above already proves that. What
  // this adds is the reverse for the PLANNED set, checked explicitly below in section B.

  const sitemapFile = path.join(paths.projectRoot, SITEMAP_URLSET)
  if (fs.existsSync(sitemapFile)) {
    const sitemap = fs.readFileSync(sitemapFile, 'utf8')
    const locRe = /<loc>([^<]*)<\/loc>/g
    const locs: string[] = []
    let lm: RegExpExecArray | null
    while ((lm = locRe.exec(sitemap)) !== null) locs.push(lm[1])

    for (const declared of declaredSr) {
      report.check(
        locs.indexOf(absoluteUrl(declared)) !== -1,
        `${declared} is a live indexable page but is missing from ${SITEMAP_URLSET}`
      )
    }
    for (const loc of locs) {
      const asPath = loc.slice('https://www.infinus.co'.length) || '/'
      if (!isSerbianPrefixed(asPath)) continue
      report.check(declaredSr.indexOf(asPath) !== -1, `${SITEMAP_URLSET} lists undeclared Serbian URL ${loc}`)
    }
    for (const plannedPath of planned) {
      report.check(
        locs.indexOf(absoluteUrl(plannedPath)) === -1,
        `${SITEMAP_URLSET} lists planned (nonexistent) URL ${plannedPath}`
      )
    }
    report.check(!/hreflang/i.test(sitemap), `${SITEMAP_URLSET} contains hreflang alternates`)
  } else {
    report.note(`${SITEMAP_URLSET} not found — run npm run build first for the sitemap checks`)
  }

  // ── B: planned paths are not real ──────────────────────────────────────────────
  // Phase H3 emptied the planned set: every declared route is now a real destination. So
  // `planned.length === 0` is the expected state and cannot be treated as a failure — but it
  // is also exactly what a broken or emptied route map would produce. The guard therefore
  // moved onto the live side, which a mis-parsed map cannot fake.
  report.check(live.length >= 28, `only ${live.length} live paths — the pair map looks empty or unparsed`)
  report.check(ROUTE_PAIRS.length >= 12, `only ${ROUTE_PAIRS.length} route pairs declared`)
  for (const plannedPath of planned) {
    report.check(
      allRoutes.indexOf(plannedPath) === -1,
      `${plannedPath} is marked "planned" in content/routes.ts but exists in the build`
    )
  }

  // ── C + D + E: per-document locale output ──────────────────────────────────────
  report.note(`checking hreflang and switcher markup in ${htmlFiles.length} documents`)
  const emittedSets: Record<string, string> = {}

  for (const file of htmlFiles) {
    const routePath = routePathForHtml(paths, file)
    const html = fs.readFileSync(file, 'utf8')
    const head = headOf(html)
    const alternates = alternateHreflangs(head)
    const expected = localeAlternatesFor(routePath)

    // ── og:locale must match the document's language ────────────────────────────
    // Checked for EVERY document, not just paired ones, because this is a property of the
    // page's language rather than of its pairing.
    //
    // The bug this caught: /sr/projectpulse/brochure and /sr/projectpulse/video hand-write
    // their metadata objects and set no `openGraph`, so they inherited the ROOT block and
    // told crawlers `og:locale: en_US` — Serbian documents claiming to be American English.
    // Pages built through generatePageMetadata were fine because they spread `base.openGraph`
    // and override `locale`, which is exactly why a per-page convention was not enough and
    // the default now lives in app/(sr)/sr/layout.tsx.
    //
    // Only pages that emit og:locale at all are checked. /cfo and /politika-privatnosti emit
    // none, which is pre-existing and separate from this assertion.
    const ogLocales = metaByProperty(head, 'og:locale')
    if (ogLocales.length > 0) {
      const docLocale = localeOfPath(routePath)
      report.check(
        ogLocales.length === 1,
        `${routePath} emits ${ogLocales.length} og:locale tags; at most one is allowed`
      )
      if (docLocale !== null) {
        const wantOg = LOCALE_META[docLocale].ogLocale
        report.check(
          ogLocales[0] === wantOg,
          `${routePath} is a ${docLocale} document but advertises og:locale ${ogLocales[0]}, expected ${wantOg}`
        )
      }
    }

    if (expected === null) {
      // Every page that is NOT half of a complete pair: zero locale output, as before.
      report.check(alternates.length === 0, `${routePath} emits hreflang but has no complete pair: ${alternates.join(', ')}`)
      report.check(!/x-default/i.test(head), `${routePath} emits x-default but has no complete pair`)
      report.check(
        !/data-language-switcher/.test(html),
        `${routePath} renders the language switcher but has no live counterpart`
      )
      continue
    }

    // Half of the real pair. Build the exact expected set from the map.
    const wanted: string[] = []
    for (let i = 0; i < LOCALES.length; i += 1) {
      const tag = LOCALE_META[LOCALES[i]].bcp47
      wanted.push(`${tag} => ${expected.languages[tag]}`)
    }
    wanted.push(`x-default => ${expected.xDefault}`)

    const got = alternates.slice().sort()
    report.check(
      got.join(' | ') === wanted.slice().sort().join(' | '),
      `${routePath} alternates mismatch.\n      expected: ${wanted.sort().join(', ')}\n      actual:   ${got.join(', ') || '(none)'}`
    )

    // Self-reference: a page must list its own URL among the alternates.
    report.check(
      alternates.some((a) => a.indexOf(`=> ${absoluteUrl(routePath)}`) !== -1),
      `${routePath} does not list itself in its own alternates`
    )

    // x-default must be the default locale's URL, never the other language's.
    const defaultEntry = ROUTE_PAIRS.filter((p) => {
      for (let i = 0; i < LOCALES.length; i += 1) {
        const e = p[LOCALES[i]]
        if (e !== null && e.status === 'live' && e.path === routePath) return true
      }
      return false
    })[0]
    const defaultSide = defaultEntry ? defaultEntry[DEFAULT_LOCALE] : null
    report.check(
      defaultSide !== null && expected.xDefault === absoluteUrl(defaultSide.path),
      `${routePath} x-default is ${expected.xDefault}, expected the ${DEFAULT_LOCALE} URL`
    )

    // The switcher must be rendered here, and must point only at the real counterpart.
    report.check(/data-language-switcher/.test(html), `${routePath} has a live counterpart but renders no switcher`)
    const switcherHrefs = Array.from(html.match(/href="\/sr\/[^"]*"|href="\/contact"/g) ?? [])
    for (const href of switcherHrefs) {
      const target = href.slice('href="'.length, -1)
      report.check(
        live.indexOf(target) !== -1,
        `${routePath} links to ${target}, which content/routes.ts does not declare live`
      )
    }

    emittedSets[routePath] = got.join(' | ')
    report.note(`${routePath} alternates: ${got.join(', ')}`)
  }

  // Reciprocity, checked WITHIN each pair. Comparing every document against one arbitrary
  // document would be wrong as soon as a second pair exists: different pairs legitimately
  // advertise different URLs. What must match is the two halves of the SAME pair.
  for (let i = 0; i < ROUTE_PAIRS.length; i += 1) {
    const pair = ROUTE_PAIRS[i]
    const halves: string[] = []
    for (let j = 0; j < LOCALES.length; j += 1) {
      const entry = pair[LOCALES[j]]
      if (entry !== null && entry.status === 'live') halves.push(entry.path)
    }
    const emitted = halves.filter((path) => emittedSets[path] !== undefined)
    if (emitted.length === 0) continue

    report.check(
      emitted.length === halves.length,
      `pair "${pair.id}": only ${emitted.join(', ')} emitted alternates — a one-way annotation is ignored by crawlers`
    )
    for (let j = 1; j < emitted.length; j += 1) {
      report.check(
        emittedSets[emitted[j]] === emittedSets[emitted[0]],
        `pair "${pair.id}": ${emitted[j]} and ${emitted[0]} emit different alternate sets — hreflang is not reciprocal`
      )
    }
  }

  const emittedPaths = Object.keys(emittedSets)
  report.check(
    emittedPaths.length === pairedPaths.length,
    `${pairedPaths.length} paths should emit alternates but ${emittedPaths.length} documents did`
  )
  report.check(
    emittedPaths.slice().sort().join(', ') === pairedPaths.slice().sort().join(', '),
    `documents that emitted alternates (${emittedPaths.sort().join(', ')}) do not match the complete pairs (${pairedPaths.sort().join(', ')})`
  )

  // ── E: live paths are real, correctly-languaged, self-canonical documents ───────
  for (const livePath of live) {
    const inManifest = manifest.pages.indexOf(livePath) !== -1
    report.check(inManifest, `${livePath} is "live" in content/routes.ts but is not a page route`)
    if (!inManifest) continue

    const htmlFile = path.join(paths.appDir, livePath === '/' ? 'index.html' : `${livePath.replace(/^\//, '')}.html`)
    const exists = fs.existsSync(htmlFile)
    report.check(exists, `${livePath} is "live" but has no prerendered HTML`)
    if (!exists) continue

    const html = fs.readFileSync(htmlFile, 'utf8')
    const locale = localeOfPath(livePath)
    report.check(locale !== null, `${livePath} has no locale owner`)
    if (locale === null) continue

    const actual = htmlLang(html)
    const wantedLang = htmlLangFor(locale)
    report.check(
      actual === wantedLang,
      `${livePath} is owned by locale "${locale}" but its document declares lang="${actual}", expected "${wantedLang}"`
    )

    // Every live page must declare exactly one canonical.
    const canonicals = linkByRel(headOf(html), 'canonical')
    report.check(
      canonicals.length === 1,
      `${livePath} declares ${canonicals.length} canonicals, expected exactly 1`
    )

    // A PAIRED page must additionally be SELF-canonical: adding alternates must never
    // repoint a canonical at the other language, which would de-index one half of the pair.
    //
    // Scoped to paired pages on purpose. /cfo is live in the map but is redirect-backed and
    // deliberately canonicalises to /grow/cfo; that expectation belongs to the A2 fixture,
    // which assert-build-output already enforces, and must not be restated here.
    if (localeAlternatesFor(livePath) !== null) {
      report.check(
        canonicals.length === 1 && canonicals[0] === absoluteUrl(livePath),
        `${livePath} is half of a locale pair but its canonical is ${canonicals.join(', ') || '(none)'}, expected the self-canonical ${absoluteUrl(livePath)}`
      )
    }
  }

  return report.finish()
})
