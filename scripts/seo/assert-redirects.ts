/**
 * Asserts the redirect configuration in next.config.js.
 *
 *   npm run seo:assert-redirects
 *
 * ── SCOPE AND HONEST LIMITATIONS ───────────────────────────────────────────────
 * This is a CONFIGURATION analysis, not a network test. Nothing here issues an HTTP
 * request, so no claim is made about live behaviour. Specifically:
 *
 *  · The apex→www redirect is matched on `has: [{ type: 'host', value: 'infinus.co' }]`.
 *    Verifying it genuinely requires resolving DNS for the apex domain and following
 *    the response, which cannot be done reliably or reproducibly from CI. It is
 *    therefore checked structurally only (correct target origin, path preserved,
 *    permanent) and explicitly reported as NOT network-verified.
 *  · Path-only redirects ARE resolved against the build output and public/, so a
 *    destination that no longer returns 200 is caught.
 *  · Chain detection is static: a destination path is compared against every other
 *    redirect's source pattern. This catches the realistic case (a redirect target
 *    later becoming a redirect source, e.g. /cfo → /grow/cfo → /sr/grow/cfo) without
 *    pretending to have followed the hops.
 *
 * The long-term rule this encodes: a redirect source must resolve directly to its
 * final 200 destination, never to another redirect.
 */
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { PRODUCTION_ORIGIN, ROUTES, htmlRoutes } from '../../test/fixtures/routes'
import { Report, main, resolvePaths } from './lib/build-output'

interface RedirectHas {
  type: string
  key?: string
  value?: string
}
interface RedirectRule {
  source: string
  destination: string
  permanent?: boolean
  statusCode?: number
  has?: RedirectHas[]
}
interface NextConfigShape {
  redirects?: () => Promise<RedirectRule[]>
  rewrites?: () => Promise<unknown>
}

/** Turn a Next path pattern into a regex so destinations can be matched against sources. */
function patternToRegExp(source: string): RegExp {
  const escaped = source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const withParams = escaped
    // /:path*  → match the rest, including nothing
    .replace(/\\\/:[A-Za-z_]+\\\*/g, '(?:/.*)?')
    // /:slug   → match one segment
    .replace(/:[A-Za-z_]+/g, '[^/]+')
  return new RegExp(`^${withParams}$`)
}

/** Does a path-only redirect apply to this pathname? (Host-conditional rules excluded.) */
function isPathOnly(rule: RedirectRule): boolean {
  return !rule.has || rule.has.length === 0
}

