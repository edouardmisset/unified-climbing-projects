'use client'

import { NumberField } from '@base-ui-components/react/number-field'
import { MinusIcon, PlusIcon } from 'lucide-react'
import { useId } from 'react'
import { fromNumberToGrade } from '~/helpers/grade-converter'
import { GRADE_TO_NUMBER } from '~/schema/ascent'
import { CursorGrowIcon } from '../svg/cursor-grow/cursor-grow'
import styles from './grade-input.module.css'

const min = Math.min(...Object.values(GRADE_TO_NUMBER))
const max = Math.max(...Object.values(GRADE_TO_NUMBER))

export function GradeInput(props: NumberField.Root.Props & { label?: string }) {
  const { label, onValueChange, value } = props
  const id = useId()

  if (value == null || !onValueChange) {
    console.error('This should be a controlled component')
    return null
  }

  return (
    <NumberField.Root
      {...props}
      id={id}
      className={styles.Field}
      max={max}
      min={min}
    >
      <NumberField.ScrubArea className={styles.ScrubArea}>
        {label ? (
          <label htmlFor={id} className={styles.Label}>
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
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            return onValueChange(value)
          }}
        >
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Input
          className={styles.Input}
          inputMode="text"
          render={props => (
            <input {...props} value={fromNumberToGrade(value)} />
          )}
        />
        <NumberField.Increment
          className={styles.Increment}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()
            e.stopPropagation()
            return onValueChange(value)
          }}
        >
          <PlusIcon />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}
