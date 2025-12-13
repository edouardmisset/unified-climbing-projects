import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { StringDate } from '~/types/generic'
import { DataCalendar } from './data-calendar'
import type { DayTransform } from './types'

// Mock YearGrid to avoid complex rendering and focus on DataCalendar logic
vi.mock('../year-grid/year-grid', () => ({
  YearGrid: ({
    dayCollection,
    year,
  }: {
    dayCollection: { content?: { props?: { isLoading?: boolean } } }[]
    year: number
  }) => (
    <div data-testid="year-grid">
      Year: {year}, Entries: {dayCollection.length}
      {dayCollection.some(d => d.content?.props?.isLoading) && (
        <span data-testid="loading-indicator">Loading</span>
      )}
      {dayCollection.length > 0 &&
        dayCollection[0] &&
        !dayCollection[0].content?.props?.isLoading && (
          <span data-testid="data-loaded">Loaded</span>
        )}
    </div>
  ),
}))

const ENTRIES_REGEX = /Entries: 366/

describe('DataCalendar', () => {
  const year = 2024
  const data: StringDate[] = [{ date: '2024-01-01' }]
  const transformDay: DayTransform<StringDate> = ({ date }) => ({
    date,
    content: <div>Day</div>,
  })

  it('renders with synchronous data', () => {
    render(<DataCalendar data={data} transformDay={transformDay} year={year} />)
    expect(screen.getByTestId('year-grid')).toBeInTheDocument()
    expect(screen.getByTestId('data-loaded')).toBeInTheDocument()
  })

  it('renders empty grid when data is undefined', () => {
    render(<DataCalendar year={year} />)
    expect(screen.getByTestId('year-grid')).toBeInTheDocument()
    // Should have entries (empty ones)
    // 2024 is a leap year, so 366 days
    expect(screen.getByText(ENTRIES_REGEX)).toBeInTheDocument()
  })
})
