'use client'

// TODO: Replace radix-ui with base-ui
import {
  Range,
  Root,
  type SliderProps,
  Thumb,
  Track,
} from '@radix-ui/react-slider'
import type React from 'react'
import { fromGradeToNumber } from '~/helpers/converters'
import type { Grade } from '~/schema/ascent'
import styles from './slider.module.css'

export function GradeSlider(
  props: Omit<SliderProps, 'defaultValue' | 'value'> & {
    defaultValue?: Grade[] | SliderProps['defaultValue']
    value?: Grade[] | SliderProps['value']
  } & React.RefAttributes<HTMLSpanElement>,
) {
  const { defaultValue, value } = props

  const numberDefaultValue =
    defaultValue === undefined
      ? [0]
      : typeof defaultValue[0] === 'number'
        ? (defaultValue as number[])
        : (defaultValue as Grade[]).map(defaultVal =>
            fromGradeToNumber(defaultVal),
          )

  const numberValue =
    value === undefined
      ? [0]
      : typeof value[0] === 'number'
        ? (value as number[])
        : (value as Grade[]).map(val => fromGradeToNumber(val))

  return (
    <Root
      className={styles.SliderRoot}
      {...props}
      value={numberValue}
      defaultValue={numberDefaultValue}
    >
      <Track className={styles.SliderTrack}>
        <Range className={styles.SliderRange} />
      </Track>
      <Thumb className={styles.SliderThumb} />
    </Root>
  )
}
