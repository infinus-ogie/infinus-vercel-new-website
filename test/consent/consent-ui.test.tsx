/**
 * Consent UI behaviour: banner, settings dialog, persistence and withdrawal.
 *
 * Tests render the real provider, banner, dialog and gates against a stubbed
 * document.cookie, then assert what a visitor would observe. Nothing here inspects
 * implementation constants.
 *
 * The gates are asserted through a stand-in child rather than the real vendor
 * components, because mounting the real GA loader would require next/script and a
 * network; the contract under test is "does the gate render its children at all",
 * which is exactly what strict no-load depends on. The real end-to-end network proof
 * lives in the Playwright spec (scripts/qa/consent.spec.ts).
 */
import * as React from "react"
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ConsentProvider, useConsent } from "@/components/consent/ConsentProvider"
import { CookieBanner } from "@/components/consent/CookieBanner"
import { CookieSettingsDialog, CookieSettingsButton } from "@/components/consent/CookieSettingsDialog"
import { CONSENT_COOKIE, CONSENT_VERSION, buildRecord, serializeConsent } from "@/lib/consent"
import { getDictionary } from "@/content/dictionary"
import type { Locale } from "@/lib/i18n"

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}))

// ── cookie jar stub ──────────────────────────────────────────────────────────────
let jar = ""
let reloadCount = 0

function setJar(value: string) {
  jar = value
}

