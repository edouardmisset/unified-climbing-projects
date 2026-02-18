'use client'

import { memo } from 'react'
import type { TrainingSession } from '~/schema/training'
import { Barcode } from './barcode-base'
import { TrainingBar } from './training-bar'

type TrainingSessionsBarcodeProps = {
  yearlyTraining: TrainingSession[][]
}

function TrainingSessionsBarcodeComponent(props: TrainingSessionsBarcodeProps) {
  const { yearlyTraining } = props

  if (!yearlyTraining || yearlyTraining.length === 0) return null

  return (
    <Barcode>
      {yearlyTraining.map((sessions, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- fallback index for weeks without data
        <TrainingBar key={sessions[0]?.date ?? `week-${index}`} weeklyTraining={sessions} />
      ))}
    </Barcode>
  )
}

export const TrainingSessionsBarcode = memo(TrainingSessionsBarcodeComponent)
