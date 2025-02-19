import { Toggle } from '@base-ui-components/react/toggle'
import { ToggleGroup } from '@base-ui-components/react/toggle-group'
import {
  type VisualizationType,
  visualizations,
} from '~/app/visualization/constants'
import styles from './visualization-toggle-group.module.css'

type VisualizationToggleGroupProps = {
  values?: readonly VisualizationType[]
  onValueChange: (groupValue: unknown[], event: Event) => void
}

export default function VisualizationToggleGroup({
  values = visualizations,
  onValueChange,
}: VisualizationToggleGroupProps) {
  return (
    <ToggleGroup
      defaultValue={[values[0]]}
      className={styles.Panel}
      onValueChange={onValueChange}
    >
      {values.map(value => (
        <Toggle
          key={value}
          aria-label={value}
          value={value}
          className={styles.Button}
        >
          {value}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
