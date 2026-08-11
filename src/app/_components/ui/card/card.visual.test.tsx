import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { Card } from './card'

const SUNRISE_COMPLETE_PROPERTIES = {
  '--sun-blur': '0.8rem',
  '--sun-core-stop': '35%',
  '--sun-opacity': '0.2',
  '--sun-position': '30%',
  '--sun-radius': '42%',
}
const VISUAL_STYLE = { padding: '3rem', width: '40rem' }

describe('card visual regression', () => {
  it('matches the resting card baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <Card>
          <h2>Sunrise card</h2>
          <p>The light starts below the horizon.</p>
        </Card>
      </div>,
    )

    await expect.element(screen.getByTestId('visual')).toMatchScreenshot('card-resting.png')
  })

  it('matches the completed sunrise baseline', async () => {
    const screen = await render(
      <div data-testid='visual' style={VISUAL_STYLE}>
        <Card>
          <h2>Sunrise card</h2>
          <p>The light has risen above the horizon.</p>
        </Card>
      </div>,
    )
    const card = globalThis.document.querySelector<HTMLElement>('[data-testid="visual"] > div')

    if (!card) throw new Error('Card visual test fixture did not render a card.')

    const style = globalThis.document.createElement('style')
    style.textContent = `.${card.className}::after { ${Object.entries(SUNRISE_COMPLETE_PROPERTIES)
      .map(([property, value]) => `${property}: ${value}`)
      .join(';')} }`
    globalThis.document.head.append(style)
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => {
        resolve()
      })
    })

    await expect
      .element(screen.getByTestId('visual'))
      .toMatchScreenshot('card-sunrise-complete.png')
    style.remove()
  })
})
