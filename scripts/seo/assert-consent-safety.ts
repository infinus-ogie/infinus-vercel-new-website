/**
 * PERMANENT consent-safety assertions.
 *
 *   npm run seo:assert-consent
 *
 * These are mechanical guarantees, not code-review habits. They exist because the
 * privacy promise in the approved policy — that Google Analytics and other
 * non-essential cookies "may be activated only after you provide consent" — is only as
 * strong as the thing that stops a future change from quietly breaking it.
 *
 * A. No prerendered HTML may reference googletagmanager.com.
 * B. No prerendered HTML may reference the D&B Visitor Intelligence hosts.
 * C. No page.tsx / layout.tsx may import cookies/headers from next/headers, which
 *    would opt the route out of static rendering and re-create the site-wide noindex
 *    regression.
 * D. The consent gates must not be rendered from a server component in a way that
 *    could emit a vendor URL, and the root layout must contain no vendor script.
 *
 * Assertions A and B scan the SERVED HTML rather than the JS bundle: the vendor URL
 * legitimately exists inside the client bundle (that is how it loads after consent).
 * What must never happen is a vendor URL reaching the document before the visitor has
 * chosen, because a browser would then fetch it during initial parse.
 */
import fs from 'node:fs'
import path from 'node:path'
import { Report, assertBuildExists, listRenderedHtml, main, resolvePaths, routePathForHtml } from './lib/build-output'

/** Hosts that must never appear in prerendered HTML. */
const FORBIDDEN_HOSTS = [
  // Google Analytics / Tag Manager loader.
  'googletagmanager.com',
  // D&B Visitor Intelligence: the account subdomain (<id>.d41.co) and the CDN that
  // serves dnb_coretag. Verified against components/analytics/DnbVisitorPixel.tsx and
  // app/_components/VendorScripts.tsx rather than assumed.
  'd41.co',
  // GA4 collect endpoint, in case a future change inlines a measurement call.
  'google-analytics.com',
] as const

/** Source files that must never read request-scoped APIs. */
function collectRouteSources(projectRoot: string): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/^(page|layout|template|default)\.tsx?$/.test(entry.name)) out.push(full)
    }
  }
  walk(path.join(projectRoot, 'app'))
  return out.sort()
}

main(() => {
  const paths = resolvePaths()
  assertBuildExists(paths)
  const report = new Report('Consent safety assertions')

  // ── A + B: no vendor host in any prerendered document ──────────────────────────
  const htmlFiles = listRenderedHtml(paths)
  report.check(htmlFiles.length > 0, 'no prerendered HTML found — the build output looks wrong')
  report.note(`scanning ${htmlFiles.length} prerendered HTML files for pre-consent vendor references`)

  for (const file of htmlFiles) {
    const route = routePathForHtml(paths, file)
    const html = fs.readFileSync(file, 'utf8')
    for (const host of FORBIDDEN_HOSTS) {
      // Match the host only in a URL POSITION — after "//" or "https://" — so a real
      // fetchable reference fails while prose mentioning the host does not.
      // /debug/visitor-intelligence legitimately prints "d41.co" inside a <code> tag as
      // a DevTools instruction; that is documentation, not a script load, and matching
      // the bare string here would be a false positive that trains people to ignore
      // this check.
      const urlReference = new RegExp(`(?:https?:)?//[^"'\\s<>]*${host.replace(/\./g, '\\.')}`, 'i')
      report.check(
        !urlReference.test(html),
        `${route} contains a URL pointing at ${host} in its prerendered HTML — a vendor ` +
          `script must not be emitted before the visitor has consented. Load it from a consent gate.`
      )

      // Belt and braces: the host must not appear inside a <script> or <link> tag at
      // all, however the URL was assembled.
      const tags = html.match(/<(?:script|link)\b[^>]*>/gi) ?? []
      const offending = tags.filter((tag) => tag.toLowerCase().includes(host))
      report.check(
        offending.length === 0,
        `${route} has a <script>/<link> tag referencing ${host}: ${offending[0] ?? ''}`
      )
    }
  }

  // ── C: no request-scoped API in a page/layout ──────────────────────────────────
  const sources = collectRouteSources(paths.projectRoot)
  report.note(`checking ${sources.length} page/layout sources for next/headers usage`)
  const headersImport = /from\s+['"]next\/headers['"]/
  const headersCall = /\b(cookies|headers|draftMode)\s*\(/

  for (const file of sources) {
    const rel = path.relative(paths.projectRoot, file)
    const src = fs.readFileSync(file, 'utf8')
    report.check(
      !headersImport.test(src),
      `${rel} imports from next/headers — reading request state makes the route dynamic, ` +
        `which removes its prerendered HTML and previously caused a site-wide noindex. ` +
        `Read consent on the client after mount instead.`
    )
    if (headersImport.test(src)) continue
    // Only meaningful alongside the import, but catches a re-exported alias too.
    if (headersCall.test(src) && /next\/headers/.test(src)) {
      report.check(false, `${rel} calls a next/headers request API`)
    }
  }

  // ── D: the root layout itself must stay vendor-free ────────────────────────────
  const rootLayout = path.join(paths.projectRoot, 'app', 'layout.tsx')
  if (fs.existsSync(rootLayout)) {
    const src = fs.readFileSync(rootLayout, 'utf8')
    for (const host of FORBIDDEN_HOSTS) {
      report.check(
        !src.includes(host),
        `app/layout.tsx references ${host}. The root layout is a server component, so anything ` +
          `it renders reaches every visitor before a consent decision exists.`
      )
    }
    report.check(
      src.includes('ConsentProvider'),
      'app/layout.tsx no longer mounts <ConsentProvider> — the consent architecture is not active'
    )
    report.check(
      (src.match(/<ConsentProvider>/g) ?? []).length === 1,
      'app/layout.tsx mounts <ConsentProvider> more than once — consent state would fork'
    )
    for (const gate of ['<AnalyticsGate />', '<MarketingGate />', '<CookieBanner />', '<CookieSettingsDialog />']) {
      report.check(
        (src.match(new RegExp(gate.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) ?? []).length === 1,
        `app/layout.tsx must mount ${gate} exactly once`
      )
    }
  } else {
    report.check(false, 'app/layout.tsx not found')
  }

  return report.finish()
})
