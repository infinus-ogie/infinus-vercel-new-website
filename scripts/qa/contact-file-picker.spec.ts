import { test, expect } from '@playwright/test'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

/**
 * The Contact form's attachment field, in both locales.
 *
 * ── What this guards ────────────────────────────────────────────────────────────
 * A native `<input type="file">` paints its own button and its own "no file" text, and it
 * takes that copy from the BROWSER's locale rather than the page's. So /sr/contact showed
 * "Choose file / No file chosen" sitting between Serbian labels on any English-configured
 * browser, and nothing at the page level could change it — which is exactly why this needs a
 * real browser to verify: jsdom has no native picker chrome to get wrong in the first place.
 *
 * The replacement is presentation only. The assertions below therefore care about two things
 * at once: that the visible copy is now the page's own, and that the input underneath still
 * behaves like a file input — focusable, labelled, same `accept` list, same name, and holding
 * the real File object that FormData will read.
 *
 * No upload is performed and none is faked. Nothing here posts to /api/contact.
 */

const PAGES = [
  {
    path: '/contact',
    locale: 'en',
    button: 'Choose file',
    empty: 'No file selected',
    otherEmpty: 'Nijedan fajl nije izabran',
    label: 'Attachment',
    privacy: '/privacy',
  },
  {
    path: '/sr/contact',
    locale: 'sr',
    button: 'Izaberi fajl',
    empty: 'Nijedan fajl nije izabran',
    otherEmpty: 'No file selected',
    label: 'Prilog',
    privacy: '/sr/politika-privatnosti',
  },
] as const

/** The strings a native picker would have rendered. Neither may appear on either page. */
const NATIVE_CHROME = ['No file chosen', 'Nije izabrana datoteka'] as const

const ACCEPTED = '.pdf,.doc,.docx,.txt'

/** A real file on disk, so `setInputFiles` exercises the actual input rather than a stub. */
function fixture(name: string, body = 'attachment fixture'): string {
  const dir = mkdtempSync(join(tmpdir(), 'infinus-contact-'))
  const path = join(dir, name)
  writeFileSync(path, body, 'utf8')
  return path
}

