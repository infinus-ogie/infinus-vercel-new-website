/**
 * English consent-UI copy — the cookie banner and the settings dialog.
 *
 * ── Provenance: EXTRACTED, NOT WRITTEN ──────────────────────────────────────────
 * Every English string is lifted VERBATIM from components/consent/consent-copy.ts at
 * commit 266546c. Not one word was reworded, and the English consent UI therefore reads
 * exactly as it did before it became localisable.
 *
 * ── This is INTERFACE copy, not legal copy ──────────────────────────────────────
 * It describes the cookie categories in plain language so a visitor can make a choice. It
 * is not part of, and does not modify, the approved Privacy Policy in
 * content/legal/politika-privatnosti.ts, which stays frozen and outside this system.
 *
 * ── Why it moved into the dictionary ────────────────────────────────────────────
 * The old module carried the English strings plus two Serbian ones (`titleSr`, `bodySr`)
 * that were rendered TOGETHER on every page, in both locales. That was the pre-locale
 * compromise: one bilingual banner, understandable either way. Now that the site follows
 * the visitor's language everywhere else, the banner should too — so the copy lives here,
 * one namespace per locale, and gets the whole dictionary contract for free: a missing
 * Serbian key is a compile error, and test/i18n/dictionary.test.ts compares the two key
 * sets so neither side can silently drift.
 *
 * ── What must NOT change with the copy ──────────────────────────────────────────
 * Nothing here touches behaviour. The consent cookie's schema, version, expiry, SameSite
 * and path, the analytics and marketing gates, the withdrawal reload and the GA teardown
 * are all in lib/consent.ts and components/consent/*, untouched.
 */

import type { ConsentDictionary } from '../dictionary'

export const consent: ConsentDictionary = {
  banner: {
    title: 'Cookies on infinus.co',
    body:
      'We use cookies that are necessary for the website to work. With your consent we also use analytics cookies to understand how the site is used, and marketing cookies. You can refuse, or change your choice later.',
    accept: 'Accept',
    reject: 'Reject',
    settings: 'Cookie settings',
    policyLink: 'Privacy Policy',
  },
  settings: {
    title: 'Cookie settings',
    intro:
      'Choose which cookies you allow. Necessary cookies are always on because the site cannot work without them. Analytics and marketing cookies are off until you turn them on.',
    save: 'Save settings',
    acceptAll: 'Accept all',
    rejectAll: 'Reject all',
    close: 'Close',
    alwaysOn: 'Always on',
    categories: {
      necessary: {
        label: 'Necessary',
        description:
          'Required for the site to load, for security, and to remember your cookie choice. These cannot be switched off.',
      },
      analytics: {
        label: 'Analytics',
        description:
          'Google Analytics, used to measure which pages are visited. Nothing loads until you allow this.',
      },
      marketing: {
        label: 'Marketing',
        description:
          'Visitor-identification and marketing tools. Nothing loads until you allow this.',
      },
    },
  },
  /** The English legal document. See content/routes.ts: the pair is navigable, not indexable. */
  privacyHref: '/privacy',
}
