'use client'
import { Drawer } from '@base-ui/react/drawer'
import { PanelLeftClose, PanelLeftOpen, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MobileNavigationTrigger } from './_components/mobile-navigation-trigger'
import { NavigationItem } from './_components/navigation-item'
import { NavigationUserSection } from './_components/navigation-user-section'
import {
  getNavigationItems,
  type NavigationContext,
} from './constants'
import { createNavigationElementKey } from './helpers'
import baseUiStyles from '../ui/base-ui/base-ui-primitives.module.css'
import styles from './navigation.module.css'

type NavigationProps = {
  desktopExpanded: boolean
  onDesktopExpandedChange: (expanded: boolean) => void
  isDark: boolean
  onToggleTheme: () => void
}

type NavigationContextToggleProps = {
  context: NavigationContext
  onContextChange: (context: NavigationContext) => void
}

function NavigationContextToggle({
  context,
  onContextChange,
}: NavigationContextToggleProps) {
  return (
    <li className={styles.contextToggleItem}>
      <div aria-label='Navigation context' className={styles.contextToggle} role='group'>
        <button
          aria-pressed={context === 'ascents'}
          className={styles.contextToggleButton}
          data-active={context === 'ascents'}
          onClick={() => onContextChange('ascents')}
          type='button'
        >
          🧗 Ascents
        </button>
        <button
          aria-pressed={context === 'training'}
          className={styles.contextToggleButton}
          data-active={context === 'training'}
          onClick={() => onContextChange('training')}
          type='button'
        >
          💪 Training
        </button>
      </div>
    </li>
  )
}

export const Navigation = ({
  desktopExpanded,
  onDesktopExpandedChange,
  isDark,
  onToggleTheme,
}: NavigationProps) => {
  const pathname = usePathname()
  const initialContext: NavigationContext = pathname.startsWith('/training-sessions')
    ? 'training'
    : 'ascents'

  const [context, setContext] = useState<NavigationContext>(initialContext)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigationItems = getNavigationItems(context)

  useEffect(() => {
    if (pathname.startsWith('/training-sessions')) {
      setContext('training')
      return
    }

    if (pathname.startsWith('/ascents')) {
      setContext('ascents')
      return
    }

    setContext('ascents')
  }, [pathname])

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

        <ul className={styles.navList} data-mode={desktopMode}>
          <NavigationContextToggle context={context} onContextChange={setContext} />

          {navigationItems.map((item, index) => (
            <NavigationItem
              item={item}
              key={`desktop-${createNavigationElementKey(item, index)}`}
            />
          ))}
          <NavigationUserSection isDark={isDark} onToggleTheme={onToggleTheme} />
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
                <NavigationContextToggle context={context} onContextChange={setContext} />

                {navigationItems.map((item, index) => (
                  <NavigationItem
                    item={item}
                    onNavigate={handleMobileNavigate}
                    key={`mobile-${createNavigationElementKey(item, index)}`}
                  />
                ))}
                <NavigationUserSection isDark={isDark} onToggleTheme={onToggleTheme} />
              </ul>
            </Drawer.Popup>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </nav>
  )
}

Navigation.displayName = 'Navigation'
