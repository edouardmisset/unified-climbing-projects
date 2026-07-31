import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDiscipline } from './ascents-per-discipline'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

describe('ascentsPerDiscipline', () => {
  it('renders one pie slice per discipline in the real data', async () => {
    const data = getAscentsPerDiscipline(sampleAscents)
    const screen = await render(<AscentsPerDiscipline ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents per Discipline')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-pie-sector').length)
      .toBe(data.length)
  })
})
