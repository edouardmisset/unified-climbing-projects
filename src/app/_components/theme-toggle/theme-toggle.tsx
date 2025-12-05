import { Moon, Sun } from 'lucide-react'
import { useCallback } from 'react'

export function ThemeToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  const handleThemeChange = useCallback(
    () => onChange(!checked),
    [checked, onChange],
  )

  return (
    <button onClick={handleThemeChange} type="button">
      {checked ? (
        <Moon color={'var(--text-2)'} />
      ) : (
        <Sun color={'var(--text-2)'} />
      )}
    </button>
  )
}
