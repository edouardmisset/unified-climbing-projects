'use client'

import { Link as NextLink } from 'next-view-transitions'
import type React from 'react'

import { Menu } from '@base-ui-components/react/menu'

import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { MenuIcon } from 'lucide-react'
import styles from './navigation.module.css'

const Link = ({
  href,
  children,
  ...props
}: { children: React.ReactNode; href: string }) => {
  return (
    <NextLink href={href} {...props} prefetch={true} className={styles.Link}>
      {children}
    </NextLink>
  )
}

export function Navigation() {
  return (
    <header className={styles.Header}>
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
                <ArrowSvg />
              </Menu.Arrow>
              <Menu.Item
                className={styles.Item}
                render={
                  <>
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton />
                    </SignedIn>
                  </>
                }
              />
              <Menu.Item className={styles.Item}>
                <Link href="/">🏠 Home</Link>
              </Menu.Item>
              <Menu.Item className={styles.Item}>
                <Link href={'/log-ascent'}>📋 Log Ascent</Link>
              </Menu.Item>
              <Menu.Item className={styles.Item}>
                <Link href={'/log-training'}>📋 Log Training</Link>
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
                  <Link href={'/ascents'}>Table</Link>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <Link href={'/ascents/dashboard'}>Dashboard</Link>
                </Menu.Item>
              </Menu.Group>
              <Menu.Separator className={styles.Separator} />
              <Menu.Group>
                <Menu.GroupLabel className={styles.GroupLabel}>
                  💪 Training 💪
                </Menu.GroupLabel>
              </Menu.Group>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </header>
  )
}

function ArrowSvg(props: React.ComponentProps<'svg'>) {
  return (
    <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
      <title>Arrow Icon</title>
      <path
        d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
        className={styles.ArrowFill}
      />
      <path
        d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
        className={styles.ArrowOuterStroke}
      />
      <path
        d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
        className={styles.ArrowInnerStroke}
      />
    </svg>
  )
}
