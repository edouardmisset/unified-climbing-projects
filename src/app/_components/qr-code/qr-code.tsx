import Image from 'next/image'
import type React from 'react'
import { cloneElement } from 'react'
import type { StringDateTime } from '~/types/generic'
import Marker from './marker.tsx'
import climberImagePath from './person-climbing.png'
import styles from './qr-code.module.css'

const gridSize = 25
const imageSize = 9
const imageStart = (gridSize - imageSize) / 2 + 1 // 9
const imageEnd = gridSize - imageSize + 2 // 18

type Obj = Record<string, unknown>

type MainQRCodeProps<T extends Obj> = {
  data: (StringDateTime & T)[]
  children?: React.JSX.Element
}

type QRCodeProps<T extends Obj> = MainQRCodeProps<T> &
  (
    | {
        itemRender: (item: StringDateTime & T) => React.ReactNode
      }
    | { field: keyof T }
  )

export default async function QRCode<T extends Obj>(props: QRCodeProps<T>) {
  const { data, children } = props
  const image = children ?? (
    <Image
      alt="emoji of a person climbing"
      src={climberImagePath}
      width={120}
      height={120}
      priority={true}
    />
  )
  return (
    <div className={styles.qrcode}>
      {/* Square markers */}
      <Marker placement="TopLeft" />
      <Marker placement="TopRight" />
      <Marker placement="BottomLeft" />

      {/* Image at the center of the QR Code */}
      {cloneElement(image, { className: styles.image })}

      {/* Data */}
      {'itemRender' in props
        ? data.map(props.itemRender)
        : data.map(element => (
            <i
              key={element.date}
              style={{
                backgroundColor: element[props.field] ? 'black' : 'white',
              }}
            />
          ))}
    </div>
  )
}
