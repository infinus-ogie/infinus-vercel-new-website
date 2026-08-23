/**
 * PHASE H3 copy guards — the four product pages.
 *
 * The owner review is COMPLETE, so this file now pins the approved Serbian wording as well
 * as the structural guarantees it started with. The corrections from Parts B, C and E are
 * asserted individually below, so reverting one fails loudly rather than passing a generic
 * "is it Serbian?" check.
 *
 * What is pinned:
 *
 *   A. The ENGLISH extraction is faithful. English is the source of truth and Phase H3 must
 *      not have reworded it, so the strings that were literals in the pre-H3 route files and
 *      _config.ts are asserted verbatim.
 *   B. Facts survive translation. Every figure, range, price and duration in the English copy
 *      appears in the Serbian copy — the one class of translation error that costs money.
 *   C. Product and programme names are NOT translated.
 *   D. Script and encoding: Latin script, no Cyrillic, no mojibake, no leftover English
 *      sentences in the Serbian file.
 *   E. Destinations. The Serbian pages link to Serbian pages; the locale-invariant assets
 *      (the one PDF, the one video) are deliberately shared.
 *   F. The provenance markers say OWNER-APPROVED.
 *   G. Every owner correction from Parts B, C and E is in place, and the pre-review wording
 *      is gone.
 */

import { describe, test, expect } from 'vitest'
import fs from 'node:fs'
import {
  getDictionary,
  DICTIONARY_NAMESPACES,
  dictionaryKeyReport,
  type DictionaryNamespace,
} from '@/content/dictionary'
import { LOCALES } from '@/lib/i18n'

const H3_NAMESPACES: DictionaryNamespace[] = [
  'projectPulse',
  'projectPulseBrochure',
  'projectPulseVideo',
  'sapStarterPackage',
]

function leaves(ns: DictionaryNamespace, locale: 'en' | 'sr'): string[] {
  const root = getDictionary(locale)[ns] as unknown as Record<string, unknown>
  return dictionaryKeyReport(ns).en.map((p) =>
    String(p.split('.').reduce<unknown>((n, k) => (n as Record<string, unknown>)?.[k], root))
  )
}

const allText = (ns: DictionaryNamespace, locale: 'en' | 'sr'): string => leaves(ns, locale).join('\n')

