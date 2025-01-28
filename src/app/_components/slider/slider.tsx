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
import { useMemo } from 'react'
import type { Grade } from '~/schema/ascent'
import { convertGradeToNumber } from './helpers'
import styles from './slider.module.css'

export function GradeSlider(
  props: Omit<SliderProps, 'defaultValue' | 'value'> & {
    defaultValue?: Grade[] | SliderProps['defaultValue']
    value?: Grade[] | SliderProps['value']
  } & React.RefAttributes<HTMLSpanElement>,
) {
  const { name, defaultValue, value, ...otherProps } = props

  const numberDefaultValue = useMemo(
    () => convertGradeToNumber(defaultValue),
    [defaultValue],
  )

  const numberValue = useMemo(() => convertGradeToNumber(value), [value])

  return (
    <Root
      className={styles.SliderRoot}
      {...otherProps}
      value={numberValue}
      defaultValue={numberDefaultValue}
    >
      <Track className={styles.SliderTrack}>
        <Range className={styles.SliderRange} />
      </Track>
      <Thumb className={styles.SliderThumb} aria-label={name} />
    </Root>
  )
}
