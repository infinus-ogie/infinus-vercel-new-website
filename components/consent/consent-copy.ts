/**
 * UI copy for the consent banner and settings dialog.
 *
 * This is INTERFACE copy, not legal copy. It describes the cookie categories in plain
 * language so a visitor can make a choice; it is not part of, and does not modify, the
 * approved Privacy Policy in content/legal/politika-privatnosti.ts.
 *
 * Both languages live here because the consent UI is shown on English and Serbian
 * pages alike and must be understandable on both. This is NOT the start of the i18n
 * dictionary system — that arrives in a later phase, and this file is not part of it.
 */

/**
 * Where the banner's and dialog's "Privacy Policy" link goes.
 *
 * Updated to /privacy when the Privacy Policy was split by locale: the old single bilingual
 * URL is now a permanent redirect, and a link a visitor clicks should not need a hop.
 *
 * Only the DESTINATION changed. No consent behaviour, category, storage key or cookie was
 * touched.
 *
 * KNOWN GAP, deliberately not solved here: this banner is bilingual — it shows English and
 * Serbian copy together — but carries a single privacy link, so a Serbian reader following it
 * lands on the English document. That was equally true before the split (the bilingual page
 * opened on its Serbian section only by anchor). Making the consent UI locale-aware is a
 * separate piece of work; it is not a regression introduced here.
 */
export const PRIVACY_POLICY_PATH = "/privacy" as const

export const consentCopy = {
  banner: {
    title: "Cookies on infinus.co",
    titleSr: "Kolačići na infinus.co",
    body:
      "We use cookies that are necessary for the website to work. With your consent we also use analytics cookies to understand how the site is used, and marketing cookies. You can refuse, or change your choice later.",
    bodySr:
      "Koristimo kolačiće neophodne za rad sajta. Uz Vaš pristanak koristimo i analitičke kolačiće, kao i marketinške kolačiće. Možete odbiti ili kasnije promeniti izbor.",
    accept: "Accept",
    reject: "Reject",
    settings: "Cookie settings",
    policyLink: "Privacy Policy",
  },
  settings: {
    title: "Cookie settings",
    intro:
      "Choose which cookies you allow. Necessary cookies are always on because the site cannot work without them. Analytics and marketing cookies are off until you turn them on.",
    save: "Save settings",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    close: "Close",
    alwaysOn: "Always on",
    categories: {
      necessary: {
        label: "Necessary",
        description:
          "Required for the site to load, for security, and to remember your cookie choice. These cannot be switched off.",
      },
      analytics: {
        label: "Analytics",
        description:
          "Google Analytics, used to measure which pages are visited. Nothing loads until you allow this.",
      },
      marketing: {
        label: "Marketing",
        description:
          "Visitor-identification and marketing tools. Nothing loads until you allow this.",
      },
    },
  },
} as const
