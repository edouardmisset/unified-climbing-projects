import { Settings2 } from 'lucide-react'
import { Link } from '../../link/link'
import { ThemeToggle } from '~/app/_components/theme-toggle/theme-toggle'
import navigationStyles from '../navigation.module.css'
import { UserStatus } from './user-status'
import styles from './navigation-user-section.module.css'

type NavigationUserSectionProps = {
  isDark: boolean
  onToggleTheme: () => void
  onNavigate?: () => void
  settingsHref: string
}

export const NavigationUserSection = ({
  isDark,
  onNavigate,
  onToggleTheme,
  settingsHref,
}: NavigationUserSectionProps) => {
  const handleThemeChange = (_checked: boolean) => {
    onToggleTheme()
  }

  return (
    <li className={styles.user}>
      <hr className={navigationStyles.breakLine} />
      <div className={`${styles.userContent} ${navigationStyles.desktopUserContent}`}>
        <UserStatus userNameClassName={navigationStyles.userName ?? ''} />
      </div>
      <Link
        aria-label='Settings'
        className={navigationStyles.link}
        href={settingsHref}
        onClick={onNavigate}
        title='Settings'
      >
        <span aria-hidden className={navigationStyles.linkIcon}>
          <Settings2 size={18} strokeWidth={1.9} />
        </span>
        <span className={navigationStyles.linkText}>Settings</span>
      </Link>
      <div className={styles.themeToggle}>
        <ThemeToggle checked={!isDark} onChange={handleThemeChange} />
      </div>
    </li>
  )
}
