import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsByStyle } from './ascents-by-style'
import { getAscentsByStyle } from '../ascents-by-style/get-ascents-by-style'

describe('ascentsByStyle', () => {
  it('renders the ascent-style donut mark', async () => {
    const data = getAscentsByStyle(sampleAscents)
    const screen = await render(<AscentsByStyle ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascent By Style')).toBeInTheDocument()
    expect(data.length).toBeGreaterThan(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__arc').length).toBe(1)
  })
})
