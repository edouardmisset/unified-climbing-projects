import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { AscentsPerYearByGrade } from './ascents-per-year-by-grade'

describe('ascentsPerYearByGrade', () => {
  it('renders the yearly-grade stacked bar mark', async () => {
    const screen = await render(<AscentsPerYearByGrade ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Ascents Per Year By Grade')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.ts-chart__bar').length).toBe(1)
  })
})
