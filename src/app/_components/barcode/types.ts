import type { ReactNode } from 'react'
import type { Object_, StringDateTime } from '~/types/generic'

type MainBarCodeProps<T extends Object_> = {
  data: ((StringDateTime & T) | undefined)[][]
}

export type BarCodeProps<T extends Object_> = MainBarCodeProps<T> &
  (
    | {
        itemRender: (
          item: ((StringDateTime & T) | undefined)[],
          index: number,
        ) => ReactNode
      }
    | { field: keyof T }
  )
