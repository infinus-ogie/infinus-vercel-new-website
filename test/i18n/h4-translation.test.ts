/**
 * PHASE H4 translation guards - the four Serbian to English GROW / Professional Services pages.
 *
 * -- What this file does NOT do ------------------------------------------------
 * It does not snapshot the English prose. That copy is a DRAFT awaiting owner and Dejan
 * review, and pinning sentences that are about to be edited would turn the review into a
 * test-fixing exercise. Every assertion here is about a property that must hold no matter
 * how the wording lands.
 *
 * -- What it does --------------------------------------------------------------
 *   A. STRUCTURE - the two dictionaries agree on shape and length everywhere, so a
 *      translated list cannot quietly lose or gain an item.
 *   B. FACTS - every figure, percentage, source, URL, file path and analytics id survives
 *      translation unchanged. This is the class of error that costs money.
 *   C. LANGUAGE - no Cyrillic and no untranslated Serbian in the English; and the Serbian
 *      source was not rewritten during extraction.
 *   D. TERMINOLOGY - SAP product names and finance acronyms byte-identical across locales.
 *   E. PROVENANCE - the Serbian file says it is the approved source; the English says DRAFT.
 */

import { describe, test, expect } from 'vitest'
import fs from 'node:fs'
import { getDictionary } from '@/content/dictionary'
import { LOCALES } from '@/lib/i18n'
import { pairPath } from '@/lib/growth-routes'

const en = getDictionary('en').growth
const sr = getDictionary('sr').growth
const enText = JSON.stringify(en)
const srText = JSON.stringify(sr)

const CYRILLIC = new RegExp('[Ѐ-ӿ]')
const MOJIBAKE = new RegExp('Ã[ -¿]')
const SERBIAN_LETTERS = new RegExp('[čćžšđČĆŽŠĐ]')
const REPLACEMENT_CHAR = '�'

/** Every leaf string in a namespace, with its dotted path. */
function leaves(node: unknown, prefix = ''): Array<[string, string]> {
  if (typeof node === 'string') return [[prefix, node]]
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, prefix + '.' + i))
  if (node !== null && typeof node === 'object') {
    return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
      leaves(v, prefix === '' ? k : prefix + '.' + k)
    )
  }
  return []
}

/**
 * Leaves as ARRAYS and plain lookup objects, not Maps.
 *
 * tsconfig targets es5, so `for (const x of someMap)` fails to compile without
 * downlevelIteration. Arrays and Record lookups need neither.
 */
const enLeaves: ReadonlyArray<[string, string]> = leaves(en)
const srLeaves: ReadonlyArray<[string, string]> = leaves(sr)

const toRecord = (pairs: ReadonlyArray<[string, string]>): Record<string, string> => {
  const out: Record<string, string> = {}
  for (let i = 0; i < pairs.length; i += 1) out[pairs[i][0]] = pairs[i][1]
  return out
}
const enByPath = toRecord(enLeaves)
const srByPath = toRecord(srLeaves)
const pathsOf = (pairs: ReadonlyArray<[string, string]>): string[] => pairs.map((p) => p[0])

