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
      className={`${styles.toggle} ${checked ? styles.isDark : styles.isLight}`}
      onClick={handleThemeChange}
      type='button'
    >
      <Sun className={`${styles.icon} ${styles.sun}`} />
      <Moon className={`${styles.icon} ${styles.moon}`} />
    </button>
  )
}
