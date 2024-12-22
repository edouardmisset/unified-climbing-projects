'use client'

import { capitalize } from '@edouardmisset/text'
import { useQueryState } from 'nuqs'
import type { ChangeEventHandler } from 'react'
import { createYearList } from '~/data/ascent-data'
import { ASCENT_STYLE, type Ascent, CLIMBING_DISCIPLINE } from '~/schema/ascent'
import styles from './ascent-filter-bar.module.css'

const allValue = 'all'

export default function AscentsFilterBar({ ascents }: { ascents: Ascent[] }) {
  const yearList = createYearList(ascents)

  const [selectedYear, setSelectedYear] = useQueryState('year', {
    defaultValue: allValue,
  })
  const [selectedStyle, setSelectedStyle] = useQueryState('style', {
    defaultValue: allValue,
  })
  const [selectedDiscipline, setSelectedDiscipline] = useQueryState(
    'discipline',
    {
      defaultValue: allValue,
    },
  )

  const handleYearChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const year = e.target.value
    setSelectedYear(year)
  }
  const handleStyleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const style = e.target.value
    setSelectedStyle(style)
  }
  const handleDisciplineChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const discipline = e.target.value
    setSelectedDiscipline(discipline)
  }

  const allText = capitalize(allValue)
  return (
    <div className={styles.container}>
      <label className="flex-column" htmlFor="year">
        Year
        <select
          id="year"
          title="Year"
          onChange={handleYearChange}
          defaultValue={selectedYear}
        >
          <option value={allValue}>{allText}</option>
          {yearList.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>
      <label className="flex-column" htmlFor="ascentStyle">
        Style
        <select
          id="ascentStyle"
          title="Ascent Style"
          onChange={handleStyleChange}
          defaultValue={selectedStyle}
        >
          <option value={allValue}>{allText}</option>
          {ASCENT_STYLE.map(style => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>
      </label>
      <label className="flex-column" htmlFor="discipline">
        Climbing Discipline
        <select
          id="discipline"
          title="Route, Boulder, or Multi-pitch"
          onChange={handleDisciplineChange}
          defaultValue={selectedDiscipline}
        >
          <option value={allValue}>{allText}</option>
          {CLIMBING_DISCIPLINE.map(discipline => (
            <option key={discipline} value={discipline}>
              {discipline}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
