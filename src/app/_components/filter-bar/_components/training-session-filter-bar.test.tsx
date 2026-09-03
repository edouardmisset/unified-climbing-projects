import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import type { TrainingSession } from '~/schema/training'
import { TrainingSessionFilterBar } from './training-session-filter-bar'

function wrapper(searchParams: string, onUrlUpdate: OnUrlUpdateFunction) {
  return function QueryStateWrapper({ children }: { children: ReactNode }) {
    return (
      <NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate} searchParams={searchParams}>
        {children}
      </NuqsTestingAdapter>
    )
  }
}

const trainingSessions = [
  { _id: 'recent', date: '2026-08-01', discipline: 'Sport', type: 'Power' },
  { _id: 'road-trip', date: '2025-01-15', discipline: 'Bouldering', type: 'Outdoor' },
] satisfies TrainingSession[]

function renderDateFilterBar(searchParams: string) {
  const queryStrings: string[] = []
  render(<TrainingSessionFilterBar trainingSessions={trainingSessions} />, {
    wrapper: wrapper(searchParams, event => {
      queryStrings.push(event.queryString)
    }),
  })

  return queryStrings
}

describe('trainingSessionFilterBar date filter', () => {
  it('replaces a year with the selected period and keeps unrelated params', async () => {
    const user = userEvent.setup()
    const queryStrings = renderDateFilterBar('?discipline=Sport&year=2026')

    await user.selectOptions(screen.getByLabelText('Date'), 'Road-Trip')

    await expect.poll(() => queryStrings.at(-1)).toContain('period=Road-Trip')
    expect(queryStrings.at(-1)).not.toContain('year=')
    expect(queryStrings.at(-1)).toContain('discipline=Sport')
  })

  it('replaces a period with the selected year and keeps unrelated params', async () => {
    const user = userEvent.setup()
    const queryStrings = renderDateFilterBar('?discipline=Sport&period=Road-Trip')

    await user.selectOptions(screen.getByLabelText('Date'), '2026')

    await expect.poll(() => queryStrings.at(-1)).toContain('year=2026')
    expect(queryStrings.at(-1)).not.toContain('period=')
    expect(queryStrings.at(-1)).toContain('discipline=Sport')
  })

  it('clears both keys when the filters are reset', async () => {
    const user = userEvent.setup()
    const queryStrings = renderDateFilterBar('?discipline=Sport&period=Road-Trip')

    await user.click(screen.getByRole('button', { name: 'Clear filters' }))

    await expect.poll(() => queryStrings.at(-1)).toContain('discipline=Sport')
    expect(queryStrings.at(-1)).not.toContain('period=')
    expect(queryStrings.at(-1)).not.toContain('year=')
  })
})
