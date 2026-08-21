/**
 * Serbian consent-UI copy (Latin script, ekavian) — the cookie banner and settings dialog.
 *
 * ── Provenance ─────────────────────────────────────────────────────────────────
 * `banner.title` and `banner.body` are the two Serbian strings that already shipped, moved
 * here UNCHANGED from components/consent/consent-copy.ts (`titleSr` and `bodySr`). They were
 * rendered alongside the English text on every page; now they are the Serbian banner.
 *
 * Everything else is new: the settings dialog and the buttons had no Serbian version at all,
 * so a Serbian visitor opening cookie settings saw an entirely English dialog.
 *
 * ── Translation decisions ──────────────────────────────────────────────────────
 * Owner-approved terms used as given: "Podešavanja kolačića", "Politika privatnosti",
 * "Prihvati", "Odbij", "Neophodni", "Analitika", "Marketing", "Sačuvaj podešavanja".
 *
 * "Google Analytics" stays in English — a product name.
 *
 * "Marketing" is identical in both locales. It is the established Serbian term; translating
 * it to "oglašavanje" would narrow the meaning to advertising and no longer cover the
 * visitor-identification tools the category actually gates.
 *
 * The inherited `banner.body` capitalises the formal "Vaš". The new strings avoid the
 * second-person possessive altogether rather than mixing conventions — "pamćenje izbora o
 * kolačićima" instead of "pamćenje Vašeg izbora" — so the UI never looks half-formal.
 *
 * ── Tone constraints, deliberately observed ─────────────────────────────────────
 * Nothing implies that non-essential cookies are required or expected. The category
 * descriptions state what is off by default and that nothing loads without permission:
 * "Ništa se ne učitava dok to ne dozvolite." Accept and Reject are plain imperatives of the
 * same length and register, so neither reads as the encouraged option.
 */

import type { ConsentDictionary } from '../dictionary'

export const consent: ConsentDictionary = {
  banner: {
    title: 'Kolačići na infinus.co',
    body:
      'Koristimo kolačiće neophodne za rad sajta. Uz Vaš pristanak koristimo i analitičke kolačiće, kao i marketinške kolačiće. Možete odbiti ili kasnije promeniti izbor.',
    accept: 'Prihvati',
    reject: 'Odbij',
    settings: 'Podešavanja kolačića',
    policyLink: 'Politika privatnosti',
  },
  settings: {
    title: 'Podešavanja kolačića',
    intro:
      'Izaberite koje kolačiće dozvoljavate. Neophodni kolačići su uvek uključeni jer sajt bez njih ne može da radi. Analitički i marketinški kolačići su isključeni dok ih ne uključite.',
    save: 'Sačuvaj podešavanja',
    acceptAll: 'Prihvati sve',
    rejectAll: 'Odbij sve',
    close: 'Zatvori',
    alwaysOn: 'Uvek uključeno',
    categories: {
      necessary: {
        label: 'Neophodni',
        description:
          'Potrebni su za učitavanje sajta, za bezbednost i za pamćenje izbora o kolačićima. Ne mogu se isključiti.',
      },
      analytics: {
        label: 'Analitika',
        description:
          'Google Analytics, koji meri koje se stranice posećuju. Ništa se ne učitava dok to ne dozvolite.',
      },
      marketing: {
        label: 'Marketing',
        description:
          'Alati za identifikaciju posetilaca i marketing. Ništa se ne učitava dok to ne dozvolite.',
      },
    },
  },
  /** The SERBIAN legal document. A Serbian visitor is never sent to the English policy. */
  privacyHref: '/sr/politika-privatnosti',
}
