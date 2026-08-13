import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDisciplinePerGrade } from './ascents-per-discipline-per-grade'

describe('ascentsPerDisciplinePerGrade', () => {
  it('renders the grouped discipline bar mark', async () => {
    const screen = await render(<AscentsPerDisciplinePerGrade ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents per Discipline per Grade')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
