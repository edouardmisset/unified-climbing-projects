import type { Ascent } from '~/schema/ascent'
import { formatCountWithEnglishNoun } from '~/helpers/format-plurals'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'

type DaysOutsideDetailsProps = {
  ascents: Ascent[]
  ascentsRatio: string
  daysOutside: number
}

export function DaysOutsideDetails(props: DaysOutsideDetailsProps) {
  const { ascents, ascentsRatio, daysOutside } = props

  return (
    <span className='block'>
      You climbed <AscentsWithPopover ascents={ascents} /> in{' '}
      <strong>
        {formatCountWithEnglishNoun(daysOutside, {
          one: 'day',
          other: 'days',
        })}
      </strong>{' '}
      (<strong>{ascentsRatio}</strong> ascents per day outside)
    </span>
  )
}
