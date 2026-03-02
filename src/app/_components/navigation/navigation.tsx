'use client'
import { Menu } from '@base-ui/react/menu'
import { MenuIcon } from 'lucide-react'
import { memo } from 'react'
import { Arrow } from '../svg/arrow/arrow'
import { NavigationItem } from './_components/navigation-item'
import { UserStatus } from './_components/user-status'
import { NAVIGATION_ITEMS } from './constants'
import { createNavigationElementKey } from './helpers'
import baseUiStyles from '../ui/base-ui/base-ui-primitives.module.css'
import styles from './navigation.module.css'

export const Navigation = memo(() => (
  <nav className={styles.nav}>
    {/* Desktop full menu - visible by CSS when viewport is wide */}
    <ul className={styles.navList}>
      {NAVIGATION_ITEMS.map((item, index) => (
        <NavigationItem
          item={item}
          mode='desktop'
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
        <Menu.Trigger
          aria-label='navigation'
          className={`${baseUiStyles.interactiveControl} ${baseUiStyles.neutralControlSurface} ${styles.Button}`}
          openOnHover
          tabIndex={0}
        >
          <MenuIcon />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner className={styles.Positioner} sideOffset={8}>
            <Menu.Popup className={`${baseUiStyles.popupSurface} ${styles.Popup}`}>
              <Menu.Arrow className={baseUiStyles.popupArrow}>
                <Arrow />
              </Menu.Arrow>
              {NAVIGATION_ITEMS.map((item, index) => (
                <NavigationItem
                  item={item}
                  mode='mobile'
                  // oxlint-disable-next-line react/no-array-index-key -- NAVIGATION_ITEMS is a static constant
                  key={`mobile-${createNavigationElementKey(item, index)}`}
                />
              ))}
              <Menu.Separator className={styles.Separator} />
              <Menu.Item
                className={`${baseUiStyles.highlightedItem} ${styles.Item}`}
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
