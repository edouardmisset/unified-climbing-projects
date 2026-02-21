import { Menu } from '@base-ui/react/menu'
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
      {NAVIGATION_ITEMS.map((item, index) => (
        <DesktopNavigationItem
          index={index}
          item={item}
          // oxlint-disable-next-line react/no-array-index-key -- NAVIGATION_ITEMS is a static constant
          key={`desktop-${createNavigationElementKey(item, index)}`}
        />
      ))}
      <li className={styles.user}>
        <UserStatus />
      </li>
    </ul>

    {/* Mobile hamburger menu */}
    <div className={styles.mobileMenu}>
      <Menu.Root>
        <Menu.Trigger aria-label='navigation' className={styles.Button} openOnHover tabIndex={0}>
          <MenuIcon />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className={styles.Positioner} sideOffset={8}>
            <Menu.Popup className={styles.Popup}>
              <Menu.Arrow className={styles.Arrow}>
                <Arrow />
              </Menu.Arrow>
              {NAVIGATION_ITEMS.map((item, index) => (
                <MobileNavigationItem
                  index={index}
                  item={item}
                  // oxlint-disable-next-line react/no-array-index-key -- NAVIGATION_ITEMS is a static constant
                  key={`mobile-${createNavigationElementKey(item, index)}`}
                />
              ))}
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
