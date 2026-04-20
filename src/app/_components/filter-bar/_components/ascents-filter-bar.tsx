import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { createYearList } from '~/data/helpers.ts'
import { filterAscents } from '~/helpers/filter-ascents'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { filterAscents } from '~/helpers/filter-ascents'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { ASCENT_STYLE, type Ascent, AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
import { PERIOD, PERIOD_TO_DATES } from '~/schema/generic'
import { PERIOD, PERIOD_TO_DATES } from '~/schema/generic'
import { createValueSetter } from '../helpers'
import { StickyFilterBar } from '../sticky-filter-bar'
import type { FilterConfig } from '../types'

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

  const yearList = useMemo(() => {
    const filteredForYear = filterAscents(allAscents, {
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      style: normalizeFilterValue(selectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(selectedCrag),
      area: normalizeFilterValue(selectedArea),
    })
    return createYearList(filteredForYear, {
      descending: true,
      continuous: false,
    }).map(String)
  }, [allAscents, selectedDiscipline, selectedStyle, selectedPeriod, selectedCrag, selectedArea])

  const effectiveSelectedYear = yearList.includes(selectedYear) ? selectedYear : ALL_VALUE

  const selectedYearNumber = useMemo(() => {
    const n = Number(effectiveSelectedYear)
    return effectiveSelectedYear !== ALL_VALUE && isValidNumber(n) ? n : undefined
  }, [effectiveSelectedYear])

  const disciplineList = useMemo(() => {
    const filteredForDiscipline = filterAscents(allAscents, {
      year: selectedYearNumber,
      style: normalizeFilterValue(selectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(selectedCrag),
      area: normalizeFilterValue(selectedArea),
    })
    return AVAILABLE_CLIMBING_DISCIPLINE.filter(discipline =>
      filteredForDiscipline.some(ascent => ascent.climbingDiscipline === discipline),
    )
  }, [allAscents, selectedYearNumber, selectedStyle, selectedPeriod, selectedCrag, selectedArea])

  const effectiveSelectedDiscipline = disciplineList.includes(selectedDiscipline)
    ? selectedDiscipline
    : ALL_VALUE

  const styleList = useMemo(() => {
    const filteredForStyle = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(selectedCrag),
      area: normalizeFilterValue(selectedArea),
    })
    return ASCENT_STYLE.filter(style => filteredForStyle.some(ascent => ascent.style === style))
  }, [
    allAscents,
    selectedYearNumber,
    effectiveSelectedDiscipline,
    selectedPeriod,
    selectedCrag,
    selectedArea,
  ])

  const effectiveSelectedStyle = styleList.includes(selectedStyle) ? selectedStyle : ALL_VALUE

  const cragList = useMemo(() => {
    const filteredForCrag = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      style: normalizeFilterValue(effectiveSelectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      area: normalizeFilterValue(selectedArea),
    })
    return [...new Set(filteredForCrag.map(({ crag }) => crag.trim()))]
      .filter(Boolean)
      .toSorted(compareStringsAscending)
  }, [
    allAscents,
    selectedYearNumber,
    effectiveSelectedDiscipline,
    effectiveSelectedStyle,
    selectedPeriod,
    selectedArea,
  ])

  const effectiveSelectedCrag = cragList.includes(selectedCrag) ? selectedCrag : ALL_VALUE

  const areaList = useMemo(() => {
    const filteredForArea = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      style: normalizeFilterValue(effectiveSelectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(effectiveSelectedCrag),
    })
    return [
      ...new Set(
        filteredForArea
          .map(({ area }) => area?.trim())
          .filter((area): area is string => Boolean(area)),
      ),
    ].toSorted(compareStringsAscending)
  }, [
    allAscents,
    selectedYearNumber,
    effectiveSelectedDiscipline,
    effectiveSelectedStyle,
    selectedPeriod,
    effectiveSelectedCrag,
  ])

  const effectiveSelectedArea = areaList.includes(selectedArea) ? selectedArea : ALL_VALUE

  const periodList = useMemo(() => {
    const filteredForPeriod = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(effectiveSelectedDiscipline),
      style: normalizeFilterValue(effectiveSelectedStyle),
      crag: normalizeFilterValue(effectiveSelectedCrag),
      area: normalizeFilterValue(effectiveSelectedArea),
    })
    return PERIOD.filter(period =>
      filteredForPeriod.some(({ date }) =>
        isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
      ),
    )
  }, [
    allAscents,
    selectedYearNumber,
    effectiveSelectedDiscipline,
    effectiveSelectedStyle,
    effectiveSelectedCrag,
    effectiveSelectedArea,
  ])

  const effectiveSelectedPeriod = periodList.includes(selectedPeriod) ? selectedPeriod : ALL_VALUE

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
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
      ] as const satisfies FilterConfig[],
    [
      areaList,
      areaList,
      cragList,
      disciplineList,
      effectiveSelectedArea,
      effectiveSelectedCrag,
      effectiveSelectedDiscipline,
      effectiveSelectedPeriod,
      effectiveSelectedStyle,
      effectiveSelectedYear,
      periodList,
      setArea,
      setCrag,
      setDiscipline,
      setPeriod,
      setStyle,
      setYear,
      styleList,
      styleList,
      yearList,
    ],
  )

  return (
    <StickyFilterBar
      filters={filters}
      search={selectedRoute}
      setSearch={setRoute}
      showSearch={showSearch}
    />
  )
}
