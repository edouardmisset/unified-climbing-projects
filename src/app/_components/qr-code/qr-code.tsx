import Image from 'next/image'
import type { ReactNode } from 'react'
import { Marker } from './marker.tsx'
import climberImagePath from './person-climbing.png'
import styles from './qr-code.module.css'

const gridSize = 25
const imageSize = 9
const _imageStart = (gridSize - imageSize) / 2 + 1 // 9
const _imageEnd = gridSize - imageSize + 2 // 18

export default function QRCode(props: { children?: ReactNode }) {
  const { children } = props

  return (
    <div className={styles.qrcode}>
      {/* Square markers */}
      <Marker placement="TopLeft" />
      <Marker placement="TopRight" />
      <Marker placement="BottomLeft" />

      {/* Image at the center of the QR Code */}
      <Image
        alt="emoji of a person climbing"
        className={styles.image}
        height={120}
        priority={true}
        src={climberImagePath}
        width={120}
      />

      {/* Data */}
      {children}
    </div>
  )
}
