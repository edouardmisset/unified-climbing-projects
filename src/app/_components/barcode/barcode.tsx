import type React from 'react'
import type { TemporalDateTime } from '~/types/generic'

export const minBarWidth = 4
export const maxBarWidth = 2.5 * minBarWidth

type Obj = Record<string, unknown>

type MainBarCodeProps<T extends Obj> = {
  data: ((TemporalDateTime & T) | undefined)[][]
}

type BarCodeProps<T extends Obj> = MainBarCodeProps<T> &
  (
    | {
        itemRender: (
          item: ((TemporalDateTime & T) | undefined)[],
          index: number,
        ) => React.JSX.Element
      }
    | { field: keyof T }
  )

export default function Barcode<T extends Obj>(
  props: BarCodeProps<T>,
): React.JSX.Element {
  const { data = [] } = props
  return (
    <div
      className="flex-column center gap"
      style={{
        maxBlockSize: '100%',
        inlineSize: '100%',
      }}
    >
      <div
        className="flex-row space-between"
        style={{
          inlineSize: 'clamp(30ch, 50%, 80ch)',
          background: 'white',

          gap: minBarWidth,

          padding: `3% ${1.5 * minBarWidth}px 4%`,
          aspectRatio: '3 / 2',
        }}
      >
        {'itemRender' in props
          ? data.map(props.itemRender)
          : data.map(elements => (
              <span
                key={elements[0]?.date.weekOfYear}
                style={{
                  backgroundColor: elements[0]?.[props.field]
                    ? 'black'
                    : 'white',
                }}
              />
            ))}
      </div>
    </div>
  )
}
