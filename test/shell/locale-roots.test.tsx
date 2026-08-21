/**
 * Locale-root ownership guards.
 *
 * Phase E replaced the single app/layout.tsx with two ROOT layouts — app/(en)/layout.tsx
 * and app/(sr)/layout.tsx — both delegating to components/shell/RootShell.tsx. The
 * failure modes worth protecting mechanically are:
 *
 *   · a Serbian route drifting back under the English root (silently re-breaking lang)
 *   · an English route landing under the Serbian root
 *   · a route group name leaking into a public URL
 *   · a third root layout reappearing at app/ level, which would nest <html>
 *   · the two roots diverging in fonts, consent or document structure
 *
 * These assert on DECLARED ROUTE OWNERSHIP (the filesystem, which is what Next routes
 * from) rather than snapshotting source text.
 */
import { describe, test, expect } from "vitest"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, relative, sep } from "node:path"
import { ROUTES } from "../fixtures/routes"
import { LIVE_SERBIAN_PREFIXED_PATHS, SERBIAN_ONLY_PATHS } from "../fixtures/locale-pairs"

const ROOT = process.cwd()
const APP = join(ROOT, "app")

const EN_ROOT = "app/(en)/layout.tsx"
const SR_ROOT = "app/(sr)/layout.tsx"

/** Every page.tsx under app/, as a repo-relative path. */
function pageFiles(dir = APP, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) pageFiles(full, out)
    else if (entry === "page.tsx" || entry === "page.ts") out.push(relative(ROOT, full))
  }
  return out
}

/** Strip route groups "(x)" from a file path to get the public URL it serves. */
function urlFor(pagePath: string): string {
  const segments = pagePath
    .split(sep)
    .slice(1, -1) // drop leading "app" and the trailing "page.tsx"
    .filter((s) => !(s.startsWith("(") && s.endsWith(")")))
  return "/" + segments.join("/")
}

const pages = pageFiles()

