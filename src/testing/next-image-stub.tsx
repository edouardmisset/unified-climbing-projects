import type { ComponentProps } from 'react'

/**
 * Stand-in for `next/image` in the browser-mode component tests: real
 * `next/image` reads Node-only globals at import time and its CJS/ESM interop
 * breaks under real-browser bundling, and it isn't itself under test here.
 * Swapped in for the "components" vitest project via a `resolve.alias` in
 * vite.config.ts.
 */
type ImageProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
  alt: string
  priority?: boolean
  src: unknown
}

export default function Image({ alt, priority: _priority, src, ...props }: ImageProps) {
  // oxlint-disable-next-line next/no-img-element -- test-only stand-in for next/image itself
  return <img alt={alt} {...props} src={typeof src === 'string' ? src : ''} />
}
