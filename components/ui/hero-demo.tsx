import { HeroGeometric } from "@/components/ui/shape-landing-hero"

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
    return <HeroGeometric />
}

export { DemoHeroGeometric }
