/**
 * PHASE H2 copy guards — the five Serbian case studies.
 *
 * Written after the owner review, so unlike test/i18n/h3-copy.test.ts this file DOES pin the
 * Serbian wording: it is approved copy now, and the seven corrections below are the exact
 * strings that were signed off. A later edit that reverts one fails here.
 *
 *   A. The seven approved corrections are in place and the pre-review wording is gone.
 *   B. The A8 pill fix renders the nearshoring technology group as one pill, in both
 *      locales, without changing any technology string.
 *   C. Facts survived the corrections — figures, modules, process names, acronyms.
 *   D. Provenance says OWNER-APPROVED.
 */

import { describe, test, expect } from 'vitest'
import fs from 'node:fs'
import { getDictionary, CASE_STUDY_KEYS } from '@/content/dictionary'
import { splitTechnologies } from '@/lib/case-study-technologies'
import { LOCALES } from '@/lib/i18n'

const sr = getDictionary('sr').caseStudies
const en = getDictionary('en').caseStudies
const srText = JSON.stringify(sr)

describe('A. the seven owner corrections are applied', () => {
  test('A1 — manufacturing engagement model names the cloud environment', () => {
    expect(sr.items.manufacturing1.engagementModel).toBe(
      'Projektna transformacija sa kompletnom isporukom, od konverzije sistema do migracije u cloud okruženje.'
    )
  })

  test('A2 — manufacturing result reads "prilagođeno radu u cloudu"', () => {
    expect(sr.items.manufacturing1.results).toContain('Modernizovano SAP okruženje prilagođeno radu u cloudu')
  })

  test('A3 — manufacturing intro uses "nesmetanu tranziciju"', () => {
    expect(sr.items.manufacturing1.solutionIntro).toContain('uz nesmetanu tranziciju')
  })

  test('A4 — nearshoring result drops the anglicism "responzivnost"', () => {
    expect(sr.items.nearshoring1.results).toContain('Brža realizacija projekata i brže reagovanje')
  })

  test('A5 + A7 — "Nesmetana integracija" on nearshoring and retail', () => {
    // A5 is a solution bullet, A7 a result — different fields, same false friend retired.
    expect(sr.items.nearshoring1.solutionItems).toContain('Nesmetana integracija sa projektnim timovima klijenta')
    expect(sr.items.retail1.results).toContain('Nesmetana integracija sa internim SAP CoE klijenta')
  })

  test('A6 — nearshoring names client representatives, not "participants"', () => {
    expect(sr.items.nearshoring1.solutionItems).toContain('Bliska saradnja sa relevantnim predstavnicima klijenta')
  })

  test('the retired wording is gone from the six corrected sites', () => {
    for (const gone of [
      'neprimetn',            // 1C retired the last one; no casing may return
      'Neprimetn',
      'responzivnost',
      'u projekte u toku',    // 1C: replaced by "u tekuće projekte"
      'klijentovim učesnicima',
      'spremno za cloud',
      'neprimetnu tranziciju',
    ]) {
      expect(srText.indexOf(gone), `retired wording "${gone}" is back`).toBe(-1)
    }
  })

  test('1C — "neprimetan" is gone entirely, including the challenge paragraph', () => {
    // A5 and A7 retired the false friend in the two integration bullets and left one
    // instance standing in the nearshoring CHALLENGE paragraph, approved as written at that
    // review. 1C retired that one too, so the word now appears nowhere in this namespace.
    expect(srText.indexOf('eprimetn'), 'no form of "neprimetan" may remain').toBe(-1)
    expect(sr.items.nearshoring1.challenge).toContain(
      'nesmetana integracija eksternih resursa u tekuće projekte'
    )
    // The English sentence it translates is untouched.
    expect(en.items.nearshoring1.challenge).toContain(
      'seamlessly integrating external resources into ongoing projects'
    )
  })
})

