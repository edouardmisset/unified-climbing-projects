'use client'

import type { TrainingSession } from '~/schema/training.ts'
import { QRCode } from './qr-code-base'
import { TrainingsQRDot } from './trainings-qr-dot.tsx'

type TrainingQRCodeProps = {
  yearlyTrainingSessions: TrainingSession[][]
}

export function TrainingQRCode(props: TrainingQRCodeProps) {
  const { yearlyTrainingSessions } = props

  return (
    <QRCode>
      {yearlyTrainingSessions.map((sessions, index) => (
        <TrainingsQRDot key={sessions[0]?.date ?? `week-${index}`} trainingSessions={sessions} />
      ))}
    </QRCode>
  )
}
