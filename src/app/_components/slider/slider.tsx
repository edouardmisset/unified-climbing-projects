'use client'

import { Slider } from '@base-ui-components/react/slider'
import styles from './slider.module.css'

export function GradeSlider(props: Slider.Root.Props) {
  return (
    <Slider.Root {...props} className={styles.Root}>
      <Slider.Control className={styles.Control}>
        <Slider.Track className={styles.Track}>
          <Slider.Indicator className={styles.Indicator} />
          <Slider.Thumb className={styles.Thumb} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  )
}