describe('A. the English extraction is faithful to the pre-H3 source', () => {
  const en = getDictionary('en')

  test('ProjectPulse hero and CTA labels are the literals the page shipped', () => {
    const pp = en.projectPulse
    expect(pp.hero.title).toBe('ProjectPulse')
    expect(pp.hero.subtitle).toBe('Project-to-Profit for Professional Services')
    // The hero and the footer CTA carry DIFFERENT labels in the live page. Two labels for
    // one destination is odd, and it is preserved rather than harmonised.
    expect(pp.hero.ctaDiscovery).toBe('Book a 60-min discovery call')
    expect(pp.cta.primaryCta).toBe('Book a discovery call')
    expect(pp.hero.ctaBrochure).toBe('Download brochure')
    expect(pp.cta.secondaryCta).toBe('Download brochure')
    expect(pp.cta.trustNote).toBe('We respond within one business day')
  })

  test('the solution card still bolds Project-to-Profit and nothing else', () => {
    const s = en.projectPulse.problem.solution
    expect(s.descriptionStrong).toBe('Project-to-Profit')
    // The three fragments must reassemble into the exact sentence the old config held.
    expect(`${s.descriptionPrefix}${s.descriptionStrong}${s.descriptionSuffix}`).toBe(
      'ProjectPulse standardizes your entire Project-to-Profit flow in SAP Cloud ERP - from project setup and staffing to billing, profitability, and cash flow.'
    )
  })

  test('the eight industries are unchanged and in the original order', () => {
    expect([...en.projectPulse.industries]).toEqual([
      'Business Consulting & Advisory',
      'IT Services',
      'Software Development',
      'Outsourcing & Managed Services',
      'Creative & Digital Services',
      'Architecture & Design Services',
      'Engineering Services',
      'Legal Services',
    ])
  })

  test('the four value-proposition descriptions are still empty', () => {
    // Not a placeholder: these four empty strings land in the live JSON-LD featureList.
    // If a future edit fills them in, the schema changes and that should be a decision.
    for (const item of en.projectPulse.valueProposition.items) expect(item.description).toBe('')
  })

  test('the Starter Package copy still matches the approved DOCX wording', () => {
    const sp = en.sapStarterPackage
    expect(sp.hero.tagline).toBe('When your company outgrows Excel and disconnected systems')
    expect(sp.solution.highlight).toBe('One system. One source of truth. Real-time insight.')
    expect(sp.cta.heading).toBe('Ready to move beyond Excel and disconnected systems?')
    // EN DASH here, hyphen on the ProjectPulse page. Two pages, two conventions, both live.
    expect(sp.why.items[3]).toBe('Ready to deploy in 4–6 months')
    expect(en.projectPulse.valueProposition.items[3].title).toBe('Ready to deploy in 4-6 months')
  })

  test('the brochure keeps its inconsistent price formatting', () => {
    const b = en.projectPulseBrochure
    expect(b.commercial.rows[1].value).toBe('€9,000 / month')
    // "from EUR 100,000" in a row already labelled "(from)". Reproduced, not fixed.
    expect(b.commercial.rows[2].label).toBe('Implementation services (from)')
    expect(b.commercial.rows[2].value).toBe('from EUR 100,000')
    expect(b.cta.emailAddress).toBe('dejan@infinus.co')
  })

  test('the video overlay keeps its separate visible label and accessible name', () => {
    const v = en.projectPulseVideo
    expect(v.closeLabel).toBe('Close')
    expect(v.closeAriaLabel).toBe('Close video')
    expect(v.videoFallback).toBe('Your browser does not support the video tag.')
  })
})

describe('B. every figure in the English copy survives into the Serbian', () => {
  // Bare numbers, percentages, ranges and money. A dropped or altered figure in a
  // commercial document is the expensive kind of translation bug.
  const FIGURES: Record<string, string[]> = {
    projectPulse: ['4-6', '7'],
    projectPulseBrochure: ['3–6', '500+', '30+', '42', '82%', '31%', '9', '100'],
    projectPulseVideo: [],
    sapStarterPackage: ['4–6'],
  }

  for (const ns of H3_NAMESPACES) {
    test(`${ns} keeps every figure`, () => {
      const sr = allText(ns, 'sr')
      for (const fig of FIGURES[ns]) {
        expect(sr.indexOf(fig), `${ns}: figure ${fig} is missing from the Serbian copy`).not.toBe(-1)
      }
    })
  }

  test('the brochure prices keep their magnitudes, with Serbian thousands separators', () => {
    const sr = getDictionary('sr').projectPulseBrochure.commercial.rows
    // Same numbers, Serbian separator: 9,000 -> 9.000 and 100,000 -> 100.000.
    expect(sr[1].value).toContain('9.000')
    expect(sr[2].value).toContain('100.000')
    // Currency is not converted. The owner's C6 ruling settled on the EUR code for both
    // Serbian rows rather than the € symbol on one and the code on the other, which is what
    // the English rows still do.
    expect(sr[1].value).toContain('EUR')
    expect(sr[2].value).toContain('EUR')
  })

  test('durations are translated as units, not renumbered', () => {
    const phases = getDictionary('sr').projectPulse.implementation.phases
    expect(phases.map((p) => p.duration)).toEqual([
      '2-3 nedelje',
      '4-6 nedelja',
      '6-8 nedelja',
      '3-4 nedelje',
      '2-4 nedelje',
    ])
  })
})

