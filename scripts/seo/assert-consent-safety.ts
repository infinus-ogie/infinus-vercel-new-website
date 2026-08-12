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

/**
 * Strip comments before structural matching.
 *
 * These files legitimately DISCUSS <html>, <body> and the consent components in their
 * doc comments, and matching prose would report a false violation — the kind of failure
 * that teaches people to ignore a check. Assertions below therefore run against code only.
 */
function codeOnly(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
}

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

  // ── D: every ROOT layout must stay vendor-free and mount consent exactly once ──
  // Phase E replaced the single app/layout.tsx with two locale roots. Both delegate to
  // components/shell/RootShell.tsx, which is where <html>/<body>, the fonts and the
  // consent mounts now live — so the guarantee has to be asserted there, and the roots
  // must be verified to add nothing of their own.
  const shell = path.join(paths.projectRoot, 'components', 'shell', 'RootShell.tsx')
  const roots = ['app/(en)/layout.tsx', 'app/(sr)/layout.tsx'].map((r) => path.join(paths.projectRoot, r))

  report.check(fs.existsSync(shell), 'components/shell/RootShell.tsx not found — the shared document shell is missing')
  for (const root of roots) {
    report.check(fs.existsSync(root), `${path.relative(paths.projectRoot, root)} not found — a locale root layout is missing`)
  }

  const noOldRoot = !fs.existsSync(path.join(paths.projectRoot, 'app', 'layout.tsx'))
  report.check(
    noOldRoot,
    'app/layout.tsx still exists. With two locale roots it would wrap them and nest <html>, ' +
      'and Next.js only honours multiple root layouts when there is no top-level layout.'
  )

  if (fs.existsSync(shell)) {
    const src = codeOnly(fs.readFileSync(shell, 'utf8'))
    for (const host of FORBIDDEN_HOSTS) {
      report.check(
        !src.includes(host),
        `RootShell.tsx references ${host}. It renders for every visitor before any consent ` +
          `decision exists, so no vendor URL may appear there.`
      )
    }
    report.check(
      (src.match(/<html\b/g) ?? []).length === 1 && (src.match(/<body\b/g) ?? []).length === 1,
      'RootShell.tsx must render exactly one <html> and one <body>'
    )
    report.check(!src.trimStart().startsWith('"use client"'), 'RootShell.tsx must stay a server component')
    for (const tag of ['<ConsentProvider>', '<AnalyticsGate />', '<MarketingGate />', '<CookieBanner />', '<CookieSettingsDialog />']) {
      report.check(
        (src.match(new RegExp(tag.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g')) ?? []).length === 1,
        `RootShell.tsx must mount ${tag} exactly once`
      )
    }
  }

  // The locale roots themselves may only differ by `lang`: no vendor scripts, no second
  // consent mount, no <html>/<body> of their own, no duplicate font declaration.
  const langs: Record<string, string> = { 'app/(en)/layout.tsx': 'en', 'app/(sr)/layout.tsx': 'sr-Latn' }
  for (const root of roots) {
    if (!fs.existsSync(root)) continue
    const rel = path.relative(paths.projectRoot, root)
    const src = codeOnly(fs.readFileSync(root, 'utf8'))
    for (const host of FORBIDDEN_HOSTS) {
      report.check(!src.includes(host), `${rel} references ${host}`)
    }
    report.check(!/<html\b|<body\b/.test(src), `${rel} must not render its own <html>/<body> — that belongs to RootShell`)
    report.check(!/next\/font/.test(src), `${rel} must not declare fonts — RootShell owns them, so the roots cannot drift`)
    report.check(
      !/<ConsentProvider>|<AnalyticsGate|<MarketingGate|<CookieBanner|<CookieSettingsDialog/.test(src),
      `${rel} must not mount consent components — RootShell owns them`
    )
    report.check(
      src.includes(`lang="${langs[rel]}"`),
      `${rel} must pass lang="${langs[rel]}" to RootShell`
    )
  }

  return report.finish()
})
