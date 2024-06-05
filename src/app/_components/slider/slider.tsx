import * as Slider from '@radix-ui/react-slider'
import type React from 'react'
import styles from './slider.module.css'

export function GradeSlider(
  props: Slider.SliderProps & React.RefAttributes<HTMLSpanElement>,
): React.JSX.Element {
  return (
    <Slider.Root className={styles.SliderRoot} {...props}>
      <Slider.Track className={styles.SliderTrack}>
        <Slider.Range className={styles.SliderRange} />
      </Slider.Track>
      <Slider.Thumb className={styles.SliderThumb} />
    </Slider.Root>
  )
}
