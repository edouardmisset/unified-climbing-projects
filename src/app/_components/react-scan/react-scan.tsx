'use client'

import { useEffect } from 'react'
import { scan } from 'react-scan'

export function ReactScan(): React.JSX.Element {
  useEffect(
    () =>
      scan({
        enabled: true,
      }),
    [],
  )
  return <></>
}