for (const page of PAGES) {
  test.describe(`${page.path} — attachment field (${page.locale})`, () => {
    test('the empty state is the page language, never the browser chrome', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      const field = p.locator('#attachment')
      const state = p.locator('#attachment-state')

      await expect(state, 'empty state copy').toHaveText(page.empty)
      await expect(p.getByText(page.button, { exact: true })).toBeVisible()

      // The other locale must not leak in, and neither must the native chrome this replaced.
      const body = p.locator('body')
      await expect(body).not.toContainText(page.otherEmpty)
      for (const native of NATIVE_CHROME) {
        await expect(body, `native chrome "${native}" must not appear`).not.toContainText(native)
      }

      // The input is still a real, unchanged file input.
      await expect(field).toHaveAttribute('type', 'file')
      await expect(field).toHaveAttribute('name', 'attachment')
      await expect(field).toHaveAttribute('accept', ACCEPTED)
      // Hidden VISUALLY but present for assistive tech — `sr-only`, not `display:none`.
      expect(await field.evaluate((el) => getComputedStyle(el).display)).not.toBe('none')
      expect(await field.evaluate((el) => getComputedStyle(el).visibility)).not.toBe('hidden')
    })

    test('clicking the visible button opens the picker for the real input', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      // Exactly ONE element labels the input. A second <label htmlFor> would make the
      // accessible name "Attachment Choose file" and leave "what labels this field" without a
      // single answer, so the visible pill is an aria-hidden button instead.
      const labels = p.locator('label[for="attachment"]')
      await expect(labels, 'the input must have exactly one label').toHaveCount(1)
      await expect(labels).toHaveText(page.label)

      // The pill is mouse affordance only: hidden from assistive tech and out of the tab order,
      // because the input itself is already focusable and already labelled.
      const pill = p.getByRole('button', { name: page.button })
      await expect(pill, 'the pill must not be exposed as a button').toHaveCount(0)
      const visible = p.locator('#attachment ~ div button')
      await expect(visible).toContainText(page.button)
      await expect(visible).toHaveAttribute('aria-hidden', 'true')
      await expect(visible).toHaveAttribute('tabindex', '-1')
      // type="button", or it would submit the form instead of opening a picker.
      await expect(visible).toHaveAttribute('type', 'button')

      // And the click really does reach the input: the browser fires the picker, which
      // Playwright surfaces as a filechooser event naming the element it belongs to.
      const chooser = p.waitForEvent('filechooser', { timeout: 10000 })
      await visible.click()
      const fc = await chooser
      expect(await fc.element().getAttribute('id')).toBe('attachment')

      // The label opens it too — that is native behaviour and worth keeping honest.
      const chooser2 = p.waitForEvent('filechooser', { timeout: 10000 })
      await labels.click()
      expect(await (await chooser2).element().getAttribute('id')).toBe('attachment')
    })

    test('selecting a file shows its real name and announces it', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      const state = p.locator('#attachment-state')
      await expect(state).toHaveText(page.empty)

      const file = fixture('quarterly-erp-brief.pdf')
      await p.locator('#attachment').setInputFiles(file)

      await expect(state, 'the actual filename is displayed').toHaveText('quarterly-erp-brief.pdf')
      // aria-live is what turns "displayed" into "announced".
      await expect(state).toHaveAttribute('aria-live', 'polite')
      // The full name stays available when the visible text is truncated on a narrow screen.
      await expect(state).toHaveAttribute('title', 'quarterly-erp-brief.pdf')
      // The empty-state copy is gone, and the button label is unchanged.
      await expect(state).not.toHaveText(page.empty)
      await expect(p.getByText(page.button, { exact: true })).toBeVisible()

      // The input holds the real File, which is what FormData submits.
      const held = await p.locator('#attachment').evaluate((el) => {
        const input = el as HTMLInputElement
        return { count: input.files?.length ?? 0, name: input.files?.[0]?.name ?? null }
      })
      expect(held).toEqual({ count: 1, name: 'quarterly-erp-brief.pdf' })
    })

    test('the field is keyboard reachable and shows a visible focus state', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      await p.locator('#attachment').focus()
      await expect(p.locator('#attachment')).toBeFocused()

      // The input is off-screen, so the ring has to be painted on the visible wrapper. Without
      // it a keyboard user tabs into the field and sees nothing at all happen.
      const ring = await p.locator('#attachment').evaluate((el) => {
        const wrapper = el.nextElementSibling as HTMLElement | null
        if (!wrapper) return null
        const cs = getComputedStyle(wrapper)
        return { shadow: cs.boxShadow, outline: cs.outlineStyle }
      })
      expect(ring, 'the visible wrapper exists').not.toBeNull()
      expect(
        ring!.shadow !== 'none' || ring!.outline !== 'none',
        `expected a focus ring on the wrapper, got ${JSON.stringify(ring)}`
      ).toBe(true)

      // Tab must leave the field rather than trapping in it.
      await p.keyboard.press('Tab')
      await expect(p.locator('#attachment')).not.toBeFocused()
    })

    test('a disallowed type is still only filtered by accept, not by new JS', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      // The picker's filtering is the browser's job via `accept`, and the size limit is the
      // API's. This presentation change added no client-side gate, and that is deliberate:
      // inventing one here would mean two places to keep in step with the server.
      //
      // Programmatic selection bypasses `accept` exactly as it did before, so an unexpected
      // extension reaches the same place it always did — the request — and the field simply
      // reports what was chosen instead of silently dropping it.
      const bad = fixture('not-allowed.exe')
      await p.locator('#attachment').setInputFiles(bad)
      await expect(p.locator('#attachment-state')).toHaveText('not-allowed.exe')
      await expect(p.locator('#attachment')).toHaveAttribute('accept', ACCEPTED)

      // Clearing works too, and returns to the localised empty state.
      await p.locator('#attachment').setInputFiles([])
      await expect(p.locator('#attachment-state')).toHaveText(page.empty)
    })

    test('a 12 MB file is accepted by the field and left for the API to reject', async ({
      page: p,
    }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })

      // Over the 10 MB limit. The field must NOT pre-reject it: the limit lives in
      // app/api/contact/route.ts and moving or duplicating it was explicitly out of scope.
      const big = fixture('oversized.pdf', 'x'.repeat(12 * 1024 * 1024))
      await p.locator('#attachment').setInputFiles(big)
      await expect(p.locator('#attachment-state')).toHaveText('oversized.pdf')

      const size = await p
        .locator('#attachment')
        .evaluate((el) => (el as HTMLInputElement).files?.[0]?.size ?? 0)
      expect(size).toBeGreaterThan(10 * 1024 * 1024)
    })

    test('the privacy note points at this locale own policy', async ({ page: p }) => {
      await p.goto(page.path, { waitUntil: 'domcontentloaded' })
      const link = p.locator(`form a[href="${page.privacy}"], main a[href="${page.privacy}"]`).first()
      await expect(link).toBeVisible()
    })

    for (const width of [320, 360, 390, 430]) {
      test(`the field fits at ${width}px, even with a long filename`, async ({ page: p }) => {
        await p.setViewportSize({ width, height: 900 })
        await p.goto(page.path, { waitUntil: 'domcontentloaded' })

        const reject = p.getByTestId('cookie-reject')
        if (await reject.count()) {
          await reject.click()
          await p.waitForTimeout(200)
        }

        // A filename far longer than the field, which is the case `truncate` exists for.
        await p
          .locator('#attachment')
          .setInputFiles(fixture('an-extremely-long-attachment-filename-for-overflow-testing.pdf'))
        await expect(p.locator('#attachment-state')).toBeVisible()

        const overflow = await p.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
        expect(overflow, `${page.path} at ${width}px overflows by ${overflow}px`).toBeLessThanOrEqual(0)
      })
    }
  })
}

test.describe('the Serbian copy corrections', () => {
  test('/sr/contact carries the three approved strings and no stale ones', async ({ page }) => {
    await page.goto('/sr/contact', { waitUntil: 'domcontentloaded' })
    const body = page.locator('body')

    await expect(body).toContainText('Tu smo da vam pomognemo da ostvarite svoje poslovne ciljeve.')
    await expect(body).toContainText('Slanjem obrasca potvrđujete da ste pročitali našu')
    await expect(page.locator('#subject')).toHaveAttribute(
      'placeholder',
      'Ukratko opišite temu upita'
    )

    // The replaced wording must be gone, or a partial edit would pass the assertions above.
    await expect(body).not.toContainText('Tu smo da vam pomognemo da uspete.')
    await expect(body).not.toContainText('Slanjem forme potvrđujete')
    await expect(page.locator('#subject')).not.toHaveAttribute('placeholder', 'O čemu se radi?')
  })

  test('/contact English copy is untouched apart from the picker', async ({ page }) => {
    await page.goto('/contact', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('#subject')).toHaveAttribute('placeholder', "What's this about?")
    await expect(page.locator('body')).toContainText(
      'By submitting this form, you confirm that you have read our'
    )
  })
})
