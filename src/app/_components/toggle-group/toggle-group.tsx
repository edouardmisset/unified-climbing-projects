import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup as BaseToggleGroup } from '@base-ui-components/react/toggle-group'
import { memo } from 'react'
import styles from './toggle-group.module.css'

type ToggleGroupProps<T extends string> = {
  values: readonly T[]
  onValueChange: (groupValue: unknown[], event: Event) => void
  selectedValue: T
}

export const ToggleGroup = memo(
  <T extends string>({
    values,
    onValueChange,
    selectedValue,
  }: ToggleGroupProps<T>) => (
    <BaseToggleGroup
      value={[selectedValue]}
      className={styles.Panel}
      onValueChange={onValueChange}
    >
      {values.map(value => (
        <Toggle
          key={value}
          aria-label={value}
          value={value}
          className={`contrast-color ${styles.Button}`}
        >
          {value}
        </Toggle>
      ))}
    </BaseToggleGroup>
  ),
)
