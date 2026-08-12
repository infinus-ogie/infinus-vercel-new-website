/**
 * Captures and compares a normalized baseline of the <head> of all 17 public pages
 * (16 indexable + /privacy).
 *
 *   npm run seo:snapshot-head          compare against the committed baseline (CI mode)
 *   npm run seo:snapshot-head -- --write   rewrite the baseline (deliberate change only)
 *
 * Purpose: detect UNINTENDED metadata drift during the later phases. Any expected
 * change (Phase C repointing the privacy link, Phase E changing <html lang>, Phase F
 * moving copy into dictionaries) should show up here as a small, reviewable diff that
 * a human approves with `--write` in the same commit as the production change.
 *
 * ── NORMALIZATION RULES ────────────────────────────────────────────────────────
 * Included, because it is SEO-relevant and stable across builds:
 *   · <html lang>
 *   · <title>
 *   · every <meta name="..."> and <meta property="..."> content value
 *   · <link rel> for the allowlist below (canonical, icon, apple-touch-icon,
 *     manifest, alternate, author) — the rels that carry SEO or identity meaning
 *   · the number of REAL server-rendered <script type="application/ld+json">
 *     elements and the @type values inside them
 *
 * Excluded, because it changes on every build without any SEO meaning:
 *   · <link rel="preload"|"stylesheet"|"prefetch"|"preconnect"> and <script src>
 *     pointing at /_next/static/* (contain content hashes)
 *   · inline <style> blocks
 *   · <meta name="next-size-adjust"> (Next internal)
 *
 * Value normalization: HTML entities are decoded and runs of whitespace collapsed, so
 * a reflow of a long description does not register as a change. Values are otherwise
 * compared verbatim — no lowercasing, no trimming of punctuation, and nothing about
 * canonical, robots or lang is normalized away.
 *
 * Multi-valued keys are kept as arrays IN DOCUMENT ORDER, so a duplicated canonical
 * or a second robots tag is visible rather than collapsed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { EXPECTED_COUNTS, publicPages } from '../../test/fixtures/routes'
import {
  Report,
  assertBuildExists,
  decodeEntities,
  headOf,
  htmlLang,
  htmlPathFor,
  main,
  normalizeSpace,
  resolvePaths,
  ssrJsonLdBlocks,
} from './lib/build-output'

const BASELINE_FILE = 'scripts/seo/baseline/head-baseline.json'

/** <link rel> values that carry SEO or identity meaning. */
const LINK_REL_ALLOWLIST = new Set(['canonical', 'icon', 'apple-touch-icon', 'manifest', 'alternate', 'author'])

/** Meta names that are Next.js internals rather than SEO output. */
const META_NAME_DENYLIST = new Set(['next-size-adjust'])

interface HeadSnapshot {
  htmlLang: string | null
  title: string | null
  /** Keys are "name:<x>" or "property:<x>". Values in document order. */
  meta: Record<string, string[]>
  /** Keys are the rel value. Values are hrefs in document order. */
  links: Record<string, string[]>
  jsonLd: { ssrElementCount: number; types: string[] }
}

type Baseline = Record<string, HeadSnapshot>

/**
 * Read an attribute value from a tag.
 *
 * Case-INSENSITIVE: HTML attribute names are case-insensitive, and React serialises some JSX
 * props in camelCase — notably `hrefLang` rather than `hreflang`. Every other attribute this
 * file reads (rel, href, name, property, content) is already emitted lowercase, so the flag
 * changes nothing for them.
 */
function attr(tag: string, name: string): string | null {
  const m = new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag)
  return m ? decodeEntities(m[1]) : null
}

