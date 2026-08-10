'use client'
import type { ChangeEventHandler } from 'react'
import customSelectStyles from '~/app/_components/custom-select/custom-select.module.css'
import { deSlugify } from '~/helpers/de-slugify'
import { useTimeframeQueryState } from '~/hooks/query-state-slices/use-timeframe-query-state'
import { TIMEFRAMES, type Timeframe } from '~/schema/generic'

export function TimeframeSelect() {
  const [timeframe, setTimeframe] = useTimeframeQueryState()

  const handleTimeframeChange: ChangeEventHandler<HTMLSelectElement> = event => {
    void setTimeframe(event.currentTarget.value as Timeframe)
  }

  return (
    <select
      aria-label='Timeframe'
      className={`${customSelectStyles.select} selfCenter`}
      onChange={handleTimeframeChange}
      value={timeframe}
    >
      {TIMEFRAMES.map(timeframeOption => (
        <option key={timeframeOption} value={timeframeOption}>
          {deSlugify(timeframeOption)}
        </option>
      ))}
    </select>
  )
}
