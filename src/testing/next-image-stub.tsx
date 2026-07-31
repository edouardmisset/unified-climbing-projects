/**
 * Stand-in for `next/image` in the browser-mode component tests: real
 * `next/image` reads Node-only globals at import time and its CJS/ESM interop
 * breaks under real-browser bundling, and it isn't itself under test here.
 * Swapped in for the "components" vitest project via a `resolve.alias` in
 * vite.config.ts.
 */
export default function Image({ alt, src }: { alt: string; src: unknown }) {
  // oxlint-disable-next-line next/no-img-element -- test-only stand-in for next/image itself
  return <img alt={alt} src={typeof src === 'string' ? src : ''} />
}
