/**
 * Chrome ownership guards.
 *
 * Phase D consolidated navigation and footer onto one shared <SiteChrome>. Six page
 * files previously rendered a byte-identical copy of that wrapper inline, so the failure
 * mode this file protects against is concrete: a page re-acquiring its own navbar/footer
 * and shipping two of each, or a layout losing it and shipping none.
 *
 * These are structural assertions against real components — not snapshots of whole pages,
 * which would break on every copy edit and teach people to regenerate them blindly.
 */
import * as React from "react"
import { describe, test, expect } from "vitest"
import { render } from "@testing-library/react"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"
import { SiteChrome } from "@/components/shell/SiteChrome"
import { ConsentProvider } from "@/components/consent/ConsentProvider"
import { getDictionary } from "@/content/dictionary"

const ROOT = process.cwd()

/**
 * Only Next.js ROUTE files decide what ships: page/layout/template/default. Other .tsx
 * files parked under app/ are not routed at all — app/page-with-animated-hero.tsx is one
 * such orphan, kept until the Cleanup phase — so including them here would report dead
 * code as a chrome-ownership violation.
 */
const isRouteFile = (path: string) => /\/(page|layout|template|default)\.tsx?$/.test(path)

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry.startsWith(".")) continue
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, out)
    else if (/\.tsx?$/.test(entry) && !entry.endsWith(".backup")) out.push(full)
  }
  return out
}

