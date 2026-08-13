import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { TopTenEvolution } from './top-ten-evolution'

describe('topTenEvolution', () => {
  it('renders the discipline bars and the score line', async () => {
    const screen = await render(<TopTenEvolution ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Top Ten Evolution')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__line').length).toBe(1)
  })
})
