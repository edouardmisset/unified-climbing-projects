import * as Slider from '@radix-ui/react-slider'
import type React from 'react'
import styles from './slider.module.css'
import type { Grade } from '~/types/ascent'
import { convertGradeToNumber } from '~/helpers/converter'

export function GradeSlider(
  props: Omit<Slider.SliderProps, 'defaultValue' | 'value'> & {
    defaultValue?: Grade[] | Slider.SliderProps['defaultValue']
    value?: Grade[] | Slider.SliderProps['value']
  } & React.RefAttributes<HTMLSpanElement>,
): React.JSX.Element {
  const { defaultValue, value } = props

  const numberDefaultValue =
    defaultValue === undefined ? [0]
    : typeof defaultValue[0] === 'number' ? (defaultValue as number[])
    : (defaultValue as Grade[]).map(df => convertGradeToNumber(df))

  const numberValue =
    value === undefined ? [0]
    : typeof value[0] === 'number' ? (value as number[])
    : (value as Grade[]).map(df => convertGradeToNumber(df))

  return (
    <Slider.Root
      className={styles.SliderRoot}
      {...props}
      value={numberValue}
      defaultValue={numberDefaultValue}
    >
      <Slider.Track className={styles.SliderTrack}>
        <Slider.Range className={styles.SliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.SliderThumb} />
    </Slider.Root>
  )
}