function snapshotHead(html: string): HeadSnapshot {
  const head = headOf(html)

  const titleMatch = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)
  const meta: Record<string, string[]> = {}
  const links: Record<string, string[]> = {}

  for (const tag of head.match(/<meta\b[^>]*>/gi) ?? []) {
    const content = attr(tag, 'content')
    if (content === null) continue
    const name = attr(tag, 'name')
    const property = attr(tag, 'property')
    let key: string | null = null
    if (name !== null && !META_NAME_DENYLIST.has(name)) key = `name:${name}`
    else if (property !== null) key = `property:${property}`
    if (key === null) continue
    ;(meta[key] ??= []).push(normalizeSpace(content))
  }

  for (const tag of head.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = attr(tag, 'rel')
    const href = attr(tag, 'href')
    if (rel === null || href === null) continue
    if (!LINK_REL_ALLOWLIST.has(rel)) continue
    // rel="alternate" is recorded as "<hreflang> => <href>" so the LANGUAGE TOKEN is pinned,
    // not just the URL. A swap from sr-Latn to sr-Latn-RS, or a lost x-default, would
    // otherwise leave the baseline unchanged while changing what crawlers are told.
    //
    // `attr` is case-insensitive, which matters: React serialises the JSX `hrefLang` prop as
    // the camelCase attribute `hrefLang="…"` rather than lowercase `hreflang="…"`.
    if (rel === 'alternate') {
      const hreflang = attr(tag, 'hreflang')
      ;(links[rel] ??= []).push(`${hreflang ?? '(none)'} => ${normalizeSpace(href)}`)
      continue
    }
    ;(links[rel] ??= []).push(normalizeSpace(href))
  }

  const blocks = ssrJsonLdBlocks(html)
  const types = new Set<string>()
  // exec loop rather than for-of over matchAll(): see the note in lib/build-output.ts.
  for (const block of blocks) {
    const typeRe = /"@type"\s*:\s*"([A-Za-z]+)"/g
    let m: RegExpExecArray | null
    while ((m = typeRe.exec(block)) !== null) types.add(m[1])
  }

  return {
    htmlLang: htmlLang(html),
    title: titleMatch ? normalizeSpace(decodeEntities(titleMatch[1])) : null,
    meta: sortKeys(meta),
    links: sortKeys(links),
    jsonLd: { ssrElementCount: blocks.length, types: Array.from(types).sort() },
  }
}

function sortKeys<T>(obj: Record<string, T>): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
}

/** Human-readable diff of two snapshots, keyed by field. */
function diffSnapshots(route: string, expected: HeadSnapshot, actual: HeadSnapshot): string[] {
  const out: string[] = []
  const cmp = (field: string, a: unknown, b: unknown): void => {
    const as = JSON.stringify(a)
    const bs = JSON.stringify(b)
    if (as !== bs) out.push(`${route} ${field}:\n        baseline: ${as}\n        current:  ${bs}`)
  }
  cmp('htmlLang', expected.htmlLang, actual.htmlLang)
  cmp('title', expected.title, actual.title)
  cmp('jsonLd', expected.jsonLd, actual.jsonLd)
  for (const key of Array.from(new Set(Object.keys(expected.meta).concat(Object.keys(actual.meta))))) {
    cmp(`meta[${key}]`, expected.meta[key], actual.meta[key])
  }
  for (const key of Array.from(new Set(Object.keys(expected.links).concat(Object.keys(actual.links))))) {
    cmp(`link[${key}]`, expected.links[key], actual.links[key])
  }
  return out
}

main(() => {
  const paths = resolvePaths()
  assertBuildExists(paths)

  const write = process.argv.slice(2).includes('--write')
  const baselineFile = path.join(paths.projectRoot, BASELINE_FILE)
  const report = new Report(write ? 'Head baseline — WRITE' : 'Head baseline comparison')

  const pages = publicPages()
  report.check(
    pages.length === EXPECTED_COUNTS.snapshotPages,
    `expected ${EXPECTED_COUNTS.snapshotPages} public pages to snapshot, fixture has ${pages.length}`
  )

  const current: Baseline = {}
  for (const route of pages) {
    const file = htmlPathFor(paths, route.path)
    if (!fs.existsSync(file)) {
      report.check(false, `${route.path} has no built HTML, cannot snapshot its head`)
      continue
    }
    current[route.path] = snapshotHead(fs.readFileSync(file, 'utf8'))
  }

  if (write) {
    fs.mkdirSync(path.dirname(baselineFile), { recursive: true })
    fs.writeFileSync(baselineFile, `${JSON.stringify(sortKeys(current), null, 2)}\n`, 'utf8')
    report.note(`wrote ${Object.keys(current).length} page snapshots to ${BASELINE_FILE}`)
    report.note('review this diff carefully — it is the record of what the site advertises to crawlers')
    return report.finish()
  }

  if (!fs.existsSync(baselineFile)) {
    report.check(false, `no baseline at ${BASELINE_FILE} — create it with: npm run seo:snapshot-head -- --write`)
    return report.finish()
  }

  const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf8')) as Baseline
  report.note(`comparing ${Object.keys(current).length} pages against ${BASELINE_FILE}`)

  for (const route of Object.keys(baseline)) {
    report.check(route in current, `${route} is in the baseline but was not produced by this build`)
  }
  for (const route of Object.keys(current)) {
    report.check(route in baseline, `${route} is a new public page with no baseline entry — add it with --write`)
  }

  for (const [route, actual] of Object.entries(current)) {
    const expected = baseline[route]
    if (expected === undefined) continue
    const diffs = diffSnapshots(route, expected, actual)
    for (const d of diffs) report.check(false, `head drift — ${d}`)
    report.check(diffs.length === 0, `${route} <head> differs from the baseline (${diffs.length} field(s))`)
  }

  return report.finish()
})
