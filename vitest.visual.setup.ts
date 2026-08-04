import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vite-plus/test'
import '@fontsource/atkinson-hyperlegible/400.css'

import '~/styles/sizes.css'
import '~/styles/colors.css'
import '~/styles/animation.css'
import '~/styles/border.css'
import '~/styles/button.css'
import '~/styles/durations.css'
import '~/styles/easing.css'
import '~/styles/fonts.css'
import '~/styles/shadows.css'
import '~/styles/zindex.css'
import '~/styles/climbing-colors.css'
import '~/styles/reset.css'
import '~/styles/utilities.css'

beforeEach(async () => {
  globalThis.document.documentElement.dataset.colorScheme = 'light'
  const style = globalThis.document.createElement('style')
  style.dataset.visualTest = 'true'
  style.textContent = `
    *, *::before, *::after {
      animation: none !important;
      caret-color: transparent !important;
      transition: none !important;
    }
    :root {
      --font-system-ui: 'Atkinson Hyperlegible';
      --font-humanist: 'Atkinson Hyperlegible';
      --font-monospace-code: 'Atkinson Hyperlegible';
      --font-handwritten: 'Atkinson Hyperlegible';
    }
    body { background: white; font-family: 'Atkinson Hyperlegible'; }
  `
  globalThis.document.head.append(style)
  await globalThis.document.fonts.load("16px 'Atkinson Hyperlegible'")
})

afterEach(() => {
  cleanup()
  globalThis.document.querySelector('style[data-visual-test]')?.remove()
})
