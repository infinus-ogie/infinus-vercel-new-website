/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  // tsconfig.json sets `"jsx": "preserve"` for Next.js, which esbuild inherits.
  // Under Vitest that left components without a JSX runtime, so every render()
  // threw `ReferenceError: React is not defined` and the whole suite was dead.
  //
  // Overriding esbuild's JSX mode here (rather than registering
  // @vitejs/plugin-react) keeps the fix dependency-free: the plugin is hoisted to
  // the project root but requires `vite`, which is only installed nested inside
  // vitest, so it cannot resolve its own peer under this .npmrc
  // (legacy-peer-deps=true). 'automatic' uses react/jsx-runtime — no React import
  // needed in test or component files. Does not affect the Next.js build.
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    // Vitest's default `include` glob also matched scripts/qa/*.spec.ts, which are
    // Playwright specs. They failed at collection ("Playwright Test did not expect
    // test.describe() to be called here") and counted as 2 failing suites in every
    // run. Those specs belong to `npm run qa:ga`, not to the unit suite.
    include: ['test/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
