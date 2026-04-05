import { useCallback } from 'react'
import { ThemeToggle } from '~/app/_components/theme-toggle/theme-toggle'
import navigationStyles from '../navigation.module.css'
import { UserStatus } from './user-status'
import styles from './navigation-user-section.module.css'

type NavigationUserSectionProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export const NavigationUserSection = ({ isDark, onToggleTheme }: NavigationUserSectionProps) => {
  const handleThemeChange = useCallback((_checked: boolean) => onToggleTheme(), [onToggleTheme])

  return (
    <li className={styles.user}>
      <hr className={navigationStyles.breakLine} />
      <div className={styles.userContent}>
        <UserStatus />
      </div>
      <div className={styles.themeToggle}>
        <ThemeToggle checked={!isDark} onChange={handleThemeChange} />
      </div>
    </li>
  )
}
