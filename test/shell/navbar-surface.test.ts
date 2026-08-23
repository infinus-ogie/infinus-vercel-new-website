/**
 * Guards on the navbar's light/dark surface classification.
 *
 * The navbar is fixed and transparent at the top of the page, so its text treatment has to
 * match whatever is behind it. Getting this wrong is invisible in every automated check
 * except a contrast measurement: the page renders, the tests pass, and the navigation is
 * simply unreadable. That is what happened on four pages before this classification existed.
 *
 * The luminance behind the navbar was measured on every page that renders the shared chrome:
 * the light ones came out at 1.0 (pure white), and the dark-hero ones at 0.011–0.097. Those
 * measurements are the reason for each expectation below.
 *
 * Two directions matter equally, so both are asserted:
 *   · the light pages must stay light — a removal would silently restore white-on-white
 *   · the dark-hero pages must stay dark — a careless addition would wreck sixteen approved
 *     pages at once
 */
import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  DEFAULT_NAVBAR_SURFACE,
  LIGHT_SURFACE_PAGE_IDS,
  NAVBAR_TEXT_ON_DARK,
  NAVBAR_TEXT_ON_LIGHT,
  navbarSurfaceFor,
  navbarTextColorFor,
} from '@/lib/navbar-surface'
import { ROUTE_PAIRS } from '@/content/routes'
import { allLivePaths } from '@/lib/locale-routes'

/**
 * Measured backdrop luminance 1.0 — white text here is invisible.
 *
 * /sr/faq joined the set in Phase H1 WITHOUT a new entry in LIGHT_SURFACE_PAGE_IDS: it
 * inherits the existing `faq` page id, which is the whole point of classifying by identity
 * rather than by path.
 */
// Both Privacy Policy URLs, from ONE page id. That is the payoff of keying the surface on
// page identity: splitting the policy into two routes needed no new entry in
// LIGHT_SURFACE_PAGE_IDS, and neither locale can drift from the other.
const LIGHT_PATHS = [
  '/contact',
  '/sr/contact',
  '/faq',
  '/sr/faq',
  '/privacy',
  '/sr/politika-privatnosti',
  // The Careers pair opens on the form's slate-50 panel, with no hero above it.
  '/careers',
  '/sr/careers',
]

/** Measured backdrop luminance 0.011–0.097 — the approved white-text treatment is correct. */
const DARK_HERO_PATHS = [
  '/',
  // The Serbian homepage renders the same dark hero as `/`.
  '/sr',
  '/grow',
  '/grow/cfo',
  '/grow/ceo',
  '/professional-services',
  '/cfo',
  '/projectpulse',
  '/projectpulse/brochure',
  '/projectpulse/video',
  '/sap-packaged-solutions/sap-starter-package',
  '/case-study/retail1',
  '/case-study/pharma1',
  '/case-study/pharma2',
  '/case-study/nearshoring1',
  '/case-study/manufacturing1',
  // Phase H2: the Serbian case studies render the same dark photographic hero.
  '/sr/case-study/retail1',
  '/sr/case-study/pharma1',
  '/sr/case-study/pharma2',
  '/sr/case-study/nearshoring1',
  '/sr/case-study/manufacturing1',
  // Phase H3: each Serbian product page renders the same dark surface as its English half —
  // /sr/projectpulse the same photographic hero, the brochure the same bg-slate-950 sheet,
  // the video the same full-screen black overlay, the Starter Package the same dark hero.
  // None needed a new entry in LIGHT_SURFACE_PAGE_IDS: they inherit the page id from the
  // route map and fall to the `dark` default, which is what their English halves do.
  '/sr/projectpulse',
  '/sr/projectpulse/brochure',
  '/sr/projectpulse/video',
  '/sr/sap-packaged-solutions/sap-starter-package',
  // Phase H4: both halves of the four GROW pairs render the same ProServicesHero. They inherit
  // `dark` from the page id, so no new entry in LIGHT_SURFACE_PAGE_IDS was needed — the same
  // payoff as the case studies and the Privacy pair.
  //
  // Worth noting what this list survived: the four unprefixed paths listed further up changed
  // LANGUAGE during the GROW migration, and these four /sr paths are new. Not one entry had to
  // be reclassified, because classification keys on the page id, not on the URL or the locale.
  '/sr/grow',
  '/sr/grow/cfo',
  '/sr/grow/ceo',
  '/sr/professional-services',
]

describe('the light-background pages are classified light', () => {
  test('each one resolves to the light surface', () => {
    for (const path of LIGHT_PATHS) {
      expect(navbarSurfaceFor(path), `${path} opens on a white background`).toBe('light')
    }
  })

  test('each pair is classified by ONE page id, so the halves cannot drift', () => {
    // /contact and /sr/contact share the id `contact`; /faq and /sr/faq share `faq`.
    // Classifying by id rather than by path is what guarantees the halves always match —
    // /sr/faq needed no new entry when it went live in Phase H1.
    expect(navbarSurfaceFor('/contact')).toBe(navbarSurfaceFor('/sr/contact'))
    expect(navbarSurfaceFor('/faq')).toBe(navbarSurfaceFor('/sr/faq'))
    expect(LIGHT_SURFACE_PAGE_IDS).toContain('contact')
    expect(LIGHT_SURFACE_PAGE_IDS).toContain('faq')
  })

  test('a Serbian counterpart inherits its surface with no new entry', () => {
    // The regression this guards: someone adding '/sr/faq' as a path-specific exception.
    expect([...LIGHT_SURFACE_PAGE_IDS]).not.toContain('/sr/faq')
    expect(navbarSurfaceFor('/sr/faq')).toBe('light')
  })

  test('each light id names a real page in the route map', () => {
    const ids = ROUTE_PAIRS.map((p) => p.id)
    for (const id of LIGHT_SURFACE_PAGE_IDS) {
      expect(ids, `"${id}" is not a page id in content/routes.ts`).toContain(id)
    }
  })

  test('the light set is exactly these four page ids — no accidental growth', () => {
    // Growing this list must be a deliberate edit with a measured backdrop behind it, not
    // something a new page picks up by resembling an existing one.
    expect([...LIGHT_SURFACE_PAGE_IDS].slice().sort()).toEqual([
      'careers',
      'contact',
      'faq',
      'legal-privacy-policy',
    ])
  })
})

