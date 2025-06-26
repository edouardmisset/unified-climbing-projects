'use client'

import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import {
  ASCENT_STYLE,
  type Ascent,
  AVAILABLE_CLIMBING_DISCIPLINE,
} from '~/schema/ascent'
import { CustomSelect } from '../custom-select/custom-select.tsx'
import { StickyFilterBar } from '../sticky-filter-bar/sticky-filter-bar.tsx'
import { createChangeHandler } from './helpers.ts'

export default function AscentsFilterBar({
  allAscents,
}: {
  allAscents: Ascent[]
}) {
  const yearList = createYearList(allAscents, { descending: true })

  const cragList = [...new Set(allAscents.map(({ crag }) => crag))].sort(
    (a, b) => compareStringsAscending(a, b),
  )

  const {
    selectedYear,
    selectedStyle,
    selectedDiscipline,
    selectedCrag,
    setYear,
    setStyle,
    setDiscipline,
    setCrag,
  } = useAscentsQueryState()

  const handleYearChange = createChangeHandler(setYear)
  const handleStyleChange = createChangeHandler(setStyle)
  const handleDisciplineChange = createChangeHandler(setDiscipline)
  const handleCragChange = createChangeHandler(setCrag)

  return (
    <StickyFilterBar>
      <CustomSelect
        handleChange={handleDisciplineChange}
        name="discipline"
        options={AVAILABLE_CLIMBING_DISCIPLINE}
        selectedOption={selectedDiscipline}
        title="Climbing Discipline"
      />
      <CustomSelect
        handleChange={handleStyleChange}
        name="style"
        options={ASCENT_STYLE}
        selectedOption={selectedStyle}
        title="Ascent Style"
      />
      <CustomSelect
        handleChange={handleYearChange}
        name="year"
        options={yearList}
        selectedOption={selectedYear}
      />
      <CustomSelect
        handleChange={handleCragChange}
        name="crag"
        options={cragList}
        selectedOption={selectedCrag}
      />
    </StickyFilterBar>
  )
}
