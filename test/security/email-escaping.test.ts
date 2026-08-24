/**
 * @vitest-environment node
 *
 * HTML injection through the email templates.
 *
 * Every one of these values is something a stranger can type into a public form on the live
 * site. Before this pass they were interpolated into the HTML body raw — and the message
 * field was converted to markup deliberately, with `.replace(/\n/g, '<br>')` applied to
 * untouched input. So a contact submission containing `<img src=x onerror=...>` produced
 * live markup in the inbox of whoever opened it.
 *
 * The assertions are deliberately blunt: the dangerous SUBSTRING must not appear, and the
 * escaped form must. Checking only "contains &lt;" would pass a template that escaped one
 * field and not the next.
 */
import { describe, test, expect } from 'vitest'
import { emailTemplates } from '@/lib/email'

/** The payloads. Each targets a different escape hatch. */
const HOSTILE = {
  script: '<script>alert(1)</script>',
  imgOnerror: '<img src=x onerror=alert(1)>',
  attributeBreak: '" onmouseover="alert(1)',
  singleQuote: "' onfocus='alert(1)",
  entity: '&lt;already&gt; &amp; escaped',
  javascriptUrl: 'javascript:alert(document.cookie)',
  multiline: 'line one\n<script>alert(2)</script>\nline three',
}

/**
 * No submitted value may form a TAG.
 *
 * The precise threat is a `<` that a parser reads as the start of an element. Once `<` is
 * escaped, the rest of the payload is inert text: `&lt;img src=x onerror=alert(1)&gt;`
 * renders as those literal characters and nothing runs. So asserting on the substring
 * `onerror=` alone would be wrong in both directions — it fires on safely escaped text, and
 * it would miss an injection that used a different handler.
 *
 * What is checked instead: no user payload opens an element, and no user payload closes an
 * attribute it was interpolated into.
 */
function assertNoLiveMarkup(html: string) {
  // Tags the payloads try to open.
  expect(html).not.toMatch(/<script/i)
  expect(html).not.toMatch(/<\/script/i)
  expect(html).not.toMatch(/<img/i)
  // An attribute-breaking sequence: a raw quote followed by an event handler.
  expect(html).not.toMatch(/"\s*on[a-z]+\s*=/i)
  expect(html).not.toMatch(/'\s*on[a-z]+\s*=/i)
}

describe('the contact template', () => {
  const rendered = emailTemplates.contactForm({
    name: HOSTILE.script,
    email: HOSTILE.attributeBreak,
    phone: HOSTILE.imgOnerror,
    company: HOSTILE.singleQuote,
    subject: HOSTILE.entity,
    message: HOSTILE.multiline,
  })

  test('no submitted value survives as live markup', () => {
    assertNoLiveMarkup(rendered.html)
  })

  test('the values are still THERE, escaped — not silently dropped', () => {
    // The point is that a colleague reading the inbox sees what the person typed.
    expect(rendered.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(rendered.html).toContain('&quot;')
    expect(rendered.html).toContain('&#39;')
  })

  test('an already-escaped entity is escaped again rather than decoded', () => {
    // `&lt;` must render as the literal text "&lt;", not become "<" on the way through.
    expect(rendered.html).toContain('&amp;lt;already&amp;gt;')
  })

  test('the message keeps its line breaks WITHOUT keeping its markup', () => {
    // Escape first, then insert <br>. The old code did it the other way round.
    expect(rendered.html).toContain('<br>')
    expect(rendered.html).toContain('line one<br>&lt;script&gt;')
  })

  test('a newline in the subject cannot inject a mail header', () => {
    const injected = emailTemplates.contactForm({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'Hello\r\nBcc: victim@example.com',
      message: 'hi there, this is long enough',
    })
    // The injection vector is the LINE BREAK, not the word. A subject reading
    // "Hello Bcc: victim@example.com" is merely an odd subject; a subject containing CR/LF
    // is a second header. Only the break has to go.
    expect(injected.subject).not.toMatch(/[\r\n]/)
  })

  test('a hostile FILENAME is escaped too', () => {
    const withFile = emailTemplates.contactForm({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'Subject here',
      message: 'a message long enough to pass',
      attachment: {
        file: new File([new Uint8Array(4)], 'x.pdf', { type: 'application/pdf' }),
        safeFilename: '<script>alert(1)</script>.pdf',
      },
    })
    assertNoLiveMarkup(withFile.html)
  })
})

describe('the careers template', () => {
  const rendered = emailTemplates.joinTeam({
    name: HOSTILE.imgOnerror,
    email: HOSTILE.script,
    phone: HOSTILE.attributeBreak,
    linkedin: HOSTILE.javascriptUrl,
    subject: 'SAP Consultant',
    message: HOSTILE.multiline,
    utm_source: HOSTILE.script,
    utm_medium: HOSTILE.imgOnerror,
    utm_campaign: HOSTILE.attributeBreak,
  })

  test('no submitted value survives as live markup', () => {
    assertNoLiveMarkup(rendered.html)
  })

  test('the LinkedIn href cannot break out of its attribute', () => {
    // This one is rendered inside href="...". An unescaped quote there closes the attribute
    // and everything after it becomes markup.
    const hostileHref = emailTemplates.joinTeam({
      name: 'Ada',
      email: 'ada@example.com',
      linkedin: '" onmouseover="alert(1)',
      subject: 'SAP Consultant',
      message: 'a message long enough to pass',
    })
    expect(hostileHref.html).not.toContain('" onmouseover="')
    expect(hostileHref.html).toContain('&quot;')
  })

  test('UTM values are escaped — they come from the URL, which anyone controls', () => {
    expect(rendered.html).not.toContain('<script>')
    expect(rendered.html).toContain('&lt;script&gt;')
  })
})

describe('the e-book lead notification', () => {
  const rendered = emailTemplates.ebookLead({
    name: HOSTILE.script,
    email: HOSTILE.attributeBreak,
    company: HOSTILE.imgOnerror,
    role: HOSTILE.singleQuote,
    country: HOSTILE.script,
    locale: 'sr',
    utm_source: HOSTILE.imgOnerror,
  })

  test('no submitted value survives as live markup', () => {
    assertNoLiveMarkup(rendered.html)
  })

  test('a newline in the company cannot inject a mail header', () => {
    const injected = emailTemplates.ebookLead({
      name: 'Ada',
      email: 'ada@example.com',
      company: 'Acme\r\nBcc: victim@example.com',
    })
    expect(injected.subject).not.toMatch(/[\r\n]/)
  })

  test('the country field, which is new, is escaped like everything else', () => {
    expect(rendered.html).toContain('&lt;script&gt;')
  })
})