describe('C. product and programme names are not translated', () => {
  const KEEP = [
    'ProjectPulse',
    'Project-to-Profit',
    'SAP Cloud ERP',
    'SAP Starter Package',
    'SAP Packaged Solutions',
    'SAP Gold Partner',
    'SAP Business AI',
    'Joule Copilot',
    'SAP S/4HANA Cloud',
    'SAP SuccessFactors',
    'SAP Integration Suite',
    'Employee Central',
    'SAP Sales Cloud',
    'Excel',
  ]

  test('each name appears verbatim in the Serbian copy that uses it', () => {
    const srAll = H3_NAMESPACES.map((ns) => allText(ns, 'sr')).join('\n')
    const enAll = H3_NAMESPACES.map((ns) => allText(ns, 'en')).join('\n')
    for (const name of KEEP) {
      if (enAll.indexOf(name) === -1) continue // not used in English either
      expect(srAll.indexOf(name), `${name} must not be translated`).not.toBe(-1)
    }
  })

  test('the SAP methodology phase names stay in English on both sides', () => {
    const en = getDictionary('en').projectPulse.implementation.phases.map((p) => p.name)
    const sr = getDictionary('sr').projectPulse.implementation.phases.map((p) => p.name)
    expect(sr).toEqual(en)
    expect(sr).toEqual([
      'Discover',
      'Fit-to-Standard',
      'Build & Integrate',
      'Test & Train',
      'Go-live & Hypercare',
    ])
  })

  test('the QPPS card title is identical in both locales', () => {
    for (const locale of LOCALES) {
      expect(getDictionary(locale).projectPulse.valueProposition.items[0].title).toBe(
        'SAP Qualified Partner Packaged Solution (QPPS)'
      )
    }
  })
})

describe('D. the Serbian copy is Latin-script and free of leftovers', () => {
  const CYRILLIC = /[Ѐ-ӿ]/
  const MOJIBAKE = /Ã[ -¿]/
  const DIACRITIC = /[čćžšđ]/i

  test('no Cyrillic anywhere', () => {
    for (const ns of H3_NAMESPACES) {
      expect(CYRILLIC.test(allText(ns, 'sr')), `${ns} contains Cyrillic`).toBe(false)
    }
  })

  test('no mojibake or replacement characters', () => {
    for (const ns of H3_NAMESPACES) {
      const t = allText(ns, 'sr')
      expect(t.indexOf('�'), `${ns} has a replacement character`).toBe(-1)
      expect(MOJIBAKE.test(t), `${ns} looks double-encoded`).toBe(false)
    }
  })

  test('Serbian diacritics are present, so the copy is not ASCII-flattened', () => {
    for (const ns of H3_NAMESPACES) {
      expect(DIACRITIC.test(allText(ns, 'sr')), `${ns} has no Serbian diacritics at all`).toBe(true)
    }
  })

  test('no untranslated English sentence survives in the Serbian copy', () => {
    // Sentence-level, not word-level: shared product names are expected, whole English
    // sentences are not.
    const GIVEAWAYS = [
      'Real-time visibility into',
      'When your company outgrows',
      'One system. One source of truth.',
      'We respond within one business day',
      'Choose your preferred language',
      'Your browser does not support',
      'Run projects, people, and profit',
    ]
    const srAll = H3_NAMESPACES.map((ns) => allText(ns, 'sr')).join('\n')
    for (const g of GIVEAWAYS) {
      expect(srAll.indexOf(g), `untranslated English fragment left in Serbian: "${g}"`).toBe(-1)
    }
  })
})

