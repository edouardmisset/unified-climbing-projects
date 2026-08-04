import { act, renderHook } from '@testing-library/react'
import { NuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vite-plus/test'
import type { Ascent } from '~/schema/ascent'
import type { TrainingSession } from '~/schema/training'
import { useAreaQueryState } from './query-state-slices/use-area-query-state'
import { useLocationTypeQueryState } from './query-state-slices/use-location-type-query-state'
import { useTimeframeQueryState } from './query-state-slices/use-timeframe-query-state'
import { useYearQueryState } from './query-state-slices/use-year-query-state'
import { useAscentsFilter } from './use-ascents-filter'
import { useAscentsQueryState } from './use-ascents-query-state'
import { useTrainingSessionsFilter } from './use-training-sessions-filter'
import { useTrainingSessionsQueryState } from './use-training-sessions-query-state'

function wrapper(searchParams: string, onUrlUpdate?: OnUrlUpdateFunction) {
  return function QueryStateWrapper({ children }: { children: ReactNode }) {
    return (
      <NuqsTestingAdapter hasMemory onUrlUpdate={onUrlUpdate} searchParams={searchParams}>
        {children}
      </NuqsTestingAdapter>
    )
  }
}

const ascents = [
  {
    _id: 'berlin',
    area: 'Berlin Sector',
    crag: 'Céüse',
    date: '2026-08-01',
    discipline: 'Sport',
    grade: '7a',
    name: 'Berlin',
    style: 'Redpoint',
    tries: 2,
  },
  {
    _id: 'other',
    crag: 'Magic Wood',
    date: '2025-08-01',
    discipline: 'Bouldering',
    grade: '7b',
    name: 'Other Problem',
    style: 'Flash',
    tries: 1,
  },
] satisfies Ascent[]

const trainingSessions = [
  {
    _id: 'selected',
    date: '2026-08-01',
    discipline: 'Sport',
    intensity: 90,
    location: 'Test Gym',
    type: 'Power',
    volume: 90,
  },
  {
    _id: 'other',
    date: '2025-08-01',
    discipline: 'Bouldering',
    location: 'Outside',
    type: 'Outdoor',
  },
] satisfies TrainingSession[]

describe('query-state hooks', () => {
  it('parses ascent filters, applies them, and exposes working setters', async () => {
    const queryStrings: string[] = []
    const search =
      '?area=Berlin%20Sector&crag=C%C3%A9%C3%BCse&discipline=Sport&grade=7a&route=ber&style=Redpoint&year=2026'
    const { result } = renderHook(
      () => ({ filtered: useAscentsFilter(ascents), state: useAscentsQueryState() }),
      {
        wrapper: wrapper(search, event => {
          queryStrings.push(event.queryString)
        }),
      },
    )

    expect(result.current.filtered.map(({ _id }) => _id)).toStrictEqual(['berlin'])
    expect(result.current.state).toMatchObject({
      selectedArea: 'Berlin Sector',
      selectedCrag: 'Céüse',
      selectedDiscipline: 'Sport',
      selectedGrade: '7a',
      selectedRoute: 'ber',
      selectedStyle: 'Redpoint',
      selectedYear: '2026',
    })

    act(() => {
      result.current.state.setArea('all')
      result.current.state.setCrag('all')
      result.current.state.setDiscipline('all')
      result.current.state.setGrade('all')
      result.current.state.setPeriod('Road-Trip')
      result.current.state.setRoute('')
      result.current.state.setStyle('all')
      result.current.state.setYear('all')
    })
    await expect.poll(() => queryStrings.length).toBeGreaterThan(0)
  })

  it('parses training filters, applies them, and exposes working setters', async () => {
    const queryStrings: string[] = []
    const search =
      '?discipline=Sport&load=High&location=Test%20Gym&locationType=Indoor&type=Power&year=2026'
    const { result } = renderHook(
      () => ({
        filtered: useTrainingSessionsFilter(trainingSessions),
        state: useTrainingSessionsQueryState(),
      }),
      {
        wrapper: wrapper(search, event => {
          queryStrings.push(event.queryString)
        }),
      },
    )

    expect(result.current.filtered.map(({ _id }) => _id)).toStrictEqual(['selected'])
    expect(result.current.state).toMatchObject({
      selectedDiscipline: 'Sport',
      selectedLoad: 'High',
      selectedLocation: 'Test Gym',
      selectedLocationType: 'Indoor',
      selectedSessionType: 'Power',
      selectedYear: '2026',
    })

    act(() => {
      result.current.state.setDiscipline('all')
      result.current.state.setLoad('all')
      result.current.state.setLocation('all')
      result.current.state.setLocationType('all')
      result.current.state.setPeriod('Unemployment')
      result.current.state.setSessionType('all')
      result.current.state.setYear('all')
    })
    await expect.poll(() => queryStrings.length).toBeGreaterThan(0)
  })

  it('normalizes invalid safe-parser values to their defaults', () => {
    const { result } = renderHook(
      () => ({
        area: useAreaQueryState()[0],
        locationType: useLocationTypeQueryState()[0],
        timeframe: useTimeframeQueryState()[0],
        year: useYearQueryState()[0],
      }),
      { wrapper: wrapper('?area=%20&locationType=Somewhere&timeframe=recent&year=nope') },
    )

    expect(result.current).toStrictEqual({
      area: 'all',
      locationType: 'all',
      timeframe: 'last-12-months',
      year: 'all',
    })
  })
})
