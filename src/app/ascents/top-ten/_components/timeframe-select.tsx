import { Select } from '@base-ui-components/react/select'
import { CheckIcon } from '~/app/_components/svg/check/check'
import { ChevronUpDownIcon } from '~/app/_components/svg/chevron-up-down/chevron-up-down'
import { deSlugify } from '~/helpers/de-slugify'
import { useTimeframeQueryState } from '~/hooks/use-timeframe-query-state'
import { timeframes } from '~/schema/generic'
import styles from './timeframe-select.module.css'

export function TimeframeSelect() {
  const { handleTimeframeChange, timeframe } = useTimeframeQueryState()

  return (
    <Select.Root onValueChange={handleTimeframeChange} value={timeframe}>
      <Select.Trigger className={`${styles.Select} self-center`}>
        <Select.Value>{deSlugify(timeframe)}</Select.Value>
        <Select.Icon className={styles.SelectIcon}>
          <ChevronUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className={styles.Positioner} sideOffset={8}>
          <Select.ScrollUpArrow className={styles.ScrollArrow} />
          <Select.Popup className={styles.Popup}>
            {timeframes.map(timeframe => (
              <Select.Item
                className={styles.Item}
                key={timeframe}
                value={timeframe}
              >
                <Select.ItemIndicator className={styles.ItemIndicator}>
                  <CheckIcon className={styles.ItemIndicatorIcon} />
                </Select.ItemIndicator>
                <Select.ItemText className={styles.ItemText}>
                  {deSlugify(timeframe)}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
          <Select.ScrollDownArrow className={styles.ScrollArrow} />
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  )
}