describe('B. A8 — technology pills keep parenthesised groups whole', () => {
  test('nearshoring renders three pills, not twelve, in both locales', () => {
    for (const locale of LOCALES) {
      const value = getDictionary(locale).caseStudies.items.nearshoring1.technologies
      const pills = splitTechnologies(value)
      expect(pills.length, `${locale} pill count`).toBe(3)
      expect(pills[0]).toBe('SAP ERP')
      expect(pills[1]).toBe('SAP S/4HANA')
      // The whole module group is ONE pill, brackets balanced.
      expect(pills[2]).toContain('(FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)')
      expect(pills[2].indexOf('(')).toBeGreaterThan(-1)
      expect(pills[2].slice(-1)).toBe(')')
    }
  })

  test('the broken pills that prompted A8 can no longer occur', () => {
    for (const locale of LOCALES) {
      const pills = splitTechnologies(getDictionary(locale).caseStudies.items.nearshoring1.technologies)
      expect(pills.indexOf('SAC)')).toBe(-1)
      for (const p of pills) {
        // Balanced brackets in every pill — the actual defect, stated directly.
        const opens = p.split('(').length - 1
        const closes = p.split(')').length - 1
        expect(opens, `unbalanced pill: ${p}`).toBe(closes)
      }
    }
  })

  test('no technology STRING changed — this was a rendering fix', () => {
    expect(en.items.nearshoring1.technologies).toBe(
      'SAP ERP, SAP S/4HANA, multiple functional and technical modules (FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)'
    )
    expect(sr.items.nearshoring1.technologies).toBe(
      'SAP ERP, SAP S/4HANA, više funkcionalnih i tehničkih modula (FI, CO, MM, SD, PP, QM, EWM, ABAP, BC, SAC)'
    )
    // Rejoining the pills reproduces the string, so nothing is lost or duplicated.
    for (const locale of LOCALES) {
      for (const key of CASE_STUDY_KEYS) {
        const v = getDictionary(locale).caseStudies.items[key].technologies
        expect(splitTechnologies(v).join(', '), `${locale}/${key}`).toBe(v)
      }
    }
  })

  test('the other four case studies split exactly as they did before', () => {
    // pharma1 carries "SAP Cloud ERP (Private)" — parentheses with no separator inside, so
    // the old and new behaviour agree. Asserted so the fix is proven to be scoped.
    for (const locale of LOCALES) {
      for (const key of CASE_STUDY_KEYS) {
        if (key === 'nearshoring1') continue
        const v = getDictionary(locale).caseStudies.items[key].technologies
        expect(splitTechnologies(v), `${locale}/${key}`).toEqual(v.split(', '))
      }
    }
  })

  test('the splitter degrades gracefully on malformed input', () => {
    expect(splitTechnologies('A, B')).toEqual(['A', 'B'])
    expect(splitTechnologies('A (x, y), B')).toEqual(['A (x, y)', 'B'])
    expect(splitTechnologies('A, B)')).toEqual(['A', 'B)'])
    expect(splitTechnologies('A (x, y')).toEqual(['A (x, y'])
    expect(splitTechnologies('A, , B')).toEqual(['A', 'B'])
    expect(splitTechnologies('')).toEqual([])
  })
})

describe('C. facts survived the corrections', () => {
  test('the 12-month metric is still there', () => {
    expect(srText).toContain('u roku od 12 meseci')
  })

  test('module, process and standard names are untouched', () => {
    for (const token of ['F&R', 'O2C', 'P2P', 'VIM', 'SLA', 'GxP', 'ECC', 'SAP IS Retail', 'S/4HANA']) {
      expect(srText.indexOf(token), `${token} must survive`).not.toBe(-1)
    }
  })

  test('every result list still has the same number of entries as English', () => {
    for (const key of CASE_STUDY_KEYS) {
      expect(sr.items[key].results.length, key).toBe(en.items[key].results.length)
      expect(sr.items[key].solutionItems.length, key).toBe(en.items[key].solutionItems.length)
    }
  })
})

describe('D. provenance', () => {
  test('the Serbian case studies are OWNER-APPROVED', () => {
    const src = fs.readFileSync('content/sr/case-studies.ts', 'utf8')
    expect(src).toContain('OWNER-APPROVED')
    expect(src.indexOf('DRAFT — OWNER REVIEW REQUIRED')).toBe(-1)
  })
})
