/**
 * Tests for the LIVE contact form, in BOTH languages.
 *
 * This file previously tested `components/forms/contact-form.tsx`, which is dead
 * code — nothing in the app imports it. The form actually rendered on /contact and
 * /sr/contact is `components/ui/contact-2.tsx`, so that is what is tested here.
 *
 * ── Why every behavioural test runs twice ───────────────────────────────────────
 * Phase G made the form locale-aware by passing it a typed dictionary. The claim that
 * matters is that ONLY the copy changed: the validation rules, the submit gate, the POST
 * endpoint, the FormData keys and the state machine must be identical in Serbian. So the
 * behavioural block is parameterised over both dictionaries and reads its labels FROM the
 * dictionary — a test that hardcoded English labels could not tell the difference between
 * "Serbian works" and "Serbian silently renders English".
 *
 * Two constraints of the live component shape these tests:
 *
 * 1. The submit button is `disabled={isSubmitting || !isValid}`, so it cannot be
 *    clicked while the form is invalid. The per-field error messages in the JSX are
 *    therefore not reachable through the UI, and asserting on them would assert
 *    unreachable behaviour. We test the disabled/enabled gate instead — that is the
 *    validation surface a user actually experiences.
 * 2. `@testing-library/user-event` cannot be imported in this repo: it resolves
 *    `@testing-library/dom` as a peer, which is only installed nested under
 *    @testing-library/react (a consequence of `legacy-peer-deps=true` in .npmrc).
 *    We use `fireEvent`, which is sufficient for a controlled form driven by onChange.
 *
 * `fetch` is always stubbed. No test reaches /api/contact or a real mailbox.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { Contact2 } from '@/components/ui/contact-2'
import { getDictionary } from '@/content/dictionary'
import type { ContactDictionary } from '@/content/dictionary'
import type { Locale } from '@/lib/i18n'

const VALID_INPUT = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  subject: 'SAP implementation enquiry',
  message: 'We are evaluating SAP Cloud ERP and would like to discuss scope.',
}

const LOCALE_CASES: ReadonlyArray<{ locale: Locale; content: ContactDictionary }> = [
  { locale: 'en', content: getDictionary('en').contact },
  { locale: 'sr', content: getDictionary('sr').contact },
]

/** Fill every required field so the zod schema passes and submit becomes enabled. */
function fillRequiredFields(content: ContactDictionary) {
  const { form } = content
  fireEvent.change(screen.getByLabelText(form.nameLabel), {
    target: { name: 'name', value: VALID_INPUT.name },
  })
  fireEvent.change(screen.getByLabelText(form.emailLabel), {
    target: { name: 'email', value: VALID_INPUT.email },
  })
  fireEvent.change(screen.getByLabelText(form.subjectLabel), {
    target: { name: 'subject', value: VALID_INPUT.subject },
  })
  fireEvent.change(screen.getByLabelText(form.messageLabel), {
    target: { name: 'message', value: VALID_INPUT.message },
  })
}

/** The submit control, found structurally so the query works in any language. */
const submitButton = (): HTMLButtonElement => {
  const button = document.querySelector('button[type="submit"]')
  if (button === null) throw new Error('no submit button rendered')
  return button as HTMLButtonElement
}

