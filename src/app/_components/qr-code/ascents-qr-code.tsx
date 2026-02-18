'use client'

import { memo } from 'react'
import type { Ascent } from '~/schema/ascent.ts'
import { AscentsQRDot } from './ascents-qr-dot.tsx'
import { QRCode } from './qr-code-base'

type AscentsQRCodeProps = {
  yearlyAscents: Ascent[][]
}

function AscentsQRCodeComponent(props: AscentsQRCodeProps) {
  const { yearlyAscents } = props

  return (
    <QRCode>
      {yearlyAscents.map((ascents, index) => (
        // oxlint-disable-next-line react/no-array-index-key -- fallback index for weeks without data
        <AscentsQRDot ascents={ascents} key={ascents[0]?.date ?? `week-${index}`} />
      ))}
    </QRCode>
  )
}

export const AscentsQRCode = memo(AscentsQRCodeComponent)
