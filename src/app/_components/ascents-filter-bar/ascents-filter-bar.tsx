import { createYearList } from '~/data/ascent-data'
import type { Ascent } from '~/schema/ascent'
import styles from './ascent-filter-bar.module.css'

export default function AscentsFilterBar({ ascents }: { ascents: Ascent[] }) {
  const years = createYearList(ascents)

  return (
    <div className={styles.container}>
      <select id="year" title="Year">
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}
