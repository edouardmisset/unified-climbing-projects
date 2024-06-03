import { type Temporal } from '@js-temporal/polyfill'
import { cloneElement } from 'react'
import Marker from './marker'

const gridSize = 25
const imageSize = 9
const imageStart = (gridSize - imageSize) / 2 + 1
const imageEnd = gridSize - imageSize + 2

export type TemporalDate = { date: Temporal.PlainDate }

type Obj = Record<string, unknown>

type MainQRCodeProps<T extends Obj> = {
  data: (TemporalDate & T)[]
  children?: JSX.Element
}

type QRCodeProps<T extends Obj> = MainQRCodeProps<T> &
  (
    | {
        itemRender: (item: TemporalDate & T) => JSX.Element
      }
    | { field: keyof T }
  )

export default function QRCode<T extends Obj>(
  props: QRCodeProps<T>,
): JSX.Element {
  const { data, children: image } = props
  return (
    <div
      style={{
        display: 'grid',
        gridTemplate: `repeat(${gridSize}, 1fr) / repeat(${gridSize}, 1fr)`,
        minWidth: 50,
        maxWidth: 400,
        minHeight: 50,
        maxHeight: 400,
        backgroundColor: 'white',
        padding: '1rem',
        marginInline: 'auto',
      }}
    >
      {/* Markers */}
      <Marker placement="TopLeft" />
      <Marker placement="TopRight" />
      <Marker placement="BottomLeft" />

      {/* Image */}
      {image ?
        cloneElement(image, {
          style: {
            gridArea: `${imageStart} / ${imageStart} / ${imageEnd} / ${imageEnd}`,
            height: '100%',
            width: '100%',
            padding: '1rem',
          },
        })
      : undefined}

      {/* Data */}
      {'itemRender' in props ?
        data.map(props.itemRender)
      : data.map((element, i) => (
          <i
            key={i}
            style={{
              backgroundColor: element[props.field] ? 'black' : 'white',
            }}
          />
        ))
      }
    </div>
  )
}
