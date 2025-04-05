'use client'

import { Menu } from '@base-ui-components/react/menu'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { MenuIcon } from 'lucide-react'
import { SignInButton } from '~/app/_components/sign-in-button/sign-in-button'
import { Link } from '../link/link'
import { Arrow } from '../svg/arrow/arrow'
import styles from './navigation.module.css'

export function Navigation(): React.JSX.Element {
  return (
    <header className={styles.Header}>
      <nav>
        <Menu.Root openOnHover={true}>
          <Menu.Trigger
            className={styles.Button}
            aria-label="navigation"
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
                <Menu.Item
                  className={styles.Item}
                  render={(_props, _state) => (
                    <div className={styles.UserContainer}>
                      <SignedOut>
                        <SignInButton />
                      </SignedOut>
                      <SignedIn>
                        <UserButton />
                      </SignedIn>
                    </div>
                  )}
                />
                <Menu.Item className={styles.Item}>
                  <Link href="/">🏠 Home</Link>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <Link href={'/log-ascent'}>📋 Log Ascent</Link>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <Link href={'/log-training-session'}>📋 Log Training</Link>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <Link href={'/visualization'}>🖼️ Visualization</Link>
                </Menu.Item>
                <Menu.Separator className={styles.Separator} />
                <Menu.Group>
                  <Menu.GroupLabel className={styles.GroupLabel}>
                    🧗 Ascents 🧗
                  </Menu.GroupLabel>
                  <Menu.Item className={styles.Item}>
                    <Link href={'/ascents'}>📇 List</Link>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <Link href={'/ascents/dashboard'}>📊 Dashboard</Link>
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
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </nav>
    </header>
  )
}
