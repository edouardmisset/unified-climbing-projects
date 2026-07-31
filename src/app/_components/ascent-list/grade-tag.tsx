import type { CSSProperties } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import { gradeToClassName } from '~/helpers/formatters'
import type { Ascent } from '~/schema/ascent'
import { DisplayGrade } from '../climbing/display-grade/display-grade'
import styles from './grade-tag.module.css'

type GradeTagProps = Pick<Ascent, 'grade' | 'personalGrade'> & Partial<Pick<Ascent, 'discipline'>>

type GradeTagStyle = CSSProperties & {
  '--color': string
}

export function GradeTag({ grade, personalGrade, discipline = 'Sport' }: GradeTagProps) {
  const formattedTopoGrade = formatGrade({
    discipline,
    grade,
  })

  const hasDifferentPersonalGrade = personalGrade !== undefined && personalGrade !== grade

  return (
    <em
      title={`Topo Grade: ${formattedTopoGrade}${hasDifferentPersonalGrade ? ` | Personal Grade: ${formatGrade({ discipline, grade: personalGrade })}` : ''}`}
      className={`${styles.gradeEM} monospace`}
    >
      <span
        className={`${styles.gradeCell}`}
        style={
          {
            '--color': `var(--${gradeToClassName(grade)})`,
          } as GradeTagStyle
        }
      >
        {formattedTopoGrade}
      </span>

      {hasDifferentPersonalGrade ? (
        <span className={styles.personalGrade}>
          <DisplayGrade discipline={discipline} grade={personalGrade} />
        </span>
      ) : undefined}
    </em>
  )
}
