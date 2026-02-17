'use client'

import Image from 'next/image'
import { memo, type ReactNode } from 'react'
import type { Ascent } from '~/schema/ascent.ts'
import type { TrainingSession } from '~/schema/training.ts'
import { AscentsQRDot } from './ascents-qr-dot.tsx'
import { Marker } from './marker.tsx'
import climberImagePath from './person-climbing.png'
import styles from './qr-code.module.css'
import { TrainingsQRDot } from './trainings-qr-dot.tsx'

const gridSize = 25
const imageSize = 9
const _imageStart = (gridSize - imageSize) / 2 + 1 // 9
const _imageEnd = gridSize - imageSize + 2 // 18

const QRCode = memo((props: { children?: ReactNode }) => {
  const { children } = props

  return (
    <div className={styles.qrcode}>
      {/* Square markers */}
      <Marker placement='TopLeft' />
      <Marker placement='TopRight' />
      <Marker placement='BottomLeft' />

      {/* Image at the center of the QR Code */}
      <Image
        alt='emoji of a person climbing'
        className={styles.image}
        height={120}
        priority
        src={climberImagePath}
        width={120}
      />

      {/* Data (= the dots) */}
      {children}
    </div>
  )
})

export const TrainingQRCode = memo(
  ({ yearlyTrainingSessions }: { yearlyTrainingSessions: TrainingSession[][] }) => (
    <QRCode>
      {yearlyTrainingSessions.map((sessions, index) => (
        <TrainingsQRDot key={sessions[0]?.date ?? index} trainingSessions={sessions} />
      ))}
    </QRCode>
  ),
)

export const AscentsQRCode = memo(({ yearlyAscents }: { yearlyAscents: Ascent[][] }) => (
  <QRCode>
    {yearlyAscents.map((ascents, index) => (
      <AscentsQRDot ascents={ascents} key={ascents[0]?.date ?? index} />
    ))}
  </QRCode>
))
