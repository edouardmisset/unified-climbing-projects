import type React from 'react'

import type { ReactNode } from 'react'
import type { Object_, StringDateTime } from '~/types/generic'
import styles from './barcode.module.css'

export type BarCodeProps<T extends Object_> = {
  data: ((StringDateTime & T) | undefined)[][]
  itemRender: (
    item: ((StringDateTime & T) | undefined)[],
    index: number,
  ) => ReactNode
}

export default function Barcode<T extends Object_>(
  props: BarCodeProps<T>,
): React.JSX.Element {
  const { data = [], itemRender } = props

  return (
    <div className={styles.barcode} role="img">
      {data.map((item, index) => itemRender(item, index))}
    </div>
  )
}
