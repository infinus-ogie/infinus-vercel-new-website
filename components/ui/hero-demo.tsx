import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import { getDictionary } from "@/content/dictionary"

/**
 * Internal demo page wrapper for the hero (/hero-demo, robots-blocked).
 *
 * It used to pass `badge`, `title1` and `title2` — props HeroGeometric DECLARED but never
 * used, because the h1 text was hardcoded in its JSX. So this demo has always rendered the
 * real English hero copy, not "Elevate Your Digital Vision".
 *
 * Phase H1 removed those dead props. Passing nothing keeps the default (the English
 * dictionary), so /hero-demo renders exactly what it rendered before.
 */
function DemoHeroGeometric() {
    // English explicitly: an internal demo route, and `trust` has no default any more.
    return <HeroGeometric trust={getDictionary("en").home.trust} />
}

export { DemoHeroGeometric }
