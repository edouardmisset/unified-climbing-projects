import { type CSSProperties } from 'react'
import { formatGrade } from '~/ascents/helpers/format-grade'
import { gradeToClassName } from '~/shared/helpers/formatters'
import type { Ascent } from '~/ascents/schema'
import { DisplayGrade } from '~/shared/components/climbing/display-grade/display-grade'
import styles from './grade-tag.module.css'

type GradeTagProps = Pick<Ascent, 'topoGrade' | 'personalGrade'> &
  Partial<Pick<Ascent, 'climbingDiscipline'>>

type GradeTagStyle = CSSProperties & {
  '--color': string
}

export function GradeTag({
  topoGrade,
  personalGrade,
  climbingDiscipline = 'Route',
}: GradeTagProps) {
  const formattedTopoGrade = formatGrade({
    climbingDiscipline,
    grade: topoGrade,
  })

  const hasDifferentPersonalGrade = personalGrade !== undefined && personalGrade !== topoGrade

  return (
    <em
      title={`Topo Grade: ${formattedTopoGrade}${hasDifferentPersonalGrade ? ` | Personal Grade: ${formatGrade({ climbingDiscipline, grade: personalGrade })}` : ''}`}
      className={`${styles.gradeEM} monospace`}
    >
      <span
        className={`${styles.gradeCell}`}
        style={
          {
            '--color': `var(--${gradeToClassName(topoGrade)})`,
          } as GradeTagStyle
        }
      >
        {formattedTopoGrade}
      </span>

      {hasDifferentPersonalGrade ? (
        <span className={styles.personalGrade}>
          <DisplayGrade climbingDiscipline={climbingDiscipline} grade={personalGrade} />
        </span>
      ) : undefined}
    </em>
  )
}