describe('A. the two dictionaries agree on structure', () => {
  test('exactly the same key paths on both sides', () => {
    expect(pathsOf(enLeaves).slice().sort()).toEqual(pathsOf(srLeaves).slice().sort())
  })

  test('no English string is empty where the Serbian has content', () => {
    for (const [path, srValue] of srLeaves) {
      const enValue = enByPath[path]
      expect(typeof enValue, path + ' missing from the English dictionary').toBe('string')
      if (srValue.length > 0) {
        expect(enValue.length, path + ' is empty in English but not in Serbian').toBeGreaterThan(0)
      }
    }
  })

  test('every list has the same length in both locales', () => {
    const pairs: ReadonlyArray<readonly [string, readonly unknown[], readonly unknown[]]> = [
      ['shared.faqShared', en.shared.faqShared, sr.shared.faqShared],
      ['grow.stats', en.grow.stats, sr.grow.stats],
      ['grow.valueCards', en.grow.valueCards, sr.grow.valueCards],
      ['grow.downloads', en.grow.downloads, sr.grow.downloads],
      ['grow.focusCards', en.grow.focusCards, sr.grow.focusCards],
      ['cfo.timeline', en.cfo.timeline, sr.cfo.timeline],
      ['cfo.quickStart', en.cfo.quickStart, sr.cfo.quickStart],
      ['ceo.timeline', en.ceo.timeline, sr.ceo.timeline],
      ['ceo.quickStart', en.ceo.quickStart, sr.ceo.quickStart],
      ['ps.stats', en.professionalServices.stats, sr.professionalServices.stats],
      ['ps.valueCards', en.professionalServices.valueCards, sr.professionalServices.valueCards],
      ['ps.downloads', en.professionalServices.downloads, sr.professionalServices.downloads],
      ['ps.faqs', en.professionalServices.faqs, sr.professionalServices.faqs],
    ]
    for (const [name, a, b] of pairs) expect(a.length, name).toBe(b.length)
  })

  test('the counts the pages promise in their own copy are intact', () => {
    // The CFO page says "10 long-term advantages" and the CEO page "12". If a timeline lost
    // an entry, the promise would be wrong in both languages at once.
    expect(sr.cfo.timeline.length).toBe(10)
    expect(en.cfo.timeline.length).toBe(10)
    expect(sr.ceo.timeline.length).toBe(12)
    expect(en.ceo.timeline.length).toBe(12)
    expect(sr.grow.stats.length).toBe(3)
    expect(sr.professionalServices.stats.length).toBe(4)
  })
})

describe('B. every fact survives translation', () => {
  test('statistic values are byte-identical and suffix digits unchanged', () => {
    for (const page of ['grow', 'professionalServices'] as const) {
      const a = en[page].stats
      const b = sr[page].stats
      for (let i = 0; i < b.length; i += 1) {
        expect(a[i].value, page + '.stats.' + i + '.value').toBe(b[i].value)
        // The suffix is translated only where it contains a word: " od 3" becomes " in 3".
        expect(a[i].suffix.replace(/[a-zA-Z]+/g, ''), page + '.stats.' + i + '.suffix').toBe(
          b[i].suffix.replace(/[a-zA-Z]+/g, '')
        )
      }
    }
  })

  test('numbers inside statistic labels are unchanged', () => {
    for (const page of ['grow', 'professionalServices'] as const) {
      for (let i = 0; i < sr[page].stats.length; i += 1) {
        const srNums = (sr[page].stats[i].label.match(/\d+%?/g) ?? []).sort()
        const enNums = (en[page].stats[i].label.match(/\d+%?/g) ?? []).sort()
        expect(enNums, page + '.stats.' + i + '.label numbers').toEqual(srNums)
      }
    }
  })

  test('the CFO fast-start figure keeps its magnitudes', () => {
    const digits = (s: string) => s.replace(/[^0-9%]/g, '')
    expect(digits(en.cfo.quickStart[0].detail)).toBe(digits(sr.cfo.quickStart[0].detail))
    expect(digits(sr.cfo.quickStart[0].detail)).toBe('20%30%')
  })

  test('research sources and their URLs are identical', () => {
    expect(en.grow.sourceHref).toBe(sr.grow.sourceHref)
    expect(en.professionalServices.sourceHref).toBe(sr.professionalServices.sourceHref)
    for (const t of [en.grow.sourceText, sr.grow.sourceText, en.professionalServices.sourceText]) {
      expect(t).toContain('2024')
    }
  })

  test('every asset path is identical across locales', () => {
    // No English-only PDF was invented and no file duplicated: both locales serve the same
    // language-neutral documents.
    expect(en.grow.zipUrl).toBe(sr.grow.zipUrl)
    expect(en.professionalServices.zipUrl).toBe(sr.professionalServices.zipUrl)
    for (let i = 0; i < sr.grow.downloads.length; i += 1) {
      expect(en.grow.downloads[i].url, 'grow.downloads.' + i).toBe(sr.grow.downloads[i].url)
    }
    for (let i = 0; i < sr.professionalServices.downloads.length; i += 1) {
      expect(en.professionalServices.downloads[i].url).toBe(sr.professionalServices.downloads[i].url)
    }
  })

  test('every asset the pages link to actually exists on disk', () => {
    const paths = [
      en.grow.zipUrl,
      en.professionalServices.zipUrl,
      ...en.grow.downloads.map((d) => d.url),
      ...en.professionalServices.downloads.map((d) => d.url),
    ]
    for (const p of paths) {
      expect(fs.existsSync('public' + decodeURIComponent(p)), 'missing asset: ' + p).toBe(true)
    }
  })

  test('analytics ids are identical, so events stay comparable across locales', () => {
    for (let i = 0; i < sr.grow.downloads.length; i += 1) {
      expect(en.grow.downloads[i].analyticsId).toBe(sr.grow.downloads[i].analyticsId)
      expect(en.grow.downloads[i].id).toBe(sr.grow.downloads[i].id)
    }
    for (let i = 0; i < sr.professionalServices.downloads.length; i += 1) {
      expect(en.professionalServices.downloads[i].analyticsId).toBe(
        sr.professionalServices.downloads[i].analyticsId
      )
    }
  })

  test('each half sends the reader to its OWN contact page', () => {
    // This assertion used to be `en === sr`, which is how both halves came to point at
    // /contact — the ENGLISH page — so the closing CTA on four Serbian pages crossed the
    // language boundary. Sameness was the wrong invariant for a URL.
    //
    // What replaces it is stronger than the two literals: each destination must be the path
    // content/routes.ts declares for the `contact` page in that locale, so a typo or a stale
    // literal fails here rather than shipping a 404 behind a button.
    expect(sr.shared.contactHref).toBe('/sr/contact')
    expect(en.shared.contactHref).toBe('/contact')
    expect(en.shared.contactHref).not.toBe(sr.shared.contactHref)
    for (const locale of LOCALES) {
      const declared = pairPath('contact', locale)
      expect(getDictionary(locale).growth.shared.contactHref, locale).toBe(declared)
    }
  })

  test('third-party document titles are NOT translated', () => {
    // They are published names. Translating them would make the document unfindable.
    for (let i = 0; i < sr.professionalServices.downloads.length; i += 1) {
      expect(en.professionalServices.downloads[i].title, 'download ' + i).toBe(
        sr.professionalServices.downloads[i].title
      )
    }
  })
})

