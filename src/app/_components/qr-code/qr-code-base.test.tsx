import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { QRCode } from './qr-code-base'

describe('qrCode', () => {
  it('renders the corner markers, the climber image, and its children', async () => {
    const { container } = await render(
      <QRCode>
        <span>dot</span>
      </QRCode>,
    )

    expect(container.innerHTML).toMatchSnapshot()
  })
})
