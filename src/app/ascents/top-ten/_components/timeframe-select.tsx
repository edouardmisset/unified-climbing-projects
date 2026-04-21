'use client'
import { Select } from '@base-ui/react/select'
import { CheckIcon } from '~/shared/components/svg/check/check'
import { ChevronUpDownIcon } from '~/shared/components/svg/chevron-up-down/chevron-up-down'
import { deSlugify } from '~/shared/helpers/de-slugify'
import { useTimeframeQueryState } from '~/shared/hooks/query-state-slices/use-timeframe-query-state'
import { TIMEFRAMES, type Timeframe } from '~/shared/schema'
import baseUiStyles from '~/shared/components/ui/base-ui/base-ui-primitives.module.css'
import styles from './timeframe-select.module.css'

export function TimeframeSelect() {
  const [timeframe, setTimeframe] = useTimeframeQueryState()

  const handleTimeframeChange = async (value: Timeframe | null) => setTimeframe(value)

  return (
    <Select.Root onValueChange={handleTimeframeChange} value={timeframe}>
      <Select.Trigger
        className={`${baseUiStyles.interactiveControl} ${baseUiStyles.neutralControlSurface} ${styles.Select} selfCenter`}
      >
        <Select.Value>{deSlugify(timeframe)}</Select.Value>
        <Select.Icon className={styles.SelectIcon}>
          <ChevronUpDownIcon />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner className={styles.Positioner} sideOffset={8}>
          <Select.ScrollUpArrow className={styles.ScrollArrow} />
          <Select.Popup className={`${baseUiStyles.popupSurface} ${styles.Popup}`}>
            {TIMEFRAMES.map(timeframeOption => (
              <Select.Item
                className={`${baseUiStyles.highlightedItem} ${styles.Item}`}
                key={timeframeOption}
                value={timeframeOption}
              >
                <Select.ItemIndicator className={styles.ItemIndicator}>
                  <CheckIcon className={styles.ItemIndicatorIcon} />
                </Select.ItemIndicator>
                <Select.ItemText className={styles.ItemText}>
                  {deSlugify(timeframeOption)}
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