main(async () => {
  const { projectRoot, buildDir } = resolvePaths()
  const report = new Report('Redirect configuration assertions')

  const require_ = createRequire(path.join(projectRoot, 'package.json'))
  const config = require_(path.join(projectRoot, 'next.config.js')) as NextConfigShape

  if (typeof config.redirects !== 'function') {
    report.check(false, 'next.config.js does not export a redirects() function')
    return report.finish()
  }

  const rules = await config.redirects()
  report.note(`${rules.length} redirect rules found in next.config.js`)
  report.note('apex→www host redirect is checked structurally only — NOT network-verified')

  // Every route that returns 200: fixture pages with HTML, plus files in public/.
  const okPaths = new Set(htmlRoutes().map((r) => r.path))
  const publicFileExists = (pathname: string): boolean =>
    fs.existsSync(path.join(projectRoot, 'public', decodeURIComponent(pathname)))

  const sourcePatterns = rules.map((r) => ({ rule: r, re: patternToRegExp(r.source) }))

  for (const rule of rules) {
    const label = `redirect ${rule.source} → ${rule.destination}`

    // ── structural hygiene ──────────────────────────────────────────────────────
    report.check(rule.source.startsWith('/'), `${label}: source must be a root-relative path`)
    report.check(
      rule.permanent === true || typeof rule.statusCode === 'number',
      `${label}: must declare permanent (301) or an explicit statusCode — never leave it implicit`
    )

    // Destination must be same-origin or an absolute URL on the production origin.
    const isAbsolute = /^https?:\/\//.test(rule.destination)
    if (isAbsolute) {
      report.check(
        rule.destination.startsWith(`${PRODUCTION_ORIGIN}/`),
        `${label}: absolute destination must be on ${PRODUCTION_ORIGIN}`
      )
    }

    // ── destination resolution (path-only rules) ────────────────────────────────
    if (isPathOnly(rule)) {
      const destPath = isAbsolute ? rule.destination.slice(PRODUCTION_ORIGIN.length) : rule.destination
      const destPathname = destPath.split('#')[0].split('?')[0]

      if (!destPathname.includes(':')) {
        const resolves = okPaths.has(destPathname) || publicFileExists(destPathname)
        report.check(
          resolves,
          `${label}: destination ${destPathname} does not resolve to a prerendered page or a file in public/ — ` +
            `a redirect must land on a 200`
        )

        // ── chain detection ──────────────────────────────────────────────────────
        for (const { rule: other, re } of sourcePatterns) {
          if (other === rule) continue
          if (!isPathOnly(other)) continue // host-conditional rules are not a path chain
          report.check(
            !re.test(destPathname),
            `REDIRECT CHAIN: ${label} lands on ${destPathname}, which is itself redirected by ` +
              `"${other.source} → ${other.destination}". Point the first redirect at the final destination.`
          )
        }
      }
    }

    // ── redirect sources must not be advertised as live URLs ────────────────────
    const fixtureMatch = ROUTES.find((r) => r.path === rule.source)
    if (fixtureMatch) {
      report.check(
        fixtureMatch.inSitemap === false,
        `${label}: ${rule.source} is a redirect source but is marked inSitemap in the fixture`
      )
      report.check(
        fixtureMatch.kind === 'page-redirected' || fixtureMatch.kind === 'redirect-only',
        `${label}: ${rule.source} is a redirect source but the fixture classifies it as "${fixtureMatch.kind}" ` +
          `— it should be "page-redirected" (page still built) or "redirect-only" (no page component)`
      )
    }
  }

  // ── the three redirects we know must exist ──────────────────────────────────────
  // Named explicitly so that silently deleting one is a failure rather than a
  // vacuously smaller rule set.
  const expectPresent: { description: string; match: (r: RedirectRule) => boolean }[] = [
    {
      description: '/cfo → /grow/cfo',
      match: (r) => r.source === '/cfo' && r.destination === '/grow/cfo' && r.permanent === true,
    },
    {
      description: 'legacy ProjectPulse brochure PDF → /projectpulse/brochure',
      match: (r) =>
        r.source.includes('ProjectPulse') &&
        r.destination === `${PRODUCTION_ORIGIN}/projectpulse/brochure` &&
        r.permanent === true,
    },
    {
      description: '/privacy → /politika-privatnosti',
      match: (r) => r.source === '/privacy' && r.destination === '/politika-privatnosti' && r.permanent === true,
    },
    {
      description: 'apex infinus.co/:path* → www.infinus.co/:path*',
      match: (r) =>
        r.source === '/:path*' &&
        (r.has ?? []).some((h) => h.type === 'host' && h.value === 'infinus.co') &&
        r.destination === `${PRODUCTION_ORIGIN}/:path*` &&
        r.permanent === true,
    },
  ]

  for (const expected of expectPresent) {
    report.check(rules.some(expected.match), `expected redirect is missing or changed: ${expected.description}`)
  }

  // ── source encoding: Next matches the encoded request path ──────────────────────
  for (const rule of rules) {
    if (rule.source.includes(' ')) {
      report.check(
        false,
        `redirect source "${rule.source}" contains a literal space; it must be percent-encoded (%20) ` +
          `because Next matches against the encoded request path`
      )
    }
  }

  // ── rewrites: report only, they are not redirects ───────────────────────────────
  if (typeof config.rewrites === 'function') {
    const rewrites = (await config.rewrites()) as RedirectRule[]
    report.note(`${rewrites.length} rewrite rules found`)
    for (const rw of rewrites) {
      if (rw.source === rw.destination) {
        report.note(
          `NO-OP REWRITE (known issue, not failed here): "${rw.source}" → "${rw.destination}" is identity ` +
            `and can be deleted in the Cleanup phase`
        )
      }
    }
  }

  report.note(`build dir used for destination resolution: ${buildDir}`)
  return report.finish()
})