describe('C. the English is English and the Serbian was not rewritten', () => {
  test('no Cyrillic in either dictionary', () => {
    expect(CYRILLIC.test(enText), 'en contains Cyrillic').toBe(false)
    expect(CYRILLIC.test(srText), 'sr contains Cyrillic').toBe(false)
  })

  test('no replacement characters or mojibake', () => {
    for (const [label, text] of [['en', enText], ['sr', srText]] as const) {
      expect(text.indexOf(REPLACEMENT_CHAR), label + ' has a replacement character').toBe(-1)
      expect(MOJIBAKE.test(text), label + ' looks double-encoded').toBe(false)
    }
  })

  test('no Serbian-only letter survives in the English copy', () => {
    // Those letters appear in no English word, so their presence means an untranslated
    // string. The exceptions are shared by design: third-party titles and asset paths.
    const SHARED_BY_DESIGN = new Set<string>()
    sr.professionalServices.downloads.forEach((_, i) => {
      SHARED_BY_DESIGN.add('professionalServices.downloads.' + i + '.title')
      SHARED_BY_DESIGN.add('professionalServices.downloads.' + i + '.url')
    })
    sr.professionalServices.schema.schemaDownloads.forEach((_, i) => {
      SHARED_BY_DESIGN.add('professionalServices.schema.schemaDownloads.' + i + '.name')
      SHARED_BY_DESIGN.add('professionalServices.schema.schemaDownloads.' + i + '.url')
    })
    for (const [path, value] of enLeaves) {
      if (SHARED_BY_DESIGN.has(path)) continue
      expect(
        SERBIAN_LETTERS.test(value),
        path + ' still looks Serbian: ' + value.slice(0, 70)
      ).toBe(false)
    }
  })

  test('no distinctive Serbian word leaked into the English copy', () => {
    const GIVEAWAYS = [
      'Spremni', 'Preuzmite', 'Preuzmi', 'Odgovaramo', 'Infinusu', 'Otvori',
      'Fokusirane', 'prednosti', 'materijale', 'razgovaramo', 'upit',
    ]
    for (const [path, value] of enLeaves) {
      for (const word of GIVEAWAYS) {
        expect(value.indexOf(word), path + ' contains the Serbian word "' + word + '"').toBe(-1)
      }
    }
  })

  test('the Serbian source was not rewritten during extraction', () => {
    // Spot-checked on the strings a careless refactor would touch first.
    expect(sr.shared.ctaHeading).toBe('Spremni da razgovaramo?')
    expect(sr.shared.aboutHeading).toBe('O Infinusu')
    expect(sr.cfo.schema.pageName).toBe('SAP for CFOs')
    expect(sr.grow.hero.title).toBe('GROW with SAP:')
    // And the Serbian is still recognisably Serbian.
    expect(SERBIAN_LETTERS.test(srText), 'the Serbian copy lost its diacritics').toBe(true)
  })

  test('every string identical across locales is identical for a REASON', () => {
    // Stronger than a threshold: each identical value must fall into a category where
    // sameness is correct. 90 of 259 leaves match, and the point is that none of them is
    // untranslated prose.
    //
    // The large "already English" group is the interesting one: the Serbian originals used
    // English for SAP product names, the two role page titles, the resource labels
    // (Research / Checklist / Infographic), the schema `about` topics, the breadcrumb labels
    // and the third-party document titles. Translating those would have been the error.
    const ALLOWED_BY_PATH = [
      /\.url$/, /Href$/, /zipUrl$/, // shared, language-neutral assets
      /\.id$/, /analyticsId$/, // identifiers, so analytics stays comparable
      /\.value$/, /\.suffix$/, // figures
      /schema\.articleAbout\./, // SAP product names
      /schema\.breadcrumbs\./, // Home / GROW / SAP for CFOs
      /schema\.pageName$/, /ogImageAlt$/,
      /schema\.downloadsListName$/, /schema\.downloadsListDescription$/,
      /downloads\.\d+\.(title|label)$/, // published third-party names
      /schemaDownloads\.\d+\.name$/,
      /^shared\.heroBadge/, // "PROGRAM" / "GROW with SAP"
    ]
    const ALLOWED_BY_VALUE = new Set([
      'GROW with SAP:', // the hero title IS the programme name
      'SAP Cloud ERP + Business AI', // the two role heroes
      'SAP for CFOs',
      'SAP for CEOs',
      'SAP for CFOs | Infinus',
      'SAP for CEOs | Infinus',
      'Oxford Economics (CFO Insights), 2024', // a cited report's own name
    ])

    const unexplained: string[] = []
    for (const [path, value] of enLeaves) {
      if (value !== srByPath[path]) continue
      if (ALLOWED_BY_VALUE.has(value)) continue
      if (ALLOWED_BY_PATH.some((re) => re.test(path))) continue
      unexplained.push(path + ' = "' + value.slice(0, 70) + '"')
    }
    expect(unexplained, 'these strings are identical in both locales for no stated reason').toEqual([])
  })

  test('most of the copy really was translated', () => {
    // The complement of the test above: a floor on how much differs, so the pair cannot pass
    // by both sides collapsing to the same shared vocabulary.
    let translated = 0
    for (const [path, value] of enLeaves) {
      if (value !== srByPath[path]) translated += 1
    }
    expect(translated, translated + ' of ' + enLeaves.length + ' strings differ').toBeGreaterThan(150)
  })
})

