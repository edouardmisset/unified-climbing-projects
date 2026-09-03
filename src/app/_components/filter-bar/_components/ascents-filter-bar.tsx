import type { AscentFilterFacets } from '~/helpers/derive-ascent-filter-model'
import { getEffectiveFilterValue } from '~/helpers/get-effective-filter-value'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import { createDateFilter } from '../date-filter'
import type { FilterConfig } from '../types'

export default function AscentsFilterBar({
  facets,
  showSearch,
}: {
  facets: AscentFilterFacets
  showSearch: boolean
}) {
  const {
    selectedArea,
    selectedCrag,
    selectedDiscipline,
    selectedPeriod,
    selectedStyle,
    selectedYear,
    setArea,
    setCrag,
    setDiscipline,
    setPeriod,
    setStyle,
    setYear,
    selectedRoute,
    setRoute,
  } = useAscentsQueryState()

  const effectiveSelectedDiscipline = getEffectiveFilterValue(
    facets.disciplines,
    selectedDiscipline,
  )
  const effectiveSelectedStyle = getEffectiveFilterValue(facets.styles, selectedStyle)
  const effectiveSelectedCrag = getEffectiveFilterValue(facets.crags, selectedCrag)
  const effectiveSelectedArea = getEffectiveFilterValue(facets.areas, selectedArea)

  const filters = [
    {
      setValue: createValueSetter(setDiscipline),
      name: 'Discipline',
      options: facets.disciplines,
      selectedValue: effectiveSelectedDiscipline,
      title: 'Climbing Discipline',
    },
    createDateFilter({
      years: facets.years,
      selectedYear,
      selectedPeriod,
      setYear: createValueSetter(setYear),
      setPeriod: createValueSetter(setPeriod),
    }),
    {
      setValue: createValueSetter(setCrag),
      name: 'Crag',
      options: facets.crags,
      selectedValue: effectiveSelectedCrag,
      title: 'Crag',
    },
    {
      setValue: createValueSetter(setArea),
      name: 'Area',
      options: facets.areas,
      selectedValue: effectiveSelectedArea,
      title: 'Area',
    },
    {
      setValue: createValueSetter(setStyle),
      name: 'Style',
      options: facets.styles,
      selectedValue: effectiveSelectedStyle,
      title: 'Ascent Style',
    },
  ] as const satisfies FilterConfig[]

  return (
    <StickyFilterBar
      filters={filters}
      search={selectedRoute}
      setSearch={setRoute}
      showSearch={showSearch}
    />
  )
}
