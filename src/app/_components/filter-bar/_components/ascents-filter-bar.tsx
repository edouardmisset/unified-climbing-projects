import { isDateInRange } from '@edouardmisset/date'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import { useEffect, useMemo } from 'react'
import { ALL_VALUE } from '~/app/_components/dashboard/constants'
import { createYearList } from '~/data/helpers.ts'
import { filterAscents } from '~/helpers/filter-ascents'
import { normalizeFilterValue } from '~/helpers/normalize-filter-value'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import { ASCENT_STYLE, type Ascent, AVAILABLE_CLIMBING_DISCIPLINE } from '~/schema/ascent'
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

  const selectedYearNumber = useMemo(() => {
    const n = Number(selectedYear)
    return selectedYear !== ALL_VALUE && isValidNumber(n) ? n : undefined
  }, [selectedYear])

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

  const styleList = useMemo(() => {
    const filteredForStyle = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(selectedCrag),
      area: normalizeFilterValue(selectedArea),
    })
    return ASCENT_STYLE.filter(style => filteredForStyle.some(ascent => ascent.style === style))
  }, [allAscents, selectedYearNumber, selectedDiscipline, selectedPeriod, selectedCrag, selectedArea])

  const cragList = useMemo(() => {
    const filteredForCrag = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      style: normalizeFilterValue(selectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      area: normalizeFilterValue(selectedArea),
    })
    return [...new Set(filteredForCrag.map(({ crag }) => crag.trim()))]
      .filter(Boolean)
      .sort(compareStringsAscending)
  }, [allAscents, selectedYearNumber, selectedDiscipline, selectedStyle, selectedPeriod, selectedArea])

  const areaList = useMemo(() => {
    const filteredForArea = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      style: normalizeFilterValue(selectedStyle),
      period: normalizeFilterValue(selectedPeriod),
      crag: normalizeFilterValue(selectedCrag),
    })
    return [
      ...new Set(
        filteredForArea
          .map(({ area }) => area?.trim())
          .filter((area): area is string => Boolean(area)),
      ),
    ].sort(compareStringsAscending)
  }, [allAscents, selectedYearNumber, selectedDiscipline, selectedStyle, selectedPeriod, selectedCrag])

  const periodList = useMemo(() => {
    const filteredForPeriod = filterAscents(allAscents, {
      year: selectedYearNumber,
      climbingDiscipline: normalizeFilterValue(selectedDiscipline),
      style: normalizeFilterValue(selectedStyle),
      crag: normalizeFilterValue(selectedCrag),
      area: normalizeFilterValue(selectedArea),
    })
    return PERIOD.filter(period =>
      filteredForPeriod.some(({ date }) =>
        isDateInRange(new Date(date), { ...PERIOD_TO_DATES[period] }),
      ),
    )
  }, [allAscents, selectedYearNumber, selectedDiscipline, selectedStyle, selectedCrag, selectedArea])

  useEffect(() => {
    if (selectedYear !== ALL_VALUE && !yearList.includes(selectedYear)) setYear(ALL_VALUE)
  }, [yearList, selectedYear, setYear])

  useEffect(() => {
    if (selectedDiscipline !== ALL_VALUE && !disciplineList.includes(selectedDiscipline))
      setDiscipline(ALL_VALUE)
  }, [disciplineList, selectedDiscipline, setDiscipline])

  useEffect(() => {
    if (selectedStyle !== ALL_VALUE && !styleList.includes(selectedStyle)) setStyle(ALL_VALUE)
  }, [styleList, selectedStyle, setStyle])

  useEffect(() => {
    if (selectedCrag !== ALL_VALUE && !cragList.includes(selectedCrag)) setCrag(ALL_VALUE)
  }, [cragList, selectedCrag, setCrag])

  useEffect(() => {
    if (selectedArea !== ALL_VALUE && !areaList.includes(selectedArea)) setArea(ALL_VALUE)
  }, [areaList, selectedArea, setArea])

  useEffect(() => {
    if (selectedPeriod !== ALL_VALUE && !periodList.includes(selectedPeriod)) setPeriod(ALL_VALUE)
  }, [periodList, selectedPeriod, setPeriod])

  const filters = useMemo<FilterConfig[]>(
    () =>
      [
        {
          setValue: createValueSetter(setDiscipline),
          name: 'Discipline',
          options: disciplineList,
          selectedValue: selectedDiscipline,
          title: 'Climbing Discipline',
        },
        {
          setValue: createValueSetter(setYear),
          name: 'Year',
          options: yearList,
          selectedValue: selectedYear,
          title: 'Year',
        },
        {
          setValue: createValueSetter(setCrag),
          name: 'Crag',
          options: cragList,
          selectedValue: selectedCrag,
          title: 'Crag',
        },
        {
          setValue: createValueSetter(setArea),
          name: 'Area',
          options: areaList,
          selectedValue: selectedArea,
          title: 'Area',
        },
        {
          setValue: createValueSetter(setStyle),
          name: 'Style',
          options: styleList,
          selectedValue: selectedStyle,
          title: 'Ascent Style',
        },
        {
          setValue: createValueSetter(setPeriod),
          name: 'Period',
          options: periodList,
          selectedValue: selectedPeriod,
          title: 'Period',
        },
      ] as const satisfies FilterConfig[],
    [
      areaList,
      cragList,
      disciplineList,
      periodList,
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
