'use client'

import { createYearList } from '~/data/helpers.ts'
import { compareStringsAscending } from '~/helpers/sort-strings.ts'
import { useAscentsQueryState } from '~/hooks/use-ascents-query-state.ts'
import {
  ASCENT_STYLE,
  AVAILABLE_CLIMBING_DISCIPLINE,
  type Ascent,
} from '~/schema/ascent'
import { CustomSelect } from '../custom-select/custom-select.tsx'
import styles from './ascent-filter-bar.module.css'
import { createChangeHandler } from './helpers.ts'

export default function AscentsFilterBar({
  allAscents,
}: { allAscents: Ascent[] }) {
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
    <search className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.backdropEdge} />
      <div className={styles.filters}>
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
      </div>
    </search>
  )
}