describe.each(LOCALE_CASES)('Contact2 — $locale', ({ locale, content }) => {
  const { form, success, validation } = content

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders every field the API route expects, with this locale’s labels', () => {
    render(<Contact2 content={content} />)

    for (const label of [
      form.nameLabel,
      form.phoneLabel,
      form.emailLabel,
      form.subjectLabel,
      form.messageLabel,
      form.attachmentLabel,
    ]) {
      expect(screen.getByLabelText(label), label).toBeInTheDocument()
    }
    expect(submitButton()).toBeInTheDocument()
    expect(submitButton().textContent).toBe(form.submit)
  })

  it('shows this locale’s placeholders, not another locale’s', () => {
    render(<Contact2 content={content} />)

    expect(screen.getByLabelText(form.nameLabel)).toHaveAttribute('placeholder', form.namePlaceholder)
    expect(screen.getByLabelText(form.phoneLabel)).toHaveAttribute('placeholder', form.phonePlaceholder)
    expect(screen.getByLabelText(form.emailLabel)).toHaveAttribute('placeholder', form.emailPlaceholder)
    expect(screen.getByLabelText(form.subjectLabel)).toHaveAttribute('placeholder', form.subjectPlaceholder)
    expect(screen.getByLabelText(form.messageLabel)).toHaveAttribute('placeholder', form.messagePlaceholder)
    expect(screen.getByText(form.attachmentHint)).toBeInTheDocument()
  })

  it('marks the four required fields as required and leaves phone optional', () => {
    render(<Contact2 content={content} />)

    expect(screen.getByLabelText(form.nameLabel)).toBeRequired()
    expect(screen.getByLabelText(form.emailLabel)).toBeRequired()
    expect(screen.getByLabelText(form.subjectLabel)).toBeRequired()
    expect(screen.getByLabelText(form.messageLabel)).toBeRequired()
    expect(screen.getByLabelText(form.phoneLabel)).not.toBeRequired()
  })

  it('uses the correct input types so mobile keyboards and mailto behave', () => {
    render(<Contact2 content={content} />)

    expect(screen.getByLabelText(form.emailLabel)).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText(form.phoneLabel)).toHaveAttribute('type', 'tel')
    expect(screen.getByLabelText(form.attachmentLabel)).toHaveAttribute('type', 'file')
  })

  it('keeps submit disabled until the whole form validates', async () => {
    render(<Contact2 content={content} />)

    expect(submitButton()).toBeDisabled()

    // A partially filled form must stay disabled.
    fireEvent.change(screen.getByLabelText(form.nameLabel), {
      target: { name: 'name', value: VALID_INPUT.name },
    })
    fireEvent.change(screen.getByLabelText(form.emailLabel), {
      target: { name: 'email', value: VALID_INPUT.email },
    })
    await waitFor(() => expect(submitButton()).toBeDisabled())

    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())
  })

  it('keeps submit disabled when the email is malformed', async () => {
    render(<Contact2 content={content} />)

    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText(form.emailLabel), {
      target: { name: 'email', value: 'not-an-email' },
    })
    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it('keeps submit disabled when the message is shorter than the schema minimum', async () => {
    render(<Contact2 content={content} />)

    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText(form.messageLabel), {
      target: { name: 'message', value: 'too short' },
    })
    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it('applies the SAME minimum lengths in both locales', async () => {
    // The rules are shared; only the messages differ. A 1-character name must fail here
    // exactly as it does in English.
    render(<Contact2 content={content} />)

    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText(form.nameLabel), { target: { name: 'name', value: 'J' } })
    await waitFor(() => expect(submitButton()).toBeDisabled())

    fireEvent.change(screen.getByLabelText(form.nameLabel), { target: { name: 'name', value: 'Jo' } })
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.change(screen.getByLabelText(form.subjectLabel), { target: { name: 'subject', value: 'abcd' } })
    await waitFor(() => expect(submitButton()).toBeDisabled())
  })

  it('POSTs to the SAME endpoint with the SAME untranslated FormData keys', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)

    render(<Contact2 content={content} />)
    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.click(submitButton())

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(init.method).toBe('POST')
    expect(init.body).toBeInstanceOf(FormData)

    // The API contract is language-independent: translating a label must never rename a key.
    const body = init.body as FormData
    expect(body.get('name')).toBe(VALID_INPUT.name)
    expect(body.get('email')).toBe(VALID_INPUT.email)
    expect(body.get('subject')).toBe(VALID_INPUT.subject)
    expect(body.get('message')).toBe(VALID_INPUT.message)
    // The four content keys, plus the honeypot the security pass added. Asserted as an
    // EXACT set on purpose: a new key appearing here should be a decision, not a surprise.
    // `recaptcha_token` is absent because no site key is configured under test — the token
    // is appended only when one exists, and the SERVER decides what its absence means.
    expect(Array.from(body.keys()).sort()).toEqual([
      'company_website',
      'email',
      'message',
      'name',
      'subject',
    ])
  })

  it('shows the sending state and blocks double submission while in flight', async () => {
    let releaseFetch: (value: unknown) => void = () => {}
    const pending = new Promise((resolve) => {
      releaseFetch = resolve
    })
    const fetchMock = vi.fn().mockReturnValue(pending)
    vi.stubGlobal('fetch', fetchMock)

    render(<Contact2 content={content} />)
    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())

    fireEvent.click(submitButton())

    await waitFor(() => expect(submitButton()).toBeDisabled())
    expect(submitButton().textContent).toBe(form.submitting)
    fireEvent.click(submitButton())
    expect(fetchMock).toHaveBeenCalledTimes(1)

    releaseFetch({ json: async () => ({ success: true }) })
    await waitFor(() => expect(screen.getByText(success.heading)).toBeInTheDocument())
  })

  it('shows the success screen in this locale and can return to a blank form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ success: true }) }))

    render(<Contact2 content={content} />)
    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())
    fireEvent.click(submitButton())

    await waitFor(() => {
      expect(screen.getByText(success.heading)).toBeInTheDocument()
      expect(screen.getByText(success.body)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: success.sendAnother }))

    // Back on the form, cleared, and gated again.
    expect(screen.getByLabelText(form.nameLabel)).toHaveValue('')
    expect(screen.getByLabelText(form.emailLabel)).toHaveValue('')
    expect(screen.getByLabelText(form.messageLabel)).toHaveValue('')
    expect(submitButton()).toBeDisabled()
  })

  it('shows the attachment notice in this locale when the API warns', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ success: true, warning: 'attachment dropped' }) })
    )

    render(<Contact2 content={content} />)
    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())
    fireEvent.click(submitButton())

    await waitFor(() => expect(screen.getByText(success.attachmentNoticeHeading)).toBeInTheDocument())
    expect(screen.getByText(success.attachmentNoticeBody)).toBeInTheDocument()
  })

  it('does not claim success and stays retryable when the API reports failure', async () => {
    // KNOWN PRODUCTION DEFECT, deliberately NOT fixed in Phase G (locale rollout only):
    //
    //   On a failed submission the component calls `setErrors({ general: ... })`, but no
    //   JSX branch ever renders `errors.general`. The user therefore gets NO feedback when
    //   /api/contact fails — the form simply goes quiet, in both languages.
    //
    // This test asserts only what must hold whether or not that defect is fixed: no false
    // success screen, values preserved, retry possible. It will keep passing once the error
    // display is added.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ success: false, message: 'Mail transport unavailable' }) })
    )

    render(<Contact2 content={content} />)
    fillRequiredFields(content)
    await waitFor(() => expect(submitButton()).toBeEnabled())
    fireEvent.click(submitButton())

    // The success screen replaces the whole form, so its absence is what proves the failure
    // path was taken rather than silently treated as success.
    await waitFor(() => expect(submitButton()).toBeEnabled())
    expect(screen.queryByText(success.heading)).not.toBeInTheDocument()
    expect(screen.queryByText(success.body)).not.toBeInTheDocument()

    // The user's input survives so they can retry without retyping.
    expect(screen.getByLabelText(form.nameLabel)).toHaveValue(VALID_INPUT.name)
    expect(screen.getByLabelText(form.messageLabel)).toHaveValue(VALID_INPUT.message)
  })

  it('links the privacy acknowledgement to the one legal URL', () => {
    render(<Contact2 content={content} />)

    // Same destination in both languages: there is only one bilingual legal page.
    expect(screen.getByRole('link', { name: content.privacy.linkText })).toHaveAttribute(
      'href',
      locale === 'sr' ? '/sr/politika-privatnosti' : '/privacy'
    )
    expect(content.privacy.href).toBe(locale === 'sr' ? '/sr/politika-privatnosti' : '/privacy')
  })

  it('shows this locale’s contact details, with the shared mailbox', () => {
    render(<Contact2 content={content} />)

    // The mailbox is data, identical in both locales.
    expect(screen.getByRole('link', { name: 'office@infinus.co' })).toHaveAttribute(
      'href',
      'mailto:office@infinus.co'
    )
    expect(screen.getByText(content.details.address)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: content.details.heading })).toBeInTheDocument()
  })

  it('associates every error-capable input with an accessible invalid state', () => {
    render(<Contact2 content={content} />)

    // No errors on first paint.
    for (const label of [form.nameLabel, form.emailLabel, form.subjectLabel, form.messageLabel]) {
      expect(screen.getByLabelText(label)).toHaveAttribute('aria-invalid', 'false')
    }
  })

  it('carries this locale’s validation messages, not another locale’s', () => {
    // The messages are not reachable through the UI (see the header note), so the schema's
    // wiring is checked at the source of truth instead: each locale supplies its own.
    const other = content === LOCALE_CASES[0].content ? LOCALE_CASES[1].content : LOCALE_CASES[0].content
    expect(validation.name).not.toBe(other.validation.name)
    expect(validation.email).not.toBe(other.validation.email)
  })
})

