import { type ComponentProps, useMemo } from 'react'
import { formatGrade } from '~/ascents/helpers/format-grade'
import type { Ascent, Grade } from '~/ascents/schema'
import styles from './display-grade.module.css'

type ClimbingGradeProps = {
  grade: Grade
  climbingDiscipline?: Ascent['climbingDiscipline']
}

export function DisplayGrade(
  props: Omit<ComponentProps<'strong'>, 'children'> & ClimbingGradeProps,
) {
  const { grade, climbingDiscipline = 'Route', className = '', ...otherProps } = props

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
