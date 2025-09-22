import { Moon, Sun } from 'lucide-react'
import { Switch } from '../switch/switch'
import styles from './light-dark-switch.module.css'

export function LightDarkSwitch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className={styles.label} htmlFor="light-dark-switch">
      <span>
        <Sun color={checked ? 'var(--text-2)' : 'var(--accent)'} />
      </span>
      <Switch
        aria-label="Toggle light/dark mode"
        checked={checked}
        className={styles.switch}
        onCheckedChange={onChange}
      />
      <span>
        <Moon color={checked ? 'var(--accent)' : 'var(--text-2)'} />
      </span>
    </label>
  )
}
