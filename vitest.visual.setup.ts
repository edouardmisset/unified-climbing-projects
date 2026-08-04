import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vite-plus/test'

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

beforeEach(() => {
  globalThis.document.documentElement.dataset.colorScheme = 'light'
  const style = globalThis.document.createElement('style')
  style.dataset.visualTest = 'true'
  style.textContent = `
    *, *::before, *::after {
      animation: none !important;
      caret-color: transparent !important;
      transition: none !important;
    }
    body { background: white; font-family: Arial, sans-serif; }
  `
  globalThis.document.head.append(style)
})

afterEach(() => {
  cleanup()
  globalThis.document.querySelector('style[data-visual-test]')?.remove()
})
