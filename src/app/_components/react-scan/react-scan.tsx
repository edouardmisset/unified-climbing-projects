'use client'

import { scan } from 'react-scan'

import { useEffect } from 'react'

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