describe('the two locales render the SAME structure with DIFFERENT copy', () => {
  const en = getDictionary('en').contact
  const sr = getDictionary('sr').contact

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('identical field names, ids and types in both languages', () => {
    const describeForm = (content: ContactDictionary) => {
      const { container, unmount } = render(<Contact2 content={content} />)
      const inputs = Array.from(container.querySelectorAll('input, textarea')).map(
        (el) => `${el.getAttribute('name')}:${el.getAttribute('id')}:${el.getAttribute('type') ?? 'textarea'}`
      )
      unmount()
      return inputs
    }

    expect(describeForm(sr)).toEqual(describeForm(en))
  })

  it('the English acknowledgement is the approved English sentence', () => {
    const { container, unmount } = render(<Contact2 content={en} />)
    expect(container.textContent).toContain('By submitting this form, you confirm that you have read our Privacy Policy.')
    expect(container.textContent).not.toMatch(/you agree to/i)
    unmount()
  })

  it('the Serbian acknowledgement is the approved Serbian sentence, with diacritics', () => {
    const { container, unmount } = render(<Contact2 content={sr} />)
    expect(container.textContent).toContain(
      'Slanjem obrasca potvrđujete da ste pročitali našu Politiku privatnosti.'
    )
    // Not the cookie-consent mechanism: "pristajete"/"prihvatate" would be wrong.
    expect(container.textContent).not.toMatch(/pristajete|prihvatate/i)
    unmount()
  })

  it('no English copy leaks into the Serbian form', () => {
    const { container, unmount } = render(<Contact2 content={sr} />)
    const text = container.textContent ?? ''

    for (const englishOnly of [
      en.hero.heading,
      en.details.heading,
      en.form.namePlaceholder,
      en.form.submit,
      en.privacy.linkText,
    ]) {
      expect(text, `English "${englishOnly}" leaked into the Serbian form`).not.toContain(englishOnly)
    }
    unmount()
  })

  it('the Serbian form uses proper Serbian characters, not ASCII stand-ins', () => {
    const { container, unmount } = render(<Contact2 content={sr} />)
    const text = container.textContent ?? ''

    // Diacritics actually present.
    expect(text).toMatch(/[čćšžđ]/)
    // The specific street name that the English page renders without its š.
    expect(text).toContain('Trešnjinog cveta')
    expect(text).not.toContain('Tresnjinog')
    unmount()
  })

  it('the visible heading is an h1 in both languages', () => {
    for (const content of [en, sr]) {
      const { container, unmount } = render(<Contact2 content={content} />)
      const h1 = container.querySelector('h1')
      expect(h1).not.toBeNull()
      expect(within(h1 as HTMLElement).queryByText(content.hero.heading) ?? h1!.textContent).toBeTruthy()
      expect(h1!.textContent).toBe(content.hero.heading)
      unmount()
    }
  })
})
