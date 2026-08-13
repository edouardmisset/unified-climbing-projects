import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDiscipline } from './ascents-per-discipline'
import { getAscentsPerDiscipline } from './get-ascents-per-discipline'

describe('ascentsPerDiscipline', () => {
  it('renders the discipline donut mark', async () => {
    const data = getAscentsPerDiscipline(sampleAscents)
    const screen = await render(<AscentsPerDiscipline ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents per Discipline')).toBeInTheDocument()
    expect(data.length).toBeGreaterThan(1)
    await expect.poll(() => container.querySelectorAll('.ts-chart__arc').length).toBe(1)
  })
})
