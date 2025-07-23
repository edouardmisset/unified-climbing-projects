import type { ComponentProps } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import type { Ascent, Grade } from '~/schema/ascent'
import styles from './display-grade.module.css'

interface ClimbingGradeProps {
  grade: Grade
  climbingDiscipline?: Ascent['climbingDiscipline']
}

export function DisplayGrade(
  props: ComponentProps<'strong'> & ClimbingGradeProps,
) {
  const {
    grade,
    climbingDiscipline = 'Route',
    className = '',
    ...otherProps
  } = props

  const formattedGrade = formatGrade({ grade, climbingDiscipline })

  return (
    <strong {...otherProps} className={`${styles.grade} ${className}`}>
      {formattedGrade}
    </strong>
  )
}
