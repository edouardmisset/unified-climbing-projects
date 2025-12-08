'use client'

import { usePathname } from 'next/navigation'
import { Link as NextLink } from 'next-view-transitions'
import { memo, type ReactNode } from 'react'
import styles from './link.module.css'

export const Link = memo(
  ({
    href,
    children,
    className,
    ...props
  }: { children: ReactNode; href: string } & React.ComponentProps<
    typeof NextLink
  >) => {
    const pathname = usePathname()
    const isActive =
      pathname === href ||
      (pathname.includes('visualization') && href.includes('visualization'))

    return (
      <NextLink
        href={href}
        {...props}
        className={`${styles.link} ${isActive ? styles.active : ''} ${className ?? ''}`}
        prefetch
      >
        {children}
      </NextLink>
    )
  },
)
