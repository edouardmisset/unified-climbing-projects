import { type ComponentProps, useMemo } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import { climbingDisciplineSchema } from '~/schema/ascent'
import type { Ascent, Grade } from '~/schema/ascent'
import styles from './display-grade.module.css'

const DEFAULT_CLIMBING_DISCIPLINE = climbingDisciplineSchema.parse('Route')

type ClimbingGradeProps = {
  grade: Grade
  climbingDiscipline?: Ascent['climbingDiscipline']
}

export function DisplayGrade(
  props: Omit<ComponentProps<'strong'>, 'children'> & ClimbingGradeProps,
) {
  const { grade, climbingDiscipline = DEFAULT_CLIMBING_DISCIPLINE, className = '', ...otherProps } = props

  const formattedGrade = useMemo(
    () => formatGrade({ grade, climbingDiscipline }),
    [grade, climbingDiscipline],
  )

  return (
    <strong {...otherProps} className={`${styles.grade} ${className}`}>
      {formattedGrade}
    </strong>
  )
}
