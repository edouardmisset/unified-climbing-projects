'use client'

import { useEffect } from 'react'
import { scan } from 'react-scan'

export function ReactScan() {
  useEffect(
    () =>
      scan({
        enabled: true,
      }),
    [],
  )
  // biome-ignore lint/complexity/noUselessFragments: special case for react-scan
  return <></>
}
