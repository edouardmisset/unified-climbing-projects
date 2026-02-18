'use client'

import { memo } from 'react'
import type { TrainingSession } from '~/schema/training.ts'
import { QRCode } from './qr-code-base'
import { TrainingsQRDot } from './trainings-qr-dot.tsx'

type TrainingQRCodeProps = {
  yearlyTrainingSessions: TrainingSession[][]
}

function TrainingQRCodeComponent(props: TrainingQRCodeProps) {
  const { yearlyTrainingSessions } = props

  return (
    <QRCode>
      {yearlyTrainingSessions.map((sessions, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- fallback index for weeks without data
        <TrainingsQRDot key={sessions[0]?.date ?? `week-${index}`} trainingSessions={sessions} />
      ))}
    </QRCode>
  )
}

export const TrainingQRCode = memo(TrainingQRCodeComponent)
