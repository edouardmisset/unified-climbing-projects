import { type CSSProperties } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import { gradeToClassName } from '~/helpers/formatters'
import { climbingDisciplineSchema } from '~/schema/ascent'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './grade-tag.module.css'

const DEFAULT_CLIMBING_DISCIPLINE = climbingDisciplineSchema.parse('Route')

type GradeTagProps = Pick<Ascent, 'topoGrade' | 'personalGrade'> &
  Partial<Pick<Ascent, 'climbingDiscipline'>>

type GradeTagStyle = CSSProperties & {
  '--color': string
}

export function GradeTag({
  topoGrade,
  personalGrade,
  climbingDiscipline = DEFAULT_CLIMBING_DISCIPLINE,
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