describe('D. official terminology is preserved exactly', () => {
  const KEEP = [
    'SAP', 'SAP Cloud ERP', 'Business AI', 'Joule', 'SAP Best Practices',
    'SAP DRC/eDocument', 'GROW with SAP', 'Group Reporting', 'XaaS',
    'IFRS 15/16', 'DSO', 'DPO', 'DIO', 'AP/AR', 'TCO', 'OPEX', 'CapEx',
    'M&A', 'ROI', 'KPI', 'SSO', 'ISO', 'SOC', 'ERP', 'Excel',
    'Oxford Economics', 'TechTarget', 'Professional Services',
  ]

  test('each term present in the Serbian is present in the English', () => {
    for (const term of KEEP) {
      if (srText.indexOf(term) === -1) continue
      expect(enText.indexOf(term), '"' + term + '" was translated or dropped').not.toBe(-1)
    }
  })

  test('the programme badge is identical in both locales', () => {
    expect(en.shared.heroBadgeText).toBe('GROW with SAP')
    expect(sr.shared.heroBadgeText).toBe('GROW with SAP')
  })

  test('the role page names are the established English ones on both halves', () => {
    for (const locale of LOCALES) {
      const g = getDictionary(locale).growth
      expect(g.cfo.schema.pageName).toBe('SAP for CFOs')
      expect(g.ceo.schema.pageName).toBe('SAP for CEOs')
    }
  })

  test('schema about-topics are identical, because they are product names', () => {
    expect([...en.grow.schema.articleAbout]).toEqual([...sr.grow.schema.articleAbout])
    expect([...en.cfo.schema.articleAbout]).toEqual([...sr.cfo.schema.articleAbout])
    expect([...en.ceo.schema.articleAbout]).toEqual([...sr.ceo.schema.articleAbout])
    expect([...en.professionalServices.schema.articleAbout]).toEqual([
      ...sr.professionalServices.schema.articleAbout,
    ])
  })
})

