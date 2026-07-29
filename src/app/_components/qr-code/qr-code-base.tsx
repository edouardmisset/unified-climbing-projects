'use client'

import Image from 'next/image'
import { memo, type ReactNode } from 'react'
import { Marker } from './marker'
import climberImagePath from './person-climbing.png'
import styles from './qr-code.module.css'

type QRCodeProps = {
  children?: ReactNode
}

function QRCodeComponent(props: QRCodeProps) {
  const { children } = props

  return (
    <div className={styles.qrcode}>
      <Marker placement='TopLeft' />
      <Marker placement='TopRight' />
      <Marker placement='BottomLeft' />
      <Image
        alt='emoji of a person climbing'
        className={styles.image}
        height={120}
        priority
        src={climberImagePath}
        width={120}
      />
      {children}
    </div>
  )
}

export const QRCode = memo(QRCodeComponent)
