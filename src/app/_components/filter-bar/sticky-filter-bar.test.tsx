import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { StickyFilterBar } from './sticky-filter-bar'

describe('stickyFilterBar', () => {
  it('applies select and search changes through their public setters', async () => {
    const setYear = vi.fn<(value: string) => void>()
    const setSearch = vi.fn<(value: string) => void>()
    const user = userEvent.setup()
    render(
      <StickyFilterBar
        filters={[
          {
            name: 'Year',
            options: ['2025', '2026'],
            selectedValue: 'all',
            setValue: setYear,
            title: 'Year',
          },
        ]}
        search=''
        setSearch={setSearch}
        showSearch
      />,
    )

    await user.selectOptions(screen.getByLabelText('Year'), '2026')
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search route' }), {
      target: { value: 'Berlin' },
    })

    expect(setYear).toHaveBeenCalledWith('2026')
    expect(setSearch).toHaveBeenLastCalledWith('Berlin')
  })

  it('clears every active filter and the search query', async () => {
    const setYear = vi.fn<(value: string) => void>()
    const setStyle = vi.fn<(value: string) => void>()
    const setSearch = vi.fn<(value: string) => void>()
    const user = userEvent.setup()
    render(
      <StickyFilterBar
        filters={[
          {
            name: 'Year',
            options: ['2026'],
            selectedValue: '2026',
            setValue: setYear,
            title: 'Year',
          },
          {
            name: 'Style',
            options: ['Onsight'],
            selectedValue: 'Onsight',
            setValue: setStyle,
            title: 'Style',
          },
        ]}
        search='Berlin'
        setSearch={setSearch}
        showSearch
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    expect(setYear).toHaveBeenCalledWith('all')
    expect(setStyle).toHaveBeenCalledWith('all')
    expect(setSearch).toHaveBeenCalledWith('')
  })

  it('hides unavailable filters and disables reset when nothing is active', () => {
    render(
      <StickyFilterBar
        filters={[
          {
            name: 'Area',
            options: [],
            selectedValue: 'all',
            setValue: vi.fn<(value: string) => void>(),
            title: 'Area',
          },
        ]}
        showSearch={false}
      />,
    )

    expect(screen.queryByLabelText('Area')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeDisabled()
  })
})