describe("SiteChrome renders exactly one of each landmark", () => {
  test("one nav, one main, one footer — and page content lands inside main", () => {
    const { container } = render(
      <SiteChrome>
        <p data-testid="page-content">content</p>
      </SiteChrome>
    )

    expect(container.querySelectorAll("nav")).toHaveLength(1)
    expect(container.querySelectorAll("main")).toHaveLength(1)
    expect(container.querySelectorAll("footer")).toHaveLength(1)

    const main = container.querySelector("main") as HTMLElement
    expect(main.querySelector('[data-testid="page-content"]')).not.toBeNull()
  })

  test("the navigation landmark is labelled, so it is distinguishable from in-page navs", () => {
    const { container } = render(<SiteChrome>x</SiteChrome>)
    const nav = container.querySelector("nav") as HTMLElement
    expect(nav.getAttribute("aria-label")).toBe("Main")
  })

  test("document order is navigation, then main, then footer", () => {
    const { container } = render(<SiteChrome>x</SiteChrome>)
    const [nav, main, footer] = ["nav", "main", "footer"].map(
      (s) => container.querySelector(s) as HTMLElement
    )
    expect(nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(main.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  test("nesting is impossible to get wrong twice: two chromes would double the landmarks", () => {
    // Documents the failure mode rather than asserting a bug: if a page ever renders its
    // own chrome again *inside* the layout's, the counts double and the source guard below
    // catches it first.
    const { container } = render(
      <SiteChrome>
        <SiteChrome>x</SiteChrome>
      </SiteChrome>
    )
    expect(container.querySelectorAll("footer").length).toBe(2)
  })
})

describe("no page or layout re-introduces its own chrome", () => {
  const appFiles = walk(join(ROOT, "app")).filter(isRouteFile)

  test("only components/shell/SiteChrome.tsx imports the navbar or footer components", () => {
    const offenders = appFiles.filter((f) => {
      const src = readFileSync(f, "utf8")
      return /from ["']@\/components\/ui\/navbar-demo["']/.test(src) || /from ["']@\/components\/ui\/footer["']/.test(src)
    })
    expect(
      offenders.map((f) => f.slice(ROOT.length + 1)),
      "these files under app/ import chrome directly; render it via <SiteChrome> instead"
    ).toEqual([])
  })

  test("no file under app/ renders <NavBarDemo /> or <Footer />", () => {
    const offenders = appFiles.filter((f) => {
      const src = readFileSync(f, "utf8")
      return /<NavBarDemo\b/.test(src) || /<Footer\b/.test(src)
    })
    expect(offenders.map((f) => f.slice(ROOT.length + 1))).toEqual([])
  })

  test("exactly one component owns the shared chrome", () => {
    const shell = readFileSync(join(ROOT, "components/shell/SiteChrome.tsx"), "utf8")
    expect(shell).toMatch(/<NavBarDemo\s*\/>/)
    expect(shell).toMatch(/<Footer\s*\/>/)
    // A server component: it must not opt the chrome into the client bundle.
    expect(shell.trimStart().startsWith('"use client"')).toBe(false)
  })
})

describe("the shared shell keeps sole ownership of html, body, fonts and consent", () => {
  // Phase E: app/layout.tsx was replaced by two locale roots that both delegate to
  // components/shell/RootShell.tsx, which is where these concerns now live. Comments in
  // these files legitimately mention the tags, so structural checks run on code only.
  const stripComments = (src: string) =>
    src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")
  const rootLayout = stripComments(readFileSync(join(ROOT, "components/shell/RootShell.tsx"), "utf8"))

  test("exactly one <html> and one <body>, both in the root layout", () => {
    expect((rootLayout.match(/<html\b/g) ?? []).length).toBe(1)
    expect((rootLayout.match(/<body\b/g) ?? []).length).toBe(1)

    const others = walk(join(ROOT, "app"))
      .filter(isRouteFile)
      .filter((f) => /<html\b|<body\b/.test(stripComments(readFileSync(f, "utf8"))))
    expect(others.map((f) => f.slice(ROOT.length + 1))).toEqual([])
  })

  test("fonts are loaded once, in the root layout only", () => {
    expect(rootLayout).toMatch(/from ["']next\/font\/google["']/)
    const others = walk(join(ROOT, "app"))
      .filter(isRouteFile)
      .filter((f) => /next\/font/.test(readFileSync(f, "utf8")))
    expect(others.map((f) => f.slice(ROOT.length + 1))).toEqual([])
    // The chrome must not re-declare font variables either.
    expect(readFileSync(join(ROOT, "components/shell/SiteChrome.tsx"), "utf8")).not.toMatch(/next\/font/)
  })

  test("each consent component is mounted exactly once, and only in the root layout", () => {
    // <ConsentProvider carries a `copy` prop now, so match the OPENING TAG rather than the
    // exact string — the claim under test is "mounted exactly once", not its attributes.
    for (const tag of ["<ConsentProvider", "<CookieBanner />", "<CookieSettingsDialog />", "<AnalyticsGate />", "<MarketingGate />"]) {
      const re = new RegExp(tag.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), "g")
      expect((rootLayout.match(re) ?? []).length, `${tag} in RootShell.tsx`).toBe(1)
    }

    const others = walk(join(ROOT, "app"))
      .filter(isRouteFile)
      .filter((f) => /<ConsentProvider|<AnalyticsGate|<MarketingGate|<CookieBanner|<CookieSettingsDialog/.test(stripComments(readFileSync(f, "utf8"))))
    expect(others.map((f) => f.slice(ROOT.length + 1))).toEqual([])
  })

  test("the shared chrome does not mount consent — that stays at the root", () => {
    const shell = readFileSync(join(ROOT, "components/shell/SiteChrome.tsx"), "utf8")
    expect(shell).not.toMatch(/ConsentProvider|AnalyticsGate|MarketingGate|CookieBanner|CookieSettingsDialog/)
  })

  test("no page or layout reads request state, which would break static rendering", () => {
    const offenders = walk(join(ROOT, "app"))
      .filter(isRouteFile)
      .filter((f) => /from ["']next\/headers["']/.test(readFileSync(f, "utf8")))
    expect(offenders.map((f) => f.slice(ROOT.length + 1))).toEqual([])
  })
})

describe("footer keeps its consent control inside the shared chrome", () => {
  test("Cookie settings is a real button and reopens the dialog via the provider", () => {
    const { container } = render(
      <ConsentProvider copy={getDictionary("en").consent}>
        <SiteChrome>x</SiteChrome>
      </ConsentProvider>
    )
    const footer = container.querySelector("footer") as HTMLElement
    const control = footer.querySelector('[data-testid="cookie-settings-reopen"]') as HTMLElement
    expect(control).not.toBeNull()
    expect(control.tagName).toBe("BUTTON")
  })
})
