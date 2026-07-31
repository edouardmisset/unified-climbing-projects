import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { Barcode } from './barcode-base'

describe('barcode', () => {
  it('renders its children', async () => {
    const { container } = await render(
      <Barcode>
        <span>bar</span>
      </Barcode>,
    )

    expect(container.innerHTML).toMatchSnapshot()
  })
})
