import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math'

import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { createYearList } from '~/data/helpers.ts'
import { filterAscents } from '~/helpers/filter-ascents'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { ASCENT_STYLE, AVAILABLE_CLIMBING_DISCIPLINE, type Ascent } from '~/schema/ascent'
import { PERIOD, PERIOD_TO_DATES } from '~/schema/generic'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import type { FilterConfig } from '../types'

// Each branch derives one dependent option list; extraction would separate the dependency chain.
// fallow-ignore-next-line complexity
export default function AscentsFilterBar({
  allAscents,
  showSearch,
}: {
  allAscents: Ascent[]
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

  const filteredForYear = filterAscents(allAscents, {
    discipline: normalizeFilterValue(selectedDiscipline),
    style: normalizeFilterValue(selectedStyle),
    period: normalizeFilterValue(selectedPeriod),
    crag: normalizeFilterValue(selectedCrag),
    area: normalizeFilterValue(selectedArea),
  })
  const yearList = createYearList(filteredForYear, { descending: true, continuous: false }).map(
    String,
  )

  const effectiveSelectedYear = yearList.includes(selectedYear) ? selectedYear : ALL_VALUE

  const parsedSelectedYear = Number(effectiveSelectedYear)
  const selectedYearNumber =
    effectiveSelectedYear !== ALL_VALUE && isValidNumber(parsedSelectedYear)
      ? parsedSelectedYear
      : undefined

  const filteredForDiscipline = filterAscents(allAscents, {
    year: selectedYearNumber,
    style: normalizeFilterValue(selectedStyle),
    period: normalizeFilterValue(selectedPeriod),
    crag: normalizeFilterValue(selectedCrag),
    area: normalizeFilterValue(selectedArea),
  })
  const disciplineList = AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
    filteredForDiscipline.some(ascent => ascent.discipline === discipline),
  )

  const effectiveSelectedDiscipline = disciplineList.includes(selectedDiscipline)
    ? selectedDiscipline
    : ALL_VALUE

  const filteredForStyle = filterAscents(allAscents, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    period: normalizeFilterValue(selectedPeriod),
    crag: normalizeFilterValue(selectedCrag),
    area: normalizeFilterValue(selectedArea),
  })
  const styleList = ASCENT_STYLE.filter(style =>
    filteredForStyle.some(ascent => ascent.style === style),
  )

  const effectiveSelectedStyle = styleList.includes(selectedStyle) ? selectedStyle : ALL_VALUE

  const filteredForCrag = filterAscents(allAscents, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    style: normalizeFilterValue(effectiveSelectedStyle),
    period: normalizeFilterValue(selectedPeriod),
    area: normalizeFilterValue(selectedArea),
  })
  const cragList = [...new Set(filteredForCrag.map(({ crag }) => crag.trim()))]
    .filter(Boolean)
    .toSorted(compareStringsAscending)

  const effectiveSelectedCrag = cragList.includes(selectedCrag) ? selectedCrag : ALL_VALUE

  const filteredForArea = filterAscents(allAscents, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    style: normalizeFilterValue(effectiveSelectedStyle),
    period: normalizeFilterValue(selectedPeriod),
    crag: normalizeFilterValue(effectiveSelectedCrag),
  })
  const areaList = [
    ...new Set(
      filteredForArea
        .map(({ area }) => area?.trim())
        .filter((area): area is string => Boolean(area)),
    ),
  ].toSorted(compareStringsAscending)

  const effectiveSelectedArea = areaList.includes(selectedArea) ? selectedArea : ALL_VALUE

  const filteredForPeriod = filterAscents(allAscents, {
    year: selectedYearNumber,
    discipline: normalizeFilterValue(effectiveSelectedDiscipline),
    style: normalizeFilterValue(effectiveSelectedStyle),
    crag: normalizeFilterValue(effectiveSelectedCrag),
    area: normalizeFilterValue(effectiveSelectedArea),
  })
  const periodList = PERIOD.filter(period =>
    filteredForPeriod.some(({ date }) =>
      isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
    ),
  )

  const effectiveSelectedPeriod = periodList.includes(selectedPeriod) ? selectedPeriod : ALL_VALUE

  const filters = [
    {
      setValue: createValueSetter(setDiscipline),
      name: 'Discipline',
      options: disciplineList,
      selectedValue: effectiveSelectedDiscipline,
      title: 'Climbing Discipline',
    },
    {
      setValue: createValueSetter(setYear),
      name: 'Year',
      options: yearList,
      selectedValue: effectiveSelectedYear,
      title: 'Year',
    },
    {
      setValue: createValueSetter(setCrag),
      name: 'Crag',
      options: cragList,
      selectedValue: effectiveSelectedCrag,
      title: 'Crag',
    },
    {
      setValue: createValueSetter(setArea),
      name: 'Area',
      options: areaList,
      selectedValue: effectiveSelectedArea,
      title: 'Area',
    },
    {
      setValue: createValueSetter(setStyle),
      name: 'Style',
      options: styleList,
      selectedValue: effectiveSelectedStyle,
      title: 'Ascent Style',
    },
    {
      setValue: createValueSetter(setPeriod),
      name: 'Period',
      options: periodList,
      selectedValue: effectiveSelectedPeriod,
      title: 'Period',
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
