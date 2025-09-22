'use client'

import { NumberField } from '@base-ui-components/react/number-field'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useId } from 'react'
import { fromNumberToGrade } from '~/helpers/grade-converter'
import { GRADE_TO_NUMBER } from '~/schema/ascent'
import { CursorGrowIcon } from '../svg/cursor-grow/cursor-grow'
import styles from './grade-input.module.css'

const globalMinGrade = Math.min(...Object.values(GRADE_TO_NUMBER))
const globalMaxGrade = Math.max(...Object.values(GRADE_TO_NUMBER))

export function GradeInput(
  props: NumberField.Root.Props & {
    label?: string
    gradeType?: 'Personal' | 'Topo'
  },
) {
  const {
    label,
    onValueChange,
    value,
    gradeType = 'Topo',
    min = globalMinGrade,
    max = globalMaxGrade,
    ...rest
  } = props
  const id = useId()

  if (value == null || !onValueChange) {
    console.error('This should be a controlled component')
    return null
  }

  return (
    <NumberField.Root
      {...rest}
      className={styles.Field}
      id={id}
      max={max}
      min={min}
      onValueChange={onValueChange}
      value={value}
    >
      <NumberField.ScrubArea className={styles.ScrubArea}>
        {label ? (
          <label className={styles.Label} htmlFor={id}>
            {label}
          </label>
        ) : null}
        <NumberField.ScrubAreaCursor className={styles.ScrubAreaCursor}>
          <CursorGrowIcon />
        </NumberField.ScrubAreaCursor>
      </NumberField.ScrubArea>

      <NumberField.Group className={styles.Group}>
        <NumberField.Decrement
          className={styles.Decrement}
          title="Decrease grade (-)"
        >
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input
          className={styles.Input}
          inputMode="text"
          render={props => (
            <input {...props} value={fromNumberToGrade(value)} />
          )}
          title={`The ${gradeType.toLocaleLowerCase()} grade of the ascent`}
        />
        <NumberField.Increment
          className={styles.Increment}
          title="Increase grade (+)"
        >
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}
