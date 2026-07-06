import { GradeTag } from '~/app/_components/ascent-list/grade-tag'
import { fromClimbingDisciplineToEmoji } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import styles from './yearly-top-ten.module.css'

type YearlyTopTenProps = {
  ascents: Ascent[]
  year: number
}

export function YearlyTopTen({ ascents, year }: YearlyTopTenProps) {
  return (
    <section aria-labelledby={`top-ten-${year}`}>
      <h2 className='sectionHeader' id={`top-ten-${year}`}>
        {year}
      </h2>
      <ol className={styles.list}>
        {ascents.map(({ _id, climbingDiscipline, personalGrade, routeName, topoGrade }) => (
          <li key={_id}>
            <span className={styles.item}>
              <span aria-label={climbingDiscipline} title={climbingDiscipline}>
                {fromClimbingDisciplineToEmoji(climbingDiscipline)}
              </span>
              <strong className='ellipsis' title={routeName}>
                {routeName}
              </strong>
              <GradeTag
                climbingDiscipline={climbingDiscipline}
                personalGrade={personalGrade}
                topoGrade={topoGrade}
              />
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
