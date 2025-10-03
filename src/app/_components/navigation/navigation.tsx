import { Menu } from '@base-ui-components/react/menu'
import { MenuIcon } from 'lucide-react'
import { memo } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import { DesktopNavigationItem } from './_components/desktop-navigation-item'
import { MobileNavigationItem } from './_components/mobile-navigation-item'
import { UserStatus } from './_components/user-status'
import { NAVIGATION_ITEMS } from './constants'
import { createNavigationElementKey } from './helpers'
import styles from './navigation.module.css'

export const Navigation = memo(() => (
  <nav className={styles.nav}>
    {/* Desktop full menu - visible by CSS when viewport is wide */}
    <ul className={styles.navList}>
      {NAVIGATION_ITEMS.map((item, index) => {
        const key = createNavigationElementKey(item, index)
        return (
          <DesktopNavigationItem
            index={index}
            item={item}
            key={`desktop-${key}`}
          />
        )
      })}
      <li className={styles.user}>
        <UserStatus />
      </li>
    </ul>

    {/* Mobile hamburger menu */}
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
              {NAVIGATION_ITEMS.map((item, index) => {
                const key = createNavigationElementKey(item, index)
                return (
                  <MobileNavigationItem
                    index={index}
                    item={item}
                    key={`mobile-${key}`}
                  />
                )
              })}
              <Menu.Separator className={styles.Separator} />
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
  </nav>
))