describe('E. destinations and shared assets', () => {
  test('the Serbian pages send visitors to Serbian pages', () => {
    expect(getDictionary('sr').projectPulse.contactHref).toBe('/sr/contact')
    expect(getDictionary('sr').sapStarterPackage.contactHref).toBe('/sr/contact')
    expect(getDictionary('en').projectPulse.contactHref).toBe('/contact')
    expect(getDictionary('en').sapStarterPackage.contactHref).toBe('/contact')
  })

  test('the single PDF and the single video are shared, not forked into dead paths', () => {
    // There is one ProjectPulse brochure and one recording. Pointing the Serbian pages at
    // invented /sr paths would ship a 404 and a broken player.
    expect(getDictionary('sr').projectPulse.brochureHref).toBe(
      getDictionary('en').projectPulse.brochureHref
    )
    expect(getDictionary('sr').projectPulse.brochureFilename).toBe(
      getDictionary('en').projectPulse.brochureFilename
    )
    expect(getDictionary('sr').projectPulseVideo.videoSrc).toBe(
      getDictionary('en').projectPulseVideo.videoSrc
    )
    // Both Starter Package PDFs are offered on both halves: the modal is the visitor's choice.
    expect(getDictionary('sr').sapStarterPackage.brochure).toEqual(
      getDictionary('en').sapStarterPackage.brochure
    )
  })

  test('the absolute schema URL is locale-correct', () => {
    expect(getDictionary('en').projectPulse.page.url).toBe('https://www.infinus.co/projectpulse')
    expect(getDictionary('sr').projectPulse.page.url).toBe('https://www.infinus.co/sr/projectpulse')
  })

  test('all four H3 namespaces are registered', () => {
    for (const ns of H3_NAMESPACES) {
      expect(DICTIONARY_NAMESPACES.indexOf(ns), `${ns} is not registered`).not.toBe(-1)
    }
  })
})

describe('F. provenance markers are honest', () => {
  test('all four H3 Serbian files are OWNER-APPROVED', () => {
    // Inverted at the owner review. Before the review these had to say DRAFT; now they must
    // say approved, and no stale DRAFT marker may linger to make the state ambiguous.
    const files = [
      'content/sr/project-pulse.ts',
      'content/sr/project-pulse-brochure.ts',
      'content/sr/project-pulse-video.ts',
      'content/sr/sap-starter-package.ts',
    ]
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8')
      expect(src.indexOf('OWNER-APPROVED'), `${f} is missing its approval marker`).not.toBe(-1)
      expect(src.indexOf('DRAFT — OWNER REVIEW REQUIRED'), `${f} still claims to be a draft`).toBe(-1)
    }
  })

  test('the video file records the shared-recording ruling', () => {
    // The one known content gap the owner approved as temporary. If someone removes the
    // note, the next reader cannot tell a deliberate decision from an oversight.
    const src = fs.readFileSync('content/sr/project-pulse-video.ts', 'utf8')
    expect(src).toContain('KNOWN CONTENT GAP')
    expect(src).toContain('ENGLISH ProjectPulse recording')
  })
})

