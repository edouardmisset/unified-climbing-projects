import { describe, expect, it } from 'vite-plus/test'
import { render } from 'vitest-browser-react'
import { sampleAscents } from '~/testing/sample-data'
import { TriesByGrade } from './tries-by-grade'

const SERIES_COUNT = 3 // min, average, max

describe('triesByGrade', () => {
  it('renders one line per min/average/max series', async () => {
    const screen = await render(<TriesByGrade ascents={sampleAscents} />)
    const { container } = screen

    await expect.element(screen.getByText('Tries by Grade')).toBeInTheDocument()
    await expect.poll(() => container.querySelectorAll('.recharts-line').length).toBe(SERIES_COUNT)
  })
})
