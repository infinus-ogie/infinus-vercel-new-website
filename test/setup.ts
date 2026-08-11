import '@testing-library/jest-dom'

/**
 * jsdom does not implement these browser APIs, but components under test use them:
 *
 * - IntersectionObserver — framer-motion's `whileInView` (used across the homepage
 *   sections, GROW pages and Faq) calls it on mount. Without it, rendering any page
 *   containing a `whileInView` motion element throws
 *   `ReferenceError: IntersectionObserver is not defined`.
 * - ResizeObserver — used by Radix primitives and embla-carousel.
 * - matchMedia — `Faq.tsx` reads `prefers-reduced-motion`.
 *
 * These are minimal, inert stubs: they satisfy the API surface so components mount,
 * and deliberately do NOT simulate visibility or resize events. Tests therefore
 * assert on rendered content and DOM structure, never on scroll-triggered animation.
 */

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

class MockResizeObserver implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
