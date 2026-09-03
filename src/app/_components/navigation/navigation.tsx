'use client'
import { Drawer } from '@base-ui/react/drawer'
import { PanelLeftClose, PanelLeftOpen, XIcon } from 'lucide-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { getDomainFromPathname } from '~/constants/domain'
import { getDomainLinks } from '~/constants/links'
import { DomainModeToggle } from './_components/domain-mode-toggle'
import { MobileNavigationTrigger } from './_components/mobile-navigation-trigger'
import { NavigationItem } from './_components/navigation-item'
import { NavigationUserSection } from './_components/navigation-user-section'
import { getNavigationItems } from './constants'
import { createNavigationElementKey } from './helpers'
import baseUiStyles from '../ui/base-ui/base-ui-primitives.module.css'
import styles from './navigation.module.css'

type NavigationProps = {
  desktopExpanded: boolean
  onDesktopExpandedChange: (expanded: boolean) => void
  isDark: boolean
  onToggleTheme: () => void
}

export const Navigation = ({
  desktopExpanded,
  onDesktopExpandedChange,
  isDark,
  onToggleTheme,
}: NavigationProps) => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const domain = getDomainFromPathname(pathname) ?? 'ascents'
  const navigationItems = getNavigationItems(domain)
  const settingsHref = getDomainLinks(domain).settings

  const desktopMode = desktopExpanded ? 'desktop-expanded' : 'desktop-collapsed'

  const handleDesktopToggle = () => {
    onDesktopExpandedChange(!desktopExpanded)
  }

  const handleMobileNavigate = () => {
    setMobileOpen(false)
  }

  const desktopToggleLabel = desktopExpanded
    ? 'Collapse navigation drawer'
    : 'Expand navigation drawer'

  return (
    <nav
      aria-label='Primary navigation'
      className={styles.nav}
      data-desktop-expanded={desktopExpanded}
    >
      <div className={styles.desktopRail}>
        <div className={styles.railHeader}>
          <button
            aria-expanded={desktopExpanded}
            aria-label={desktopToggleLabel}
            className={`${baseUiStyles.interactiveControl} ${baseUiStyles.neutralControlSurface} ${styles.desktopToggle}`}
            onClick={handleDesktopToggle}
            type='button'
          >
            <span aria-hidden className={styles.toggleIcon}>
              {desktopExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </span>
          </button>
        </div>

        <ul className={styles.navList} data-mode={desktopMode}>
          <DomainModeToggle />
          {navigationItems.map((item, index) => (
            <NavigationItem
              item={item}
              key={`desktop-${createNavigationElementKey(item, index)}`}
            />
          ))}
          <NavigationUserSection
            isDark={isDark}
            onToggleTheme={onToggleTheme}
            settingsHref={settingsHref}
          />
        </ul>
      </div>

      <div className={styles.mobileMenu}>
        <Drawer.Root onOpenChange={setMobileOpen} open={mobileOpen} swipeDirection='left'>
          <MobileNavigationTrigger open={mobileOpen} />
          <Drawer.SwipeArea className={styles.drawerSwipeArea} />
          <Drawer.Portal>
            <Drawer.Backdrop
              className={`${baseUiStyles.overlayBackdrop} ${styles.drawerBackdrop}`}
            />
            <Drawer.Popup className={`${styles.drawerPopup} ${styles.drawerContent}`}>
              <div className={styles.drawerHeader}>
                <Drawer.Title className={styles.drawerTitle}>Navigation</Drawer.Title>
                <Drawer.Close
                  aria-label='Close navigation drawer'
                  className={`${baseUiStyles.interactiveControl} ${baseUiStyles.centeredControl} ${baseUiStyles.neutralControlSurface} ${styles.drawerClose}`}
                >
                  <XIcon size={18} />
                </Drawer.Close>
              </div>

              <ul className={styles.navList} data-mode='mobile'>
                <DomainModeToggle onNavigate={handleMobileNavigate} />
                {navigationItems.map((item, index) => (
                  <NavigationItem
                    item={item}
                    onNavigate={handleMobileNavigate}
                    key={`mobile-${createNavigationElementKey(item, index)}`}
                  />
                ))}
                <NavigationUserSection
                  isDark={isDark}
                  onNavigate={handleMobileNavigate}
                  onToggleTheme={onToggleTheme}
                  settingsHref={settingsHref}
                />
              </ul>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </nav>
  )
}

Navigation.displayName = 'Navigation'
