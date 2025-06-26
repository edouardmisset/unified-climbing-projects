'use client'

import { Menu } from '@base-ui-components/react/menu'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { MenuIcon } from 'lucide-react'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button'
import { Link } from '../link/link'
import { Arrow } from '../svg/arrow/arrow'
import styles from './navigation.module.css'

export function Navigation(): React.JSX.Element {
  const { user } = useUser()

  return (
    <nav className={styles.nav}>
      {/* Desktop full menu - visible by CSS when viewport is wide */}
      <ul className={styles.navList}>
        <li>
          <Link href="/">🏠 Home</Link>
        </li>
        <hr className={styles.Break} />
        <li>
          <Link href="/log-ascent">📋 Log Ascent</Link>
        </li>
        <li>
          <Link href="/log-training-session">📋 Log Training</Link>
        </li>
        <hr className={styles.Break} />
        <li>
          <Link href="/visualization">🖼️ Visualization</Link>
        </li>
        <li>
          <Link href="/ascents">📇 Ascents List</Link>
        </li>
        <li>
          <Link href="/ascents/top-ten">🔟 Top Ten</Link>
        </li>
        <li>
          <Link href="/ascents/dashboard">📊 Dashboard</Link>
        </li>
        <hr className={styles.Break} />
        <li>
          <Link href="/training-sessions">📇 Training List</Link>
        </li>
        <li className={styles.user}>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton /> {user?.fullName}
          </SignedIn>
        </li>
      </ul>

      {/* Mobile hamburger menu */}
      <div className={styles.mobileMenu}>
        <Menu.Root openOnHover={true}>
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
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <UserButton /> {user?.fullName}
                      </SignedIn>
                    </div>
                  )}
                />
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </nav>
  )
}