describe("exactly two root layouts, and no third", () => {
  test("both locale roots exist", () => {
    expect(existsSync(join(ROOT, EN_ROOT)), `${EN_ROOT} must exist`).toBe(true)
    expect(existsSync(join(ROOT, SR_ROOT)), `${SR_ROOT} must exist`).toBe(true)
  })

  test("app/layout.tsx must NOT exist — it would wrap both roots and nest <html>", () => {
    expect(existsSync(join(APP, "layout.tsx"))).toBe(false)
  })

  test("only the two locale roots render a document, via the shared shell", () => {
    for (const rel of [EN_ROOT, SR_ROOT]) {
      const src = readFileSync(join(ROOT, rel), "utf8")
      expect(src, `${rel} must delegate to RootShell`).toMatch(/<RootShell\s+lang=/)
    }
    const shell = readFileSync(join(ROOT, "components/shell/RootShell.tsx"), "utf8")
    // Comments legitimately mention these tags, so match code only.
    const code = shell.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
    expect((code.match(/<html\b/g) ?? []).length).toBe(1)
    expect((code.match(/<body\b/g) ?? []).length).toBe(1)
  })

  test("each root declares its own language and nothing else differs", () => {
    expect(readFileSync(join(ROOT, EN_ROOT), "utf8")).toMatch(/lang="en"/)
    expect(readFileSync(join(ROOT, SR_ROOT), "utf8")).toMatch(/lang="sr-Latn"/)

    // Both must use the SAME shared metadata object, so defaults cannot drift.
    for (const rel of [EN_ROOT, SR_ROOT]) {
      const src = readFileSync(join(ROOT, rel), "utf8")
      expect(src, `${rel} must reuse the shared rootMetadata`).toMatch(/export const metadata = rootMetadata/)
    }
  })

  test("fonts are declared once, in the shared shell only", () => {
    const shell = readFileSync(join(ROOT, "components/shell/RootShell.tsx"), "utf8")
    expect(shell).toMatch(/from ["']next\/font\/google["']/)
    for (const rel of [EN_ROOT, SR_ROOT]) {
      expect(readFileSync(join(ROOT, rel), "utf8")).not.toMatch(/next\/font/)
    }
  })
})

describe("route ownership by locale root", () => {
  // Everything the Serbian root owns: the legacy campaign pages at unprefixed URLs, /cfo
  // behind its redirect, and every properly /sr-prefixed route that has gone live.
  const SERBIAN_URLS = [...SERBIAN_ONLY_PATHS, ...LIVE_SERBIAN_PREFIXED_PATHS]

  test("every page lives under exactly one locale root", () => {
    const orphans = pages.filter((p) => !p.includes("(en)") && !p.includes("(sr)"))
    expect(orphans, "these pages sit under no locale root and would have no <html>").toEqual([])

    const both = pages.filter((p) => p.includes("(en)") && p.includes("(sr)"))
    expect(both).toEqual([])
  })

  test("the Serbian root owns exactly the known Serbian URLs", () => {
    const srUrls = pages.filter((p) => p.includes(`(sr)${sep}`)).map(urlFor).sort()
    expect(srUrls).toEqual([...SERBIAN_URLS].sort())
  })

  test("no English page strayed into the Serbian root", () => {
    const srUrls = pages.filter((p) => p.includes(`(sr)${sep}`)).map(urlFor)
    for (const url of srUrls) {
      expect(SERBIAN_URLS, `${url} is under (sr) but is not a known Serbian route`).toContain(url)
    }
  })

  test("no Serbian page strayed into the English root", () => {
    const enUrls = pages.filter((p) => p.includes(`(en)${sep}`)).map(urlFor)
    for (const url of SERBIAN_URLS) {
      expect(enUrls, `${url} must not be served from the English root`).not.toContain(url)
    }
  })

  test("each Privacy Policy page sits under its own locale root", () => {
    // The policy used to be one bilingual page under the English root. It is two pages now,
    // and each must be under the root that emits its own <html lang> — that is the whole
    // reason the split was worth doing.
    const en = pages.find((p) => p.endsWith(`privacy${sep}page.tsx`))
    expect(en, "the English policy must exist").toBeDefined()
    expect(en, "the English policy belongs under the (en) root").toContain("(en)")
    const sr = pages.find((p) => p.includes(`politika-privatnosti${sep}page.tsx`))
    expect(sr, "the Serbian policy must exist").toBeDefined()
    expect(sr, "the Serbian policy belongs under the (sr) root").toContain("(sr)")
  })

  test("internal demo/debug routes stay under the English root", () => {
    for (const name of ["hero-demo", "combined-demo", "services-demo", "visitor-intelligence"]) {
      const p = pages.find((f) => f.includes(name))
      expect(p, `${name} page not found`).toBeDefined()
      expect(p).toContain("(en)")
    }
  })
})

describe("route groups must never change a public URL", () => {
  test("no URL derived from the filesystem contains a group name", () => {
    for (const p of pages) {
      expect(urlFor(p), `${p} leaks a route group into its URL`).not.toMatch(/[()]/)
    }
  })

  test("the filesystem serves exactly the page URLs the fixture classifies", () => {
    const fromFs = pages.map(urlFor).sort()
    const fromFixture = ROUTES.filter((r) => r.expectStaticHtml && r.path !== "/_not-found")
      .map((r) => r.path)
      .sort()
    expect(fromFs).toEqual(fromFixture)
  })

  test("the fixture expects sr-Latn for exactly the Serbian-root pages", () => {
    const srFixture = ROUTES.filter((r) => r.expectLang === "sr-Latn")
      .map((r) => r.path)
      .sort()
    const srFs = pages.filter((p) => p.includes(`(sr)${sep}`)).map(urlFor).sort()
    expect(srFixture).toEqual(srFs)
  })

  test("every English page in the fixture still expects lang=en", () => {
    const enFs = new Set(pages.filter((p) => p.includes(`(en)${sep}`)).map(urlFor))
    for (const r of ROUTES) {
      if (!enFs.has(r.path)) continue
      expect(r.expectLang, `${r.path} is under the English root`).toBe("en")
    }
  })
})
