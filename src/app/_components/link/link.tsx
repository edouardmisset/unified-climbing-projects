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
  >) => (
    <NextLink
      href={href}
      {...props}
      className={`${styles.Link} ${className}`}
      prefetch={true}
    >
      {children}
    </NextLink>
  ),
)
