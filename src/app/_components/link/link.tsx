'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import styles from './link.module.css'

export const Link = ({
  href,
  children,
  className,
  ...props
}: { children: ReactNode; href: string } & React.ComponentProps<typeof NextLink>) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <NextLink
      href={href}
      {...props}
      className={`${styles.link} ${isActive ? styles.active : ''} ${className ?? ''}`}
      data-active={isActive}
    >
      {children}
    </NextLink>
  )
}
