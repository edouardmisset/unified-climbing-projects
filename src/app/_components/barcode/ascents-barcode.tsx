'use client'

import { memo } from 'react'
import type { Ascent } from '~/schema/ascent'
import { Barcode } from './barcode-base'
import { AscentsBar } from './ascents-bar'

type AscentsBarcodeProps = {
  yearlyAscents: Ascent[][]
}

function AscentsBarcodeComponent(props: AscentsBarcodeProps) {
  const { yearlyAscents } = props

  if (!yearlyAscents || yearlyAscents.length === 0) return null

  return (
    <Barcode>
      {yearlyAscents.map((ascents, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- fallback index for weeks without data
        <AscentsBar key={ascents[0]?.date ?? `week-${index}`} weeklyAscents={ascents} />
      ))}
    </Barcode>
  )
}

export const AscentsBarcode = memo(AscentsBarcodeComponent)
