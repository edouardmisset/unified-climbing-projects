import { Link as NextLink } from 'next-view-transitions'
import { memo, type ReactNode } from 'react'
import styles from './link.module.css'

export const Link = memo(
  ({ href, children, ...props }: { children: ReactNode; href: string }) => {
    return (
      <NextLink href={href} {...props} className={styles.Link} prefetch={true}>
        {children}
      </NextLink>
    )
  },
)
