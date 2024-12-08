'use client'

import { useQueryState } from 'nuqs'
import type { ChangeEventHandler } from 'react'
import { createYearList } from '~/data/ascent-data'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-filter-bar.module.css'

export default function AscentsFilterBar({ ascents }: { ascents: Ascent[] }) {
  const years = createYearList(ascents)
  const [selectedYear, setSelectedYear] = useQueryState('year', {
    defaultValue: 'all',
  })

  const handleChange: ChangeEventHandler<HTMLSelectElement> = e => {
    const year = e.target.value
    setSelectedYear(year)
  }

  return (
    <div className={styles.container}>
      <select
        id="year"
        title="Year"
        onChange={handleChange}
        defaultValue={selectedYear}
      >
        <option value="all">All</option>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}
