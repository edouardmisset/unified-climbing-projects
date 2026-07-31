import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerDisciplinePerGrade } from './ascents-per-discipline-per-grade'

const DISCIPLINE_COUNT = 2 // Bouldering + Sport, always exactly these two

describe('ascentsPerDisciplinePerGrade', () => {
  it('renders one bar series per discipline', async () => {
    const screen = await render(<AscentsPerDisciplinePerGrade ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents per Discipline per Grade')).toBeInTheDocument()
    await expect
      .poll(() => container.querySelectorAll('.recharts-bar-rectangles').length)
      .toBe(DISCIPLINE_COUNT)
  })
})