describe('E. provenance markers say what they should', () => {
  test('the Serbian file declares itself the existing approved source', () => {
    const src = fs.readFileSync('content/sr/growth.ts', 'utf8')
    expect(src).toContain('EXISTING APPROVED SOURCE')
  })

  test('the English file is still marked DRAFT and NOT approved', () => {
    const src = fs.readFileSync('content/en/growth.ts', 'utf8')
    expect(src).toContain('DRAFT — OWNER/DEJAN REVIEW REQUIRED')
    expect(src.indexOf('OWNER-APPROVED'), 'the English translation is not approved yet').toBe(-1)
  })

  test('the Serbian source is still marked as extracted, not authored', () => {
    // This used to assert that the StatPills defect was still documented as PRESERVED. It has
    // since been fixed — see test/i18n/statpills-locale.test.ts — so the assertion moved to
    // what is still true of this file: it is a verbatim extraction, and the one non-copy value
    // the polish pass changed is called out where a reader will find it.
    const src = fs.readFileSync('content/sr/growth.ts', 'utf8')
    expect(src).toContain('EXISTING APPROVED SOURCE')
    expect(src).toContain('shared.contactHref')
  })

  test('the Serbian CTA destination is the Serbian contact page', () => {
    // The one Serbian value this phase changed. Asserted per locale rather than by comparing
    // the two, so a regression that pointed BOTH at /contact could not pass.
    expect(sr.shared.contactHref).toBe('/sr/contact')
    expect(en.shared.contactHref).toBe('/contact')
  })

  test('the schema-download defect is FIXED, in both locales, and stays fixed', () => {
    // The regression this exists for: the Serbian JSON-LD ItemList advertised four
    // CreativeWork URLs under /professional-services-materials/, a directory that has never
    // existed. The visible download list on the same page always used the real directory,
    // which is why nobody noticed — a broken URL in structured data produces no visible
    // symptom, so only a test keeps it honest.
    //
    // Asserted per locale rather than by comparing the two, because "EN equals SR" would also
    // pass if BOTH were broken.
    for (const locale of LOCALES) {
      const items = getDictionary(locale).growth.professionalServices.schema.schemaDownloads
      expect(items.length, locale + ' lost schema downloads').toBe(4)
      for (const item of items) {
        expect(
          item.url.indexOf('/growth-professional-services-materials/'),
          locale + ' schema url is not under the real directory: ' + item.url
        ).toBe(0)
      }
    }
  })

  test('every download URL in either dictionary resolves to a real file in public/', () => {
    // The general form of the check above: not just the schema list, but every asset either
    // locale links — visible downloads, ZIP bundles and schema URLs alike. A path is only
    // correct if the file is actually there, so this reads the filesystem rather than matching
    // a prefix. Percent-encoded paths are decoded first: several of these files have spaces
    // in their names.
    const seen: string[] = []
    for (const locale of LOCALES) {
      for (const [path, value] of leaves(getDictionary(locale).growth)) {
        const isAsset = value.indexOf('/') === 0 && /\.(pdf|zip|png|jpg|jpeg|mp4|docx)$/i.test(value)
        if (!isAsset) continue
        const file = 'public' + decodeURIComponent(value)
        expect(fs.existsSync(file), locale + '.' + path + ' -> missing file ' + value).toBe(true)
        seen.push(locale + ' ' + value)
      }
    }
    // Guard against the assertion silently covering nothing: 4 downloads + 1 ZIP + 4 schema
    // URLs on Professional Services, 4 + 1 on GROW, and the two role hero images, per locale.
    expect(seen.length, 'no asset paths were checked at all').toBeGreaterThanOrEqual(20)
  })
})