beforeEach(() => {
  jar = ""
  reloadCount = 0
  vi.spyOn(document, "cookie", "get").mockImplementation(() => jar)
  vi.spyOn(document, "cookie", "set").mockImplementation((value: string) => {
    const [pair] = value.split(";")
    const [name] = pair.split("=")
    const kept = jar
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith(`${name}=`))
    jar = /max-age=0|expires=Thu, 01 Jan 1970/.test(value) ? kept.join("; ") : [...kept, pair].join("; ")
  })
  // jsdom has no navigation; count reloads instead of performing them.
  Object.defineProperty(window, "location", {
    configurable: true,
    value: { ...window.location, reload: () => void reloadCount++, protocol: "http:", hostname: "localhost" },
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

/** Reveals what each gate would decide, without mounting real vendor scripts. */
function GateProbe() {
  const { analytics, marketing, hydrated } = useConsent()
  return (
    <div>
      <span data-testid="hydrated">{String(hydrated)}</span>
      {analytics && <span data-testid="analytics-loaded">GA</span>}
      {marketing && <span data-testid="marketing-loaded">DNB</span>}
    </div>
  )
}

function mount(locale: Locale = "en") {
  return render(
    <ConsentProvider copy={getDictionary(locale).consent}>
      <GateProbe />
      <CookieBanner />
      <CookieSettingsDialog />
      <CookieSettingsButton className="footer-cookie" />
    </ConsentProvider>
  )
}

const storedConsent = () => {
  const raw = jar
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${CONSENT_COOKIE}=`))
  return raw ? JSON.parse(decodeURIComponent(raw.slice(CONSENT_COOKIE.length + 1))) : null
}

describe("fresh visitor with no stored decision", () => {
  test("sees the banner and NOTHING non-essential is allowed to load", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("hydrated")).toHaveTextContent("true"))

    expect(screen.getByTestId("cookie-banner")).toBeInTheDocument()
    expect(screen.queryByTestId("analytics-loaded")).not.toBeInTheDocument()
    expect(screen.queryByTestId("marketing-loaded")).not.toBeInTheDocument()
  })

  test("Accept and Reject have equal prominence — identical classes, same container", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())

    const accept = screen.getByTestId("cookie-accept")
    const reject = screen.getByTestId("cookie-reject")

    // Same element type and byte-identical styling: neither can be the "primary".
    expect(accept.tagName).toBe(reject.tagName)
    expect(accept.className).toBe(reject.className)
    expect(accept.parentElement).toBe(reject.parentElement)
  })

  test("the banner offers no way to dismiss without deciding", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())

    const banner = screen.getByTestId("cookie-banner")
    const buttons = Array.from(banner.querySelectorAll("button")).map((b) => b.getAttribute("data-testid"))
    expect(buttons.sort()).toEqual(["cookie-accept", "cookie-reject", "cookie-settings-open"])
  })

  test("banner links to the approved policy at its new URL", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    const link = screen.getByRole("link", { name: /privacy policy/i })
    expect(link).toHaveAttribute("href", "/privacy")
  })
})

describe("Accept all", () => {
  test("allows both categories, stores the decision and dismisses the banner", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())

    fireEvent.click(screen.getByTestId("cookie-accept"))

    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())
    expect(screen.getByTestId("marketing-loaded")).toBeInTheDocument()
    expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument()

    const stored = storedConsent()
    expect(stored).toMatchObject({ v: CONSENT_VERSION, necessary: true, analytics: true, marketing: true })
    expect(typeof stored.ts).toBe("string")
  })
})

describe("Reject all", () => {
  test("stores a refusal, loads nothing, and does not re-prompt", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())

    fireEvent.click(screen.getByTestId("cookie-reject"))

    await waitFor(() => expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument())
    expect(screen.queryByTestId("analytics-loaded")).not.toBeInTheDocument()
    expect(screen.queryByTestId("marketing-loaded")).not.toBeInTheDocument()
    expect(storedConsent()).toMatchObject({ necessary: true, analytics: false, marketing: false })
  })
})

describe("custom settings", () => {
  test("analytics and marketing start OFF — never pre-ticked", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    fireEvent.click(screen.getByTestId("cookie-settings-open"))

    expect(screen.getByLabelText("Analytics")).not.toBeChecked()
    expect(screen.getByLabelText("Marketing")).not.toBeChecked()
  })

  test("Necessary is checked and cannot be switched off", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    fireEvent.click(screen.getByTestId("cookie-settings-open"))

    const necessary = screen.getByLabelText("Necessary")
    expect(necessary).toBeChecked()
    expect(necessary).toBeDisabled()

    fireEvent.click(necessary)
    expect(necessary).toBeChecked()
  })

  test("saving analytics-only allows analytics and still blocks marketing", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    fireEvent.click(screen.getByTestId("cookie-settings-open"))

    fireEvent.click(screen.getByLabelText("Analytics"))
    fireEvent.click(screen.getByTestId("cookie-settings-save"))

    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())
    expect(screen.queryByTestId("marketing-loaded")).not.toBeInTheDocument()
    expect(storedConsent()).toMatchObject({ analytics: true, marketing: false })
  })

  test("closing the dialog without saving is not consent", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    fireEvent.click(screen.getByTestId("cookie-settings-open"))
    fireEvent.click(screen.getByLabelText("Analytics"))
    fireEvent.click(screen.getByTestId("cookie-settings-close"))

    expect(storedConsent()).toBeNull()
    expect(screen.queryByTestId("analytics-loaded")).not.toBeInTheDocument()
    // Still undecided, so the banner is back.
    expect(screen.getByTestId("cookie-banner")).toBeInTheDocument()
  })
})

describe("persistence across mounts", () => {
  test("a stored decision is honoured on the next visit with no banner", async () => {
    setJar(`${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics: true, marketing: false }, new Date()))}`)
    mount()

    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())
    expect(screen.queryByTestId("cookie-banner")).not.toBeInTheDocument()
    expect(screen.queryByTestId("marketing-loaded")).not.toBeInTheDocument()
  })

  test("an outdated record is ignored, the banner returns and nothing loads", async () => {
    const stale = encodeURIComponent(
      JSON.stringify({ v: CONSENT_VERSION - 1, ts: "2020-01-01T00:00:00.000Z", necessary: true, analytics: true, marketing: true })
    )
    setJar(`${CONSENT_COOKIE}=${stale}`)
    mount()

    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    expect(screen.queryByTestId("analytics-loaded")).not.toBeInTheDocument()
  })

  test("an invalid record is ignored rather than trusted", async () => {
    setJar(`${CONSENT_COOKIE}=%7Bnot-json`)
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    expect(screen.queryByTestId("analytics-loaded")).not.toBeInTheDocument()
  })
})

describe("reopening settings after a decision", () => {
  test("the footer control reopens the dialog seeded from the stored decision", async () => {
    setJar(`${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics: true, marketing: false }, new Date()))}`)
    mount()
    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())

    expect(screen.queryByTestId("cookie-settings-dialog")).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId("cookie-settings-reopen"))

    expect(screen.getByTestId("cookie-settings-dialog")).toBeInTheDocument()
    expect(screen.getByLabelText("Analytics")).toBeChecked()
    expect(screen.getByLabelText("Marketing")).not.toBeChecked()
  })
})

describe("withdrawal", () => {
  test("turning analytics off updates the record, clears GA cookies and reloads", async () => {
    setJar(
      [
        `${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics: true, marketing: false }, new Date()))}`,
        "_ga=GA1.1.123",
        "_ga_S0YZ6MZWK1=GS1.1.456",
      ].join("; ")
    )
    mount()
    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())

    fireEvent.click(screen.getByTestId("cookie-settings-reopen"))
    fireEvent.click(screen.getByLabelText("Analytics"))
    fireEvent.click(screen.getByTestId("cookie-settings-save"))

    await waitFor(() => expect(storedConsent()).toMatchObject({ analytics: false }))

    // GA first-party cookies the site can clear are gone.
    expect(jar).not.toContain("_ga=")
    expect(jar).not.toContain("_ga_S0YZ6MZWK1=")
    // The consent record itself survives — the refusal must be remembered.
    expect(jar).toContain(CONSENT_COOKIE)
    // A loaded script cannot be unloaded, so the page is reloaded and gtag disabled.
    expect(reloadCount).toBe(1)
    expect((window as unknown as Record<string, unknown>)["ga-disable-G-S0YZ6MZWK1"]).toBe(true)
  })

  test("granting consent does not reload the page", async () => {
    mount()
    await waitFor(() => expect(screen.getByTestId("cookie-banner")).toBeInTheDocument())
    fireEvent.click(screen.getByTestId("cookie-accept"))
    await waitFor(() => expect(screen.getByTestId("analytics-loaded")).toBeInTheDocument())
    expect(reloadCount).toBe(0)
  })

  test("withdrawing marketing prevents future loading and reloads", async () => {
    setJar(`${CONSENT_COOKIE}=${serializeConsent(buildRecord({ analytics: false, marketing: true }, new Date()))}`)
    mount()
    await waitFor(() => expect(screen.getByTestId("marketing-loaded")).toBeInTheDocument())

    fireEvent.click(screen.getByTestId("cookie-settings-reopen"))
    fireEvent.click(screen.getByLabelText("Marketing"))
    fireEvent.click(screen.getByTestId("cookie-settings-save"))

    await waitFor(() => expect(storedConsent()).toMatchObject({ marketing: false }))
    expect(reloadCount).toBe(1)
  })
})