describe('G. the owner corrections from Parts B, C and E', () => {
  const pp = getDictionary('sr').projectPulse
  const br = getDictionary('sr').projectPulseBrochure
  const sp = getDictionary('sr').sapStarterPackage

  test('B — "end-to-end" survives only inside the Project-to-Profit name', () => {
    const text = JSON.stringify(pp) + JSON.stringify(sp)
    // B5, B9, B12 removed it from Serbian prose in three places.
    expect(text.toLowerCase().indexOf('end-to-end')).toBe(-1)
    expect(pp.howItWorks.kicker).toBe('Proces od početka do kraja')
    expect(pp.page.description).toContain('u jedan proces od početka do kraja')
    expect(pp.problem.solution.description2).toBe(
      'Jedan sistem. Jedinstven izvor pouzdanih podataka. Jedan proces od početka do kraja.'
    )
    // The product's own named flow is untouched, in both locales.
    expect(pp.problem.solution.descriptionStrong).toBe('Project-to-Profit')
  })

  test('B — the audience is named as companies, not as a sector', () => {
    expect(pp.hero.description).toContain('namenjen kompanijama iz oblasti profesionalnih usluga')
    expect(pp.hero.subtitle).toBe('Project-to-Profit za kompanije iz oblasti profesionalnih usluga')
    expect(pp.idealFor.kicker).toBe('Namenjeno kompanijama iz oblasti profesionalnih usluga')
    expect(pp.schema.industriesListDescription).toBe(
      'Delatnosti iz oblasti profesionalnih usluga koje mogu imati koristi od rešenja ProjectPulse'
    )
  })

  test('B — the remaining ProjectPulse corrections', () => {
    expect(pp.cta.title).toBe('Želite da vidite svoj Project-to-Profit tok?')
    expect(pp.hero.valueHighlights[1]).toBe('Spremnost za fakturisanje i rano uočljive blokade u naplati')
    expect(pp.howItWorks.microCards[0].description).toBe(
      'Pravi ljudi, pravi projekti, pravo vreme, uz jasan pregled iskorišćenosti kapaciteta.'
    )
    expect(pp.implementation.subtitle).toBe('Tipično 4-6 meseci od početka projekta do puštanja u rad')
    expect(pp.problem.description).toBe(
      'Kada se projekti, evidencija radnog vremena, troškovi i fakturisanje nalaze u različitim alatima, uvid stiže prekasno.'
    )
    expect(pp.problem.description2).toBe('Probleme vidite tek kada su marže već ugrožene, a fakture već kasne.')
    expect(pp.valueProposition.items[1].title).toBe(
      'Unapred konfigurisane SAP Best Practices za profesionalne usluge'
    )
  })

  test('B13 — Serbian gets an en dash, English keeps its hyphen', () => {
    expect(getDictionary('sr').projectPulse.problem.solution.descriptionSuffix).toContain(
      'SAP Cloud ERP-u – od otvaranja'
    )
    expect(getDictionary('en').projectPulse.problem.solution.descriptionSuffix).toContain(
      'SAP Cloud ERP - from project setup'
    )
  })

  test('C6 — Serbian prices do not repeat the "od" the label already carries', () => {
    const [, subs, impl] = br.commercial.rows
    expect(subs.label).toBe('Cloud pretplate (od)')
    expect(subs.value).toBe('9.000 EUR mesečno')
    expect(impl.label).toBe('Usluge implementacije (od)')
    expect(impl.value).toBe('100.000 EUR')
    // No value may start with, or contain a second, "od " — that was the defect.
    for (const row of br.commercial.rows) {
      expect(row.value.indexOf('od '), `duplicated "od" in ${row.value}`).toBe(-1)
    }
    // English pricing is untouched, including its own "from" duplication.
    const enRows = getDictionary('en').projectPulseBrochure.commercial.rows
    expect(enRows[1].value).toBe('€9,000 / month')
    expect(enRows[2].value).toBe('from EUR 100,000')
  })

  test('C — brochure terminology corrections', () => {
    expect(br.benefits.items[2]).toBe(
      'Ugrađena SAP analitika i 500+ unapred pripremljenih KPI-jeva, kontrolnih tabli i preglednih stranica.'
    )
    expect(br.benefits.items[3]).toContain('na jednoj platformi u cloudu.')
    expect(br.benefits.items[5]).toBe('Pristup preko mobilnih uređaja za projektne timove i menadžment.')
    expect(br.byRole.roles[0].title).toBe('Jedinstvena cloud osnova za rast')
    expect(br.commercial.heading).toBe('Brže ostvarivanje poslovne vrednosti i komercijalni model')
    expect(br.cta.body).toContain('Razgovarajte sa Infinusom o rešenju ProjectPulse')
    expect(br.dashboard.portfolio.title).toBe('Stanje portfolija projekata')
    expect(br.dashboard.title).toBe('Kontrolni centar za menadžment')
    expect(br.hero.body).toContain('namenjen kompanijama iz oblasti profesionalnih usluga')
    expect(br.hero.title).toBe(
      'ProjectPulse: upravljajte projektima, timovima i profitabilnošću na jednoj inteligentnoj cloud platformi.'
    )
    expect(br.scope.groups[0].bullets[0]).toBe('Potraživanja, obaveze i usaglašavanje bankovnih izvoda.')
    expect(br.scope.groups[0].bullets[2]).toBe('Trezorsko poslovanje i upravljanje novčanim tokom.')
    // The count went 20+ -> 30+ in the final client-feedback round, on both sides at
    // once. The participle-chain correction this line was written to guard is unchanged.
    expect(br.whyInfinus.bullets[2]).toBe(
      '30+ SAP Cloud ERP klijenata kojima smo implementirali rešenje i pružali podršku.'
    )
    expect(br.whyInfinus.bullets[3]).toBe('Prepoznati kao SAP Top Cloud Performer u regionu.')
    expect(br.whyInfinus.footnote).toContain('na jednoj inteligentnoj platformi u cloudu.')
  })

  test('E — Starter Package corrections', () => {
    expect(sp.challenge.lines[0]).toBe('Kako kompanije rastu, sistemi često ne mogu da isprate taj rast.')
    expect(sp.challenge.lines[1]).toBe(
      'Finansijski podaci kasne, izveštaji se ne poklapaju, a timovi troše previše vremena na ručni rad.'
    )
    expect(sp.challenge.lines[2]).toBe(
      'Gubite vidljivost profitabilnosti, zaliha i novčanog toka – upravo kada vam je najpotrebnija.'
    )
    expect(sp.solution.highlight).toBe('Jedan sistem. Jedinstven izvor pouzdanih podataka. Uvid u realnom vremenu.')
    expect(sp.solution.sub).toBe('Strukturisan pristup implementaciji SAP Cloud ERP-a uz nizak rizik.')
    expect(sp.whatYouGain.items[3]).toBe('Bolju kontrolu nad poslovanjem i donošenjem odluka')
    expect(sp.idealFor.items[3]).toBe('Organizacije koje se pripremaju za rast i skaliranje')
  })

  test('1A — "kontrolnih tabli" is now used consistently, pill included', () => {
    // C1 corrected only benefits.items[2] and left the same anglicism in hero.pills[1].
    // 1A finished the job, so the Serbian file uses one term throughout.
    expect(br.benefits.items[2]).toContain('kontrolnih tabli')
    expect(br.hero.pills[1]).toBe('500+ unapred pripremljenih KPI-jeva i kontrolnih tabli')
    expect(JSON.stringify(br).indexOf('dashboard-a'), '"dashboard-a" must be gone').toBe(-1)
    // The English pill is untouched and still says "dashboards".
    expect(getDictionary('en').projectPulseBrochure.hero.pills[1]).toBe('500+ prebuilt KPIs & dashboards')
  })

  test('1B — "strukturisan" is now used consistently across the Starter Package', () => {
    // E5 introduced "Strukturisan" in solution.sub while hero.description and
    // metadata.description kept "struktuiran". 1B harmonised both.
    const SENTENCE =
      'Brz i strukturisan način da implementirate SAP Cloud ERP i postavite skalabilnu digitalnu osnovu za rast.'
    expect(sp.hero.description).toBe(SENTENCE)
    expect(sp.metadata.description).toBe(SENTENCE)
    expect(sp.solution.sub).toBe('Strukturisan pristup implementaciji SAP Cloud ERP-a uz nizak rizik.')
    expect(JSON.stringify(sp).indexOf('struktuiran'), '"struktuiran" must be gone').toBe(-1)
    // The English source sentence is untouched.
    expect(getDictionary('en').sapStarterPackage.hero.description).toBe(
      'A fast, structured way to implement SAP Cloud ERP and establish a scalable digital foundation for growth.'
    )
  })

  test('the pre-review wording is gone from all three files', () => {
    const all = JSON.stringify(pp) + JSON.stringify(br) + JSON.stringify(sp)
    for (const gone of [
      'End-to-end proces',
      'Jedan izvor istine',
      'napravljen za kompanije',
      'Napravljeno za profesionalne usluge',
      'bolja responzivnost',
      'Zdravlje portfolija',
      'SAP ugrađena analitika',
      'dashboard-a',
      'struktuiran ',
      'Komandni centar',
      'Porazgovarajte',
      'Priznati kao',
      'Trezor i upravljanje',
      'usaglašavanje sa bankom',
      'menadžment u pokretu',
      'go-live faze',
      'provode previše vremena',
      'kontrolu poslovanja i odlučivanja',
      'pripremaju za skaliranje',
      'od EUR 100.000',
    ]) {
      expect(all.indexOf(gone), `pre-review wording "${gone}" is back`).toBe(-1)
    }
  })
})
