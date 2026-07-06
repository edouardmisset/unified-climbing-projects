import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Ascent } from '~/schema/ascent'
import { YearlyTopTen } from './yearly-top-ten'

const ascents: Ascent[] = [
  {
    _id: 'route',
    climbingDiscipline: 'Route',
    comments: '',
    crag: 'Buoux',
    date: '2025-01-10',
    routeName: 'La rose et le vampire',
    style: 'Redpoint',
    topoGrade: '8b',
    tries: 2,
  },
  {
    _id: 'boulder',
    climbingDiscipline: 'Boulder',
    comments: '',
    crag: 'Fontainebleau',
    date: '2025-02-10',
    routeName: 'Karma',
    style: 'Redpoint',
    topoGrade: '8a+',
    tries: 3,
  },
]

describe('YearlyTopTen', () => {
  it('renders a minimal ordered list for the year', () => {
    render(<YearlyTopTen ascents={ascents} year={2_025} />)

    expect(screen.getByRole('heading', { name: '2025' })).toBeInTheDocument()
    const list = screen.getByRole('list')
    expect(within(list).getAllByRole('listitem')).toHaveLength(2)
    expect(within(list).getByText('La rose et le vampire')).toBeInTheDocument()
    expect(within(list).getByText('Karma')).toBeInTheDocument()
    expect(within(list).getByText('8b')).toBeInTheDocument()
    expect(within(list).getByText('8A+')).toBeInTheDocument()
  })
})
