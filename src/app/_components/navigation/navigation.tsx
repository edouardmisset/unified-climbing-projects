import { Menu } from '@base-ui-components/react/menu'
import { Link, MenuIcon } from 'lucide-react'
import { memo } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import { MobileNavigationItem } from './_components/mobile-navigation-item'
import type { UserStatus } from './_components/user-status'
import { useMediaQuery } from './hooks'
import styles from './navigation.module.css'

export const Navigation = memo(() => {
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <nav className={styles.nav}>
      {isMobile ? (
        <div className={styles.mobileMenu}>
          <Menu.Root openOnHover>
            <Menu.Trigger
              aria-label="navigation"
              className={styles.Button}
              tabIndex={0}
            >
              <MenuIcon />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                <Menu.Popup className={styles.Popup}>
                  <Menu.Arrow className={styles.Arrow}>
                    <Arrow />
                  </Menu.Arrow>
                  <Menu.Item className={styles.Item}>
                    <Link href="/">🏠 Home</Link>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <Link href="/log-ascent">📋 Log Ascent</Link>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <Link href="/log-training-session">📋 Log Training</Link>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <Link href="/visualization">🖼️ Visualization</Link>
                  </Menu.Item>
                  <Menu.Separator className={styles.Separator} />
                  <Menu.Group>
                    <Menu.GroupLabel className={styles.GroupLabel}>
                      🧗 Ascents 🧗
                    </Menu.GroupLabel>
                    <Menu.Item className={styles.Item}>
                      <Link href="/ascents">📇 List</Link>
                    </Menu.Item>
                    <Menu.Item className={styles.Item}>
                      <Link href="/ascents/top-ten">🔟 Top Ten</Link>
                    </Menu.Item>
                    <Menu.Item className={styles.Item}>
                      <Link href="/ascents/dashboard">📊 Dashboard</Link>
                    </Menu.Item>
                  </Menu.Group>
                  <Menu.Separator className={styles.Separator} />
                  <Menu.Group>
                    <Menu.GroupLabel className={styles.GroupLabel}>
                      💪 Training 💪
                    </Menu.GroupLabel>
                    <Menu.Item className={styles.Item}>
                      <Link href="/training-sessions">📇 List</Link>
                    </Menu.Item>
                  </Menu.Group>
                  <Menu.Item
                    className={styles.Item}
                    render={(_props, _state) => (
                      <div className={styles.UserContainer}>
                        <UserStatus />
                      </div>
                    )}
                  />
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        </div>
      ) : (
        <ul className={styles.navList}>
          <li>
            <Link className={styles.link} href="/">
              🏠 Home
            </Link>
          </li>
          <hr className={styles.Break} />
          <li>
            <Link className={styles.link} href="/log-ascent">
              📋 Log Ascent
            </Link>
          </li>
          <li>
            <Link className={styles.link} href="/log-training-session">
              📋 Log Training
            </Link>
          </li>
          <hr className={styles.Break} />
          <li>
            <Link className={styles.link} href="/visualization">
              🖼️ Visualization
            </Link>
          </li>
          <li>
            <Link className={styles.link} href="/ascents">
              📇 Ascents List
            </Link>
          </li>
          <li>
            <Link className={styles.link} href="/ascents/top-ten">
              🔟 Top Ten
            </Link>
          </li>
          <li>
            <Link className={styles.link} href="/ascents/dashboard">
              📊 Dashboard
            </Link>
          </li>
          <hr className={styles.Break} />
          <li>
            <Link className={styles.link} href="/training-sessions">
              📇 Training List
            </Link>
          </li>
          <li className={styles.user}>
            <UserStatus />
          </li>
        </ul>
      )}
    </nav>
  )
})
