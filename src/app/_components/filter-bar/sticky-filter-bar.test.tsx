import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vite-plus/test'
import { StickyFilterBar } from './sticky-filter-bar'

describe('stickyFilterBar', () => {
  it('applies select changes through its public setter', async () => {
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
    expect(setYear).toHaveBeenCalledWith('2026')
    expect(setSearch).not.toHaveBeenCalled()
  })

  it('debounces search changes before calling its public setter', async () => {
    vi.useFakeTimers()
    const setSearch = vi.fn<(value: string) => void>()
    render(<StickyFilterBar filters={[]} search='' setSearch={setSearch} showSearch />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search route' }), {
      target: { value: 'Berlin' },
    })

    expect(setSearch).not.toHaveBeenCalled()
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })
    expect(setSearch).toHaveBeenCalledWith('Berlin')
    vi.useRealTimers()
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

  it('opens the mobile filter sheet from the compact filter control', async () => {
    const user = userEvent.setup()
    render(
      <StickyFilterBar
        filters={[
          {
            name: 'Year',
            options: ['2026'],
            selectedValue: 'all',
            setValue: vi.fn<(value: string) => void>(),
            title: 'Year',
          },
        ]}
        showSearch={false}
      />,
    )

    await user.click(screen.getByLabelText('Open filters'))

    expect(screen.getByRole('dialog', { name: 'Filters' })).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: 'Filters' })).toHaveTextContent('Year')
  })

  it('applies sheet selections immediately and reports active filters', async () => {
    const setYear = vi.fn<(value: string) => void>()
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
        ]}
        search='Berlin'
        setSearch={vi.fn<(value: string) => void>()}
        showSearch
      />,
    )

    expect(screen.getByLabelText('Open filters')).toHaveTextContent('Filters · 2')
    await user.click(screen.getByLabelText('Open filters'))
    await user.selectOptions(within(screen.getByRole('dialog')).getByLabelText('Year'), 'all')

    expect(setYear).toHaveBeenCalledWith('all')
  })

  it('closes the sheet without discarding applied filters', async () => {
    const user = userEvent.setup()
    render(
      <StickyFilterBar
        filters={[
          {
            name: 'Year',
            options: ['2026'],
            selectedValue: '2026',
            setValue: vi.fn<(value: string) => void>(),
            title: 'Year',
          },
        ]}
        showSearch={false}
      />,
    )

    await user.click(screen.getByLabelText('Open filters'))
    await user.click(within(screen.getByRole('dialog')).getByLabelText('Close filters'))

    expect(screen.queryByRole('dialog', { name: 'Filters' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('Open filters')).toHaveTextContent('Filters · 1')
  })
})