describe('dark-hero pages keep the approved white-text treatment', () => {
  test('every known dark-hero page resolves to the dark surface', () => {
    for (const path of DARK_HERO_PATHS) {
      expect(navbarSurfaceFor(path), `${path} opens behind a dark hero`).toBe('dark')
    }
  })

  test('every live page is either explicitly light or dark, with nothing missed', () => {
    // Catches a new page being added to the route map without anyone deciding its surface:
    // it silently defaults to dark, and this test documents that the set is accounted for.
    const classified = LIGHT_PATHS.concat(DARK_HERO_PATHS).sort()
    expect(allLivePaths().slice().sort()).toEqual(classified)
  })

  test('the light and dark lists do not overlap', () => {
    for (const path of DARK_HERO_PATHS) {
      expect(LIGHT_PATHS, `${path} is in both lists`).not.toContain(path)
    }
  })
})

describe('unclassified paths fall back to the existing behaviour', () => {
  test('the default is dark, so nothing changes appearance by accident', () => {
    expect(DEFAULT_NAVBAR_SURFACE).toBe('dark')
  })

  test('demo, debug, unknown and planned paths are dark', () => {
    for (const path of [
      '/hero-demo',
      '/combined-demo',
      '/services-demo',
      '/debug/visitor-intelligence',
      '/does-not-exist',
      '/sr/projectpulse',
      '/sr/case-study/pharma2',
      '/_not-found',
    ]) {
      expect(navbarSurfaceFor(path), path).toBe('dark')
    }
  })

  test('null, undefined and empty pathnames are handled without throwing', () => {
    expect(navbarSurfaceFor(null)).toBe('dark')
    expect(navbarSurfaceFor(undefined)).toBe('dark')
    expect(navbarSurfaceFor('')).toBe('dark')
  })

  test('a trailing slash classifies the same as the bare path', () => {
    expect(navbarSurfaceFor('/faq/')).toBe('light')
    expect(navbarSurfaceFor('/contact/')).toBe('light')
    expect(navbarSurfaceFor('/grow/')).toBe('dark')
  })
})

describe('classification is explicit, never string-matched', () => {
  test('no substring or prefix rule could capture an unrelated route', () => {
    // A `pathname.includes('contact')` rule would light up these; the id lookup does not.
    for (const path of ['/contacts', '/contact-us', '/faq-archive', '/sr/contact-form', '/grow/contact']) {
      expect(navbarSurfaceFor(path), `${path} must not be classified light`).toBe('dark')
    }
  })

  test('the implementation resolves through the route map, not through string tests', () => {
    const source = readFileSync(join(process.cwd(), 'lib/navbar-surface.ts'), 'utf8')
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    expect(code).toMatch(/pairForPath/)
    expect(code).not.toMatch(/\.includes\(['"`]\//)
    expect(code).not.toMatch(/startsWith\(/)
  })
})

describe('the surface selects an EXISTING navbar state, not a new design', () => {
  test('the two tokens are the ones both navbar components already branch on', () => {
    expect(NAVBAR_TEXT_ON_DARK).toBe('text-white/90')
    expect(NAVBAR_TEXT_ON_LIGHT).toBe('text-slate-900')
    expect(navbarTextColorFor('light')).toBe(NAVBAR_TEXT_ON_LIGHT)
    expect(navbarTextColorFor('dark')).toBe(NAVBAR_TEXT_ON_DARK)

    // Both components key their whole treatment off a comparison against the dark token, so
    // if that string ever drifts the styling silently inverts.
    for (const file of ['components/ui/navbar-demo.tsx', 'components/ui/tubelight-navbar.tsx']) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source, `${file} must compare against ${NAVBAR_TEXT_ON_DARK}`).toContain(
        `textColor === '${NAVBAR_TEXT_ON_DARK}'`
      )
    }
  })

  test('both navbar components consult the surface', () => {
    for (const file of ['components/ui/navbar-demo.tsx', 'components/ui/tubelight-navbar.tsx']) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      expect(source, `${file} must derive its initial state from the surface`).toMatch(
        /navbarSurfaceFor\(pathname\)/
      )
      expect(source).toMatch(/useState\(\(\) => navbarTextColorFor\(surface\)\)/)
    }
  })

  test('the dark-hero scroll thresholds are untouched', () => {
    // G2 fixes the STARTING state only. Changing these would alter approved dark-hero pages,
    // and the homepage's dark-on-dark scroll bug is deliberately left for a later task.
    const demo = readFileSync(join(process.cwd(), 'components/ui/navbar-demo.tsx'), 'utf8')
    const tubelight = readFileSync(join(process.cwd(), 'components/ui/tubelight-navbar.tsx'), 'utf8')
    expect(demo).toContain('scrollY > 600')
    expect(tubelight).toContain('scrollY > 100')
  })

  test('no request-time API leaked into the navbar', () => {
    for (const file of ['components/ui/navbar-demo.tsx', 'components/ui/tubelight-navbar.tsx']) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')
      const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
      expect(code, `${file} must stay statically renderable`).not.toMatch(
        /next\/headers|cookies\(|headers\(/
      )
    }
  })
})
