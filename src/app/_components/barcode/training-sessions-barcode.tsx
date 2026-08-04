'use client'

import type { TrainingSession } from '~/schema/training'
import { Barcode } from './barcode-base'
import { TrainingBar } from './training-bar'

type TrainingSessionsBarcodeProps = {
  yearlyTraining: TrainingSession[][]
}

function TrainingSessionsBarcodeComponent(props: TrainingSessionsBarcodeProps) {
  const { yearlyTraining } = props

  if (yearlyTraining.every(sessions => sessions.length === 0)) return

  return (
    <Barcode>
      {yearlyTraining.map((sessions, index) => (
        <TrainingBar key={sessions[0]?.date ?? `week-${index}`} weeklyTraining={sessions} />
      ))}
    </Barcode>
  )
}

export const TrainingSessionsBarcode = TrainingSessionsBarcodeComponent
