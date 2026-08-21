/**
 * Shared helpers for the SEO regression harness.
 *
 * Dependency-free on purpose: Node built-ins only. The `<head>` of a Next.js page is
 * machine-generated and extremely regular, so targeted regexes are sufficient and
 * avoid adding an HTML-parser dependency for a check that runs in CI.
 */
import fs from 'node:fs'
import path from 'node:path'

export const DEFAULT_BUILD_DIR = '.next'

export interface HarnessPaths {
  projectRoot: string
  buildDir: string
  appDir: string
}

/**
 * Resolve where the build output lives. Overridable so CI (or a build produced in a
 * separate directory) can be checked without copying artefacts around:
 *   SEO_BUILD_DIR=/path/to/.next npm run seo:check
 *   npm run seo:check -- --build-dir=/path/to/.next
 */
export function resolvePaths(argv: readonly string[] = process.argv.slice(2)): HarnessPaths {
  const flag = argv.find((a) => a.startsWith('--build-dir='))
  const fromFlag = flag ? flag.slice('--build-dir='.length) : undefined
  const buildDirRaw = fromFlag ?? process.env.SEO_BUILD_DIR ?? DEFAULT_BUILD_DIR
  const projectRoot = process.cwd()
  const buildDir = path.resolve(projectRoot, buildDirRaw)
  return { projectRoot, buildDir, appDir: path.join(buildDir, 'server', 'app') }
}

export function assertBuildExists(paths: HarnessPaths): void {
  const manifest = path.join(paths.buildDir, 'app-path-routes-manifest.json')
  if (!fs.existsSync(manifest)) {
    throw new Error(
      `No build output found at ${paths.buildDir}\n` +
        `Run \`next build\` first, or point the harness at an existing build with ` +
        `--build-dir=<path> or SEO_BUILD_DIR=<path>.`
    )
  }
}

export interface Manifest {
  /** URL paths of entries whose key ends in /page. */
  pages: string[]
  /** URL paths of entries whose key ends in /route. */
  handlers: string[]
  /** Anything else — currently just /_not-found. */
  framework: string[]
  total: number
}

export function readManifest(paths: HarnessPaths): Manifest {
  const file = path.join(paths.buildDir, 'app-path-routes-manifest.json')
  const raw = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, string>
  const pages: string[] = []
  const handlers: string[] = []
  const framework: string[] = []
  for (const [key, urlPath] of Object.entries(raw)) {
    if (key.endsWith('/page')) pages.push(urlPath)
    else if (key.endsWith('/route')) handlers.push(urlPath)
    else framework.push(urlPath)
  }
  return {
    pages: pages.sort(),
    handlers: handlers.sort(),
    framework: framework.sort(),
    total: Object.keys(raw).length,
  }
}

/** Map a URL path to its prerendered HTML file, mirroring Next's naming ("/" -> index.html). */
export function htmlPathFor(paths: HarnessPaths, routePath: string): string {
  const rel = routePath === '/' ? 'index' : routePath.replace(/^\//, '')
  return path.join(paths.appDir, `${rel}.html`)
}

export function listRenderedHtml(paths: HarnessPaths): string[] {
  const out: string[] = []
  const walk = (dir: string): void => {
    if (!fs.existsSync(dir)) return
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (entry.name.endsWith('.html')) out.push(full)
    }
  }
  walk(paths.appDir)
  return out.sort()
}

/** Convert an absolute .html path back to its route path. */
export function routePathForHtml(paths: HarnessPaths, htmlFile: string): string {
  const rel = path.relative(paths.appDir, htmlFile).replace(/\.html$/, '')
  return rel === 'index' ? '/' : `/${rel}`
}

// ── head extraction ──────────────────────────────────────────────────────────────

/** Everything before </head>; falls back to the whole document if no </head> exists. */
export function headOf(html: string): string {
  const end = html.indexOf('</head>')
  return end === -1 ? html : html.slice(0, end)
}

/** Collapse runs of whitespace and trim. */
export const normalizeSpace = (value: string): string => value.replace(/\s+/g, ' ').trim()

