import { Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'
import styles from './theme-toggle.module.css'

export function ThemeToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const handleThemeChange = useCallback(() => onChange(!checked), [checked, onChange])

  return (
    <button
      aria-label='Toggle theme'
      className={styles.toggle}
      onClick={handleThemeChange}
      type='button'
    >
      {checked ? <Moon color='var(--text-2)' /> : <Sun color='var(--text-2)' />}
    </button>
  )
}
