import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import { memo, useMemo } from 'react'
import styles from './toggle-group.module.css'

type ToggleGroupProps<T extends string> = {
  values: readonly T[]
  onValueChange: (
    groupValue: unknown[],
    event: BaseToggleGroup.ChangeEventDetails,
  ) => void
  selectedValue: T
}

export const ToggleGroup = memo(
  <T extends string>({
    values,
    onValueChange,
    selectedValue,
  }: ToggleGroupProps<T>) => {
    const memoizedValue = useMemo(() => [selectedValue], [selectedValue])
    return (
      <BaseToggleGroup
        className={styles.panel}
        onValueChange={onValueChange}
        value={memoizedValue}
      >
        {values.map(value => (
          <Toggle
            aria-label={value}
            className={`contrastColor ${styles.button}`}
            key={value}
            value={value}
          >
            {value}
          </Toggle>
        ))}
      </BaseToggleGroup>
    )
  },
)
