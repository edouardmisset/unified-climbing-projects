import { type ComponentProps, useMemo } from 'react'
import { formatGrade } from '~/helpers/format-grade'
import type { Ascent, Grade } from '~/schema/ascent'
import styles from './display-grade.module.css'

interface ClimbingGradeProps {
  grade: Grade
  discipline?: Ascent['discipline']
}

export function DisplayGrade(
  props: Omit<ComponentProps<'strong'>, 'children'> & ClimbingGradeProps,
) {
  const { grade, discipline = 'Sport', className = '', ...otherProps } = props

  const formattedGrade = useMemo(
    () => formatGrade({ grade, discipline: discipline }),
    [grade, discipline],
  )

  return (
    <strong {...otherProps} className={`${styles.grade} ${className}`}>
      {formattedGrade}
    </strong>
  )
}
