import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsByStyle } from './ascents-by-style'
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'

describe('ascentsByStyle', () => {
  it('renders one pie slice per style in the real data', async () => {
    const data = getAscentsByStyle(sampleAscents)
    const screen = await render(<AscentsByStyle ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascent By Style')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-pie-sector').length)
      .toBe(data.length)
  })
})
