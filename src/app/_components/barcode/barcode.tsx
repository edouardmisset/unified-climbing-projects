import type React from 'react'
import type { StringDateTime } from '~/types/generic'

import { getWeek } from '~/helpers/date'
import styles from './barcode.module.css'

export const minBarWidth = 4
export const maxBarWidth = 2.5 * minBarWidth

type Object_ = Record<string, unknown>

type MainBarCodeProps<T extends Object_> = {
  data: ((StringDateTime & T) | undefined)[][]
}

type BarCodeProps<T extends Object_> = MainBarCodeProps<T> &
  (
    | {
        itemRender: (
          item: ((StringDateTime & T) | undefined)[],
          index: number,
        ) => React.JSX.Element
      }
    | { field: keyof T }
  )

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