/**
 * Normalize a comma-separated directive list (robots, googlebot) for comparison.
 *
 * Next emits `index,follow` when the metadata value is a string (lib/seo.ts) and
 * `index, follow` when it is an object (app/layout.tsx). Those are the same directive
 * list to every crawler, so only the directives and their order are compared, never
 * the spacing. The SET and ORDER are preserved exactly — adding, removing or
 * reordering a directive still fails.
 */
export const normalizeDirectives = (value: string): string =>
  value
    .split(',')
    .map((part) => normalizeSpace(part))
    .filter((part) => part.length > 0)
    .join(', ')

/** Decode the small set of entities Next emits inside attribute values. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

/**
 * The rendered document title, entity-decoded.
 *
 * Read from the whole document rather than from `headOf`, because Next emits <title> inside
 * <head> but the helper's head slice is not guaranteed to survive future markup changes.
 */
export function titleOf(html: string): string | null {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)
  return m ? decodeEntities(m[1]).trim() : null
}

export function htmlLang(html: string): string | null {
  const m = /<html[^>]*\slang="([^"]*)"/.exec(html)
  return m ? m[1] : null
}

/** All `content` values of `<meta name="...">` for the given name. */
export function metaByName(head: string, name: string): string[] {
  const re = new RegExp(`<meta[^>]*\\sname="${escapeRe(name)}"[^>]*>`, 'gi')
  return (head.match(re) ?? []).map(contentAttr).filter((v): v is string => v !== null)
}

/** All `href` values of `<link rel="...">` for the given rel. */
export function linkByRel(head: string, rel: string): string[] {
  const re = new RegExp(`<link[^>]*\\srel="${escapeRe(rel)}"[^>]*>`, 'gi')
  return (head.match(re) ?? [])
    .map((tag) => {
      const m = /\shref="([^"]*)"/.exec(tag)
      return m ? decodeEntities(m[1]) : null
    })
    .filter((v): v is string => v !== null)
}

/**
 * Count real `<script type="application/ld+json">` ELEMENTS in the served HTML.
 *
 * Deliberately anchored on the unescaped attribute: the same string also appears
 * escaped (`application/ld+json\"`) inside Next's RSC flight payload, where it is a
 * serialized <Script> instruction to be executed on the client rather than
 * structured data a non-rendering crawler can read. Counting the escaped form would
 * report structured data that is not actually in the document.
 */
export function ssrJsonLdBlocks(html: string): string[] {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
  const out: string[] = []
  // exec loop rather than for-of over matchAll(): tsconfig targets es5 without
  // downlevelIteration, so iterating an iterator directly is a type error (TS2802).
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) out.push(m[1])
  return out
}

function contentAttr(tag: string): string | null {
  const m = /\scontent="([^"]*)"/.exec(tag)
  return m ? decodeEntities(m[1]) : null
}

function escapeRe(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ── reporting ────────────────────────────────────────────────────────────────────

export class Report {
  private readonly failures: string[] = []
  private readonly notes: string[] = []
  private checks = 0

  constructor(private readonly title: string) {}

  /** Record one assertion. Every call counts, pass or fail. */
  check(ok: boolean, message: string): void {
    this.checks += 1
    if (!ok) this.failures.push(message)
  }

  note(message: string): void {
    this.notes.push(message)
  }

  /** Print results and return the process exit code. */
  finish(): number {
    const bar = '─'.repeat(Math.max(8, this.title.length + 4))
    console.log(`\n${bar}\n  ${this.title}\n${bar}`)
    for (const n of this.notes) console.log(`  · ${n}`)
    if (this.failures.length === 0) {
      console.log(`\n  PASS — ${this.checks} assertions, 0 failures\n`)
      return 0
    }
    console.log(`\n  FAIL — ${this.checks} assertions, ${this.failures.length} failures:\n`)
    for (const f of this.failures) console.log(`    ✗ ${f}`)
    console.log('')
    return 1
  }
}

/** Run a harness entrypoint, turning thrown errors into a clean non-zero exit. */
export function main(fn: () => number | Promise<number>): void {
  void (async () => {
    try {
      process.exitCode = await fn()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\n  HARNESS ERROR: ${message}\n`)
      process.exitCode = 1
    }
  })()
}
