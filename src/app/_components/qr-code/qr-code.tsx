import Image from 'next/image'
import type React from 'react'
import { cloneElement } from 'react'
import type { StringDate } from '~/types/generic'
import type { QrCodeListProps } from '../generic-qr-code-by-year/generic-qr-code-by-year.tsx'
import Marker from './marker.tsx'
import climberImagePath from './person-climbing.png'
import styles from './qr-code.module.css'

const gridSize = 25
const imageSize = 9
const _imageStart = (gridSize - imageSize) / 2 + 1 // 9
const _imageEnd = gridSize - imageSize + 2 // 18

type QRCodeProps<T extends StringDate> = Pick<
  QrCodeListProps<T>,
  'dotRender'
> & {
  children?: React.JSX.Element
  yearData: (T[] | undefined)[]
}

export default function QRCode<T extends StringDate>(props: QRCodeProps<T>) {
  const { yearData, children, dotRender } = props
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
      {yearData.map(item => dotRender(item))}
    </div>
  )
}
