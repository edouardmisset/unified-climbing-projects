'use client'

import NumberFlow, { NumberFlowGroup } from '@number-flow/react'
import { useEffect, useState } from 'react'

const spinTiming: EffectTiming = {
  duration: 800,
}
const delay = 1000

export function AscentsAndDays({
  numberOfAscents,
  numberOfDays,
}: {
  numberOfAscents: number
  numberOfDays: number
}) {
  const [ascents, setAscents] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAscents(() => numberOfAscents)
    }, delay)
    return () => clearInterval(interval)
  }, [numberOfAscents])

  const [days, setDays] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDays(() => numberOfDays)
    }, delay)
    return () => clearInterval(interval)
  })

  return (
    <NumberFlowGroup>
      <NumberFlow spinTiming={spinTiming} value={ascents} continuous={true} />{' '}
      ascents over{' '}
      <NumberFlow spinTiming={spinTiming} value={days} continuous={true} /> days
    </NumberFlowGroup>
  )
}
