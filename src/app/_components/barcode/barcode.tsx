import type React from 'react'

import { getWeek } from '~/helpers/date'
import styles from './barcode.module.css'
import type { BarCodeProps, Object_ } from './types'

export default function Barcode<T extends Object_>(
  props: BarCodeProps<T>,
): React.JSX.Element {
  const { data = [] } = props

  return (
    <div className={styles.barcode}>
      {'itemRender' in props
        ? data.map(props.itemRender)
        : data.map((elements, index) => {
            const firstElementDate = elements[0]?.date
            return (
              <span
                key={
                  firstElementDate ? getWeek(new Date(firstElementDate)) : index
                }
                style={{
                  backgroundColor: elements[0]?.[props.field]
                    ? 'black'
                    : 'white',
                }}
              />
            )
          })}
    </div>
  )
}
